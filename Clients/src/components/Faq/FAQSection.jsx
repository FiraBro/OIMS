import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HelpCircle, ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "How do I file a claim?",
    answer: (
      <ol className="list-decimal pl-6 space-y-1 text-gray-700">
        <li>Log in to your secure account dashboard</li>
        <li>Navigate to the Claims Center section</li>
        <li>Select "File New Claim" and choose your policy type</li>
        <li>Complete the digital form and upload supporting documents</li>
        <li>Submit and track progress in real-time</li>
      </ol>
    ),
  },
  {
    question: "What documents are required for claim submission?",
    answer: (
      <ul className="list-disc pl-6 space-y-1 text-gray-700">
        <li>Completed claim form</li>
        <li>Policy number verification</li>
        <li>Government-issued ID</li>
      </ul>
    ),
  },
  {
    question: "What is the typical claim processing timeframe?",
    answer: (
      <p className="text-gray-700">
        Simple claims: 3-5 days, Standard claims: 5-10 days, Complex claims:
        15-30 days
      </p>
    ),
  },
  {
    question: "How can I track my claim status in real-time?",
    answer: (
      <p className="text-gray-700">
        Use the Dashboard → My Claims section to see real-time updates.
      </p>
    ),
  },
  {
    question: "What options are available if my claim is denied?",
    answer: (
      <p className="text-gray-700">
        You can appeal with additional documents or contact the claims
        supervisor for escalation.
      </p>
    ),
  },
];

export default function FAQSection() {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const contentVariants = {
    open: { height: "auto", opacity: 1, transition: { duration: 0.3 } },
    closed: { height: 0, opacity: 0, transition: { duration: 0.2 } },
  };

  return (
    <div className="min-h-screen bg-gray-50 py-20 px-4">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-50 to-purple-50 text-blue-600 font-medium text-sm mb-4">
            <HelpCircle className="h-4 w-4" />
            Frequently Asked Questions
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Get Answers to Common Questions
          </h1>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto">
            Everything you need to know about claims, documents, and processes.
            Can't find what you're looking for? Contact our support team.
          </p>
        </motion.div>

        <div className="border-t border-gray-300 divide-y divide-gray-300">
          {faqs.map((faq, index) => (
            <div key={index}>
              <motion.button
                className="w-full px-4 py-4 text-left flex justify-between items-center focus:outline-none hover:bg-gray-100 transition-colors"
                onClick={() => toggleFAQ(index)}
              >
                <span className="text-gray-900 text-lg md:text-xl font-semibold">
                  {faq.question}
                </span>
                <motion.div
                  animate={{ rotate: activeIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown className="h-5 w-5 text-gray-400" />
                </motion.div>
              </motion.button>

              <AnimatePresence>
                {activeIndex === index && (
                  <motion.div
                    variants={contentVariants}
                    initial="closed"
                    animate="open"
                    exit="closed"
                    className="px-4 pb-4"
                  >
                    {faq.answer}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
