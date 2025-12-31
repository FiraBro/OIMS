import { useState } from "react";
import { motion } from "framer-motion";
import {
  FiDollarSign,
  FiFileText,
  FiTag,
  FiShield,
  FiUsers,
  FiCheckCircle,
} from "react-icons/fi";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";

const BORDER = "border border-gray-200";

export default function CreatePlanPage() {
  const [form, setForm] = useState({
    name: "",
    premium: "",
    coverageAmount: "",
    deductible: 500,
    premiumFrequency: "monthly",
    description: "",
    shortDescription: "",
    coverage: "",
    planType: "INDIVIDUAL",
    category: "Health Insurance",
    tags: [],
    features: [],
    exclusions: [],
    maxMembers: 1,
    minAge: 18,
    maxAge: 65,
    isPopular: false,
    isFeatured: false,
    status: "PUBLISHED",
  });

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleArrayInput = (key, value) => {
    handleChange(
      key,
      value.split(",").map((v) => v.trim())
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("PLAN PAYLOAD 👉", form);
    // TODO: connect API
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 space-y-6"
    >
      <h1 className="text-2xl font-semibold">Create Insurance Plan</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* BASIC INFO */}
        <Card className={BORDER}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FiFileText /> Basic Information
            </CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-4">
            <Input
              className={BORDER}
              placeholder="Plan Name"
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
            />
            <Input
              className={BORDER}
              placeholder="Category"
              value={form.category}
              onChange={(e) => handleChange("category", e.target.value)}
            />
            <Textarea
              className={`${BORDER} md:col-span-2`}
              placeholder="Short Description"
              value={form.shortDescription}
              onChange={(e) => handleChange("shortDescription", e.target.value)}
            />
            <Textarea
              className={`${BORDER} md:col-span-2`}
              placeholder="Full Description"
              value={form.description}
              onChange={(e) => handleChange("description", e.target.value)}
            />
          </CardContent>
        </Card>

        {/* PRICING */}
        <Card className={BORDER}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FiDollarSign /> Pricing
            </CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-3 gap-4">
            <Input
              type="number"
              className={BORDER}
              placeholder="Premium"
              onChange={(e) => handleChange("premium", e.target.value)}
            />
            <Input
              type="number"
              className={BORDER}
              placeholder="Coverage Amount"
              onChange={(e) => handleChange("coverageAmount", e.target.value)}
            />
            <Input
              type="number"
              className={BORDER}
              placeholder="Deductible"
              value={form.deductible}
              onChange={(e) => handleChange("deductible", e.target.value)}
            />

            <Select
              value={form.premiumFrequency}
              onValueChange={(v) => handleChange("premiumFrequency", v)}
            >
              <SelectTrigger className={BORDER}>
                <SelectValue placeholder="Frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="quarterly">Quarterly</SelectItem>
                <SelectItem value="annually">Annually</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* FEATURES & TAGS */}
        <Card className={BORDER}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FiTag /> Features & Tags
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              className={BORDER}
              placeholder="Features (comma separated)"
              onChange={(e) => handleArrayInput("features", e.target.value)}
            />
            <Input
              className={BORDER}
              placeholder="Exclusions (comma separated)"
              onChange={(e) => handleArrayInput("exclusions", e.target.value)}
            />
            <Input
              className={BORDER}
              placeholder="Tags (comma separated)"
              onChange={(e) => handleArrayInput("tags", e.target.value)}
            />

            <div className="flex flex-wrap gap-2">
              {form.tags.map((tag, i) => (
                <Badge key={i} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* ELIGIBILITY */}
        <Card className={BORDER}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FiUsers /> Eligibility
            </CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-3 gap-4">
            <Input
              type="number"
              className={BORDER}
              placeholder="Max Members"
              onChange={(e) => handleChange("maxMembers", e.target.value)}
            />
            <Input
              type="number"
              className={BORDER}
              placeholder="Min Age"
              onChange={(e) => handleChange("minAge", e.target.value)}
            />
            <Input
              type="number"
              className={BORDER}
              placeholder="Max Age"
              onChange={(e) => handleChange("maxAge", e.target.value)}
            />
          </CardContent>
        </Card>

        {/* VISIBILITY */}
        <Card className={BORDER}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FiShield /> Visibility
            </CardTitle>
          </CardHeader>
          <CardContent className="flex gap-6">
            <label className="flex items-center gap-2">
              <Checkbox
                checked={form.isPopular}
                onCheckedChange={(v) => handleChange("isPopular", v)}
              />
              Popular
            </label>

            <label className="flex items-center gap-2">
              <Checkbox
                checked={form.isFeatured}
                onCheckedChange={(v) => handleChange("isFeatured", v)}
              />
              Featured
            </label>
          </CardContent>
        </Card>

        {/* ACTION */}
        <div className="flex justify-end">
          <Button type="submit" className="gap-2">
            <FiCheckCircle /> Create Plan
          </Button>
        </div>
      </form>
    </motion.div>
  );
}
