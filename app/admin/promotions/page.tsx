"use client"
import React, { useState, useMemo } from 'react';
import {
  Tag, Gift, Percent, Ticket, Zap, Copy, Check,
  Search, Filter, Download, Plus, Bell, Settings,
  X, Edit, Trash2, Eye, ChevronLeft, ChevronRight,
  ChevronDown, ChevronUp, ArrowUpRight, TrendingDown,
  Calendar, Clock, Users, ShoppingBag, BarChart2,
  AlertCircle, CheckCircle2, Flag, Package, Star,
  Globe, Smartphone, Mail, Hash, Activity, Layers,
  ToggleLeft, ToggleRight, Send, RefreshCw,
  DollarSign, Percent as PercentIcon, Timer,
  Target, TrendingUp, Sparkles, Award
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, ResponsiveContainer,
  XAxis, YAxis, CartesianGrid, Tooltip as RTooltip,
  Cell, LineChart, Line
} from 'recharts';

// ─── TYPES ────────────────────────────────────────────────────────────────────

type PromoType    = 'percent' | 'fixed' | 'freeship' | 'gift' | 'bogo';
type PromoStatus  = 'active' | 'scheduled' | 'ended' | 'draft' | 'paused';
type PromoChannel = 'all' | 'web' | 'app' | 'email' | 'social';
type ApplyTo      = 'all' | 'category' | 'product' | 'tier';
type SortCol      = 'startDate' | 'used' | 'revenue' | 'conversion';
type SortDir      = 'asc' | 'desc';
type ActiveTab    = 'all' | 'active' | 'scheduled' | 'ended' | 'draft';
type ViewMode     = 'table' | 'grid';

interface UsagePoint  { day: string; used: number }
interface RevenuePoint{ week: string; revenue: number; target: number }
interface ChannelStat { channel: string; pct: number; color: string }

interface Promotion {
  id: string;
  name: string;
  code: string;
  type: PromoType;
  status: PromoStatus;
  value: number;
  minOrder: number;
  maxDiscount?: number;
  channel: PromoChannel;
  applyTo: ApplyTo;
  applyLabel: string;
  startDate: string;
  endDate: string;
  usageLimit: number;
  used: number;
  revenue: number;
  conversion: number;
  description: string;
  tags: string[];
  tiers: string[];
  newOnly: boolean;
  stackable: boolean;
  usageData: UsagePoint[];
}

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub?: string;
  trend?: string;
  trendUp?: boolean;
  highlight?: boolean;
}

interface CreateModalProps { onClose: () => void }
interface DetailPanelProps { promo: Promotion; onClose: () => void }

// ─── DATA ─────────────────────────────────────────────────────────────────────

const revenueData: RevenuePoint[] = [
  { week:'T1',  revenue:42,  target:40  },
  { week:'T2',  revenue:68,  target:55  },
  { week:'T3',  revenue:55,  target:60  },
  { week:'T4',  revenue:91,  target:70  },
  { week:'T5',  revenue:78,  target:75  },
  { week:'T6',  revenue:112, target:85  },
  { week:'T7',  revenue:98,  target:90  },
  { week:'T8',  revenue:134, target:100 },
];

const channelStats: ChannelStat[] = [
  { channel:'Web',    pct:41, color:'#E40F2A' },
  { channel:'App',    pct:29, color:'#DA596C' },
  { channel:'Email',  pct:18, color:'#EEA9B3' },
  { channel:'Social', pct:12, color:'#E8E7E7' },
];

const makeUsage = (base: number): UsagePoint[] =>
  ['T2','T3','T4','T5','T6','T7','CN'].map(day => ({
    day, used: Math.max(0, base + Math.floor((Math.random() - 0.4) * base)),
  }));

