'use client'

import {
  User, Mail, Phone, MapPin, Camera, Edit2, Check, X,
  ShoppingBag, Heart, Star, Package, ChevronRight,
  Bell, Shield, CreditCard, Globe, Moon, Sun, Zap,
  LogOut, Trash2, Eye, EyeOff, Lock, Key, Smartphone,
  Gift, Tag, Award, TrendingUp, ChevronDown, Plus,
  ToggleLeft, ToggleRight, AlertCircle, Download,
  ExternalLink, RefreshCw, Copy, QrCode, CheckCircle2
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useState, useRef } from 'react'
import Header from '@/components/header'
import Footer from '@/components/footer'

/* ═══════════════════════════════════════════════════════
   DATA
═══════════════════════════════════════════════════════ */

const USER = {
  name: 'Alex Morgan',
  email: 'alex.morgan@example.com',
  phone: '+1 (555) 000-1234',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop&crop=face',
  memberSince: 'January 2024',
  tier: 'Gold Member',
  tierPoints: 2840,
  nextTierPoints: 5000,
  bio: 'Tech enthusiast & sneaker collector.',
}

const STATS = [
  { label: 'Orders', value: '24', icon: Package, href: '/orders' },
  { label: 'Wishlist', value: '12', icon: Heart, href: '/wishlist' },
  { label: 'Reviews', value: '8', icon: Star, href: '/profile/reviews' },
  { label: 'Saved', value: '$340', icon: Tag, color: 'text-green-600', href: '#' },
]

const RECENT_ORDERS = [
  { id: 'SH-2026-84291', date: 'Mar 18, 2026', status: 'shipped', total: 339.10, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=80&h=80&fit=crop' },
  { id: 'SH-2026-79103', date: 'Mar 10, 2026', status: 'delivered', total: 421.16, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=80&h=80&fit=crop' },
  { id: 'SH-2026-71845', date: 'Feb 28, 2026', status: 'delivered', total: 226.78, image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=80&h=80&fit=crop' },
]

const ADDRESSES = [
  { id: 'a1', label: 'Home', name: 'Alex Morgan', line1: '123 Main Street, Apt 4B', city: 'New York', state: 'NY', zip: '10001', country: 'United States', phone: '+1 (555) 000-1234', default: true },
  { id: 'a2', label: 'Office', name: 'Alex Morgan', line1: '456 Office Park Blvd', city: 'Brooklyn', state: 'NY', zip: '11201', country: 'United States', phone: '+1 (555) 000-5678', default: false },
]

const PAYMENT_METHODS = [
  { id: 'p1', type: 'visa', last4: '4242', expiry: '09/27', name: 'Alex Morgan', default: true },
  { id: 'p2', type: 'mastercard', last4: '8888', expiry: '03/26', name: 'Alex Morgan', default: false },
]

const SECTIONS = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'orders', label: 'Orders & Returns', icon: Package },
  { id: 'addresses', label: 'Addresses', icon: MapPin },
  { id: 'payments', label: 'Payment Methods', icon: CreditCard },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'preferences', label: 'Preferences', icon: Globe },
  { id: 'danger', label: 'Account', icon: Trash2 },
]

type Section = 'profile' | 'orders' | 'addresses' | 'payments' | 'notifications' | 'security' | 'preferences' | 'danger'

const fmt = (n: number) => `$${n.toFixed(2)}`

/* ── HELPERS ── */

