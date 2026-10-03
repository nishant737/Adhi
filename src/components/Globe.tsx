"use client";

import { geoDistance, geoGraticule10, geoInterpolate, geoOrthographic, geoPath } from "d3-geo";
import type { GeoPermissibleObjects } from "d3-geo";
import type { LineString } from "geojson";
import type { GeometryCollection, Topology } from "topojson-specification";
import { useEffect, useRef, useState } from "react";
import { MANGALURU, destinations, type LabelSide } from "@/data/destinations";

// Centre of Mangaluru + all destinations; the first zoom step turns here and fits every route in view
const FOCUS: [number, number] = [36, 32];
const ROUTE_ZOOM = 1.25;
const DESTINATION_NAMES = destinations.map((d) => d.name).join(", ");
const MIN_ZOOM = 1;
const MAX_ZOOM = 4;

const BASE_SPEED = 14; // degrees per second when the route is out of view
const SLOW_FACTOR = 0.18; // fraction of that speed while the route faces the viewer
const DRAG_SENSITIVITY = 0.35; // degrees per pixel, divided by zoom
const RESUME_DELAY_MS = 3000; // auto-spin resumes this long after a drag (when not zoomed in)

type Controls = { zoomBy: (factor: number) => void };

export default function Globe({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const controls = useRef<Controls | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    let land: GeoPermissibleObjects | null = null;
    let frame = 0;
    let visible = true;
    let cancelled = false;
    let size = 0;
    let dash = 0;
    let last = performance.now();
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // Canvas text can't read CSS variables, so use the page's resolved font
    const fontFamily = getComputedStyle(document.body).fontFamily;

    // View state: rotation (lambda, phi) and zoom, each easing toward a target
    const view = { lambda: -FOCUS[0], phi: -FOCUS[1], zoom: 1 };
    const target = { ...view };
    let autoRotate = !reduceMotion;
    let flying = false;
    let dragging: { x: number; y: number } | null = null;
    let resumeTimer = 0;
    const resumeSpinLater = () => {
      clearTimeout(resumeTimer);
      if (reduceMotion) return;
      resumeTimer = window.setTimeout(() => {
        if (target.zoom <= MIN_ZOOM + 0.01) autoRotate = true;
      }, RESUME_DELAY_MS);
    };

    const projection = geoOrthographic().precision(0.5);
    const path = geoPath(projection, ctx);
    const graticule = geoGraticule10();
    // One route from Mangaluru to each destination
    const arcs: LineString[] = destinations.map((d) => {
      const interpolate = geoInterpolate(MANGALURU, d.coords);
      return { type: "LineString", coordinates: Array.from({ length: 48 }, (_, i) => interpolate(i / 47)) };
    });

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      size = canvas.clientWidth;
      canvas.width = size * dpr;
      canvas.height = size * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const isFacing = (coords: [number, number], center: [number, number]) =>
      geoDistance(coords, center) < Math.PI / 2 - 0.05;

    const drawPoint = (coords: [number, number], center: [number, number], text: string, side: LabelSide, bold = false) => {
      if (!isFacing(coords, center)) return;
      const p = projection(coords);
      if (!p || Math.hypot(p[0] - size / 2, p[1] - size / 2) > size / 2 - 4) return;
      ctx.beginPath();
      ctx.arc(p[0], p[1], bold ? 4 : 3, 0, Math.PI * 2);
      ctx.fillStyle = "#ffffff";
      ctx.fill();
      ctx.beginPath();
      ctx.arc(p[0], p[1], bold ? 9 : 7, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(255, 255, 255, 0.35)";
      ctx.lineWidth = 1;
      ctx.stroke();

      // Label on the chosen side of the dot, with a soft dark halo so it stays readable over routes
      const fontSize = Math.max(10, size * 0.03);
      ctx.font = `${bold ? 600 : 500} ${fontSize}px ${fontFamily}`;
      const w = ctx.measureText(text).width;
      const gap = 11;
      let x = p[0] + gap;
      let y = p[1] + fontSize * 0.35;
      if (side === "left") x = p[0] - gap - w;
      if (side === "above") { x = p[0] - w / 2; y = p[1] - gap; }
      if (side === "below") { x = p[0] - w / 2; y = p[1] + gap + fontSize * 0.7; }
      x = Math.min(size - w - 4, Math.max(4, x));
      ctx.lineJoin = "round";
      ctx.lineWidth = 3;
      ctx.strokeStyle = "rgba(11, 26, 51, 0.85)";
      ctx.strokeText(text, x, y);
      ctx.fillStyle = "rgba(255, 255, 255, 0.95)";
      ctx.fillText(text, x, y);
    };

    const draw = () => {
      const r = (size / 2 - 2) * view.zoom;
      projection.scale(r).translate([size / 2, size / 2]).rotate([view.lambda, view.phi]);
      ctx.clearRect(0, 0, size, size);

      // When zoomed in, show the globe through a round window instead of a square box
      const lens = size / 2 - 2;
      ctx.save();
      ctx.beginPath();
      ctx.arc(size / 2, size / 2, lens, 0, Math.PI * 2);
      ctx.clip();

      // Sphere with a soft inner glow
      const glow = ctx.createRadialGradient(size * 0.4, size * 0.35, r * 0.1, size / 2, size / 2, r);
      glow.addColorStop(0, "rgba(79, 123, 217, 0.22)");
      glow.addColorStop(1, "rgba(13, 33, 66, 0.05)");
      ctx.beginPath();
      path({ type: "Sphere" });
      ctx.fillStyle = glow;
      ctx.fill();
      ctx.strokeStyle = "rgba(126, 166, 255, 0.35)";
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.beginPath();
      path(graticule);
      ctx.strokeStyle = "rgba(126, 166, 255, 0.1)";
      ctx.lineWidth = 0.6;
      ctx.stroke();

      if (land) {
        ctx.beginPath();
        path(land);
        ctx.fillStyle = "rgba(126, 166, 255, 0.14)";
        ctx.fill();
        ctx.strokeStyle = "rgba(126, 166, 255, 0.4)";
        ctx.lineWidth = 0.6;
        ctx.stroke();
      }

      // Moving dashed routes from Mangaluru to every destination
      ctx.save();
      ctx.setLineDash([4, 6]);
      ctx.lineDashOffset = -dash;
      ctx.strokeStyle = "rgba(255, 255, 255, 0.75)";
      ctx.lineWidth = 1.3;
      arcs.forEach((arc) => {
        ctx.beginPath();
        path(arc);
        ctx.stroke();
      });
      ctx.restore();

      ctx.restore();

      if (view.zoom > 1.01) {
        ctx.beginPath();
        ctx.arc(size / 2, size / 2, lens, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(126, 166, 255, 0.35)";
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // Points and labels go on top of the round window so they're never cut off at its edge
      const center: [number, number] = [-view.lambda, -view.phi];
      destinations.forEach((d) => drawPoint(d.coords, center, d.name, d.side));
      drawPoint(MANGALURU, center, "Mangaluru", "below", true);
    };

    // Shortest signed difference between two longitudes
    const angleDiff = (a: number, b: number) => ((((b - a) % 360) + 540) % 360) - 180;

    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      const ease = 1 - Math.exp(-dt * 5);

      if (autoRotate && !dragging && !flying) {
        // Slow down while the routes are near the front, speed up elsewhere
        const offset = geoDistance([FOCUS[0], 0], [-target.lambda, 0]) / Math.PI;
        const t = Math.min(1, offset * 2.2);
        const smooth = t * t * (3 - 2 * t);
        target.lambda += BASE_SPEED * (SLOW_FACTOR + (1 - SLOW_FACTOR) * smooth) * dt;
      }

      view.lambda += angleDiff(view.lambda, target.lambda) * ease;
      view.phi += (target.phi - view.phi) * ease;
      view.zoom += (target.zoom - view.zoom) * ease;
      if (flying && Math.abs(angleDiff(view.lambda, target.lambda)) < 0.1 && Math.abs(target.zoom - view.zoom) < 0.01) {
        flying = false;
      }
      if (!reduceMotion) dash += 18 * dt;

      draw();
      if (visible) frame = requestAnimationFrame(tick);
    };

    const start = () => {
      cancelAnimationFrame(frame);
      last = performance.now();
      frame = requestAnimationFrame(tick);
    };

    // Drag to rotate (mouse, pen, or a sideways swipe on touch screens — vertical swipes still scroll)
    const onPointerDown = (e: PointerEvent) => {
      dragging = { x: e.clientX, y: e.clientY };
      flying = false;
      autoRotate = false;
      clearTimeout(resumeTimer);
      canvas.setPointerCapture(e.pointerId);
      canvas.style.cursor = "grabbing";
    };
    const onPointerMove = (e: PointerEvent) => {
      if (!dragging) return;
      const k = DRAG_SENSITIVITY / view.zoom;
      target.lambda += (e.clientX - dragging.x) * k;
      target.phi = Math.max(-80, Math.min(80, target.phi - (e.clientY - dragging.y) * k));
      dragging = { x: e.clientX, y: e.clientY };
    };
    const onPointerUp = () => {
      if (!dragging) return;
      dragging = null;
      canvas.style.cursor = "";
      resumeSpinLater();
    };
    canvas.addEventListener("pointerdown", onPointerDown);
    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerup", onPointerUp);
    canvas.addEventListener("pointercancel", onPointerUp);

    controls.current = {
      zoomBy: (factor) => {
        const zoomedOut = target.zoom <= MIN_ZOOM + 0.01;
        if (factor > 1 && zoomedOut) {
          // First zoom-in turns to the routes so every destination is in view
          autoRotate = false;
          flying = true;
          target.lambda = -FOCUS[0];
          target.phi = -FOCUS[1];
          target.zoom = ROUTE_ZOOM;
        } else {
          target.zoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, target.zoom * factor));
          if (target.zoom <= MIN_ZOOM + 0.01) {
            target.zoom = MIN_ZOOM;
            if (!reduceMotion) autoRotate = true;
          }
        }
        clearTimeout(resumeTimer);
        setZoomLevel(target.zoom);
      },
    };
    resize();
    draw();

    // Map data loads after first paint so it never blocks the page
    Promise.all([import("world-atlas/land-110m.json"), import("topojson-client")]).then(([landTopo, topojson]) => {
      if (cancelled) return;
      const topo = landTopo.default as unknown as Topology<{ land: GeometryCollection }>;
      land = topojson.feature(topo, topo.objects.land);
      draw();
    });

    // Only animate while the globe is on screen
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start();
      else cancelAnimationFrame(frame);
    });
    io.observe(canvas);

    const ro = new ResizeObserver(() => {
      resize();
      draw();
    });
    ro.observe(canvas);

    return () => {
      cancelled = true;
      clearTimeout(resumeTimer);
      cancelAnimationFrame(frame);
      io.disconnect();
      ro.disconnect();
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerup", onPointerUp);
      canvas.removeEventListener("pointercancel", onPointerUp);
      controls.current = null;
    };
  }, []);

  return (
    <div
      className={className}
    >
      <canvas
        ref={canvasRef}
        role="img"
        aria-label={`Globe showing routes from Mangaluru to ${DESTINATION_NAMES}`}
        className="mx-auto block aspect-square w-full max-w-[min(190px,20svh)] sm:max-w-[min(360px,38vh)] cursor-grab touch-pan-y select-none"
      />

      <div className="mt-3 flex justify-center sm:mt-5">
        <div className="flex overflow-hidden rounded-full border border-white/15 bg-white/5">
          <GlobeButton label="Zoom out" onClick={() => controls.current?.zoomBy(1 / 1.4)} disabled={zoomLevel <= MIN_ZOOM + 0.01}>
            <path d="M5 12h14" />
          </GlobeButton>
          <span aria-hidden className="w-px bg-white/15" />
          <GlobeButton label="Zoom in" onClick={() => controls.current?.zoomBy(1.4)} disabled={zoomLevel >= MAX_ZOOM - 0.01}>
            <path d="M12 5v14M5 12h14" />
          </GlobeButton>
        </div>
      </div>

      <p className="mt-3 hidden items-center justify-center gap-2 text-xs text-white/45 sm:flex">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M9 11V6a1.5 1.5 0 0 1 3 0v4m0-1a1.5 1.5 0 0 1 3 0v2m0-1a1.5 1.5 0 0 1 3 0v4a6 6 0 0 1-6 6h-1a6 6 0 0 1-5-2.7L4 14a1.5 1.5 0 0 1 2.4-1.8L9 15" />
        </svg>
        Drag to rotate · zoom in to see the routes
      </p>
    </div>
  );
}

function GlobeButton({
  label,
  onClick,
  disabled,
  children,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      disabled={disabled}
      className="flex h-9 w-10 items-center justify-center text-white transition-colors hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:bg-transparent"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        {children}
      </svg>
    </button>
  );
}
