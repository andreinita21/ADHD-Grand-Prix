'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useTasks } from '@/context/TaskContext';
import { Task } from '@/types';

// Helper logic
const SPEED_MULTIPLIER: Record<string, number> = {
    High: 10,
    Medium: 3,
    Low: 1
};

export default function TrackCanvas() {
    const { activeTasks, pitLaneTasks, isRacing, winner, completeWinner, dismissWinner } = useTasks();
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Physics & Animation State
    const carsRef = useRef<any[]>([]);
    const animationRef = useRef<number | null>(null);
    const pitLaneRef = useRef<Task[]>([]);

    // Sync pit lane tasks for the animation loop
    useEffect(() => {
        pitLaneRef.current = pitLaneTasks;
    }, [pitLaneTasks]);

    // Initialize cars whenever activeTasks change
    useEffect(() => {
        // Keep existing angles if car already exists
        const currentCars = carsRef.current;
        carsRef.current = activeTasks.map((task) => {
            const existing = currentCars.find(c => c.id === task.id);
            return {
                id: task.id,
                task,
                angle: existing ? existing.angle : Math.random() * Math.PI * 2,
                speedBase: (SPEED_MULTIPLIER[task.importance] || 1) * 0.005,
            };
        });
    }, [activeTasks]);

    // Main Loop
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let lastTime = performance.now();

        const render = (time: number) => {
            const deltaTime = time - lastTime;
            lastTime = time;

            // Handle Resize dynamically based on wrapper
            const parent = canvas.parentElement;
            if (parent && (canvas.width !== parent.clientWidth || canvas.height !== parent.clientHeight)) {
                canvas.width = parent.clientWidth;
                canvas.height = parent.clientHeight;
            }

            const w = canvas.width;
            const h = canvas.height;

            const isMobile = h < 600 || w < 768;

            // Define Pit Lane dimensions first so we can subtract them from available space
            const pitHeight = isMobile ? 55 : 80;
            const pitWidth = isMobile ? Math.min(w * 0.9, 280) : 260;
            const pitYOffset = isMobile ? 10 : 20;

            const safeHeight = h - pitHeight - pitYOffset;

            // Shift track center up to make room for pit lane
            const cx = w / 2;
            const cy = safeHeight / 2;

            // Constrain radius so it doesn't leave the safe area
            const maxRx = w * 0.35;
            const maxRy = safeHeight * 0.35;

            const rx = Math.max(maxRx, 80);
            const ry = Math.max(maxRy, 40);

            // Clear
            // Clear
            ctx.clearRect(0, 0, w, h);

            // Draw grassy background explicitly inside canvas as fallback
            ctx.fillStyle = '#14532d'; // green-900 baseline
            ctx.fillRect(0, 0, w, h);

            // --- Draw Kerbs (Outer and Inner) ---
            const kerbThickness = 8;
            const drawKerb = (radiusX: number, radiusY: number) => {
                ctx.beginPath();
                ctx.ellipse(cx, cy, radiusX, radiusY, 0, 0, Math.PI * 2);
                ctx.lineWidth = kerbThickness;
                // Create dashed red/white pattern
                ctx.strokeStyle = '#ef4444'; // Red
                ctx.setLineDash([20, 20]);
                ctx.stroke();

                ctx.beginPath();
                ctx.ellipse(cx, cy, radiusX, radiusY, 0, 0, Math.PI * 2);
                ctx.strokeStyle = '#ffffff'; // White
                ctx.lineDashOffset = 20;
                ctx.stroke();
                ctx.setLineDash([]);
                ctx.lineDashOffset = 0;
            };

            // Outer kerb
            drawKerb(rx + 24, ry + 24);
            // Inner kerb
            drawKerb(rx - 24, ry - 24);

            // --- Draw Main Asphalt Track ---
            ctx.beginPath();
            ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
            ctx.strokeStyle = '#1e293b'; // Dark slate/asphalt
            ctx.lineWidth = 44;
            ctx.stroke();

            // Draw Track Center Line
            ctx.beginPath();
            ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
            ctx.lineWidth = 2;
            ctx.setLineDash([15, 25]);
            ctx.stroke();
            ctx.setLineDash([]); // reset

            // Helper to draw an F1 Car
            const drawF1Car = (color: string, racing: boolean, parked: boolean = false) => {
                const bodyL = 36;
                const bodyW = 12;

                // Shadow
                ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
                ctx.shadowBlur = 6;
                ctx.shadowOffsetX = 2;
                ctx.shadowOffsetY = 4;

                // 1. Tires
                ctx.fillStyle = '#0f172a'; // Black tires
                const tireW = 10;
                const tireH = 6;
                // Front tires
                ctx.beginPath(); ctx.roundRect(bodyL / 2 - tireW, -bodyW / 2 - tireH + 1, tireW, tireH, 2); ctx.fill();
                ctx.beginPath(); ctx.roundRect(bodyL / 2 - tireW, bodyW / 2 - 1, tireW, tireH, 2); ctx.fill();
                // Rear tires (slightly wider)
                const rTireW = 12;
                const rTireH = 7;
                ctx.beginPath(); ctx.roundRect(-bodyL / 2 + 2, -bodyW / 2 - rTireH + 1, rTireW, rTireH, 2); ctx.fill();
                ctx.beginPath(); ctx.roundRect(-bodyL / 2 + 2, bodyW / 2 - 1, rTireW, rTireH, 2); ctx.fill();

                // Clear shadow for body pieces so they don't shadow themselves
                ctx.shadowColor = 'transparent';

                // 2. Main Fuselage & Sidepods
                ctx.fillStyle = color;
                // Central body
                ctx.beginPath();
                ctx.roundRect(-bodyL / 2, -bodyW / 2 + 2, bodyL, bodyW - 4, 3);
                ctx.fill();

                // Sidepods
                ctx.fillStyle = color;
                ctx.beginPath();
                ctx.roundRect(-bodyL / 4, -bodyW / 2, bodyL / 2, bodyW, 2);
                ctx.fill();
                // Darken sidepods for depth
                ctx.fillStyle = 'rgba(0,0,0,0.2)';
                ctx.beginPath();
                ctx.roundRect(-bodyL / 4, -bodyW / 2, bodyL / 2, bodyW, 2);
                ctx.fill();

                // 3. Front Wing
                ctx.fillStyle = '#334155'; // Dark grey
                ctx.beginPath();
                ctx.roundRect(bodyL / 2 - 4, -bodyW / 2 - 3, 4, bodyW + 6, 1);
                ctx.fill();
                // Wing accent plates
                ctx.fillStyle = color;
                ctx.fillRect(bodyL / 2 - 4, -bodyW / 2 - 3, 4, 2);
                ctx.fillRect(bodyL / 2 - 4, bodyW / 2 + 1, 4, 2);

                // 4. Rear Wing
                ctx.fillStyle = '#1e293b';
                ctx.beginPath();
                ctx.roundRect(-bodyL / 2 - 2, -bodyW / 2 - 2, 4, bodyW + 4, 1);
                ctx.fill();

                // 5. Cockpit & Halo
                ctx.fillStyle = '#020617'; // Almost black
                ctx.beginPath();
                ctx.roundRect(-4, -3, 10, 6, 3);
                ctx.fill();
                ctx.fillStyle = '#ef4444'; // Helmet (red)
                ctx.beginPath();
                ctx.arc(0, 0, 2.5, 0, Math.PI * 2);
                ctx.fill();

                // 6. Blinking Tail Light
                if (racing || parked) {
                    const blink = Math.floor(Date.now() / 150) % 2 === 0;
                    ctx.fillStyle = blink ? '#ef4444' : '#7f1d1d';
                    ctx.beginPath();
                    ctx.arc(-bodyL / 2 - 2, 0, 1.5, 0, Math.PI * 2);
                    ctx.fill();

                    if (blink && racing) {
                        ctx.shadowColor = '#ef4444';
                        ctx.shadowBlur = 4;
                        ctx.fill();
                        ctx.shadowColor = 'transparent';
                    }
                }
            };

            // Calculate overlapping cars for collision handling logic (visual only)
            // Sorting cars by angle
            const sortedCars = [...carsRef.current].sort((a, b) => a.angle - b.angle);

            // Draw Cars
            sortedCars.forEach((car) => {
                // Update angle (speed increases if racing)
                const raceMultiplier = isRacing ? 5 : 1;
                car.angle += car.speedBase * raceMultiplier * (deltaTime / 16);

                // Calculate Position
                const x = cx + rx * Math.cos(car.angle);
                const y = cy + ry * Math.sin(car.angle);

                // Calculate Rotation (tangent to ellipse)
                const dx = -rx * Math.sin(car.angle);
                const dy = ry * Math.cos(car.angle);
                const rotation = Math.atan2(dy, dx);

                // Draw Car
                ctx.save();
                ctx.translate(x, y);
                ctx.rotate(rotation);

                drawF1Car(car.task.color, isRacing, false);

                ctx.restore();
            });

            // --- Draw Pit Lane Area ---
            const pitX = cx - pitWidth / 2;
            const pitY = h - pitHeight - pitYOffset; // Anchor to bottom of canvas

            // Draw Garage Building Background
            ctx.shadowColor = 'rgba(0,0,0,0.5)';
            ctx.shadowBlur = 10;
            ctx.fillStyle = '#0f172a'; // slate-900 
            ctx.beginPath();
            ctx.roundRect(pitX, pitY, pitWidth, pitHeight, 8);
            ctx.fill();
            ctx.shadowColor = 'transparent'; // reset

            // Roof/Edge highlight
            ctx.beginPath();
            ctx.roundRect(pitX, pitY, pitWidth, pitHeight, 8);
            ctx.strokeStyle = '#334155';
            ctx.lineWidth = 2;
            ctx.stroke();

            // Garage Floor Pattern
            ctx.save();
            ctx.clip(); // clip to garage boundaries
            ctx.fillStyle = '#1e293b';
            for (let i = 0; i < pitWidth; i += 20) {
                ctx.fillRect(pitX + i, pitY, 1, pitHeight);
            }
            ctx.restore();

            // Text
            ctx.fillStyle = '#ef4444'; // red-500
            ctx.font = 'bold 10px monospace';
            ctx.textAlign = 'center';
            ctx.fillText('PIT LANE / COOLDOWN ZONE', cx, pitY + 14);

            // Draw cars in Pit Lane
            const currentPitTasks = pitLaneRef.current;
            const totalPitCars = currentPitTasks.length;
            const maxVisible = 6;
            const renderPitTasks = currentPitTasks.slice(0, maxVisible);

            renderPitTasks.forEach((pt, index) => {
                const spacing = 40;
                // Center the cars in the pit lane
                const startX = cx - ((renderPitTasks.length - 1) * spacing) / 2;
                const carX = startX + (index * spacing);
                const carY = pitY + (pitHeight * 0.55);

                ctx.save();
                ctx.translate(carX, carY);
                // Parked facing right (or angled slightly downwards towards the track)
                ctx.rotate(Math.PI / 8);

                ctx.globalAlpha = 0.7; // Slightly transparent
                drawF1Car(pt.color, false, true);

                ctx.restore();
            });

            animationRef.current = requestAnimationFrame(render);
        };

        animationRef.current = requestAnimationFrame(render);

        return () => {
            if (animationRef.current) cancelAnimationFrame(animationRef.current);
        };
    }, [isRacing]);

    return (
        <div className="flex-1 w-full h-full flex flex-col items-center justify-center relative overflow-hidden">

            {/* Canvas container */}
            <div className="absolute inset-0 z-0">
                <canvas ref={canvasRef} className="w-full h-full block" />
            </div>

            {/* Winner Modal */}
            {winner && !isRacing && (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm pointer-events-auto">
                    <div className="bg-slate-900 p-8 rounded-2xl border-2 shadow-2xl max-w-md w-full text-center flex flex-col items-center relative overflow-hidden"
                        style={{ borderColor: winner.color }}>

                        {/* Decorative header */}
                        <div className="absolute top-0 w-full h-3" style={{ backgroundColor: winner.color }}></div>

                        <h3 className="text-sm font-bold tracking-[0.2em] text-slate-400 uppercase mt-2 mb-4">
                            Winning Task
                        </h3>

                        <div className="w-16 h-16 rounded-full border-4 flex items-center justify-center mb-6 shadow-xl"
                            style={{ borderColor: winner.color }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" /><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" /><path d="M4 22h16" /><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" /><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" /><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" /></svg>
                        </div>

                        <h2 className="text-3xl font-black text-white mb-2">{winner.name}</h2>
                        <p className="text-slate-400 mb-8 font-mono text-sm capitalize px-3 py-1 bg-slate-800 rounded-md border border-slate-700">
                            Importance: <span className="text-slate-200">{winner.importance}</span>
                        </p>

                        <div className="flex gap-4 w-full">
                            <button
                                onClick={dismissWinner}
                                className="flex-1 py-3 px-4 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl transition-colors"
                            >
                                Cooldown
                            </button>
                            <button
                                onClick={completeWinner}
                                className="flex-1 py-3 px-4 bg-white text-slate-900 hover:bg-slate-200 font-bold rounded-xl transition-colors shadow-lg"
                            >
                                Complete Task
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}
