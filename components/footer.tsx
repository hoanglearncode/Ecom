import Link from 'next/link'
import { Mail, MapPin, Phone, Zap } from 'lucide-react'

const COLS = [
  {
    heading: 'Shop',
    links: ['New Arrivals', 'Best Sellers', 'Sale', 'All Products', 'Gift Cards'],
  },
  {
    heading: 'Support',
    links: ['Help Center', 'Track My Order', 'Returns & Refunds', 'Shipping Info', 'FAQ'],
  },
  {
    heading: 'Company',
    links: ['About Us', 'Careers', 'Press', 'Sustainability', 'Affiliate Program'],
  },
]

const SOCIALS = [
  { label: 'Instagram', href: '#', icon: '◈' },
  { label: 'TikTok', href: '#', icon: '◉' },
  { label: 'X', href: '#', icon: '✕' },
  { label: 'YouTube', href: '#', icon: '▶' },
]

const PAYMENTS = ['Visa', 'Mastercard', 'Amex', 'PayPal', 'ApplePay']

export default function Footer() {
  return (
    <footer className="border-t border-border bg-background">

      {/* Newsletter strip */}
      <div className="bg-primary">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
          <div className="flex flex-col sm:flex-row sm:items-center gap-6 sm:gap-12">
            <div className="sm:flex-1">
              <p className="text-xs font-bold uppercase tracking-widest text-white/60 mb-1">Newsletter</p>
              <h3 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                Get 20% off your first order.
              </h3>
            </div>
            <div className="sm:w-96">
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 min-w-0 bg-white/15 border border-white/20 rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-white/50 focus:outline-none focus:bg-white/20 transition-all"
                />
                <button className="shrink-0 bg-white text-primary font-bold text-sm px-5 py-2.5 rounded-xl hover:bg-white/90 active:scale-[0.97] transition-all">
                  Subscribe
                </button>
              </div>
              <p className="text-white/40 text-[11px] mt-2">No spam. Unsubscribe at any time.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8 lg:gap-12 mb-12">

          {/* Brand col */}
          <div className="col-span-2 sm:col-span-3 lg:col-span-2">
            <Link href="/" className="flex items-center gap-1.5 mb-5 group w-fit">
              <span className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
                <Zap size={14} className="text-white fill-white" />
              </span>
              <span className="font-black text-[1.1rem] tracking-tight">shop<span className="text-primary">hub</span></span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6 max-w-xs">
              Your destination for quality products, exclusive brands, and exceptional shopping experiences.
            </p>

            {/* Socials */}
            <div className="flex gap-2 mb-6">
              {SOCIALS.map(s => (
                <a key={s.label} href={s.href} title={s.label} className="w-9 h-9 border border-border rounded-xl flex items-center justify-center text-sm text-muted-foreground hover:border-primary hover:text-primary transition-colors">
                  {s.icon}
                </a>
              ))}
            </div>

            {/* Contact */}
            <div className="flex flex-col gap-2">
              {[
                { icon: Mail, text: 'hello@shophub.com' },
                { icon: Phone, text: '+1 800 746 7482' },
                { icon: MapPin, text: '123 Commerce St, New York' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Icon size={13} className="text-primary shrink-0" />
                  {text}
                </div>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {COLS.map(col => (
            <div key={col.heading}>
              <h4 className="text-xs font-bold uppercase tracking-widest text-foreground mb-4">{col.heading}</h4>
              <ul className="flex flex-col gap-2.5">
                {col.links.map(link => (
                  <li key={link}>
                    <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{link}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex flex-wrap gap-4 items-center">
            <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} ShopHub. All rights reserved.</p>
            {['Privacy', 'Terms', 'Cookies'].map(l => (
              <Link key={l} href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">{l}</Link>
            ))}
          </div>
          {/* Payment badges */}
          <div className="flex items-center gap-2">
            {PAYMENTS.map(p => (
              <span key={p} className="text-[10px] font-bold text-muted-foreground border border-border rounded-md px-1.5 py-0.5 bg-secondary">{p}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile bottom nav spacer */}
      <div className="sm:hidden h-16" />
    </footer>
  )
}