const PROMOTIONS: Promotion[] = [
  {
    id:'PRO-001', name:'Flash Sale Cuối Tuần', code:'FLASH30',
    type:'percent', status:'active', value:30, minOrder:500000, maxDiscount:200000,
    channel:'all', applyTo:'all', applyLabel:'Toàn bộ sản phẩm',
    startDate:'18/10/2024', endDate:'20/10/2024',
    usageLimit:500, used:387, revenue:184000000, conversion:24.3,
    description:'Giảm 30% cho toàn bộ sản phẩm cuối tuần. Áp dụng tối đa 200K/đơn.',
    tags:['Flash Sale','Weekend','Hot'], tiers:['all'], newOnly:false, stackable:false,
    usageData: makeUsage(55),
  },
  {
    id:'PRO-002', name:'Miễn Phí Vận Chuyển Gold+', code:'FREESHIP',
    type:'freeship', status:'active', value:0, minOrder:300000,
    channel:'app', applyTo:'tier', applyLabel:'Gold, Platinum',
    startDate:'01/10/2024', endDate:'31/10/2024',
    usageLimit:2000, used:1243, revenue:56000000, conversion:31.8,
    description:'Miễn phí ship cho thành viên Gold và Platinum qua App.',
    tags:['Freeship','Loyalty'], tiers:['Gold','Platinum'], newOnly:false, stackable:true,
    usageData: makeUsage(178),
  },
  {
    id:'PRO-003', name:'Chào Mừng Thành Viên Mới', code:'WELCOME150',
    type:'fixed', status:'active', value:150000, minOrder:400000,
    channel:'web', applyTo:'all', applyLabel:'Toàn bộ sản phẩm',
    startDate:'01/09/2024', endDate:'31/12/2024',
    usageLimit:999999, used:834, revenue:125100000, conversion:18.5,
    description:'Giảm 150.000đ cho khách hàng đăng ký lần đầu.',
    tags:['Welcome','New User'], tiers:['all'], newOnly:true, stackable:false,
    usageData: makeUsage(28),
  },
  {
    id:'PRO-004', name:'Mua 1 Tặng 1 Áo Hoodie', code:'BOGO1001',
    type:'bogo', status:'active', value:100, minOrder:0,
    channel:'web', applyTo:'category', applyLabel:'Áo khoác & Hoodie',
    startDate:'15/10/2024', endDate:'25/10/2024',
    usageLimit:200, used:143, revenue:78650000, conversion:42.1,
    description:'Mua 1 sản phẩm trong danh mục Áo khoác & Hoodie, tặng 1 sản phẩm tương tự.',
    tags:['BOGO','Fashion'], tiers:['all'], newOnly:false, stackable:false,
    usageData: makeUsage(20),
  },
  {
    id:'PRO-005', name:'Sale 11.11 Siêu To Khổng Lồ', code:'MEGA50',
    type:'percent', status:'scheduled', value:50, minOrder:1000000, maxDiscount:500000,
    channel:'all', applyTo:'all', applyLabel:'Toàn bộ sản phẩm',
    startDate:'11/11/2024', endDate:'12/11/2024',
    usageLimit:1000, used:0, revenue:0, conversion:0,
    description:'Siêu sale 50% nhân dịp 11.11. Áp dụng tối đa 500K, đơn từ 1 triệu.',
    tags:['11.11','Mega Sale','Upcoming'], tiers:['all'], newOnly:false, stackable:false,
    usageData: makeUsage(0),
  },
  {
    id:'PRO-006', name:'Tặng Quà Sinh Nhật Khách Hàng', code:'BDAY2024',
    type:'gift', status:'active', value:0, minOrder:200000,
    channel:'email', applyTo:'tier', applyLabel:'Tất cả hạng thành viên',
    startDate:'01/01/2024', endDate:'31/12/2024',
    usageLimit:9999, used:312, revenue:31200000, conversion:88.2,
    description:'Tự động gửi voucher quà tặng vào ngày sinh nhật của khách hàng.',
    tags:['Birthday','Auto','CRM'], tiers:['all'], newOnly:false, stackable:true,
    usageData: makeUsage(1),
  },
  {
    id:'PRO-007', name:'Giảm 20% Ngành Hàng Điện Tử', code:'TECH20',
    type:'percent', status:'paused', value:20, minOrder:2000000,
    channel:'web', applyTo:'category', applyLabel:'Điện tử & Công nghệ',
    startDate:'05/10/2024', endDate:'20/10/2024',
    usageLimit:300, used:198, revenue:95040000, conversion:22.7,
    description:'Giảm 20% toàn ngành hàng điện tử & công nghệ. Tạm dừng do hết hàng.',
    tags:['Tech','Electronics','Paused'], tiers:['Gold','Platinum'], newOnly:false, stackable:false,
    usageData: makeUsage(25),
  },
  {
    id:'PRO-008', name:'Khuyến Mãi Black Friday', code:'BF2024',
    type:'percent', status:'draft', value:40, minOrder:800000, maxDiscount:400000,
    channel:'all', applyTo:'all', applyLabel:'Toàn bộ sản phẩm',
    startDate:'29/11/2024', endDate:'30/11/2024',
    usageLimit:2000, used:0, revenue:0, conversion:0,
    description:'Bản nháp Black Friday. Đang chờ phê duyệt nội dung và ngân sách.',
    tags:['Black Friday','Draft'], tiers:['all'], newOnly:false, stackable:false,
    usageData: makeUsage(0),
  },
  {
    id:'PRO-009', name:'Giảm 10% Thanh Toán Ví Momo', code:'MOMO10',
    type:'percent', status:'ended', value:10, minOrder:200000,
    channel:'app', applyTo:'all', applyLabel:'Toàn bộ sản phẩm',
    startDate:'01/09/2024', endDate:'30/09/2024',
    usageLimit:5000, used:4872, revenue:243600000, conversion:29.4,
    description:'Giảm thêm 10% khi thanh toán qua ví MoMo. Đã kết thúc.',
    tags:['MoMo','Payment','Ended'], tiers:['all'], newOnly:false, stackable:true,
    usageData: makeUsage(0),
  },
  {
    id:'PRO-010', name:'Loyalty Rewards Platinum', code:'PLT500',
    type:'fixed', status:'active', value:500000, minOrder:5000000,
    channel:'all', applyTo:'tier', applyLabel:'Platinum only',
    startDate:'01/10/2024', endDate:'31/12/2024',
    usageLimit:100, used:34, revenue:170000000, conversion:65.4,
    description:'Ưu đãi đặc quyền 500K cho thành viên Platinum, đơn từ 5 triệu.',
    tags:['Loyalty','Platinum','Exclusive'], tiers:['Platinum'], newOnly:false, stackable:false,
    usageData: makeUsage(5),
  },
];

// ─── CONFIG ───────────────────────────────────────────────────────────────────

const typeConfig: Record<PromoType, { bg: string; text: string; border: string; icon: React.ReactNode; label: string }> = {
  percent:  { bg:'bg-red-50',    text:'text-red-600',   border:'border-red-200',   icon:<Percent size={12}/>,    label:'Giảm %'     },
  fixed:    { bg:'bg-blue-50',   text:'text-blue-700',  border:'border-blue-200',  icon:<DollarSign size={12}/>, label:'Giảm tiền'  },
  freeship: { bg:'bg-green-50',  text:'text-green-700', border:'border-green-200', icon:<Package size={12}/>,    label:'Free ship'  },
  gift:     { bg:'bg-violet-50', text:'text-violet-700',border:'border-violet-200',icon:<Gift size={12}/>,       label:'Tặng quà'   },
  bogo:     { bg:'bg-amber-50',  text:'text-amber-700', border:'border-amber-200', icon:<Layers size={12}/>,     label:'Mua 1 tặng 1'},
};

const statusConfig: Record<PromoStatus, { bg: string; text: string; border: string; dot: string; label: string; pulse?: boolean }> = {
  active:    { bg:'bg-green-50',  text:'text-green-700', border:'border-green-200', dot:'bg-green-500', label:'Đang chạy',    pulse:true  },
  scheduled: { bg:'bg-blue-50',   text:'text-blue-700',  border:'border-blue-200',  dot:'bg-blue-500',  label:'Sắp diễn ra'              },
  ended:     { bg:'bg-slate-100', text:'text-slate-500', border:'border-slate-200', dot:'bg-slate-400', label:'Đã kết thúc'              },
  draft:     { bg:'bg-amber-50',  text:'text-amber-700', border:'border-amber-200', dot:'bg-amber-500', label:'Bản nháp'                 },
  paused:    { bg:'bg-orange-50', text:'text-orange-700',border:'border-orange-200',dot:'bg-orange-500',label:'Tạm dừng'                 },
};

const channelIcon: Record<PromoChannel, React.ReactNode> = {
  all:    <Globe size={11}/>,
  web:    <Globe size={11}/>,
  app:    <Smartphone size={11}/>,
  email:  <Mail size={11}/>,
  social: <Star size={11}/>,
};

// ─── UTILS ────────────────────────────────────────────────────────────────────

const fmt = (n: number): string => {
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1)}B`;
  if (n >= 1_000_000)     return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000)         return `${(n / 1_000).toFixed(0)}K`;
  return n.toLocaleString();
};

const usagePct = (p: Promotion): number =>
  p.usageLimit >= 999999 ? 0 : Math.round((p.used / p.usageLimit) * 100);

const valueLabel = (p: Promotion): string => {
  if (p.type === 'percent')  return `${p.value}%`;
  if (p.type === 'fixed')    return `${fmt(p.value)}₫`;
  if (p.type === 'freeship') return 'Free';
  if (p.type === 'gift')     return 'Gift';
  if (p.type === 'bogo')     return '1+1';
  return '';
};

// ─── SUB-COMPONENTS ───────────────────────────────────────────────────────────

const StatCard: React.FC<StatCardProps> = ({ icon, label, value, sub, trend, trendUp, highlight }) => (
  <div className={`rounded-2xl p-5 flex flex-col gap-3 border transition-all hover:shadow-md ${highlight ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20' : 'bg-card border-border'}`}>
    <div className="flex items-center justify-between">
      <div className={`p-2.5 rounded-xl ${highlight ? 'bg-white/20' : 'bg-primary/8 text-primary'}`}>{icon}</div>
      {trend && (
        <span className={`flex items-center gap-0.5 text-[11px] font-bold px-2 py-0.5 rounded-full ${highlight ? 'bg-white/20 text-white' : trendUp ? 'text-green-600 bg-green-50' : 'text-red-500 bg-red-50'}`}>
          {trendUp ? <ArrowUpRight size={11}/> : <TrendingDown size={11}/>} {trend}
        </span>
      )}
    </div>
    <div>
      <div className={`text-2xl font-black tracking-tight ${highlight ? 'text-white' : 'text-foreground'}`}>{value}</div>
      <div className={`text-xs font-medium mt-0.5 ${highlight ? 'text-white/70' : 'text-muted-foreground'}`}>{label}</div>
    </div>
    {sub && <div className={`text-[11px] border-t pt-2 ${highlight ? 'text-white/60 border-white/20' : 'text-muted-foreground border-border'}`}>{sub}</div>}
  </div>
);

