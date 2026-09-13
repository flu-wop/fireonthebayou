import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Fire on the Bayou terms of service.",
};

export default function Page() {
  return (
    <div className="min-h-screen bg-studio-black py-24 px-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="font-display text-4xl text-cream mb-2">Terms of Service</h1>
        <p className="text-mist/60 text-sm mb-10">Last updated: September 2026</p>
        <div className="bg-charcoal border border-border rounded-sm p-8 sm:p-12">
          <p className="text-mist leading-relaxed mb-6">
            This site showcases Fire on the Bayou's production work and services. All content, images, and project material shown are the property of Fire on the Bayou and may not be reproduced without permission.
          </p>
          <h2 className="font-display text-2xl text-gold mt-10 mb-3">Contact Us</h2>
          <p className="text-mist leading-relaxed mb-6">
            Email <a href="mailto:firenola@gmail.com" className="text-gold hover:underline">firenola@gmail.com</a>.
          </p>
        </div>
      </div>
    </div>
  );
}
