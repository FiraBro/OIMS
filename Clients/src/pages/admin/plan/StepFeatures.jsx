import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Plus } from "lucide-react";

const StepFeatures = ({ features = [], setFeatures }) => {
  // Common light gray style
  const lightBorderStyle =
    "border-gray-200 focus:border-gray-300 focus:ring-1 focus:ring-gray-300";

  const addFeature = (e) => {
    e.preventDefault();
    setFeatures([...features, ""]);
  };

  const updateFeature = (index, value) => {
    const updated = [...features];
    updated[index] = value;
    setFeatures(updated);
  };

  const removeFeature = (e, index) => {
    e.preventDefault();
    // Keep at least one input visible if you prefer
    if (features.length > 1) {
      setFeatures(features.filter((_, i) => i !== index));
    } else {
      setFeatures([""]); // Reset the single input instead of removing it
    }
  };

  return (
    <Card className="border-gray-200 shadow-none">
      <CardHeader>
        <CardTitle className="text-lg font-medium">Plan Features</CardTitle>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* If features is empty, this map won't show anything */}
        {features.map((feature, index) => (
          <div key={index} className="flex gap-2">
            <Input
              className={lightBorderStyle}
              placeholder={`Feature #${index + 1}`}
              value={feature}
              onChange={(e) => updateFeature(index, e.target.value)}
            />
            <Button
              variant="outline"
              size="icon"
              type="button"
              className="border-gray-200 text-gray-400 hover:text-red-500 hover:border-red-200 shrink-0"
              onClick={(e) => removeFeature(e, index)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}

        <Button
          type="button"
          variant="outline"
          className="w-full border-dashed border-gray-300 text-gray-500 hover:bg-gray-50 hover:border-gray-400"
          onClick={addFeature}
        >
          <Plus className="mr-2 h-4 w-4" /> Add Feature
        </Button>

        {features.length === 0 && (
          <p className="text-sm text-gray-400 text-center py-2">
            No features added. Click the button above to start.
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default StepFeatures;
