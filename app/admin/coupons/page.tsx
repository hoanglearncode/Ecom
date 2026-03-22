"use client"
import React, { useState, useMemo } from 'react';
import {
  Ticket, Tag, Percent, DollarSign, Package, Gift,
  Layers, Copy, Check, Search, Download, Bell,
  Settings, X, Edit, Trash2, Plus, ChevronLeft,
  ChevronRight, ChevronDown, ChevronUp, ArrowUpRight,
  TrendingDown, TrendingUp, Calendar, Clock, Users,
  ShoppingBag, BarChart2, AlertCircle, CheckCircle2,
  Zap, Hash, Activity, Target, Sparkles, Award,
  Globe, Smartphone, Mail, Star, Layers as LayersIcon,
  RefreshCw, Timer, Info, Shield, Lock, Unlock,
  UserCheck, Eye, List, LayoutGrid, Filter,
  MousePointer, Send, QrCode, FileText, ToggleLeft,
  Flame, Infinity
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, ResponsiveContainer,
  XAxis, YAxis, CartesianGrid, Tooltip as RTooltip,
  Cell, LineChart, Line
} from 'recharts';

// ─── TYPES ────────────────────────────────────────────────────────────────────

type DiscountType  = 'percent' | 'fixed' | 'freeship' | 'gift' | 'bogo';
type CouponStatus  = 'active' | 'scheduled' | 'expired' | 'draft' | 'paused' | 'exhausted';
type ApplyScope    = 'all' | 'category' | 'product' | 'brand';
type ChannelScope  = 'all' | 'web' | 'app' | 'pos' | 'email';
type TierScope     = 'all' | 'bronze' | 'silver' | 'gold' | 'platinum';
type SortCol       = 'used' | 'revenue' | 'conversion' | 'endDate';
type SortDir       = 'asc' | 'desc';
type ActiveTab     = 'all' | 'active' | 'scheduled' | 'draft' | 'expired' | 'exhausted';
type ViewMode      = 'table' | 'grid';
type PanelTab      = 'overview' | 'usage' | 'conditions' | 'history';

interface UsagePoint   { day: string; used: number }
interface RevenuePoint { week: string; revenue: number }
interface UseLog       { id: string; user: string; tier: string; date: string; order: string; saving: number; channel: ChannelScope }

