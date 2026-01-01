import React from "react";
import { Input } from "@/components/ui/input";

export default function StepPricing({ form, update }) {
  return (
    <div className="grid md:grid-cols-3 gap-4">
      <Input
        type="number"
        placeholder="Premium"
        value={form.premium}
        onChange={(e) => update("premium", +e.target.value)}
      />
      <Input
        type="number"
        placeholder="Coverage Amount"
        value={form.coverageAmount}
        onChange={(e) => update("coverageAmount", +e.target.value)}
      />
      <Input
        type="number"
        placeholder="Deductible"
        value={form.deductible}
        onChange={(e) => update("deductible", +e.target.value)}
      />
    </div>
  );
}
