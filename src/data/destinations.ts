// Countries shown on the globe and around the site — edit this list to change them.
// [longitude, latitude] of a point inside each country.
export const MANGALURU: [number, number] = [74.86, 12.91];

export type LabelSide = "left" | "right" | "above" | "below";
export const destinations: { name: string; coords: [number, number]; side: LabelSide }[] = [
  { name: "Germany", coords: [10.45, 51.17], side: "right" },
  { name: "Israel", coords: [34.85, 31.05], side: "left" },
  { name: "UAE", coords: [54.37, 24.45], side: "above" },
  { name: "UK", coords: [-1.5, 52.6], side: "left" },
];
