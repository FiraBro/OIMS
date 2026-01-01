import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const StepFeatures = ({ features = [], setFeatures }) => {
  const addFeature = () => {
    setFeatures([...features, ""]);
  };

  const updateFeature = (index, value) => {
    const updated = [...features];
    updated[index] = value;
    setFeatures(updated);
  };

  const removeFeature = (index) => {
    setFeatures(features.filter((_, i) => i !== index));
  };

  return (
    <Card className="border border-gray-200">
      <CardHeader>
        <CardTitle>Plan Features</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {features.map((feature, index) => (
          <div key={index} className="flex gap-2">
            <Input
              placeholder={`Feature ${index + 1}`}
              value={feature}
              onChange={(e) => updateFeature(index, e.target.value)}
            />
            <Button
              variant="destructive"
              type="button"
              onClick={() => removeFeature(index)}
            >
              Remove
            </Button>
          </div>
        ))}

        <Button type="button" onClick={addFeature}>
          + Add Feature
        </Button>
      </CardContent>
    </Card>
  );
};

export default StepFeatures;
