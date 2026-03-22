"use client"
import React, { useState, useMemo } from 'react';
import {
  Users, UserPlus, Search, Mail, Download,
  MapPin, ShoppingBag, ShieldCheck, Ban, Clock,
  LayoutGrid, List, ArrowUpRight, TrendingDown,
  AlertCircle, Award, DollarSign, Activity,
  BarChart2, Tag, MessageSquare, X, Edit,
  Package, Globe, Smartphone, Send, ChevronRight,
  ChevronDown, ChevronUp, Bell, Settings, Percent,
  Trash2, Star, TrendingUp, Filter
} from 'lucide-react';
import {
  AreaChart, Area, ResponsiveContainer, XAxis, YAxis,
  Tooltip as RTooltip, CartesianGrid
} from 'recharts';

// ─── TYPES ───────────────────────────────────────────────────────────────────

type Tier = 'Platinum' | 'Gold' | 'Silver' | 'Bronze';
type Status = 'active' | 'inactive';
type ActivityType = 'purchase' | 'upgrade' | 'churn' | 'review';
type SortColumn = 'spent' | 'orders' | 'risk';
type SortDir = 'asc' | 'desc';
type ViewMode = 'table' | 'grid';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  tier: Tier;
  spent: number;
  orders: number;
  aov: number;
  clv: number;
  status: Status;
  lastActive: string;
  location: string;
  joinDate: string;
  tags: string[];
  riskScore: number;
  retention: number;
  channel: string;
  devices: string;
  gender: string;
  age: number;
}

interface ActivityItem {
  id: number;
  type: ActivityType;
  user: string;
  action: string;
  amount: string | null;
  time: string;
  avatar: string;
}

interface RevenuePoint {
  month: string;
  revenue: number;
  target: number;
}

interface SegmentPoint {
  name: string;
  value: number;
  color: string;
}

interface TierStyle {
  bg: string;
  text: string;
  border: string;
  icon: string;
  dot: string;
}

interface ActivityStyle {
  color: string;
  bg: string;
  icon: React.ReactNode;
}

// ─── DATA ────────────────────────────────────────────────────────────────────

const revenueData: RevenuePoint[] = [
  { month: 'T1', revenue: 320, target: 300 },
  { month: 'T2', revenue: 410, target: 350 },
  { month: 'T3', revenue: 380, target: 380 },
  { month: 'T4', revenue: 520, target: 400 },
  { month: 'T5', revenue: 490, target: 450 },
  { month: 'T6', revenue: 670, target: 500 },
  { month: 'T7', revenue: 580, target: 520 },
  { month: 'T8', revenue: 720, target: 550 },
  { month: 'T9', revenue: 810, target: 600 },
  { month: 'T10', revenue: 760, target: 650 },
  { month: 'T11', revenue: 920, target: 700 },
  { month: 'T12', revenue: 1100, target: 800 },
];

const segmentData: SegmentPoint[] = [
  { name: 'Platinum', value: 8,  color: '#7c3aed' },
  { name: 'Gold',     value: 22, color: '#d97706' },
  { name: 'Silver',   value: 35, color: '#64748b' },
  { name: 'Bronze',   value: 35, color: '#b45309' },
];

const activityFeed: ActivityItem[] = [
  { id: 1, type: 'purchase', user: 'Lê Văn Trường',  action: 'vừa đặt đơn hàng mới',     amount: '4,200,000 ₫', time: '2 phút',  avatar: 'LT' },
  { id: 2, type: 'upgrade',  user: 'Phạm Thị Lan',   action: 'được nâng hạng lên Gold',   amount: null,          time: '15 phút', avatar: 'PL' },
  { id: 3, type: 'churn',    user: 'Hoàng Minh Tú',  action: 'có nguy cơ rời bỏ',         amount: null,          time: '1 giờ',   avatar: 'HT' },
  { id: 4, type: 'purchase', user: 'Nguyễn Thị Mai', action: 'mua sản phẩm Premium',      amount: '1,850,000 ₫', time: '2 giờ',   avatar: 'NM' },
  { id: 5, type: 'review',   user: 'Trần Hoàng Bách',action: 'để lại đánh giá 5 sao',     amount: null,          time: '3 giờ',   avatar: 'TB' },
];

