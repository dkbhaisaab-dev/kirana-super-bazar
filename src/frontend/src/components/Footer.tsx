import { Heart, Store } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();
  const hostname = encodeURIComponent(window.location.hostname);

  return (
    <footer className="bg-foreground text-white mt-16">
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
                <Store className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="font-bold text-sm">Kirana Super Bazar</div>
                <div className="text-xs text-white/60">किराना सुपर बाजार</div>
              </div>
            </div>
            <p className="text-sm text-white/60 leading-relaxed">
              ताजा सामान, घर पर डिलीवरी।
              <br />
              Fresh groceries, delivered daily.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="font-bold text-sm mb-3 text-white/90">
              Quick Links
            </h4>
            <ul className="space-y-1.5 text-sm text-white/60">
              <li>📦 Track Your Order</li>
              <li>🔄 Returns & Refunds</li>
              <li>📞 Customer Support</li>
              <li>❓ FAQ</li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-bold text-sm mb-3 text-white/90">Categories</h4>
            <ul className="space-y-1.5 text-sm text-white/60">
              <li>🌾 Grains & Pulses (अनाज)</li>
              <li>🧂 Spices (मसाले)</li>
              <li>🥛 Dairy (डेयरी)</li>
              <li>🥦 Fresh Vegetables (सब्जियां)</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-white/40">
          <span>© {year} Kirana Super Bazar. All rights reserved.</span>
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${hostname}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 hover:text-white/70 transition-colors"
          >
            Built with <Heart className="w-3 h-3 text-red-400" /> using
            caffeine.ai
          </a>
        </div>
      </div>
    </footer>
  );
}
