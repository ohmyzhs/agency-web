"use client";

import { useMemo, useState } from "react";
import {
  celsiusToFahrenheit,
  convertLength,
  convertVolume,
  convertWeight,
  fahrenheitToCelsius,
  pyeongToSquareMeters,
  squareMetersToPyeong,
  type LengthUnit,
  type VolumeUnit,
  type WeightUnit,
} from "@/lib/calculators/conversions";

type UnitKind = "length" | "weight" | "volume" | "temperature" | "area";

const unitOptions = {
  length: ["mm", "cm", "m", "km", "in", "ft", "yd", "mi"] as LengthUnit[],
  weight: ["g", "kg", "oz", "lb"] as WeightUnit[],
  volume: ["ml", "l", "tsp", "tbsp", "cup"] as VolumeUnit[],
  temperature: ["c", "f"] as const,
  area: ["pyeong", "m2"] as const,
};

const selectClass = "mt-1 block w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none";

export default function UnitConverter() {
  const [kind, setKind] = useState<UnitKind>("length");
  const [value, setValue] = useState("10");
  const [from, setFrom] = useState("mi");
  const [to, setTo] = useState("km");

  function changeKind(nextKind: UnitKind) {
    setKind(nextKind);
    const options = unitOptions[nextKind];
    setFrom(options[0]);
    setTo(options[1] ?? options[0]);
  }

  const result = useMemo(() => {
    const numericValue = Number(value);
    if (!Number.isFinite(numericValue)) return null;

    if (kind === "length") return convertLength(numericValue, from as LengthUnit, to as LengthUnit);
    if (kind === "weight") return convertWeight(numericValue, from as WeightUnit, to as WeightUnit);
    if (kind === "volume") return convertVolume(numericValue, from as VolumeUnit, to as VolumeUnit);
    if (kind === "temperature") {
      if (from === to) return numericValue;
      return from === "c" ? celsiusToFahrenheit(numericValue) : fahrenheitToCelsius(numericValue);
    }
    if (kind === "area") {
      if (from === to) return numericValue;
      return from === "pyeong" ? pyeongToSquareMeters(numericValue) : squareMetersToPyeong(numericValue);
    }

    return null;
  }, [from, kind, to, value]);

  return (
    <div className="space-y-4">
      <label className="block">
        <span className="text-sm font-medium">Conversion type</span>
        <select value={kind} onChange={(e) => changeKind(e.target.value as UnitKind)} className={selectClass}>
          <option value="length">Length</option>
          <option value="weight">Weight</option>
          <option value="volume">Volume</option>
          <option value="temperature">Temperature</option>
          <option value="area">Area</option>
        </select>
      </label>

      <div className="grid grid-cols-3 gap-3">
        <label className="block">
          <span className="text-sm font-medium">Value</span>
          <input inputMode="decimal" value={value} onChange={(e) => setValue(e.target.value)} className={selectClass} />
        </label>
        <label className="block">
          <span className="text-sm font-medium">From</span>
          <select value={from} onChange={(e) => setFrom(e.target.value)} className={selectClass}>
            {unitOptions[kind].map((unit) => (
              <option key={unit} value={unit}>{unit}</option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="text-sm font-medium">To</span>
          <select value={to} onChange={(e) => setTo(e.target.value)} className={selectClass}>
            {unitOptions[kind].map((unit) => (
              <option key={unit} value={unit}>{unit}</option>
            ))}
          </select>
        </label>
      </div>

      <output className="block rounded-lg bg-accent p-4">
        {result === null ? (
          <span className="text-sm text-muted">Enter a valid number.</span>
        ) : (
          <strong className="block text-xl">{result.toLocaleString()} {to}</strong>
        )}
      </output>
    </div>
  );
}
