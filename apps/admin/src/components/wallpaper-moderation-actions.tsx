
"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Check,
  CheckCircle2,
  LoaderCircle,
  LockKeyhole,
  ShieldCheck,
  Sparkles,
  X,
  XCircle,
} from "lucide-react";

type Action = "publish" | "reject";

type Props = {
  wallpaperId: string;
  wallpaperTitle: string;
};

export function WallpaperModerationActions({
  wallpaperId,
  wallpaperTitle,
}: Props) {
  const router = useRouter();

  const [selectedAction, setSelectedAction] = useState<Action | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const isApproval = selectedAction === "publish";

  // Handle Escape to close the modal.
  useEffect(() => {
    if (!selectedAction || loading) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setSelectedAction(null);
        setErrorMessage("");
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedAction, loading]);

  // Prevent background scrolling while the modal is open.
  useEffect(() => {
    if (!selectedAction) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [selectedAction]);

  async function handleModeration() {
    if (!selectedAction || loading) return;

    setLoading(true);
    setErrorMessage("");

    try {
      const response = await fetch(
        `/api/admin/wallpapers/${wallpaperId}/review`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: selectedAction }),
        },
      );

      const result = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          result?.error || "Unable to complete this moderation action.",
        );
      }

      setSuccessMessage(
        selectedAction === "publish"
          ? "Wallpaper approved successfully."
          : "Wallpaper rejected successfully.",
      );

      router.refresh();

      window.setTimeout(() => {
        setSelectedAction(null);
        setSuccessMessage("");
      }, 1300);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  function openModal(action: Action) {
    setSelectedAction(action);
    setErrorMessage("");
    setSuccessMessage("");
  }

  function closeModal() {
    if (loading) return;

    setSelectedAction(null);
    setErrorMessage("");
    setSuccessMessage("");
  }

  return (
    <>
      <div className="flex min-w-0 flex-1 gap-2">
        <button
          type="button"
          onClick={() => openModal("publish")}
          className="group inline-flex min-w-0 flex-1 items-center justify-center gap-1.5 rounded-lg border border-[#B9F56B]/20 bg-[#B9F56B]/10 px-3 py-2 text-xs font-semibold text-[#B9F56B] transition duration-300 hover:-translate-y-0.5 hover:border-[#B9F56B]/50 hover:bg-[#B9F56B]/20 hover:shadow-[0_0_20px_rgba(185,245,107,0.16)]"
        >
          <CheckCircle2
            size={14}
            className="transition-transform duration-300 group-hover:scale-110"
          />
          Approve
        </button>

        <button
          type="button"
          onClick={() => openModal("reject")}
          className="group inline-flex min-w-0 flex-1 items-center justify-center gap-1.5 rounded-lg border border-rose-400/20 bg-rose-400/[0.04] px-3 py-2 text-xs font-semibold text-rose-300 transition duration-300 hover:-translate-y-0.5 hover:border-rose-400/50 hover:bg-rose-400/10 hover:shadow-[0_0_20px_rgba(251,113,133,0.14)]"
        >
          <XCircle
            size={14}
            className="transition-transform duration-300 group-hover:scale-110"
          />
          Reject
        </button>
      </div>

      {selectedAction &&
        createPortal(
          <div
            className="moderation-backdrop fixed inset-0 z-[9999] flex items-center justify-center overflow-y-auto p-4 sm:p-6"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) closeModal();
            }}
          >
            <section
              role="dialog"
              aria-modal="true"
              aria-labelledby="moderation-title"
              aria-describedby="moderation-description"
              className={`moderation-modal relative my-auto w-full max-w-[440px] overflow-hidden rounded-[28px] border bg-[#0A1110]/95 shadow-2xl ${
                isApproval
                  ? "moderation-modal-approval border-[#B9F56B]/25"
                  : "moderation-modal-rejection border-rose-400/30"
              }`}
            >
              {/* Animated ambient lighting */}
              <div
                aria-hidden="true"
                className={`modal-ambient pointer-events-none absolute -top-28 left-1/2 h-64 w-80 -translate-x-1/2 rounded-full blur-[85px] ${
                  isApproval ? "bg-[#B9F56B]/25" : "bg-rose-500/25"
                }`}
              />

              <div
                aria-hidden="true"
                className={`modal-accent absolute inset-x-0 top-0 h-px ${
                  isApproval
                    ? "bg-gradient-to-r from-transparent via-[#B9F56B] to-transparent"
                    : "bg-gradient-to-r from-transparent via-rose-400 to-transparent"
                }`}
              />

              {/* Header */}
              <div className="relative flex items-center justify-between border-b border-white/[0.08] px-5 py-4 sm:px-6">
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-xl border border-[#B9F56B]/20 bg-[#B9F56B]/10 text-[#B9F56B]">
                    <ShieldCheck size={20} />
                  </span>

                  <div>
                    <p className="text-sm font-bold tracking-wide text-white">
                      Vigniti Moderation
                    </p>
                    <p className="mt-1 text-[10px] tracking-[0.16em] text-slate-500">
                      CONTENT REVIEW SYSTEM
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={closeModal}
                  disabled={loading}
                  aria-label="Close confirmation"
                  className="grid h-9 w-9 place-items-center rounded-xl border border-white/[0.09] text-slate-400 transition hover:rotate-90 hover:border-white/20 hover:bg-white/[0.06] hover:text-white disabled:opacity-40"
                >
                  <X size={17} />
                </button>
              </div>

              {/* Main content */}
              <div className="relative px-5 pb-6 pt-7 text-center sm:px-8 sm:pb-7">
                <div className="modal-icon-wrap relative mx-auto mb-6 grid h-[96px] w-[96px] place-items-center">
                  <div
                    className={`modal-icon-ring absolute inset-0 rounded-[30px] border ${
                      isApproval
                        ? "border-[#B9F56B]/30 bg-[#B9F56B]/[0.05]"
                        : "border-rose-400/30 bg-rose-400/[0.05]"
                    }`}
                  />

                  <div
                    className={`absolute inset-2 rounded-[24px] border ${
                      isApproval
                        ? "border-[#B9F56B]/15"
                        : "border-rose-400/15"
                    }`}
                  />

                  <span
                    className={`relative grid h-14 w-14 place-items-center rounded-2xl ${
                      successMessage
                        ? "bg-[#B9F56B] text-[#10180A]"
                        : isApproval
                          ? "bg-[#B9F56B] text-[#10180A] shadow-[0_0_38px_rgba(185,245,107,0.30)]"
                          : "bg-rose-400 text-[#21070D] shadow-[0_0_38px_rgba(251,113,133,0.25)]"
                    }`}
                  >
                    {successMessage ? (
                      <Check size={29} strokeWidth={2.5} />
                    ) : isApproval ? (
                      <CheckCircle2 size={29} strokeWidth={1.8} />
                    ) : (
                      <XCircle size={29} strokeWidth={1.8} />
                    )}
                  </span>

                  <Sparkles
                    size={17}
                    className={`modal-sparkle absolute -right-1 top-2 ${
                      isApproval ? "text-[#B9F56B]" : "text-rose-300"
                    }`}
                  />
                </div>

                <p
                  className={`mb-3 text-[10px] font-bold tracking-[0.24em] ${
                    isApproval ? "text-[#B9F56B]" : "text-rose-300"
                  }`}
                >
                  {successMessage
                    ? "ACTION COMPLETED"
                    : isApproval
                      ? "APPROVAL REQUEST"
                      : "REJECTION REQUEST"}
                </p>

                <h2
                  id="moderation-title"
                  className="text-2xl font-bold tracking-tight text-white sm:text-[28px]"
                >
                  {successMessage
                    ? "Action successful!"
                    : isApproval
                      ? "Approve wallpaper?"
                      : "Reject wallpaper?"}
                </h2>

                <p
                  id="moderation-description"
                  className="mx-auto mt-3 max-w-[320px] text-sm leading-6 text-slate-400"
                >
                  {successMessage
                    ? successMessage
                    : isApproval
                      ? "This wallpaper will be approved for publication, subject to your platform's publication rules."
                      : "This wallpaper will be marked as rejected and won't be published."}
                </p>

                {/* Selected wallpaper */}
                <div className="mt-6 flex items-center gap-3 rounded-2xl border border-white/[0.09] bg-white/[0.035] p-3 text-left transition-colors hover:bg-white/[0.055]">
                  <div
                    className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl border ${
                      isApproval
                        ? "border-[#B9F56B]/20 bg-[#B9F56B]/[0.08] text-[#B9F56B]"
                        : "border-rose-400/20 bg-rose-400/[0.08] text-rose-300"
                    }`}
                  >
                    <Sparkles size={21} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-medium uppercase tracking-wider text-slate-500">
                      Selected wallpaper
                    </p>
                    <p className="mt-1 truncate text-sm font-semibold text-white">
                      {wallpaperTitle}
                    </p>
                  </div>

                  <span
                    className={`shrink-0 rounded-full border px-2 py-1 text-[10px] font-semibold ${
                      isApproval
                        ? "border-[#B9F56B]/20 bg-[#B9F56B]/10 text-[#B9F56B]"
                        : "border-rose-400/20 bg-rose-400/10 text-rose-300"
                    }`}
                  >
                    {successMessage
                      ? "Done"
                      : isApproval
                        ? "Approve"
                        : "Reject"}
                  </span>
                </div>

                {errorMessage && (
                  <div
                    role="alert"
                    className="mt-4 rounded-xl border border-rose-400/25 bg-rose-400/[0.08] p-3 text-left text-xs leading-5 text-rose-200"
                  >
                    <p className="font-semibold">Action failed</p>
                    <p className="mt-1 break-words">{errorMessage}</p>
                  </div>
                )}

                {!successMessage && (
                  <div className="mt-4 flex items-center justify-center gap-1.5 text-[10px] text-slate-500">
                    <LockKeyhole size={12} />
                    Admin authorization is verified by the server
                  </div>
                )}

                {!successMessage && (
                  <div className="mt-7 grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={closeModal}
                      disabled={loading}
                      className="inline-flex min-h-12 items-center justify-center rounded-xl border border-white/[0.12] bg-white/[0.025] px-4 text-sm font-semibold text-slate-300 transition duration-300 hover:border-white/25 hover:bg-white/[0.07] hover:text-white disabled:opacity-50"
                    >
                      Cancel
                    </button>

                    <button
                      type="button"
                      onClick={handleModeration}
                      disabled={loading}
                      className={`group inline-flex min-h-12 items-center justify-center gap-2 rounded-xl px-3 text-sm font-bold transition duration-300 hover:-translate-y-0.5 disabled:cursor-wait disabled:opacity-70 ${
                        isApproval
                          ? "bg-[#B9F56B] text-[#10180A] shadow-[0_5px_25px_rgba(185,245,107,0.15)] hover:shadow-[0_5px_35px_rgba(185,245,107,0.32)]"
                          : "bg-rose-400 text-[#21070D] shadow-[0_5px_25px_rgba(251,113,133,0.12)] hover:shadow-[0_5px_35px_rgba(251,113,133,0.28)]"
                      }`}
                    >
                      {loading ? (
                        <>
                          <LoaderCircle size={16} className="animate-spin" />
                          Processing
                        </>
                      ) : (
                        <>
                          {isApproval ? (
                            <CheckCircle2 size={16} />
                          ) : (
                            <XCircle size={16} />
                          )}
                          <span>
                            {isApproval
                              ? "Confirm Approval"
                              : "Confirm Rejection"}
                          </span>
                          <ArrowRight
                            size={15}
                            className="shrink-0 transition-transform group-hover:translate-x-1"
                          />
                        </>
                      )}
                    </button>
                  </div>
                )}

                {successMessage && (
                  <div className="success-message mt-6 flex items-center justify-center gap-2 text-xs text-[#B9F56B]">
                    <CheckCircle2 size={15} />
                    Your moderation action was successful.
                  </div>
                )}
              </div>

              <div
                className={`h-1 w-full ${
                  isApproval
                    ? "bg-gradient-to-r from-transparent via-[#B9F56B]/80 to-transparent"
                    : "bg-gradient-to-r from-transparent via-rose-400/80 to-transparent"
                }`}
              />
            </section>

            <style jsx>{`
              .moderation-backdrop {
                isolation: isolate;
                background: rgba(2, 5, 4, 0.58);
                -webkit-backdrop-filter: blur(18px) saturate(65%);
                backdrop-filter: blur(18px) saturate(65%);
                animation: backdrop-enter 280ms ease-out both;
              }

              .moderation-modal {
                transform-origin: center;
                animation: modal-enter 420ms
                  cubic-bezier(0.16, 1, 0.3, 1) both;
                will-change: transform, opacity;
              }

              .moderation-modal-approval {
                box-shadow:
                  0 0 0 1px rgba(185, 245, 107, 0.05),
                  0 0 45px rgba(185, 245, 107, 0.07),
                  0 30px 120px rgba(0, 0, 0, 0.78);
                animation:
                  modal-enter 420ms cubic-bezier(0.16, 1, 0.3, 1) both,
                  approval-glow 4s ease-in-out 420ms infinite;
              }

              .moderation-modal-rejection {
                box-shadow:
                  0 0 0 1px rgba(251, 113, 133, 0.05),
                  0 0 45px rgba(251, 113, 133, 0.06),
                  0 30px 120px rgba(0, 0, 0, 0.78);
                animation:
                  modal-enter 420ms cubic-bezier(0.16, 1, 0.3, 1) both,
                  rejection-glow 4s ease-in-out 420ms infinite;
              }

              .modal-ambient {
                animation: ambient-breathe 5s ease-in-out infinite;
              }

              .modal-accent {
                background-size: 200% 100%;
                animation: accent-sweep 3.5s linear infinite;
              }

              .modal-icon-ring {
                animation: ring-pulse 3s ease-in-out infinite;
              }

              .modal-sparkle {
                animation: sparkle-float 2.2s ease-in-out infinite;
              }

              .success-message {
                animation: success-enter 300ms ease-out both;
              }

              @keyframes backdrop-enter {
                from {
                  opacity: 0;
                  -webkit-backdrop-filter: blur(0);
                  backdrop-filter: blur(0);
                }
                to {
                  opacity: 1;
                  -webkit-backdrop-filter: blur(18px) saturate(65%);
                  backdrop-filter: blur(18px) saturate(65%);
                }
              }

              @keyframes modal-enter {
                from {
                  opacity: 0;
                  transform: translateY(18px) scale(0.94);
                }
                to {
                  opacity: 1;
                  transform: translateY(0) scale(1);
                }
              }

              @keyframes approval-glow {
                0%,
                100% {
                  border-color: rgba(185, 245, 107, 0.2);
                }
                50% {
                  border-color: rgba(185, 245, 107, 0.42);
                }
              }

              @keyframes rejection-glow {
                0%,
                100% {
                  border-color: rgba(251, 113, 133, 0.2);
                }
                50% {
                  border-color: rgba(251, 113, 133, 0.44);
                }
              }

              @keyframes ambient-breathe {
                0%,
                100% {
                  opacity: 0.55;
                  transform: translateX(0) scale(0.95);
                }
                50% {
                  opacity: 1;
                  transform: translateX(0) scale(1.12);
                }
              }

              @keyframes accent-sweep {
                from {
                  background-position: 100% 0;
                }
                to {
                  background-position: -100% 0;
                }
              }

              @keyframes ring-pulse {
                0%,
                100% {
                  transform: scale(1);
                  opacity: 0.7;
                }
                50% {
                  transform: scale(1.06);
                  opacity: 1;
                }
              }

              @keyframes sparkle-float {
                0%,
                100% {
                  transform: translateY(0) rotate(0);
                  opacity: 0.75;
                }
                50% {
                  transform: translateY(-4px) rotate(12deg);
                  opacity: 1;
                }
              }

              @keyframes success-enter {
                from {
                  opacity: 0;
                  transform: translateY(6px);
                }
                to {
                  opacity: 1;
                  transform: translateY(0);
                }
              }

              @media (prefers-reduced-motion: reduce) {
                .moderation-backdrop,
                .moderation-modal,
                .modal-ambient,
                .modal-accent,
                .modal-icon-ring,
                .modal-sparkle,
                .success-message {
                  animation: none !important;
                  transition: none !important;
                }
              }
            `}</style>
          </div>,
          document.body,
        )}
    </>
  );
}
