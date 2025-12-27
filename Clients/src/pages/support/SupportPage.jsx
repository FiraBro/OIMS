import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiMessageSquare,
  FiPhone,
  FiMail,
  FiHelpCircle,
  FiClock,
  FiMapPin,
  FiSearch,
  FiChevronDown,
  FiChevronUp,
  FiAlertCircle,
  FiBookOpen,
  FiVideo,
  FiArrowRight,
  FiShield,
  FiBriefcase,
  FiHome,
  FiTruck,
} from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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
    <div className="min-h-screen bg-[#FAFBFF]">
      {/* Premium Hero Section */}
      <section className="relative overflow-hidden bg-[#0A1128] py-24">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
        <div className="relative max-w-6xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Badge className="mb-4 bg-blue-500/20 text-blue-400 border-none px-4">
              Help & Support
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              OIMS Global <span className="text-blue-500">Support Center</span>
            </h1>
            <p className="text-gray-400 text-lg mb-10 max-w-2xl mx-auto">
              Expert assistance for Life, Motor, and Property insurance
              management.
            </p>

            <div className="relative max-w-2xl mx-auto">
              <div className="relative flex items-center bg-white rounded-2xl p-2 shadow-2xl">
                <FiSearch className="ml-4 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Ask a question (e.g., 'how to file a car claim'...)"
                  className="border-none focus-visible:ring-0 text-gray-800 text-lg"
                />
                <Button className="rounded-xl px-8 bg-blue-600 hover:bg-blue-700 text-white font-bold">
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
              className={`cursor-pointer transition-all border border-gray-100 shadow-sm ${dept.color}`}
            >
              <CardContent className="p-6 text-center flex flex-col items-center">
                <div className="mb-3 text-2xl text-gray-600">{dept.icon}</div>
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
              Submit a Formal Inquiry
            </h2>
            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-600">
                    Inquiry Category
                  </label>
                  <select className="w-full h-12 px-4 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-blue-500 outline-none">
                    <option>General Policy Question</option>
                    <option>New Asset Registration</option>
                    <option>Claim Status Update</option>
                    <option>Premium & Billing</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-600">
                    Policy Number (Optional)
                  </label>
                  <Input
                    placeholder="e.g. POL-88902"
                    className="h-12 rounded-xl"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-600">
                  Detailed Message
                </label>
                <Textarea
                  placeholder="Please describe your request in detail..."
                  className="min-h-[160px] rounded-2xl"
                />
              </div>
              <Button className="bg-blue-600 text-white px-10 h-12 rounded-xl font-bold shadow-lg shadow-blue-500/20 hover:bg-blue-700">
                Send Ticket
              </Button>
            </form>
          </div>

          {/* FAQ and Contact Sidebar */}
          <div className="lg:col-span-5 space-y-8">
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-50 bg-gray-50/50 font-bold">
                Common Inquiries
              </div>
              <div className="divide-y divide-gray-50">
                {generalFaqs.map((faq) => (
                  <div key={faq.id} className="p-4">
                    <button
                      onClick={() =>
                        setExpandedFaq(expandedFaq === faq.id ? null : faq.id)
                      }
                      className="w-full flex justify-between items-center text-left"
                    >
                      <span className="font-semibold text-gray-700 pr-4">
                        {faq.question}
                      </span>
                      {expandedFaq === faq.id ? (
                        <FiChevronUp />
                      ) : (
                        <FiChevronDown />
                      )}
                    </button>
                    <AnimatePresence>
                      {expandedFaq === faq.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          className="mt-3 text-sm text-gray-500"
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
            <Card className="bg-gray-900 text-white rounded-3xl border-none shadow-2xl p-4">
              <CardContent className="space-y-6 pt-4">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-white/10 rounded-xl">
                    <FiPhone />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">
                      Global Hotline
                    </p>
                    <p className="text-lg font-bold">+251 123 456 789</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-white/10 rounded-xl">
                    <FiClock />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">
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
      <Button className="fixed bottom-10 right-10 bg-blue-600 hover:bg-blue-700 text-white p-4 h-16 w-16 rounded-full shadow-2xl shadow-blue-500/50">
        <FiMessageSquare size={24} />
      </Button>
    </div>
  );
};

export default GeneralSupportPage;
