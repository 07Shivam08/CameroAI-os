"use client";

import Script from "next/script";
import Link from "next/link";
import {
  Check,
  Star,
  Sparkles,
  Crown,
  Building2,
  Zap,
  Shield,
  Bot,
} from "lucide-react";

export default function PricingPage() {
  const plans = [
    {
      name: "Starter",
      price: "$0",
      frequency: "forever",
      description:
        "Perfect for individuals and small teams getting started with AI assistance.",
      features: [
        "Free forever",
        "Basic AI conversations",
        "Document analysis",
        "Email support",
        "Mobile app access",
      ],
      buttonText: "Get Started",
      gradient: "bg-gradient-to-br from-emerald-500 to-emerald-600",
      icon: Bot,
      popular: false,
      bgColor: "bg-gradient-to-br from-emerald-50 to-emerald-100",
      borderColor: "border-emerald-200",
    },
    {
      name: "Professional",
      price: "$29",
      frequency: "/ month/user",
      description:
        "Advanced features for growing teams who need more powerful AI capabilities.",
      features: [
        "Everything in Starter, plus:",
        "Advanced AI models",
        "Team collaboration",
        "Custom integrations",
        "Priority support",
        "Analytics dashboard",
        "API access",
      ],
      buttonText: "Upgrade Now",
      gradient: "bg-gradient-to-br from-blue-500 to-blue-600",
      icon: Zap,
      popular: true,
      bgColor: "bg-gradient-to-br from-blue-50 to-blue-100",
      borderColor: "border-blue-300",
    },
    {
      name: "Enterprise",
      price: "$99",
      frequency: "/ month/user",
      description:
        "Complete solution for large organizations with custom requirements.",
      features: [
        "Everything in Professional, plus:",
        "Custom AI training",
        "Enterprise security",
        "Dedicated support",
        "SLA guarantee",
        "Custom deployment",
        "Advanced analytics",
      ],
      buttonText: "Contact Sales",
      gradient: "bg-gradient-to-br from-purple-500 to-purple-600",
      icon: Crown,
      popular: false,
      bgColor: "bg-gradient-to-br from-purple-50 to-purple-100",
      borderColor: "border-purple-200",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-slate-100">
      {/* Load Razorpay Checkout script */}
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="beforeInteractive"
      />

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-blue-600 opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-6 py-20">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl mb-6">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              Choose Your AI Journey
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-4 leading-relaxed">
              Unlock the power of intelligent automation with Camero AI. From
              personal assistance to enterprise-grade solutions.
            </p>
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-100 to-blue-100 text-emerald-800 text-sm font-medium px-4 py-2 rounded-full">
              <Star className="w-4 h-4 fill-current" />
              <span>7 day free trial • No credit card required</span>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="max-w-7xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => {
            const IconComponent = plan.icon;
            return (
              <div
                key={plan.name}
                className={`relative group bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg ${
                  plan.borderColor
                } border-2 overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 ${
                  plan.popular ? "ring-2 ring-blue-500 ring-opacity-50" : ""
                }`}
              >
                {plan.popular && (
                  <div className="absolute top-4 right-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1">
                    <Star className="w-3 h-3 fill-current" />
                    Most Popular
                  </div>
                )}

                {/* Header */}
                <div className={`${plan.bgColor} p-8 text-center relative`}>
                  <div className="absolute top-4 left-4">
                    <div
                      className={`p-3 ${plan.gradient} rounded-xl shadow-lg`}
                    >
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="mt-8">
                    <h2 className="text-2xl font-bold text-slate-800 mb-2">
                      {plan.name}
                    </h2>
                    <div className="flex items-baseline justify-center mb-4">
                      <span className="text-5xl font-bold text-slate-800">
                        {plan.price}
                      </span>
                      <span className="text-slate-600 ml-2 text-lg">
                        {plan.frequency}
                      </span>
                    </div>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      {plan.description}
                    </p>
                  </div>
                </div>

                {/* Features */}
                <div className="p-8 flex-1">
                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <div className="p-1 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full mt-0.5">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                        <span className="text-slate-700 text-sm leading-relaxed">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA Button */}
                  <Link
                    href={`/form/create?plan=${plan.name.toLowerCase()}`}
                    className="block w-full"
                  >
                    <button
                      className={`w-full py-4 px-6 rounded-xl font-semibold transition-all duration-200 ${
                        plan.popular
                          ? "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg shadow-blue-500/30"
                          : "bg-gradient-to-r from-slate-100 to-slate-200 hover:from-slate-200 hover:to-slate-300 text-slate-700 border border-slate-300"
                      }`}
                    >
                      {plan.buttonText}
                    </button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Trust Section */}
        <div className="mt-20 bg-white/70 backdrop-blur-sm rounded-2xl border border-slate-200 p-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Shield className="w-6 h-6 text-emerald-600" />
              <h3 className="text-2xl font-bold text-slate-800">
                Trusted by Industry Leaders
              </h3>
            </div>
            <p className="text-slate-600 mb-6">
              Enterprise-grade security, 99.9% uptime, and world-class support
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center justify-center gap-3 p-4 bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-lg">
                <Shield className="w-5 h-5 text-emerald-600" />
                <span className="text-sm font-medium text-slate-700">
                  SOC 2 Compliant
                </span>
              </div>
              <div className="flex items-center justify-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg">
                <Zap className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-medium text-slate-700">
                  99.9% Uptime
                </span>
              </div>
              <div className="flex items-center justify-center gap-3 p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg">
                <Building2 className="w-5 h-5 text-purple-600" />
                <span className="text-sm font-medium text-slate-700">
                  24/7 Support
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
