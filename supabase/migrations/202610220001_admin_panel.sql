
-- Review this migration in staging before production.
-- Existing project policies and grants may differ.

BEGIN;

-- =========================================================
-- 1. WALLPAPER MODERATION COLUMNS
-- =========================================================

ALTER TABLE public.wallpapers
  ADD COLUMN IF NOT EXISTS deleted_at timestamptz;

ALTER TABLE public.wallpapers
  ADD COLUMN IF NOT EXISTS deleted_by uuid REFERENCES auth.users(id);

ALTER TABLE public.wallpapers
  ADD COLUMN IF NOT EXISTS deletion_reason text;

ALTER TABLE public.wallpapers
  ADD COLUMN IF NOT EXISTS reviewed_at timestamptz;

ALTER TABLE public.wallpapers
  ADD COLUMN IF NOT EXISTS reviewed_by uuid REFERENCES auth.users(id);

ALTER TABLE public.wallpapers
  ADD COLUMN IF NOT EXISTS rejection_reason text;


-- =========================================================
-- 2. ADMIN AUDIT LOG TABLE AND PERMISSIONS
-- =========================================================

CREATE TABLE IF NOT EXISTS public.admin_audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id uuid NOT NULL REFERENCES auth.users(id),
  action text NOT NULL,
  entity_type text NOT NULL,
  entity_id uuid,
  details jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Remove direct client permissions before granting the minimum required.
REVOKE ALL ON TABLE public.admin_audit_logs FROM anon;
REVOKE ALL ON TABLE public.admin_audit_logs FROM authenticated;

ALTER TABLE public.admin_audit_logs ENABLE ROW LEVEL SECURITY;

-- Authenticated clients may read only when the RLS policy allows it.
GRANT SELECT ON TABLE public.admin_audit_logs TO authenticated;

DROP POLICY IF EXISTS "Admins can read audit logs"
ON public.admin_audit_logs;

CREATE POLICY "Admins can read audit logs"
ON public.admin_audit_logs
FOR SELECT
TO authenticated
USING (
  (SELECT auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
);


-- =========================================================
-- 3. WALLPAPER ROW READ POLICIES
-- =========================================================

-- Admins can view all wallpapers, including pending and deleted ones.
DROP POLICY IF EXISTS "Admins can view all wallpapers"
ON public.wallpapers;

CREATE POLICY "Admins can view all wallpapers"
ON public.wallpapers
FOR SELECT
TO authenticated
USING (
  (SELECT auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
);


-- Public users can view published, non-deleted wallpapers.
DROP POLICY IF EXISTS "Anyone can view published wallpapers"
ON public.wallpapers;

CREATE POLICY "Anyone can view published wallpapers"
ON public.wallpapers
FOR SELECT
TO anon, authenticated
USING (
  status = 'published'
  AND deleted_at IS NULL
);


-- Creators can view their own non-deleted submissions.
DROP POLICY IF EXISTS "Creators can view their own submissions"
ON public.wallpapers;

CREATE POLICY "Creators can view their own submissions"
ON public.wallpapers
FOR SELECT
TO authenticated
USING (
  creator_id = (SELECT auth.uid())
  AND deleted_at IS NULL
);


-- =========================================================
-- 4. STORAGE OBJECT READ POLICY
-- =========================================================

-- Replace the old creator-read policy and our previous policy.
DROP POLICY IF EXISTS "Creators can view their own wallpaper files"
ON storage.objects;

DROP POLICY IF EXISTS "Owners admins and published viewers can read wallpaper objects"
ON storage.objects;

CREATE POLICY "Owners admins and published viewers can read wallpaper objects"
ON storage.objects
FOR SELECT
TO anon, authenticated
USING (
  bucket_id = 'wallpapers'
  AND (
    (
      (storage.foldername(name))[1] = (SELECT auth.uid())::text
      AND EXISTS (
        SELECT 1
        FROM public.wallpapers AS w
        WHERE w.image_path = name
          AND w.creator_id = (SELECT auth.uid())
          AND w.deleted_at IS NULL
      )
    )
    OR
    (SELECT auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
    OR EXISTS (
      SELECT 1
      FROM public.wallpapers AS w
      WHERE w.image_path = name
        AND w.status = 'published'
        AND w.deleted_at IS NULL
    )
  )
);


-- =========================================================
-- 5. STORAGE UPLOAD POLICY
-- =========================================================

DROP POLICY IF EXISTS "Creators upload to their own folder"
ON storage.objects;

CREATE POLICY "Creators upload to their own folder"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'wallpapers'
  AND (storage.foldername(name))[1] = (SELECT auth.uid())::text
);


-- =========================================================
-- 6. STORAGE UPDATE POLICY
-- =========================================================

DROP POLICY IF EXISTS "Creators update their own files"
ON storage.objects;

CREATE POLICY "Creators update their own files"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'wallpapers'
  AND (storage.foldername(name))[1] = (SELECT auth.uid())::text
)
WITH CHECK (
  bucket_id = 'wallpapers'
  AND (storage.foldername(name))[1] = (SELECT auth.uid())::text
);


-- =========================================================
-- 7. STORAGE DELETE POLICY
-- =========================================================

DROP POLICY IF EXISTS "Creators delete their own files"
ON storage.objects;

CREATE POLICY "Creators delete their own files"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'wallpapers'
  AND (storage.foldername(name))[1] = (SELECT auth.uid())::text
);