// ─── COPY CODE BUTTON ────────────────────────────────────────────────────────

const CopyCode: React.FC<{ code: string }> = ({ code }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(code).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <button onClick={handleCopy}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[11px] font-black transition-all font-mono ${
        copied ? 'bg-green-50 text-green-700 border-green-200' : 'bg-secondary text-foreground border-border hover:border-primary/40 hover:text-primary'
      }`}>
      {copied ? <Check size={10}/> : <Copy size={10}/>} {code}
    </button>
  );
};

// ─── USAGE MINI CHART ────────────────────────────────────────────────────────

const UsageMiniChart: React.FC<{ data: UsagePoint[]; color?: string }> = ({ data, color = '#E40F2A' }) => (
  <ResponsiveContainer width="100%" height={36}>
    <AreaChart data={data} margin={{ top:2, right:0, bottom:0, left:0 }}>
      <defs>
        <linearGradient id={`mg-${color}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.25}/>
          <stop offset="100%" stopColor={color} stopOpacity={0}/>
        </linearGradient>
      </defs>
      <Area type="monotone" dataKey="used" stroke={color} strokeWidth={1.5} fill={`url(#mg-${color})`} dot={false}/>
    </AreaChart>
  </ResponsiveContainer>
);

// ─── PROMO DETAIL PANEL ───────────────────────────────────────────────────────