const CUSTOMERS: Customer[] = [
  { id:'CUS-001', name:'Lê Văn Trường',   email:'truong.le@example.com', phone:'0901 234 567', avatar:'LT', tier:'Platinum', spent:45200000, orders:24, aov:1883333,  clv:89000000,  status:'active',   lastActive:'10 phút trước',  location:'Hà Nội',    joinDate:'12/03/2022', tags:['VIP','Loyal'],            riskScore:5,  retention:96, channel:'Direct',   devices:'Mobile',  gender:'Nam', age:34 },
  { id:'CUS-002', name:'Nguyễn Thị Mai',  email:'mai.nguyen@test.vn',    phone:'0912 345 678', avatar:'NM', tier:'Gold',     spent:12800000, orders:8,  aov:1600000,  clv:22000000,  status:'active',   lastActive:'2 giờ trước',    location:'Đà Nẵng',   joinDate:'05/07/2023', tags:['Frequent'],               riskScore:25, retention:78, channel:'Social',    devices:'Desktop', gender:'Nữ', age:28 },
  { id:'CUS-003', name:'Trần Hoàng Bách', email:'bach.tran@company.com', phone:'0933 456 789', avatar:'TB', tier:'Silver',   spent:2400000,  orders:2,  aov:1200000,  clv:5000000,   status:'inactive', lastActive:'5 ngày trước',   location:'TP.HCM',    joinDate:'20/11/2023', tags:['At-Risk'],                riskScore:72, retention:42, channel:'Email',     devices:'Mobile',  gender:'Nam', age:41 },
  { id:'CUS-004', name:'Phạm Thị Lan',    email:'lan.pham@gmail.com',    phone:'0944 567 890', avatar:'PL', tier:'Gold',     spent:18600000, orders:13, aov:1430769,  clv:35000000,  status:'active',   lastActive:'30 phút trước',  location:'Hà Nội',    joinDate:'15/01/2023', tags:['VIP','Frequent'],         riskScore:12, retention:88, channel:'Referral',  devices:'Both',    gender:'Nữ', age:31 },
  { id:'CUS-005', name:'Hoàng Minh Tú',   email:'tu.hoang@business.vn',  phone:'0955 678 901', avatar:'HT', tier:'Bronze',   spent:890000,   orders:1,  aov:890000,   clv:1500000,   status:'inactive', lastActive:'14 ngày trước',  location:'Cần Thơ',   joinDate:'03/09/2023', tags:['At-Risk','New'],          riskScore:85, retention:15, channel:'Ads',       devices:'Mobile',  gender:'Nam', age:25 },
  { id:'CUS-006', name:'Võ Thị Hương',    email:'huong.vo@vip.com',      phone:'0966 789 012', avatar:'VH', tier:'Platinum', spent:67800000, orders:38, aov:1784210,  clv:120000000, status:'active',   lastActive:'5 phút trước',   location:'TP.HCM',    joinDate:'28/02/2021', tags:['VIP','Champion'],         riskScore:3,  retention:98, channel:'Direct',   devices:'Desktop', gender:'Nữ', age:38 },
  { id:'CUS-007', name:'Đặng Văn Hùng',   email:'hung.dang@corp.vn',     phone:'0977 890 123', avatar:'ĐH', tier:'Silver',   spent:5200000,  orders:5,  aov:1040000,  clv:9000000,   status:'active',   lastActive:'1 ngày trước',   location:'Hải Phòng', joinDate:'11/06/2023', tags:['Potential'],              riskScore:38, retention:61, channel:'SEO',       devices:'Desktop', gender:'Nam', age:45 },
  { id:'CUS-008', name:'Bùi Thị Thu',     email:'thu.bui@hotmail.com',   phone:'0988 901 234', avatar:'BT', tier:'Gold',     spent:22100000, orders:17, aov:1300000,  clv:48000000,  status:'active',   lastActive:'3 giờ trước',    location:'Hà Nội',    joinDate:'09/04/2022', tags:['Loyal'],                  riskScore:18, retention:83, channel:'Email',     devices:'Mobile',  gender:'Nữ', age:33 },
];

// ─── CONFIG ──────────────────────────────────────────────────────────────────

const tierConfig: Record<Tier, TierStyle> = {
  Platinum: { bg:'bg-slate-900',   text:'text-slate-100',   border:'border-slate-700', dot:'bg-slate-400',  icon:'💎' },
  Gold:     { bg:'bg-amber-50',    text:'text-amber-700',   border:'border-amber-200', dot:'bg-amber-500',  icon:'🥇' },
  Silver:   { bg:'bg-slate-100',   text:'text-slate-600',   border:'border-slate-300', dot:'bg-slate-400',  icon:'🥈' },
  Bronze:   { bg:'bg-orange-50',   text:'text-orange-700',  border:'border-orange-200',dot:'bg-orange-500', icon:'🥉' },
};