interface Coupon {
  id: string;
  code: string;
  name: string;
  description: string;
  discountType: DiscountType;
  status: CouponStatus;
  value: number;
  maxDiscount?: number;
  minOrder: number;
  usageLimit: number;
  usageLimitPerUser: number;
  used: number;
  revenue: number;
  savings: number;
  conversion: number;
  startDate: string;
  endDate: string;
  channelScope: ChannelScope;
  applyScope: ApplyScope;
  applyLabel: string;
  tierScope: TierScope;
  newOnly: boolean;
  stackable: boolean;
  autoApply: boolean;
  requireCode: boolean;
  tags: string[];
  createdBy: string;
  usageData: UsagePoint[];
  revenueData: RevenuePoint[];
  usageLog: UseLog[];
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

// ─── DATA ─────────────────────────────────────────────────────────────────────

const makeUsage = (base: number): UsagePoint[] =>
  ['T2','T3','T4','T5','T6','T7','CN'].map(day => ({
    day, used: Math.max(0, Math.round(base * (0.5 + Math.random() * 1.0))),
  }));

const makeRevenue = (base: number): RevenuePoint[] =>
  ['T1','T2','T3','T4','T5','T6','T7','T8'].map(week => ({
    week, revenue: Math.max(0, Math.round(base * (0.6 + Math.random() * 0.9))),
  }));

const makeLog = (n: number, saving: number): UseLog[] => {
  const names  = ['Lê Văn Trường','Nguyễn Thị Mai','Trần Hoàng Bách','Phạm Thị Lan','Võ Thị Hương','Bùi Thị Thu','Đặng Văn Hùng','Hoàng Minh Tú'];
  const tiers  = ['Platinum','Gold','Silver','Bronze'];
  const orders = ['#DH-1820','#DH-1930','#DH-2010','#DH-2100','#DH-1750','#DH-2230','#DH-1640','#DH-2310'];
  const chs: ChannelScope[]   = ['web','app','email','pos'];
  const dates  = ['10/10','11/10','12/10','13/10','14/10','15/10','16/10'];
  return Array.from({ length: n }, (_, i) => ({
    id: `LOG-${i+1}`,
    user:    names[i % names.length],
    tier:    tiers[i % tiers.length],
    date:    dates[i % dates.length] + '/2024',
    order:   orders[i % orders.length],
    saving:  Math.round(saving * (0.7 + Math.random() * 0.6)),
    channel: chs[i % chs.length],
  }));
};

const COUPONS: Coupon[] = [
  {
    id:'CPN-001', code:'SUMMER30', name:'Giảm 30% Mùa Hè',
    description:'Voucher giảm 30% áp dụng cho toàn bộ sản phẩm trong mùa hè. Tối đa 200K/đơn.',
    discountType:'percent', status:'active', value:30, maxDiscount:200000,
    minOrder:500000, usageLimit:1000, usageLimitPerUser:1, used:784,
    revenue:392000000, savings:156800000, conversion:28.4,
    startDate:'01/06/2024', endDate:'30/11/2024',
    channelScope:'all', applyScope:'all', applyLabel:'Toàn bộ sản phẩm',
    tierScope:'all', newOnly:false, stackable:false, autoApply:false, requireCode:true,
    tags:['Summer','Hot','Best Seller'], createdBy:'Hoàng Nam',
    usageData: makeUsage(112), revenueData: makeRevenue(55), usageLog: makeLog(8, 200000),
  },
  {
    id:'CPN-002', code:'FREESHIP', name:'Miễn Phí Vận Chuyển',
    description:'Miễn phí ship không giới hạn khoảng cách cho thành viên Gold và Platinum qua App.',
    discountType:'freeship', status:'active', value:0,
    minOrder:300000, usageLimit:99999, usageLimitPerUser:999, used:3421,
    revenue:171050000, savings:68420000, conversion:41.2,
    startDate:'01/10/2024', endDate:'31/12/2024',
    channelScope:'app', applyScope:'all', applyLabel:'Toàn bộ sản phẩm',
    tierScope:'gold', newOnly:false, stackable:true, autoApply:true, requireCode:false,
    tags:['Freeship','Loyalty','Auto'], createdBy:'Minh Châu',
    usageData: makeUsage(488), revenueData: makeRevenue(24), usageLog: makeLog(8, 30000),
  },
  {
    id:'CPN-003', code:'WELCOME150', name:'Chào Mừng Khách Mới',
    description:'Giảm ngay 150.000đ cho đơn hàng đầu tiên của khách mới đăng ký.',
    discountType:'fixed', status:'active', value:150000,
    minOrder:400000, usageLimit:99999, usageLimitPerUser:1, used:1247,
    revenue:373700000, savings:187050000, conversion:19.8,
    startDate:'01/01/2024', endDate:'31/12/2024',
    channelScope:'web', applyScope:'all', applyLabel:'Toàn bộ sản phẩm',
    tierScope:'all', newOnly:true, stackable:false, autoApply:false, requireCode:true,
    tags:['Welcome','New User','Onboarding'], createdBy:'Thanh Bình',
    usageData: makeUsage(178), revenueData: makeRevenue(53), usageLog: makeLog(8, 150000),
  },
  {
    id:'CPN-004', code:'BOGO50', name:'Mua 1 Tặng 1 – Bộ Sưu Tập Thu',
    description:'Mua 1 sản phẩm trong BST Thu Đông, tặng 1 sản phẩm có giá thấp hơn. Áp dụng tối đa 1 lần/đơn.',
    discountType:'bogo', status:'active', value:100,
    minOrder:0, usageLimit:300, usageLimitPerUser:1, used:231,
    revenue:115500000, savings:86625000, conversion:38.5,
    startDate:'01/10/2024', endDate:'31/10/2024',
    channelScope:'all', applyScope:'category', applyLabel:'Bộ Sưu Tập Thu Đông',
    tierScope:'all', newOnly:false, stackable:false, autoApply:false, requireCode:true,
    tags:['BOGO','Fashion','Collection'], createdBy:'Ngọc Lan',
    usageData: makeUsage(33), revenueData: makeRevenue(16), usageLog: makeLog(8, 350000),
  },
  {
    id:'CPN-005', code:'MEGA1111', name:'Siêu Sale 11.11 – Giảm 50%',
    description:'Voucher siêu sale 50% nhân dịp 11.11. Áp dụng tối đa 500K, đơn tối thiểu 1 triệu. Giới hạn 2000 lượt.',
    discountType:'percent', status:'scheduled', value:50, maxDiscount:500000,
    minOrder:1000000, usageLimit:2000, usageLimitPerUser:1, used:0,
    revenue:0, savings:0, conversion:0,
    startDate:'11/11/2024', endDate:'12/11/2024',
    channelScope:'all', applyScope:'all', applyLabel:'Toàn bộ sản phẩm',
    tierScope:'all', newOnly:false, stackable:false, autoApply:false, requireCode:true,
    tags:['11.11','Mega','Upcoming'], createdBy:'Hoàng Nam',
    usageData: makeUsage(0), revenueData: makeRevenue(0), usageLog: [],
  },
  {
    id:'CPN-006', code:'BDAY2024', name:'Quà Sinh Nhật Tự Động',
    description:'Voucher tự động tặng vào ngày sinh nhật, giảm 100K không cần nhập mã. Áp dụng cho mọi hạng thành viên.',
    discountType:'fixed', status:'active', value:100000,
    minOrder:200000, usageLimit:99999, usageLimitPerUser:1, used:892,
    revenue:89200000, savings:89200000, conversion:76.4,
    startDate:'01/01/2024', endDate:'31/12/2024',
    channelScope:'all', applyScope:'all', applyLabel:'Toàn bộ sản phẩm',
    tierScope:'all', newOnly:false, stackable:true, autoApply:true, requireCode:false,
    tags:['Birthday','Auto','CRM'], createdBy:'Minh Châu',
    usageData: makeUsage(3), revenueData: makeRevenue(12), usageLog: makeLog(8, 100000),
  },
  {
    id:'CPN-007', code:'TECH20', name:'Giảm 20% Điện Tử & Công Nghệ',
    description:'Voucher giảm 20% toàn ngành hàng điện tử. Tạm dừng do hết hàng tồn kho.',
    discountType:'percent', status:'paused', value:20,
    minOrder:2000000, usageLimit:500, usageLimitPerUser:1, used:312,
    revenue:156000000, savings:31200000, conversion:22.1,
    startDate:'01/10/2024', endDate:'31/10/2024',
    channelScope:'web', applyScope:'category', applyLabel:'Điện Tử & Công Nghệ',
    tierScope:'gold', newOnly:false, stackable:false, autoApply:false, requireCode:true,
    tags:['Tech','Electronics','Paused'], createdBy:'Tuấn Anh',
    usageData: makeUsage(45), revenueData: makeRevenue(22), usageLog: makeLog(8, 400000),
  },
  {
    id:'CPN-008', code:'PLT500', name:'Đặc Quyền Platinum – 500K',
    description:'Giảm 500K cho thành viên Platinum với đơn từ 5 triệu. Ưu đãi độc quyền, không kết hợp.',
    discountType:'fixed', status:'active', value:500000,
    minOrder:5000000, usageLimit:100, usageLimitPerUser:2, used:67,
    revenue:335000000, savings:33500000, conversion:58.3,
    startDate:'01/10/2024', endDate:'31/12/2024',
    channelScope:'all', applyScope:'all', applyLabel:'Toàn bộ sản phẩm',
    tierScope:'platinum', newOnly:false, stackable:false, autoApply:false, requireCode:true,
    tags:['Platinum','Exclusive','VIP'], createdBy:'Hoàng Nam',
    usageData: makeUsage(10), revenueData: makeRevenue(48), usageLog: makeLog(5, 500000),
  },
  {
    id:'CPN-009', code:'MOMO10', name:'Giảm 10% Ví MoMo',
    description:'Voucher đã kết thúc. Giảm thêm 10% khi thanh toán qua MoMo. Đã dùng hết toàn bộ lượt.',
    discountType:'percent', status:'exhausted', value:10,
    minOrder:200000, usageLimit:5000, usageLimitPerUser:3, used:5000,
    revenue:250000000, savings:25000000, conversion:31.2,
    startDate:'01/09/2024', endDate:'30/09/2024',
    channelScope:'app', applyScope:'all', applyLabel:'Toàn bộ sản phẩm',
    tierScope:'all', newOnly:false, stackable:true, autoApply:false, requireCode:true,
    tags:['MoMo','Payment','Ended'], createdBy:'Ngọc Lan',
    usageData: makeUsage(0), revenueData: makeRevenue(0), usageLog: makeLog(8, 50000),
  },
  {
    id:'CPN-010', code:'GIFT2024', name:'Quà Tặng Kèm Đặc Biệt',
    description:'Tặng kèm sản phẩm ngẫu nhiên khi mua đơn từ 800K. Quà tặng là sản phẩm giá trị 50K–200K.',
    discountType:'gift', status:'active', value:0,
    minOrder:800000, usageLimit:200, usageLimitPerUser:1, used:143,
    revenue:114400000, savings:28600000, conversion:44.7,
    startDate:'15/10/2024', endDate:'31/10/2024',
    channelScope:'all', applyScope:'all', applyLabel:'Toàn bộ sản phẩm',
    tierScope:'all', newOnly:false, stackable:true, autoApply:false, requireCode:true,
    tags:['Gift','Bundle','Event'], createdBy:'Thanh Bình',
    usageData: makeUsage(20), revenueData: makeRevenue(16), usageLog: makeLog(8, 100000),
  },
  {
    id:'CPN-011', code:'BF40', name:'Black Friday – Giảm 40%',
    description:'Bản nháp voucher Black Friday. Đang chờ phê duyệt nội dung và ngân sách marketing.',
    discountType:'percent', status:'draft', value:40, maxDiscount:400000,
    minOrder:800000, usageLimit:3000, usageLimitPerUser:1, used:0,
    revenue:0, savings:0, conversion:0,
    startDate:'29/11/2024', endDate:'30/11/2024',
    channelScope:'all', applyScope:'all', applyLabel:'Toàn bộ sản phẩm',
    tierScope:'all', newOnly:false, stackable:false, autoApply:false, requireCode:true,
    tags:['Black Friday','Draft'], createdBy:'Minh Châu',
    usageData: makeUsage(0), revenueData: makeRevenue(0), usageLog: [],
  },
  {
    id:'CPN-012', code:'SHIP2023', name:'Miễn Ship Cuối Năm 2023',
    description:'Voucher đã hết hạn từ năm ngoái. Miễn phí ship toàn quốc không giới hạn.',
    discountType:'freeship', status:'expired', value:0,
    minOrder:0, usageLimit:9999, usageLimitPerUser:999, used:7841,
    revenue:392050000, savings:156820000, conversion:52.4,
    startDate:'01/12/2023', endDate:'31/12/2023',
    channelScope:'all', applyScope:'all', applyLabel:'Toàn bộ sản phẩm',
    tierScope:'all', newOnly:false, stackable:true, autoApply:true, requireCode:false,
    tags:['Freeship','2023','Expired'], createdBy:'Tuấn Anh',
    usageData: makeUsage(0), revenueData: makeRevenue(0), usageLog: makeLog(8, 35000),
  },
];

// ─── CONFIG ───────────────────────────────────────────────────────────────────

const typeConfig: Record<DiscountType, { bg: string; text: string; border: string; icon: React.ReactNode; label: string; color: string }> = {
  percent:  { bg:'bg-red-50',    text:'text-red-600',    border:'border-red-200',   icon:<Percent size={12}/>,    label:'Giảm %',       color:'#E40F2A' },
  fixed:    { bg:'bg-blue-50',   text:'text-blue-700',   border:'border-blue-200',  icon:<DollarSign size={12}/>, label:'Giảm tiền',    color:'#3b82f6' },
  freeship: { bg:'bg-green-50',  text:'text-green-700',  border:'border-green-200', icon:<Package size={12}/>,    label:'Free ship',    color:'#22c55e' },
  gift:     { bg:'bg-violet-50', text:'text-violet-700', border:'border-violet-200',icon:<Gift size={12}/>,       label:'Tặng quà',     color:'#7c3aed' },
  bogo:     { bg:'bg-amber-50',  text:'text-amber-700',  border:'border-amber-200', icon:<Layers size={12}/>,     label:'Mua 1 tặng 1', color:'#f59e0b' },
};

const statusConfig: Record<CouponStatus, { bg: string; text: string; border: string; dot: string; label: string; pulse?: boolean }> = {
  active:    { bg:'bg-green-50',  text:'text-green-700',  border:'border-green-200',  dot:'bg-green-500',  label:'Đang chạy',    pulse:true  },
  scheduled: { bg:'bg-blue-50',   text:'text-blue-700',   border:'border-blue-200',   dot:'bg-blue-500',   label:'Sắp diễn ra'              },
  expired:   { bg:'bg-slate-100', text:'text-slate-500',  border:'border-slate-200',  dot:'bg-slate-400',  label:'Hết hạn'                  },
  draft:     { bg:'bg-amber-50',  text:'text-amber-700',  border:'border-amber-200',  dot:'bg-amber-500',  label:'Bản nháp'                 },
  paused:    { bg:'bg-orange-50', text:'text-orange-700', border:'border-orange-200', dot:'bg-orange-500', label:'Tạm dừng'                 },
  exhausted: { bg:'bg-red-50',    text:'text-red-600',    border:'border-red-200',    dot:'bg-red-500',    label:'Hết lượt'                 },
};

const channelLabel: Record<ChannelScope, string> = { all:'Tất cả', web:'Web', app:'App', pos:'POS', email:'Email' };
const channelIcon:  Record<ChannelScope, React.ReactNode> = {
  all:   <Globe size={11}/>,
  web:   <Globe size={11}/>,
  app:   <Smartphone size={11}/>,
  pos:   <ShoppingBag size={11}/>,
  email: <Mail size={11}/>,
};

const tierLabel: Record<TierScope, string> = { all:'Tất cả', bronze:'Bronze', silver:'Silver', gold:'Gold+', platinum:'Platinum' };

const tierColor: Record<string, string> = {
  Platinum:'bg-slate-900 text-slate-100 border-slate-700',
  Gold:    'bg-amber-50 text-amber-700 border-amber-200',
  Silver:  'bg-slate-100 text-slate-600 border-slate-300',
  Bronze:  'bg-orange-50 text-orange-700 border-orange-200',
};

// ─── UTILS ────────────────────────────────────────────────────────────────────

const fmt = (n: number): string => {
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1)}B`;
  if (n >= 1_000_000)     return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000)         return `${(n / 1_000).toFixed(0)}K`;
  return n.toLocaleString();
};

const usagePct = (c: Coupon): number =>
  c.usageLimit >= 99999 ? -1 : Math.min(100, Math.round((c.used / c.usageLimit) * 100));

const valueLabel = (c: Coupon): string => {
  if (c.discountType === 'percent')  return `${c.value}%`;
  if (c.discountType === 'fixed')    return `${fmt(c.value)}₫`;
  if (c.discountType === 'freeship') return 'Free';
  if (c.discountType === 'gift')     return 'Gift';
  if (c.discountType === 'bogo')     return '1+1';
  return '';
};

const daysLeft = (endDate: string): number => {
  const [d, m, y] = endDate.split('/').map(Number);
  const end  = new Date(y, m - 1, d);
  const now  = new Date();
  return Math.ceil((end.getTime() - now.getTime()) / 86400000);
};

// ─── COPY BUTTON ──────────────────────────────────────────────────────────────

const CopyCode: React.FC<{ code: string; size?: 'sm' | 'md' }> = ({ code, size = 'sm' }) => {
  const [copied, setCopied] = useState(false);
  const handle = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(code).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <button onClick={handle}
      className={`inline-flex items-center gap-1.5 rounded-lg border font-black font-mono transition-all ${size === 'md' ? 'px-3 py-1.5 text-xs' : 'px-2 py-1 text-[11px]'} ${
        copied
          ? 'bg-green-50 text-green-700 border-green-200'
          : 'bg-secondary text-foreground border-border hover:border-primary/50 hover:text-primary'
      }`}>
      {copied ? <Check size={10}/> : <Copy size={10}/>} {code}
    </button>
  );
};

// ─── SPARKLINE ────────────────────────────────────────────────────────────────

const Sparkline: React.FC<{ data: UsagePoint[] }> = ({ data }) => (
  <ResponsiveContainer width="100%" height={32}>
    <AreaChart data={data} margin={{ top:2, right:0, bottom:0, left:0 }}>
      <defs>
        <linearGradient id="spkG" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#E40F2A" stopOpacity={0.2}/>
          <stop offset="100%" stopColor="#E40F2A" stopOpacity={0}/>
        </linearGradient>
      </defs>
      <Area type="monotone" dataKey="used" stroke="#E40F2A" strokeWidth={1.5} fill="url(#spkG)" dot={false}/>
    </AreaChart>
  </ResponsiveContainer>
);

// ─── USAGE BAR ────────────────────────────────────────────────────────────────

interface UsageBarProps { coupon: Coupon; showLabel?: boolean }
const UsageBar: React.FC<UsageBarProps> = ({ coupon, showLabel = true }) => {
  const pct = usagePct(coupon);
  if (pct < 0) return (
    <div className="flex items-center gap-1.5">
      <Infinity size={12} className="text-muted-foreground"/>
      <span className="text-[10px] text-muted-foreground font-medium">Không giới hạn</span>
    </div>
  );
  const barColor = pct >= 90 ? 'bg-red-500' : pct >= 70 ? 'bg-amber-500' : 'bg-primary';
  return (
    <div className="space-y-1 w-full">
      {showLabel && (
        <div className="flex justify-between text-[10px]">
          <span className="text-muted-foreground">{coupon.used.toLocaleString()} / {coupon.usageLimit >= 99999 ? '∞' : coupon.usageLimit.toLocaleString()}</span>
          <span className={`font-black ${pct >= 90 ? 'text-red-500' : 'text-foreground'}`}>{pct}%{pct >= 90 ? ' ⚠' : ''}</span>
        </div>
      )}
      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all ${barColor}`} style={{ width:`${pct}%` }}/>
      </div>
    </div>
  );
};

