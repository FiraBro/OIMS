import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const StepVisibility = ({ isActive, setIsActive, isPublic, setIsPublic }) => {
  return (
    <Card className="border border-gray-200">
      <CardHeader>
        <CardTitle>Plan Visibility</CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Active Status */}
        <div className="flex items-center justify-between">
          <Label>Plan Active</Label>
          <Switch checked={isActive} onCheckedChange={setIsActive} />
        </div>

        {/* Public Visibility */}
        <div className="flex items-center justify-between">
          <Label>Publicly Visible</Label>
          <Switch checked={isPublic} onCheckedChange={setIsPublic} />
        </div>
      </CardContent>
    </Card>
  );
};

export default StepVisibility;
