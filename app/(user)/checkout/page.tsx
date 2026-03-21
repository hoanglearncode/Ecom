'use client'

import {
  ChevronRight, ChevronLeft, Check, Lock, Shield,
  Truck, CreditCard, MapPin, User, Mail, Phone,
  Package, Tag, Gift, Edit2, Plus, Zap, Star,
  ChevronDown, RefreshCw, AlertCircle
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useState, useRef } from 'react'

/* ═══════════════════════════════════════════════════════
   DATA
═══════════════════════════════════════════════════════ */

const CART_ITEMS = [
  { id: 'ci1', name: 'Sony WH-1000XM5 Wireless Headphones', brand: 'Sony', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=200&fit=crop', price: 279.99, originalPrice: 349.99, color: 'Midnight Black', qty: 1 },
  { id: 'ci2', name: 'Logitech MX Master 3S Mouse', brand: 'Logitech', image: 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=200&h=200&fit=crop', price: 99.99, originalPrice: 119.99, color: 'Graphite', qty: 1 },
  { id: 'ci3', name: 'Nike Air Max 270 Running Shoes', brand: 'Nike', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&h=200&fit=crop', price: 149.99, originalPrice: 180.00, color: 'Black / Red', qty: 2 },
]

const SAVED_ADDRESSES = [
  { id: 'a1', name: 'Alex Morgan', line1: '123 Main Street, Apt 4B', city: 'New York', state: 'NY', zip: '10001', country: 'US', phone: '+1 (555) 000-1234', default: true },
  { id: 'a2', name: 'Alex Morgan', line1: '456 Office Park Blvd', city: 'Brooklyn', state: 'NY', zip: '11201', country: 'US', phone: '+1 (555) 000-5678', default: false },
]

const SAVED_CARDS = [
  { id: 'c1', type: 'visa', last4: '4242', expiry: '09/27', name: 'Alex Morgan', default: true },
  { id: 'c2', type: 'mastercard', last4: '8888', expiry: '03/26', name: 'Alex Morgan', default: false },
]

const SHIPPING_OPTIONS = [
  { id: 'standard', label: 'Standard Shipping', sub: 'Wed, Mar 25 – Fri, Mar 27', price: 0, badge: 'FREE' },
  { id: 'express', label: 'Express Shipping', sub: 'Tomorrow, Mar 22', price: 9.99, badge: null },
  { id: 'overnight', label: 'Overnight Shipping', sub: 'Today by 9 PM', price: 19.99, badge: 'Fastest' },
]

const COUNTRIES = ['United States', 'United Kingdom', 'Canada', 'Australia', 'Germany', 'France', 'Japan', 'Singapore', 'Vietnam']

type Step = 'contact' | 'shipping' | 'payment' | 'review' | 'confirmed'

/* ═══════════════════════════════════════════════════════
   HELPERS
═══════════════════════════════════════════════════════ */

const fmt = (n: number) => `$${n.toFixed(2)}`

const subtotal = CART_ITEMS.reduce((s, i) => s + i.price * i.qty, 0)
const savings = CART_ITEMS.reduce((s, i) => s + ((i.originalPrice ?? i.price) - i.price) * i.qty, 0)
const promoDiscount = subtotal * 0.2
const STEPS: Step[] = ['contact', 'shipping', 'payment', 'review']
const STEP_LABELS = { contact: 'Contact', shipping: 'Shipping', payment: 'Payment', review: 'Review' }

function CardIcon({ type }: { type: string }) {
  return (
    <div className={`w-8 h-5 rounded flex items-center justify-center text-[9px] font-black text-white ${type === 'visa' ? 'bg-blue-600' : type === 'mastercard' ? 'bg-red-500' : 'bg-gray-700'}`}>
      {type === 'visa' ? 'VISA' : type === 'mastercard' ? 'MC' : 'AMEX'}
    </div>
  )
}

function InputField({ label, placeholder, type = 'text', required, icon: Icon, value, onChange, error, half }: any) {
  return (
    <div className={half ? 'col-span-1' : 'col-span-2'}>
      <label className="block text-xs font-bold text-foreground mb-1.5">
        {label} {required && <span className="text-primary">*</span>}
      </label>
      <div className="relative">
        {Icon && <Icon size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />}
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={e => onChange?.(e.target.value)}
          className={`w-full bg-background border rounded-xl py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 transition-all ${Icon ? 'pl-10 pr-4' : 'px-4'} ${error ? 'border-primary/60 focus:ring-primary/20' : 'border-border focus:ring-primary/20 focus:border-primary/50'}`}
        />
        {error && <p className="text-[11px] text-primary mt-1 flex items-center gap-1"><AlertCircle size={11} />{error}</p>}
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════
   PAGE
═══════════════════════════════════════════════════════ */

export default function CheckoutPage() {
  const [step, setStep] = useState<Step>('contact')
  const [selectedAddress, setSelectedAddress] = useState('a1')
  const [addingAddress, setAddingAddress] = useState(false)
  const [selectedCard, setSelectedCard] = useState('c1')
  const [payMethod, setPayMethod] = useState<'card' | 'paypal' | 'applepay' | 'new'>('card')
  const [shippingId, setShippingId] = useState('standard')
  const [giftWrap, setGiftWrap] = useState(false)
  const [orderSummaryOpen, setOrderSummaryOpen] = useState(false)
  const [cardNum, setCardNum] = useState('')
  const [cardName, setCardName] = useState('')
  const [cardExpiry, setCardExpiry] = useState('')
  const [cardCvv, setCardCvv] = useState('')
  const [saveCard, setSaveCard] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Contact
  const [email, setEmail] = useState('alex@example.com')
  const [firstName, setFirstName] = useState('Alex')
  const [lastName, setLastName] = useState('Morgan')
  const [phone, setPhone] = useState('+1 555 000 1234')
  const [newsletter, setNewsletter] = useState(false)

  const shippingOpt = SHIPPING_OPTIONS.find(s => s.id === shippingId)!
  const giftFee = giftWrap ? 4.99 : 0
  const tax = (subtotal - promoDiscount + shippingOpt.price + giftFee) * 0.08
  const total = subtotal - promoDiscount + shippingOpt.price + giftFee + tax

  const stepIdx = step === 'confirmed' ? 4 : STEPS.indexOf(step)

  const goNext = () => {
    const nexts: Record<Step, Step> = { contact: 'shipping', shipping: 'payment', payment: 'review', review: 'confirmed', confirmed: 'confirmed' }
    if (step === 'review') {
      setProcessing(true)
      setTimeout(() => { setProcessing(false); setStep('confirmed') }, 2200)
    } else {
      setStep(nexts[step])
    }
  }
  const goBack = () => {
    const prevs: Record<Step, Step> = { contact: 'contact', shipping: 'contact', payment: 'shipping', review: 'payment', confirmed: 'confirmed' }
    setStep(prevs[step])
  }

  const activeAddr = SAVED_ADDRESSES.find(a => a.id === selectedAddress)!

  // ── CONFIRMED ──
  if (step === 'confirmed') {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <main className="flex-1 flex items-center justify-center px-4 py-16">
          <div className="w-full max-w-xl text-center">
            {/* Success icon */}
            <div className="relative w-24 h-24 mx-auto mb-6">
              <div className="absolute inset-0 bg-green-500/10 rounded-full animate-ping" />
              <div className="relative w-24 h-24 bg-green-500/15 border-2 border-green-500/30 rounded-full flex items-center justify-center">
                <Check size={40} className="text-green-500" strokeWidth={2.5} />
              </div>
            </div>

            <p className="text-xs font-bold uppercase tracking-widest text-primary mb-3">Order placed successfully</p>
            <h1 className="text-3xl sm:text-4xl font-black text-foreground tracking-tight mb-3">
              Thank you, {firstName}!
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base leading-relaxed mb-2">
              Your order <span className="font-bold text-foreground">#SH-2026-84291</span> has been confirmed.
            </p>
            <p className="text-muted-foreground text-sm mb-8">
              A confirmation email has been sent to <span className="font-semibold text-foreground">{email}</span>
            </p>

            {/* Order card */}
            <div className="bg-card border border-border rounded-3xl p-6 mb-6 text-left">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <p className="text-xs text-muted-foreground font-medium">Estimated delivery</p>
                  <p className="font-black text-foreground">Wed, Mar 25 – Fri, Mar 27</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground font-medium">Order total</p>
                  <p className="font-black text-foreground text-xl">{fmt(total)}</p>
                </div>
              </div>

              {/* Progress track */}
              <div className="relative mb-6">
                <div className="absolute top-3 left-0 right-0 h-0.5 bg-border" />
                <div className="absolute top-3 left-0 h-0.5 bg-primary transition-all" style={{ width: '25%' }} />
                <div className="flex justify-between relative">
                  {['Confirmed', 'Processing', 'Shipped', 'Delivered'].map((s, i) => (
                    <div key={s} className="flex flex-col items-center gap-2">
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-[10px] font-black z-10 ${i === 0 ? 'bg-primary border-primary text-white' : 'bg-background border-border text-muted-foreground'}`}>
                        {i === 0 ? <Check size={12} /> : i + 1}
                      </div>
                      <span className={`text-[10px] font-semibold ${i === 0 ? 'text-primary' : 'text-muted-foreground'}`}>{s}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Items */}
              <div className="flex flex-col gap-3">
                {CART_ITEMS.map(item => (
                  <div key={item.id} className="flex items-center gap-3">
                    <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-secondary shrink-0">
                      <Image src={item.image} alt={item.name} fill className="object-cover" sizes="48px" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-foreground truncate">{item.name}</p>
                      <p className="text-[10px] text-muted-foreground">{item.color} · Qty {item.qty}</p>
                    </div>
                    <p className="text-sm font-black text-foreground shrink-0">{fmt(item.price * item.qty)}</p>
                  </div>
                ))}
              </div>

              {/* Shipping info */}
              <div className="mt-4 pt-4 border-t border-border flex items-center gap-3 text-xs text-muted-foreground">
                <MapPin size={13} className="text-primary shrink-0" />
                <span>{activeAddr.line1}, {activeAddr.city}, {activeAddr.state} {activeAddr.zip}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/profile/orders" className="flex-1 flex items-center justify-center gap-2 py-3.5 border border-border rounded-2xl text-sm font-bold text-foreground hover:bg-secondary transition-all">
                <Package size={16} /> Track Order
              </Link>
              <Link href="/products" className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-foreground text-background rounded-2xl text-sm font-bold hover:bg-foreground/85 transition-all">
                Continue Shopping <ChevronRight size={16} />
              </Link>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="flex-1 pb-36 sm:pb-16">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
          <div className="grid lg:grid-cols-[1fr_400px] xl:grid-cols-[1fr_440px] gap-8 xl:gap-12">

            {/* ══════ LEFT: FORM ══════ */}
            <div>
              {/* Mobile step indicator */}
              <div className="flex items-center gap-2 mb-6 sm:hidden">
                <div className="flex gap-1.5">
                  {STEPS.map((s, i) => (
                    <div key={s} className={`h-1.5 rounded-full transition-all ${i === stepIdx ? 'w-8 bg-primary' : i < stepIdx ? 'w-4 bg-green-500' : 'w-4 bg-border'}`} />
                  ))}
                </div>
                <span className="text-xs font-bold text-muted-foreground ml-1">Step {stepIdx + 1} of {STEPS.length}</span>
              </div>

              {/* ── CONTACT ── */}
              {step === 'contact' && (
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-primary mb-1.5">Step 1</p>
                  <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Contact Details</h2>

                  {/* Guest / Sign in prompt */}
                  <div className="flex items-center justify-between p-4 bg-secondary/50 border border-border rounded-2xl mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                        <User size={18} className="text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-foreground">Already have an account?</p>
                        <p className="text-xs text-muted-foreground">Sign in for faster checkout</p>
                      </div>
                    </div>
                    <Link href="/login" className="text-xs font-bold text-primary hover:underline flex items-center gap-1">
                      Sign in <ChevronRight size={13} />
                    </Link>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <InputField label="First name" placeholder="Alex" required value={firstName} onChange={setFirstName} half error={errors.firstName} />
                    <InputField label="Last name" placeholder="Morgan" required value={lastName} onChange={setLastName} half error={errors.lastName} />
                    <InputField label="Email address" type="email" placeholder="alex@example.com" required icon={Mail} value={email} onChange={setEmail} error={errors.email} />
                    <InputField label="Phone number" type="tel" placeholder="+1 555 000 1234" icon={Phone} value={phone} onChange={setPhone} half />
                  </div>

                  {/* Newsletter opt-in */}
                  <button onClick={() => setNewsletter(v => !v)} className="flex items-center gap-3 mt-5 w-full">
                    <span className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-all ${newsletter ? 'bg-primary border-primary' : 'border-border'}`}>
                      {newsletter && <Check size={10} className="text-white" />}
                    </span>
                    <span className="text-xs text-muted-foreground text-left">Email me about new products, sales, and exclusive deals</span>
                  </button>
                </div>
              )}

              {/* ── SHIPPING ── */}
              {step === 'shipping' && (
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-primary mb-1.5">Step 2</p>
                  <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Shipping Address</h2>

                  {/* Saved addresses */}
                  {!addingAddress && (
                    <div className="space-y-3 mb-5">
                      {SAVED_ADDRESSES.map(addr => (
                        <button
                          key={addr.id}
                          onClick={() => setSelectedAddress(addr.id)}
                          className={`w-full flex items-start gap-4 p-4 sm:p-5 rounded-2xl border text-left transition-all ${selectedAddress === addr.id ? 'border-primary bg-primary/5' : 'border-border hover:border-foreground/20 bg-card'}`}
                        >
                          <span className={`mt-0.5 w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${selectedAddress === addr.id ? 'border-primary' : 'border-border'}`}>
                            {selectedAddress === addr.id && <span className="w-2 h-2 bg-primary rounded-full" />}
                          </span>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="font-bold text-sm text-foreground">{addr.name}</p>
                              {addr.default && <span className="text-[9px] font-black text-primary bg-primary/10 px-1.5 py-0.5 rounded-md">Default</span>}
                            </div>
                            <p className="text-xs text-muted-foreground leading-relaxed">
                              {addr.line1}<br />
                              {addr.city}, {addr.state} {addr.zip}, {addr.country}<br />
                              {addr.phone}
                            </p>
                          </div>
                          <button className="shrink-0 p-1.5 text-muted-foreground hover:text-primary transition-colors">
                            <Edit2 size={14} />
                          </button>
                        </button>
                      ))}

                      <button
                        onClick={() => setAddingAddress(true)}
                        className="w-full flex items-center gap-3 p-4 rounded-2xl border-2 border-dashed border-border hover:border-primary/40 text-muted-foreground hover:text-primary transition-all"
                      >
                        <Plus size={16} /> <span className="text-sm font-semibold">Add new address</span>
                      </button>
                    </div>
                  )}

                  {/* New address form */}
                  {addingAddress && (
                    <div className="bg-card border border-border rounded-2xl p-5 mb-5">
                      <div className="flex items-center justify-between mb-5">
                        <h3 className="font-bold text-foreground text-sm">New address</h3>
                        <button onClick={() => setAddingAddress(false)} className="text-xs text-muted-foreground hover:text-foreground font-medium">Cancel</button>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <InputField label="First name" placeholder="Alex" required half />
                        <InputField label="Last name" placeholder="Morgan" required half />
                        <InputField label="Address line 1" placeholder="123 Main Street" required icon={MapPin} />
                        <InputField label="Address line 2" placeholder="Apt, suite, floor (optional)" half />
                        <InputField label="City" placeholder="New York" required half />
                        <InputField label="State / Province" placeholder="NY" required half />
                        <InputField label="ZIP / Postal code" placeholder="10001" required half />
                        <div className="col-span-2">
                          <label className="block text-xs font-bold text-foreground mb-1.5">Country <span className="text-primary">*</span></label>
                          <div className="relative">
                            <select className="w-full appearance-none bg-background border border-border rounded-xl py-3 px-4 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all">
                              {COUNTRIES.map(c => <option key={c}>{c}</option>)}
                            </select>
                            <ChevronDown size={15} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                          </div>
                        </div>
                        <InputField label="Phone number" placeholder="+1 555 000 0000" type="tel" icon={Phone} half />
                      </div>
                      <button
                        onClick={() => setAddingAddress(false)}
                        className="mt-5 w-full py-3 bg-foreground text-background rounded-xl font-bold text-sm hover:bg-foreground/85 active:scale-[0.97] transition-all"
                      >
                        Save Address
                      </button>
                    </div>
                  )}

                  {/* Shipping method */}
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">Shipping method</p>
                    <div className="flex flex-col gap-2.5">
                      {SHIPPING_OPTIONS.map(opt => (
                        <button
                          key={opt.id}
                          onClick={() => setShippingId(opt.id)}
                          className={`flex items-center gap-4 p-4 rounded-2xl border text-left transition-all ${shippingId === opt.id ? 'border-primary bg-primary/5' : 'border-border hover:border-foreground/20 bg-card'}`}
                        >
                          <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${shippingId === opt.id ? 'border-primary' : 'border-border'}`}>
                            {shippingId === opt.id && <span className="w-2 h-2 bg-primary rounded-full" />}
                          </span>
                          <div className="flex items-center gap-2 shrink-0">
                            <Truck size={16} className={shippingId === opt.id ? 'text-primary' : 'text-muted-foreground'} />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <p className={`text-sm font-bold ${shippingId === opt.id ? 'text-primary' : 'text-foreground'}`}>{opt.label}</p>
                              {opt.badge && <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-md ${opt.badge === 'FREE' ? 'bg-green-500/10 text-green-600' : 'bg-amber-500/10 text-amber-600'}`}>{opt.badge}</span>}
                            </div>
                            <p className="text-[11px] text-muted-foreground">{opt.sub}</p>
                          </div>
                          <p className={`text-sm font-black shrink-0 ${opt.price === 0 ? 'text-green-600' : 'text-foreground'}`}>
                            {opt.price === 0 ? 'FREE' : fmt(opt.price)}
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Gift wrap */}
                  <button
                    onClick={() => setGiftWrap(v => !v)}
                    className={`flex items-center gap-4 w-full mt-3 p-4 rounded-2xl border text-left transition-all ${giftWrap ? 'border-primary bg-primary/5' : 'border-border bg-card'}`}
                  >
                    <span className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-all ${giftWrap ? 'bg-primary border-primary' : 'border-border'}`}>
                      {giftWrap && <Check size={10} className="text-white" />}
                    </span>
                    <Gift size={16} className={giftWrap ? 'text-primary' : 'text-muted-foreground'} />
                    <div className="flex-1">
                      <p className={`text-sm font-bold ${giftWrap ? 'text-primary' : 'text-foreground'}`}>Add gift wrapping</p>
                      <p className="text-[11px] text-muted-foreground">Premium box with personalised card</p>
                    </div>
                    <span className="text-sm font-black text-foreground">+$4.99</span>
                  </button>
                </div>
              )}

              {/* ── PAYMENT ── */}
              {step === 'payment' && (
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-primary mb-1.5">Step 3</p>
                  <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Payment</h2>

                  {/* Payment method tabs */}
                  <div className="grid grid-cols-4 gap-2 mb-6">
                    {[
                      { id: 'card', label: 'Card', icon: CreditCard },
                      { id: 'paypal', label: 'PayPal', icon: null },
                      { id: 'applepay', label: 'Apple Pay', icon: null },
                      { id: 'new', label: 'New card', icon: Plus },
                    ].map(({ id, label, icon: Icon }) => (
                      <button
                        key={id}
                        onClick={() => setPayMethod(id as any)}
                        className={`flex flex-col items-center gap-1.5 p-3 rounded-2xl border text-center transition-all ${payMethod === id ? 'border-primary bg-primary/5' : 'border-border hover:border-foreground/20 bg-card'}`}
                      >
                        {Icon
                          ? <Icon size={18} className={payMethod === id ? 'text-primary' : 'text-muted-foreground'} />
                          : <span className={`text-sm font-black ${payMethod === id ? 'text-primary' : 'text-muted-foreground'}`}>{id === 'paypal' ? 'PP' : '⌘'}</span>
                        }
                        <span className={`text-[10px] font-bold ${payMethod === id ? 'text-primary' : 'text-muted-foreground'}`}>{label}</span>
                      </button>
                    ))}
                  </div>

                  {/* Saved cards */}
                  {payMethod === 'card' && (
                    <div className="space-y-3">
                      {SAVED_CARDS.map(card => (
                        <button
                          key={card.id}
                          onClick={() => setSelectedCard(card.id)}
                          className={`w-full flex items-center gap-4 p-4 rounded-2xl border transition-all text-left ${selectedCard === card.id ? 'border-primary bg-primary/5' : 'border-border hover:border-foreground/20 bg-card'}`}
                        >
                          <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${selectedCard === card.id ? 'border-primary' : 'border-border'}`}>
                            {selectedCard === card.id && <span className="w-2 h-2 bg-primary rounded-full" />}
                          </span>
                          <CardIcon type={card.type} />
                          <div className="flex-1">
                            <p className={`text-sm font-bold ${selectedCard === card.id ? 'text-primary' : 'text-foreground'}`}>
                              •••• •••• •••• {card.last4}
                            </p>
                            <p className="text-[11px] text-muted-foreground">{card.name} · Expires {card.expiry}</p>
                          </div>
                          {card.default && <span className="text-[9px] font-black text-primary bg-primary/10 px-1.5 py-0.5 rounded-md shrink-0">Default</span>}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* New card form */}
                  {payMethod === 'new' && (
                    <div className="bg-card border border-border rounded-2xl p-5 space-y-4">
                      <div className="col-span-2">
                        <label className="block text-xs font-bold text-foreground mb-1.5">Card number <span className="text-primary">*</span></label>
                        <div className="relative">
                          <CreditCard size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                          <input
                            type="text"
                            placeholder="1234 5678 9012 3456"
                            value={cardNum}
                            onChange={e => setCardNum(e.target.value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim().slice(0, 19))}
                            maxLength={19}
                            className="w-full bg-background border border-border rounded-xl py-3 pl-10 pr-16 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all font-mono tracking-widest"
                          />
                          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 flex gap-1">
                            {['visa', 'mastercard'].map(t => <CardIcon key={t} type={t} />)}
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-foreground mb-1.5">Expiry date <span className="text-primary">*</span></label>
                          <input
                            type="text"
                            placeholder="MM / YY"
                            value={cardExpiry}
                            onChange={e => {
                              let v = e.target.value.replace(/\D/g, '').slice(0, 4)
                              if (v.length >= 3) v = v.slice(0, 2) + ' / ' + v.slice(2)
                              setCardExpiry(v)
                            }}
                            className="w-full bg-background border border-border rounded-xl py-3 px-4 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-foreground mb-1.5">CVV <span className="text-primary">*</span></label>
                          <div className="relative">
                            <input
                              type="text"
                              placeholder="123"
                              value={cardCvv}
                              onChange={e => setCardCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                              className="w-full bg-background border border-border rounded-xl py-3 pl-4 pr-10 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all"
                            />
                            <Shield size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                          </div>
                        </div>
                      </div>
                      <InputField label="Name on card" placeholder="Alex Morgan" required value={cardName} onChange={setCardName} />
                      <button onClick={() => setSaveCard(v => !v)} className="flex items-center gap-2.5 w-full">
                        <span className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-all ${saveCard ? 'bg-primary border-primary' : 'border-border'}`}>
                          {saveCard && <Check size={10} className="text-white" />}
                        </span>
                        <span className="text-xs text-muted-foreground">Save this card for future purchases</span>
                      </button>
                    </div>
                  )}

                  {(payMethod === 'paypal' || payMethod === 'applepay') && (
                    <div className="flex flex-col items-center justify-center py-10 border border-dashed border-border rounded-2xl gap-3 text-muted-foreground">
                      <div className="text-4xl">{payMethod === 'paypal' ? '🅿️' : '🍎'}</div>
                      <p className="text-sm font-semibold">{payMethod === 'paypal' ? 'PayPal' : 'Apple Pay'} selected</p>
                      <p className="text-xs text-center max-w-xs">You'll be redirected to complete payment after reviewing your order.</p>
                    </div>
                  )}

                  {/* Security badges */}
                  <div className="flex items-center justify-center gap-4 mt-5 pt-5 border-t border-border">
                    {['🔒 256-bit SSL', '🛡 PCI Compliant', '✓ 3D Secure'].map(b => (
                      <span key={b} className="text-[10px] text-muted-foreground font-medium">{b}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* ── REVIEW ── */}
              {step === 'review' && (
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-primary mb-1.5">Step 4</p>
                  <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Review Order</h2>

                  <div className="space-y-4">
                    {/* Contact */}
                    {[
                      {
                        icon: User, title: 'Contact', step: 'contact' as Step,
                        content: <><p className="text-sm text-foreground">{firstName} {lastName}</p><p className="text-xs text-muted-foreground">{email} · {phone}</p></>
                      },
                      {
                        icon: MapPin, title: 'Ship to', step: 'shipping' as Step,
                        content: <><p className="text-sm text-foreground">{activeAddr.line1}</p><p className="text-xs text-muted-foreground">{activeAddr.city}, {activeAddr.state} {activeAddr.zip}, {activeAddr.country}</p></>
                      },
                      {
                        icon: Truck, title: 'Shipping', step: 'shipping' as Step,
                        content: <><p className="text-sm text-foreground">{shippingOpt.label}</p><p className="text-xs text-muted-foreground">{shippingOpt.sub} · {shippingOpt.price === 0 ? 'FREE' : fmt(shippingOpt.price)}</p></>
                      },
                      {
                        icon: CreditCard, title: 'Payment', step: 'payment' as Step,
                        content: payMethod === 'card'
                          ? <div className="flex items-center gap-2"><CardIcon type={SAVED_CARDS.find(c => c.id === selectedCard)?.type ?? 'visa'} /><p className="text-sm text-foreground">•••• {SAVED_CARDS.find(c => c.id === selectedCard)?.last4}</p></div>
                          : <p className="text-sm text-foreground capitalize">{payMethod}</p>
                      },
                    ].map(({ icon: Icon, title, step: s, content }) => (
                      <div key={title} className="flex items-start gap-4 p-5 bg-card border border-border rounded-2xl">
                        <div className="p-2.5 bg-secondary rounded-xl shrink-0">
                          <Icon size={16} className="text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1.5">{title}</p>
                          {content}
                        </div>
                        <button onClick={() => setStep(s)} className="flex items-center gap-1 text-xs font-bold text-primary hover:underline shrink-0">
                          <Edit2 size={12} /> Edit
                        </button>
                      </div>
                    ))}

                    {/* Items */}
                    <div className="bg-card border border-border rounded-2xl overflow-hidden">
                      <div className="px-5 py-4 border-b border-border flex items-center justify-between">
                        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Order Items ({CART_ITEMS.length})</p>
                        <Link href="/cart" className="text-xs font-bold text-primary hover:underline flex items-center gap-1"><Edit2 size={12} /> Edit cart</Link>
                      </div>
                      <div className="divide-y divide-border">
                        {CART_ITEMS.map(item => (
                          <div key={item.id} className="flex items-center gap-4 px-5 py-4">
                            <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-secondary shrink-0">
                              <Image src={item.image} alt={item.name} fill className="object-cover" sizes="56px" />
                              <span className="absolute -top-1 -right-1 w-5 h-5 bg-foreground text-background text-[9px] font-black rounded-full flex items-center justify-center">{item.qty}</span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-foreground leading-snug line-clamp-1">{item.name}</p>
                              <p className="text-[11px] text-muted-foreground mt-0.5">{item.color}</p>
                            </div>
                            <div className="text-right shrink-0">
                              <p className="text-sm font-black text-foreground">{fmt(item.price * item.qty)}</p>
                              {item.originalPrice && <p className="text-[10px] text-muted-foreground line-through">{fmt(item.originalPrice * item.qty)}</p>}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ── NAV BUTTONS ── */}
              <div className="flex items-center gap-3 mt-8">
                {step !== 'contact' && (
                  <button onClick={goBack} className="flex items-center gap-2 px-5 py-3.5 border border-border rounded-2xl text-sm font-bold text-foreground hover:bg-secondary active:scale-[0.97] transition-all">
                    <ChevronLeft size={16} /> Back
                  </button>
                )}
                <button
                  onClick={goNext}
                  disabled={processing}
                  className="flex-1 flex items-center justify-center gap-2 py-4 bg-primary text-white rounded-2xl font-black text-base hover:bg-primary/90 active:scale-[0.98] disabled:opacity-70 transition-all shadow-lg shadow-primary/25"
                >
                  {processing ? (
                    <><RefreshCw size={18} className="animate-spin" /> Processing…</>
                  ) : step === 'review' ? (
                    <><Lock size={17} /> Place Order — {fmt(total)}</>
                  ) : (
                    <>Continue <ChevronRight size={17} /></>
                  )}
                </button>
              </div>

              {step === 'review' && (
                <p className="text-[11px] text-muted-foreground text-center mt-3 leading-relaxed">
                  By placing your order you agree to our <Link href="/terms" className="underline hover:text-primary">Terms of Service</Link> and <Link href="/privacy" className="underline hover:text-primary">Privacy Policy</Link>. All prices include tax.
                </p>
              )}
            </div>

            {/* ══════ RIGHT: ORDER SUMMARY ══════ */}
            <div className="space-y-4">
              {/* Mobile accordion toggle */}
              <button
                className="sm:hidden w-full flex items-center justify-between p-4 bg-card border border-border rounded-2xl font-bold text-sm"
                onClick={() => setOrderSummaryOpen(v => !v)}
              >
                <span className="flex items-center gap-2">
                  <ShoppingBag size={15} className="text-primary" />
                  {orderSummaryOpen ? 'Hide' : 'Show'} order summary
                </span>
                <div className="flex items-center gap-2">
                  <span className="font-black text-foreground">{fmt(total)}</span>
                  <ChevronDown size={15} className={`text-muted-foreground transition-transform ${orderSummaryOpen ? 'rotate-180' : ''}`} />
                </div>
              </button>

              <div className={`${orderSummaryOpen ? 'block' : 'hidden'} sm:block`}>
                <div className="bg-card border border-border rounded-2xl overflow-hidden sticky top-20">
                  <div className="px-5 py-4 border-b border-border flex items-center justify-between">
                    <h3 className="font-black text-foreground text-sm">Order Summary</h3>
                    <Link href="/cart" className="text-xs font-bold text-primary hover:underline flex items-center gap-1"><Edit2 size={12} /> Edit</Link>
                  </div>

                  {/* Items */}
                  <div className="px-5 py-4 border-b border-border/50 space-y-3.5 max-h-64 overflow-y-auto">
                    {CART_ITEMS.map(item => (
                      <div key={item.id} className="flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-secondary shrink-0 border border-border/50">
                          <Image src={item.image} alt={item.name} fill className="object-cover" sizes="48px" />
                          <span className="absolute -top-1 -right-1 w-4 h-4 bg-foreground text-background text-[9px] font-black rounded-full flex items-center justify-center">{item.qty}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-foreground leading-snug line-clamp-2">{item.name}</p>
                          <p className="text-[10px] text-muted-foreground mt-0.5">{item.color}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-xs font-black text-foreground">{fmt(item.price * item.qty)}</p>
                          {item.originalPrice && <p className="text-[9px] text-muted-foreground line-through">{fmt(item.originalPrice * item.qty)}</p>}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Promo applied */}
                  <div className="px-5 py-3 border-b border-border/50">
                    <div className="flex items-center gap-2 text-xs text-green-600 bg-green-500/8 border border-green-500/15 px-3 py-2 rounded-xl">
                      <Tag size={12} className="shrink-0" />
                      <div className="flex-1"><span className="font-black">SAVE20</span> applied — {fmt(promoDiscount)} off</div>
                      <Check size={12} />
                    </div>
                  </div>

                  {/* Pricing */}
                  <div className="px-5 py-4 space-y-2.5">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Subtotal ({CART_ITEMS.reduce((s, i) => s + i.qty, 0)} items)</span>
                      <span className="font-semibold text-foreground">{fmt(subtotal)}</span>
                    </div>
                    {savings > 0 && (
                      <div className="flex justify-between text-xs">
                        <span className="text-green-600">Item discounts</span>
                        <span className="font-semibold text-green-600">-{fmt(savings)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-xs">
                      <span className="text-primary flex items-center gap-1"><Tag size={10} /> SAVE20</span>
                      <span className="font-semibold text-primary">-{fmt(promoDiscount)}</span>
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Shipping</span>
                      <span className={`font-semibold ${shippingOpt.price === 0 ? 'text-green-600' : 'text-foreground'}`}>
                        {shippingOpt.price === 0 ? 'FREE' : fmt(shippingOpt.price)}
                      </span>
                    </div>
                    {giftWrap && <div className="flex justify-between text-xs text-muted-foreground"><span className="flex items-center gap-1"><Gift size={10} /> Gift wrap</span><span className="font-semibold text-foreground">{fmt(giftFee)}</span></div>}
                    <div className="flex justify-between text-xs text-muted-foreground"><span>Tax (8%)</span><span className="font-semibold text-foreground">{fmt(tax)}</span></div>
                    <div className="flex justify-between items-center pt-3 border-t border-border">
                      <span className="font-black text-foreground">Total</span>
                      <div className="text-right">
                        <span className="font-black text-foreground text-xl">{fmt(total)}</span>
                        <p className="text-[10px] text-green-600 font-semibold">Saving {fmt(savings + promoDiscount)}</p>
                      </div>
                    </div>
                  </div>

                  {/* Trust */}
                  <div className="px-5 pb-4 flex flex-col gap-2 border-t border-border pt-4">
                    {[
                      { icon: Lock, text: 'SSL encrypted checkout' },
                      { icon: RefreshCw, text: '30-day free returns' },
                      { icon: Star, text: '4.9★ — trusted by 2M+ customers' },
                    ].map(({ icon: Icon, text }) => (
                      <div key={text} className="flex items-center gap-2 text-[11px] text-muted-foreground">
                        <Icon size={11} className="text-primary shrink-0" />
                        {text}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Mobile sticky footer */}
      <div className="sm:hidden fixed bottom-0 inset-x-0 z-50 bg-card/96 backdrop-blur-xl border-t border-border p-4">
        <button
          onClick={goNext}
          disabled={processing}
          className="w-full flex items-center justify-center gap-2 py-3.5 bg-primary text-white rounded-2xl font-bold text-sm hover:bg-primary/90 active:scale-[0.97] disabled:opacity-70 transition-all shadow-lg shadow-primary/20"
        >
          {processing ? (
            <><RefreshCw size={16} className="animate-spin" /> Processing…</>
          ) : step === 'review' ? (
            <><Lock size={15} /> Place Order — {fmt(total)}</>
          ) : (
            <>Continue to<ChevronRight size={15} /></>
          )}
        </button>
      </div>
    </div>
  )
}

function ShoppingBag({ size, className }: { size: number; className?: string }) {
  return <Package size={size} className={className} />
}