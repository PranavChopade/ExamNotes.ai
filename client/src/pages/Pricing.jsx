import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Navbar from "../components/Navbar";
import { FiCreditCard, FiCheck } from "react-icons/fi";

const Pricing = () => {
  const navigate = useNavigate();
  const { userData } = useSelector((state) => state.user);

  // Scroll to top when page loads
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Pricing plans configuration
  const plans = [
    {
      name: "Starter",
      price: 4.99,
      credits: 100,
      generations: "~6",
      features: [
        "100 Credits",
        "~6 Note Generations",
        "All Difficulty Levels",
        "Email Support",
      ],
      popular: false,
    },
    {
      name: "Pro",
      price: 9.99,
      credits: 500,
      generations: "~33",
      features: [
        "500 Credits",
        "~33 Note Generations",
        "All Difficulty Levels",
        "Priority Support",
        "Save Notes History",
      ],
      popular: true,
    },
    {
      name: "Ultimate",
      price: 19.99,
      credits: 1200,
      generations: "~80",
      features: [
        "1200 Credits",
        "~80 Note Generations",
        "All Difficulty Levels",
        "24/7 Priority Support",
        "Unlimited Notes History",
        "Early Access to Features",
      ],
      popular: false,
    },
  ];

  // Handle purchase (placeholder - integrate with payment gateway)
  const handlePurchase = (plan) => {
    if (!userData) {
      navigate("/auth");
      return;
    }
    alert(
      `Payment integration coming soon!\n\nSelected: ${plan.name} - $${plan.price}\nYou'll get ${plan.credits} credits.`
    );
  };

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Navigation */}
      <Navbar />

      {/* Header Section */}
      <section className="pt-16 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-medium text-stone-800 mb-3">
            Simple pricing
          </h1>
          <p className="text-base text-stone-500 mb-6">
            Choose the plan that fits your study needs. Each generation costs 15 credits.
          </p>

          {/* Current Credits Display */}
          {userData && (
            <div className="inline-flex items-center px-4 py-2 bg-teal-50 border border-teal-100 rounded-lg">
              <FiCreditCard className="w-4 h-4 text-teal-600 mr-2" />
              <span className="text-teal-700 font-medium text-sm">
                Your balance: {userData.credits} credits
              </span>
            </div>
          )}
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6">
            {plans.map((plan, index) => (
              <div
                key={index}
                className={`relative p-6 rounded-lg border transition-all ${plan.popular
                  ? "border-2 border-teal-200 bg-linear-to-br from-teal-50 to-white shadow-sm"
                  : "border border-stone-200 bg-white hover:border-stone-300"
                  }`}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute -top-3 left-6">
                    <span className="bg-teal-700 text-white text-xs font-medium px-2 py-1 rounded-md">
                      Popular
                    </span>
                  </div>
                )}

                {/* Plan Header */}
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-stone-800 mb-1">
                    {plan.name}
                  </h3>
                  <p className="text-sm text-stone-500">
                    {plan.name === "Starter" ? "Perfect to get started" : plan.name === "Pro" ? "For regular students" : "For power users"}
                  </p>
                </div>

                {/* Price */}
                <div className="mb-6">
                  <span className={`text-3xl font-semibold ${plan.popular ? "text-teal-700" : "text-stone-800"}`}>
                    ${plan.price}
                  </span>
                  <span className="text-stone-500 text-sm ml-1">
                    one-time
                  </span>
                </div>

                {/* Features List */}
                <ul className="space-y-2.5 mb-6">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-sm text-stone-600">
                      <FiCheck className="w-4 h-4 text-teal-600 mr-2 shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <button
                  onClick={() => handlePurchase(plan)}
                  className={`w-full py-2.5 rounded-lg font-medium text-sm transition-all ${plan.popular
                    ? "bg-teal-700 text-white hover:bg-teal-600 shadow-sm"
                    : "border border-stone-200 text-stone-600 hover:bg-stone-50 hover:border-stone-300"
                    }`}
                >
                  Get {plan.name}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white border-t border-stone-100">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-xl font-medium text-stone-800 mb-8">
            Frequently asked questions
          </h2>

          <div className="space-y-4">
            {/* FAQ Item 1 */}
            <div className="p-5 bg-stone-50 rounded-lg border border-stone-100">
              <h3 className="text-sm font-medium text-stone-800 mb-2">
                How many credits do I get for free?
              </h3>
              <p className="text-sm text-stone-500">
                Every new user starts with 100 free credits, which allows you to
                generate approximately 6 sets of notes.
              </p>
            </div>

            {/* FAQ Item 2 */}
            <div className="p-5 bg-stone-50 rounded-lg border border-stone-100">
              <h3 className="text-sm font-medium text-stone-800 mb-2">
                How much does each note generation cost?
              </h3>
              <p className="text-sm text-stone-500">
                Each note generation costs 15 credits, regardless of the topic
                or difficulty level you choose.
              </p>
            </div>

            {/* FAQ Item 3 */}
            <div className="p-5 bg-stone-50 rounded-lg border border-stone-100">
              <h3 className="text-sm font-medium text-stone-800 mb-2">
                Do credits expire?
              </h3>
              <p className="text-sm text-stone-500">
                No, your credits never expire. Use them whenever you need to
                generate notes for your studies.
              </p>
            </div>

            {/* FAQ Item 4 */}
            <div className="p-5 bg-stone-50 rounded-lg border border-stone-100">
              <h3 className="text-sm font-medium text-stone-800 mb-2">
                Can I get a refund?
              </h3>
              <p className="text-sm text-stone-500">
                We offer a 7-day money-back guarantee if you're not satisfied
                with your purchase. Contact our support team for assistance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <h2 className="text-xl font-medium text-stone-800 mb-3">
            Ready to start studying smarter?
          </h2>
          <p className="text-sm text-stone-500 mb-6">
            Join students already using ExamNotes.Ai
          </p>
          {!userData && (
            <Link
              to="/auth"
              className="inline-block px-6 py-3 bg-teal-700 text-white rounded-lg font-medium text-sm hover:bg-teal-600 transition-colors shadow-sm"
            >
              Sign up free
            </Link>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-stone-800 text-stone-300 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-teal-700 rounded-lg flex items-center justify-center">
                <span className="text-white font-medium text-sm">N</span>
              </div>
              <span className="text-base font-medium text-white">ExamNotes.Ai</span>
            </div>
            <p className="text-stone-400 text-sm">
              © 2024 ExamNotes.Ai. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Pricing;