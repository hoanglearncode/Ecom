'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Zap, CheckCircle2, Gift, Users, Loader2 } from 'lucide-react'

const HIGHLIGHTS = [
  { icon: Gift, title: 'Quà tặng chào mừng', desc: 'Voucher 100k cho đơn hàng đầu tiên' },
  { icon: CheckCircle2, title: 'Trải nghiệm cá nhân hoá', desc: 'Gợi ý sản phẩm phù hợp với bạn' },
  { icon: Users, title: 'Cộng đồng mua sắm', desc: 'Tham gia cùng 2 triệu khách hàng' },
]

export default function RegisterPage() {
  const router = useRouter()

  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '' })
  const [showPass, setShowPass] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [agreed, setAgreed] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  function set(field: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm(f => ({ ...f, [field]: e.target.value }))
  }

  function validate() {
    const errs: Record<string, string> = {}
    if (!form.name.trim()) errs.name = 'Vui lòng nhập họ tên'
    if (!form.email.includes('@')) errs.email = 'Email không hợp lệ'
    if (form.phone.length < 10) errs.phone = 'Số điện thoại không hợp lệ'
    if (form.password.length < 6) errs.password = 'Mật khẩu phải ít nhất 6 ký tự'
    if (form.password !== form.confirm) errs.confirm = 'Mật khẩu xác nhận không khớp'
    if (!agreed) errs.agreed = 'Vui lòng đồng ý điều khoản'
    return errs
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const errs = validate()
    setErrors(errs)
    if (Object.keys(errs).length) return
    setLoading(true)
    await new Promise(r => setTimeout(r, 900))
    router.push(`/verify?email=${encodeURIComponent(form.email)}`)
  }

  return (
    <div className="min-h-screen flex">
      {/* Left branded panel */}
      <div className="hidden lg:flex lg:w-[46%] bg-[#0c0e14] flex-col p-14 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/10 via-transparent to-blue-600/5" />
        <div className="absolute -top-48 -left-48 w-96 h-96 bg-emerald-600/8 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-72 h-72 bg-blue-600/8 rounded-full blur-3xl pointer-events-none" />

        <Link href="/" className="relative z-10 flex items-center gap-2 w-fit">
          <span className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center">
            <Zap size={17} className="text-white fill-white" />
          </span>
          <span className="font-black text-[1.35rem] tracking-tight text-white">
            shop<span className="text-primary">hub</span>
          </span>
        </Link>

        <div className="flex-1 flex flex-col justify-center relative z-10 py-16">
          <h1 className="text-[2.4rem] font-black text-white leading-[1.15] mb-4">
            Tham gia<br />ShopHub 🚀
          </h1>
          <p className="text-white/40 text-[0.95rem] leading-relaxed mb-12 max-w-[280px]">
            Tạo tài khoản miễn phí và bắt đầu hành trình mua sắm thú vị của bạn.
          </p>

          <div className="flex flex-col gap-4">
            {HIGHLIGHTS.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-center gap-4 p-4 bg-white/[0.03] border border-white/[0.06] rounded-2xl">
                <div className="w-10 h-10 bg-primary/15 rounded-xl flex items-center justify-center shrink-0">
                  <Icon size={17} className="text-primary" />
                </div>
                <div>
                  <p className="text-white/80 text-sm font-semibold">{title}</p>
                  <p className="text-white/30 text-xs mt-0.5">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="text-white/15 text-xs relative z-10">© 2026 ShopHub. Tất cả quyền được bảo lưu.</p>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10 bg-background overflow-y-auto">
        <div className="w-full max-w-[420px] py-8">
          <Link href="/" className="flex items-center gap-1.5 mb-8 lg:hidden w-fit">
            <span className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Zap size={15} className="text-white fill-white" />
            </span>
            <span className="font-black text-xl tracking-tight">shop<span className="text-primary">hub</span></span>
          </Link>

          <div className="mb-7">
            <h2 className="text-[1.65rem] font-black text-foreground mb-1.5">Tạo tài khoản</h2>
            <p className="text-muted-foreground text-sm">
              Đã có tài khoản?{' '}
              <Link href="/login" className="text-primary font-semibold hover:underline">Đăng nhập</Link>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full name */}
            <div>
              <label className="text-sm font-semibold text-foreground block mb-1.5">Họ và tên</label>
              <input
                type="text"
                value={form.name}
                onChange={set('name')}
                placeholder="Nguyễn Văn A"
                autoComplete="name"
                disabled={loading}
                className={`w-full h-11 px-4 rounded-xl border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-foreground disabled:opacity-60 ${errors.name ? 'border-red-400 focus:border-red-400' : 'border-border focus:border-primary/60'}`}
              />
              {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="text-sm font-semibold text-foreground block mb-1.5">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={set('email')}
                placeholder="ten@email.com"
                autoComplete="email"
                disabled={loading}
                className={`w-full h-11 px-4 rounded-xl border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-foreground disabled:opacity-60 ${errors.email ? 'border-red-400 focus:border-red-400' : 'border-border focus:border-primary/60'}`}
              />
              {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
            </div>

            {/* Phone */}
            <div>
              <label className="text-sm font-semibold text-foreground block mb-1.5">Số điện thoại</label>
              <input
                type="tel"
                value={form.phone}
                onChange={set('phone')}
                placeholder="0912 345 678"
                autoComplete="tel"
                disabled={loading}
                className={`w-full h-11 px-4 rounded-xl border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-foreground disabled:opacity-60 ${errors.phone ? 'border-red-400 focus:border-red-400' : 'border-border focus:border-primary/60'}`}
              />
              {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="text-sm font-semibold text-foreground block mb-1.5">Mật khẩu</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={form.password}
                  onChange={set('password')}
                  placeholder="Tối thiểu 6 ký tự"
                  autoComplete="new-password"
                  disabled={loading}
                  className={`w-full h-11 px-4 pr-11 rounded-xl border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-foreground disabled:opacity-60 ${errors.password ? 'border-red-400 focus:border-red-400' : 'border-border focus:border-primary/60'}`}
                />
                <button type="button" onClick={() => setShowPass(v => !v)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
            </div>

            {/* Confirm password */}
            <div>
              <label className="text-sm font-semibold text-foreground block mb-1.5">Xác nhận mật khẩu</label>
              <div className="relative">
                <input
                  type={showConfirm ? 'text' : 'password'}
                  value={form.confirm}
                  onChange={set('confirm')}
                  placeholder="Nhập lại mật khẩu"
                  autoComplete="new-password"
                  disabled={loading}
                  className={`w-full h-11 px-4 pr-11 rounded-xl border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-foreground disabled:opacity-60 ${errors.confirm ? 'border-red-400 focus:border-red-400' : 'border-border focus:border-primary/60'}`}
                />
                <button type="button" onClick={() => setShowConfirm(v => !v)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                  {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.confirm && <p className="mt-1 text-xs text-red-500">{errors.confirm}</p>}
            </div>

            {/* Terms */}
            <div>
              <label className="flex items-start gap-2.5 cursor-pointer select-none">
                <button
                  type="button"
                  onClick={() => setAgreed(v => !v)}
                  className={`w-[18px] h-[18px] mt-0.5 rounded-[5px] border-2 flex items-center justify-center shrink-0 transition-all ${agreed ? 'bg-primary border-primary' : errors.agreed ? 'border-red-400' : 'border-border hover:border-primary/60'}`}
                >
                  {agreed && (
                    <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                      <path d="M1 3.5L3 5.5L8 1" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </button>
                <span className="text-sm text-foreground/65 leading-snug">
                  Tôi đồng ý với{' '}
                  <Link href="#" className="text-primary hover:underline font-medium">Điều khoản dịch vụ</Link>
                  {' '}và{' '}
                  <Link href="#" className="text-primary hover:underline font-medium">Chính sách bảo mật</Link>
                </span>
              </label>
              {errors.agreed && <p className="mt-1 text-xs text-red-500">{errors.agreed}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 bg-primary hover:bg-primary/90 disabled:opacity-60 text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] text-sm"
            >
              {loading ? <Loader2 size={17} className="animate-spin" /> : 'Tạo tài khoản'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
