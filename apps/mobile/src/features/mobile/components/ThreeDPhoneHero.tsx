
"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import "./ThreeDPhoneHero.css";

type PhoneProps = {
    position: [number, number, number];
    rotation: [number, number, number];
    variant: "purple" | "orange";
};

function createScreenTexture(variant: "purple" | "orange") {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 1024;

    const context = canvas.getContext("2d");

    if (!context) {
        return new THREE.CanvasTexture(canvas);
    }

    const gradient = context.createLinearGradient(0, 0, 512, 1024);

    if (variant === "purple") {
        gradient.addColorStop(0, "#090B25");
        gradient.addColorStop(0.38, "#5927D8");
        gradient.addColorStop(0.7, "#F044A4");
        gradient.addColorStop(1, "#07152F");
    } else {
        gradient.addColorStop(0, "#16091C");
        gradient.addColorStop(0.38, "#FF6B35");
        gradient.addColorStop(0.68, "#D82D85");
        gradient.addColorStop(1, "#31116D");
    }

    context.fillStyle = gradient;
    context.fillRect(0, 0, 512, 1024);

    const glow = context.createRadialGradient(
        270, 440, 10, 270, 440, 360
    );

    glow.addColorStop(
        0,
        variant === "purple"
            ? "rgba(70, 230, 255, 0.85)"
            : "rgba(255, 190, 65, 0.8)"
    );
    glow.addColorStop(1, "rgba(255,255,255,0)");

    context.fillStyle = glow;
    context.fillRect(0, 0, 512, 1024);

    context.save();
    context.translate(256, 485);
    context.rotate(-0.42);

    const orb = context.createLinearGradient(-180, -220, 180, 220);
    orb.addColorStop(0, "rgba(255,255,255,0.8)");
    orb.addColorStop(0.35, "rgba(255,255,255,0.06)");
    orb.addColorStop(1, "rgba(255,255,255,0)");

    context.fillStyle = orb;
    context.beginPath();
    context.ellipse(0, 0, 155, 280, 0, 0, Math.PI * 2);
    context.fill();
    context.restore();

    context.fillStyle = "rgba(255,255,255,0.9)";
    context.font = "bold 26px Arial";
    context.fillText("VIGNITI", 34, 62);

    context.fillStyle = "rgba(255,255,255,0.72)";
    context.font = "20px Arial";
    context.fillText("YOUR WORLD. YOUR STYLE.", 34, 94);

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 4;

    return texture;
}

function PhoneModel({ position, rotation, variant }: PhoneProps) {
    const screenTexture = useMemo(
        () => createScreenTexture(variant),
        [variant]
    );

    return (
        <group position={position} rotation={rotation}>
            {/* Metallic outer chassis */}
            <RoundedBox
                args={[1.04, 2.02, 0.15]}
                radius={0.14}
                smoothness={8}
                castShadow
                receiveShadow
            >
                <meshStandardMaterial
                    color="#9B91B8"
                    metalness={0.92}
                    roughness={0.22}
                />
            </RoundedBox>

            {/* Black front bezel */}
            <RoundedBox
                args={[0.99, 1.97, 0.035]}
                radius={0.13}
                smoothness={8}
                position={[0, 0, 0.084]}
            >
                <meshStandardMaterial
                    color="#080910"
                    metalness={0.25}
                    roughness={0.25}
                />
            </RoundedBox>

            {/* AMOLED display */}
            <mesh position={[0, 0, 0.106]}>
                <planeGeometry args={[0.91, 1.87]} />
                <meshBasicMaterial
                    map={screenTexture}
                    toneMapped={false}
                />
            </mesh>

            {/* Front camera / dynamic island */}
            <RoundedBox
                args={[0.25, 0.055, 0.009]}
                radius={0.025}
                smoothness={6}
                position={[0, 0.88, 0.113]}
            >
                <meshBasicMaterial color="#020308" />
            </RoundedBox>

            <mesh position={[0.075, 0.88, 0.12]}>
                <circleGeometry args={[0.012, 20]} />
                <meshBasicMaterial color="#273F83" />
            </mesh>

            {/* Side buttons */}
            <mesh position={[0.527, 0.38, 0]}>
                <boxGeometry args={[0.018, 0.25, 0.045]} />
                <meshStandardMaterial
                    color="#C5B8E5"
                    metalness={1}
                    roughness={0.25}
                />
            </mesh>

            <mesh position={[-0.527, 0.25, 0]}>
                <boxGeometry args={[0.018, 0.18, 0.04]} />
                <meshStandardMaterial
                    color="#B9A9DA"
                    metalness={1}
                    roughness={0.25}
                />
            </mesh>

            {/* Soft light around the phone */}
            <pointLight
                position={[0, 0, 0.35]}
                color={variant === "purple" ? "#A855F7" : "#FF7849"}
                intensity={0.55}
                distance={2.4}
            />
        </group>
    );
}


