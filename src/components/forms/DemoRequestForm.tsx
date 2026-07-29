"use client";

import { useState } from "react";
import { ArrowRight, Check, Calendar, Clock, Lock } from "lucide-react";
import RevealOnScroll from "@/components/ui/RevealOnScroll";

export default function DemoRequestForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    employees: "",
    ref_120: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.ref_120) return; // honeypot

    setSubmitting(true);
    try {
      const res = await fetch("/api/demo-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setSubmitted(true);
      } else {
        alert(
          "Something went wrong. Please try again or email info@payrollsynergyexperts.com."
        );
      }
    } catch {
      alert(
        "Network error. Please try again or email info@payrollsynergyexperts.com."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="demo" className="py-28 px-8 bg-ice">
      <div className="max-w-[1100px] mx-auto">
        {submitted ? (
          <RevealOnScroll>
            <div className="max-w-[640px] mx-auto px-8 py-10 bg-white rounded-2xl border-2 border-green text-center shadow-md">
              <div className="w-[52px] h-[52px] rounded-full bg-green-bg flex items-center justify-center mx-auto mb-4">
                <Check
                  size={24}
                  strokeWidth={3}
                  className="text-green"
                  aria-hidden="true"
                />
              </div>
              <div className="text-xl font-bold text-text mb-1.5">
                Demo request received
              </div>
              <div className="text-[15px] text-text-secondary">
                We&apos;ll reach out within one business day to schedule your
                walkthrough.
              </div>
            </div>
          </RevealOnScroll>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            {/* Left: Feature bullets */}
            <RevealOnScroll>
              <span className="inline-block text-xs font-semibold text-steel uppercase tracking-[0.08em] mb-3">
                Get Started
              </span>
              <h2 className="text-[clamp(2rem,4vw,2.75rem)] font-bold tracking-[-0.02em] text-text mb-4">
                Request a Demo
              </h2>
              <p className="text-[17px] text-text-secondary leading-[1.7] mb-8 max-w-[440px]">
                See how CHAP AI catches compliance issues before they cost you —
                in a personalized walkthrough of the platform.
              </p>

              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-ice flex items-center justify-center shrink-0">
                    <Calendar
                      size={18}
                      strokeWidth={1.5}
                      className="text-steel"
                      aria-hidden="true"
                    />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-text">
                      Personalized walkthrough
                    </div>
                    <div className="text-[13px] text-text-secondary">
                      Tailored to your payroll workflow
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-ice flex items-center justify-center shrink-0">
                    <Clock
                      size={18}
                      strokeWidth={1.5}
                      className="text-steel"
                      aria-hidden="true"
                    />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-text">
                      30-minute session
                    </div>
                    <div className="text-[13px] text-text-secondary">
                      Quick overview with live Q&amp;A
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-ice flex items-center justify-center shrink-0">
                    <Lock
                      size={18}
                      strokeWidth={1.5}
                      className="text-steel"
                      aria-hidden="true"
                    />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-text">
                      By invitation only
                    </div>
                    <div className="text-[13px] text-text-secondary">
                      Platform access is limited
                    </div>
                  </div>
                </div>
              </div>
            </RevealOnScroll>

            {/* Right: Form card */}
            <RevealOnScroll delay="reveal-d1">
              <form
                onSubmit={handleSubmit}
                className="bg-white rounded-2xl p-8 sm:p-9 shadow-lg border border-border"
              >
                <h3 className="text-xl font-bold text-text mb-6">
                  Request a Demo
                </h3>

                {/* Honeypot */}
                <input
                  type="text"
                  name="ref_120"
                  value={formData.ref_120}
                  onChange={(e) =>
                    setFormData({ ...formData, ref_120: e.target.value })
                  }
                  className="absolute -left-[9999px] opacity-0 h-0"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-[13px] font-semibold text-text mb-1.5"
                    >
                      Full Name *
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="Jane Smith"
                      required
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-border rounded-lg text-[15px] font-sans outline-none focus:border-steel-light focus:ring-1 focus:ring-steel-light transition-colors bg-white placeholder:text-text-tertiary"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-[13px] font-semibold text-text mb-1.5"
                    >
                      Work Email *
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="jane@company.com"
                      required
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-border rounded-lg text-[15px] font-sans outline-none focus:border-steel-light focus:ring-1 focus:ring-steel-light transition-colors bg-white placeholder:text-text-tertiary"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="company"
                      className="block text-[13px] font-semibold text-text mb-1.5"
                    >
                      Company
                    </label>
                    <input
                      id="company"
                      name="company"
                      type="text"
                      placeholder="Acme Corp"
                      value={formData.company}
                      onChange={(e) =>
                        setFormData({ ...formData, company: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-border rounded-lg text-[15px] font-sans outline-none focus:border-steel-light focus:ring-1 focus:ring-steel-light transition-colors bg-white placeholder:text-text-tertiary"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="employees"
                      className="block text-[13px] font-semibold text-text mb-1.5"
                    >
                      Employees
                    </label>
                    <select
                      id="employees"
                      name="employees"
                      value={formData.employees}
                      onChange={(e) =>
                        setFormData({ ...formData, employees: e.target.value })
                      }
                      className={`w-full px-4 py-3 border border-border rounded-lg text-[15px] font-sans outline-none focus:border-steel-light focus:ring-1 focus:ring-steel-light transition-colors bg-white ${
                        formData.employees ? "text-text" : "text-text-tertiary"
                      }`}
                    >
                      <option value="">Select range</option>
                      <option value="1-50">1 – 50</option>
                      <option value="51-200">51 – 200</option>
                      <option value="201-500">201 – 500</option>
                      <option value="500+">500+</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg text-[15px] font-semibold bg-navy text-white hover:bg-navy-dark hover:-translate-y-px hover:shadow-md transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                >
                  {submitting ? "Submitting..." : "Request a Demo"}
                  {!submitting && (
                    <ArrowRight
                      size={15}
                      strokeWidth={2}
                      aria-hidden="true"
                    />
                  )}
                </button>

                <div className="text-center mt-3.5 text-[13px] text-text-tertiary">
                  We&apos;ll reach out within one business day.
                </div>
              </form>
            </RevealOnScroll>
          </div>
        )}
      </div>
    </section>
  );
}
