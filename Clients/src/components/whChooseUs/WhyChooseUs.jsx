import { CheckCircle, Zap, ShieldCheck, BarChart3 } from "lucide-react";
import { motion } from "framer-motion";

const benefits = [
  {
    icon: <CheckCircle className="text-green-500 w-8 h-8" />,
    title: "Transparent Pricing",
    description: "No hidden fees – you pay exactly what you see.",
  },
  {
    icon: <Zap className="text-yellow-400 w-8 h-8" />,
    title: "Fast Claim Processing",
    description: "Get approvals in hours, not days.",
  },
  {
    icon: <ShieldCheck className="text-blue-500 w-8 h-8" />,
    title: "Comprehensive Coverage",
    description: "Custom plans for individuals and families.",
  },
  {
    icon: <BarChart3 className="text-indigo-500 w-8 h-8" />,
    title: "AI-Powered Recommendations",
    description: "Smart suggestions for optimal coverage.",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export default function WhyChooseUs() {
  return (
    <section className="relative bg-gradient-to-b from-white to-blue-50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-slate-800 mb-14">
          Why Choose Us?
        </h2>

        <motion.div
          className="grid gap-8 md:grid-cols-2 lg:grid-cols-4"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          {benefits.map((benefit, idx) => (
            <motion.div
              key={idx}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl p-6 text-center transform transition-transform duration-300 hover:scale-105 border border-gray-100"
              variants={cardVariants}
            >
              <div className="flex justify-center mb-4">{benefit.icon}</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {benefit.title}
              </h3>
              <p className="text-gray-600 text-sm">{benefit.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Button */}
        <div className="text-center mt-12">
          <a
            href="#"
            className="inline-block px-8 py-3 bg-blue-600 text-white rounded-full text-sm md:text-base font-medium hover:bg-blue-700 transition"
          >
            View Plan
          </a>
        </div>
      </div>

      {/* SVG Wave Bottom Separator */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0] rotate-180">
        <svg
          className="relative block w-full h-24"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
        >
          <path
            fill="#000"
            d="M0,160L80,165.3C160,171,320,181,480,181.3C640,181,800,171,960,149.3C1120,128,1280,96,1360,80L1440,64L1440,0L1360,0C1280,0,1120,0,960,0C800,0,640,0,480,0C320,0,160,0,80,0L0,0Z"
          ></path>
        </svg>
      </div>
    </section>
  );
}
