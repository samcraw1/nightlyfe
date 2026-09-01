import type { Webcam } from "@/types";

export const webcams: Webcam[] = [
  { id: "main-stage", name: "Main Stage", live: true, viewers: 1284, hue: 42 },
  { id: "vip-room", name: "VIP Room", live: true, viewers: 412, hue: 350 },
  { id: "lounge", name: "The Lounge", live: true, viewers: 233, hue: 270 },
  { id: "camera-2", name: "Camera 2", live: true, viewers: 158, hue: 190 },
  { id: "bar", name: "Gold Bar", live: false, viewers: 0, hue: 30 },
  { id: "patio", name: "Patio", live: false, viewers: 0, hue: 150 },
];

export function getWebcam(id: string): Webcam | undefined {
  return webcams.find((w) => w.id === id);
}