// ─── STAT CARD ────────────────────────────────────────────────────────────────

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

// ─── DETAIL PANEL ─────────────────────────────────────────────────────────────

interface DetailPanelProps { coupon: Coupon; onClose: () => void }
const DetailPanel: React.FC<DetailPanelProps> = ({ coupon, onClose }) => {
  const [tab, setTab] = useState<PanelTab>('overview');
  const type   = typeConfig[coupon.discountType];
  const status = statusConfig[coupon.status];
  const pct    = usagePct(coupon);
  const days   = daysLeft(coupon.endDate);
  const tabs: { key: PanelTab; label: string }[] = [
    { key:'overview',   label:'Tổng quan'   },
    { key:'usage',      label:'Lượt dùng'   },
    { key:'conditions', label:'Điều kiện'   },
    { key:'history',    label:'Lịch sử'     },
  ];

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-foreground/20 backdrop-blur-sm" onClick={onClose}/>
      <div className="relative w-full max-w-xl bg-card border-l border-border flex flex-col h-full shadow-2xl">

        {/* Banner */}
        <div className="bg-primary px-6 pt-5 pb-0 relative overflow-hidden flex-shrink-0">
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="absolute -right-8 -top-8 w-48 h-48 rounded-full bg-white"/>
            <div className="absolute right-8 -bottom-12 w-72 h-72 rounded-full bg-white"/>
          </div>
          <div className="relative z-10">
            {/* Top badges + close */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-black bg-white/20 text-white border border-white/30 px-2 py-0.5 rounded-full">{coupon.id}</span>
                <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${type.bg} ${type.text} ${type.border}`}>{type.label}</span>
                <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${status.bg} ${status.text} ${status.border}`}>{status.label}</span>
              </div>
              <button onClick={onClose} className="p-1.5 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-all flex-shrink-0"><X size={14}/></button>
            </div>

            <h2 className="text-xl font-black text-white leading-tight mb-1">{coupon.name}</h2>
            <p className="text-white/70 text-sm mb-3">{coupon.description}</p>

            {/* Code + value */}
            <div className="flex items-center gap-3 mb-4 flex-wrap">
              <div className="bg-white/15 border border-white/25 rounded-xl px-4 py-2 text-center">
                <div className="text-2xl font-black text-white font-mono">{coupon.code}</div>
                <div className="text-[10px] text-white/60">Mã coupon</div>
              </div>
              <div className="bg-white/15 border border-white/25 rounded-xl px-4 py-2 text-center min-w-[60px]">
                <div className="text-2xl font-black text-white">{valueLabel(coupon)}</div>
                <div className="text-[10px] text-white/60">Giá trị</div>
              </div>
              <div className="bg-white/15 border border-white/25 rounded-xl px-4 py-2 text-center min-w-[60px]">
                <div className="text-2xl font-black text-white">{fmt(coupon.used)}</div>
                <div className="text-[10px] text-white/60">Lượt dùng</div>
              </div>
              {days > 0 && days < 30 && (
                <div className={`bg-white/15 border border-white/25 rounded-xl px-4 py-2 text-center ${days <= 7 ? 'bg-red-500/30 border-red-300/40' : ''}`}>
                  <div className="text-2xl font-black text-white">{days}</div>
                  <div className="text-[10px] text-white/60">Ngày còn lại</div>
                </div>
              )}
            </div>
          </div>

          {/* Sub-tabs */}
          <div className="flex items-center gap-1 border-t border-white/20 pt-0.5">
            {tabs.map(t => (
              <button key={t.key} onClick={() => setTab(t.key)}
                className={`pb-2.5 pt-2 px-2 text-[11px] font-black transition-all ${tab === t.key ? 'text-white border-b-2 border-white' : 'text-white/50 hover:text-white/80'}`}>
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto">

          {/* OVERVIEW */}
          {tab === 'overview' && (
            <div className="px-6 py-5 space-y-5">

              {/* KPI strip */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label:'Doanh thu',    value:`${fmt(coupon.revenue)}₫`  },
                  { label:'Tiết kiệm',   value:`${fmt(coupon.savings)}₫`  },
                  { label:'Tỷ lệ dùng', value:`${coupon.conversion}%`     },
                ].map(k => (
                  <div key={k.label} className="bg-secondary border border-border rounded-xl p-3 text-center">
                    <div className="text-sm font-black text-foreground">{k.value}</div>
                    <div className="text-[10px] text-muted-foreground mt-0.5">{k.label}</div>
                  </div>
                ))}
              </div>

              {/* Usage bar */}
              {pct >= 0 && (
                <div className="bg-secondary border border-border rounded-2xl p-4 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-black text-foreground">Lượt sử dụng</span>
                    <span className="text-sm font-black text-foreground">{coupon.used.toLocaleString()} / {coupon.usageLimit.toLocaleString()}</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${pct >= 90 ? 'bg-red-500' : pct >= 70 ? 'bg-amber-500' : 'bg-primary'}`} style={{ width:`${pct}%` }}/>
                  </div>
                  <div className={`text-[11px] font-bold ${pct >= 90 ? 'text-red-500' : 'text-muted-foreground'}`}>
                    {pct}% đã sử dụng{pct >= 90 ? ' — Sắp hết lượt!' : ''}
                  </div>
                </div>
              )}

              {/* 7-day sparkline */}
              <div className="bg-secondary border border-border rounded-2xl p-4">
                <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-3">Lượt dùng 7 ngày gần nhất</div>
                <Sparkline data={coupon.usageData}/>
              </div>

              {/* Meta */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label:'Ngày bắt đầu',      value:coupon.startDate,                icon:<Calendar size={12}/>    },
                  { label:'Ngày kết thúc',      value:coupon.endDate,                  icon:<Calendar size={12}/>    },
                  { label:'Kênh',               value:channelLabel[coupon.channelScope],icon:<Globe size={12}/>       },
                  { label:'Áp dụng cho',        value:coupon.applyLabel,               icon:<Tag size={12}/>         },
                  { label:'Tạo bởi',            value:coupon.createdBy,                icon:<Users size={12}/>       },
                  { label:'Giới hạn/người',     value:`${coupon.usageLimitPerUser} lượt/KH`, icon:<UserCheck size={12}/> },
                ].map(item => (
                  <div key={item.label} className="bg-secondary border border-border rounded-xl p-3 flex items-start gap-2">
                    <div className="text-primary mt-0.5 flex-shrink-0">{item.icon}</div>
                    <div className="min-w-0">
                      <div className="text-[10px] text-muted-foreground">{item.label}</div>
                      <div className="text-xs font-bold text-foreground mt-0.5 truncate">{item.value}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Feature flags */}
              <div className="flex flex-wrap gap-2">
                {coupon.autoApply   && <span className="text-[10px] px-2.5 py-1 bg-green-50 border border-green-200 text-green-700 rounded-full font-bold flex items-center gap-1"><Zap size={9}/> Tự động áp dụng</span>}
                {!coupon.requireCode && <span className="text-[10px] px-2.5 py-1 bg-blue-50 border border-blue-200 text-blue-700 rounded-full font-bold flex items-center gap-1"><Unlock size={9}/> Không cần mã</span>}
                {coupon.requireCode  && <span className="text-[10px] px-2.5 py-1 bg-secondary border border-border text-muted-foreground rounded-full font-bold flex items-center gap-1"><Lock size={9}/> Yêu cầu mã</span>}
                {coupon.stackable    && <span className="text-[10px] px-2.5 py-1 bg-violet-50 border border-violet-200 text-violet-700 rounded-full font-bold flex items-center gap-1"><LayersIcon size={9}/> Kết hợp được</span>}
                {coupon.newOnly      && <span className="text-[10px] px-2.5 py-1 bg-amber-50 border border-amber-200 text-amber-700 rounded-full font-bold flex items-center gap-1"><Sparkles size={9}/> Khách mới</span>}
                {coupon.tierScope !== 'all' && <span className="text-[10px] px-2.5 py-1 bg-slate-100 border border-slate-300 text-slate-700 rounded-full font-bold flex items-center gap-1"><Award size={9}/> {tierLabel[coupon.tierScope]}</span>}
              </div>

              {/* Tags */}
              {coupon.tags.length > 0 && (
                <div>
                  <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-2">Tags</div>
                  <div className="flex flex-wrap gap-1.5">
                    {coupon.tags.map(t => <span key={t} className="text-[10px] px-2.5 py-1 bg-secondary border border-border rounded-full text-muted-foreground">{t}</span>)}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* USAGE */}
          {tab === 'usage' && (
            <div className="px-6 py-5 space-y-5">
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label:'Tổng lượt dùng',  value:coupon.used.toLocaleString()     },
                  { label:'Tỷ lệ chuyển đổi',value:`${coupon.conversion}%`          },
                  { label:'Tổng tiết kiệm',  value:`${fmt(coupon.savings)}₫`        },
                  { label:'Doanh thu phát sinh',value:`${fmt(coupon.revenue)}₫`     },
                ].map(k => (
                  <div key={k.label} className="bg-secondary border border-border rounded-xl p-4 text-center">
                    <div className="text-xl font-black text-foreground">{k.value}</div>
                    <div className="text-[10px] text-muted-foreground mt-0.5">{k.label}</div>
                  </div>
                ))}
              </div>

              {/* Revenue weekly */}
              <div className="bg-secondary border border-border rounded-2xl p-4">
                <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-3">Doanh thu theo tuần (triệu ₫)</div>
                <ResponsiveContainer width="100%" height={110}>
                  <BarChart data={coupon.revenueData} barSize={18}>
                    <XAxis dataKey="week" tick={{ fontSize:10, fill:'var(--muted-foreground)' }} axisLine={false} tickLine={false}/>
                    <RTooltip contentStyle={{ background:'var(--card)', border:'1px solid var(--border)', borderRadius:'10px', fontSize:'11px', color:'var(--foreground)' }}/>
                    <Bar dataKey="revenue" radius={[4,4,0,0]}>
                      {coupon.revenueData.map((_, i) => <Cell key={i} fill={i === coupon.revenueData.length - 1 ? '#E40F2A' : 'var(--muted)'}/>)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Daily trend */}
              <div className="bg-secondary border border-border rounded-2xl p-4">
                <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-3">Xu hướng lượt dùng 7 ngày</div>
                <Sparkline data={coupon.usageData}/>
                <div className="flex justify-between mt-2 text-[10px] text-muted-foreground">
                  {coupon.usageData.map(d => <span key={d.day}>{d.day}</span>)}
                </div>
              </div>

              {/* Channel breakdown */}
              <div className="bg-secondary border border-border rounded-2xl p-4">
                <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-3">Phân bổ theo kênh</div>
                <div className="space-y-2">
                  {(['web','app','email','pos'] as ChannelScope[]).map((ch, i) => {
                    const pcts = [42, 31, 19, 8];
                    return (
                      <div key={ch} className="flex items-center gap-2.5">
                        <span className="text-[10px] text-muted-foreground flex items-center gap-1 w-14">{channelIcon[ch]} {channelLabel[ch]}</span>
                        <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-primary rounded-full" style={{ width:`${pcts[i]}%` }}/>
                        </div>
                        <span className="text-[10px] font-black text-foreground w-8 text-right">{pcts[i]}%</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* CONDITIONS */}
          {tab === 'conditions' && (
            <div className="px-6 py-5 space-y-4">
              <div className="space-y-3">
                {[
                  { label:'Loại giảm giá',     value:`${type.label} — ${valueLabel(coupon)}`,     icon:type.icon,           ok:true  },
                  { label:'Đơn tối thiểu',     value:coupon.minOrder > 0 ? `${fmt(coupon.minOrder)}₫` : 'Không yêu cầu',    icon:<ShoppingBag size={14}/>,  ok:true  },
                  { label:'Giảm tối đa',       value:coupon.maxDiscount  ? `${fmt(coupon.maxDiscount)}₫` : 'Không giới hạn', icon:<DollarSign size={14}/>,   ok:true  },
                  { label:'Giới hạn lượt/KH', value:`${coupon.usageLimitPerUser} lượt / khách hàng`,                         icon:<UserCheck size={14}/>,     ok:true  },
                  { label:'Hạng áp dụng',      value:tierLabel[coupon.tierScope],                                             icon:<Award size={14}/>,         ok:true  },
                  { label:'Kênh áp dụng',      value:channelLabel[coupon.channelScope],                                       icon:<Globe size={14}/>,         ok:true  },
                  { label:'Áp dụng cho',       value:coupon.applyLabel,                                                       icon:<Tag size={14}/>,           ok:true  },
                  { label:'Yêu cầu mã',        value:coupon.requireCode ? 'Có — khách phải nhập mã' : 'Không — tự động',     icon:<Lock size={14}/>,          ok:true  },
                  { label:'Kết hợp KM khác',   value:coupon.stackable ? 'Cho phép kết hợp' : 'Không cho phép',               icon:<LayersIcon size={14}/>,    ok:coupon.stackable  },
                  { label:'Chỉ khách mới',     value:coupon.newOnly ? 'Chỉ khách đăng ký lần đầu' : 'Tất cả khách hàng',    icon:<Sparkles size={14}/>,      ok:true  },
                  { label:'Tự động áp dụng',   value:coupon.autoApply ? 'Tự động — không cần nhập' : 'Thủ công',             icon:<Zap size={14}/>,           ok:true  },
                ].map(item => (
                  <div key={item.label} className="flex items-center gap-3 bg-secondary border border-border rounded-xl px-4 py-3">
                    <div className="text-primary flex-shrink-0">{item.icon}</div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[10px] text-muted-foreground">{item.label}</div>
                      <div className="text-xs font-bold text-foreground mt-0.5">{item.value}</div>
                    </div>
                    <CheckCircle2 size={14} className="text-green-500 flex-shrink-0"/>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* HISTORY */}
          {tab === 'history' && (
            <div className="px-6 py-5 space-y-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-black text-muted-foreground uppercase tracking-widest">Gần đây nhất</span>
                <span className="text-[10px] text-primary font-bold cursor-pointer">Xem tất cả →</span>
              </div>
              {coupon.usageLog.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <FileText size={28} className="mx-auto mb-3 opacity-40"/>
                  <p className="font-bold text-foreground">Chưa có lượt sử dụng</p>
                </div>
              ) : coupon.usageLog.map(log => (
                <div key={log.id} className="flex items-center gap-3 bg-secondary border border-border rounded-xl p-3 hover:border-primary/30 transition-all">
                  <div className="h-9 w-9 bg-primary/10 text-primary rounded-xl flex items-center justify-center text-xs font-black flex-shrink-0">
                    {log.user.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-xs font-bold text-foreground">{log.user}</span>
                      <span className={`text-[9px] font-black px-1.5 py-0.5 rounded border ${tierColor[log.tier] ?? 'bg-secondary text-muted-foreground border-border'}`}>{log.tier}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] text-muted-foreground">{log.order}</span>
                      <span className="text-muted-foreground">·</span>
                      <span className="text-[10px] text-muted-foreground flex items-center gap-0.5">{channelIcon[log.channel]} {channelLabel[log.channel]}</span>
                      <span className="text-muted-foreground">·</span>
                      <span className="text-[10px] text-muted-foreground">{log.date}</span>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-xs font-black text-green-600">-{fmt(log.saving)}₫</div>
                    <div className="text-[10px] text-muted-foreground">tiết kiệm</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 p-4 border-t border-border flex gap-2 bg-card">
          <button className="flex-1 py-3 bg-primary hover:bg-primary-light text-white font-black rounded-xl text-sm transition-all flex items-center justify-center gap-2 shadow shadow-primary/25">
            <Edit size={14}/> Chỉnh sửa
          </button>
          {coupon.status === 'active' && (
            <button className="py-3 px-4 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-xl text-sm font-bold border border-amber-200 flex items-center gap-2">
              <Timer size={14}/> Tạm dừng
            </button>
          )}
          {coupon.status === 'paused' && (
            <button className="py-3 px-4 bg-green-50 hover:bg-green-100 text-green-700 rounded-xl text-sm font-bold border border-green-200 flex items-center gap-2">
              <Zap size={14}/> Kích hoạt
            </button>
          )}
          {coupon.status === 'draft' && (
            <button className="py-3 px-4 bg-green-50 hover:bg-green-100 text-green-700 rounded-xl text-sm font-bold border border-green-200 flex items-center gap-2">
              <Send size={14}/> Kích hoạt
            </button>
          )}
          <button className="py-3 px-3 bg-red-50 hover:bg-red-100 text-red-500 rounded-xl border border-red-100">
            <Trash2 size={15}/>
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── GRID CARD ────────────────────────────────────────────────────────────────

interface GridCardProps { coupon: Coupon; onClick: () => void }
const GridCard: React.FC<GridCardProps> = ({ coupon, onClick }) => {
  const type   = typeConfig[coupon.discountType];
  const status = statusConfig[coupon.status];
  const pct    = usagePct(coupon);
  const days   = daysLeft(coupon.endDate);

  return (
    <div onClick={onClick} className="bg-card border border-border rounded-2xl p-5 hover:border-primary/40 hover:shadow-md transition-all cursor-pointer group space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-1.5 min-w-0 flex-1">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className={`inline-flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-lg border ${type.bg} ${type.text} ${type.border}`}>{type.icon}{type.label}</span>
            <span className={`inline-flex items-center gap-1.5 text-[10px] font-black px-2 py-0.5 rounded-lg border ${status.bg} ${status.text} ${status.border}`}>
              <span className={`h-1.5 w-1.5 rounded-full ${status.dot} ${status.pulse ? 'animate-pulse' : ''}`}/>{status.label}
            </span>
          </div>
          <p className="text-sm font-black text-foreground group-hover:text-primary transition-colors leading-tight">{coupon.name}</p>
        </div>
        <div className="text-2xl font-black text-primary flex-shrink-0 ml-2">{valueLabel(coupon)}</div>
      </div>

      {/* Code */}
      <CopyCode code={coupon.code} size="md"/>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 text-center">
        {[
          { label:'Lượt dùng',  value:fmt(coupon.used)              },
          { label:'Doanh thu',  value:`${fmt(coupon.revenue)}₫`     },
          { label:'Tỷ lệ',     value:`${coupon.conversion}%`       },
        ].map(s => (
          <div key={s.label} className="bg-secondary rounded-xl p-2 border border-border">
            <div className="text-xs font-black text-foreground">{s.value}</div>
            <div className="text-[9px] text-muted-foreground">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Sparkline */}
      <Sparkline data={coupon.usageData}/>

      {/* Usage bar */}
      <UsageBar coupon={coupon}/>

      {/* Footer */}
      <div className="flex items-center justify-between text-[10px] text-muted-foreground border-t border-border pt-2 flex-wrap gap-1">
        <span className="flex items-center gap-1">{channelIcon[coupon.channelScope]} {channelLabel[coupon.channelScope]}</span>
        <span className="flex items-center gap-1"><Calendar size={9}/> →{coupon.endDate}</span>
        {days > 0 && days <= 7 && <span className="flex items-center gap-1 text-red-500 font-bold"><Flame size={9}/>{days}d</span>}
        {coupon.autoApply  && <span className="flex items-center gap-1 text-violet-600 font-bold"><Zap size={9}/> Auto</span>}
        {coupon.stackable  && <span className="flex items-center gap-1 text-blue-600 font-bold"><LayersIcon size={9}/> Stack</span>}
      </div>
    </div>
  );
};

// ─── MAIN ─────────────────────────────────────────────────────────────────────

export default function CouponManagement() {
  const [search, setSearch]           = useState('');
  const [activeTab, setActiveTab]     = useState<ActiveTab>('all');
  const [filterType, setFilterType]   = useState<string>('all');
  const [filterChan, setFilterChan]   = useState<string>('all');
  const [sortCol, setSortCol]         = useState<SortCol>('used');
  const [sortDir, setSortDir]         = useState<SortDir>('desc');
  const [selected, setSelected]       = useState<string[]>([]);
  const [detail, setDetail]           = useState<Coupon | null>(null);
  const [viewMode, setViewMode]       = useState<ViewMode>('table');

  const filtered = useMemo<Coupon[]>(() => {
    return COUPONS.filter(c => {
      const q        = search.toLowerCase();
      const matchQ   = c.name.toLowerCase().includes(q) || c.code.toLowerCase().includes(q) || c.tags.some(t => t.toLowerCase().includes(q));
      const matchTab = activeTab === 'all' || c.status === activeTab;
      const matchTyp = filterType === 'all' || c.discountType === filterType;
      const matchCh  = filterChan === 'all' || c.channelScope === filterChan;
      return matchQ && matchTab && matchTyp && matchCh;
    }).sort((a, b) => {
      const d = sortDir === 'asc' ? 1 : -1;
      if (sortCol === 'revenue')    return (a.revenue    - b.revenue)    * d;
      if (sortCol === 'conversion') return (a.conversion - b.conversion) * d;
      if (sortCol === 'used')       return (a.used       - b.used)       * d;
      return 0;
    });
  }, [search, activeTab, filterType, filterChan, sortCol, sortDir]);

  const toggleSelect = (id: string) => setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);
  const toggleAll    = () => setSelected(selected.length === filtered.length ? [] : filtered.map(c => c.id));

  const tabCount = (tab: ActiveTab): number =>
    tab === 'all' ? COUPONS.length : COUPONS.filter(c => c.status === tab).length;

  const handleSort = (col: SortCol) => {
    if (sortCol === col) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortCol(col); setSortDir('desc'); }
  };

  const SortIcon: React.FC<{ col: SortCol }> = ({ col }) =>
    sortCol === col
      ? (sortDir === 'desc' ? <ChevronDown size={11} className="text-primary"/> : <ChevronUp size={11} className="text-primary"/>)
      : <ChevronDown size={11} className="text-muted-foreground/40"/>;

  // Aggregates
  const totalUsed     = COUPONS.reduce((s, c) => s + c.used, 0);
  const totalRevenue  = COUPONS.reduce((s, c) => s + c.revenue, 0);
  const totalSavings  = COUPONS.reduce((s, c) => s + c.savings, 0);
  const avgConv       = +(COUPONS.filter(c => c.conversion > 0).reduce((s, c) => s + c.conversion, 0) / Math.max(1, COUPONS.filter(c => c.conversion > 0).length)).toFixed(1);
  const expiringSoon  = COUPONS.filter(c => { const d = daysLeft(c.endDate); return d > 0 && d <= 7 && c.status === 'active'; }).length;
  const nearExhausted = COUPONS.filter(c => { const p = usagePct(c); return p >= 0 && p >= 80 && c.status === 'active'; }).length;

  // Weekly agg for chart
  const weeklyData = ['T1','T2','T3','T4','T5','T6','T7','T8'].map(week => ({
    week,
    revenue: Math.round(COUPONS.reduce((s, c) => {
      const pt = c.revenueData.find(r => r.week === week);
      return s + (pt?.revenue ?? 0);
    }, 0)),
  }));

  return (
    <div className="min-h-screen bg-background text-foreground">
      {detail && <DetailPanel coupon={detail} onClose={() => setDetail(null)}/>}

      {/* Nav */}
      <div className="border-b border-border bg-card px-6 py-3 flex items-center justify-between sticky top-0 z-40 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="h-7 w-7 bg-primary rounded-lg flex items-center justify-center shadow-md shadow-primary/30">
            <Ticket size={13} className="text-white"/>
          </div>
          <span className="font-black text-foreground text-sm tracking-tight">CRM Pro</span>
          <span className="text-muted-foreground mx-1 text-sm">›</span>
          <span className="text-muted-foreground text-sm">Quản lý Coupons</span>
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

        {/* Page header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-foreground">Coupons</h1>
            <p className="text-muted-foreground text-sm mt-1">Tạo, quản lý và theo dõi hiệu suất toàn bộ mã giảm giá</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-4 py-2.5 bg-secondary hover:bg-muted border border-border rounded-xl text-sm font-bold text-foreground flex items-center gap-2 transition-all">
              <Download size={14}/> Xuất báo cáo
            </button>
            <button className="px-4 py-2.5 bg-primary hover:bg-primary-light rounded-xl text-sm font-black text-white flex items-center gap-2 transition-all shadow-lg shadow-primary/25">
              <Plus size={14}/> Tạo coupon
            </button>
          </div>
        </div>

        {/* Alert bar nếu có coupon sắp hết / sắp expire */}
        {(expiringSoon > 0 || nearExhausted > 0) && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl px-5 py-3.5 flex items-center gap-3">
            <AlertCircle size={15} className="text-amber-600 flex-shrink-0"/>
            <div className="flex items-center gap-4 flex-wrap">
              {expiringSoon  > 0 && <span className="text-sm text-amber-700"><strong>{expiringSoon} coupon</strong> sắp hết hạn trong 7 ngày</span>}
              {nearExhausted > 0 && <span className="text-sm text-amber-700"><strong>{nearExhausted} coupon</strong> đã dùng hơn 80% lượt</span>}
            </div>
            <button className="ml-auto text-amber-600 hover:text-amber-800 text-[11px] font-black uppercase tracking-widest flex-shrink-0">Xem ngay →</button>
          </div>
        )}

        {/* KPI row */}
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
          <StatCard highlight icon={<Ticket size={15} className="text-white"/>}     label="Tổng coupons"         value={String(COUPONS.length)}     trend="+2"     trendUp  sub={`${COUPONS.filter(c=>c.status==='active').length} đang hoạt động`}/>
          <StatCard icon={<Activity size={15}/>}    label="Tổng lượt dùng"          value={fmt(totalUsed)}        trend="+15.3%" trendUp  sub="Tích lũy tất cả"/>
          <StatCard icon={<DollarSign size={15}/>}  label="Doanh thu phát sinh"     value={`${fmt(totalRevenue)}₫`} trend="+22.4%" trendUp  sub="Từ coupon"/>
          <StatCard icon={<Percent size={15}/>}     label="Tổng tiết kiệm cho KH"   value={`${fmt(totalSavings)}₫`} trend="+18.1%" trendUp  sub="Giá trị ưu đãi"/>
          <StatCard icon={<Target size={15}/>}      label="Tỷ lệ chuyển đổi TB"    value={`${avgConv}%`}          trend="+3.2%"  trendUp  sub="Trung bình"/>
          <StatCard icon={<AlertCircle size={15}/>} label="Cần chú ý"              value={String(expiringSoon + nearExhausted)} trend={String(expiringSoon + nearExhausted)} trendUp={false} sub="Sắp hết hạn / lượt"/>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Revenue area */}
          <div className="lg:col-span-2 bg-card border border-border rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-sm font-black text-foreground">Doanh thu từ coupons</div>
                <div className="text-[11px] text-muted-foreground mt-0.5">Tổng hợp theo tuần (triệu ₫)</div>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={weeklyData}>
                <defs>
                  <linearGradient id="cpnRevG" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#E40F2A" stopOpacity={0.15}/>
                    <stop offset="100%" stopColor="#E40F2A" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false}/>
                <XAxis dataKey="week" tick={{ fontSize:10, fill:'var(--muted-foreground)' }} axisLine={false} tickLine={false}/>
                <YAxis tick={{ fontSize:10, fill:'var(--muted-foreground)' }} axisLine={false} tickLine={false}/>
                <RTooltip contentStyle={{ background:'var(--card)', border:'1px solid var(--border)', borderRadius:'12px', fontSize:'12px', color:'var(--foreground)' }}/>
                <Area type="monotone" dataKey="revenue" stroke="#E40F2A" strokeWidth={2.5} fill="url(#cpnRevG)"/>
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Right column */}
          <div className="space-y-4">
            {/* Type breakdown */}
            <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
              <div className="text-sm font-black text-foreground mb-4">Phân bổ loại coupon</div>
              <div className="space-y-2.5">
                {Object.entries(typeConfig).map(([key, cfg]) => {
                  const count = COUPONS.filter(c => c.discountType === key).length;
                  if (!count) return null;
                  return (
                    <div key={key} className="flex items-center gap-2.5">
                      <div className={`p-1.5 rounded-lg ${cfg.bg} ${cfg.text} flex-shrink-0`}>{cfg.icon}</div>
                      <div className="flex-1">
                        <div className="flex justify-between mb-0.5">
                          <span className="text-[11px] font-bold text-foreground">{cfg.label}</span>
                          <span className="text-[11px] font-black text-foreground">{count}</span>
                        </div>
                        <div className="h-1 bg-muted rounded-full overflow-hidden">
                          <div className="h-full rounded-full" style={{ width:`${(count / COUPONS.length) * 100}%`, background:cfg.color }}/>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Near-expired / near-exhausted alerts */}
            <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <Flame size={14} className="text-primary"/>
                <span className="text-sm font-black text-foreground">Cần chú ý</span>
              </div>
              <div className="space-y-2">
                {COUPONS.filter(c => {
                  const d = daysLeft(c.endDate);
                  const p = usagePct(c);
                  return c.status === 'active' && ((d > 0 && d <= 7) || (p >= 0 && p >= 80));
                }).slice(0, 4).map(c => {
                  const d = daysLeft(c.endDate);
                  const p = usagePct(c);
                  const isExpiring  = d > 0 && d <= 7;
                  const isExhausted = p >= 80;
                  return (
                    <div key={c.id} onClick={() => setDetail(c)}
                      className="flex items-center gap-2.5 p-2.5 bg-secondary border border-border rounded-xl hover:border-primary/30 cursor-pointer transition-all">
                      <div className={`h-7 w-7 rounded-lg flex items-center justify-center flex-shrink-0 text-[10px] font-black ${isExpiring ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'}`}>
                        {isExpiring ? <Clock size={13}/> : <Zap size={13}/>}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] font-bold text-foreground truncate">{c.name}</p>
                        <p className={`text-[10px] font-bold ${isExpiring ? 'text-red-500' : 'text-amber-600'}`}>
                          {isExpiring ? `Hết hạn sau ${d} ngày` : `Đã dùng ${p}% lượt`}
                        </p>
                      </div>
                    </div>
                  );
                })}
                {COUPONS.filter(c => {
                  const d = daysLeft(c.endDate); const p = usagePct(c);
                  return c.status === 'active' && ((d > 0 && d <= 7) || (p >= 0 && p >= 80));
                }).length === 0 && (
                  <p className="text-[11px] text-muted-foreground text-center py-4">Không có coupon nào cần chú ý</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Table card */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">

          {/* Tabs */}
          <div className="border-b border-border">
            <div className="flex items-center gap-1 px-5 pt-3 border-b border-border/50 overflow-x-auto">
              {(['all','active','scheduled','draft','expired','exhausted'] as ActiveTab[]).map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)}
                  className={`relative pb-3 px-1 text-[11px] font-black uppercase tracking-widest flex items-center gap-1.5 transition-all whitespace-nowrap flex-shrink-0 ${activeTab === tab ? 'text-primary border-b-2 border-primary -mb-px' : 'text-muted-foreground hover:text-foreground'}`}>
                  {{ all:'Tất cả', active:'Đang chạy', scheduled:'Sắp tới', draft:'Bản nháp', expired:'Hết hạn', exhausted:'Hết lượt' }[tab]}
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
                  {Object.entries(typeConfig).map(([k,v]) => <option key={k} value={k}>{v.label}</option>)}
                </select>

                {/* Channel filter */}
                <select value={filterChan} onChange={e => setFilterChan(e.target.value)}
                  className="bg-card border border-border rounded-xl text-[11px] font-bold text-foreground px-3 py-2 focus:outline-none focus:border-primary/50">
                  <option value="all">Tất cả kênh</option>
                  {(['web','app','email','pos'] as ChannelScope[]).map(c => <option key={c} value={c}>{channelLabel[c]}</option>)}
                </select>

                {/* Sort */}
                {([['used','Lượt dùng',<Ticket size={11}/>],['revenue','Doanh thu',<DollarSign size={11}/>],['conversion','Tỷ lệ',<Target size={11}/>]] as [SortCol, string, React.ReactNode][]).map(([col, label, icon]) => (
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
                    placeholder="Tìm tên, mã coupon, tag..."
                    className="w-full bg-card border border-border rounded-xl pl-9 pr-8 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-all"/>
                  {search && <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"><X size={11}/></button>}
                </div>
                <div className="flex items-center gap-0.5 bg-card border border-border rounded-xl p-1">
                  {([['table', <ListIcon size={13}/>], ['grid', <LayoutGrid size={13}/>]] as [ViewMode, React.ReactNode][]).map(([m, ic]) => (
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
                {([['Kích hoạt',<Zap size={11}/>],['Tạm dừng',<Timer size={11}/>],['Nhân bản',<Copy size={11}/>],['Xóa',<Trash2 size={11}/>]] as [string, React.ReactNode][]).map(([label, icon]) => (
                  <button key={label} className="px-3 py-1 bg-card hover:bg-secondary text-foreground rounded-lg text-[11px] font-bold flex items-center gap-1.5 border border-border transition-all">{icon} {label}</button>
                ))}
              </div>
              <button onClick={() => setSelected([])} className="ml-auto text-muted-foreground hover:text-foreground"><X size={13}/></button>
            </div>
          )}

          {/* Grid */}
          {viewMode === 'grid' ? (
            <div className="p-5 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filtered.map(c => <GridCard key={c.id} coupon={c} onClick={() => setDetail(c)}/>)}
            </div>
          ) : (
            /* Table */
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-secondary/30">
                    <th className="px-5 py-3 w-10 text-left">
                      <input type="checkbox" checked={selected.length === filtered.length && filtered.length > 0} onChange={toggleAll} className="accent-primary cursor-pointer"/>
                    </th>
                    <th className="px-2 py-3 text-left text-[10px] font-black text-muted-foreground uppercase tracking-widest min-w-[240px]">Coupon</th>
                    <th className="px-2 py-3 text-left text-[10px] font-black text-muted-foreground uppercase tracking-widest">Loại / Giá trị</th>
                    <th className="px-2 py-3 text-left text-[10px] font-black text-muted-foreground uppercase tracking-widest">Trạng thái</th>
                    <th className="px-2 py-3 text-left text-[10px] font-black text-muted-foreground uppercase tracking-widest">Thời gian</th>
                    <th className="px-2 py-3 text-left text-[10px] font-black text-muted-foreground uppercase tracking-widest cursor-pointer hover:text-foreground select-none" onClick={() => handleSort('used')}>
                      <span className="flex items-center gap-1">Lượt dùng <SortIcon col="used"/></span>
                    </th>
                    <th className="px-2 py-3 text-left text-[10px] font-black text-muted-foreground uppercase tracking-widest cursor-pointer hover:text-foreground select-none" onClick={() => handleSort('revenue')}>
                      <span className="flex items-center gap-1">Doanh thu <SortIcon col="revenue"/></span>
                    </th>
                    <th className="px-2 py-3 text-left text-[10px] font-black text-muted-foreground uppercase tracking-widest cursor-pointer hover:text-foreground select-none" onClick={() => handleSort('conversion')}>
                      <span className="flex items-center gap-1">Tỷ lệ <SortIcon col="conversion"/></span>
                    </th>
                    <th className="px-2 py-3 text-left text-[10px] font-black text-muted-foreground uppercase tracking-widest">Điều kiện</th>
                    <th className="px-5 py-3 text-right text-[10px] font-black text-muted-foreground uppercase tracking-widest">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(coupon => {
                    const type   = typeConfig[coupon.discountType];
                    const status = statusConfig[coupon.status];
                    const pct    = usagePct(coupon);
                    const days   = daysLeft(coupon.endDate);
                    const isSel  = selected.includes(coupon.id);
                    const isUrgent = (days > 0 && days <= 7 && coupon.status === 'active') || (pct >= 0 && pct >= 80 && coupon.status === 'active');

                    return (
                      <tr key={coupon.id} className={`border-b border-border/60 transition-colors group ${isSel ? 'bg-primary/[0.02]' : isUrgent ? 'bg-amber-50/30 hover:bg-amber-50/60' : 'hover:bg-secondary/30'}`}>
                        <td className="px-5 py-4">
                          <input type="checkbox" checked={isSel} onChange={() => toggleSelect(coupon.id)} className="accent-primary cursor-pointer"/>
                        </td>
                        <td className="px-2 py-4">
                          <div className="space-y-1.5">
                            <div className="flex items-center gap-1.5">
                              <span className="text-[10px] font-black text-primary">{coupon.id}</span>
                              {coupon.autoApply   && <span className="text-[9px] bg-violet-50 text-violet-700 border border-violet-200 px-1.5 py-0.5 rounded-full font-bold flex items-center gap-0.5"><Zap size={8}/> Auto</span>}
                              {coupon.stackable   && <span className="text-[9px] bg-blue-50 text-blue-700 border border-blue-200 px-1.5 py-0.5 rounded-full font-bold">Stack</span>}
                              {coupon.newOnly     && <span className="text-[9px] bg-amber-50 text-amber-700 border border-amber-200 px-1.5 py-0.5 rounded-full font-bold">New</span>}
                              {isUrgent && <span className="text-[9px] bg-red-50 text-red-600 border border-red-200 px-1.5 py-0.5 rounded-full font-bold flex items-center gap-0.5"><Flame size={8}/> Urgent</span>}
                            </div>
                            <p className="text-sm font-black text-foreground group-hover:text-primary transition-colors cursor-pointer leading-tight" onClick={() => setDetail(coupon)}>
                              {coupon.name}
                            </p>
                            <div className="flex items-center gap-2 flex-wrap">
                              <CopyCode code={coupon.code}/>
                              <span className="text-[10px] text-muted-foreground flex items-center gap-1">{channelIcon[coupon.channelScope]} {channelLabel[coupon.channelScope]}</span>
                              {coupon.tierScope !== 'all' && <span className="text-[10px] text-muted-foreground flex items-center gap-1"><Award size={9}/> {tierLabel[coupon.tierScope]}</span>}
                            </div>
                            <div className="flex gap-1 flex-wrap">
                              {coupon.tags.slice(0,3).map(t => <span key={t} className="text-[9px] px-1.5 py-0.5 bg-secondary border border-border rounded-full text-muted-foreground">{t}</span>)}
                            </div>
                          </div>
                        </td>
                        <td className="px-2 py-4">
                          <div className="space-y-1">
                            <span className={`inline-flex items-center gap-1 text-[10px] font-black px-2 py-1 rounded-lg border ${type.bg} ${type.text} ${type.border}`}>
                              {type.icon} {type.label}
                            </span>
                            <div className="text-lg font-black text-foreground">{valueLabel(coupon)}</div>
                            {coupon.maxDiscount && <div className="text-[10px] text-muted-foreground">Tối đa {fmt(coupon.maxDiscount)}₫</div>}
                          </div>
                        </td>
                        <td className="px-2 py-4">
                          <span className={`inline-flex items-center gap-1.5 text-[10px] font-black px-2 py-1 rounded-lg border ${status.bg} ${status.text} ${status.border}`}>
                            <span className={`h-1.5 w-1.5 rounded-full ${status.dot} ${status.pulse ? 'animate-pulse' : ''}`}/>{status.label}
                          </span>
                        </td>
                        <td className="px-2 py-4">
                          <div className="space-y-0.5">
                            <div className="text-[11px] text-muted-foreground flex items-center gap-1"><Calendar size={9}/>{coupon.startDate}</div>
                            <div className="text-[11px] font-bold text-foreground flex items-center gap-1">→ {coupon.endDate}</div>
                            {days > 0 && days <= 7 && coupon.status === 'active' && (
                              <div className="text-[10px] font-black text-red-500 flex items-center gap-0.5"><Flame size={9}/> {days} ngày</div>
                            )}
                            {days <= 0 && <div className="text-[10px] text-muted-foreground">Đã hết hạn</div>}
                          </div>
                        </td>
                        <td className="px-2 py-4">
                          <div className="space-y-1.5 w-28">
                            <div className="text-sm font-black text-foreground">{coupon.used.toLocaleString()}</div>
                            <UsageBar coupon={coupon} showLabel={false}/>
                            {pct >= 0 && (
                              <div className={`text-[10px] font-bold ${pct >= 90 ? 'text-red-500' : 'text-muted-foreground'}`}>
                                {pct}% / {coupon.usageLimit >= 99999 ? '∞' : coupon.usageLimit.toLocaleString()}
                              </div>
                            )}
                            {pct < 0 && <div className="text-[10px] text-muted-foreground flex items-center gap-1"><Infinity size={9}/> Unlimited</div>}
                          </div>
                        </td>
                        <td className="px-2 py-4">
                          {coupon.revenue > 0 ? (
                            <div>
                              <div className="text-sm font-black text-foreground">{fmt(coupon.revenue)}₫</div>
                              <div className="text-[10px] text-muted-foreground">Tiết kiệm: {fmt(coupon.savings)}₫</div>
                              <div className="mt-1 w-16"><Sparkline data={coupon.usageData}/></div>
                            </div>
                          ) : <span className="text-[11px] text-muted-foreground italic">—</span>}
                        </td>
                        <td className="px-2 py-4">
                          {coupon.conversion > 0 ? (
                            <div>
                              <div className="text-sm font-black text-foreground">{coupon.conversion}%</div>
                              <div className="flex items-center gap-1 mt-0.5">
                                {coupon.conversion >= 30 ? <TrendingUp size={10} className="text-green-500"/> : <TrendingDown size={10} className="text-amber-500"/>}
                                <span className={`text-[10px] font-bold ${coupon.conversion >= 30 ? 'text-green-600' : 'text-amber-600'}`}>{coupon.conversion >= 30 ? 'Hiệu quả' : 'Trung bình'}</span>
                              </div>
                            </div>
                          ) : <span className="text-[11px] text-muted-foreground italic">—</span>}
                        </td>
                        <td className="px-2 py-4">
                          <div className="space-y-1 text-[10px] text-muted-foreground">
                            <div className="flex items-center gap-1"><ShoppingBag size={9}/> Min: {coupon.minOrder > 0 ? `${fmt(coupon.minOrder)}₫` : 'Không'}</div>
                            <div className="flex items-center gap-1"><UserCheck size={9}/> {coupon.usageLimitPerUser}lượt/KH</div>
                            <div className="flex items-center gap-1">{coupon.requireCode ? <Lock size={9}/> : <Unlock size={9}/>} {coupon.requireCode ? 'Cần mã' : 'Auto'}</div>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-all">
                            <button className="p-1.5 rounded-lg bg-secondary hover:bg-muted text-muted-foreground hover:text-foreground border border-border transition-all" title="Nhân bản"><Copy size={12}/></button>
                            <button className="p-1.5 rounded-lg bg-secondary hover:bg-muted text-muted-foreground hover:text-foreground border border-border transition-all" title="Chỉnh sửa"><Edit size={12}/></button>
                            <button onClick={() => setDetail(coupon)} className="p-1.5 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 transition-all"><ChevronRight size={12}/></button>
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
                  <p className="font-black text-foreground">Không tìm thấy coupon</p>
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
                Hiển thị <span className="font-bold text-foreground">{filtered.length}</span> / {COUPONS.length} coupons
              </span>
            </div>
            <div className="flex items-center gap-1">
              <button className="h-7 w-7 rounded-lg bg-secondary hover:bg-muted border border-border flex items-center justify-center text-muted-foreground transition-all"><ChevronLeft size={13}/></button>
              {([1,2,'…',6] as (number|string)[]).map((p, i) => (
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

// Inline icon shim
const ListIcon = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/>
    <line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
  </svg>
);