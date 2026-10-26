
import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin/auth";

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> },
) {
    try {
        const { supabase, user, isAdmin } = await getAdminSession();
        if (!user) {
            return NextResponse.json(
                { error: "Unauthorized." },
                { status: 401 },
            );
        }

        if (!isAdmin) {
            return NextResponse.json(
                { error: "Forbidden." },
                { status: 403 },
            );
        }

        const { id } = await params;
        const body = await request.json();

        const allowed = [
            "publish",
            "reject",
            "unpublish",
            "soft-delete",
            "recover",
        ];

        if (!allowed.includes(body.action)) {
            return NextResponse.json(
                { error: "Invalid action." },
                { status: 400 },
            );
        }

        const { data, error } = await supabase.rpc(
            "admin_moderate_wallpaper",
            {
                p_wallpaper_id: id,
                p_action: body.action,
            },
        );

        if (error) {
            return NextResponse.json(
                { error: error.message },
                { status: 400 },
            );
        }

        return NextResponse.json({ wallpaper: data });
    } catch {
        return NextResponse.json(
            { error: "Unable to process moderation request." },
            { status: 500 },
        );
    }
}
