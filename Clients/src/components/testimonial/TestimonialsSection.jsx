import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Star, Quote } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const testimonials = [
  {
    name: "Samuel Kebede",
    role: "Small Business Owner",
    image: "https://i.pravatar.cc/150?img=1",
    review:
      "The system made insurance applications effortless. Uploading documents and tracking my application was incredibly simple.",
    rating: 5,
  },
  {
    name: "Abdi Mohammed",
    role: "Teacher",
    image: "https://i.pravatar.cc/150?img=12",
    review:
      "Very intuitive system! Customer support was great and the platform feels very secure and professional.",
    rating: 4,
  },
  {
    name: "Hana Ali",
    role: "Freelancer",
    image: "https://i.pravatar.cc/150?img=5",
    review:
      "I love the clean UI and fast processing. The real-time status updates helped me stay informed throughout the whole process.",
    rating: 5,
  },
  {
    name: "Meron Tekle",
    role: "Entrepreneur",
    image: "https://i.pravatar.cc/150?img=8",
    review:
      "Streamlined process from start to finish. Saved me hours of paperwork and follow-ups!",
    rating: 5,
  },
];

export default function TestimonialsCarousel() {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0); // 1 = next, -1 = prev

  const next = () => {
    setDirection(1); // next → move left
    setIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prev = () => {
    setDirection(-1); // prev → move right
    setIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  // Auto-rotate every 5s
  useEffect(() => {
    const interval = setInterval(() => {
      next();
    }, 100000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-20 px-4 bg-gray-100">
      <div className="max-w-7xl mx-auto text-center mb-16">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-600 text-sm font-medium mb-4">
          <Star className="h-3.5 w-3.5 fill-current" />
          Trusted by Professionals
        </div>
        <h2 className="text-5xl md:text-6xl font-bold tracking-tight bg-gradient-to-br from-gray-900 to-gray-600 bg-clip-text text-transparent">
          What Our Clients Say
        </h2>
        <p className="text-gray-600 mt-4 text-lg max-w-2xl mx-auto">
          Join thousands of satisfied users who transformed their experience
          with our platform.
        </p>
      </div>

      <div className="relative flex items-center justify-center gap-8">
        {/* Left Button */}
        <button
          onClick={prev}
          className="hidden md:flex items-center justify-center p-4 rounded-2xl bg-white shadow-lg hover:shadow-xl hover:-translate-x-1 transition-all duration-300 group z-10"
        >
          <ArrowLeft className="h-6 w-6 text-gray-600 group-hover:text-gray-900 transition-colors" />
        </button>

        {/* Main Carousel */}
        <div className="w-full max-w-4xl">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={index}
              custom={direction}
              initial={{ opacity: 0, x: direction > 0 ? 100 : -100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction > 0 ? -100 : 100 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
            >
              <div className="relative bg-white rounded-8xl p-8 md:p-12 shadow-xl overflow-hidden">
                <Quote className="absolute -top-6 -left-6 h-24 w-24 text-blue-100 rotate-180" />
                <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                  {/* Avatar */}
                  <div className="relative">
                    <Avatar className="h-28 w-28 border-4 border-white shadow-lg">
                      <AvatarImage
                        src={testimonials[index].image}
                        alt={testimonials[index].name}
                      />
                      <AvatarFallback>
                        {testimonials[index].name.substring(0, 2)}
                      </AvatarFallback>
                    </Avatar>

                    <div className="absolute -bottom-2 -right-2 flex items-center gap-1 bg-white px-3 py-1.5 rounded-full shadow-lg">
                      <Star className="h-4 w-4 fill-yellow-400" />
                      <span className="text-sm font-bold">
                        {testimonials[index].rating}.0
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 text-center md:text-left">
                    <p className="text-lg text-gray-700 leading-relaxed font-medium mb-6">
                      "{testimonials[index].review}"
                    </p>

                    <h3 className="text-2xl font-bold text-gray-900">
                      {testimonials[index].name}
                    </h3>
                    <p className="text-gray-500 font-medium">
                      {testimonials[index].role}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Right Button */}
        <button
          onClick={next}
          className="hidden md:flex items-center justify-center p-4 rounded-2xl bg-white shadow-lg hover:shadow-xl hover:translate-x-1 transition-all duration-300 group z-10"
        >
          <ArrowRight className="h-6 w-6 text-gray-600 group-hover:text-gray-900 transition-colors" />
        </button>
      </div>

      {/* Mobile Navigation */}
      <div className="flex justify-center items-center gap-4 mt-8 md:hidden">
        <button
          onClick={prev}
          className="p-3 rounded-full bg-white shadow-lg hover:shadow-xl transition-all"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <button
          onClick={next}
          className="p-3 rounded-full bg-white shadow-lg hover:shadow-xl transition-all"
        >
          <ArrowRight className="h-5 w-5" />
        </button>
      </div>
    </section>
  );
}
