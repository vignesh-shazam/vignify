"use client";

import { useState } from "react";
import {
    ArrowLeft,
    ArrowRight,
    ChevronRight,
    ShieldCheck,
    Smartphone,
    Sparkles,
} from "lucide-react";
import VignifyLogo from "@/components/mobile/VignifyLogo";
import "./OnboardingFlow.css";

type OnboardingFlowProps = {
    onComplete: () => void;
};

const slides = [
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
] as const;

function PhoneArtwork({
    variant,
}: {
    variant: "discover" | "personalize" | "safe" | "welcome";
}) {
    return (
        <div className={`ob-artwork ob-artwork-${variant}`} aria-hidden="true">
            <div className="ob-orbit ob-orbit-one" />
            <div className="ob-orbit ob-orbit-two" />
            <div className="ob-art-glow ob-art-glow-purple" />
            <div className="ob-art-glow ob-art-glow-cyan" />

            {variant === "discover" && (
                <>
                    <div className="ob-phone ob-phone-back ob-phone-discover-back">
                        <div className="ob-phone-status">
                            <span>9:41</span>
                            <span>● ▴</span>
                        </div>

                        <div className="ob-wallpaper-art ob-wallpaper-blue">
                            <span className="ob-mountain ob-mountain-one" />
                            <span className="ob-mountain ob-mountain-two" />
                            <span className="ob-wallpaper-sun" />
                        </div>

                        <div className="ob-phone-icons">
                            <i />
                            <i />
                            <i />
                            <i />
                        </div>
                    </div>

                    <div className="ob-phone ob-phone-front ob-phone-discover-front">
                        <div className="ob-phone-status">
                            <span>9:41</span>
                            <span>● ▴</span>
                        </div>

                        <div className="ob-wallpaper-art ob-wallpaper-pink">
                            <span className="ob-wallpaper-sun" />
                            <span className="ob-mountain ob-mountain-one" />
                            <span className="ob-mountain ob-mountain-two" />
                        </div>

                        <div className="ob-phone-icons">
                            <i />
                            <i />
                            <i />
                            <i />
                        </div>
                    </div>

                    <span className="ob-floating-chip ob-chip-image">
                        <Sparkles size={22} />
                    </span>

                    <span className="ob-floating-chip ob-chip-leaf">✦</span>
                </>
            )}

            {variant === "personalize" && (
                <>
                    <div className="ob-phone ob-phone-personalize">
                        <div className="ob-phone-status">
                            <span>9:41</span>
                            <span>● ▴</span>
                        </div>

                        <div className="ob-personalize-screen">
                            <div className="ob-widget ob-widget-wide">
                                <span className="ob-widget-orb" />
                                <span className="ob-widget-lines">
                                    <i />
                                    <i />
                                </span>
                            </div>

                            <div className="ob-app-grid">
                                <i>◈</i>
                                <i>◉</i>
                                <i>✦</i>
                                <i>▧</i>
                                <i>♫</i>
                                <i>❀</i>
                                <i>◌</i>
                                <i>▦</i>
                                <i>◇</i>
                            </div>
                        </div>
                    </div>

                    <span className="ob-floating-app ob-app-purple">◈</span>
                    <span className="ob-floating-app ob-app-cyan">✦</span>
                    <span className="ob-floating-app ob-app-pink">◉</span>
                    <span className="ob-floating-app ob-app-green">♫</span>
                    <span className="ob-floating-app ob-app-blue">▧</span>
                </>
            )}

            {variant === "safe" && (
                <>
                    <div className="ob-security-platform ob-platform-back" />
                    <div className="ob-security-platform ob-platform-front" />

                    <div className="ob-security-shield">
                        <ShieldCheck size={100} strokeWidth={1.4} />
                    </div>

                    <span className="ob-floating-app ob-safe-card ob-safe-left">
                        ◈
                    </span>

                    <span className="ob-floating-app ob-safe-card ob-safe-right">
                        ✦
                    </span>

                    <span className="ob-floating-app ob-safe-card ob-safe-bottom">
                        ✓
                    </span>

                    <span className="ob-safe-sparkle ob-safe-sparkle-one">✦</span>
                    <span className="ob-safe-sparkle ob-safe-sparkle-two">✧</span>
                </>
            )}

            {variant === "welcome" && (
                <>
                    <div className="ob-welcome-phone ob-welcome-phone-left">
                        <div className="ob-wallpaper-art ob-wallpaper-pink">
                            <span className="ob-wallpaper-sun" />
                            <span className="ob-mountain ob-mountain-one" />
                            <span className="ob-mountain ob-mountain-two" />
                        </div>
                    </div>

                    <div className="ob-welcome-phone ob-welcome-phone-right">
                        <div className="ob-wallpaper-art ob-wallpaper-blue">
                            <span className="ob-wallpaper-sun" />
                            <span className="ob-mountain ob-mountain-one" />
                            <span className="ob-mountain ob-mountain-two" />
                        </div>
                    </div>

                    <div className="ob-welcome-phone ob-welcome-phone-center">
                        <div className="ob-wallpaper-art ob-wallpaper-cosmic">
                            <span className="ob-wallpaper-sun" />
                            <span className="ob-mountain ob-mountain-one" />
                            <span className="ob-mountain ob-mountain-two" />
                        </div>
                    </div>
                </>
            )}
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
            aria-label="Vignify onboarding"
            onTouchStart={(event) =>
                setTouchStart(event.touches[0]?.clientX ?? null)
            }
            onTouchEnd={(event) =>
                handleTouchEnd(event.changedTouches[0]?.clientX ?? touchStart ?? 0)
            }
        >
            <div className="ob-background-glow ob-background-glow-top" />
            <div className="ob-background-glow ob-background-glow-bottom" />
            <div className="ob-noise" />

            <header className="ob-topbar">
                <a
                    className="ob-brand"
                    href="#welcome"
                    aria-label="Vignify"
                    onClick={(event) => event.preventDefault()}
                >
                    <BrandMark />
                    <span>Vignify</span>
                </a>
            </header>

            {isWelcome ? (
                <section className="ob-welcome ob-enter" key="welcome">
                    <div className="ob-welcome-brand">
                        <BrandMark />
                        <h1>Vignify</h1>

                        <p className="ob-welcome-ready">Ready to Customize?</p>

                        <p className="ob-welcome-description">
                            Join millions of Android users and make your device unique.
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
                            <Sparkles size={12} />
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
                            <ArrowLeft size={24} strokeWidth={2} />
                        </button>

                        <div
                            className="ob-pagination"
                            aria-label={`Screen ${step + 1} of ${slides.length}`}
                        >
                            {slides.map((item, index) => (
                                <button
                                    key={item.type}
                                    type="button"
                                    className={`ob-dot ${index === step ? "is-active" : ""
                                        }`}
                                    aria-label={`Go to onboarding screen ${index + 1}`}
                                    aria-current={index === step ? "step" : undefined}
                                    onClick={() => setStep(index)}
                                />
                            ))}
                        </div>

                        <button
                            className="ob-next-button"
                            type="button"
                            aria-label="Next onboarding screen"
                            title="Next"
                            onClick={next}
                        >
                            <ArrowRight size={24} strokeWidth={2} />
                        </button>
                    </footer>
                </section>
            )}

            <div className="ob-bottom-caption">
                <Smartphone size={12} />
                <span>YOUR WORLD. YOUR STYLE.</span>
            </div>
        </main>
    );
}