const activityConfig: Record<ActivityType, ActivityStyle> = {
  purchase: { color:'text-green-600',  bg:'bg-green-50',  icon:<ShoppingBag size={13}/> },
  upgrade:  { color:'text-primary',    bg:'bg-red-50',    icon:<Award size={13}/> },
  churn:    { color:'text-red-600',    bg:'bg-red-50',    icon:<AlertCircle size={13}/> },
  review:   { color:'text-amber-600',  bg:'bg-amber-50',  icon:<Star size={13}/> },
};

// ─── UTILS ───────────────────────────────────────────────────────────────────

const formatMoney = (n: number): string => {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000)     return `${(n / 1_000).toFixed(0)}K`;
  return n.toLocaleString();
};

// ─── SUB-COMPONENTS ──────────────────────────────────────────────────────────

interface RiskBarProps { score: number }
const RiskBar: React.FC<RiskBarProps> = ({ score }) => {
  const color = score < 30 ? 'bg-green-500' : score < 60 ? 'bg-amber-500' : 'bg-red-500';
  const label = score < 30 ? 'Thấp'        : score < 60 ? 'TB'           : 'Cao';
  const textColor = score < 30 ? 'text-green-600' : score < 60 ? 'text-amber-600' : 'text-red-600';
  return (
    <div className="flex items-center gap-2">
      <div className="w-14 h-1.5 bg-muted rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full`} style={{ width: `${score}%` }} />
      </div>
      <span className={`text-[10px] font-black ${textColor}`}>{label}</span>
    </div>
  );
};

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub?: string;
  trend?: string;
  trendUp?: boolean;
}
const StatCard: React.FC<StatCardProps> = ({ icon, label, value, sub, trend, trendUp }) => (
  <div className="bg-card border border-border rounded-2xl p-5 flex flex-col gap-3 hover:shadow-md transition-all group">
    <div className="flex items-center justify-between">
      <div className="p-2.5 rounded-xl bg-primary/8 text-primary">{icon}</div>
      {trend && (
        <span className={`flex items-center gap-0.5 text-[11px] font-bold px-2 py-0.5 rounded-full ${trendUp ? 'text-green-600 bg-green-50' : 'text-red-500 bg-red-50'}`}>
          {trendUp ? <ArrowUpRight size={11}/> : <TrendingDown size={11}/>} {trend}
        </span>
      )}
    </div>
    <div>
      <div className="text-2xl font-black text-foreground tracking-tight">{value}</div>
      <div className="text-xs text-muted-foreground font-medium mt-0.5">{label}</div>
    </div>
    {sub && <div className="text-[11px] text-muted-foreground border-t border-border pt-2">{sub}</div>}
  </div>
);

