import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import {
  FiUser,
  FiMail,
  FiCalendar,
  FiPhone,
  FiCheckCircle,
  FiFile,
  FiArrowRight,
  FiArrowLeft,
  FiUpload,
  FiHeart,
  FiDollarSign,
  FiFileText,
  FiShield,
  FiChevronRight,
} from "react-icons/fi";

import { planService } from "@/services/planService";
import { applicationService } from "@/services/applicationService";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

export default function ApplyPlan() {
  const { id: planId } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null); // For file input

  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);

  const steps = [
    { id: 0, name: "Personal", icon: <FiUser /> },
    { id: 1, name: "Nominee", icon: <FiHeart /> },
    { id: 2, name: "Medical", icon: <FiShield /> },
    { id: 3, name: "Documents", icon: <FiFileText /> },
    { id: 4, name: "Payment", icon: <FiDollarSign /> },
    { id: 5, name: "Review", icon: <FiCheckCircle /> },
  ];

  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    personal: {},
    nominee: {},
    medical: {},
    files: [],
    payment: { frequency: "monthly", method: "online" },
    agree: false,
  });

  // Fetch plan details
  useEffect(() => {
    const fetchPlan = async () => {
      try {
        setLoading(true);
        const res = await planService.getPlanById(planId);
        console.log("res", res);
        setPlan(res.data); // <-- use res.data instead of res
      } catch (err) {
        toast.error("Failed to load plan details");
      } finally {
        setLoading(false);
      }
    };
    fetchPlan();
  }, [planId]);

  // Navigation
  const nextStep = () => {
    if (validateCurrentStep()) {
      setCurrentStep((s) => Math.min(s + 1, steps.length - 1));
    }
  };
  const prevStep = () => setCurrentStep((s) => Math.max(s - 1, 0));
  const goToStep = (stepIndex) => {
    if (stepIndex <= currentStep) setCurrentStep(stepIndex);
  };

  // Validation
  const validateCurrentStep = () => {
    switch (currentStep) {
      case 0:
        if (
          !formData.personal.fullName ||
          !formData.personal.email ||
          !formData.personal.phone
        ) {
          toast.error("Please fill in all required personal information");
          return false;
        }
        return true;
      case 1:
        if (plan.maxMembers > 1 && !formData.nominee.name) {
          toast.error("Please enter nominee name");
          return false;
        }
        return true;
      case 5:
        if (!formData.agree) {
          toast.error("You must agree to terms and conditions");
          return false;
        }
        return true;
      default:
        return true;
    }
  };

  // Form handlers
  const handleChange = (section, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: { ...prev[section], [field]: value },
    }));
  };

  const handleFileChange = (files) => {
    setFormData((prev) => ({ ...prev, files: [...files] }));
  };

  const handleSubmit = async () => {
    try {
      const form = new FormData();

      form.append("planId", planId);

      // Add start and end dates (example: take from formData.personal.dob as placeholder)
      form.append(
        "startDate",
        formData.personal.startDate || new Date().toISOString()
      );
      form.append(
        "endDate",
        formData.personal.endDate || new Date().toISOString()
      );

      // Add uploaded files
      formData.files.forEach((file) => form.append("documents", file));

      // You can also include other optional fields if backend expects them
      // e.g., personal info, nominee info, medical info as JSON string
      form.append("personal", JSON.stringify(formData.personal));
      form.append("nominee", JSON.stringify(formData.nominee));
      form.append("medical", JSON.stringify(formData.medical));
      form.append("payment", JSON.stringify(formData.payment));

      await applicationService.applyForPolicy(form);

      toast.success(
        <div>
          <p className="font-semibold">Application Submitted!</p>
          <p className="text-sm">We'll review your application shortly</p>
        </div>
      );
      navigate("/my-applications");
    } catch (err) {
      console.log(err);
      toast.error("Failed to submit application. Please try again.");
    }
  };

  const progress = ((currentStep + 1) / steps.length) * 100;

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading plan details...</p>
        </div>
      </div>
    );

  if (!plan)
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiShield className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Plan Not Found
            </h3>
            <p className="text-gray-600 mb-4">
              The insurance plan you're looking for doesn't exist or has been
              removed.
            </p>
            <Button onClick={() => navigate("/plans")}>Browse Plans</Button>
          </CardContent>
        </Card>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Apply for Insurance
          </h1>
          <p className="text-gray-600">
            Complete your application in a few simple steps
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Plan Summary & Progress */}
          <div className="lg:col-span-1 space-y-6 ">
            {/* Plan Summary Card */}
            <Card className="border-2 border-blue-100 shadow-sm">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <Badge className="mb-2 bg-blue-100 text-blue-800 hover:bg-blue-100">
                      {plan.premiumFrequency}
                    </Badge>
                    <h3 className="text-xl font-bold text-gray-900">
                      {plan.name}
                    </h3>
                    <p className="text-gray-600 text-sm mt-1">
                      Comprehensive coverage plan
                    </p>
                  </div>
                  <FiShield className="w-8 h-8 text-blue-600" />
                </div>
                <div className="space-y-3 mt-6">
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">Coverage Amount</span>
                    <span className="font-semibold text-gray-900">
                      {plan.coverageAmount}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">Premium</span>
                    <span className="font-semibold text-green-600 text-lg">
                      {plan.premium} / {plan.premiumFrequency}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">Waiting Period</span>
                    <span className="font-semibold">
                      {plan.waitingPeriod || "30 days"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600">Max Members</span>
                    <span className="font-semibold">
                      {plan.maxMembers || "Individual"}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Progress Steps */}
            <Card className="border-blue-100 shadow-lg">
              <CardContent className="pt-6">
                <div className="mb-6">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Progress</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
                <div className="space-y-2">
                  {steps.map((step) => (
                    <button
                      key={step.id}
                      onClick={() => goToStep(step.id)}
                      disabled={step.id > currentStep}
                      className={`w-full flex items-center p-3 rounded-lg transition-all ${
                        step.id === currentStep
                          ? "bg-blue-50 border border-blue-200"
                          : step.id < currentStep
                          ? "bg-green-50 border border-green-100"
                          : "bg-gray-50 hover:bg-gray-100"
                      } ${
                        step.id > currentStep
                          ? "cursor-not-allowed opacity-50"
                          : "cursor-pointer"
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                          step.id === currentStep
                            ? "bg-blue-600 text-white"
                            : step.id < currentStep
                            ? "bg-green-500 text-white"
                            : "bg-gray-200 text-gray-600"
                        }`}
                      >
                        {step.id < currentStep ? (
                          <FiCheckCircle className="w-4 h-4" />
                        ) : (
                          step.icon
                        )}
                      </div>
                      <div className="text-left">
                        <p
                          className={`font-medium ${
                            step.id === currentStep
                              ? "text-blue-700"
                              : step.id < currentStep
                              ? "text-green-700"
                              : "text-gray-600"
                          }`}
                        >
                          {step.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {step.id === currentStep
                            ? "In progress"
                            : step.id < currentStep
                            ? "Completed"
                            : "Pending"}
                        </p>
                      </div>
                      {step.id < currentStep && (
                        <FiChevronRight className="w-4 h-4 text-gray-400 ml-auto" />
                      )}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Form */}
          <div className="lg:col-span-2">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="shadow-lg border border-gray-200">
                <CardContent className="pt-8">
                  {/* Step Content */}
                  <div className="space-y-6">
                    {/* -- Add other steps here ... Personal, Nominee, Medical -- */}

                    {/* Personal Information */}
                    {currentStep === 0 && (
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div>
                            <Label
                              htmlFor="fullName"
                              className="flex items-center gap-1 mb-2"
                            >
                              Full Name <span className="text-red-500">*</span>
                            </Label>
                            <Input
                              id="fullName"
                              placeholder="John Doe"
                              value={formData.personal.fullName || ""}
                              onChange={(e) =>
                                handleChange(
                                  "personal",
                                  "fullName",
                                  e.target.value
                                )
                              }
                              className="h-12 focus:ring-blue-400 border border-gray-200"
                              leftIcon={<FiUser className="text-gray-400" />}
                            />
                          </div>
                          <div>
                            <Label
                              htmlFor="email"
                              className="flex items-center gap-1 mb-2"
                            >
                              Email <span className="text-red-500">*</span>
                            </Label>
                            <Input
                              id="email"
                              type="email"
                              placeholder="example@email.com"
                              value={formData.personal.email || ""}
                              onChange={(e) =>
                                handleChange(
                                  "personal",
                                  "email",
                                  e.target.value
                                )
                              }
                              className="h-12 focus:ring-blue-400 border border-gray-200"
                              leftIcon={<FiMail className="text-gray-400" />}
                            />
                          </div>
                        </div>
                        <div className="space-y-4">
                          <div>
                            <Label
                              htmlFor="phone"
                              className="flex items-center gap-1 mb-2"
                            >
                              Phone Number{" "}
                              <span className="text-red-500">*</span>
                            </Label>
                            <Input
                              id="phone"
                              placeholder="+2519XXXXXXXX"
                              value={formData.personal.phone || ""}
                              onChange={(e) =>
                                handleChange(
                                  "personal",
                                  "phone",
                                  e.target.value
                                )
                              }
                              className="h-12 focus:ring-blue-400 border border-gray-200"
                              leftIcon={<FiPhone className="text-gray-400" />}
                            />
                          </div>
                          <div>
                            <Label htmlFor="dob" className="mb-2">
                              Date of Birth
                            </Label>
                            <Input
                              id="dob"
                              type="date"
                              value={formData.personal.dob || ""}
                              onChange={(e) =>
                                handleChange("personal", "dob", e.target.value)
                              }
                              className="h-12 focus:ring-blue-400 border border-gray-200"
                              leftIcon={
                                <FiCalendar className="text-gray-400" />
                              }
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Nominee Information */}
                    {currentStep === 1 && plan.maxMembers > 1 && (
                      <div className="space-y-6">
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <div className="flex items-center">
                            <FiHeart className="w-5 h-5 text-blue-600 mr-2" />
                            <p className="text-sm text-blue-800">
                              Add a nominee to receive benefits in case of
                              unforeseen circumstances
                            </p>
                          </div>
                        </div>
                        <div className="grid md:grid-cols-2 gap-6">
                          <div>
                            <Label htmlFor="nomineeName" className="mb-2">
                              Nominee Full Name
                            </Label>
                            <Input
                              id="nomineeName"
                              placeholder="Jane Doe"
                              value={formData.nominee.name || ""}
                              onChange={(e) =>
                                handleChange("nominee", "name", e.target.value)
                              }
                              className="h-12 focus:ring-blue-400 border border-gray-200"
                            />
                          </div>
                          <div>
                            <Label htmlFor="relationship" className="mb-2">
                              Relationship
                            </Label>
                            <Select
                              value={formData.nominee.relationship || ""}
                              onValueChange={(val) =>
                                handleChange("nominee", "relationship", val)
                              }
                            >
                              <SelectTrigger className="h-12">
                                <SelectValue placeholder="Select relationship" />
                              </SelectTrigger>
                              <SelectContent className="bg-white border-gray-100">
                                <SelectItem value="spouse">Spouse</SelectItem>
                                <SelectItem value="child">Child</SelectItem>
                                <SelectItem value="parent">Parent</SelectItem>
                                <SelectItem value="sibling">Sibling</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Medical History */}
                    {currentStep === 2 && plan.requiresMedical && (
                      <div className="space-y-6">
                        <div className="bg-yellow-50 p-4 rounded-lg">
                          <div className="flex items-center">
                            <FiShield className="w-5 h-5 text-yellow-600 mr-2" />
                            <p className="text-sm text-yellow-800">
                              Please provide accurate medical information for
                              proper coverage assessment
                            </p>
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="medicalHistory" className="mb-2">
                            Medical History
                          </Label>
                          <Textarea
                            id="medicalHistory"
                            placeholder="Describe any pre-existing conditions, current medications, allergies, or past surgeries..."
                            value={formData.medical.history || ""}
                            onChange={(e) =>
                              handleChange("medical", "history", e.target.value)
                            }
                            className="min-h-[150px] focus:ring-blue-400 border border-gray-200"
                          />
                          <p className="text-xs text-gray-500 mt-2">
                            This information helps us provide you with the best
                            coverage options
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Document Upload */}
                    {currentStep === 3 && (
                      <div className="space-y-6">
                        <div>
                          <Label className="mb-4 block">
                            Required Documents
                          </Label>
                          <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-500 transition-colors">
                            <FiUpload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <p className="font-medium text-gray-700 mb-2">
                              Drag & drop files or click to upload
                            </p>
                            <p className="text-sm text-gray-500 mb-6">
                              Supported files: PDF, JPG, PNG (Max 10MB each)
                            </p>

                            {/* Hidden file input */}
                            <input
                              type="file"
                              multiple
                              ref={fileInputRef}
                              className="hidden"
                              onChange={(e) =>
                                handleFileChange(Array.from(e.target.files))
                              }
                            />

                            {/* Trigger Button */}
                            <Button
                              variant="outline"
                              type="button"
                              onClick={() => fileInputRef.current.click()}
                              className="cursor-pointer border-gray-200"
                            >
                              <FiFile className="mr-2" />
                              Choose Files
                            </Button>
                          </div>
                        </div>

                        {formData.files.length > 0 && (
                          <div className="space-y-3">
                            <Label>Uploaded Files</Label>
                            {formData.files.map((file, idx) => (
                              <div
                                key={idx}
                                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                              >
                                <div className="flex items-center">
                                  <FiFileText className="w-5 h-5 text-gray-400 mr-3" />
                                  <div>
                                    <p className="font-medium text-sm">
                                      {file.name}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                      {(file.size / 1024 / 1024).toFixed(2)} MB
                                    </p>
                                  </div>
                                </div>
                                <Badge variant="outline" className="bg-white">
                                  Uploaded
                                </Badge>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Payment Information */}
                    {currentStep === 4 && (
                      <div className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6 ">
                          <div>
                            <Label htmlFor="frequency" className="mb-2">
                              Payment Frequency
                            </Label>
                            <Select
                              value={formData.payment.frequency}
                              onValueChange={(val) =>
                                handleChange("payment", "frequency", val)
                              }
                              className="border border-gray-200 hover:border-gray-300 focus:border-blue-400 focus:ring focus:ring-blue-200 rounded-lg"
                            >
                              <SelectTrigger className="h-11 border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-200">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="bg-white border border-gray-200 rounded-lg shadow-md">
                                <SelectItem value="monthly">Monthly</SelectItem>
                                <SelectItem value="quarterly">
                                  Quarterly
                                </SelectItem>
                                <SelectItem value="yearly">Yearly</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor="method" className="mb-2">
                              Payment Method
                            </Label>
                            <Select
                              value={formData.payment.method}
                              onValueChange={(val) =>
                                handleChange("payment", "method", val)
                              }
                            >
                              <SelectTrigger className="h-11 border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-200">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="bg-white border-gray-100">
                                <SelectItem value="online">
                                  Online Payment
                                </SelectItem>
                                <SelectItem value="bank">
                                  Bank Transfer
                                </SelectItem>
                                <SelectItem value="mobile">
                                  Mobile Payment
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
                          <CardContent className="pt-6">
                            <div className="flex justify-between items-center">
                              <div>
                                <p className="text-gray-600">Total Premium</p>
                                <p className="text-3xl font-bold text-gray-900">
                                  {plan.premium}
                                </p>
                                <p className="text-sm text-gray-500">
                                  per {formData.payment.frequency}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="text-gray-600">Coverage</p>
                                <p className="text-xl font-semibold text-gray-900">
                                  {plan.coverageAmount}
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    )}

                    {/* Review & Submit */}
                    {currentStep === 5 && (
                      <div className="space-y-6">
                        <div className="bg-green-50 p-4 rounded-lg">
                          <div className="flex items-center">
                            <FiCheckCircle className="w-5 h-5 text-green-600 mr-2" />
                            <p className="text-sm text-green-800">
                              Review all information before submitting your
                              application
                            </p>
                          </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                          <Card className="border-blue-500">
                            <CardContent className="pt-6">
                              <h4 className="font-semibold text-gray-900 mb-4">
                                Plan Details
                              </h4>
                              <div className="space-y-3">
                                <div className="flex justify-between">
                                  <span className="text-gray-600">
                                    Plan Name
                                  </span>
                                  <span className="font-medium">
                                    {plan.name}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">
                                    Coverage
                                  </span>
                                  <span className="font-medium">
                                    {plan.coverageAmount}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Premium</span>
                                  <span className="font-medium text-green-600">
                                    {plan.premium} /{" "}
                                    {formData.payment.frequency}
                                  </span>
                                </div>
                              </div>
                            </CardContent>
                          </Card>

                          <Card className="border-blue-500">
                            <CardContent className="pt-6">
                              <h4 className="font-semibold text-gray-900 mb-4">
                                Personal Info
                              </h4>
                              <div className="space-y-3">
                                <div className="flex justify-between">
                                  <span className="text-gray-600">
                                    Full Name
                                  </span>
                                  <span className="font-medium">
                                    {formData.personal.fullName}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Email</span>
                                  <span className="font-medium">
                                    {formData.personal.email}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Phone</span>
                                  <span className="font-medium">
                                    {formData.personal.phone}
                                  </span>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </div>

                        {formData.nominee.name && (
                          <Card>
                            <CardContent className="pt-6">
                              <h4 className="font-semibold text-gray-900 mb-4">
                                Nominee Information
                              </h4>
                              <div className="space-y-2">
                                <p>
                                  <span className="text-gray-600">Name: </span>
                                  <span className="font-medium">
                                    {formData.nominee.name}
                                  </span>
                                </p>
                                <p>
                                  <span className="text-gray-600">
                                    Relationship:{" "}
                                  </span>
                                  <span className="font-medium">
                                    {formData.nominee.relationship}
                                  </span>
                                </p>
                              </div>
                            </CardContent>
                          </Card>
                        )}

                        <div className="pt-4 border-t border-gray-200">
                          <div className="flex items-start space-x-3">
                            <Checkbox
                              id="terms"
                              checked={formData.agree}
                              onCheckedChange={(val) =>
                                setFormData((prev) => ({ ...prev, agree: val }))
                              }
                              className="mt-1"
                            />
                            <Label
                              htmlFor="terms"
                              className="text-sm leading-tight cursor-pointer"
                            >
                              I agree to the{" "}
                              <a
                                href="/terms"
                                className="text-blue-600 hover:underline"
                              >
                                Terms and Conditions
                              </a>{" "}
                              and confirm that all provided information is
                              accurate to the best of my knowledge.
                            </Label>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Navigation buttons */}
                  <div className="flex justify-between items-center pt-8 mt-8 border-t border-gray-200">
                    <Button
                      variant="outline"
                      onClick={prevStep}
                      disabled={currentStep === 0}
                      className="gap-2 border-gray-100 cursor-pointer"
                    >
                      <FiArrowLeft /> Previous
                    </Button>
                    <div className="text-center text-sm text-gray-500">
                      Step {currentStep + 1} of {steps.length}
                    </div>
                    {currentStep < steps.length - 1 ? (
                      <Button
                        onClick={nextStep}
                        className="gap-2 cursor-pointer"
                      >
                        Next Step <FiArrowRight />
                      </Button>
                    ) : (
                      <Button
                        onClick={handleSubmit}
                        disabled={!formData.agree}
                        className="bg-green-600 hover:bg-green-700 gap-2 text-white cursor-pointer"
                      >
                        <FiCheckCircle /> Submit Application
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
