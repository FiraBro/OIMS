import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiMessageSquare,
  FiPhone,
  FiClock,
  FiSearch,
  FiChevronDown,
  FiChevronUp,
  FiShield,
  FiBriefcase,
  FiHome,
  FiTruck,
} from "react-icons/fi";

// Shadcn UI Imports
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

const GeneralSupportPage = () => {
  const [expandedFaq, setExpandedFaq] = useState(null);

  const generalFaqs = [
    {
      id: 1,
      question: "How do I add a new asset to my portfolio?",
      answer:
        "Navigate to your Dashboard, select 'Add Policy', and choose the asset type (Vehicle, Property, or Life). Our system will guide you through the required valuation documents.",
      category: "Asset Management",
    },
    {
      id: 2,
      question: "What is the claim window for Motor accidents?",
      answer:
        "For Motor insurance, incidents must be reported within 24-48 hours. Ensure you upload photos of the damage and a copy of the police report via the 'File a Claim' tab.",
      category: "Claims",
    },
    {
      id: 3,
      question: "Can I combine multiple policies into one premium?",
      answer:
        "Yes, our 'Multi-Policy Discount' allows you to bundle Life, Home, and Auto. This results in a single monthly payment and a reduced overall rate.",
      category: "Billing",
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAFBFF] pb-20">
      {/* Premium Hero Section */}
      <section className="relative overflow-hidden bg-[#0A1128] py-24">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
        <div className="relative max-w-6xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Badge className="mb-4 bg-blue-500/20 text-blue-400 border-none px-4 py-1">
              OIMS Global Support
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              How can we <span className="text-blue-500">help you today?</span>
            </h1>
            <p className="text-gray-400 text-lg mb-10 max-w-2xl mx-auto">
              Secure assistance for your Life, Motor, and Property insurance
              assets.
            </p>

            <div className="relative max-w-2xl mx-auto">
              <div className="relative flex items-center bg-white rounded-2xl p-2 shadow-2xl">
                <FiSearch className="ml-4 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Search policy guides, claims, and more..."
                  className="border-none focus-visible:ring-0 text-gray-800 text-lg shadow-none"
                />
                <Button className="rounded-xl px-8 bg-blue-600 hover:bg-blue-700 text-white font-bold h-12 transition-all">
                  Search
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Department Routing Grid */}
      <div className="max-w-7xl mx-auto px-6 -mt-10 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {
              icon: <FiTruck />,
              label: "Motor Support",
              color: "hover:border-blue-500",
            },
            {
              icon: <FiHome />,
              label: "Property Desk",
              color: "hover:border-emerald-500",
            },
            {
              icon: <FiShield />,
              label: "Life & Health",
              color: "hover:border-purple-500",
            },
            {
              icon: <FiBriefcase />,
              label: "Commercial",
              color: "hover:border-orange-500",
            },
          ].map((dept, i) => (
            <Card
              key={i}
              className={`cursor-pointer transition-all border-none shadow-lg shadow-blue-900/5 ${dept.color} hover:-translate-y-1`}
            >
              <CardContent className="p-6 text-center flex flex-col items-center">
                <div className="mb-3 text-2xl text-blue-600/80">
                  {dept.icon}
                </div>
                <p className="font-bold text-gray-800 text-sm">{dept.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-12 gap-12">
          {/* Main Support Form */}
          <div className="lg:col-span-7">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">
              Open a Support Ticket
            </h2>
            <form className="space-y-6 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-sm font-bold text-gray-600">
                    Inquiry Category
                  </Label>
                  <Select>
                    <SelectTrigger className="h-12 rounded-xl border-gray-200 focus:ring-blue-500">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#fff] border border-gray-200 shadow-lg">
                      <SelectItem value="general">
                        General Policy Question
                      </SelectItem>
                      <SelectItem value="asset">
                        New Asset Registration
                      </SelectItem>
                      <SelectItem value="claim">Claim Status Update</SelectItem>
                      <SelectItem value="billing">Premium & Billing</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-bold text-gray-600">
                    Policy Number (Optional)
                  </Label>
                  <Input
                    placeholder="e.g. POL-88902"
                    className="h-12 rounded-xl border-gray-200 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-bold text-gray-600">
                  Detailed Message
                </Label>
                <Textarea
                  placeholder="Describe your request in detail..."
                  className="min-h-[160px] rounded-2xl border-gray-200 focus:border-blue-500 bg-gray-50/30"
                />
              </div>

              <Button className="w-full md:w-auto bg-blue-600 text-white px-10 h-12 rounded-xl font-bold shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all">
                Submit Ticket
              </Button>
            </form>
          </div>

          {/* FAQ and Contact Sidebar */}
          <div className="lg:col-span-5 space-y-8">
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-100 bg-gray-50/50 font-bold text-gray-800">
                Common Questions
              </div>
              <div className="divide-y divide-gray-50">
                {generalFaqs.map((faq) => (
                  <div key={faq.id} className="p-4">
                    <button
                      onClick={() =>
                        setExpandedFaq(expandedFaq === faq.id ? null : faq.id)
                      }
                      className="w-full flex justify-between items-center text-left group"
                    >
                      <span className="font-semibold text-gray-700 group-hover:text-blue-600 transition-colors pr-4">
                        {faq.question}
                      </span>
                      {expandedFaq === faq.id ? (
                        <FiChevronUp className="text-blue-600" />
                      ) : (
                        <FiChevronDown className="text-gray-400" />
                      )}
                    </button>
                    <AnimatePresence>
                      {expandedFaq === faq.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="mt-3 text-sm text-gray-500 leading-relaxed"
                        >
                          {faq.answer}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Contact Card */}
            <Card className="bg-[#0A1128] text-white rounded-3xl border-none shadow-2xl p-4 overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -mr-16 -mt-16" />
              <CardContent className="space-y-6 pt-4 relative z-10">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-white/10 rounded-xl">
                    <FiPhone className="text-blue-400" />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                      Global Hotline
                    </p>
                    <p className="text-lg font-bold">+251 123 456 789</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-white/10 rounded-xl">
                    <FiClock className="text-blue-400" />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                      Support Window
                    </p>
                    <p className="text-lg font-bold">08:00 - 18:00 (EAT)</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Floating Chat */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-10 right-10 bg-blue-600 hover:bg-blue-700 text-white p-4 h-16 w-16 rounded-full shadow-2xl shadow-blue-500/50 flex items-center justify-center"
      >
        <FiMessageSquare size={24} />
      </motion.button>
    </div>
  );
};

export default GeneralSupportPage;