function Toggle({ enabled, onChange }: { enabled: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!enabled)}
      className={`relative w-11 h-6 rounded-full transition-colors shrink-0 ${enabled ? 'bg-primary' : 'bg-border'}`}
    >
      <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${enabled ? 'translate-x-5' : 'translate-x-0.5'}`} />
    </button>
  )
}

function CardIcon({ type }: { type: string }) {
  const styles: Record<string, string> = { visa: 'bg-blue-600', mastercard: 'bg-red-500', amex: 'bg-blue-800' }
  const labels: Record<string, string> = { visa: 'VISA', mastercard: 'MC', amex: 'AMEX' }
  return <span className={`inline-flex items-center justify-center text-[9px] font-black text-white px-1.5 py-1 rounded-md ${styles[type] ?? 'bg-muted'}`}>{labels[type] ?? type.toUpperCase()}</span>
}

const STATUS_CFG: Record<string, { label: string; color: string; dot: string }> = {
  shipped: { label: 'Shipped', color: 'text-blue-600', dot: 'bg-blue-500' },
  delivered: { label: 'Delivered', color: 'text-green-600', dot: 'bg-green-500' },
  processing: { label: 'Processing', color: 'text-amber-600', dot: 'bg-amber-500' },
  cancelled: { label: 'Cancelled', color: 'text-red-600', dot: 'bg-red-500' },
}

/* ═══════════════════════════════════════════════════════
   PAGE
═══════════════════════════════════════════════════════ */

export default function ProfilePage() {
  const [activeSection, setActiveSection] = useState<Section>('profile')
  const [editingProfile, setEditingProfile] = useState(false)
  const [name, setName] = useState(USER.name)
  const [email, setEmail] = useState(USER.email)
  const [phone, setPhone] = useState(USER.phone)
  const [bio, setBio] = useState(USER.bio)
  const [showPassword, setShowPassword] = useState(false)
  const [twoFA, setTwoFA] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const [language, setLanguage] = useState('English')
  const [currency, setCurrency] = useState('USD ($)')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [savedProfile, setSavedProfile] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [deleteInput, setDeleteInput] = useState('')
  const [copiedRef, setCopiedRef] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const [notifs, setNotifs] = useState({
    orderUpdates: true, priceDrops: true, newArrivals: false,
    newsletter: true, smsAlerts: false, pushNotifs: true,
    weeklySummary: false, flashSales: true,
  })

  const [addresses, setAddresses] = useState(ADDRESSES)
  const [payments, setPayments] = useState(PAYMENT_METHODS)
  const [addingAddress, setAddingAddress] = useState(false)

  const handleSaveProfile = () => {
    setSavedProfile(true)
    setEditingProfile(false)
    setTimeout(() => setSavedProfile(false), 2500)
  }

  const setDefaultAddress = (id: string) => setAddresses(prev => prev.map(a => ({ ...a, default: a.id === id })))
  const setDefaultPayment = (id: string) => setPayments(prev => prev.map(p => ({ ...p, default: p.id === id })))
  const copyRef = () => { navigator.clipboard.writeText('SH-REF-ALEX2024'); setCopiedRef(true); setTimeout(() => setCopiedRef(false), 2000) }

  const nav = (id: Section) => { setActiveSection(id); setSidebarOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }) }

  /* ─── SIDEBAR ─── */
  const Sidebar = () => (
    <div className="flex flex-col gap-1">
      {/* Profile summary */}
      <div className="flex flex-col items-center text-center p-5 mb-2">
        <div className="relative mb-3">
          <div className="w-16 h-16 rounded-2xl overflow-hidden bg-secondary border-2 border-border">
            <Image src={USER.avatar} alt={USER.name} width={64} height={64} className="object-cover w-full h-full" />
          </div>
          <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-background ${USER.tier.includes('Gold') ? 'bg-amber-400' : 'bg-green-500'}`} />
        </div>
        <p className="font-black text-foreground text-sm">{name}</p>
        <p className="text-[11px] text-muted-foreground">{USER.email}</p>
        <div className="flex items-center gap-1.5 mt-2 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-full">
          <Award size={11} className="text-amber-600" />
          <span className="text-[10px] font-bold text-amber-700 dark:text-amber-400">{USER.tier}</span>
        </div>
      </div>

      {/* Nav links */}
      {SECTIONS.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          onClick={() => nav(id as Section)}
          className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-all text-left ${
            activeSection === id
              ? 'bg-primary/8 text-primary font-bold'
              : id === 'danger'
              ? 'text-primary/70 hover:text-primary hover:bg-primary/5'
              : 'text-foreground/70 hover:text-foreground hover:bg-secondary'
          }`}
        >
          <Icon size={16} className={activeSection === id ? 'text-primary' : id === 'danger' ? 'text-primary/60' : 'text-muted-foreground'} />
          {label}
          {activeSection === id && <div className="ml-auto w-1.5 h-1.5 bg-primary rounded-full" />}
        </button>
      ))}

      <div className="mt-4 pt-4 border-t border-border">
        <button className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-all">
          <LogOut size={16} /> Sign Out
        </button>
      </div>
    </div>
  )

  /* ─── PROFILE SECTION ─── */
  const ProfileSection = () => (
    <div className="space-y-6">
      {/* Avatar + edit */}
      <div className="flex flex-col sm:flex-row sm:items-start gap-5 p-6 bg-card border border-border rounded-2xl">
        <div className="relative shrink-0 w-fit mx-auto sm:mx-0">
          <div className="w-24 h-24 rounded-3xl overflow-hidden bg-secondary border-2 border-border shadow-md">
            <Image src={USER.avatar} alt={USER.name} width={96} height={96} className="object-cover w-full h-full" />
          </div>
          <button
            onClick={() => fileRef.current?.click()}
            className="absolute -bottom-2 -right-2 w-8 h-8 bg-primary text-white rounded-xl flex items-center justify-center shadow-lg hover:bg-primary/90 active:scale-[0.95] transition-all"
          >
            <Camera size={15} />
          </button>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div>
              <h2 className="text-xl font-black text-foreground">{name}</h2>
              <p className="text-sm text-muted-foreground">{USER.memberSince} · {USER.bio}</p>
            </div>
            {!editingProfile && (
              <button onClick={() => setEditingProfile(true)} className="flex items-center gap-1.5 px-3 py-1.5 border border-border rounded-xl text-xs font-semibold text-foreground hover:bg-secondary transition-all shrink-0">
                <Edit2 size={13} /> Edit
              </button>
            )}
          </div>

          {/* Loyalty tier */}
          <div className="bg-gradient-to-r from-amber-500/10 to-amber-400/5 border border-amber-500/20 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Award size={16} className="text-amber-600" />
                <span className="font-bold text-sm text-amber-800 dark:text-amber-300">{USER.tier}</span>
              </div>
              <span className="text-xs font-bold text-amber-700 dark:text-amber-400">{USER.tierPoints.toLocaleString()} pts</span>
            </div>
            <div className="h-2 bg-amber-100 dark:bg-amber-900/30 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full" style={{ width: `${(USER.tierPoints / USER.nextTierPoints) * 100}%` }} />
            </div>
            <p className="text-[11px] text-amber-700/70 dark:text-amber-400/70 mt-1.5">
              {(USER.nextTierPoints - USER.tierPoints).toLocaleString()} pts to Platinum · <Link href="#" className="underline">Learn more</Link>
            </p>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {STATS.map(({ label, value, icon: Icon, color, href }) => (
          <Link key={label} href={href} className="group flex flex-col items-center gap-1.5 p-4 bg-card border border-border rounded-2xl hover:border-primary/30 hover:shadow-md hover:shadow-primary/5 hover:-translate-y-0.5 transition-all text-center">
            <Icon size={20} className={`${color ?? 'text-primary'} group-hover:scale-110 transition-transform`} />
            <span className="text-2xl font-black text-foreground">{value}</span>
            <span className="text-xs text-muted-foreground">{label}</span>
          </Link>
        ))}
      </div>

      {/* Edit form */}
      {editingProfile && (
        <div className="bg-card border border-border rounded-2xl p-6">
          <h3 className="font-black text-foreground mb-5 text-sm uppercase tracking-wide">Edit Profile</h3>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Display Name', val: name, set: setName, icon: User, span: 2 },
              { label: 'Email Address', val: email, set: setEmail, icon: Mail, span: 1, type: 'email' },
              { label: 'Phone Number', val: phone, set: setPhone, icon: Phone, span: 1 },
            ].map(({ label, val, set, icon: Icon, span, type }) => (
              <div key={label} className={`${span === 2 ? 'col-span-2' : 'col-span-1'}`}>
                <label className="block text-xs font-bold text-foreground mb-1.5">{label}</label>
                <div className="relative">
                  <Icon size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input type={type ?? 'text'} value={val} onChange={e => set(e.target.value)} className="w-full pl-9 pr-4 py-2.5 bg-secondary border border-transparent rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all" />
                </div>
              </div>
            ))}
            <div className="col-span-2">
              <label className="block text-xs font-bold text-foreground mb-1.5">Bio</label>
              <textarea value={bio} onChange={e => setBio(e.target.value)} rows={2} className="w-full px-4 py-2.5 bg-secondary border border-transparent rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all" placeholder="Tell us a little about yourself…" />
            </div>
          </div>
          <div className="flex gap-3 mt-5">
            <button onClick={handleSaveProfile} className="flex-1 flex items-center justify-center gap-2 py-3 bg-primary text-white rounded-2xl font-bold text-sm hover:bg-primary/90 active:scale-[0.97] transition-all">
              <Check size={15} /> Save Changes
            </button>
            <button onClick={() => setEditingProfile(false)} className="px-5 py-3 border border-border rounded-2xl font-semibold text-sm text-foreground hover:bg-secondary active:scale-[0.97] transition-all">
              Cancel
            </button>
          </div>
        </div>
      )}

      {savedProfile && (
        <div className="flex items-center gap-3 p-4 bg-green-500/10 border border-green-500/20 rounded-2xl">
          <CheckCircle2 size={18} className="text-green-500 shrink-0" />
          <p className="text-sm font-semibold text-green-700 dark:text-green-400">Profile updated successfully!</p>
        </div>
      )}

      {/* Referral card */}
      <div className="bg-foreground rounded-2xl p-5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/15 rounded-full -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-2">
            <Gift size={16} className="text-primary" />
            <span className="text-xs font-bold text-white/60 uppercase tracking-widest">Referral Program</span>
          </div>
          <h3 className="font-black text-white text-lg mb-1">Invite friends, earn $20</h3>
          <p className="text-white/50 text-xs mb-4 leading-relaxed">Share your code. When they order $50+, you both get $20 credit.</p>
          <div className="flex gap-2">
            <div className="flex-1 bg-white/8 border border-white/15 rounded-xl px-3 py-2.5 font-mono text-sm font-bold text-white tracking-widest">SH-REF-ALEX2024</div>
            <button onClick={copyRef} className={`px-4 rounded-xl text-sm font-bold transition-all active:scale-[0.97] ${copiedRef ? 'bg-green-500 text-white' : 'bg-primary text-white hover:bg-primary/90'}`}>
              {copiedRef ? <Check size={15} /> : <Copy size={15} />}
            </button>
          </div>
        </div>
      </div>

      {/* Recent orders */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-black text-foreground text-sm uppercase tracking-wide">Recent Orders</h3>
          <Link href="/orders" className="text-xs font-bold text-primary hover:underline flex items-center gap-1">View all <ChevronRight size={13} /></Link>
        </div>
        <div className="flex flex-col gap-3">
          {RECENT_ORDERS.map(order => {
            const cfg = STATUS_CFG[order.status]
            return (
              <Link key={order.id} href={`/orders/${order.id}`} className="flex items-center gap-4 p-4 bg-card border border-border rounded-2xl hover:border-border/80 hover:shadow-sm transition-all group">
                <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-secondary shrink-0">
                  <Image src={order.image} alt={order.id} fill className="object-cover" sizes="48px" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-mono font-bold text-foreground text-xs">{order.id}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className={`text-[10px] font-bold flex items-center gap-1 ${cfg.color}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />{cfg.label}
                    </span>
                    <span className="text-[10px] text-muted-foreground">{order.date}</span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-black text-foreground text-sm">{fmt(order.total)}</p>
                  <ChevronRight size={14} className="text-muted-foreground group-hover:text-primary transition-colors ml-auto mt-0.5" />
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )

  /* ─── ADDRESSES SECTION ─── */
  const AddressesSection = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-black text-foreground text-xl">Addresses</h2>
        <button onClick={() => setAddingAddress(v => !v)} className="flex items-center gap-2 px-4 py-2 bg-foreground text-background rounded-xl text-sm font-bold hover:bg-foreground/85 active:scale-[0.97] transition-all">
          <Plus size={15} /> Add New
        </button>
      </div>

      {addingAddress && (
        <div className="bg-card border border-primary/30 rounded-2xl p-5 ring-2 ring-primary/10">
          <h3 className="font-bold text-foreground text-sm mb-4">New Address</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              ['First Name', 'col-span-1'], ['Last Name', 'col-span-1'],
              ['Address Line 1', 'col-span-2'], ['Address Line 2 (optional)', 'col-span-2'],
              ['City', 'col-span-1'], ['State', 'col-span-1'],
              ['ZIP Code', 'col-span-1'], ['Country', 'col-span-1'],
              ['Phone Number', 'col-span-2'],
            ].map(([placeholder, span]) => (
              <input key={placeholder} type="text" placeholder={placeholder} className={`${span} px-4 py-2.5 bg-secondary border border-transparent rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all placeholder:text-muted-foreground`} />
            ))}
          </div>
          <div className="flex gap-3 mt-4">
            <button onClick={() => setAddingAddress(false)} className="flex-1 py-2.5 bg-primary text-white rounded-xl font-bold text-sm hover:bg-primary/90 transition-all">Save Address</button>
            <button onClick={() => setAddingAddress(false)} className="px-4 py-2.5 border border-border rounded-xl text-sm font-semibold hover:bg-secondary transition-all">Cancel</button>
          </div>
        </div>
      )}

      {addresses.map(addr => (
        <div key={addr.id} className={`bg-card border rounded-2xl p-5 transition-all ${addr.default ? 'border-primary/30 bg-primary/2' : 'border-border'}`}>
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex items-center gap-2">
              <div className={`p-2 rounded-xl ${addr.default ? 'bg-primary/10' : 'bg-secondary'}`}>
                <MapPin size={15} className={addr.default ? 'text-primary' : 'text-muted-foreground'} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-foreground text-sm">{addr.label}</span>
                  {addr.default && <span className="text-[9px] font-black text-primary bg-primary/10 border border-primary/20 px-1.5 py-0.5 rounded-md">Default</span>}
                </div>
                <p className="text-[11px] text-muted-foreground">{addr.name}</p>
              </div>
            </div>
            <div className="flex gap-1 shrink-0">
              <button className="p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-all"><Edit2 size={14} /></button>
              <button className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/8 rounded-lg transition-all"><Trash2 size={14} /></button>
            </div>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed ml-11">{addr.line1}<br />{addr.city}, {addr.state} {addr.zip}<br />{addr.country} · {addr.phone}</p>
          {!addr.default && (
            <button onClick={() => setDefaultAddress(addr.id)} className="ml-11 mt-3 text-xs font-bold text-primary hover:underline">Set as default</button>
          )}
        </div>
      ))}
    </div>
  )

  /* ─── PAYMENTS SECTION ─── */
  const PaymentsSection = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-black text-foreground text-xl">Payment Methods</h2>
        <button className="flex items-center gap-2 px-4 py-2 bg-foreground text-background rounded-xl text-sm font-bold hover:bg-foreground/85 active:scale-[0.97] transition-all">
          <Plus size={15} /> Add Card
        </button>
      </div>

      {payments.map(card => (
        <div key={card.id} className={`bg-card border rounded-2xl p-5 transition-all ${card.default ? 'border-primary/30' : 'border-border'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CardIcon type={card.type} />
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-bold text-foreground text-sm">•••• •••• •••• {card.last4}</p>
                  {card.default && <span className="text-[9px] font-black text-primary bg-primary/10 border border-primary/20 px-1.5 py-0.5 rounded-md">Default</span>}
                </div>
                <p className="text-xs text-muted-foreground">{card.name} · Exp {card.expiry}</p>
              </div>
            </div>
            <div className="flex gap-1 shrink-0">
              <button className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/8 rounded-lg transition-all"><Trash2 size={14} /></button>
            </div>
          </div>
          {!card.default && (
            <button onClick={() => setDefaultPayment(card.id)} className="mt-3 text-xs font-bold text-primary hover:underline">Set as default</button>
          )}
        </div>
      ))}

      <div className="p-5 bg-secondary/50 border border-dashed border-border rounded-2xl flex flex-col items-center gap-3 text-center">
        <div className="p-3 bg-secondary rounded-2xl"><CreditCard size={22} className="text-muted-foreground" /></div>
        <div>
          <p className="font-semibold text-foreground text-sm">Add a payment method</p>
          <p className="text-xs text-muted-foreground">Visa, Mastercard, Amex, PayPal, Apple Pay</p>
        </div>
        <button className="flex items-center gap-2 px-5 py-2 bg-foreground text-background rounded-xl text-xs font-bold hover:bg-foreground/85 active:scale-[0.97] transition-all">
          <Plus size={13} /> Add Method
        </button>
      </div>

      <div className="flex items-center gap-2 p-4 bg-green-500/8 border border-green-500/20 rounded-2xl">
        <Shield size={15} className="text-green-500 shrink-0" />
        <p className="text-xs text-green-700 dark:text-green-400">All payment methods are encrypted with 256-bit SSL and PCI-DSS compliant.</p>
      </div>
    </div>
  )

  /* ─── NOTIFICATIONS SECTION ─── */
  const NotificationsSection = () => (
    <div className="space-y-5">
      <h2 className="font-black text-foreground text-xl">Notifications</h2>
      {[
        {
          title: 'Orders & Shopping',
          items: [
            { key: 'orderUpdates', label: 'Order updates', desc: 'Shipping, delivery, and status changes' },
            { key: 'priceDrops', label: 'Price drops', desc: 'When wishlisted items go on sale' },
            { key: 'flashSales', label: 'Flash sales', desc: 'Limited-time deals and exclusive offers' },
          ]
        },
        {
          title: 'Email',
          items: [
            { key: 'newsletter', label: 'Newsletter', desc: 'Weekly curated picks and style guides' },
            { key: 'newArrivals', label: 'New arrivals', desc: 'Be first to know about new products' },
            { key: 'weeklySummary', label: 'Weekly summary', desc: 'Your activity and savings recap' },
          ]
        },
        {
          title: 'Mobile',
          items: [
            { key: 'pushNotifs', label: 'Push notifications', desc: 'Real-time alerts on your device' },
            { key: 'smsAlerts', label: 'SMS alerts', desc: 'Text messages for critical updates' },
          ]
        },
      ].map(({ title, items }) => (
        <div key={title} className="bg-card border border-border rounded-2xl overflow-hidden">
          <div className="px-5 py-3.5 border-b border-border bg-secondary/30">
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{title}</p>
          </div>
          <div className="divide-y divide-border">
            {items.map(({ key, label, desc }) => (
              <div key={key} className="flex items-center justify-between gap-4 px-5 py-4">
                <div>
                  <p className="text-sm font-semibold text-foreground">{label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
                </div>
                <Toggle enabled={notifs[key as keyof typeof notifs]} onChange={v => setNotifs(p => ({ ...p, [key]: v }))} />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )

  /* ─── SECURITY SECTION ─── */
  const SecuritySection = () => (
    <div className="space-y-5">
      <h2 className="font-black text-foreground text-xl">Security</h2>

      {/* Change password */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-border bg-secondary/30 flex items-center gap-2">
          <Lock size={15} className="text-primary" />
          <p className="font-bold text-foreground text-sm">Change Password</p>
        </div>
        <div className="p-5 space-y-4">
          {[
            { label: 'Current Password', placeholder: '••••••••' },
            { label: 'New Password', placeholder: 'Min. 8 characters' },
            { label: 'Confirm New Password', placeholder: 'Must match new password' },
          ].map(({ label, placeholder }) => (
            <div key={label}>
              <label className="block text-xs font-bold text-foreground mb-1.5">{label}</label>
              <div className="relative">
                <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input type={showPassword ? 'text' : 'password'} placeholder={placeholder} className="w-full pl-9 pr-10 py-2.5 bg-secondary border border-transparent rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all" />
                <button onClick={() => setShowPassword(v => !v)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>
          ))}
          <button className="w-full py-3 bg-foreground text-background rounded-2xl font-bold text-sm hover:bg-foreground/85 active:scale-[0.97] transition-all">
            Update Password
          </button>
        </div>
      </div>

      {/* 2FA */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-border bg-secondary/30 flex items-center gap-2">
          <Smartphone size={15} className="text-primary" />
          <p className="font-bold text-foreground text-sm">Two-Factor Authentication</p>
        </div>
        <div className="p-5">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <p className="text-sm font-semibold text-foreground">Authenticator App</p>
              <p className="text-xs text-muted-foreground mt-0.5">Scan a QR code with your authenticator app for an extra layer of security.</p>
            </div>
            <Toggle enabled={twoFA} onChange={setTwoFA} />
          </div>
          {twoFA && (
            <div className="flex flex-col items-center gap-3 p-5 bg-secondary/50 rounded-2xl border border-border text-center">
              <div className="w-24 h-24 bg-secondary rounded-2xl flex items-center justify-center border border-border">
                <QrCode size={48} className="text-muted-foreground" />
              </div>
              <p className="text-xs text-muted-foreground">Scan with Google Authenticator, Authy, or 1Password</p>
              <div className="bg-card border border-border rounded-xl px-4 py-2 font-mono text-xs tracking-wider text-foreground">JBSWY3DPEHPK3PXP</div>
              <p className="text-[11px] text-muted-foreground">Enter the code from your app to verify setup</p>
              <input type="text" placeholder="000000" maxLength={6} className="w-32 text-center text-xl font-mono tracking-[0.5em] bg-background border border-border rounded-xl py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/20" />
              <button className="px-6 py-2.5 bg-primary text-white rounded-xl font-bold text-sm hover:bg-primary/90 transition-all">Verify & Enable</button>
            </div>
          )}
        </div>
      </div>

      {/* Active sessions */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-border bg-secondary/30 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Key size={15} className="text-primary" />
            <p className="font-bold text-foreground text-sm">Active Sessions</p>
          </div>
          <button className="text-xs font-bold text-primary hover:underline">Sign out all</button>
        </div>
        <div className="divide-y divide-border">
          {[
            { device: 'MacBook Pro 14"', os: 'macOS Sequoia', location: 'New York, US', time: 'Now', current: true },
            { device: 'iPhone 16 Pro', os: 'iOS 18', location: 'New York, US', time: '2 hours ago', current: false },
            { device: 'Chrome on Windows', os: 'Windows 11', location: 'Brooklyn, US', time: '3 days ago', current: false },
          ].map(s => (
            <div key={s.device} className="flex items-center justify-between gap-3 px-5 py-4">
              <div className="flex items-center gap-3">
                <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${s.current ? 'bg-green-500' : 'bg-muted-foreground/30'}`} />
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-foreground">{s.device}</p>
                    {s.current && <span className="text-[9px] font-black text-green-600 bg-green-500/10 px-1.5 py-0.5 rounded-md">Current</span>}
                  </div>
                  <p className="text-xs text-muted-foreground">{s.os} · {s.location} · {s.time}</p>
                </div>
              </div>
              {!s.current && <button className="text-xs font-bold text-primary hover:underline shrink-0">Revoke</button>}
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  /* ─── PREFERENCES SECTION ─── */
  const PreferencesSection = () => (
    <div className="space-y-5">
      <h2 className="font-black text-foreground text-xl">Preferences</h2>

      {/* Appearance */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="px-5 py-3.5 border-b border-border bg-secondary/30">
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Appearance</p>
        </div>
        <div className="p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm font-semibold text-foreground">Dark Mode</p>
              <p className="text-xs text-muted-foreground">Switch between light and dark theme</p>
            </div>
            <div className="flex items-center gap-2">
              <Sun size={15} className="text-muted-foreground" />
              <Toggle enabled={darkMode} onChange={setDarkMode} />
              <Moon size={15} className="text-muted-foreground" />
            </div>
          </div>
          <div>
            <p className="text-xs font-bold text-foreground mb-2">Theme Color</p>
            <div className="flex gap-2">
              {[{ color: '#E40F2A', label: 'Red' }, { color: '#3b82f6', label: 'Blue' }, { color: '#8b5cf6', label: 'Purple' }, { color: '#10b981', label: 'Green' }, { color: '#f59e0b', label: 'Amber' }].map(({ color, label }) => (
                <button key={color} title={label} className={`w-8 h-8 rounded-xl border-2 transition-all hover:scale-110 ${color === '#E40F2A' ? 'border-foreground ring-2 ring-foreground/20' : 'border-transparent'}`} style={{ background: color }} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Language & Region */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="px-5 py-3.5 border-b border-border bg-secondary/30">
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Language & Region</p>
        </div>
        <div className="p-5 space-y-4">
          {[
            { label: 'Language', value: language, options: ['English', 'Vietnamese', 'French', 'German', 'Japanese', 'Korean'], set: setLanguage },
            { label: 'Currency', value: currency, options: ['USD ($)', 'EUR (€)', 'GBP (£)', 'JPY (¥)', 'VND (₫)'], set: setCurrency },
          ].map(({ label, value, options, set }) => (
            <div key={label}>
              <label className="block text-xs font-bold text-foreground mb-1.5">{label}</label>
              <div className="relative">
                <select value={value} onChange={e => set(e.target.value)} className="w-full appearance-none bg-secondary border border-transparent rounded-xl px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all">
                  {options.map(o => <option key={o}>{o}</option>)}
                </select>
                <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Privacy */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="px-5 py-3.5 border-b border-border bg-secondary/30">
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Privacy & Data</p>
        </div>
        <div className="divide-y divide-border">
          {[
            { label: 'Profile visible to others', desc: 'Let others see your wishlist and reviews', key: 'pub' },
            { label: 'Personalised recommendations', desc: 'Use browsing history to suggest products', key: 'rec' },
            { label: 'Analytics cookies', desc: 'Help improve our service with usage data', key: 'ana' },
          ].map(({ label, desc, key }) => (
            <div key={key} className="flex items-center justify-between gap-4 px-5 py-4">
              <div>
                <p className="text-sm font-semibold text-foreground">{label}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
              </div>
              <Toggle enabled={true} onChange={() => {}} />
            </div>
          ))}
        </div>
        <div className="px-5 pb-5 pt-3 flex gap-3">
          <button className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-primary transition-colors">
            <Download size={13} /> Download my data
          </button>
          <span className="text-border">·</span>
          <button className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-primary transition-colors">
            <ExternalLink size={13} /> Privacy policy
          </button>
        </div>
      </div>
    </div>
  )

  /* ─── DANGER ZONE ─── */
  const DangerSection = () => (
    <div className="space-y-5">
      <h2 className="font-black text-foreground text-xl">Account</h2>

      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="px-5 py-3.5 border-b border-border bg-secondary/30">
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Account Actions</p>
        </div>
        <div className="divide-y divide-border">
          {[
            { icon: Download, label: 'Export my data', desc: 'Download a copy of all your ShopHub data', action: 'Export', variant: 'neutral' },
            { icon: RefreshCw, label: 'Reset preferences', desc: 'Reset all preferences to default settings', action: 'Reset', variant: 'neutral' },
            { icon: Eye, label: 'Deactivate account', desc: 'Temporarily pause your account and hide your profile', action: 'Deactivate', variant: 'warning' },
          ].map(({ icon: Icon, label, desc, action, variant }) => (
            <div key={label} className="flex items-center justify-between gap-4 px-5 py-4">
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-xl shrink-0 ${variant === 'warning' ? 'bg-amber-500/10' : 'bg-secondary'}`}>
                  <Icon size={15} className={variant === 'warning' ? 'text-amber-600' : 'text-muted-foreground'} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
                </div>
              </div>
              <button className={`shrink-0 px-3.5 py-2 rounded-xl text-xs font-bold border transition-all active:scale-[0.97] ${variant === 'warning' ? 'border-amber-500/30 text-amber-700 dark:text-amber-400 hover:bg-amber-500/10' : 'border-border text-foreground hover:bg-secondary'}`}>
                {action}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Delete account */}
      <div className="bg-card border border-primary/30 rounded-2xl overflow-hidden ring-1 ring-primary/10">
        <div className="px-5 py-4 border-b border-primary/20 bg-primary/5 flex items-center gap-2">
          <AlertCircle size={15} className="text-primary" />
          <p className="font-bold text-foreground text-sm">Delete Account</p>
        </div>
        <div className="p-5">
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">
            Permanently delete your ShopHub account and all associated data. This action <span className="font-bold text-foreground">cannot be undone</span>. All orders, reviews, addresses, and payment methods will be permanently removed.
          </p>
          {!confirmDelete ? (
            <button onClick={() => setConfirmDelete(true)} className="flex items-center gap-2 px-5 py-3 bg-primary/10 border border-primary/30 text-primary rounded-xl font-bold text-sm hover:bg-primary/15 active:scale-[0.97] transition-all">
              <Trash2 size={15} /> I want to delete my account
            </button>
          ) : (
            <div className="space-y-4">
              <div className="p-4 bg-primary/8 border border-primary/20 rounded-xl">
                <p className="text-xs font-bold text-primary mb-1 flex items-center gap-1.5"><AlertCircle size={12} /> Confirm deletion</p>
                <p className="text-xs text-muted-foreground">Type <span className="font-mono font-bold text-foreground">DELETE MY ACCOUNT</span> to confirm.</p>
              </div>
              <input
                type="text"
                placeholder="DELETE MY ACCOUNT"
                value={deleteInput}
                onChange={e => setDeleteInput(e.target.value)}
                className="w-full px-4 py-3 bg-secondary border border-border rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all placeholder:text-muted-foreground placeholder:font-sans"
              />
              <div className="flex gap-3">
                <button
                  disabled={deleteInput !== 'DELETE MY ACCOUNT'}
                  className="flex-1 py-3 bg-primary text-white rounded-xl font-bold text-sm hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.97] transition-all"
                >
                  <Trash2 size={15} className="inline mr-2" />Delete Permanently
                </button>
                <button onClick={() => { setConfirmDelete(false); setDeleteInput('') }} className="px-5 py-3 border border-border rounded-xl font-semibold text-sm hover:bg-secondary active:scale-[0.97] transition-all">
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )

  const SECTION_MAP: Record<Section, React.ReactNode> = {
    profile: <ProfileSection />,
    orders: (
      <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
        <div className="p-4 bg-secondary rounded-2xl"><Package size={28} className="text-muted-foreground" /></div>
        <h3 className="font-black text-foreground text-xl">Orders & Returns</h3>
        <p className="text-muted-foreground text-sm max-w-xs">View your complete order history, track shipments, and manage returns.</p>
        <Link href="/orders" className="flex items-center gap-2 px-6 py-3 bg-foreground text-background rounded-xl font-bold text-sm hover:bg-foreground/85 transition-all">
          View All Orders <ChevronRight size={16} />
        </Link>
      </div>
    ),
    addresses: <AddressesSection />,
    payments: <PaymentsSection />,
    notifications: <NotificationsSection />,
    security: <SecuritySection />,
    preferences: <PreferencesSection />,
    danger: <DangerSection />,
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="flex-1 pb-20 sm:pb-0">

        {/* Page header */}
        <div className="border-b border-border bg-background">
          <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-5 sm:py-8">
            <nav className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
              <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
              <ChevronRight size={12} />
              <span className="text-foreground font-medium">Profile & Settings</span>
            </nav>

            {/* Mobile section switcher */}
            <div className="flex items-center justify-between sm:hidden">
              <h1 className="text-2xl font-black text-foreground">
                {SECTIONS.find(s => s.id === activeSection)?.label ?? 'Profile'}
              </h1>
              <button onClick={() => setSidebarOpen(v => !v)} className="flex items-center gap-2 px-3.5 py-2 border border-border rounded-xl text-sm font-semibold text-foreground hover:bg-secondary transition-all">
                Menu <ChevronDown size={14} className={`transition-transform ${sidebarOpen ? 'rotate-180' : ''}`} />
              </button>
            </div>

            {/* Mobile nav dropdown */}
            {sidebarOpen && (
              <div className="sm:hidden mt-3 bg-card border border-border rounded-2xl p-2 shadow-xl z-20 absolute left-4 right-4">
                {SECTIONS.map(({ id, label, icon: Icon }) => (
                  <button key={id} onClick={() => nav(id as Section)} className={`flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-sm transition-all text-left ${activeSection === id ? 'bg-primary/8 text-primary font-bold' : 'text-foreground/70 hover:bg-secondary'}`}>
                    <Icon size={16} className={activeSection === id ? 'text-primary' : 'text-muted-foreground'} /> {label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <div className="flex gap-8">

            {/* Sidebar — desktop */}
            <aside className="hidden sm:block w-60 xl:w-64 shrink-0">
              <div className="sticky top-24 bg-card border border-border rounded-2xl overflow-hidden p-3">
                <Sidebar />
              </div>
            </aside>

            {/* Main content */}
            <div className="flex-1 min-w-0">
              {SECTION_MAP[activeSection]}
            </div>
          </div>
        </div>
      </main>

    </div>
  )
}