interface CustomerDetailSheetProps {
  customer: Customer | null;
  onClose: () => void;
}
const CustomerDetailSheet: React.FC<CustomerDetailSheetProps> = ({ customer, onClose }) => {
  if (!customer) return null;
  const tier = tierConfig[customer.tier];
  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-foreground/20 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-[480px] bg-card border-l border-border flex flex-col h-full overflow-hidden shadow-2xl">

        {/* Banner */}
        <div className="bg-primary px-6 pt-6 pb-0 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute -right-8 -top-8 w-48 h-48 rounded-full bg-white" />
            <div className="absolute -right-4 -bottom-12 w-72 h-72 rounded-full bg-white" />
          </div>
          <button onClick={onClose} className="absolute top-4 right-4 p-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-white transition-all z-10">
            <X size={15}/>
          </button>
          <div className="relative z-10 flex items-end gap-4 pb-5">
            <div className={`h-16 w-16 rounded-2xl ${tier.bg} border-2 ${tier.border} flex items-center justify-center text-xl font-black ${tier.text} flex-shrink-0 shadow-xl`}>
              {customer.avatar}
            </div>
            <div className="pb-1">
              <div className="flex items-center gap-2 flex-wrap mb-0.5">
                <h2 className="text-xl font-black text-white">{customer.name}</h2>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-black bg-white/20 text-white border border-white/30`}>
                  {tier.icon} {customer.tier}
                </span>
              </div>
              <p className="text-white/70 text-sm">{customer.email}</p>
              <p className="text-white/70 text-sm">{customer.phone}</p>
            </div>
          </div>
          <div className="flex gap-1.5 flex-wrap border-t border-white/20 py-3">
            {customer.tags.map(t => (
              <span key={t} className="text-[10px] px-2.5 py-0.5 bg-white/15 border border-white/25 rounded-full text-white font-bold">{t}</span>
            ))}
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-3 gap-3 px-5 py-4 border-b border-border">
          {([
            { label: 'Total Spent',  value: `${formatMoney(customer.spent)}₫`,  icon: <DollarSign size={13}/> },
            { label: 'CLV Ước tính',  value: `${formatMoney(customer.clv)}₫`,    icon: <TrendingUp size={13}/> },
            { label: 'AOV',          value: `${formatMoney(customer.aov)}₫`,    icon: <BarChart2 size={13}/> },
          ] as { label: string; value: string; icon: React.ReactNode }[]).map(k => (
            <div key={k.label} className="bg-secondary border border-border rounded-xl p-3 text-center">
              <div className="text-primary flex justify-center mb-1">{k.icon}</div>
              <div className="text-sm font-black text-foreground">{k.value}</div>
              <div className="text-[10px] text-muted-foreground mt-0.5">{k.label}</div>
            </div>
          ))}
        </div>

        {/* Details scroll */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          <div className="grid grid-cols-2 gap-2.5">
            {([
              { label:'Tổng đơn hàng', value: customer.orders,   icon: <Package size={13}/> },
              { label:'Kênh mua',      value: customer.channel,   icon: <Globe size={13}/> },
              { label:'Thiết bị',      value: customer.devices,   icon: <Smartphone size={13}/> },
              { label:'Ngày tham gia', value: customer.joinDate,  icon: <Clock size={13}/> },
              { label:'Địa điểm',      value: customer.location,  icon: <MapPin size={13}/> },
              { label:'Tuổi / Giới',   value: `${customer.age}t – ${customer.gender}`, icon: <Users size={13}/> },
            ] as { label: string; value: string | number; icon: React.ReactNode }[]).map(s => (
              <div key={s.label} className="bg-secondary border border-border rounded-xl p-3 flex items-center gap-2.5">
                <div className="text-primary">{s.icon}</div>
                <div>
                  <div className="text-xs font-bold text-foreground">{s.value}</div>
                  <div className="text-[10px] text-muted-foreground">{s.label}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-secondary border border-border rounded-xl p-4 space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground font-medium">Retention Score</span>
              <span className="font-black text-foreground">{customer.retention}%</span>
            </div>
            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full" style={{ width: `${customer.retention}%` }}/>
            </div>
            <div className="flex justify-between items-center text-sm pt-1">
              <span className="text-muted-foreground font-medium">Churn Risk</span>
              <span className="text-[11px] font-bold text-muted-foreground">{customer.riskScore}/100</span>
            </div>
            <RiskBar score={customer.riskScore} />
          </div>

          <div>
            <div className="text-xs font-black text-muted-foreground uppercase tracking-widest mb-3 flex items-center gap-2">
              <Clock size={12}/> Đơn hàng gần đây
            </div>
            <div className="space-y-2">
              {([
                { id:'DH-00184', date:'12/02/2024', amount:2450000, delivered:true },
                { id:'DH-00162', date:'04/01/2024', amount:1800000, delivered:true },
                { id:'DH-00141', date:'19/12/2023', amount:3200000, delivered:false },
              ]).map(o => (
                <div key={o.id} className="flex items-center justify-between p-3 bg-secondary border border-border rounded-xl hover:border-primary/30 hover:bg-primary/[0.02] transition-all cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 bg-card border border-border rounded-lg flex items-center justify-center">
                      <Package size={13} className="text-muted-foreground"/>
                    </div>
                    <div>
                      <div className="text-xs font-bold text-foreground">#{o.id}</div>
                      <div className="text-[10px] text-muted-foreground">{o.date}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-black text-foreground">{o.amount.toLocaleString()}₫</div>
                    <div className={`text-[10px] font-bold ${o.delivered ? 'text-green-600' : 'text-red-500'}`}>
                      {o.delivered ? '✓ Đã giao' : '↩ Hoàn trả'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border flex gap-2 bg-card">
          <button className="flex-1 py-3 bg-primary hover:bg-primary-light text-white font-bold rounded-xl text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20">
            <Edit size={14}/> Chỉnh sửa
          </button>
          <button className="py-3 px-4 bg-secondary hover:bg-muted text-foreground rounded-xl transition-all flex items-center gap-2 text-sm font-bold border border-border">
            <Send size={14}/> Email
          </button>
          <button className="py-3 px-3 bg-red-50 hover:bg-red-100 text-red-500 rounded-xl transition-all border border-red-100">
            <Ban size={15}/>
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── MAIN ─────────────────────────────────────────────────────────────────────

export default function CustomerManagement() {
  const [search, setSearch]               = useState('');
  const [selectedTier, setSelectedTier]   = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selected, setSelected]           = useState<string[]>([]);
  const [activeDetail, setActiveDetail]   = useState<Customer | null>(null);
  const [sortBy, setSortBy]               = useState<SortColumn>('spent');
  const [sortDir, setSortDir]             = useState<SortDir>('desc');
  const [viewMode, setViewMode]           = useState<ViewMode>('table');

  const filtered = useMemo<Customer[]>(() => {
    return CUSTOMERS
      .filter(c => {
        const q = search.toLowerCase();
        const matchSearch = c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q) || c.phone.includes(q);
        const matchTier   = selectedTier   === 'all' || c.tier.toLowerCase() === selectedTier;
        const matchStatus = selectedStatus === 'all' || c.status === selectedStatus;
        return matchSearch && matchTier && matchStatus;
      })
      .sort((a, b) => {
        const dir = sortDir === 'asc' ? 1 : -1;
        if (sortBy === 'spent')  return (a.spent      - b.spent)      * dir;
        if (sortBy === 'orders') return (a.orders     - b.orders)     * dir;
        if (sortBy === 'risk')   return (a.riskScore  - b.riskScore)  * dir;
        return 0;
      });
  }, [search, selectedTier, selectedStatus, sortBy, sortDir]);

  const toggleSelect  = (id: string) => setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);
  const toggleAll     = () => setSelected(selected.length === filtered.length ? [] : filtered.map(c => c.id));
  const handleSort    = (col: SortColumn) => { if (sortBy === col) setSortDir(d => d === 'asc' ? 'desc' : 'asc'); else { setSortBy(col); setSortDir('desc'); } };

  const SortIcon: React.FC<{ col: SortColumn }> = ({ col }) =>
    sortBy === col
      ? (sortDir === 'desc' ? <ChevronDown size={11} className="text-primary"/> : <ChevronUp size={11} className="text-primary"/>)
      : <ChevronDown size={11} className="text-muted-foreground/40"/>;

  return (
    <div className="min-h-screen bg-background text-foreground">
      {activeDetail && <CustomerDetailSheet customer={activeDetail} onClose={() => setActiveDetail(null)} />}

      {/* Top nav */}
      <div className="border-b border-border bg-card px-6 py-3 flex items-center justify-between sticky top-0 z-40 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="h-7 w-7 bg-primary rounded-lg flex items-center justify-center shadow-md shadow-primary/30">
            <Users size={13} className="text-white"/>
          </div>
          <span className="font-black text-foreground text-sm tracking-tight">CRM Pro</span>
          <span className="text-muted-foreground mx-1 text-sm">›</span>
          <span className="text-muted-foreground text-sm">Quản lý khách hàng</span>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-all relative">
            <Bell size={15}/>
            <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 bg-primary rounded-full"/>
          </button>
          <button className="p-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-all">
            <Settings size={15}/>
          </button>
          <div className="h-7 w-7 bg-primary rounded-lg flex items-center justify-center text-xs font-black text-white shadow-md shadow-primary/30">A</div>
        </div>
      </div>

      <div className="p-6 space-y-6 max-w-[1600px] mx-auto">

        {/* Page header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-foreground">Khách hàng</h1>
            <p className="text-muted-foreground text-sm mt-1">Quản lý và phân tích toàn bộ dữ liệu khách hàng</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-4 py-2.5 bg-secondary hover:bg-muted border border-border rounded-xl text-sm font-bold text-foreground flex items-center gap-2 transition-all">
              <Download size={14}/> Xuất dữ liệu
            </button>
            <button className="px-4 py-2.5 bg-primary hover:bg-primary-light rounded-xl text-sm font-black text-white flex items-center gap-2 transition-all shadow-lg shadow-primary/25">
              <UserPlus size={14}/> Thêm khách hàng
            </button>
          </div>
        </div>

        {/* KPI cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
          <StatCard icon={<Users size={15}/>}       label="Tổng khách hàng"  value="4,821"  trend="+12.4%" trendUp sub="↑ 482 so với tháng trước"/>
          <StatCard icon={<Activity size={15}/>}    label="Đang hoạt động"   value="3,109"  trend="+8.1%"  trendUp sub="64.5% tổng khách hàng"/>
          <StatCard icon={<UserPlus size={15}/>}    label="Mới trong tháng"  value="214"    trend="+5.2%"  trendUp sub="Mục tiêu: 250"/>
          <StatCard icon={<AlertCircle size={15}/>} label="Nguy cơ rời bỏ"  value="89"     trend="+2.1%"  trendUp={false} sub="Cần xử lý ngay"/>
          <StatCard icon={<DollarSign size={15}/>}  label="Doanh thu/KH"     value="8.2M ₫" trend="+19.3%" trendUp sub="Trung bình tháng"/>
          <StatCard icon={<Percent size={15}/>}     label="Tỷ lệ giữ chân"  value="87.4%"  trend="-0.8%"  trendUp={false} sub="Mục tiêu: 90%"/>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Revenue area chart */}
          <div className="lg:col-span-2 bg-card border border-border rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-sm font-black text-foreground">Doanh thu khách hàng</div>
                <div className="text-[11px] text-muted-foreground mt-0.5">Thực tế vs Mục tiêu (triệu ₫)</div>
              </div>
              <div className="flex items-center gap-4 text-[11px] text-muted-foreground">
                <span className="flex items-center gap-1.5"><span className="inline-block h-2 w-4 rounded bg-primary"/>&nbsp;Thực tế</span>
                <span className="flex items-center gap-1.5"><span className="inline-block h-2 w-4 rounded bg-muted"/>&nbsp;Mục tiêu</span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={350}>
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#E40F2A" stopOpacity={0.15}/>
                    <stop offset="100%" stopColor="#E40F2A" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false}/>
                <XAxis dataKey="month" tick={{ fontSize:10, fill:'var(--muted-foreground)' }} axisLine={false} tickLine={false}/>
                <YAxis tick={{ fontSize:10, fill:'var(--muted-foreground)' }} axisLine={false} tickLine={false}/>
                <RTooltip contentStyle={{ background:'var(--card)', border:'1px solid var(--border)', borderRadius:'12px', fontSize:'12px', color:'var(--foreground)' }}/>
                <Area type="monotone" dataKey="target"  stroke="var(--muted)" strokeWidth={1.5} fill="none" strokeDasharray="4 4"/>
                <Area type="monotone" dataKey="revenue" stroke="#E40F2A"       strokeWidth={2.5} fill="url(#revGrad)"/>
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Sidebar panels */}
          <div className="space-y-4">
            {/* Segments */}
            <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
              <div className="text-sm font-black text-foreground mb-4">Phân khúc khách hàng</div>
              <div className="space-y-3">
                {segmentData.map(s => (
                  <div key={s.name} className="flex items-center gap-3">
                    <span className="text-[11px] text-muted-foreground w-14 font-medium">{s.name}</span>
                    <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all" style={{ width:`${s.value}%`, background:s.color }}/>
                    </div>
                    <span className="text-[11px] font-black text-foreground w-8 text-right">{s.value}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Activity feed */}
            <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="text-sm font-black text-foreground">Hoạt động gần đây</div>
                <span className="text-[10px] text-primary font-bold cursor-pointer hover:underline">Xem tất cả</span>
              </div>
              <div className="space-y-3">
                {activityFeed.slice(0, 4).map(a => {
                  const cfg = activityConfig[a.type];
                  return (
                    <div key={a.id} className="flex items-start gap-2.5">
                      <div className={`h-7 w-7 rounded-lg ${cfg.bg} ${cfg.color} flex items-center justify-center flex-shrink-0 mt-0.5`}>{cfg.icon}</div>
                      <div className="min-w-0">
                        <p className="text-[11px] text-muted-foreground leading-relaxed">
                          <span className="font-bold text-foreground">{a.user}</span> {a.action}
                          {a.amount && <span className="text-green-600 font-bold"> {a.amount}</span>}
                        </p>
                        <span className="text-[10px] text-muted-foreground/60">{a.time} trước</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Table card */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">

          {/* Toolbar */}
          <div className="px-5 py-3.5 border-b border-border flex flex-col md:flex-row gap-3 items-start md:items-center justify-between bg-secondary/40">
            <div className="flex items-center gap-2 flex-wrap">
              {(['all','platinum','gold','silver','bronze'] as const).map(t => (
                <button
                  key={t}
                  onClick={() => setSelectedTier(t)}
                  className={`px-3 py-1.5 rounded-lg text-[11px] font-bold capitalize transition-all ${
                    selectedTier === t
                      ? 'bg-primary text-white shadow shadow-primary/20'
                      : 'bg-card text-muted-foreground hover:bg-muted hover:text-foreground border border-border'
                  }`}
                >
                  {t === 'all' ? 'Tất cả' : t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
              <div className="w-px h-4 bg-border mx-1"/>
              <button
                onClick={() => setSelectedStatus(selectedStatus === 'active' ? 'all' : 'active')}
                className={`px-3 py-1.5 rounded-lg text-[11px] font-bold flex items-center gap-1.5 transition-all border ${
                  selectedStatus === 'active'
                    ? 'bg-green-50 text-green-700 border-green-200'
                    : 'bg-card text-muted-foreground border-border hover:bg-muted'
                }`}
              >
                <span className={`h-1.5 w-1.5 rounded-full ${selectedStatus === 'active' ? 'bg-green-500' : 'bg-muted-foreground'}`}/>
                Đang active
              </button>
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto">
              <div className="relative flex-1 md:w-64">
                <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"/>
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Tìm tên, email, SĐT..."
                  className="w-full bg-card border border-border rounded-xl pl-9 pr-8 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-all"
                />
                {search && (
                  <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    <X size={11}/>
                  </button>
                )}
              </div>
              <div className="flex items-center gap-0.5 bg-card border border-border rounded-xl p-1">
                {([['table', <List size={13}/>],['grid', <LayoutGrid size={13}/>]] as [ViewMode, React.ReactNode][]).map(([m, ic]) => (
                  <button key={m} onClick={() => setViewMode(m)}
                    className={`p-1.5 rounded-lg transition-all ${viewMode === m ? 'bg-primary text-white shadow-sm' : 'text-muted-foreground hover:text-foreground hover:bg-secondary'}`}>
                    {ic}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Bulk actions bar */}
          {selected.length > 0 && (
            <div className="px-5 py-2.5 bg-primary/[0.06] border-b border-primary/20 flex items-center gap-3">
              <span className="text-sm font-bold text-primary">{selected.length} đã chọn</span>
              <div className="flex gap-2">
                {([['Gửi email', <Send size={11}/>],['Gán nhãn', <Tag size={11}/>],['Xóa', <Trash2 size={11}/>]] as [string, React.ReactNode][]).map(([label, icon]) => (
                  <button key={label} className="px-3 py-1 bg-card hover:bg-secondary text-foreground rounded-lg text-[11px] font-bold flex items-center gap-1.5 transition-all border border-border">
                    {icon} {label}
                  </button>
                ))}
              </div>
              <button onClick={() => setSelected([])} className="ml-auto text-muted-foreground hover:text-foreground transition-all"><X size={13}/></button>
            </div>
          )}

          {/* Table view */}
          {viewMode === 'table' ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-secondary/30">
                    <th className="px-5 py-3 text-left w-10">
                      <input type="checkbox" checked={selected.length === filtered.length && filtered.length > 0} onChange={toggleAll} className="accent-primary cursor-pointer"/>
                    </th>
                    <th className="px-2 py-3 text-left text-[10px] font-black text-muted-foreground uppercase tracking-widest">Khách hàng</th>
                    <th className="px-2 py-3 text-left text-[10px] font-black text-muted-foreground uppercase tracking-widest">Phân hạng</th>
                    <th className="px-2 py-3 text-left text-[10px] font-black text-muted-foreground uppercase tracking-widest cursor-pointer hover:text-foreground select-none" onClick={() => handleSort('spent')}>
                      <span className="flex items-center gap-1">Chi tiêu <SortIcon col="spent"/></span>
                    </th>
                    <th className="px-2 py-3 text-left text-[10px] font-black text-muted-foreground uppercase tracking-widest cursor-pointer hover:text-foreground select-none" onClick={() => handleSort('orders')}>
                      <span className="flex items-center gap-1">Đơn hàng <SortIcon col="orders"/></span>
                    </th>
                    <th className="px-2 py-3 text-left text-[10px] font-black text-muted-foreground uppercase tracking-widest">Retention</th>
                    <th className="px-2 py-3 text-left text-[10px] font-black text-muted-foreground uppercase tracking-widest cursor-pointer hover:text-foreground select-none" onClick={() => handleSort('risk')}>
                      <span className="flex items-center gap-1">Churn Risk <SortIcon col="risk"/></span>
                    </th>
                    <th className="px-2 py-3 text-left text-[10px] font-black text-muted-foreground uppercase tracking-widest">Trạng thái</th>
                    <th className="px-5 py-3 text-right text-[10px] font-black text-muted-foreground uppercase tracking-widest">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(cus => {
                    const tier = tierConfig[cus.tier];
                    const isSel = selected.includes(cus.id);
                    return (
                      <tr key={cus.id} className={`border-b border-border/60 hover:bg-secondary/40 transition-colors group ${isSel ? 'bg-primary/[0.03]' : ''}`}>
                        <td className="px-5 py-3.5">
                          <input type="checkbox" checked={isSel} onChange={() => toggleSelect(cus.id)} className="accent-primary cursor-pointer"/>
                        </td>
                        <td className="px-2 py-3.5">
                          <div className="flex items-center gap-3">
                            <div className={`h-9 w-9 rounded-xl ${tier.bg} border ${tier.border} flex items-center justify-center text-xs font-black ${tier.text} flex-shrink-0`}>
                              {cus.avatar}
                            </div>
                            <div>
                              <div className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">{cus.name}</div>
                              <div className="text-[11px] text-muted-foreground">{cus.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-2 py-3.5">
                          <span className={`text-[10px] font-black px-2.5 py-1 rounded-lg border ${tier.bg} ${tier.text} ${tier.border}`}>
                            {tier.icon} {cus.tier}
                          </span>
                        </td>
                        <td className="px-2 py-3.5">
                          <div className="text-sm font-black text-foreground">{formatMoney(cus.spent)}₫</div>
                          <div className="text-[10px] text-muted-foreground">AOV: {formatMoney(cus.aov)}₫</div>
                        </td>
                        <td className="px-2 py-3.5">
                          <div className="text-sm font-bold text-foreground">{cus.orders}</div>
                          <div className="text-[10px] text-muted-foreground">{cus.lastActive}</div>
                        </td>
                        <td className="px-2 py-3.5">
                          <div className="w-20">
                            <div className="flex justify-between mb-1">
                              <span className="text-[10px] font-black text-foreground">{cus.retention}%</span>
                            </div>
                            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                              <div className="h-full bg-primary rounded-full" style={{ width: `${cus.retention}%` }}/>
                            </div>
                          </div>
                        </td>
                        <td className="px-2 py-3.5"><RiskBar score={cus.riskScore}/></td>
                        <td className="px-2 py-3.5">
                          <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-lg border ${
                            cus.status === 'active'
                              ? 'bg-green-50 text-green-700 border-green-200'
                              : 'bg-secondary text-muted-foreground border-border'
                          }`}>
                            <span className={`h-1.5 w-1.5 rounded-full ${cus.status === 'active' ? 'bg-green-500' : 'bg-muted-foreground'}`}/>
                            {cus.status === 'active' ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-all">
                            <button className="p-1.5 rounded-lg bg-secondary hover:bg-muted text-muted-foreground hover:text-foreground transition-all border border-border" title="Gửi email"><Mail size={12}/></button>
                            <button className="p-1.5 rounded-lg bg-secondary hover:bg-muted text-muted-foreground hover:text-foreground transition-all border border-border" title="Chỉnh sửa"><Edit size={12}/></button>
                            <button onClick={() => setActiveDetail(cus)} className="p-1.5 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary transition-all border border-primary/20"><ChevronRight size={12}/></button>
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
                  <p className="font-bold text-foreground">Không tìm thấy kết quả</p>
                  <p className="text-sm mt-1">Thử tìm kiếm với từ khóa khác</p>
                </div>
              )}
            </div>
          ) : (
            /* Grid view */
            <div className="p-4 grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
              {filtered.map(cus => {
                const tier = tierConfig[cus.tier];
                return (
                  <div key={cus.id} onClick={() => setActiveDetail(cus)}
                    className="bg-card border border-border rounded-2xl p-4 hover:border-primary/40 hover:shadow-md transition-all cursor-pointer group">
                    <div className="flex items-start justify-between mb-3">
                      <div className={`h-10 w-10 rounded-xl ${tier.bg} border ${tier.border} flex items-center justify-center text-sm font-black ${tier.text}`}>{cus.avatar}</div>
                      <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-md border ${tier.bg} ${tier.text} ${tier.border}`}>{tier.icon} {cus.tier}</span>
                    </div>
                    <div className="text-sm font-black text-foreground mb-0.5 group-hover:text-primary transition-colors">{cus.name}</div>
                    <div className="text-[11px] text-muted-foreground flex items-center gap-1 mb-3"><MapPin size={10}/>{cus.location}</div>
                    <div className="pt-3 border-t border-border flex justify-between items-end">
                      <div>
                        <div className="text-xs font-black text-foreground">{formatMoney(cus.spent)}₫</div>
                        <div className="text-[10px] text-muted-foreground">{cus.orders} đơn hàng</div>
                      </div>
                      <span className={`text-[10px] font-bold flex items-center gap-1 px-2 py-0.5 rounded-full border ${
                        cus.status === 'active' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-secondary text-muted-foreground border-border'
                      }`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${cus.status === 'active' ? 'bg-green-500' : 'bg-muted-foreground'}`}/>
                        {cus.status === 'active' ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Pagination footer */}
          <div className="px-5 py-3 border-t border-border flex items-center justify-between bg-secondary/20">
            <span className="text-[11px] text-muted-foreground">
              Hiển thị <span className="text-foreground font-bold">{filtered.length}</span> / {CUSTOMERS.length} khách hàng
            </span>
            <div className="flex items-center gap-1">
              {([1,2,3,'...',12] as (number|string)[]).map((p, i) => (
                <button key={i} className={`h-7 w-7 rounded-lg text-[11px] font-bold transition-all ${
                  p === 1 ? 'bg-primary text-white shadow shadow-primary/25' : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                }`}>{p}</button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}