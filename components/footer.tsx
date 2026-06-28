import Link from 'next/link'
import { Mail, MapPin, Phone, Zap } from 'lucide-react'
import { NewsletterSection } from './shared/NewsletterSection'

const COLS = [
  {
    heading: 'Mua sắm',
    links: [
      { label: 'Hàng Mới Về',     href: '/new'                     },
      { label: 'Bán Chạy Nhất',   href: '/products?sort=popular'   },
      { label: 'Flash Sale',       href: '/sale'                    },
      { label: 'Tất Cả Sản Phẩm', href: '/products'                },
      { label: 'Thương Hiệu',     href: '/brands'                  },
    ],
  },
  {
    heading: 'Hỗ trợ',
    links: [
      { label: 'Theo Dõi Đơn Hàng',  href: '/orders'    },
      { label: 'Danh Mục Sản Phẩm',  href: '/categories' },
      { label: 'Giỏ Hàng',           href: '/cart'       },
      { label: 'Yêu Thích',          href: '/wishlist'   },
      { label: 'Tài Khoản',          href: '/profile'    },
    ],
  },
  {
    heading: 'ShopHub',
    links: [
      { label: 'Về Chúng Tôi',    href: '#' },
      { label: 'Tuyển Dụng',      href: '#' },
      { label: 'Tin Tức',         href: '#' },
      { label: 'Bền Vững',        href: '#' },
      { label: 'Chương Trình CTV', href: '#' },
    ],
  },
]

const SOCIALS = [
  { label: 'Instagram', href: '#', icon: '◈' },
  { label: 'TikTok',   href: '#', icon: '◉' },
  { label: 'X',        href: '#', icon: '✕' },
  { label: 'YouTube',  href: '#', icon: '▶' },
]

const PAYMENTS = ['Visa', 'Mastercard', 'Amex', 'PayPal', 'MoMo', 'ZaloPay']

export default function Footer() {
  return (
    <footer className="border-t border-border bg-background mt-12">
      <NewsletterSection />

      {/* Main footer */}
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8 lg:gap-12 mb-12">

          {/* Brand column */}
          <div className="col-span-2 sm:col-span-3 lg:col-span-2">
            <Link href="/" className="flex items-center gap-1.5 mb-5 group w-fit">
              <span className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
                <Zap size={14} className="text-white fill-white" />
              </span>
              <span className="font-black text-[1.1rem] tracking-tight">
                shop<span className="text-primary">hub</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6 max-w-xs">
              Điểm đến cho sản phẩm chất lượng, thương hiệu độc quyền và trải nghiệm mua sắm tuyệt vời.
            </p>

            {/* Socials */}
            <div className="flex gap-2 mb-6">
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  title={s.label}
                  className="w-9 h-9 border border-border rounded-xl flex items-center justify-center text-sm text-muted-foreground hover:border-primary hover:text-primary transition-colors"
                >
                  {s.icon}
                </a>
              ))}
            </div>

            {/* Contact */}
            <div className="flex flex-col gap-2">
              {[
                { icon: Mail,  text: 'hello@shophub.vn'      },
                { icon: Phone, text: '1800 6789 (Miễn phí)'  },
                { icon: MapPin,text: '123 Phố Thương Mại, Hà Nội' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Icon size={13} className="text-primary shrink-0" />
                  {text}
                </div>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {COLS.map((col) => (
            <div key={col.heading}>
              <h4 className="text-xs font-bold uppercase tracking-widest text-foreground mb-4">
                {col.heading}
              </h4>
              <ul className="flex flex-col gap-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex flex-wrap gap-4 items-center">
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} ShopHub. Tất cả quyền được bảo lưu.
            </p>
            {[
              { label: 'Chính sách',  href: '#' },
              { label: 'Điều khoản',  href: '#' },
              { label: 'Cookie',      href: '#' },
            ].map((l) => (
              <Link key={l.label} href={l.href} className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                {l.label}
              </Link>
            ))}
          </div>

          {/* Payment badges */}
          <div className="flex items-center gap-2">
            {PAYMENTS.map((p) => (
              <span
                key={p}
                className="text-[10px] font-bold text-muted-foreground border border-border rounded-md px-1.5 py-0.5 bg-secondary"
              >
                {p}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile bottom nav spacer */}
      <div className="sm:hidden h-16" />
    </footer>
  )
}