const DetailPanel: React.FC<DetailPanelProps> = ({ promo, onClose }) => {
  const type   = typeConfig[promo.type];
  const status = statusConfig[promo.status];
  const pct    = usagePct(promo);

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-foreground/20 backdrop-blur-sm" onClick={onClose}/>
      <div className="relative w-full max-w-xl bg-card border-l border-border flex flex-col h-full shadow-2xl">

        {/* Banner */}
        <div className="bg-primary px-6 pt-5 pb-0 relative overflow-hidden flex-shrink-0">
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="absolute -right-10 -top-10 w-52 h-52 rounded-full bg-white"/>
            <div className="absolute right-10 -bottom-12 w-72 h-72 rounded-full bg-white"/>
          </div>
          <div className="relative z-10">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-black bg-white/20 text-white border border-white/30 px-2 py-0.5 rounded-full">{promo.id}</span>
                <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${status.bg} ${status.text} ${status.border}`}>{status.label}</span>
                <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${type.bg} ${type.text} ${type.border}`}>{type.label}</span>
              </div>
              <button onClick={onClose} className="p-1.5 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-all"><X size={14}/></button>
            </div>
            <h2 className="text-xl font-black text-white leading-tight mb-1">{promo.name}</h2>
            <p className="text-white/70 text-sm mb-4">{promo.description}</p>
            <div className="flex items-center gap-3 pb-4 flex-wrap">
              <div className="bg-white/15 border border-white/25 rounded-xl px-4 py-2 text-center">
                <div className="text-2xl font-black text-white">{valueLabel(promo)}</div>
                <div className="text-[10px] text-white/60">Mức giảm</div>
              </div>
              <div className="bg-white/15 border border-white/25 rounded-xl px-4 py-2 text-center">
                <div className="text-2xl font-black text-white">{fmt(promo.used)}</div>
                <div className="text-[10px] text-white/60">Lượt dùng</div>
              </div>
              <div className="bg-white/15 border border-white/25 rounded-xl px-4 py-2 text-center">
                <div className="text-2xl font-black text-white">{promo.conversion}%</div>
                <div className="text-[10px] text-white/60">Tỷ lệ chuyển đổi</div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll content */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">

          {/* Code */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-muted-foreground uppercase tracking-widest">Mã khuyến mãi</span>
            <CopyCode code={promo.code}/>
          </div>

          {/* Usage bar */}
          {promo.usageLimit < 999999 && (
            <div className="bg-secondary border border-border rounded-2xl p-4 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-bold text-foreground">Lượt sử dụng</span>
                <span className="font-black text-foreground">{promo.used.toLocaleString()} / {promo.usageLimit.toLocaleString()}</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div className={`h-full rounded-full transition-all ${pct > 80 ? 'bg-red-500' : pct > 60 ? 'bg-amber-500' : 'bg-primary'}`} style={{ width:`${pct}%` }}/>
              </div>
              <div className={`text-[11px] font-bold ${pct > 80 ? 'text-red-500' : 'text-muted-foreground'}`}>{pct}% đã sử dụng{pct > 80 ? ' — Sắp hết!' : ''}</div>
            </div>
          )}

          {/* Usage trend */}
          <div className="bg-secondary border border-border rounded-2xl p-4">
            <div className="text-xs font-black text-muted-foreground uppercase tracking-widest mb-3">Xu hướng sử dụng 7 ngày</div>
            <UsageMiniChart data={promo.usageData}/>
          </div>

          {/* Details grid */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { label:'Ngày bắt đầu', value: promo.startDate, icon:<Calendar size={12}/> },
              { label:'Ngày kết thúc', value: promo.endDate, icon:<Calendar size={12}/> },
              { label:'Đơn tối thiểu', value:`${fmt(promo.minOrder)}₫`, icon:<ShoppingBag size={12}/> },
              { label:'Giảm tối đa',   value: promo.maxDiscount ? `${fmt(promo.maxDiscount)}₫` : '—', icon:<BarChart2 size={12}/> },
              { label:'Kênh',          value: promo.channel === 'all' ? 'Tất cả' : promo.channel, icon:<Globe size={12}/> },
              { label:'Áp dụng cho',   value: promo.applyLabel, icon:<Tag size={12}/> },
              { label:'Doanh thu phát sinh', value:`${fmt(promo.revenue)}₫`, icon:<DollarSign size={12}/> },
              { label:'Chỉ khách mới', value: promo.newOnly ? 'Có' : 'Không', icon:<Users size={12}/> },
            ].map(item => (
              <div key={item.label} className="bg-card border border-border rounded-xl p-3 flex items-start gap-2">
                <div className="text-primary mt-0.5">{item.icon}</div>
                <div>
                  <div className="text-[10px] text-muted-foreground">{item.label}</div>
                  <div className="text-xs font-bold text-foreground mt-0.5">{item.value}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Tags */}
          {promo.tags.length > 0 && (
            <div>
              <div className="text-xs font-black text-muted-foreground uppercase tracking-widest mb-2">Tags</div>
              <div className="flex flex-wrap gap-1.5">
                {promo.tags.map(t => (
                  <span key={t} className="text-[10px] px-2.5 py-1 bg-secondary border border-border rounded-full text-muted-foreground font-medium">{t}</span>
                ))}
              </div>
            </div>
          )}

          {/* Flags */}
          <div className="flex gap-2 flex-wrap">
            {promo.stackable && (
              <span className="text-[10px] px-2.5 py-1 bg-blue-50 border border-blue-200 text-blue-700 rounded-full font-bold flex items-center gap-1">
                <Layers size={10}/> Kết hợp được
              </span>
            )}
            {promo.newOnly && (
              <span className="text-[10px] px-2.5 py-1 bg-violet-50 border border-violet-200 text-violet-700 rounded-full font-bold flex items-center gap-1">
                <Sparkles size={10}/> Chỉ khách mới
              </span>
            )}
            {promo.tiers.filter(t => t !== 'all').map(t => (
              <span key={t} className="text-[10px] px-2.5 py-1 bg-amber-50 border border-amber-200 text-amber-700 rounded-full font-bold flex items-center gap-1">
                <Award size={10}/> {t}
              </span>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 p-4 border-t border-border flex gap-2 bg-card">
          <button className="flex-1 py-3 bg-primary hover:bg-primary-light text-white font-black rounded-xl text-sm transition-all flex items-center justify-center gap-2 shadow shadow-primary/25">
            <Edit size={14}/> Chỉnh sửa
          </button>
          {promo.status === 'active' && (
            <button className="py-3 px-4 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-xl text-sm font-bold border border-amber-200 transition-all flex items-center gap-2">
              <Timer size={14}/> Tạm dừng
            </button>
          )}
          {promo.status === 'paused' && (
            <button className="py-3 px-4 bg-green-50 hover:bg-green-100 text-green-700 rounded-xl text-sm font-bold border border-green-200 transition-all flex items-center gap-2">
              <Zap size={14}/> Kích hoạt
            </button>
          )}
          <button className="py-3 px-3 bg-red-50 hover:bg-red-100 text-red-500 rounded-xl border border-red-100 transition-all">
            <Trash2 size={15}/>
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── CREATE MODAL ─────────────────────────────────────────────────────────────

const CreateModal: React.FC<CreateModalProps> = ({ onClose }) => {
  const [step, setStep] = useState(1);
  const totalSteps = 3;
  const stepLabels = ['Thông tin cơ bản', 'Điều kiện áp dụng', 'Xem trước & Tạo'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-foreground/25 backdrop-blur-sm" onClick={onClose}/>
      <div className="relative bg-card border border-border rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
        {/* Progress bar */}
        <div className="h-1 bg-muted">
          <div className="h-full bg-primary transition-all duration-300" style={{ width:`${(step / totalSteps) * 100}%` }}/>
        </div>

        <div className="p-6 space-y-5">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-black text-foreground flex items-center gap-2"><Plus size={16} className="text-primary"/> Tạo khuyến mãi mới</h3>
              <p className="text-[11px] text-muted-foreground mt-0.5">Bước {step}/{totalSteps} — {stepLabels[step - 1]}</p>
            </div>
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground"><X size={15}/></button>
          </div>

          {/* Step indicators */}
          <div className="flex items-center gap-2">
            {stepLabels.map((label, i) => (
              <React.Fragment key={label}>
                <div className="flex items-center gap-1.5">
                  <div className={`h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-black transition-all ${
                    i + 1 < step ? 'bg-green-500 text-white' : i + 1 === step ? 'bg-primary text-white' : 'bg-secondary text-muted-foreground border border-border'
                  }`}>
                    {i + 1 < step ? <Check size={10}/> : i + 1}
                  </div>
                  <span className={`text-[10px] font-bold hidden sm:block ${i + 1 === step ? 'text-foreground' : 'text-muted-foreground'}`}>{label}</span>
                </div>
                {i < totalSteps - 1 && <div className={`flex-1 h-px ${i + 1 < step ? 'bg-green-500' : 'bg-border'}`}/>}
              </React.Fragment>
            ))}
          </div>

          {/* Step 1 */}
          {step === 1 && (
            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-black text-muted-foreground uppercase tracking-widest block mb-1.5">Tên khuyến mãi</label>
                <input className="w-full bg-secondary border border-border rounded-xl px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50" placeholder="VD: Flash Sale Cuối Tuần"/>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-black text-muted-foreground uppercase tracking-widest block mb-1.5">Loại khuyến mãi</label>
                  <select className="w-full bg-secondary border border-border rounded-xl px-3 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary/50">
                    <option>Giảm theo %</option>
                    <option>Giảm tiền cố định</option>
                    <option>Miễn phí vận chuyển</option>
                    <option>Tặng quà</option>
                    <option>Mua 1 tặng 1</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-black text-muted-foreground uppercase tracking-widest block mb-1.5">Mã coupon</label>
                  <input className="w-full bg-secondary border border-border rounded-xl px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 font-mono uppercase" placeholder="VD: SALE30"/>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-black text-muted-foreground uppercase tracking-widest block mb-1.5">Giá trị giảm</label>
                  <input type="number" className="w-full bg-secondary border border-border rounded-xl px-3 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary/50" placeholder="30"/>
                </div>
                <div>
                  <label className="text-[11px] font-black text-muted-foreground uppercase tracking-widest block mb-1.5">Giới hạn lượt dùng</label>
                  <input type="number" className="w-full bg-secondary border border-border rounded-xl px-3 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary/50" placeholder="500"/>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-black text-muted-foreground uppercase tracking-widest block mb-1.5">Ngày bắt đầu</label>
                  <input type="date" className="w-full bg-secondary border border-border rounded-xl px-3 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary/50"/>
                </div>
                <div>
                  <label className="text-[11px] font-black text-muted-foreground uppercase tracking-widest block mb-1.5">Ngày kết thúc</label>
                  <input type="date" className="w-full bg-secondary border border-border rounded-xl px-3 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary/50"/>
                </div>
              </div>
            </div>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-black text-muted-foreground uppercase tracking-widest block mb-1.5">Kênh áp dụng</label>
                <div className="flex gap-2 flex-wrap">
                  {(['Tất cả','Web','App','Email','Social'] as const).map(c => (
                    <button key={c} className={`px-3 py-1.5 rounded-lg text-[11px] font-bold border transition-all ${c === 'Tất cả' ? 'bg-primary text-white border-primary' : 'bg-secondary text-muted-foreground border-border hover:border-primary/40'}`}>{c}</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-[11px] font-black text-muted-foreground uppercase tracking-widest block mb-1.5">Đơn hàng tối thiểu (₫)</label>
                <input type="number" className="w-full bg-secondary border border-border rounded-xl px-3 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary/50" placeholder="500000"/>
              </div>
              <div>
                <label className="text-[11px] font-black text-muted-foreground uppercase tracking-widest block mb-1.5">Áp dụng cho</label>
                <select className="w-full bg-secondary border border-border rounded-xl px-3 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary/50">
                  <option>Tất cả sản phẩm</option>
                  <option>Danh mục cụ thể</option>
                  <option>Sản phẩm cụ thể</option>
                  <option>Hạng thành viên</option>
                </select>
              </div>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="accent-primary"/>
                  <span className="text-sm font-bold text-foreground">Chỉ khách hàng mới</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="accent-primary"/>
                  <span className="text-sm font-bold text-foreground">Có thể kết hợp</span>
                </label>
              </div>
            </div>
          )}

          {/* Step 3 */}
          {step === 3 && (
            <div className="space-y-3">
              <div className="bg-primary/5 border border-primary/20 rounded-2xl p-4 space-y-3">
                <div className="text-sm font-black text-primary flex items-center gap-2"><CheckCircle2 size={14}/> Xem trước khuyến mãi</div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {[['Tên', 'Flash Sale Cuối Tuần'],['Mã', 'FLASH30'],['Loại', 'Giảm 30%'],['Thời gian', '18-20/10'],['Kênh', 'Tất cả'],['Giới hạn', '500 lượt']].map(([k,v]) => (
                    <div key={k} className="flex justify-between">
                      <span className="text-muted-foreground">{k}:</span>
                      <span className="font-bold text-foreground">{v}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex gap-2">
                <AlertCircle size={14} className="text-amber-600 flex-shrink-0 mt-0.5"/>
                <p className="text-[11px] text-amber-700">Sau khi tạo, khuyến mãi sẽ ở trạng thái <strong>Bản nháp</strong>. Bạn cần kích hoạt thủ công.</p>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex gap-2 pt-1">
            {step > 1 && (
              <button onClick={() => setStep(s => s - 1)}
                className="px-4 py-2.5 bg-secondary hover:bg-muted border border-border rounded-xl text-sm font-bold text-foreground transition-all flex items-center gap-2">
                <ChevronLeft size={14}/> Quay lại
              </button>
            )}
            {step < totalSteps ? (
              <button onClick={() => setStep(s => s + 1)}
                className="flex-1 py-2.5 bg-primary hover:bg-primary-light text-white rounded-xl text-sm font-black transition-all flex items-center justify-center gap-2 shadow shadow-primary/25">
                Tiếp theo <ChevronRight size={14}/>
              </button>
            ) : (
              <button className="flex-1 py-2.5 bg-primary hover:bg-primary-light text-white rounded-xl text-sm font-black transition-all flex items-center justify-center gap-2 shadow shadow-primary/25">
                <Zap size={14}/> Tạo khuyến mãi
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── GRID CARD ────────────────────────────────────────────────────────────────

interface PromoGridCardProps { promo: Promotion; onClick: () => void }
const PromoGridCard: React.FC<PromoGridCardProps> = ({ promo, onClick }) => {
  const type   = typeConfig[promo.type];
  const status = statusConfig[promo.status];
  const pct    = usagePct(promo);

  return (
    <div onClick={onClick} className="bg-card border border-border rounded-2xl p-5 hover:border-primary/40 hover:shadow-md transition-all cursor-pointer group space-y-4">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className={`text-[10px] font-black px-2 py-0.5 rounded-lg border flex items-center gap-1 ${type.bg} ${type.text} ${type.border}`}>{type.icon} {type.label}</span>
            <span className={`text-[10px] font-black px-2 py-0.5 rounded-lg border flex items-center gap-1 ${status.bg} ${status.text} ${status.border}`}>
              <span className={`h-1.5 w-1.5 rounded-full ${status.dot} ${status.pulse ? 'animate-pulse' : ''}`}/>{status.label}
            </span>
          </div>
          <p className="text-sm font-black text-foreground group-hover:text-primary transition-colors leading-tight">{promo.name}</p>
        </div>
        <div className="text-right flex-shrink-0">
          <div className="text-2xl font-black text-primary">{valueLabel(promo)}</div>
        </div>
      </div>

      <CopyCode code={promo.code}/>

      <div className="grid grid-cols-3 gap-2 text-center">
        {[
          { label:'Lượt dùng', value: promo.used.toLocaleString() },
          { label:'Doanh thu', value: `${fmt(promo.revenue)}₫` },
          { label:'Chuyển đổi', value: `${promo.conversion}%` },
        ].map(s => (
          <div key={s.label} className="bg-secondary rounded-xl p-2 border border-border">
            <div className="text-xs font-black text-foreground">{s.value}</div>
            <div className="text-[9px] text-muted-foreground">{s.label}</div>
          </div>
        ))}
      </div>

      <UsageMiniChart data={promo.usageData}/>

      {promo.usageLimit < 999999 && (
        <div className="space-y-1">
          <div className="flex justify-between text-[10px]">
            <span className="text-muted-foreground font-medium">Sử dụng</span>
            <span className={`font-black ${pct > 80 ? 'text-red-500' : 'text-foreground'}`}>{pct}%</span>
          </div>
          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
            <div className={`h-full rounded-full ${pct > 80 ? 'bg-red-500' : pct > 60 ? 'bg-amber-500' : 'bg-primary'}`} style={{ width:`${pct}%` }}/>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between text-[10px] text-muted-foreground pt-1 border-t border-border">
        <span className="flex items-center gap-1"><Calendar size={10}/> {promo.startDate} → {promo.endDate}</span>
        <span className="flex items-center gap-1">{channelIcon[promo.channel]} {promo.channel === 'all' ? 'All' : promo.channel}</span>
      </div>
    </div>
  );
};

// ─── MAIN ─────────────────────────────────────────────────────────────────────

export default function PromotionManagement() {
  const [search, setSearch]         = useState('');
  const [activeTab, setActiveTab]   = useState<ActiveTab>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [sortCol, setSortCol]       = useState<SortCol>('startDate');
  const [sortDir, setSortDir]       = useState<SortDir>('desc');
  const [selected, setSelected]     = useState<string[]>([]);
  const [detail, setDetail]         = useState<Promotion | null>(null);
  const [creating, setCreating]     = useState(false);
  const [viewMode, setViewMode]     = useState<ViewMode>('table');

  const filtered = useMemo<Promotion[]>(() => {
    return PROMOTIONS.filter(p => {
      const q        = search.toLowerCase();
      const matchQ   = p.name.toLowerCase().includes(q) || p.code.toLowerCase().includes(q) || p.tags.some(t => t.toLowerCase().includes(q));
      const matchTab = activeTab === 'all' || p.status === activeTab;
      const matchTyp = filterType === 'all' || p.type === filterType;
      return matchQ && matchTab && matchTyp;
    }).sort((a, b) => {
      const d = sortDir === 'asc' ? 1 : -1;
      if (sortCol === 'used')       return (a.used       - b.used)       * d;
      if (sortCol === 'revenue')    return (a.revenue    - b.revenue)    * d;
      if (sortCol === 'conversion') return (a.conversion - b.conversion) * d;
      return 0;
    });
  }, [search, activeTab, filterType, sortCol, sortDir]);

  const toggleSelect = (id: string) => setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);
  const toggleAll    = () => setSelected(selected.length === filtered.length ? [] : filtered.map(p => p.id));

  const tabCount = (tab: ActiveTab): number =>
    tab === 'all' ? PROMOTIONS.length : PROMOTIONS.filter(p => p.status === tab).length;

  const handleSort = (col: SortCol) => {
    if (sortCol === col) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortCol(col); setSortDir('desc'); }
  };

  const SortIcon: React.FC<{ col: SortCol }> = ({ col }) =>
    sortCol === col
      ? (sortDir === 'desc' ? <ChevronDown size={11} className="text-primary"/> : <ChevronUp size={11} className="text-primary"/>)
      : <ChevronDown size={11} className="text-muted-foreground/40"/>;

  const totalRevenue  = PROMOTIONS.reduce((s, p) => s + p.revenue,  0);
  const totalUsed     = PROMOTIONS.reduce((s, p) => s + p.used,     0);
  const avgConversion = (PROMOTIONS.filter(p => p.conversion > 0).reduce((s, p) => s + p.conversion, 0) / PROMOTIONS.filter(p => p.conversion > 0).length).toFixed(1);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {detail   && <DetailPanel promo={detail} onClose={() => setDetail(null)}/>}
      {creating && <CreateModal onClose={() => setCreating(false)}/>}

      {/* Nav */}
      <div className="border-b border-border bg-card px-6 py-3 flex items-center justify-between sticky top-0 z-40 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="h-7 w-7 bg-primary rounded-lg flex items-center justify-center shadow-md shadow-primary/30">
            <Tag size={13} className="text-white"/>
          </div>
          <span className="font-black text-foreground text-sm tracking-tight">CRM Pro</span>
          <span className="text-muted-foreground mx-1 text-sm">›</span>
          <span className="text-muted-foreground text-sm">Quản lý khuyến mãi</span>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-all relative">
            <Bell size={15}/>
            <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 bg-primary rounded-full"/>
          </button>
          <button className="p-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-all"><Settings size={15}/></button>
          <div className="h-7 w-7 bg-primary rounded-lg flex items-center justify-center text-xs font-black text-white shadow-md shadow-primary/30">A</div>
        </div>
      </div>

      <div className="p-6 space-y-6 max-w-[1600px] mx-auto">

        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-foreground">Khuyến mãi</h1>
            <p className="text-muted-foreground text-sm mt-1">Tạo, quản lý và theo dõi hiệu suất toàn bộ chương trình khuyến mãi</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-4 py-2.5 bg-secondary hover:bg-muted border border-border rounded-xl text-sm font-bold text-foreground flex items-center gap-2 transition-all">
              <Download size={14}/> Xuất báo cáo
            </button>
            <button onClick={() => setCreating(true)} className="px-4 py-2.5 bg-primary hover:bg-primary-light rounded-xl text-sm font-black text-white flex items-center gap-2 transition-all shadow-lg shadow-primary/25">
              <Plus size={14}/> Tạo khuyến mãi
            </button>
          </div>
        </div>

        {/* KPI row */}
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
          <StatCard highlight icon={<Tag size={15} className="text-white"/>}          label="Tổng khuyến mãi"       value={String(PROMOTIONS.length)}     trend="+2"     trendUp  sub="2 đang chờ duyệt"/>
          <StatCard icon={<Activity size={15}/>}     label="Đang chạy"              value={String(PROMOTIONS.filter(p=>p.status==='active').length)}      trend="+1"     trendUp  sub="Hoạt động hôm nay"/>
          <StatCard icon={<Ticket size={15}/>}       label="Tổng lượt dùng"         value={fmt(totalUsed)}            trend="+12.4%" trendUp  sub="Tuần này"/>
          <StatCard icon={<DollarSign size={15}/>}   label="Doanh thu phát sinh"    value={`${fmt(totalRevenue)}₫`}   trend="+19.3%" trendUp  sub="Từ khuyến mãi"/>
          <StatCard icon={<Target size={15}/>}       label="Tỷ lệ chuyển đổi TB"   value={`${avgConversion}%`}       trend="+3.1%"  trendUp  sub="Trung bình toàn bộ"/>
          <StatCard icon={<AlertCircle size={15}/>}  label="Sắp hết lượt dùng"     value="3"                         trend="-1"     trendUp  sub="Cần bổ sung ngay"/>
        </div>

        {/* Charts row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Revenue chart */}
          <div className="lg:col-span-2 bg-card border border-border rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-sm font-black text-foreground">Doanh thu từ khuyến mãi</div>
                <div className="text-[11px] text-muted-foreground mt-0.5">So sánh thực tế vs mục tiêu (triệu ₫) theo tuần</div>
              </div>
              <div className="flex items-center gap-4 text-[11px] text-muted-foreground">
                <span className="flex items-center gap-1.5"><span className="h-2 w-3 bg-primary rounded-sm inline-block"/> Thực tế</span>
                <span className="flex items-center gap-1.5"><span className="h-2 w-3 bg-muted rounded-sm inline-block"/> Mục tiêu</span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="revG" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#E40F2A" stopOpacity={0.15}/>
                    <stop offset="100%" stopColor="#E40F2A" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false}/>
                <XAxis dataKey="week" tick={{ fontSize:10, fill:'var(--muted-foreground)' }} axisLine={false} tickLine={false}/>
                <YAxis tick={{ fontSize:10, fill:'var(--muted-foreground)' }} axisLine={false} tickLine={false}/>
                <RTooltip contentStyle={{ background:'var(--card)', border:'1px solid var(--border)', borderRadius:'12px', fontSize:'12px', color:'var(--foreground)' }}/>
                <Area type="monotone" dataKey="target"  stroke="var(--muted)" strokeWidth={1.5} fill="none" strokeDasharray="4 4"/>
                <Area type="monotone" dataKey="revenue" stroke="#E40F2A"       strokeWidth={2.5} fill="url(#revG)"/>
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Side panels */}
          <div className="space-y-4">
            {/* Type breakdown */}
            <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
              <div className="text-sm font-black text-foreground mb-4">Phân bổ loại khuyến mãi</div>
              <div className="space-y-2.5">
                {Object.entries(typeConfig).map(([key, cfg]) => {
                  const count = PROMOTIONS.filter(p => p.type === key).length;
                  const pct   = Math.round((count / PROMOTIONS.length) * 100);
                  return (
                    <div key={key} className="flex items-center gap-2.5">
                      <div className={`p-1.5 rounded-lg ${cfg.bg} ${cfg.text} flex-shrink-0`}>{cfg.icon}</div>
                      <div className="flex-1">
                        <div className="flex justify-between mb-0.5">
                          <span className="text-[11px] font-bold text-foreground">{cfg.label}</span>
                          <span className="text-[11px] font-black text-foreground">{count}</span>
                        </div>
                        <div className="h-1 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-primary rounded-full" style={{ width:`${pct}%` }}/>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Channel stats */}
            <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
              <div className="text-sm font-black text-foreground mb-4">Lượt dùng theo kênh</div>
              <div className="space-y-2.5">
                {channelStats.map(s => (
                  <div key={s.channel} className="flex items-center gap-2.5">
                    <span className="text-[11px] text-muted-foreground font-medium w-12">{s.channel}</span>
                    <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width:`${s.pct}%`, background:s.color }}/>
                    </div>
                    <span className="text-[11px] font-black text-foreground w-8 text-right">{s.pct}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Main table card */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">

          {/* Tabs */}
          <div className="border-b border-border">
            <div className="flex items-center gap-1 px-5 pt-3 border-b border-border/50">
              {(['all','active','scheduled','draft','ended'] as ActiveTab[]).map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)}
                  className={`relative pb-3 px-1 text-[11px] font-black uppercase tracking-widest flex items-center gap-1.5 transition-all ${activeTab === tab ? 'text-primary border-b-2 border-primary -mb-px' : 'text-muted-foreground hover:text-foreground'}`}>
                  {{ all:'Tất cả', active:'Đang chạy', scheduled:'Sắp tới', draft:'Bản nháp', ended:'Đã kết thúc' }[tab]}
                  <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-black ${activeTab === tab ? 'bg-primary text-white' : 'bg-secondary text-muted-foreground'}`}>{tabCount(tab)}</span>
                </button>
              ))}
            </div>

            {/* Toolbar */}
            <div className="px-5 py-3 flex flex-col md:flex-row gap-3 items-start md:items-center justify-between bg-secondary/20">
              <div className="flex items-center gap-2 flex-wrap">
                {/* Type filter */}
                <select value={filterType} onChange={e => setFilterType(e.target.value)}
                  className="bg-card border border-border rounded-xl text-[11px] font-bold text-foreground px-3 py-2 focus:outline-none focus:border-primary/50">
                  <option value="all">Tất cả loại</option>
                  {Object.entries(typeConfig).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                </select>

                {/* Sort */}
                {([['used','Lượt dùng',<Ticket size={11}/>],['revenue','Doanh thu',<DollarSign size={11}/>],['conversion','Chuyển đổi',<Target size={11}/>]] as [SortCol, string, React.ReactNode][]).map(([col, label, icon]) => (
                  <button key={col} onClick={() => handleSort(col)}
                    className={`px-3 py-1.5 rounded-xl text-[11px] font-bold border flex items-center gap-1.5 transition-all ${sortCol === col ? 'bg-primary text-white border-primary' : 'bg-card text-muted-foreground border-border hover:bg-secondary'}`}>
                    {icon} {label} <SortIcon col={col}/>
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2 w-full md:w-auto">
                <div className="relative flex-1 md:w-64">
                  <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"/>
                  <input value={search} onChange={e => setSearch(e.target.value)}
                    placeholder="Tìm tên, mã, tag..."
                    className="w-full bg-card border border-border rounded-xl pl-9 pr-8 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-all"/>
                  {search && <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"><X size={11}/></button>}
                </div>
                <div className="flex items-center gap-0.5 bg-card border border-border rounded-xl p-1">
                  {([['table', <List2 size={13}/>],['grid', <LayoutGrid2 size={13}/>]] as [ViewMode, React.ReactNode][]).map(([m, ic]) => (
                    <button key={m} onClick={() => setViewMode(m)}
                      className={`p-1.5 rounded-lg transition-all ${viewMode === m ? 'bg-primary text-white shadow-sm' : 'text-muted-foreground hover:text-foreground hover:bg-secondary'}`}>{ic}</button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Bulk bar */}
          {selected.length > 0 && (
            <div className="px-5 py-2.5 bg-primary/[0.05] border-b border-primary/20 flex items-center gap-3">
              <span className="text-sm font-bold text-primary">{selected.length} đã chọn</span>
              <div className="flex gap-2 flex-wrap">
                {([['Kích hoạt', <Zap size={11}/>],['Tạm dừng', <Timer size={11}/>],['Nhân bản', <Copy size={11}/>],['Xóa', <Trash2 size={11}/>]] as [string, React.ReactNode][]).map(([label, icon]) => (
                  <button key={label} className="px-3 py-1 bg-card hover:bg-secondary text-foreground rounded-lg text-[11px] font-bold flex items-center gap-1.5 transition-all border border-border">{icon} {label}</button>
                ))}
              </div>
              <button onClick={() => setSelected([])} className="ml-auto text-muted-foreground hover:text-foreground transition-all"><X size={13}/></button>
            </div>
          )}

          {/* Grid view */}
          {viewMode === 'grid' ? (
            <div className="p-5 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filtered.map(p => <PromoGridCard key={p.id} promo={p} onClick={() => setDetail(p)}/>)}
            </div>
          ) : (
            /* Table view */
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-secondary/30">
                    <th className="px-5 py-3 text-left w-10">
                      <input type="checkbox" checked={selected.length === filtered.length && filtered.length > 0} onChange={toggleAll} className="accent-primary cursor-pointer"/>
                    </th>
                    <th className="px-2 py-3 text-left text-[10px] font-black text-muted-foreground uppercase tracking-widest min-w-[260px]">Khuyến mãi</th>
                    <th className="px-2 py-3 text-left text-[10px] font-black text-muted-foreground uppercase tracking-widest">Loại</th>
                    <th className="px-2 py-3 text-left text-[10px] font-black text-muted-foreground uppercase tracking-widest">Trạng thái</th>
                    <th className="px-2 py-3 text-left text-[10px] font-black text-muted-foreground uppercase tracking-widest">Thời gian</th>
                    <th className="px-2 py-3 text-left text-[10px] font-black text-muted-foreground uppercase tracking-widest cursor-pointer hover:text-foreground select-none" onClick={() => handleSort('used')}>
                      <span className="flex items-center gap-1">Lượt dùng <SortIcon col="used"/></span>
                    </th>
                    <th className="px-2 py-3 text-left text-[10px] font-black text-muted-foreground uppercase tracking-widest cursor-pointer hover:text-foreground select-none" onClick={() => handleSort('revenue')}>
                      <span className="flex items-center gap-1">Doanh thu <SortIcon col="revenue"/></span>
                    </th>
                    <th className="px-2 py-3 text-left text-[10px] font-black text-muted-foreground uppercase tracking-widest cursor-pointer hover:text-foreground select-none" onClick={() => handleSort('conversion')}>
                      <span className="flex items-center gap-1">Chuyển đổi <SortIcon col="conversion"/></span>
                    </th>
                    <th className="px-5 py-3 text-right text-[10px] font-black text-muted-foreground uppercase tracking-widest">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(promo => {
                    const type   = typeConfig[promo.type];
                    const status = statusConfig[promo.status];
                    const pct    = usagePct(promo);
                    const isSel  = selected.includes(promo.id);
                    return (
                      <tr key={promo.id} className={`border-b border-border/60 transition-colors group ${isSel ? 'bg-primary/[0.02]' : 'hover:bg-secondary/30'}`}>
                        <td className="px-5 py-4">
                          <input type="checkbox" checked={isSel} onChange={() => toggleSelect(promo.id)} className="accent-primary cursor-pointer"/>
                        </td>
                        <td className="px-2 py-4">
                          <div className="space-y-1.5">
                            <p className="text-sm font-black text-foreground group-hover:text-primary transition-colors cursor-pointer leading-tight" onClick={() => setDetail(promo)}>
                              {promo.name}
                            </p>
                            <div className="flex items-center gap-2 flex-wrap">
                              <CopyCode code={promo.code}/>
                              <span className="text-[10px] text-muted-foreground flex items-center gap-1">{channelIcon[promo.channel]} {promo.channel === 'all' ? 'Tất cả kênh' : promo.channel}</span>
                              {promo.newOnly && <span className="text-[9px] bg-violet-50 text-violet-700 border border-violet-200 px-1.5 py-0.5 rounded-full font-bold">Khách mới</span>}
                              {promo.stackable && <span className="text-[9px] bg-blue-50 text-blue-700 border border-blue-200 px-1.5 py-0.5 rounded-full font-bold">Kết hợp được</span>}
                            </div>
                            {promo.tags.slice(0,3).map(t => (
                              <span key={t} className="text-[9px] px-1.5 py-0.5 bg-secondary border border-border rounded-full text-muted-foreground mr-1">{t}</span>
                            ))}
                          </div>
                        </td>
                        <td className="px-2 py-4">
                          <div className="space-y-1">
                            <span className={`inline-flex items-center gap-1 text-[10px] font-black px-2 py-1 rounded-lg border ${type.bg} ${type.text} ${type.border}`}>
                              {type.icon} {type.label}
                            </span>
                            <div className="text-sm font-black text-foreground">{valueLabel(promo)}</div>
                            <div className="text-[10px] text-muted-foreground">Min: {fmt(promo.minOrder)}₫</div>
                          </div>
                        </td>
                        <td className="px-2 py-4">
                          <span className={`inline-flex items-center gap-1.5 text-[10px] font-black px-2 py-1 rounded-lg border ${status.bg} ${status.text} ${status.border}`}>
                            <span className={`h-1.5 w-1.5 rounded-full ${status.dot} ${status.pulse ? 'animate-pulse' : ''}`}/>{status.label}
                          </span>
                        </td>
                        <td className="px-2 py-4">
                          <div className="text-[11px] font-bold text-foreground flex items-center gap-1"><Calendar size={10}/>{promo.startDate}</div>
                          <div className="text-[10px] text-muted-foreground">→ {promo.endDate}</div>
                        </td>
                        <td className="px-2 py-4">
                          <div className="text-sm font-black text-foreground">{promo.used.toLocaleString()}</div>
                          {promo.usageLimit < 999999 && (
                            <div className="w-20 mt-1.5 space-y-0.5">
                              <div className="h-1 bg-muted rounded-full overflow-hidden">
                                <div className={`h-full rounded-full ${pct > 80 ? 'bg-red-500' : 'bg-primary'}`} style={{ width:`${pct}%` }}/>
                              </div>
                              <div className={`text-[9px] font-bold ${pct > 80 ? 'text-red-500' : 'text-muted-foreground'}`}>{pct}% / {promo.usageLimit.toLocaleString()}</div>
                            </div>
                          )}
                          {promo.usageLimit >= 999999 && <div className="text-[10px] text-muted-foreground">Không giới hạn</div>}
                        </td>
                        <td className="px-2 py-4">
                          <div className="text-sm font-black text-foreground">{fmt(promo.revenue)}₫</div>
                          <div className="mt-1 w-16">
                            <UsageMiniChart data={promo.usageData}/>
                          </div>
                        </td>
                        <td className="px-2 py-4">
                          <div className="text-sm font-black text-foreground">{promo.conversion > 0 ? `${promo.conversion}%` : '—'}</div>
                          {promo.conversion > 0 && (
                            <div className="flex items-center gap-1 mt-0.5">
                              {promo.conversion >= 30 ? <TrendingUp size={10} className="text-green-500"/> : <TrendingDown size={10} className="text-amber-500"/>}
                              <span className={`text-[10px] font-bold ${promo.conversion >= 30 ? 'text-green-600' : 'text-amber-600'}`}>
                                {promo.conversion >= 30 ? 'Cao' : 'Trung bình'}
                              </span>
                            </div>
                          )}
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-all">
                            <button className="p-1.5 rounded-lg bg-secondary hover:bg-muted text-muted-foreground hover:text-foreground transition-all border border-border" title="Nhân bản"><Copy size={12}/></button>
                            <button className="p-1.5 rounded-lg bg-secondary hover:bg-muted text-muted-foreground hover:text-foreground transition-all border border-border" title="Chỉnh sửa"><Edit size={12}/></button>
                            <button onClick={() => setDetail(promo)} className="p-1.5 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary transition-all border border-primary/20"><ChevronRight size={12}/></button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {filtered.length === 0 && (
                <div className="py-16 text-center text-muted-foreground">
                  <Search size={28} className="mx-auto mb-3 opacity-40"/>
                  <p className="font-black text-foreground">Không tìm thấy khuyến mãi</p>
                  <p className="text-sm mt-1">Thử tìm kiếm với từ khóa hoặc bộ lọc khác</p>
                </div>
              )}
            </div>
          )}

          {/* Footer */}
          <div className="px-5 py-3.5 border-t border-border flex items-center justify-between bg-secondary/20">
            <div className="flex items-center gap-3">
              <input type="checkbox" checked={selected.length === filtered.length && filtered.length > 0} onChange={toggleAll} className="accent-primary cursor-pointer"/>
              <span className="text-[11px] text-muted-foreground">
                Hiển thị <span className="font-bold text-foreground">{filtered.length}</span> / {PROMOTIONS.length} khuyến mãi
              </span>
            </div>
            <div className="flex items-center gap-1">
              <button className="h-7 w-7 rounded-lg bg-secondary hover:bg-muted border border-border flex items-center justify-center text-muted-foreground transition-all"><ChevronLeft size={13}/></button>
              {([1,2,'…',5] as (number|string)[]).map((p, i) => (
                <button key={i} className={`h-7 min-w-[28px] px-1 rounded-lg text-[11px] font-bold transition-all ${p === 1 ? 'bg-primary text-white shadow shadow-primary/25' : 'text-muted-foreground hover:bg-secondary'}`}>{p}</button>
              ))}
              <button className="h-7 w-7 rounded-lg bg-secondary hover:bg-muted border border-border flex items-center justify-center text-muted-foreground transition-all"><ChevronRight size={13}/></button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Inline icon shims to avoid extra imports
const List2 = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/>
    <line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
  </svg>
);
const LayoutGrid2 = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
    <rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
  </svg>
);