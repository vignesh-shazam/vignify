"use client";

import { useEffect, useRef, useState } from "react";
import VignifyLogo from "@/components/mobile/VignifyLogo";

type SplashScreenProps = {
  onComplete?: () => void;
};

const SPLASH_DURATION = 2200;
const UPDATE_INTERVAL = 50;

export default function SplashScreen({
  onComplete,
}: SplashScreenProps) {
  const [progress, setProgress] = useState(0);
  const onCompleteRef = useRef(onComplete);

  // Keep the latest callback without restarting the timer.
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    console.log("[Vignify Debug] Splash effect started");

    const startedAt = Date.now();
    let completed = false;
    let intervalId: number | undefined;

    const updateProgress = () => {
      const elapsed = Date.now() - startedAt;
      const nextProgress = Math.min(
        100,
        Math.round((elapsed / SPLASH_DURATION) * 100),
      );

      console.log("[Vignify Debug] Progress:", nextProgress);

      setProgress(nextProgress);

      if (nextProgress >= 100 && !completed) {
        completed = true;

        if (intervalId !== undefined) {
          window.clearInterval(intervalId);
        }

        console.log("[Vignify Debug] Splash completed");
        onCompleteRef.current?.();
      }
    };

    intervalId = window.setInterval(
      updateProgress,
      UPDATE_INTERVAL,
    );

    // Update immediately, then continue updating every 50ms.
    updateProgress();

    return () => {
      if (intervalId !== undefined) {
        window.clearInterval(intervalId);
      }

      console.log("[Vignify Debug] Splash effect cleaned up");
    };
  }, []);

  return (
    <main
      className="vignify-splash"
      aria-label="Vignify loading"
    >
      {/* Background glow effects */}
      <div className="vignify-splash-glow vignify-splash-glow-pink" />
      <div className="vignify-splash-glow vignify-splash-glow-cyan" />

      {/* Brand logo and tagline */}
      <section className="vignify-splash-content">
        <div className="vignify-splash-logo" aria-hidden="true">
          <VignifyLogo size={72} />
        </div>

        <h1 className="vignify-splash-wordmark">
          Vignify
        </h1>

        <p className="vignify-splash-tagline">
          Your world. Your style.
        </p>
      </section>

      {/* Loading bar and live percentage */}
      <section
        className="vignify-splash-loader"
        aria-live="polite"
      >
        <div
          className="vignify-splash-track"
          role="progressbar"
          aria-label="Loading your creativity"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={progress}
        >
          <span
            className="vignify-splash-progress"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="vignify-splash-progress-info">
          <p>Loading your creativity...</p>

          <span className="vignify-splash-percentage">
            {progress}%
          </span>
        </div>
      </section>
    </main>
  );
}