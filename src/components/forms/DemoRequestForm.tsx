"use client";

import { useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import RevealOnScroll from "@/components/ui/RevealOnScroll";

export default function DemoRequestForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    employees: "",
    website: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const formspreeId = process.env.NEXT_PUBLIC_FORMSPREE_ID;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.website) return; // honeypot

    if (!formspreeId) {
      alert(
        "Demo form is not configured yet. Please email info@payrollsynergyexperts.com."
      );
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`https://formspree.io/f/${formspreeId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          company: formData.company,
          employees: formData.employees,
          source: "pse-marketing",
          _subject: `Demo Request: ${formData.company || formData.name}`,
        }),
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
    <section id="demo" className="py-28 px-6 sm:px-10 bg-sand">
      <div className="max-w-[640px] mx-auto">
        <RevealOnScroll className="text-center mb-10">
          <h2 className="font-serif text-[clamp(2rem,4vw,2.75rem)] font-bold tracking-[-0.02em] text-navy mb-3.5">
            Ready to modernize payroll?
          </h2>
          <p className="text-[17px] text-muted">
            Tell us about your business and we&apos;ll schedule a personalized
            walkthrough — including CHAP AI in action.
          </p>
        </RevealOnScroll>

        {submitted ? (
          <RevealOnScroll delay="reveal-d1">
            <div className="px-8 py-10 bg-white rounded-2xl border-2 border-mint text-center">
              <div className="w-[52px] h-[52px] rounded-full bg-mint/10 flex items-center justify-center mx-auto mb-4">
                <Check
                  size={24}
                  strokeWidth={3}
                  className="text-mint"
                  aria-hidden="true"
                />
              </div>
              <div className="text-xl font-bold text-navy mb-1.5">
                Demo request received
              </div>
              <div className="text-[15px] text-muted">
                We&apos;ll reach out within 24 hours to schedule your
                walkthrough.
              </div>
              <div className="mt-6 flex gap-3 justify-center flex-wrap">
                <a
                  href="#preview"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[10px] text-[13px] font-semibold bg-transparent text-navy border-2 border-[#d4d8e0] hover:border-navy transition-all"
                >
                  Watch the Preview
                </a>
              </div>
            </div>
          </RevealOnScroll>
        ) : (
          <RevealOnScroll delay="reveal-d1">
            <form
              onSubmit={handleSubmit}
              className="bg-white rounded-2xl p-8 sm:p-9 shadow-[0_8px_32px_rgba(0,0,0,0.04)] border border-border"
            >
              {/* Honeypot */}
              <input
                type="text"
                value={formData.website}
                onChange={(e) =>
                  setFormData({ ...formData, website: e.target.value })
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
                    className="block text-[13px] font-semibold text-navy mb-1.5"
                  >
                    Full Name *
                  </label>
                  <input
                    id="name"
                    type="text"
                    placeholder="Jane Smith"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full px-[18px] py-3.5 border-2 border-input-border rounded-[10px] text-[15px] font-sans outline-none focus:border-blue transition-colors bg-white placeholder:text-[#aaa]"
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-[13px] font-semibold text-navy mb-1.5"
                  >
                    Work Email *
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="jane@company.com"
                    required
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full px-[18px] py-3.5 border-2 border-input-border rounded-[10px] text-[15px] font-sans outline-none focus:border-blue transition-colors bg-white placeholder:text-[#aaa]"
                  />
                </div>
                <div>
                  <label
                    htmlFor="company"
                    className="block text-[13px] font-semibold text-navy mb-1.5"
                  >
                    Company
                  </label>
                  <input
                    id="company"
                    type="text"
                    placeholder="Acme Corp"
                    value={formData.company}
                    onChange={(e) =>
                      setFormData({ ...formData, company: e.target.value })
                    }
                    className="w-full px-[18px] py-3.5 border-2 border-input-border rounded-[10px] text-[15px] font-sans outline-none focus:border-blue transition-colors bg-white placeholder:text-[#aaa]"
                  />
                </div>
                <div>
                  <label
                    htmlFor="employees"
                    className="block text-[13px] font-semibold text-navy mb-1.5"
                  >
                    Employees
                  </label>
                  <select
                    id="employees"
                    value={formData.employees}
                    onChange={(e) =>
                      setFormData({ ...formData, employees: e.target.value })
                    }
                    className={`w-full px-[18px] py-3.5 border-2 border-input-border rounded-[10px] text-[15px] font-sans outline-none focus:border-blue transition-colors bg-white ${
                      formData.employees ? "text-text" : "text-[#aaa]"
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
                className="w-full flex items-center justify-center gap-2 px-[30px] py-4 rounded-[10px] text-[15px] font-semibold bg-navy text-white hover:bg-navy-light hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(11,29,58,0.25)] transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
              >
                {submitting ? "Submitting..." : "Request a Demo"}
                {!submitting && (
                  <ArrowRight size={15} strokeWidth={2} aria-hidden="true" />
                )}
              </button>

              <div className="text-center mt-3.5 text-[13px] text-muted">
                Platform access is by invitation only. We&apos;ll reach out
                after your request.
              </div>
            </form>
          </RevealOnScroll>
        )}
      </div>
    </section>
  );
}
