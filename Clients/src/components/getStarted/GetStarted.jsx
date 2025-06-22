export default function GetStarted() {
  return (
    <section
      id="get-started"
      className="bg-white py-20 px-4 sm:px-6 lg:px-8 text-center"
    >
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-6">
          Ready to Secure Your Health?
        </h2>
        <p className="text-gray-600 text-base md:text-lg mb-8">
          Join thousands who trust our health insurance platform. Custom plans,
          fast claims, and smart coverage — all in one place.
        </p>

        <a
          href="/register" // or use a button with navigation if using React Router
          className="inline-block px-8 py-3 bg-blue-600 text-white rounded-full text-sm md:text-base font-medium hover:bg-blue-700 transition"
        >
          Get Started Now
        </a>
      </div>
    </section>
  );
}
