import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Navbar from "../components/Navbar";
import { FiZap, FiClock, FiCheck } from "react-icons/fi";
import { IoBulbOutline } from "react-icons/io5";
const Home = () => {
  const navigate = useNavigate();
  const { userData } = useSelector((state) => state.user);

  // Handle navigation to generate notes
  const handleGetStarted = () => {
    if (userData) {
      navigate("/dashboard");
    } else {
      navigate("/auth");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <Navbar />

      {/* Hero Section - Left-aligned, functional */}
      <section className="pt-16 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-2xl">
            {/* Badge */}
            <div className="inline-flex items-center px-3 py-1.5 bg-surface border border-border rounded-md mb-6">
              <span className="text-primary text-xs font-medium">
                AI-Powered Study Assistant
              </span>
            </div>

            {/* Main Heading */}
            <h1 className="text-3xl md:text-4xl font-medium text-text-primary mb-4 leading-tight">
              Generate exam notes
              <span className="text-primary"> in seconds</span>
            </h1>

            {/* Subheading */}
            <p className="text-base text-text-secondary mb-8 max-w-xl">
              Transform any topic into comprehensive, well-structured exam notes using AI. Save hours of study time.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleGetStarted}
                className="px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors shadow-sm"
              >
                Get started free
              </button>
              <Link
                to="/pricing"
                className="px-6 py-3 border border-border text-text-secondary rounded-lg font-medium hover:bg-surface hover:border-primary transition-all text-center"
              >
                View pricing
              </Link>
            </div>

            {/* Trust Badge */}
            <p className="mt-6 text-text-secondary text-sm">
              Start with 100 free credits • No credit card required
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-surface border-t border-border">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <h2 className="text-xl font-medium text-text-primary mb-2">
              Why ExamNotes.Ai?
            </h2>
            <p className="text-text-secondary text-sm">
              Everything you need to study smarter
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="p-5 rounded-lg border border-border hover:border-primary hover:bg-background transition-all">
              <div className="w-10 h-10 bg-surface border border-border rounded-lg flex items-center justify-center mb-4">
                <FiZap className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-base font-medium text-text-primary mb-2">
                Lightning fast
              </h3>
              <p className="text-sm text-text-secondary">
                Generate comprehensive notes in seconds. No more spending hours writing and organizing.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-5 rounded-lg border border-border hover:border-primary hover:bg-background transition-all">
              <div className="w-10 h-10 bg-surface border border-border rounded-lg flex items-center justify-center mb-4">
                <IoBulbOutline className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-base font-medium text-text-primary mb-2">
                AI-powered
              </h3>
              <p className="text-sm text-text-secondary">
                Advanced AI understands context and creates structured, easy-to-understand notes.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-5 rounded-lg border border-border hover:border-primary hover:bg-background transition-all">
              <div className="w-10 h-10 bg-surface border border-border rounded-lg flex items-center justify-center mb-4">
                <FiClock className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-base font-medium text-text-primary mb-2">
                Save time
              </h3>
              <p className="text-sm text-text-secondary">
                Focus on understanding concepts instead of writing. Let AI handle the note-taking.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <h2 className="text-xl font-medium text-text-primary mb-2">
              How it works
            </h2>
            <p className="text-text-secondary text-sm">
              Generate notes in 3 simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div>
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm font-medium mb-4">
                1
              </div>
              <h3 className="text-base font-medium text-text-primary mb-2">
                Enter your topic
              </h3>
              <p className="text-sm text-text-secondary">
                Type in any subject or topic you want to study for your exams
              </p>
            </div>

            {/* Step 2 */}
            <div>
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm font-medium mb-4">
                2
              </div>
              <h3 className="text-base font-medium text-text-primary mb-2">
                Select difficulty
              </h3>
              <p className="text-sm text-text-secondary">
                Choose your level: Beginner, Intermediate, or Advanced
              </p>
            </div>

            {/* Step 3 */}
            <div>
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm font-medium mb-4">
                3
              </div>
              <h3 className="text-base font-medium text-text-primary mb-2">
                Get your notes
              </h3>
              <p className="text-sm text-text-secondary">
                AI generates comprehensive, structured notes ready for study
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Preview Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-surface border-t border-border">
        <div className="max-w-4xl mx-auto">
          <div className="mb-12">
            <h2 className="text-xl font-medium text-text-primary mb-2">
              Simple pricing
            </h2>
            <p className="text-text-secondary text-sm">
              Start free, upgrade when you need more
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Free Plan */}
            <div className="p-6 rounded-lg border border-border hover:border-primary transition-colors">
              <h3 className="text-lg font-medium text-text-primary mb-1">Free</h3>
              <p className="text-sm text-text-secondary mb-4">Perfect to get started</p>
              <div className="text-3xl font-semibold text-text-primary mb-6">$0</div>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center text-sm text-text-secondary">
                  <FiCheck className="w-4 h-4 text-primary mr-2" />
                  100 free credits
                </li>
                <li className="flex items-center text-sm text-text-secondary">
                  <FiCheck className="w-4 h-4 text-primary mr-2" />
                  ~6 note generations
                </li>
                <li className="flex items-center text-sm text-text-secondary">
                  <FiCheck className="w-4 h-4 text-primary mr-2" />
                  All difficulty levels
                </li>
              </ul>
              <button
                onClick={handleGetStarted}
                className="w-full py-2.5 border border-border text-text-secondary rounded-lg font-medium hover:bg-background hover:border-primary transition-all"
              >
                Get started
              </button>
            </div>

            {/* Pro Plan */}
            <div className="p-6 rounded-lg border-2 border-primary bg-surface relative">
              <div className="absolute top-0 right-0 bg-primary text-white text-xs font-medium px-2 py-1 rounded-bl-md">
                Popular
              </div>
              <h3 className="text-lg font-medium text-text-primary mb-1">Pro</h3>
              <p className="text-sm text-text-secondary mb-4">For serious students</p>
              <div className="text-3xl font-semibold text-primary mb-6">$9.99</div>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center text-sm text-text-secondary">
                  <FiCheck className="w-4 h-4 text-primary mr-2" />
                  500 credits
                </li>
                <li className="flex items-center text-sm text-text-secondary">
                  <FiCheck className="w-4 h-4 text-primary mr-2" />
                  ~33 note generations
                </li>
                <li className="flex items-center text-sm text-text-secondary">
                  <FiCheck className="w-4 h-4 text-primary mr-2" />
                  Priority support
                </li>
              </ul>
              <Link
                to="/pricing"
                className="block w-full py-2.5 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors text-center shadow-sm"
              >
                View all plans
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <h2 className="text-xl font-medium text-text-primary mb-3">
            Ready to study smarter?
          </h2>
          <p className="text-text-secondary text-sm mb-6">
            Join students already using ExamNotes.Ai to prepare for exams
          </p>
          <button
            onClick={handleGetStarted}
            className="px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors shadow-sm"
          >
            Start generating notes
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-surface text-text-secondary py-8 px-4 sm:px-6 lg:px-8 border-t border-border">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-medium text-sm">N</span>
              </div>
              <span className="text-base font-medium text-text-primary">ExamNotes.Ai</span>
            </div>
            <p className="text-text-secondary text-sm">
              © 2026 ExamNotes.Ai. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;