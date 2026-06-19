import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FiMenu,
  FiX,
  FiMapPin,
  FiClipboard,
  FiAlertCircle,
  FiBarChart2,
  FiArrowRight,
} from "react-icons/fi";
import { useNavigate } from "react-router";

const LandingPage = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(
    () => window.matchMedia("(prefers-color-scheme: dark)").matches
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e) => setIsDarkMode(e.matches);
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const features = [
    {
      icon: <FiMapPin className="w-8 h-8" />,
      title: "Real-Time Location Tracking",
      description: "Monitor truck positions with precision GPS tracking",
    },
    {
      icon: <FiClipboard className="w-8 h-8" />,
      title: "Duty Assignment Management",
      description: "Streamline scheduling and task allocation",
    },
    {
      icon: <FiAlertCircle className="w-8 h-8" />,
      title: "Incident Reporting System",
      description: "Quick and efficient incident documentation",
    },
    {
      icon: <FiBarChart2 className="w-8 h-8" />,
      title: "Performance Analytics",
      description: "Data-driven insights for optimal security operations",
    },
  ];

  const testimonials = [
    {
      quote:
        "Transformed our security operations with cutting-edge technology.",
      author: "John Smith",
      position: "Security Director, Metro Corp",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
    },
    {
      quote: "Exceptional control and visibility over our security workforce.",
      author: "Sarah Johnson",
      position: "Operations Manager, SecureTeX",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
    },
  ];

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        isDarkMode ? "dark bg-gray-900" : "bg-white"
      }`}
    >
      <nav className="fixed w-full z-50 bg-white dark:bg-gray-900 shadow-lg">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold text-navy-600 dark:text-white">
              TruckSystem
            </div>
            <div className="hidden md:flex space-x-8">
              <button className="text-gray-600 dark:text-gray-300 hover:text-navy-600 dark:hover:text-white">
                Features
              </button>
              <button className="text-gray-600 dark:text-gray-300 hover:text-navy-600 dark:hover:text-white">
                Testimonials
              </button>
              <button className="text-gray-600 dark:text-gray-300 hover:text-navy-600 dark:hover:text-white">
                Contact
              </button>
            </div>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-gray-600 dark:text-gray-300"
            >
              {isMenuOpen ? (
                <FiX className="w-6 h-6" />
              ) : (
                <FiMenu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </nav>

      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative h-screen flex items-center justify-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1517245386807-bb43f82c33c4')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative z-10 text-center px-6">
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-4xl md:text-6xl font-bold text-white mb-4"
          >
            Urban Security, Reimagined
          </motion.h1>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl md:text-2xl text-gray-200 mb-8"
          >
            Intelligent Truck Management & Real-Time Monitoring
          </motion.p>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              className="bg-navy-600 text-white px-8 py-3 rounded-lg hover:bg-navy-700 transition"
              onClick={() => {
                navigate("/user/register");
              }}
            >
              User Login
            </button>
            <button
              className="bg-slate-600 text-white px-8 py-3 rounded-lg hover:bg-slate-700 transition"
              onClick={() => {
                navigate("/guard/register");
              }}
            >
              Truck Portal
            </button>
            <button className="bg-red-600 text-white px-8 py-3 rounded-lg hover:bg-red-700 transition">
              Request Demo
            </button>
          </div>
        </div>
      </motion.section>

      <section className="py-24 bg-gradient-to-b from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-6">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold text-center text-gray-800 dark:text-white mb-4"
          >
            Key Features
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center text-gray-600 dark:text-gray-300 mb-16 max-w-2xl mx-auto"
          >
            Discover how our cutting-edge security management system can
            revolutionize your operations
          </motion.p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                whileHover={{ scale: 1.05, translateY: -10 }}
                className="p-8 bg-white dark:bg-gray-700 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-gray-600"
              >
                <div className="bg-navy-50 dark:bg-navy-900 p-4 rounded-lg inline-block mb-6">
                  <div className="text-navy-600 dark:text-white">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {feature.description}
                </p>
                <button className="mt-6 text-navy-600 dark:text-navy-400 font-medium inline-flex items-center hover:text-navy-800 dark:hover:text-navy-300 transition-colors">
                  Learn more <FiArrowRight className="ml-2" />
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-12">
            What Our Clients Say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.02 }}
                className="p-6 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-lg"
              >
                <p className="text-gray-600 dark:text-gray-300 italic mb-4">
                  "{testimonial.quote}"
                </p>
                <div className="flex items-center">
                  <img
                    src={testimonial.image}
                    alt={testimonial.author}
                    className="w-12 h-12 rounded-full object-cover mr-4"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-800 dark:text-white">
                      {testimonial.author}
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400">
                      {testimonial.position}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-gradient-to-r from-navy-600 to-navy-800 dark:from-navy-800 dark:to-navy-900">
        <div className="container mx-auto px-6 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold text-white mb-8"
          >
            Ready to Transform Your Security Operations?
          </motion.h2>
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.05 }}
            className="bg-white text-navy-600 px-10 py-4 rounded-lg hover:bg-gray-100 transition-all duration-300 inline-flex items-center font-bold shadow-lg hover:shadow-xl"
          >
            Get Started Today
            <FiArrowRight className="ml-2" />
          </motion.button>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