function PhoneScene({
    drag,
}: {
    drag: React.MutableRefObject<{ x: number; y: number }>;
}) {
    const group = useRef<THREE.Group>(null);

    useFrame((state, delta) => {
        if (!group.current) return;

        const time = state.clock.elapsedTime;

        // Continuous automatic 360-degree rotation.
        const automaticRotation = time * 0.22;

        // Add user-controlled rotation without limiting the angle.
        group.current.rotation.y = automaticRotation + drag.current.x;

        // Smooth vertical tilt from touch gestures.
        group.current.rotation.x = THREE.MathUtils.damp(
            group.current.rotation.x,
            drag.current.y,
            5,
            delta
        );

        group.current.position.y = Math.sin(time * 0.8) * 0.025;

        // Slightly smaller phones, fully contained in the banner.
        group.current.scale.setScalar(0.76);
    });

    return (
        <>
            <ambientLight intensity={1.1} />

            <directionalLight
                position={[3, 4, 6]}
                intensity={2.4}
                color="#FFFFFF"
            />

            <pointLight
                position={[-3, 1, 3]}
                intensity={2.2}
                color="#9D4DFF"
            />

            <pointLight
                position={[3, -2, 2]}
                intensity={1.5}
                color="#FF5C9A"
            />

            <group ref={group}>
                <Float speed={1.3} rotationIntensity={0.035} floatIntensity={0.08}>
                    <PhoneModel
                        position={[-0.48, 0.04, -0.28]}
                        rotation={[0.03, -0.2, -0.13]}
                        variant="purple"
                    />
                </Float>

                <Float speed={1.1} rotationIntensity={0.035} floatIntensity={0.07}>
                    <PhoneModel
                        position={[0.48, -0.04, 0.12]}
                        rotation={[-0.04, 0.2, 0.13]}
                        variant="orange"
                    />
                </Float>
            </group>
        </>
    );
}


export default function ThreeDPhoneHero() {
    const drag = useRef({ x: 0, y: 0 });
    const pointer = useRef<{ x: number; y: number } | null>(null);

    function handlePointerDown(event: React.PointerEvent<HTMLDivElement>) {
        pointer.current = { x: event.clientX, y: event.clientY };
        event.currentTarget.setPointerCapture(event.pointerId);
    }

    function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
        if (!pointer.current) return;

        const deltaX = event.clientX - pointer.current.x;
        const deltaY = event.clientY - pointer.current.y;

        drag.current.x += deltaX * 0.008;

        drag.current.y = THREE.MathUtils.clamp(
            drag.current.y + deltaY * 0.006,
            -0.35,
            0.35
        );

        pointer.current = { x: event.clientX, y: event.clientY };
    }

    function handlePointerUp() {
        pointer.current = null;
    }

    return (
        <div
            className="three-d-phone-hero"
            role="img"
            aria-label="Interactive three-dimensional Vigniti smartphones"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
        >
            <div className="three-d-phone-glow three-d-phone-glow-purple" />
            <div className="three-d-phone-glow three-d-phone-glow-pink" />

            <Canvas
                camera={{ position: [0, 0, 6.2], fov: 37 }}
                dpr={[1, 1.5]}
                gl={{ alpha: true, antialias: true, powerPreference: "low-power" }}
                fallback={
                    <div className="three-d-phone-fallback">
                        Vigniti
                    </div>
                }
            >
                <PhoneScene drag={drag} />
            </Canvas>

            <div className="three-d-phone-vignette" />
        </div>
    );
}
