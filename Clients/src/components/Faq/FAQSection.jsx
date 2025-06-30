import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const FAQSection = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const faqs = [
    {
      question: "How do I file a claim?",
      answer: (
        <ol className="list-decimal pl-5 space-y-1">
          <li>Log in to your account.</li>
          <li>
            Go to the <span className="font-semibold">Claims</span> section.
          </li>
          <li>
            Select <span className="font-semibold">"File a New Claim."</span>
          </li>
          <li>
            Fill in the required details (policy number, incident details,
            photos if applicable).
          </li>
          <li>Submit and track your claim status in real time.</li>
        </ol>
      ),
    },
    {
      question: "What documents do I need to submit?",
      answer: (
        <ul className="list-disc pl-5 space-y-1">
          <li>Police report (for accidents/theft)</li>
          <li>Medical bills (for health claims)</li>
          <li>Photos/videos of damage</li>
          <li>Repair estimates</li>
          <li>Policy number and ID proof</li>
        </ul>
      ),
    },
    {
      question: "How long does claim processing take?",
      answer: (
        <div className="space-y-1">
          <p>Processing times vary:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              <span className="font-semibold">Simple claims</span> (e.g., minor
              car damage): 3–5 business days.
            </li>
            <li>
              <span className="font-semibold">Complex claims</span> (e.g., home
              fire): Up to 30 days.
            </li>
          </ul>
          <p>You'll receive SMS/email updates at each stage.</p>
        </div>
      ),
    },
    {
      question: "Can I track my claim status?",
      answer: (
        <p>
          Yes! Go to{" "}
          <span className="font-semibold">Dashboard &gt; My Claims</span> to see
          real-time updates, or chat with our 24/7 support bot for instant help.
        </p>
      ),
    },
    {
      question: "What if my claim is denied?",
      answer: (
        <div className="space-y-1">
          <p>If denied, you'll receive a reason via email. You can:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Appeal with additional evidence.</li>
            <li>
              Contact customer support at{" "}
              <span className="font-semibold">1-800-CLAIMHELP</span>.
            </li>
            <li>Request a supervisor review.</li>
          </ul>
        </div>
      ),
    },
  ];

  // Animation variants
  const itemVariants = {
    open: {
      opacity: 1,
      height: "auto",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24,
        duration: 0.3,
      },
    },
    closed: {
      opacity: 0,
      height: 0,
      transition: {
        duration: 0.2,
        ease: "easeInOut",
      },
    },
  };

  const chevronVariants = {
    open: { rotate: 180 },
    closed: { rotate: 0 },
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <motion.h2
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-2xl font-bold text-gray-800 mb-6"
      >
        Frequently Asked Questions
      </motion.h2>

      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
          >
            <motion.button
              className={`w-full px-4 py-3 text-left font-medium flex justify-between items-center ${
                activeIndex === index
                  ? "bg-blue-50 text-blue-600"
                  : "bg-white hover:bg-gray-50"
              }`}
              onClick={() => toggleFAQ(index)}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <span>{faq.question}</span>
              <motion.div
                variants={chevronVariants}
                animate={activeIndex === index ? "open" : "closed"}
                transition={{ duration: 0.2 }}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </motion.div>
            </motion.button>

            <AnimatePresence>
              {activeIndex === index && (
                <motion.div
                  variants={itemVariants}
                  initial="closed"
                  animate="open"
                  exit="closed"
                  className="px-4 bg-white overflow-hidden"
                >
                  <div className="pb-4 text-gray-600">{faq.answer}</div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default FAQSection;
