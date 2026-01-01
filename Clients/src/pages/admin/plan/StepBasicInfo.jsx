import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function StepBasicInfo({ form, update }) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Basic Information</h2>

      <Input
        placeholder="Plan Name"
        value={form.name}
        onChange={(e) => update("name", e.target.value)}
      />

      <Input
        placeholder="Short Description"
        value={form.shortDescription}
        onChange={(e) => update("shortDescription", e.target.value)}
      />

      <Textarea
        placeholder="Full Description"
        value={form.description}
        onChange={(e) => update("description", e.target.value)}
      />
    </div>
  );
}
