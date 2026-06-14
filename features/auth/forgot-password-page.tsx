'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, KeyRound, Loader2, MailCheck, Zap, Eye, EyeOff } from 'lucide-react'
import { useAuthStore } from '@/lib/stores/auth-store'

type Step = 'email' | 'otp' | 'new-password' | 'done'

const VALID_OTP = '123456'

export default function ForgotPasswordPage() {
  const router = useRouter()
  const login = useAuthStore(s => s.login)

  const [step, setStep] = useState<Step>('email')
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [newPass, setNewPass] = useState('')
  const [confirmPass, setConfirmPass] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleEmail(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!email.includes('@')) { setError('Email không hợp lệ'); return }
    setLoading(true)
    await new Promise(r => setTimeout(r, 800))
    setLoading(false)
    setStep('otp')
  }

  async function handleOtp(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (otp.length < 6) { setError('Vui lòng nhập đủ 6 chữ số'); return }
    if (otp !== VALID_OTP) { setError('Mã OTP không đúng. Thử lại: 123456'); return }
    setLoading(true)
    await new Promise(r => setTimeout(r, 600))
    setLoading(false)
    setStep('new-password')
  }

  async function handleNewPassword(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (newPass.length < 6) { setError('Mật khẩu phải ít nhất 6 ký tự'); return }
    if (newPass !== confirmPass) { setError('Mật khẩu xác nhận không khớp'); return }
    setLoading(true)
    await new Promise(r => setTimeout(r, 800))
    setStep('done')
    setLoading(false)
  }

  const STEP_LABELS = ['Email', 'OTP', 'Mật khẩu mới']
  const STEP_IDX = { email: 0, otp: 1, 'new-password': 2, done: 2 }

  return (
    <div className="min-h-screen flex">
      {/* Left branded panel */}
      <div className="hidden lg:flex lg:w-[46%] bg-[#0c0e14] flex-col p-14 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-600/8 via-transparent to-orange-600/5" />
        <div className="absolute -top-48 -right-48 w-96 h-96 bg-amber-600/8 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-72 h-72 bg-orange-600/6 rounded-full blur-3xl pointer-events-none" />

        <Link href="/" className="relative z-10 flex items-center gap-2 w-fit">
          <span className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center">
            <Zap size={17} className="text-white fill-white" />
          </span>
          <span className="font-black text-[1.35rem] tracking-tight text-white">
            shop<span className="text-primary">hub</span>
          </span>
        </Link>

        <div className="flex-1 flex flex-col justify-center relative z-10 py-16">
          <div className="w-20 h-20 bg-primary/15 rounded-3xl flex items-center justify-center mb-8">
            <KeyRound size={36} className="text-primary" />
          </div>
          <h1 className="text-[2.4rem] font-black text-white leading-[1.15] mb-4">
            Đặt lại<br />mật khẩu 🔑
          </h1>
          <p className="text-white/40 text-[0.95rem] leading-relaxed max-w-[280px]">
            Đừng lo — chúng tôi sẽ giúp bạn lấy lại quyền truy cập tài khoản trong vài bước đơn giản.
          </p>

          {/* Steps indicator */}
          <div className="mt-12 flex flex-col gap-3">
            {STEP_LABELS.map((label, i) => {
              const current = STEP_IDX[step]
              const done = i < current
              const active = i === current
              return (
                <div key={label} className="flex items-center gap-3">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    done ? 'bg-primary text-white' : active ? 'bg-primary/20 border-2 border-primary text-primary' : 'bg-white/5 border border-white/10 text-white/30'
                  }`}>
                    {done ? '✓' : i + 1}
                  </div>
                  <span className={`text-sm font-medium transition-all ${active ? 'text-white' : done ? 'text-white/50' : 'text-white/20'}`}>
                    {label}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        <p className="text-white/15 text-xs relative z-10">© 2026 ShopHub. Tất cả quyền được bảo lưu.</p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10 bg-background">
        <div className="w-full max-w-[390px]">
          <Link href="/" className="flex items-center gap-1.5 mb-10 lg:hidden w-fit">
            <span className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Zap size={15} className="text-white fill-white" />
            </span>
            <span className="font-black text-xl tracking-tight">shop<span className="text-primary">hub</span></span>
          </Link>

          {/* Mobile step indicator */}
          <div className="flex gap-1.5 mb-8 lg:hidden">
            {STEP_LABELS.map((_, i) => (
              <div key={i} className={`h-1 flex-1 rounded-full transition-all ${i <= STEP_IDX[step] ? 'bg-primary' : 'bg-border'}`} />
            ))}
          </div>

          {error && (
            <div className="mb-5 px-3.5 py-2.5 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-sm text-red-600 dark:text-red-400">
              {error}
            </div>
          )}

          {/* Step 1: Email */}
          {step === 'email' && (
            <>
              <Link href="/login" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-7 w-fit">
                <ArrowLeft size={16} />
                Quay lại đăng nhập
              </Link>
              <div className="mb-7">
                <h2 className="text-[1.65rem] font-black text-foreground mb-1.5">Quên mật khẩu?</h2>
                <p className="text-muted-foreground text-sm">
                  Nhập email đăng ký để nhận mã xác nhận đặt lại mật khẩu.
                </p>
              </div>
              <form onSubmit={handleEmail} className="space-y-4">
                <div>
                  <label className="text-sm font-semibold text-foreground block mb-1.5">Địa chỉ email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => { setEmail(e.target.value); setError('') }}
                    placeholder="ten@email.com"
                    autoComplete="email"
                    disabled={loading}
                    className="w-full h-11 px-4 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/60 transition-all placeholder:text-muted-foreground disabled:opacity-60"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-11 bg-primary hover:bg-primary/90 disabled:opacity-60 text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] text-sm"
                >
                  {loading ? <Loader2 size={17} className="animate-spin" /> : 'Gửi mã xác nhận'}
                </button>
              </form>
            </>
          )}

          {/* Step 2: OTP */}
          {step === 'otp' && (
            <>
              <button
                onClick={() => { setStep('email'); setError('') }}
                className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-7 w-fit"
              >
                <ArrowLeft size={16} />
                Quay lại
              </button>
              <div className="mb-7">
                <h2 className="text-[1.65rem] font-black text-foreground mb-1.5">Nhập mã OTP</h2>
                <p className="text-muted-foreground text-sm">
                  Mã 6 chữ số đã gửi đến <span className="font-semibold text-foreground">{email}</span>
                </p>
              </div>
              <div className="mb-4 px-3.5 py-2.5 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-xl text-xs text-blue-700 dark:text-blue-300">
                <span className="font-semibold">Demo:</span> Nhập <span className="font-mono font-bold">123456</span>
              </div>
              <form onSubmit={handleOtp} className="space-y-4">
                <div>
                  <label className="text-sm font-semibold text-foreground block mb-1.5">Mã xác nhận</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={otp}
                    onChange={e => { setOtp(e.target.value.replace(/\D/g, '')); setError('') }}
                    placeholder="123456"
                    disabled={loading}
                    className={`w-full h-11 px-4 rounded-xl border bg-background text-sm font-mono tracking-[0.25em] focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-foreground placeholder:tracking-normal disabled:opacity-60 ${error ? 'border-red-400' : 'border-border focus:border-primary/60'}`}
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading || otp.length < 6}
                  className="w-full h-11 bg-primary hover:bg-primary/90 disabled:opacity-60 text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] text-sm"
                >
                  {loading ? <Loader2 size={17} className="animate-spin" /> : 'Xác nhận'}
                </button>
              </form>
            </>
          )}

          {/* Step 3: New password */}
          {step === 'new-password' && (
            <>
              <div className="mb-7">
                <h2 className="text-[1.65rem] font-black text-foreground mb-1.5">Mật khẩu mới</h2>
                <p className="text-muted-foreground text-sm">Tạo mật khẩu mới cho tài khoản của bạn.</p>
              </div>
              <form onSubmit={handleNewPassword} className="space-y-4">
                <div>
                  <label className="text-sm font-semibold text-foreground block mb-1.5">Mật khẩu mới</label>
                  <div className="relative">
                    <input
                      type={showPass ? 'text' : 'password'}
                      value={newPass}
                      onChange={e => { setNewPass(e.target.value); setError('') }}
                      placeholder="Tối thiểu 6 ký tự"
                      autoComplete="new-password"
                      disabled={loading}
                      className="w-full h-11 px-4 pr-11 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/60 transition-all placeholder:text-muted-foreground disabled:opacity-60"
                    />
                    <button type="button" onClick={() => setShowPass(v => !v)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                      {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-semibold text-foreground block mb-1.5">Xác nhận mật khẩu</label>
                  <input
                    type="password"
                    value={confirmPass}
                    onChange={e => { setConfirmPass(e.target.value); setError('') }}
                    placeholder="Nhập lại mật khẩu mới"
                    autoComplete="new-password"
                    disabled={loading}
                    className={`w-full h-11 px-4 rounded-xl border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-foreground disabled:opacity-60 ${error ? 'border-red-400' : 'border-border focus:border-primary/60'}`}
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-11 bg-primary hover:bg-primary/90 disabled:opacity-60 text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] text-sm"
                >
                  {loading ? <Loader2 size={17} className="animate-spin" /> : 'Cập nhật mật khẩu'}
                </button>
              </form>
            </>
          )}

          {/* Step 4: Done */}
          {step === 'done' && (
            <div className="text-center py-6">
              <div className="w-20 h-20 bg-green-50 dark:bg-green-900/20 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <MailCheck size={36} className="text-green-500" />
              </div>
              <h2 className="text-[1.65rem] font-black text-foreground mb-2">Thành công! 🎉</h2>
              <p className="text-muted-foreground text-sm mb-8 max-w-[280px] mx-auto">
                Mật khẩu của bạn đã được đặt lại thành công. Bạn có thể đăng nhập ngay bây giờ.
              </p>
              <button
                onClick={() => { login(); router.push('/') }}
                className="w-full h-11 bg-primary hover:bg-primary/90 text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] text-sm"
              >
                Đăng nhập ngay
              </button>
              <Link href="/login" className="block mt-3 text-sm text-muted-foreground hover:text-foreground transition-colors">
                Về trang đăng nhập
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
