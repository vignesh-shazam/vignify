
"use client";

import { useEffect, useRef } from "react";

type Leaf = {
  x: number;
  y: number;
  size: number;
  speed: number;
  opacity: number;
  sway: number;
  phase: number;
  rotation: number;
  rotationSpeed: number;
};

export default function LeavesBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");

    if (!canvas || !context) return;

    let width = 0;
    let height = 0;
    let animationFrame = 0;
    let leaves: Leaf[] = [];

    const createLeaf = (randomY = false): Leaf => ({
      x: Math.random() * width,
      y: randomY ? Math.random() * height : -30,
      size: 8 + Math.random() * 15,
      speed: 0.2 + Math.random() * 0.4,
      opacity: 0.06 + Math.random() * 0.12,
      sway: 10 + Math.random() * 25,
      phase: Math.random() * Math.PI * 2,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.008,
    });

    const resizeCanvas = () => {
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);

      width = window.innerWidth;
      height = window.innerHeight;

      canvas.width = width * pixelRatio;
      canvas.height = height * pixelRatio;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

      const leafCount = Math.min(
        32,
        Math.max(16, Math.floor((width * height) / 35000)),
      );

      leaves = Array.from({ length: leafCount }, () => createLeaf(true));
    };

    const drawLeaf = (leaf: Leaf) => {
      context.save();
      context.translate(leaf.x, leaf.y);
      context.rotate(leaf.rotation);
      context.globalAlpha = leaf.opacity;

      context.fillStyle = "#B9F56B";
      context.beginPath();
      context.moveTo(0, -leaf.size);
      context.bezierCurveTo(
        leaf.size * 0.9,
        -leaf.size * 0.55,
        leaf.size * 0.9,
        leaf.size * 0.55,
        0,
        leaf.size,
      );
      context.bezierCurveTo(
        -leaf.size * 0.9,
        leaf.size * 0.55,
        -leaf.size * 0.9,
        -leaf.size * 0.55,
        0,
        -leaf.size,
      );
      context.fill();

      context.strokeStyle = "#55E6DC";
      context.lineWidth = 0.6;
      context.beginPath();
      context.moveTo(0, -leaf.size * 0.7);
      context.lineTo(0, leaf.size * 0.7);
      context.stroke();

      context.restore();
    };

    const animate = () => {
      context.clearRect(0, 0, width, height);

      for (const leaf of leaves) {
        leaf.phase += 0.008;
        leaf.y += leaf.speed;
        leaf.x += Math.sin(leaf.phase) * 0.35;
        leaf.rotation += leaf.rotationSpeed;

        const horizontalSway = Math.sin(leaf.phase) * leaf.sway;
        const originalX = leaf.x;

        drawLeaf({ ...leaf, x: originalX + horizontalSway * 0.04 });

        if (leaf.y > height + 35) {
          Object.assign(leaf, createLeaf());
        }

        if (leaf.x < -40) leaf.x = width + 30;
        if (leaf.x > width + 40) leaf.x = -30;
      }

      animationFrame = window.requestAnimationFrame(animate);
    };

    resizeCanvas();
    animate();

    window.addEventListener("resize", resizeCanvas);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0"
    />
  );
}
