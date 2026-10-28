
"use client";

import { useState } from "react";
import {
    ArrowLeft,
    ArrowRight,
    ChevronRight,
    Smartphone,
    Sparkles,
} from "lucide-react";
import VignifyLogo from "@/features/mobile/components/VignifyLogo";
import "./OnboardingFlow.css";

type OnboardingFlowProps = {
    onComplete: () => void;
};

type SlideType = "discover" | "personalize" | "safe";

type VideoArtworkProps = {
    variant: SlideType | "welcome";
};

const slides: {
    eyebrow: string;
    title: string;
    description: string;
    type: SlideType;
}[] = [
        {
            eyebrow: "MAKE IT YOURS",
            title: "Discover\nEndless Customization",
            description:
                "Explore thousands of wallpapers, icon packs, themes, and more from amazing creators.",
            type: "discover",
        },
        {
            eyebrow: "YOUR STYLE, YOUR RULES",
            title: "Personalize\nYour Device",
            description:
                "Make your Android device truly yours with unique styles, beautiful designs and more.",
            type: "personalize",
        },
        {
            eyebrow: "DESIGNED FOR ANDROID",
            title: "Safe &\nCompatible",
            description:
                "Designed for standard Android devices. No root required. Safe, secure and easy to use.",
            type: "safe",
        },
    ];

const videoSources: Record<SlideType | "welcome", string> = {
    discover: "/videos/vignify-onboarding-1.mp4",
    personalize: "/videos/vignify-onboarding-2.mp4",
    safe: "/videos/vignify-onboarding-3.mp4",
    welcome: "/videos/vignify-welcome-hero.mp4",
};

const videoLabels: Record<SlideType | "welcome", string> = {
    discover: "Discover premium wallpapers and customization",
    personalize: "Personalize your Android device",
    safe: "Vigniti security and compatibility animation",
    welcome: "Vigniti welcome hero animation",
};


function PhoneArtwork({
    variant,
}: {
    variant: "discover" | "personalize" | "safe" | "welcome";
}) {
    const videoSources = {
        discover: "/videos/vignify-onboarding-1.mp4",
        personalize: "/videos/vignify-onboarding-2.mp4",
        safe: "/videos/vignify-onboarding-3.mp4",
        welcome: "/videos/vignify-welcome-hero.mp4",
    } as const;

    const videoLabels = {
        discover: "Discover wallpapers and customization",
        personalize: "Personalize your Android device",
        safe: "Vigniti security and compatibility",
        welcome: "Vigniti welcome hero animation",
    } as const;

    return (
        <div
            className={`ob-artwork ob-artwork-${variant} ob-video-artwork`}
            role="img"
            aria-label={videoLabels[variant]}
        >
            <div
                className="ob-video-glow ob-video-glow-purple"
                aria-hidden="true"
            />

            <div
                className="ob-video-glow ob-video-glow-cyan"
                aria-hidden="true"
            />

            <video
                key={videoSources[variant]}
                className="ob-hero-video"
                src={videoSources[variant]}
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
                disablePictureInPicture
                aria-hidden="true"
            />

            <div className="ob-video-vignette" aria-hidden="true" />
        </div>
    );
}


function BrandMark({ appIcon = false }: { appIcon?: boolean }) {
    return (
        <span
            className={`ob-brand-mark${appIcon ? " ob-brand-mark-app-icon" : ""}`}
            aria-hidden="true"
        >
            <VignifyLogo size={appIcon ? 30 : 28} />
        </span>
    );
}

