import { useState } from "react";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Upload, FileText, Shield, DollarSign } from "lucide-react";
import api from "@/services/api";

export default function ClaimsManagement() {
  const [formData, setFormData] = useState({
    policyNumber: "",
    claimType: "",
    description: "",
    amount: "",
  });

  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (value) => {
    setFormData({ ...formData, claimType: value });
  };

  const handleFile = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFileName(selectedFile.name);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        data.append(key, formData[key]);
      });

      if (file) data.append("document", file);

      await api.post("/claims/create", data);
      toast.success(
        "Claim submitted successfully! Our team will review it shortly."
      );

      setFormData({
        policyNumber: "",
        claimType: "",
        description: "",
        amount: "",
      });
      setFile(null);
      setFileName("");
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Failed to submit claim. Please try again."
      );
    }

    setLoading(false);
  };

  const claimTypes = [
    { value: "Accident", label: "Accident Claim" },
    { value: "Medical", label: "Medical Expense" },
    { value: "Property Damage", label: "Property Damage" },
    { value: "Theft", label: "Theft/Loss" },
    { value: "Liability", label: "Third Party Liability" },
    { value: "Natural Disaster", label: "Natural Disaster" },
  ];

  return (
    <div className="min-h-screen bg-[#fff] md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Claims Management Portal
          </h1>
          <p className="text-gray-600">
            Submit your insurance claim quickly and securely
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <Card className="border border-gray-200 border-l-4 border-l-blue-500 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-blue-500" />
                  What You'll Need
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <div className="h-2 w-2 bg-blue-500 rounded-full mt-1.5"></div>
                    Valid policy number
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="h-2 w-2 bg-blue-500 rounded-full mt-1.5"></div>
                    Incident details and description
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="h-2 w-2 bg-blue-500 rounded-full mt-1.5"></div>
                    Supporting documents (receipts, photos, reports)
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="h-2 w-2 bg-blue-500 rounded-full mt-1.5"></div>
                    Claim amount with breakdown if available
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border border-gray-200 border-l-4 border-l-blue-500 shadow-sm">
              <CardHeader>
                <CardTitle className="text-base">Processing Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                      Initial Review
                    </span>
                    <span className="text-sm font-medium">
                      1-2 Business Days
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Assessment</span>
                    <span className="text-sm font-medium">
                      3-5 Business Days
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                      Final Decision
                    </span>
                    <span className="text-sm font-medium">
                      7-10 Business Days
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2">
            <Card className="shadow-lg border border-gray-200 border-r-4 border-r-blue-500 ">
              <CardHeader className="border-b border-gray-200">
                <CardTitle>Submit New Claim</CardTitle>
                <CardDescription>
                  Fill in all required fields to process your claim efficiently
                </CardDescription>
              </CardHeader>

              <CardContent className="pt-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Policy Number */}
                    <div className="space-y-2">
                      <Label
                        htmlFor="policyNumber"
                        className="flex items-center gap-2"
                      >
                        <Shield className="h-4 w-4" />
                        Policy Number *
                      </Label>
                      <Input
                        id="policyNumber"
                        name="policyNumber"
                        value={formData.policyNumber}
                        onChange={handleChange}
                        placeholder="e.g., POL-2024-001234"
                        className="h-11 border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-200"
                        required
                      />
                    </div>

                    {/* Claim Type - FIXED: Added positioning props to SelectContent */}
                    <div className="space-y-2 relative">
                      <Label htmlFor="claimType">Claim Type *</Label>
                      <Select
                        value={formData.claimType}
                        onValueChange={handleSelectChange}
                      >
                        <SelectTrigger className="h-11 border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-200">
                          <SelectValue placeholder="Select claim type" />
                        </SelectTrigger>
                        <SelectContent
                          position="popper"
                          sideOffset={5}
                          className="z-50 bg-white border border-gray-200 rounded-md shadow-lg w-full min-w-[var(--radix-select-trigger-width)]"
                        >
                          {claimTypes.map((type) => (
                            <SelectItem
                              key={type.value}
                              value={type.value}
                              className="cursor-pointer bg-white hover:bg-gray-100"
                            >
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Claim Amount */}
                    <div className="space-y-2">
                      <Label
                        htmlFor="amount"
                        className="flex items-center gap-2"
                      >
                        <DollarSign className="h-4 w-4" />
                        Claim Amount *
                      </Label>
                      <Input
                        id="amount"
                        name="amount"
                        type="number"
                        value={formData.amount}
                        onChange={handleChange}
                        placeholder="0.00"
                        className="h-11 border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-200"
                        required
                      />
                    </div>

                    {/* File Upload */}
                    <div className="space-y-2">
                      <Label htmlFor="document">Supporting Document *</Label>
                      <div className="relative">
                        <Input
                          id="document"
                          type="file"
                          onChange={handleFile}
                          className="sr-only"
                          required
                        />
                        <Label
                          htmlFor="document"
                          className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
                        >
                          <Upload className="h-8 w-8 text-gray-400 mb-2" />
                          <span className="text-sm text-gray-600">
                            {fileName || "Click to upload"}
                          </span>
                          <span className="text-xs text-gray-500 mt-1">
                            PDF, JPG, PNG up to 10MB
                          </span>
                        </Label>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="description"
                      className="flex items-center gap-2"
                    >
                      <FileText className="h-4 w-4" />
                      Incident Description *
                    </Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Please provide a detailed description of the incident..."
                      className="min-h-[120px] resize-none border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-200"
                      required
                    />
                    <p className="text-xs text-gray-500">
                      Include date, time, location, and any other relevant
                      details
                    </p>
                  </div>

                  {/* Submit */}
                  <div className="pt-4">
                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full h-12 text-white font-medium bg-blue-600 hover:bg-blue-500 cursor-pointer"
                      size="lg"
                    >
                      {loading ? (
                        <>
                          <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                          Processing Your Claim...
                        </>
                      ) : (
                        "Submit Claim for Review"
                      )}
                    </Button>

                    <p className="text-xs text-gray-500 text-center mt-3">
                      By submitting, you confirm that all information provided
                      is accurate
                    </p>
                  </div>
                </form>
              </CardContent>
            </Card>

            <div className="mt-6 text-center text-sm text-gray-500">
              Need assistance? Contact our claims support team at{" "}
              <a
                href="tel:+18001234567"
                className="text-blue-600 hover:underline"
              >
                1-800-123-4567
              </a>{" "}
              or{" "}
              <a
                href="mailto:claims@insurance.com"
                className="text-blue-600 hover:underline"
              >
                claims@insurance.com
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
