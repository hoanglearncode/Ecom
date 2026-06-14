'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Zap, ShoppingBag, Shield, Truck, Star, Loader2 } from 'lucide-react'
import { useAuthStore } from '@/lib/stores/auth-store'

const BENEFITS = [
  { icon: ShoppingBag, title: 'Mua sắm dễ dàng', desc: 'Hàng triệu sản phẩm chính hãng' },
  { icon: Truck, title: 'Giao hàng nhanh', desc: 'Miễn phí cho đơn trên 500k' },
  { icon: Shield, title: 'Thanh toán an toàn', desc: 'Bảo hiểm 100% đơn hàng' },
  { icon: Star, title: 'Tích điểm thưởng', desc: 'Nhận ưu đãi mỗi đơn hàng' },
]

export default function LoginPage() {
  const router = useRouter()
  const login = useAuthStore(s => s.login)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [remember, setRemember] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!email.trim() || !password) { setError('Vui lòng điền đầy đủ thông tin'); return }
    if (password.length < 6) { setError('Mật khẩu phải ít nhất 6 ký tự'); return }
    setLoading(true)
    await new Promise(r => setTimeout(r, 900))
    login()
    router.push('/')
  }

  async function handleSocial() {
    setLoading(true)
    await new Promise(r => setTimeout(r, 700))
    login()
    router.push('/')
  }

  return (
    <div className="min-h-screen flex">
      {/* Left branded panel */}
      <div className="hidden lg:flex lg:w-[54%] bg-[#0c0e14] flex-col p-14 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-600/10 via-transparent to-blue-600/5" />
        <div className="absolute -top-48 -right-48 w-96 h-96 bg-violet-600/8 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-72 h-72 bg-blue-600/8 rounded-full blur-3xl pointer-events-none" />

        <Link href="/" className="relative z-10 flex items-center gap-2 w-fit">
          <span className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center">
            <Zap size={17} className="text-white fill-white" />
          </span>
          <span className="font-black text-[1.35rem] tracking-tight text-white">
            shop<span className="text-primary">hub</span>
          </span>
        </Link>

        <div className="flex-1 flex flex-col justify-center relative z-10 py-16">
          <h1 className="text-[2.6rem] font-black text-white leading-[1.15] mb-4">
            Chào mừng<br />trở lại! 👋
          </h1>
          <p className="text-white/40 text-[0.95rem] leading-relaxed mb-12 max-w-[300px]">
            Đăng nhập để tiếp tục mua sắm và khám phá hàng triệu sản phẩm chính hãng.
          </p>
          <div className="grid grid-cols-2 gap-3">
            {BENEFITS.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="p-4 bg-white/[0.03] border border-white/[0.06] rounded-2xl">
                <div className="w-8 h-8 bg-primary/15 rounded-lg flex items-center justify-center mb-3">
                  <Icon size={15} className="text-primary" />
                </div>
                <p className="text-white/75 text-sm font-semibold leading-tight mb-0.5">{title}</p>
                <p className="text-white/30 text-xs">{desc}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="text-white/15 text-xs relative z-10">© 2026 ShopHub. Tất cả quyền được bảo lưu.</p>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10 bg-background">
        <div className="w-full max-w-[390px]">
          <Link href="/" className="flex items-center gap-1.5 mb-10 lg:hidden w-fit">
            <span className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Zap size={15} className="text-white fill-white" />
            </span>
            <span className="font-black text-xl tracking-tight">shop<span className="text-primary">hub</span></span>
          </Link>

          <div className="mb-7">
            <h2 className="text-[1.65rem] font-black text-foreground mb-1.5">Đăng nhập</h2>
            <p className="text-muted-foreground text-sm">
              Chưa có tài khoản?{' '}
              <Link href="/register" className="text-primary font-semibold hover:underline">Đăng ký ngay</Link>
            </p>
          </div>

          {error && (
            <div className="mb-4 px-3.5 py-2.5 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-sm text-red-600 dark:text-red-400">
              {error}
            </div>
          )}

          <div className="mb-5 px-3.5 py-2.5 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-xl text-xs text-blue-700 dark:text-blue-300">
            <span className="font-semibold">Demo:</span> Nhập bất kỳ email + mật khẩu ≥6 ký tự
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-semibold text-foreground block mb-1.5">
                Email hoặc số điện thoại
              </label>
              <input
                type="text"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="ten@email.com"
                autoComplete="email"
                disabled={loading}
                className="w-full h-11 px-4 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/60 transition-all placeholder:text-muted-foreground disabled:opacity-60"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm font-semibold text-foreground">Mật khẩu</label>
                <Link href="/forgot-password" className="text-xs text-primary hover:underline font-medium">
                  Quên mật khẩu?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  disabled={loading}
                  className="w-full h-11 px-4 pr-11 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/60 transition-all placeholder:text-muted-foreground disabled:opacity-60"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(v => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <label className="flex items-center gap-2.5 cursor-pointer select-none">
              <button
                type="button"
                onClick={() => setRemember(v => !v)}
                className={`w-[18px] h-[18px] rounded-[5px] border-2 flex items-center justify-center shrink-0 transition-all ${
                  remember ? 'bg-primary border-primary' : 'border-border hover:border-primary/60'
                }`}
              >
                {remember && (
                  <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                    <path d="M1 3.5L3 5.5L8 1" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </button>
              <span className="text-sm text-foreground/65">Ghi nhớ đăng nhập</span>
            </label>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 bg-primary hover:bg-primary/90 disabled:opacity-60 text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] text-sm"
            >
              {loading ? <Loader2 size={17} className="animate-spin" /> : 'Đăng nhập'}
            </button>
          </form>

          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted-foreground font-medium px-1">hoặc tiếp tục với</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={handleSocial}
              disabled={loading}
              className="h-11 flex items-center justify-center gap-2.5 border border-border rounded-xl text-sm font-medium text-foreground/75 hover:bg-secondary hover:text-foreground disabled:opacity-50 transition-all"
            >
              <svg viewBox="0 0 24 24" width="17" height="17">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Google
            </button>
            <button
              type="button"
              onClick={handleSocial}
              disabled={loading}
              className="h-11 flex items-center justify-center gap-2.5 border border-border rounded-xl text-sm font-medium text-foreground/75 hover:bg-secondary hover:text-foreground disabled:opacity-50 transition-all"
            >
              <svg viewBox="0 0 24 24" width="17" height="17" fill="#1877F2">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              Facebook
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
