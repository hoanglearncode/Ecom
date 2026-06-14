'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { ArrowLeft, Loader2, MailCheck, Zap } from 'lucide-react'
import { useAuthStore } from '@/lib/stores/auth-store'

const VALID_OTP = '123456'
const TIMER_SECONDS = 120

export default function VerifyPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get('email') ?? 'email của bạn'
  const login = useAuthStore(s => s.login)

  const [digits, setDigits] = useState(['', '', '', '', '', ''])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [timer, setTimer] = useState(TIMER_SECONDS)
  const [resending, setResending] = useState(false)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    inputRefs.current[0]?.focus()
  }, [])

  useEffect(() => {
    if (timer <= 0) return
    const id = setTimeout(() => setTimer(t => t - 1), 1000)
    return () => clearTimeout(id)
  }, [timer])

  const formatTimer = (s: number) =>
    `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`

  const handleDigit = useCallback((idx: number, val: string) => {
    if (!/^\d*$/.test(val)) return
    const next = [...digits]
    next[idx] = val.slice(-1)
    setDigits(next)
    setError('')
    if (val && idx < 5) inputRefs.current[idx + 1]?.focus()
  }, [digits])

  const handleKeyDown = useCallback((idx: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[idx] && idx > 0) {
      inputRefs.current[idx - 1]?.focus()
    }
    if (e.key === 'ArrowLeft' && idx > 0) inputRefs.current[idx - 1]?.focus()
    if (e.key === 'ArrowRight' && idx < 5) inputRefs.current[idx + 1]?.focus()
  }, [digits])

  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    e.preventDefault()
    const text = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    const next = text.split('').concat(Array(6).fill('')).slice(0, 6)
    setDigits(next)
    const focusIdx = Math.min(text.length, 5)
    inputRefs.current[focusIdx]?.focus()
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const code = digits.join('')
    if (code.length < 6) { setError('Vui lòng nhập đủ 6 chữ số'); return }
    if (code !== VALID_OTP) { setError('Mã OTP không đúng. Thử lại: 123456'); return }
    setLoading(true)
    await new Promise(r => setTimeout(r, 800))
    login()
    router.push('/')
  }

  async function handleResend() {
    setResending(true)
    await new Promise(r => setTimeout(r, 600))
    setTimer(TIMER_SECONDS)
    setDigits(['', '', '', '', '', ''])
    setError('')
    setResending(false)
    inputRefs.current[0]?.focus()
  }

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-[46%] bg-[#0c0e14] flex-col p-14 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-transparent to-violet-600/5" />
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-600/8 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-violet-600/8 rounded-full blur-3xl pointer-events-none" />

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
            <MailCheck size={36} className="text-primary" />
          </div>
          <h1 className="text-[2.4rem] font-black text-white leading-[1.15] mb-4">
            Kiểm tra<br />email 📬
          </h1>
          <p className="text-white/40 text-[0.95rem] leading-relaxed max-w-[280px]">
            Chúng tôi đã gửi mã xác nhận 6 chữ số đến email của bạn. Mã có hiệu lực trong 2 phút.
          </p>

          <div className="mt-10 p-5 bg-white/[0.03] border border-white/[0.06] rounded-2xl">
            <p className="text-white/25 text-xs uppercase tracking-widest font-semibold mb-2">Lưu ý bảo mật</p>
            <p className="text-white/45 text-sm leading-relaxed">
              ShopHub sẽ không bao giờ yêu cầu bạn cung cấp mã OTP qua điện thoại hay email. Chỉ nhập mã trên trang web chính thức.
            </p>
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

          <Link href="/register" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-7 w-fit">
            <ArrowLeft size={16} />
            Quay lại
          </Link>

          <div className="mb-8">
            <h2 className="text-[1.65rem] font-black text-foreground mb-1.5">Xác thực OTP</h2>
            <p className="text-muted-foreground text-sm">
              Nhập mã 6 chữ số đã gửi đến{' '}
              <span className="font-semibold text-foreground">{email}</span>
            </p>
          </div>

          {error && (
            <div className="mb-5 px-3.5 py-2.5 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-sm text-red-600 dark:text-red-400">
              {error}
            </div>
          )}

          <div className="mb-5 px-3.5 py-2.5 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-xl text-xs text-blue-700 dark:text-blue-300">
            <span className="font-semibold">Demo:</span> Nhập <span className="font-mono font-bold">123456</span> để xác thực
          </div>

          <form onSubmit={handleSubmit}>
            {/* OTP boxes */}
            <div className="flex gap-2.5 mb-6" onPaste={handlePaste}>
              {digits.map((d, i) => (
                <input
                  key={i}
                  ref={el => { inputRefs.current[i] = el }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={d}
                  onChange={e => handleDigit(i, e.target.value)}
                  onKeyDown={e => handleKeyDown(i, e)}
                  disabled={loading}
                  className={`flex-1 h-14 text-center text-xl font-bold rounded-xl border bg-background transition-all focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-60 ${
                    error ? 'border-red-400' : d ? 'border-primary/60 bg-primary/5' : 'border-border focus:border-primary/60'
                  }`}
                />
              ))}
            </div>

            {/* Timer + resend */}
            <div className="flex items-center justify-between mb-6">
              {timer > 0 ? (
                <p className="text-sm text-muted-foreground">
                  Mã hết hạn sau{' '}
                  <span className={`font-bold font-mono ${timer <= 30 ? 'text-red-500' : 'text-foreground'}`}>
                    {formatTimer(timer)}
                  </span>
                </p>
              ) : (
                <p className="text-sm text-red-500 font-medium">Mã đã hết hạn</p>
              )}
              <button
                type="button"
                onClick={handleResend}
                disabled={timer > 0 || resending || loading}
                className="text-sm font-semibold text-primary disabled:text-muted-foreground disabled:cursor-not-allowed hover:underline transition-colors"
              >
                {resending ? 'Đang gửi…' : 'Gửi lại mã'}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading || digits.join('').length < 6}
              className="w-full h-11 bg-primary hover:bg-primary/90 disabled:opacity-60 text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] text-sm"
            >
              {loading ? <Loader2 size={17} className="animate-spin" /> : 'Xác thực'}
            </button>
          </form>

          <p className="text-center text-xs text-muted-foreground mt-6">
            Không nhận được email?{' '}
            <Link href="mailto:hello@shophub.vn" className="text-primary hover:underline font-medium">
              Liên hệ hỗ trợ
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