export default function OnboardingFlow({
    onComplete,
}: OnboardingFlowProps) {
    const [step, setStep] = useState(0);
    const [touchStart, setTouchStart] = useState<number | null>(null);

    const isWelcome = step === slides.length;
    const slide = slides[Math.min(step, slides.length - 1)];

    function next() {
        if (step < slides.length) {
            setStep((current) => Math.min(slides.length, current + 1));
        } else {
            onComplete();
        }
    }

    function previous() {
        setStep((current) => Math.max(0, current - 1));
    }

    function handleTouchEnd(endX: number) {
        if (touchStart === null) return;

        const difference = endX - touchStart;

        if (difference < -55) {
            next();
        } else if (difference > 55 && step > 0) {
            previous();
        }

        setTouchStart(null);
    }

    return (
        <main
            className="ob-screen"
            aria-label="Vigniti onboarding"
            onTouchStart={(event) =>
                setTouchStart(event.touches[0]?.clientX ?? null)
            }
            onTouchEnd={(event) =>
                handleTouchEnd(
                    event.changedTouches[0]?.clientX ?? touchStart ?? 0,
                )
            }
        >
            <div
                className="ob-background-glow ob-background-glow-top"
                aria-hidden="true"
            />
            <div
                className="ob-background-glow ob-background-glow-bottom"
                aria-hidden="true"
            />
            <div className="ob-noise" aria-hidden="true" />

            <header className="ob-topbar">
                <a
                    className="ob-brand"
                    href="#welcome"
                    aria-label="Vigniti"
                    onClick={(event) => event.preventDefault()}
                >
                    <BrandMark />
                    <span>Vigniti</span>
                </a>

                {!isWelcome && (
                    <span className="ob-topbar-counter">
                        {step + 1} / {slides.length}
                    </span>
                )}
            </header>

            {isWelcome ? (
                <section className="ob-welcome ob-enter" key="welcome">
                    <div className="ob-welcome-brand">
                        <BrandMark />

                        <h1>Vigniti</h1>

                        <p className="ob-welcome-ready">
                            Ready to Customize?
                        </p>

                        <p className="ob-welcome-description">
                            Make your Android device uniquely yours with beautiful
                            wallpapers, creative styles, and amazing customization.
                        </p>
                    </div>

                    <PhoneArtwork variant="welcome" />

                    <div className="ob-welcome-actions">
                        <button
                            className="ob-primary-button"
                            type="button"
                            onClick={onComplete}
                        >
                            Get Started <ArrowRight size={18} />
                        </button>

                        <div className="ob-welcome-skip-row">
                            <BrandMark appIcon />

                            <button
                                className="ob-skip-bottom"
                                type="button"
                                onClick={onComplete}
                            >
                                Skip for Now
                            </button>
                        </div>
                    </div>
                </section>
            ) : (
                <section className="ob-slide ob-enter" key={slide.type}>
                    <PhoneArtwork variant={slide.type} />

                    <div className="ob-copy">
                        <span className="ob-eyebrow">
                            <Sparkles size={13} />
                            {slide.eyebrow}
                        </span>

                        <h1>
                            {slide.title.split("\n").map((line, index) => (
                                <span key={line}>
                                    {index > 0 && <br />}
                                    {line}
                                </span>
                            ))}
                        </h1>

                        <p>{slide.description}</p>
                    </div>

                    <footer className="ob-footer">
                        <button
                            className="ob-previous-button"
                            type="button"
                            onClick={previous}
                            disabled={step === 0}
                            aria-label="Previous onboarding screen"
                            title="Previous"
                        >
                            <ArrowLeft size={22} />
                        </button>

                        <div
                            className="ob-pagination"
                            aria-label={`Screen ${step + 1} of ${slides.length}`}
                        >
                            {slides.map((item, index) => (
                                <button
                                    key={item.type}
                                    type="button"
                                    className={`ob-dot${index === step ? " is-active" : ""}`}
                                    aria-label={`Go to onboarding screen ${index + 1}`}
                                    aria-current={index === step ? "step" : undefined}
                                    onClick={() => setStep(index)}
                                />
                            ))}
                        </div>

                        <button
                            className="ob-next-button"
                            type="button"
                            aria-label={
                                step === slides.length - 1
                                    ? "Continue to welcome screen"
                                    : "Next onboarding screen"
                            }
                            title="Next"
                            onClick={next}
                        >
                            <ArrowRight size={22} />
                        </button>
                    </footer>
                </section>
            )}

            <div className="ob-bottom-caption">
                <Smartphone size={13} />
                <span>YOUR WORLD. YOUR STYLE.</span>
            </div>
        </main>
    );
}
