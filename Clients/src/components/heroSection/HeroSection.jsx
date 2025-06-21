import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const slides = [
  {
    id: 1,
    image: "/insu1.jpg",
    title: "Secure Your Health Today",
    subtitle: "Affordable, reliable health insurance for everyone.",
  },
  {
    id: 2,
    image: "/insu2.jpg",
    title: "Family Coverage Plans",
    subtitle: "Protect your loved ones with tailored insurance options.",
  },
  {
    id: 3,
    image: "/insu3.jpg",
    title: "Claim Processing Made Easy",
    subtitle: "Fast, transparent, and hassle-free claim handling.",
  },
];

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const { image, title, subtitle } = slides[currentSlide];

  return (
    <div className="relative w-full h-[90vh] overflow-hidden">
      <img
        src={image}
        alt="Health Slide"
        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700"
      />

      <div className="absolute inset-0 bg-black/50" />

      <div className="relative z-10 h-full flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center px-6 text-white"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-4">{title}</h1>
            <p className="text-lg md:text-2xl">{subtitle}</p>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
