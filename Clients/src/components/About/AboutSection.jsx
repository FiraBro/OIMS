import { motion } from "framer-motion";
import { fadeIn, staggerContainer, zoomIn } from "../../utils/motion"; // Custom animation variants

export default function AboutSection() {
  return (
    <motion.section
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.25 }}
      variants={staggerContainer}
      className="bg-gray-50 py-16 px-6"
    >
      <div className="max-w-6xl mx-auto text-center">
        <motion.h2
          variants={fadeIn("up", "spring", 0.1, 0.75)}
          className="text-3xl md:text-4xl font-bold text-blue-700 mb-6"
        >
          About Our Platform
        </motion.h2>

        <motion.p
          variants={fadeIn("up", "spring", 0.2, 0.75)}
          className="text-lg text-gray-700 max-w-3xl mx-auto mb-8"
        >
          Our Health Insurance Management System is a modern, secure, and
          efficient solution designed to simplify the health insurance journey
          for customers, administrators, and agents. From seamless policy
          applications to real-time claim tracking, we provide an all-in-one
          platform that ensures transparency, speed, and accessibility in every
          step of the process.
        </motion.p>

        <motion.div
          variants={staggerContainer}
          className="grid md:grid-cols-3 gap-8 mt-10 text-left"
        >
          <motion.div
            variants={fadeIn("right", "spring", 0.1, 0.75)}
            whileHover={{ scale: 1.03 }}
            className="bg-white shadow-md rounded-2xl p-6 hover:shadow-xl transition-all duration-300"
          >
            <div className="flex items-center mb-4">
              <motion.div
                variants={zoomIn(0.3, 1)}
                className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3"
              >
                <svg
                  className="w-5 h-5 text-blue-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                    clipRule="evenodd"
                  />
                </svg>
              </motion.div>
              <h3 className="text-xl font-semibold text-blue-600">
                Customer-Centric
              </h3>
            </div>
            <p className="text-gray-600">
              Empower individuals and families to choose, apply, and manage
              policies effortlessly with full control.
            </p>
          </motion.div>

          <motion.div
            variants={fadeIn("up", "spring", 0.2, 0.75)}
            whileHover={{ scale: 1.03 }}
            className="bg-white shadow-md rounded-2xl p-6 hover:shadow-xl transition-all duration-300"
          >
            <div className="flex items-center mb-4">
              <motion.div
                variants={zoomIn(0.4, 1)}
                className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3"
              >
                <svg
                  className="w-5 h-5 text-blue-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                </svg>
              </motion.div>
              <h3 className="text-xl font-semibold text-blue-600">
                Admin Efficiency
              </h3>
            </div>
            <p className="text-gray-600">
              Streamlined tools to manage applications, approve claims, and
              generate reports securely and quickly.
            </p>
          </motion.div>

          <motion.div
            variants={fadeIn("left", "spring", 0.3, 0.75)}
            whileHover={{ scale: 1.03 }}
            className="bg-white shadow-md rounded-2xl p-6 hover:shadow-xl transition-all duration-300"
          >
            <div className="flex items-center mb-4">
              <motion.div
                variants={zoomIn(0.5, 1)}
                className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3"
              >
                <svg
                  className="w-5 h-5 text-blue-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </motion.div>
              <h3 className="text-xl font-semibold text-blue-600">
                Scalable & Secure
              </h3>
            </div>
            <p className="text-gray-600">
              Built with modern technologies to ensure data privacy,
              performance, and scalability for future growth.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
}
