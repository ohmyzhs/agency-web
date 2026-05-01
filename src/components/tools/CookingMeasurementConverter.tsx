"use client";

import { useMemo, useState } from "react";
import {
  cupsToGrams,
  gramsToCups,
  convertVolume,
  type CookingIngredient,
  type VolumeUnit,
} from "@/lib/calculators/conversions";

const ingredients: { value: CookingIngredient; label: string }[] = [
  { value: "water", label: "Water / milk-like liquids" },
  { value: "flour", label: "All-purpose flour" },
  { value: "sugar", label: "Granulated sugar" },
  { value: "butter", label: "Butter" },
];

const selectClass = "mt-1 block w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none";
const inputClass = selectClass;

export default function CookingMeasurementConverter() {
  const [value, setValue] = useState("1");
  const [fromUnit, setFromUnit] = useState<VolumeUnit>("cup");
  const [toUnit, setToUnit] = useState<VolumeUnit>("ml");
  const [ingredient, setIngredient] = useState<CookingIngredient>("flour");

  const numericValue = Number(value);
  const isValid = Number.isFinite(numericValue) && numericValue >= 0;

  const result = useMemo(() => {
    if (!isValid) return null;
    return convertVolume(numericValue, fromUnit, toUnit);
  }, [fromUnit, isValid, numericValue, toUnit]);

  const gramsResult = useMemo(() => {
    if (!isValid) return null;
    if (fromUnit === "cup") return cupsToGrams(numericValue, ingredient);
    if (fromUnit === "ml") return cupsToGrams(numericValue / 240, ingredient);
    return null;
  }, [fromUnit, ingredient, isValid, numericValue]);

  const cupsFromGrams = useMemo(() => (isValid ? gramsToCups(numericValue, ingredient) : null), [ingredient, isValid, numericValue]);

  return (
    <div className="space-y-4">
      <label className="block">
        <span className="text-sm font-medium">Amount</span>
        <input inputMode="decimal" value={value} onChange={(e) => setValue(e.target.value)} placeholder="1" className={inputClass} />
      </label>

      <div className="grid grid-cols-2 gap-3">
        <label className="block">
          <span className="text-sm font-medium">From</span>
          <select value={fromUnit} onChange={(e) => setFromUnit(e.target.value as VolumeUnit)} className={selectClass}>
            <option value="cup">cup</option>
            <option value="tbsp">tablespoon</option>
            <option value="tsp">teaspoon</option>
            <option value="ml">ml</option>
            <option value="l">liter</option>
          </select>
        </label>
        <label className="block">
          <span className="text-sm font-medium">To</span>
          <select value={toUnit} onChange={(e) => setToUnit(e.target.value as VolumeUnit)} className={selectClass}>
            <option value="ml">ml</option>
            <option value="cup">cup</option>
            <option value="tbsp">tablespoon</option>
            <option value="tsp">teaspoon</option>
            <option value="l">liter</option>
          </select>
        </label>
      </div>

      <label className="block">
        <span className="text-sm font-medium">Ingredient for gram estimate</span>
        <select value={ingredient} onChange={(e) => setIngredient(e.target.value as CookingIngredient)} className={selectClass}>
          {ingredients.map((item) => (
            <option key={item.value} value={item.value}>{item.label}</option>
          ))}
        </select>
      </label>

      <output className="block rounded-lg bg-accent p-4">
        {result === null ? (
          <span className="text-sm text-muted">Enter a positive amount.</span>
        ) : (
          <div className="space-y-1">
            <strong className="block text-xl">{result.toLocaleString()} {toUnit}</strong>
            {gramsResult !== null && <span className="block text-sm text-muted">Approx. {gramsResult.toLocaleString()} g for selected ingredient.</span>}
            {fromUnit !== "cup" && fromUnit !== "ml" && <span className="block text-sm text-muted">Volume conversion shown. Gram estimate is best from cups or ml.</span>}
            <span className="block text-sm text-muted">If the number is grams, {numericValue.toLocaleString()} g is about {cupsFromGrams?.toLocaleString()} cups for the selected ingredient.</span>
          </div>
        )}
      </output>
    </div>
  );
}
