const PYEONG_TO_SQUARE_METERS = 3.305785;

export function pyeongToSquareMeters(pyeong: number): number {
  return round(pyeong * PYEONG_TO_SQUARE_METERS, 2);
}

export function squareMetersToPyeong(squareMeters: number): number {
  return round(squareMeters / PYEONG_TO_SQUARE_METERS, 2);
}

export type LengthUnit = "mm" | "cm" | "m" | "km" | "in" | "ft" | "yd" | "mi";
export type WeightUnit = "g" | "kg" | "oz" | "lb";
export type VolumeUnit = "ml" | "l" | "tsp" | "tbsp" | "cup";

type UnitMap<T extends string> = Record<T, number>;

const lengthToMeters: UnitMap<LengthUnit> = {
  mm: 0.001,
  cm: 0.01,
  m: 1,
  km: 1000,
  in: 0.0254,
  ft: 0.3048,
  yd: 0.9144,
  mi: 1609.344,
};

const weightToGrams: UnitMap<WeightUnit> = {
  g: 1,
  kg: 1000,
  oz: 28.349523125,
  lb: 453.59237,
};

const volumeToMilliliters: UnitMap<VolumeUnit> = {
  ml: 1,
  l: 1000,
  tsp: 5,
  tbsp: 15,
  cup: 240,
};

export function convertLength(value: number, from: LengthUnit, to: LengthUnit): number {
  return round((value * lengthToMeters[from]) / lengthToMeters[to], 4);
}

export function convertWeight(value: number, from: WeightUnit, to: WeightUnit): number {
  return round((value * weightToGrams[from]) / weightToGrams[to], 4);
}

export function convertVolume(value: number, from: VolumeUnit, to: VolumeUnit): number {
  return round((value * volumeToMilliliters[from]) / volumeToMilliliters[to], 4);
}

export function celsiusToFahrenheit(celsius: number): number {
  return round((celsius * 9) / 5 + 32, 2);
}

export function fahrenheitToCelsius(fahrenheit: number): number {
  return round(((fahrenheit - 32) * 5) / 9, 2);
}

export type ShoeSizeReference = {
  krMm: number;
  usMen?: number;
  usWomen?: number;
  uk?: number;
  eu?: number;
  jpCm: number;
};

export const koreanShoeSizeReferences: ShoeSizeReference[] = [
  { krMm: 220, usWomen: 5, uk: 3, eu: 35, jpCm: 22 },
  { krMm: 230, usWomen: 6, uk: 4, eu: 36, jpCm: 23 },
  { krMm: 240, usWomen: 7, uk: 5, eu: 38, jpCm: 24 },
  { krMm: 250, usMen: 7, usWomen: 8, uk: 6, eu: 39, jpCm: 25 },
  { krMm: 260, usMen: 8, usWomen: 9, uk: 7, eu: 41, jpCm: 26 },
  { krMm: 270, usMen: 9, uk: 8, eu: 42, jpCm: 27 },
  { krMm: 280, usMen: 10, uk: 9, eu: 44, jpCm: 28 },
  { krMm: 290, usMen: 11, uk: 10, eu: 45, jpCm: 29 },
];

export function findNearestKoreanShoeSize(krMm: number): ShoeSizeReference {
  return koreanShoeSizeReferences.reduce((nearest, current) =>
    Math.abs(current.krMm - krMm) < Math.abs(nearest.krMm - krMm) ? current : nearest,
  );
}

export type CookingIngredient = "water" | "flour" | "sugar" | "butter";

const gramsPerCup: Record<CookingIngredient, number> = {
  water: 240,
  flour: 120,
  sugar: 200,
  butter: 227,
};

export function cupsToGrams(cups: number, ingredient: CookingIngredient): number {
  return round(cups * gramsPerCup[ingredient], 1);
}

export function gramsToCups(grams: number, ingredient: CookingIngredient): number {
  return round(grams / gramsPerCup[ingredient], 3);
}

function round(value: number, digits: number): number {
  const factor = 10 ** digits;
  return Math.round((value + Number.EPSILON) * factor) / factor;
}
