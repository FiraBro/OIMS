// SupportPage.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
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
  FiExternalLink,
  FiCheckCircle,
  FiAlertCircle,
  FiBookOpen,
  FiVideo,
  FiDownload,
} from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const SupportPage = () => {
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    category: "general",
  });

  const faqs = [
    {
      id: 1,
      question: "How do I apply for insurance coverage?",
      answer:
        "You can apply for insurance coverage by visiting our Plans page, selecting a suitable plan, and clicking the 'Apply Now' button. Follow the step-by-step application process which includes personal details, nominee information, medical history (if required), document upload, and payment setup.",
      category: "application",
    },
    {
      id: 2,
      question: "What documents are required for application?",
      answer:
        "Typically, you'll need: 1) Valid government ID, 2) Proof of address, 3) Medical reports (for certain plans), 4) Income proof, 5) Passport-sized photographs. Specific requirements may vary based on the plan you choose.",
      category: "documents",
    },
    {
      id: 3,
      question: "How long does the approval process take?",
      answer:
        "Standard applications are processed within 3-5 business days. However, plans requiring medical underwriting may take 7-10 business days. You'll receive email notifications at each stage of the approval process.",
      category: "processing",
    },
    {
      id: 4,
      question: "Can I modify my application after submission?",
      answer:
        "You can modify your application within 24 hours of submission by visiting 'My Applications' in your dashboard. After 24 hours, please contact our support team for assistance with any changes.",
      category: "application",
    },
    {
      id: 5,
      question: "What payment methods are accepted?",
      answer:
        "We accept: Credit/Debit cards, Bank transfers, Mobile payments (M-Pesa, Telebirr), and Online banking. You can choose monthly, quarterly, or yearly payment frequencies based on your preference.",
      category: "payment",
    },
    {
      id: 6,
      question: "How do I file a claim?",
      answer:
        "To file a claim: 1) Login to your account, 2) Navigate to 'My Claims', 3) Click 'File New Claim', 4) Complete the claim form with required details, 5) Upload supporting documents, 6) Submit for review. Our team will contact you within 48 hours.",
      category: "claims",
    },
    {
      id: 7,
      question: "What is the waiting period for claims?",
      answer:
        "The waiting period varies by plan type. For health insurance, it's typically 30 days from policy start date. For life insurance, it's usually 1-2 years. Specific waiting periods are clearly mentioned in your policy document.",
      category: "claims",
    },
    {
      id: 8,
      question: "How can I update my personal information?",
      answer:
        "You can update your personal information by logging into your account, going to 'Profile Settings', and editing the relevant sections. For major changes (like name or date of birth), please contact support for verification.",
      category: "account",
    },
  ];

  const contactCategories = [
    { value: "general", label: "General Inquiry" },
    { value: "claims", label: "Claims Support" },
    { value: "technical", label: "Technical Issues" },
    { value: "billing", label: "Billing & Payments" },
    { value: "emergency", label: "Emergency Support" },
  ];

  const supportTopics = [
    {
      title: "Getting Started",
      icon: <FiBookOpen className="w-6 h-6" />,
      description: "Learn how to apply and manage your policy",
      items: ["Application Guide", "Policy Documents", "Account Setup"],
      color: "bg-blue-100 text-blue-800",
    },
    {
      title: "Claims Assistance",
      icon: <FiCheckCircle className="w-6 h-6" />,
      description: "File and track insurance claims",
      items: ["Claim Process", "Required Documents", "Status Tracking"],
      color: "bg-green-100 text-green-800",
    },
    {
      title: "Video Tutorials",
      icon: <FiVideo className="w-6 h-6" />,
      description: "Step-by-step video guides",
      items: ["Application Walkthrough", "Dashboard Tour", "Mobile App Guide"],
      color: "bg-purple-100 text-purple-800",
    },
    {
      title: "Downloads",
      icon: <FiDownload className="w-6 h-6" />,
      description: "Forms and document templates",
      items: ["Claim Forms", "Policy Templates", "FAQs PDF"],
      color: "bg-amber-100 text-amber-800",
    },
  ];

  const emergencyContacts = [
    {
      type: "Medical Emergency",
      number: "+251-911-123-456",
      description: "24/7 Medical assistance and hospitalization",
      icon: <FiAlertCircle className="w-5 h-5" />,
      color: "bg-red-50 text-red-700",
    },
    {
      type: "Claims Emergency",
      number: "+251-922-789-012",
      description: "Urgent claim processing support",
      icon: <FiAlertCircle className="w-5 h-5" />,
      color: "bg-orange-50 text-orange-700",
    },
    {
      type: "Technical Support",
      number: "+251-933-345-678",
      description: "Website and app technical issues",
      icon: <FiHelpCircle className="w-5 h-5" />,
      color: "bg-blue-50 text-blue-700",
    },
  ];

  const handleContactSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log("Contact form submitted:", contactForm);
    alert("Thank you for your message! We'll get back to you within 24 hours.");
    setContactForm({
      name: "",
      email: "",
      subject: "",
      message: "",
      category: "general",
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setContactForm((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 py-16 sm:py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              How can we help you?
            </h1>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Get assistance with your insurance applications, claims, and
              policy management
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="search"
                  placeholder="Search for answers..."
                  className="pl-12 py-6 text-lg rounded-full border-none shadow-lg"
                />
                <Button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white text-blue-600 hover:bg-gray-100 rounded-full px-6">
                  Search
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Quick Actions */}
          <div className="lg:col-span-2 space-y-8">
            {/* Contact Methods */}
            <Card className="shadow-lg border-0">
              <CardContent className="pt-6">
                <div className="flex items-center mb-6">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                    <FiMessageSquare className="w-5 h-5 text-blue-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Get in Touch
                  </h2>
                </div>

                <div className="grid md:grid-cols-3 gap-6 mb-8">
                  <div className="text-center p-6 bg-gray-50 rounded-xl hover:bg-blue-50 transition-colors">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FiPhone className="w-6 h-6 text-blue-600" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">Call Us</h3>
                    <p className="text-gray-600 mb-3">
                      Speak with our support team
                    </p>
                    <a
                      href="tel:+251123456789"
                      className="text-blue-600 font-semibold hover:text-blue-700"
                    >
                      +251 123 456 789
                    </a>
                    <p className="text-sm text-gray-500 mt-2">
                      Mon-Fri: 8 AM - 6 PM
                    </p>
                  </div>

                  <div className="text-center p-6 bg-gray-50 rounded-xl hover:bg-green-50 transition-colors">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FiMail className="w-6 h-6 text-green-600" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">Email Us</h3>
                    <p className="text-gray-600 mb-3">
                      Get a response within 24 hours
                    </p>
                    <a
                      href="mailto:support@insurance.com"
                      className="text-green-600 font-semibold hover:text-green-700"
                    >
                      support@insurance.com
                    </a>
                    <p className="text-sm text-gray-500 mt-2">
                      24/7 email support
                    </p>
                  </div>

                  <div className="text-center p-6 bg-gray-50 rounded-xl hover:bg-purple-50 transition-colors">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FiMapPin className="w-6 h-6 text-purple-600" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">Visit Us</h3>
                    <p className="text-gray-600 mb-3">Meet us in person</p>
                    <p className="font-semibold text-purple-600">
                      Dire Dawa, Ethiopia
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                      Taiwan Road, Shek Habib Building
                    </p>
                  </div>
                </div>

                {/* Contact Form */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6">
                  <h3 className="text-xl font-semibold mb-4">
                    Send us a message
                  </h3>
                  <form onSubmit={handleContactSubmit}>
                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Full Name *
                        </label>
                        <Input
                          name="name"
                          value={contactForm.name}
                          onChange={handleInputChange}
                          placeholder="Your name"
                          required
                          className="bg-white border-gray-200 focus:border-blue-200"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email Address *
                        </label>
                        <Input
                          name="email"
                          type="email"
                          value={contactForm.email}
                          onChange={handleInputChange}
                          placeholder="your@email.com"
                          required
                          className="bg-white border-gray-200 focus:border-blue-200"
                        />
                      </div>
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Category
                      </label>
                      <select
                        name="category"
                        value={contactForm.category}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                      >
                        {contactCategories.map((cat) => (
                          <option key={cat.value} value={cat.value}>
                            {cat.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Subject *
                      </label>
                      <Input
                        name="subject"
                        value={contactForm.subject}
                        onChange={handleInputChange}
                        placeholder="How can we help?"
                        required
                        className="bg-white border-gray-200 focus:border-blue-200"
                      />
                    </div>

                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Message *
                      </label>
                      <Textarea
                        name="message"
                        value={contactForm.message}
                        onChange={handleInputChange}
                        placeholder="Describe your issue in detail..."
                        rows={4}
                        required
                        className="bg-white border-gray-200 focus:border-blue-200"
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-blue-600 hover:bg-blue-500 text-white cursor-pointer"
                    >
                      Send Message
                    </Button>
                  </form>
                </div>
              </CardContent>
            </Card>

            {/* Emergency Contacts */}
            <Card className="border-red-200 shadow-lg">
              <CardContent className="pt-6">
                <div className="flex items-center mb-6">
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-3">
                    <FiAlertCircle className="w-5 h-5 text-red-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Emergency Contacts
                  </h2>
                </div>

                <div className="space-y-4">
                  {emergencyContacts.map((contact, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div
                        className={`p-4 rounded-lg border ${contact.color} flex items-center justify-between`}
                      >
                        <div className="flex items-center">
                          <div
                            className={`p-2 rounded-full ${
                              contact.color.split(" ")[0]
                            } mr-4`}
                          >
                            {contact.icon}
                          </div>
                          <div>
                            <h4 className="font-semibold">{contact.type}</h4>
                            <p className="text-sm opacity-80">
                              {contact.description}
                            </p>
                          </div>
                        </div>
                        <a
                          href={`tel:${contact.number.replace(/-/g, "")}`}
                          className="text-lg font-bold hover:text-blue-700 transition-colors"
                        >
                          {contact.number}
                        </a>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Resources & FAQ */}
          <div className="space-y-8">
            {/* Quick Resources */}
            <Card className="shadow-lg border-0">
              <CardContent className="pt-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Coming Soon...
                </h2>
                <div className="space-y-4">
                  {supportTopics.map((topic, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className="p-4 border border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-md transition-all cursor-pointer group">
                        <div className="flex items-start">
                          <div
                            className={`p-3 rounded-lg ${
                              topic.color.split(" ")[0]
                            } mr-4 group-hover:scale-110 transition-transform`}
                          >
                            {topic.icon}
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                              {topic.title}
                            </h3>
                            <p className="text-sm text-gray-600 mt-1">
                              {topic.description}
                            </p>
                            <div className="flex flex-wrap gap-2 mt-3">
                              {topic.items.map((item, idx) => (
                                <Badge
                                  key={idx}
                                  variant="outline"
                                  className="text-xs"
                                >
                                  {item}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <FiExternalLink className="ml-auto text-gray-400 group-hover:text-blue-600 transition-colors" />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* FAQ Section */}
            {/* <Card className="shadow-lg border-0">
              <CardContent className="pt-6">
                <div className="flex items-center mb-6">
                  <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center mr-3">
                    <FiHelpCircle className="w-5 h-5 text-indigo-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Frequently Asked Questions
                  </h2>
                </div>

                <div className="space-y-3">
                  {faqs.map((faq) => (
                    <div
                      key={faq.id}
                      className="border border-gray-200 rounded-lg overflow-hidden"
                    >
                      <button
                        onClick={() =>
                          setExpandedFaq(expandedFaq === faq.id ? null : faq.id)
                        }
                        className="w-full px-4 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center">
                          <Badge className="mr-3">{faq.category}</Badge>
                          <span className="font-medium text-gray-900">
                            {faq.question}
                          </span>
                        </div>
                        {expandedFaq === faq.id ? (
                          <FiChevronUp className="w-5 h-5 text-gray-500" />
                        ) : (
                          <FiChevronDown className="w-5 h-5 text-gray-500" />
                        )}
                      </button>
                      {expandedFaq === faq.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="px-4 pb-4"
                        >
                          <p className="text-gray-600">{faq.answer}</p>
                        </motion.div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="mt-6 text-center">
                  <Button variant="outline" className="w-full">
                    View All FAQs
                  </Button>
                </div>
              </CardContent>
            </Card> */}

            {/* Support Hours */}
            <Card className="shadow-lg border-0 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
              <CardContent className="pt-6">
                <div className="flex items-center mb-6">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center mr-3">
                    <FiClock className="w-5 h-5" />
                  </div>
                  <h2 className="text-2xl font-bold">Support Hours</h2>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center py-3 border-b border-white/20">
                    <span className="opacity-90">Monday - Friday</span>
                    <span className="font-semibold">8:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-white/20">
                    <span className="opacity-90">Saturday</span>
                    <span className="font-semibold">9:00 AM - 2:00 PM</span>
                  </div>
                  <div className="flex justify-between items-center py-3">
                    <span className="opacity-90">Emergency</span>
                    <span className="font-semibold">24/7 Available</span>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-white/20 text-center">
                  <p className="text-sm opacity-80">
                    All times are in East Africa Time (GMT+3)
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Live Chat Widget */}
        <div className="fixed bottom-6 right-6 z-50">
          <Button className="rounded-full p-4 h-auto bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-xl">
            <FiMessageSquare className="w-6 h-6 mr-2" />
            <span className="hidden sm:inline">Live Chat</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SupportPage;