-- =========================================================
-- 8. ADMIN WALLPAPER MODERATION FUNCTION
-- =========================================================

CREATE OR REPLACE FUNCTION public.admin_moderate_wallpaper(
  p_wallpaper_id uuid,
  p_action text
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
DECLARE
  v_actor uuid := auth.uid();
  v_row public.wallpapers%ROWTYPE;
BEGIN
  -- Require an authenticated user with a trusted admin claim.
  IF v_actor IS NULL
     OR (auth.jwt() -> 'app_metadata' ->> 'role') IS DISTINCT FROM 'admin'
  THEN
    RAISE EXCEPTION 'Admin access required'
      USING ERRCODE = '42501';
  END IF;

  -- Allow only known moderation actions.
  IF p_action IS NULL
     OR p_action NOT IN (
       'publish',
       'reject',
       'unpublish',
       'soft-delete',
       'recover'
     )
  THEN
    RAISE EXCEPTION 'Invalid moderation action'
      USING ERRCODE = '22023';
  END IF;

  -- Lock the row to prevent concurrent moderation changes.
  SELECT *
  INTO v_row
  FROM public.wallpapers
  WHERE id = p_wallpaper_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Wallpaper not found'
      USING ERRCODE = 'P0002';
  END IF;

  -- Deleted wallpapers must be recovered before other actions.
  IF v_row.deleted_at IS NOT NULL
     AND p_action <> 'recover'
  THEN
    RAISE EXCEPTION 'Recover the wallpaper before moderating it'
      USING ERRCODE = 'P0001';
  END IF;

  IF p_action = 'publish' THEN

    UPDATE public.wallpapers
    SET status = 'published',
        reviewed_at = now(),
        reviewed_by = v_actor,
        rejection_reason = NULL
    WHERE id = p_wallpaper_id
    RETURNING * INTO v_row;

  ELSIF p_action = 'reject' THEN

    UPDATE public.wallpapers
    SET status = 'rejected',
        reviewed_at = now(),
        reviewed_by = v_actor,
        rejection_reason = COALESCE(
          rejection_reason,
          'Rejected by admin'
        )
    WHERE id = p_wallpaper_id
    RETURNING * INTO v_row;

  ELSIF p_action = 'unpublish' THEN

    UPDATE public.wallpapers
    SET status = 'pending',
        reviewed_at = now(),
        reviewed_by = v_actor
    WHERE id = p_wallpaper_id
    RETURNING * INTO v_row;

  ELSIF p_action = 'soft-delete' THEN

    UPDATE public.wallpapers
    SET deleted_at = now(),
        deleted_by = v_actor,
        deletion_reason = 'Soft-deleted by admin'
    WHERE id = p_wallpaper_id
      AND deleted_at IS NULL
    RETURNING * INTO v_row;

    IF NOT FOUND THEN
      RAISE EXCEPTION 'Wallpaper is already deleted'
        USING ERRCODE = 'P0001';
    END IF;

  ELSIF p_action = 'recover' THEN

    UPDATE public.wallpapers
    SET deleted_at = NULL,
        deleted_by = NULL,
        deletion_reason = NULL
    WHERE id = p_wallpaper_id
      AND deleted_at IS NOT NULL
    RETURNING * INTO v_row;

    IF NOT FOUND THEN
      RAISE EXCEPTION 'Wallpaper is not deleted'
        USING ERRCODE = 'P0001';
    END IF;

  END IF;

  -- Record the successful moderation action.
  INSERT INTO public.admin_audit_logs (
    actor_id,
    action,
    entity_type,
    entity_id,
    details
  )
  VALUES (
    v_actor,
    p_action,
    'wallpaper',
    p_wallpaper_id,
    jsonb_build_object(
      'title', v_row.title,
      'status', v_row.status,
      'deleted_at', v_row.deleted_at
    )
  );

  RETURN jsonb_build_object(
    'id', v_row.id,
    'title', v_row.title,
    'status', v_row.status,
    'deleted_at', v_row.deleted_at
  );
END;
$function$;


-- =========================================================
-- 9. MODERATION FUNCTION EXECUTION PERMISSIONS
-- =========================================================

REVOKE ALL
ON FUNCTION public.admin_moderate_wallpaper(uuid, text)
FROM PUBLIC;

REVOKE ALL
ON FUNCTION public.admin_moderate_wallpaper(uuid, text)
FROM anon;

GRANT EXECUTE
ON FUNCTION public.admin_moderate_wallpaper(uuid, text)
TO authenticated;


COMMIT;
