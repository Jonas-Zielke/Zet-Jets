export const airports = Array.from({ length: 100 }, (_, i) => ({
  code: `APT${i + 1}`,
  name: `Airport ${i + 1}`,
}));

export default function Airports() {
  return null;
}
