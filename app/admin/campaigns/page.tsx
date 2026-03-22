"use client"
import React, { useState, useMemo } from 'react';
import {
  Megaphone, Mail, Smartphone, Globe, Users, Target,
  BarChart2, TrendingUp, TrendingDown, ArrowUpRight,
  Plus, Search, Download, Bell, Settings, X, Edit,
  Trash2, Copy, ChevronLeft, ChevronRight, ChevronDown,
  ChevronUp, Eye, Send, Play, Pause, Clock, Calendar,
  CheckCircle2, AlertCircle, Zap, Layers, Tag, Hash,
  Activity, DollarSign, MousePointer, MailOpen, Link,
  Filter, ToggleLeft, ToggleRight, Flag, Star, Award,
  RefreshCw, Sparkles, PieChart, Check, LayoutGrid,
  List, Image, FileText, MessageSquare, Timer, Info,
  BarChart, UserCheck, Percent, Radio
} from 'lucide-react';
import {
  AreaChart, Area, BarChart as RBarChart, Bar, LineChart, Line,
  ResponsiveContainer, XAxis, YAxis, CartesianGrid,
  Tooltip as RTooltip, Cell, PieChart as RPieChart, Pie
} from 'recharts';

// ─── TYPES ────────────────────────────────────────────────────────────────────

type CampaignType    = 'email' | 'sms' | 'push' | 'social' | 'display' | 'omnichannel';
type CampaignStatus  = 'active' | 'scheduled' | 'draft' | 'ended' | 'paused';
type CampaignGoal    = 'awareness' | 'conversion' | 'retention' | 'reactivation' | 'upsell';
type ActiveTab       = 'all' | 'active' | 'scheduled' | 'draft' | 'ended';
type SortCol         = 'startDate' | 'sent' | 'openRate' | 'conversion' | 'revenue';
type SortDir         = 'asc' | 'desc';
type ViewMode        = 'table' | 'grid';
type PanelTab        = 'overview' | 'audience' | 'performance' | 'content';

interface DailyPoint   { day: string; sent: number; opened: number; clicked: number }
interface WeekPoint    { week: string; revenue: number }
interface FunnelStep   { label: string; value: number; pct: number }
interface AudienceSeg  { label: string; count: number; pct: number }

interface Campaign {
  id: string;
  name: string;
  type: CampaignType;
  status: CampaignStatus;
  goal: CampaignGoal;
  description: string;
  startDate: string;
  endDate: string;
  budget: number;
  spent: number;
  audience: number;
  sent: number;
  delivered: number;
  opened: number;
  clicked: number;
  converted: number;
  unsubscribed: number;
  revenue: number;
  openRate: number;
  clickRate: number;
  conversion: number;
  roas: number;
  tags: string[];
  tiers: string[];
  segments: AudienceSeg[];
  dailyData: DailyPoint[];
  weeklyRevenue: WeekPoint[];
  subject?: string;
  previewText?: string;
  sender?: string;
  abTest: boolean;
  automation: boolean;
  createdBy: string;
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

// ─── CONFIG ───────────────────────────────────────────────────────────────────

const typeConfig: Record<CampaignType, { bg: string; text: string; border: string; icon: React.ReactNode; label: string; color: string }> = {
  email:       { bg:'bg-blue-50',   text:'text-blue-700',   border:'border-blue-200',   icon:<Mail size={12}/>,        label:'Email',        color:'#3b82f6' },
  sms:         { bg:'bg-green-50',  text:'text-green-700',  border:'border-green-200',  icon:<MessageSquare size={12}/>,label:'SMS',           color:'#22c55e' },
  push:        { bg:'bg-violet-50', text:'text-violet-700', border:'border-violet-200', icon:<Smartphone size={12}/>,  label:'Push',         color:'#7c3aed' },
  social:      { bg:'bg-pink-50',   text:'text-pink-700',   border:'border-pink-200',   icon:<Globe size={12}/>,       label:'Social Ads',   color:'#ec4899' },
  display:     { bg:'bg-amber-50',  text:'text-amber-700',  border:'border-amber-200',  icon:<Image size={12}/>,       label:'Display Ads',  color:'#f59e0b' },
  omnichannel: { bg:'bg-red-50',    text:'text-red-600',    border:'border-red-200',    icon:<Layers size={12}/>,      label:'Omnichannel',  color:'#E40F2A' },
};

const statusConfig: Record<CampaignStatus, { bg: string; text: string; border: string; dot: string; label: string; pulse?: boolean }> = {
  active:    { bg:'bg-green-50',  text:'text-green-700', border:'border-green-200', dot:'bg-green-500', label:'Đang chạy',    pulse:true  },
  scheduled: { bg:'bg-blue-50',   text:'text-blue-700',  border:'border-blue-200',  dot:'bg-blue-500',  label:'Sắp diễn ra'              },
  draft:     { bg:'bg-amber-50',  text:'text-amber-700', border:'border-amber-200', dot:'bg-amber-500', label:'Bản nháp'                 },
  ended:     { bg:'bg-slate-100', text:'text-slate-500', border:'border-slate-200', dot:'bg-slate-400', label:'Đã kết thúc'              },
  paused:    { bg:'bg-orange-50', text:'text-orange-700',border:'border-orange-200',dot:'bg-orange-500',label:'Tạm dừng'                 },
};

const goalConfig: Record<CampaignGoal, { label: string; icon: React.ReactNode; color: string }> = {
  awareness:    { label:'Nhận diện',    icon:<Megaphone size={11}/>, color:'text-blue-600'   },
  conversion:   { label:'Chuyển đổi',  icon:<Target size={11}/>,    color:'text-primary'     },
  retention:    { label:'Giữ chân',    icon:<UserCheck size={11}/>, color:'text-green-600'  },
  reactivation: { label:'Tái kích hoạt',icon:<RefreshCw size={11}/>,color:'text-violet-600' },
  upsell:       { label:'Upsell',       icon:<TrendingUp size={11}/>,color:'text-amber-600'  },
};

// ─── DATA ─────────────────────────────────────────────────────────────────────

const makeDailyData = (base: number): DailyPoint[] =>
  ['T2','T3','T4','T5','T6','T7','CN'].map(day => {
    const sent    = Math.max(0, Math.round(base * (0.8 + Math.random() * 0.4)));
    const opened  = Math.round(sent * (0.2 + Math.random() * 0.25));
    const clicked = Math.round(opened * (0.15 + Math.random() * 0.2));
    return { day, sent, opened, clicked };
  });

const makeWeeklyRev = (base: number): WeekPoint[] =>
  ['T1','T2','T3','T4','T5','T6','T7','T8'].map(week => ({
    week, revenue: Math.max(0, Math.round(base * (0.6 + Math.random() * 0.8))),
  }));

const makeSegs = (): AudienceSeg[] => [
  { label:'Platinum', count:120,  pct:8  },
  { label:'Gold',     count:380,  pct:25 },
  { label:'Silver',   count:620,  pct:41 },
  { label:'Bronze',   count:390,  pct:26 },
];

const CAMPAIGNS: Campaign[] = [
  {
    id:'CAM-001', name:'Email Chăm Sóc Khách Hàng Platinum',
    type:'email', status:'active', goal:'retention',
    description:'Chuỗi email tự động 5 bước chăm sóc khách VIP Platinum, tặng quà và ưu đãi độc quyền hàng tháng.',
    startDate:'01/10/2024', endDate:'31/12/2024', budget:15000000, spent:6800000,
    audience:1510, sent:4230, delivered:4185, opened:2134, clicked:687, converted:312, unsubscribed:18,
    revenue:468000000, openRate:51.0, clickRate:16.2, conversion:7.4, roas:68.8,
    tags:['Retention','VIP','Automation'], tiers:['Platinum'],
    segments:makeSegs(), dailyData:makeDailyData(600), weeklyRevenue:makeWeeklyRev(60),
    subject:'🎁 Đặc quyền tháng 10 dành riêng cho bạn', previewText:'Món quà bí ẩn đang chờ bạn khám phá...',
    sender:'cskh@brand.vn', abTest:false, automation:true, createdBy:'Hoàng Nam',
  },
  {
    id:'CAM-002', name:'Flash SMS Sale 10.10',
    type:'sms', status:'ended', goal:'conversion',
    description:'Chiến dịch SMS blast thông báo Flash Sale 10.10, giảm đến 50% toàn site trong 24 giờ.',
    startDate:'09/10/2024', endDate:'10/10/2024', budget:8000000, spent:7900000,
    audience:28400, sent:28400, delivered:27856, opened:0, clicked:0, converted:2840, unsubscribed:0,
    revenue:712000000, openRate:0, clickRate:0, conversion:10.2, roas:90.1,
    tags:['Flash Sale','10.10','Blast'], tiers:['all'],
    segments:makeSegs(), dailyData:makeDailyData(4000), weeklyRevenue:makeWeeklyRev(100),
    sender:'BRAND', abTest:false, automation:false, createdBy:'Minh Châu',
  },
  {
    id:'CAM-003', name:'Push Notification Giỏ Hàng Bỏ Quên',
    type:'push', status:'active', goal:'reactivation',
    description:'Tự động gửi push notification nhắc nhở khách hàng về giỏ hàng bỏ trống sau 1-24-72 giờ.',
    startDate:'15/09/2024', endDate:'31/12/2024', budget:5000000, spent:2100000,
    audience:8920, sent:12480, delivered:11800, opened:4720, clicked:2360, converted:890, unsubscribed:0,
    revenue:267000000, openRate:40.0, clickRate:20.0, conversion:7.1, roas:127.1,
    tags:['Cart Abandonment','Automation','Triggered'], tiers:['all'],
    segments:makeSegs(), dailyData:makeDailyData(1700), weeklyRevenue:makeWeeklyRev(40),
    sender:'CRM Push', abTest:true, automation:true, createdBy:'Thanh Bình',
  },
  {
    id:'CAM-004', name:'Facebook & Instagram Sale Mùa Thu',
    type:'social', status:'active', goal:'awareness',
    description:'Quảng cáo social ads mùa thu target lookalike audience từ tệp khách hàng hiện tại.',
    startDate:'01/10/2024', endDate:'31/10/2024', budget:50000000, spent:31000000,
    audience:180000, sent:0, delivered:0, opened:0, clicked:28400, converted:1420, unsubscribed:0,
    revenue:355000000, openRate:0, clickRate:0, conversion:5.0, roas:11.5,
    tags:['Social Ads','Lookalike','Brand'], tiers:['all'],
    segments:makeSegs(), dailyData:makeDailyData(0), weeklyRevenue:makeWeeklyRev(50),
    abTest:true, automation:false, createdBy:'Ngọc Lan',
  },
  {
    id:'CAM-005', name:'Onboarding Email Mới Đăng Ký',
    type:'email', status:'active', goal:'conversion',
    description:'Chuỗi 7 email onboarding tự động cho khách mới, hướng dẫn tính năng và tặng voucher chào mừng.',
    startDate:'01/08/2024', endDate:'31/12/2024', budget:10000000, spent:4200000,
    audience:6840, sent:6840, delivered:6772, opened:4103, clicked:1226, converted:480, unsubscribed:41,
    revenue:120000000, openRate:60.6, clickRate:18.1, conversion:7.1, roas:28.6,
    tags:['Onboarding','Welcome','New User'], tiers:['Bronze'],
    segments:makeSegs(), dailyData:makeDailyData(900), weeklyRevenue:makeWeeklyRev(20),
    subject:'Chào mừng bạn! Đây là quà tặng đầu tiên 🎉', previewText:'Khám phá ưu đãi dành riêng cho bạn',
    sender:'hello@brand.vn', abTest:true, automation:true, createdBy:'Hoàng Nam',
  },
  {
    id:'CAM-006', name:'Google Display Ads Remarketing',
    type:'display', status:'active', goal:'reactivation',
    description:'Banner quảng cáo hiển thị lại cho khách đã ghé thăm website nhưng chưa mua hàng trong 30 ngày.',
    startDate:'05/10/2024', endDate:'05/11/2024', budget:30000000, spent:14000000,
    audience:45000, sent:0, delivered:0, opened:0, clicked:6750, converted:810, unsubscribed:0,
    revenue:202500000, openRate:0, clickRate:0, conversion:12.0, roas:14.5,
    tags:['Remarketing','Display','Google'], tiers:['all'],
    segments:makeSegs(), dailyData:makeDailyData(0), weeklyRevenue:makeWeeklyRev(30),
    abTest:false, automation:false, createdBy:'Tuấn Anh',
  },
  {
    id:'CAM-007', name:'Chiến Dịch Omnichannel 11.11',
    type:'omnichannel', status:'scheduled', goal:'conversion',
    description:'Kết hợp Email + SMS + Push + Social Ads cho siêu sale 11.11. Đa kênh đồng bộ, tối đa reach.',
    startDate:'10/11/2024', endDate:'12/11/2024', budget:100000000, spent:0,
    audience:85000, sent:0, delivered:0, opened:0, clicked:0, converted:0, unsubscribed:0,
    revenue:0, openRate:0, clickRate:0, conversion:0, roas:0,
    tags:['11.11','Omnichannel','Mega'], tiers:['all'],
    segments:makeSegs(), dailyData:makeDailyData(0), weeklyRevenue:makeWeeklyRev(0),
    subject:'[11.11] Siêu Sale Đồng Giá - Giảm đến 70%!',
    sender:'sale@brand.vn', abTest:false, automation:false, createdBy:'Minh Châu',
  },
  {
    id:'CAM-008', name:'Win-back Khách Không Mua 90 Ngày',
    type:'email', status:'paused', goal:'reactivation',
    description:'Email sequence tái kích hoạt khách hàng không mua trong 90 ngày với ưu đãi đặc biệt.',
    startDate:'01/09/2024', endDate:'30/11/2024', budget:8000000, spent:3100000,
    audience:4200, sent:4200, delivered:4158, opened:1456, clicked:291, converted:84, unsubscribed:96,
    revenue:21000000, openRate:35.0, clickRate:7.0, conversion:2.0, roas:6.8,
    tags:['Win-back','Inactive','Re-engagement'], tiers:['all'],
    segments:makeSegs(), dailyData:makeDailyData(500), weeklyRevenue:makeWeeklyRev(5),
    subject:'Chúng tôi nhớ bạn 💙 Quà 200K đang chờ!', previewText:'Đặc biệt chỉ dành cho bạn...',
    sender:'cskh@brand.vn', abTest:false, automation:true, createdBy:'Thanh Bình',
  },
  {
    id:'CAM-009', name:'SMS Birthday Reward Tự Động',
    type:'sms', status:'active', goal:'retention',
    description:'SMS tự động gửi vào ngày sinh nhật khách hàng kèm voucher và lời chúc cá nhân hóa.',
    startDate:'01/01/2024', endDate:'31/12/2024', budget:12000000, spent:8400000,
    audience:99999, sent:9840, delivered:9742, opened:0, clicked:0, converted:1968, unsubscribed:0,
    revenue:98400000, openRate:0, clickRate:0, conversion:20.2, roas:11.7,
    tags:['Birthday','Automation','CRM'], tiers:['all'],
    segments:makeSegs(), dailyData:makeDailyData(30), weeklyRevenue:makeWeeklyRev(15),
    sender:'BRAND', abTest:false, automation:true, createdBy:'Ngọc Lan',
  },
  {
    id:'CAM-010', name:'Black Friday Email Blast',
    type:'email', status:'draft', goal:'conversion',
    description:'Email blast Black Friday với thiết kế đặc biệt, đếm ngược và deal sốc giới hạn.',
    startDate:'28/11/2024', endDate:'29/11/2024', budget:20000000, spent:0,
    audience:45000, sent:0, delivered:0, opened:0, clicked:0, converted:0, unsubscribed:0,
    revenue:0, openRate:0, clickRate:0, conversion:0, roas:0,
    tags:['Black Friday','Draft','Blast'], tiers:['all'],
    segments:makeSegs(), dailyData:makeDailyData(0), weeklyRevenue:makeWeeklyRev(0),
    subject:'🔥 BLACK FRIDAY - Giảm đến 70% chỉ 24 giờ!', previewText:'Đồng hồ đang điếm ngược...',
    sender:'sale@brand.vn', abTest:true, automation:false, createdBy:'Hoàng Nam',
  },
];

// ─── UTILS ────────────────────────────────────────────────────────────────────

const fmt = (n: number): string => {
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1)}B`;
  if (n >= 1_000_000)     return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000)         return `${(n / 1_000).toFixed(0)}K`;
  return n.toLocaleString();
};

const budgetPct = (c: Campaign): number =>
  c.budget > 0 ? Math.min(100, Math.round((c.spent / c.budget) * 100)) : 0;

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

// ─── MINI SPARKLINE ───────────────────────────────────────────────────────────

const Sparkline: React.FC<{ data: DailyPoint[]; dataKey: string }> = ({ data, dataKey }) => (
  <ResponsiveContainer width="100%" height={36}>
    <AreaChart data={data} margin={{ top:2, right:0, bottom:0, left:0 }}>
      <defs>
        <linearGradient id="spkGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#E40F2A" stopOpacity={0.2}/>
          <stop offset="100%" stopColor="#E40F2A" stopOpacity={0}/>
        </linearGradient>
      </defs>
      <Area type="monotone" dataKey={dataKey} stroke="#E40F2A" strokeWidth={1.5} fill="url(#spkGrad)" dot={false}/>
    </AreaChart>
  </ResponsiveContainer>
);

// ─── FUNNEL CHART ─────────────────────────────────────────────────────────────

const FunnelChart: React.FC<{ campaign: Campaign }> = ({ campaign }) => {
  const steps: FunnelStep[] = [
    { label:'Audience',   value: campaign.audience,   pct:100 },
    { label:'Sent',       value: campaign.sent,        pct: campaign.audience > 0 ? Math.round((campaign.sent        / campaign.audience)   * 100) : 0 },
    { label:'Delivered',  value: campaign.delivered,   pct: campaign.sent      > 0 ? Math.round((campaign.delivered  / campaign.sent)        * 100) : 0 },
    { label:'Opened',     value: campaign.opened,      pct: campaign.delivered > 0 ? Math.round((campaign.opened     / campaign.delivered)   * 100) : 0 },
    { label:'Clicked',    value: campaign.clicked,     pct: campaign.opened    > 0 ? Math.round((campaign.clicked    / campaign.opened)      * 100) : 0 },
    { label:'Converted',  value: campaign.converted,   pct: campaign.clicked   > 0 ? Math.round((campaign.converted  / campaign.clicked)     * 100) : 0 },
  ].filter(s => s.value > 0);

  const colors = ['#E40F2A','#DA596C','#EEA9B3','#3b82f6','#22c55e','#7c3aed'];

  return (
    <div className="space-y-2">
      {steps.map((step, i) => (
        <div key={step.label} className="flex items-center gap-3">
          <div className="w-20 text-[11px] font-bold text-muted-foreground text-right">{step.label}</div>
          <div className="flex-1 h-6 bg-muted rounded-lg overflow-hidden relative">
            <div
              className="h-full rounded-lg flex items-center px-2 transition-all"
              style={{ width:`${Math.max(2, step.pct)}%`, background: colors[i] }}
            >
              <span className="text-[10px] font-black text-white whitespace-nowrap">{fmt(step.value)}</span>
            </div>
          </div>
          <div className="w-10 text-[11px] font-black text-foreground">{step.pct}%</div>
        </div>
      ))}
    </div>
  );
};

// ─── DETAIL PANEL ─────────────────────────────────────────────────────────────

interface DetailPanelProps { campaign: Campaign; onClose: () => void }
const DetailPanel: React.FC<DetailPanelProps> = ({ campaign, onClose }) => {
  const [panelTab, setPanelTab] = useState<PanelTab>('overview');
  const type   = typeConfig[campaign.type];
  const status = statusConfig[campaign.status];
  const goal   = goalConfig[campaign.goal];
  const bpct   = budgetPct(campaign);

  const panelTabs: { key: PanelTab; label: string }[] = [
    { key:'overview',    label:'Tổng quan'    },
    { key:'performance', label:'Hiệu suất'    },
    { key:'audience',    label:'Đối tượng'    },
    { key:'content',     label:'Nội dung'     },
  ];

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-foreground/20 backdrop-blur-sm" onClick={onClose}/>
      <div className="relative w-full max-w-2xl bg-card border-l border-border flex flex-col h-full shadow-2xl">

        {/* Banner */}
        <div className="bg-primary px-6 pt-5 pb-0 relative overflow-hidden flex-shrink-0">
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="absolute -right-10 -top-10 w-52 h-52 rounded-full bg-white"/>
            <div className="absolute right-10 -bottom-14 w-80 h-80 rounded-full bg-white"/>
          </div>
          <div className="relative z-10">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-black bg-white/20 text-white border border-white/30 px-2 py-0.5 rounded-full">{campaign.id}</span>
                <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${type.bg} ${type.text} ${type.border}`}>{type.label}</span>
                <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${status.bg} ${status.text} ${status.border}`}>{status.label}</span>
              </div>
              <button onClick={onClose} className="p-1.5 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-all"><X size={14}/></button>
            </div>
            <h2 className="text-lg font-black text-white leading-snug mb-1">{campaign.name}</h2>
            <p className="text-white/70 text-sm mb-3 line-clamp-2">{campaign.description}</p>
            {/* KPI strip */}
            <div className="flex gap-3 flex-wrap pb-4">
              {[
                { label:'Doanh thu', value:`${fmt(campaign.revenue)}₫` },
                { label:'Chuyển đổi', value:`${campaign.conversion}%`  },
                { label:'ROAS', value:`${campaign.roas}x`              },
                { label:'Đối tượng', value:fmt(campaign.audience)      },
              ].map(k => (
                <div key={k.label} className="bg-white/15 border border-white/25 rounded-xl px-3 py-1.5 text-center min-w-[70px]">
                  <div className="text-base font-black text-white">{k.value}</div>
                  <div className="text-[10px] text-white/60">{k.label}</div>
                </div>
              ))}
            </div>
          </div>
          {/* Sub-tabs */}
          <div className="flex items-center gap-1 border-t border-white/20 pt-1">
            {panelTabs.map(t => (
              <button key={t.key} onClick={() => setPanelTab(t.key)}
                className={`pb-2.5 px-2 pt-2 text-[11px] font-black transition-all ${panelTab === t.key ? 'text-white border-b-2 border-white' : 'text-white/50 hover:text-white/80'}`}>
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Panel body */}
        <div className="flex-1 overflow-y-auto">

          {/* OVERVIEW */}
          {panelTab === 'overview' && (
            <div className="px-6 py-5 space-y-5">
              {/* Meta info */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label:'Ngày bắt đầu',   value:campaign.startDate,  icon:<Calendar size={12}/> },
                  { label:'Ngày kết thúc',   value:campaign.endDate,    icon:<Calendar size={12}/> },
                  { label:'Mục tiêu',        value:goal.label,          icon:goal.icon             },
                  { label:'Tạo bởi',         value:campaign.createdBy,  icon:<Users size={12}/>    },
                  { label:'A/B Test',        value:campaign.abTest      ? '✓ Bật' : 'Tắt',        icon:<BarChart2 size={12}/> },
                  { label:'Tự động hoá',     value:campaign.automation  ? '✓ Bật' : 'Tắt',        icon:<Zap size={12}/>      },
                ].map(item => (
                  <div key={item.label} className="bg-secondary border border-border rounded-xl p-3 flex items-start gap-2">
                    <div className="text-primary mt-0.5 flex-shrink-0">{item.icon}</div>
                    <div>
                      <div className="text-[10px] text-muted-foreground">{item.label}</div>
                      <div className="text-xs font-bold text-foreground mt-0.5">{item.value}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Budget */}
              <div className="bg-secondary border border-border rounded-2xl p-4 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-black text-foreground">Ngân sách</span>
                  <span className="text-sm font-black text-foreground">{fmt(campaign.spent)}₫ / {fmt(campaign.budget)}₫</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className={`h-full rounded-full transition-all ${bpct > 85 ? 'bg-red-500' : bpct > 60 ? 'bg-amber-500' : 'bg-primary'}`} style={{ width:`${bpct}%` }}/>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className={`font-bold ${bpct > 85 ? 'text-red-500' : 'text-muted-foreground'}`}>{bpct}% đã tiêu{bpct > 85 ? ' — Gần hết!' : ''}</span>
                  <span className="text-muted-foreground">Còn lại: {fmt(campaign.budget - campaign.spent)}₫</span>
                </div>
              </div>

              {/* Tags */}
              <div>
                <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-2">Tags</div>
                <div className="flex flex-wrap gap-1.5">
                  {campaign.tags.map(t => (
                    <span key={t} className="text-[10px] px-2.5 py-1 bg-secondary border border-border rounded-full text-muted-foreground font-medium">{t}</span>
                  ))}
                  {campaign.automation && <span className="text-[10px] px-2.5 py-1 bg-violet-50 border border-violet-200 text-violet-700 rounded-full font-bold flex items-center gap-1"><Zap size={9}/> Tự động</span>}
                  {campaign.abTest    && <span className="text-[10px] px-2.5 py-1 bg-blue-50 border border-blue-200 text-blue-700 rounded-full font-bold flex items-center gap-1"><BarChart2 size={9}/> A/B Test</span>}
                </div>
              </div>

              {/* 7-day trend */}
              <div className="bg-secondary border border-border rounded-2xl p-4">
                <div className="text-xs font-black text-muted-foreground uppercase tracking-widest mb-3">Xu hướng 7 ngày — Gửi / Mở / Click</div>
                <ResponsiveContainer width="100%" height={120}>
                  <LineChart data={campaign.dailyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false}/>
                    <XAxis dataKey="day" tick={{ fontSize:10, fill:'var(--muted-foreground)' }} axisLine={false} tickLine={false}/>
                    <YAxis tick={{ fontSize:10, fill:'var(--muted-foreground)' }} axisLine={false} tickLine={false} width={30}/>
                    <RTooltip contentStyle={{ background:'var(--card)', border:'1px solid var(--border)', borderRadius:'10px', fontSize:'11px', color:'var(--foreground)' }}/>
                    <Line type="monotone" dataKey="sent"   stroke="#E40F2A" strokeWidth={2} dot={false}/>
                    <Line type="monotone" dataKey="opened" stroke="#22c55e" strokeWidth={2} dot={false}/>
                    <Line type="monotone" dataKey="clicked"stroke="#3b82f6" strokeWidth={2} dot={false}/>
                  </LineChart>
                </ResponsiveContainer>
                <div className="flex items-center gap-4 mt-2">
                  {[['#E40F2A','Gửi'],['#22c55e','Mở'],['#3b82f6','Click']].map(([color, label]) => (
                    <span key={label} className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                      <span className="h-2 w-3 rounded-sm inline-block" style={{ background:color }}/>{label}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* PERFORMANCE */}
          {panelTab === 'performance' && (
            <div className="px-6 py-5 space-y-5">
              {/* KPI grid */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label:'Open Rate',     value:`${campaign.openRate}%`,  good: campaign.openRate >= 25  },
                  { label:'Click Rate',    value:`${campaign.clickRate}%`, good: campaign.clickRate >= 10 },
                  { label:'Conversion',    value:`${campaign.conversion}%`,good: campaign.conversion >= 5 },
                  { label:'Unsub Rate',    value: campaign.sent > 0 ? `${((campaign.unsubscribed / campaign.sent) * 100).toFixed(1)}%` : '—', good: campaign.unsubscribed / Math.max(1, campaign.sent) < 0.01 },
                  { label:'Deliverability',value: campaign.sent > 0 ? `${Math.round((campaign.delivered / campaign.sent) * 100)}%` : '—',  good: campaign.delivered / Math.max(1,campaign.sent) >= 0.95 },
                  { label:'ROAS',          value:`${campaign.roas}x`,      good: campaign.roas >= 10      },
                ].map(m => (
                  <div key={m.label} className="bg-secondary border border-border rounded-xl p-3 text-center">
                    <div className={`text-xl font-black ${m.value === '—' ? 'text-muted-foreground' : m.good ? 'text-green-600' : 'text-red-500'}`}>{m.value}</div>
                    <div className="text-[10px] text-muted-foreground mt-0.5">{m.label}</div>
                    {m.value !== '—' && <div className={`text-[9px] font-bold mt-0.5 ${m.good ? 'text-green-600' : 'text-red-500'}`}>{m.good ? '✓ Tốt' : '⚠ Cần cải thiện'}</div>}
                  </div>
                ))}
              </div>

              {/* Funnel */}
              <div className="bg-secondary border border-border rounded-2xl p-4">
                <div className="text-xs font-black text-muted-foreground uppercase tracking-widest mb-4">Phễu chuyển đổi</div>
                <FunnelChart campaign={campaign}/>
              </div>

              {/* Revenue chart */}
              <div className="bg-secondary border border-border rounded-2xl p-4">
                <div className="text-xs font-black text-muted-foreground uppercase tracking-widest mb-3">Doanh thu theo tuần (triệu ₫)</div>
                <ResponsiveContainer width="100%" height={100}>
                  <RBarChart data={campaign.weeklyRevenue} barSize={20}>
                    <XAxis dataKey="week" tick={{ fontSize:10, fill:'var(--muted-foreground)' }} axisLine={false} tickLine={false}/>
                    <RTooltip contentStyle={{ background:'var(--card)', border:'1px solid var(--border)', borderRadius:'10px', fontSize:'11px', color:'var(--foreground)' }}/>
                    <Bar dataKey="revenue" radius={[4,4,0,0]}>
                      {campaign.weeklyRevenue.map((_, i) => <Cell key={i} fill={i === campaign.weeklyRevenue.length - 1 ? '#E40F2A' : 'var(--muted)'}/>)}
                    </Bar>
                  </RBarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* AUDIENCE */}
          {panelTab === 'audience' && (
            <div className="px-6 py-5 space-y-5">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-secondary border border-border rounded-xl p-4 text-center">
                  <div className="text-2xl font-black text-foreground">{fmt(campaign.audience)}</div>
                  <div className="text-[11px] text-muted-foreground">Tổng đối tượng</div>
                </div>
                <div className="bg-secondary border border-border rounded-xl p-4 text-center">
                  <div className="text-2xl font-black text-foreground">{campaign.tiers.join(', ') === 'all' ? 'Tất cả' : campaign.tiers.join(', ')}</div>
                  <div className="text-[11px] text-muted-foreground">Phân hạng</div>
                </div>
              </div>

              <div className="bg-secondary border border-border rounded-2xl p-4">
                <div className="text-xs font-black text-muted-foreground uppercase tracking-widest mb-4">Phân bổ hạng thành viên</div>
                <div className="space-y-3">
                  {campaign.segments.map((seg, i) => {
                    const colors = ['#6366f1','#f59e0b','#94a3b8','#d97706'];
                    return (
                      <div key={seg.label} className="flex items-center gap-3">
                        <span className="text-[11px] font-bold text-foreground w-16">{seg.label}</span>
                        <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                          <div className="h-full rounded-full" style={{ width:`${seg.pct}%`, background:colors[i] }}/>
                        </div>
                        <span className="text-[11px] font-black text-foreground w-16 text-right">{seg.count.toLocaleString()} ({seg.pct}%)</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3">
                <Info size={14} className="text-amber-600 flex-shrink-0 mt-0.5"/>
                <div className="text-[11px] text-amber-700">
                  <p className="font-bold mb-1">Gợi ý tối ưu đối tượng</p>
                  <p>Tỷ lệ chuyển đổi của nhóm <strong>Platinum</strong> cao hơn 3x so với trung bình. Cân nhắc tăng ngân sách cho phân khúc này.</p>
                </div>
              </div>
            </div>
          )}

          {/* CONTENT */}
          {panelTab === 'content' && (
            <div className="px-6 py-5 space-y-5">
              {campaign.subject ? (
                <>
                  <div className="space-y-3">
                    {[
                      { label:'Tiêu đề email', value: campaign.subject      },
                      { label:'Preview text',  value: campaign.previewText  },
                      { label:'Người gửi',     value: campaign.sender       },
                    ].map(f => f.value && (
                      <div key={f.label} className="bg-secondary border border-border rounded-xl p-4">
                        <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">{f.label}</div>
                        <div className="text-sm font-bold text-foreground">{f.value}</div>
                      </div>
                    ))}
                  </div>
                  {campaign.abTest && (
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                      <div className="text-[11px] font-black text-blue-700 flex items-center gap-1.5 mb-2"><BarChart2 size={12}/> A/B Test đang chạy</div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-white border border-blue-100 rounded-lg p-3">
                          <div className="text-[10px] font-black text-blue-500 mb-1">VARIANT A</div>
                          <div className="text-xs font-bold text-foreground line-clamp-2">{campaign.subject}</div>
                          <div className="text-[10px] text-blue-600 mt-2 font-bold">Open rate: 52.4%</div>
                        </div>
                        <div className="bg-white border border-blue-100 rounded-lg p-3">
                          <div className="text-[10px] font-black text-blue-500 mb-1">VARIANT B</div>
                          <div className="text-xs font-bold text-foreground line-clamp-2">{campaign.subject?.replace('🎁','✨')}</div>
                          <div className="text-[10px] text-blue-600 mt-2 font-bold">Open rate: 49.8%</div>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <FileText size={28} className="mx-auto mb-3 opacity-40"/>
                  <p className="font-bold text-foreground">Không có nội dung văn bản</p>
                  <p className="text-sm mt-1">Chiến dịch này sử dụng kênh {typeConfig[campaign.type].label}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 p-4 border-t border-border flex gap-2 bg-card">
          <button className="flex-1 py-3 bg-primary hover:bg-primary-light text-white font-black rounded-xl text-sm transition-all flex items-center justify-center gap-2 shadow shadow-primary/25">
            <Edit size={14}/> Chỉnh sửa
          </button>
          {campaign.status === 'active' && (
            <button className="py-3 px-4 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-xl text-sm font-bold border border-amber-200 transition-all flex items-center gap-2">
              <Pause size={14}/> Tạm dừng
            </button>
          )}
          {campaign.status === 'paused' && (
            <button className="py-3 px-4 bg-green-50 hover:bg-green-100 text-green-700 rounded-xl text-sm font-bold border border-green-200 transition-all flex items-center gap-2">
              <Play size={14}/> Tiếp tục
            </button>
          )}
          {campaign.status === 'draft' && (
            <button className="py-3 px-4 bg-green-50 hover:bg-green-100 text-green-700 rounded-xl text-sm font-bold border border-green-200 transition-all flex items-center gap-2">
              <Send size={14}/> Kích hoạt
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

// ─── GRID CARD ────────────────────────────────────────────────────────────────

interface GridCardProps { campaign: Campaign; onClick: () => void }
const GridCard: React.FC<GridCardProps> = ({ campaign, onClick }) => {
  const type   = typeConfig[campaign.type];
  const status = statusConfig[campaign.status];
  const goal   = goalConfig[campaign.goal];
  const bpct   = budgetPct(campaign);

  return (
    <div onClick={onClick} className="bg-card border border-border rounded-2xl p-5 hover:border-primary/40 hover:shadow-md transition-all cursor-pointer group space-y-4">
      <div className="flex items-start justify-between gap-2">
        <div className="space-y-1.5 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className={`inline-flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-lg border ${type.bg} ${type.text} ${type.border}`}>{type.icon} {type.label}</span>
            <span className={`inline-flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-lg border ${status.bg} ${status.text} ${status.border}`}>
              <span className={`h-1.5 w-1.5 rounded-full ${status.dot} ${status.pulse ? 'animate-pulse' : ''}`}/>{status.label}
            </span>
          </div>
          <p className="text-sm font-black text-foreground group-hover:text-primary transition-colors leading-tight">{campaign.name}</p>
        </div>
        <span className={`text-[10px] font-bold flex items-center gap-1 flex-shrink-0 ${goal.color}`}>{goal.icon} {goal.label}</span>
      </div>

      <div className="grid grid-cols-3 gap-2 text-center">
        {[
          { label:'Doanh thu',    value:`${fmt(campaign.revenue)}₫`  },
          { label:'Chuyển đổi',  value:`${campaign.conversion}%`    },
          { label:'ROAS',        value:`${campaign.roas}x`           },
        ].map(s => (
          <div key={s.label} className="bg-secondary rounded-xl p-2 border border-border">
            <div className="text-xs font-black text-foreground">{s.value}</div>
            <div className="text-[9px] text-muted-foreground">{s.label}</div>
          </div>
        ))}
      </div>

      <Sparkline data={campaign.dailyData} dataKey="sent"/>

      {campaign.budget > 0 && (
        <div className="space-y-1">
          <div className="flex justify-between text-[10px]">
            <span className="text-muted-foreground">Ngân sách</span>
            <span className={`font-black ${bpct > 85 ? 'text-red-500' : 'text-foreground'}`}>{bpct}%</span>
          </div>
          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
            <div className={`h-full rounded-full ${bpct > 85 ? 'bg-red-500' : bpct > 60 ? 'bg-amber-500' : 'bg-primary'}`} style={{ width:`${bpct}%` }}/>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between text-[10px] text-muted-foreground border-t border-border pt-2">
        <span className="flex items-center gap-1"><Users size={10}/> {fmt(campaign.audience)}</span>
        <span className="flex items-center gap-1"><Calendar size={10}/> {campaign.startDate}</span>
        {campaign.automation && <span className="flex items-center gap-1 text-violet-600 font-bold"><Zap size={9}/> Auto</span>}
        {campaign.abTest     && <span className="flex items-center gap-1 text-blue-600 font-bold"><BarChart2 size={9}/> A/B</span>}
      </div>
    </div>
  );
};

// ─── MAIN ─────────────────────────────────────────────────────────────────────

export default function CampaignManagement() {
  const [search, setSearch]         = useState('');
  const [activeTab, setActiveTab]   = useState<ActiveTab>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterGoal, setFilterGoal] = useState<string>('all');
  const [sortCol, setSortCol]       = useState<SortCol>('startDate');
  const [sortDir, setSortDir]       = useState<SortDir>('desc');
  const [selected, setSelected]     = useState<string[]>([]);
  const [detail, setDetail]         = useState<Campaign | null>(null);
  const [viewMode, setViewMode]     = useState<ViewMode>('table');

  const filtered = useMemo<Campaign[]>(() => {
    return CAMPAIGNS.filter(c => {
      const q        = search.toLowerCase();
      const matchQ   = c.name.toLowerCase().includes(q) || c.id.toLowerCase().includes(q) || c.tags.some(t => t.toLowerCase().includes(q));
      const matchTab = activeTab === 'all' || c.status === activeTab;
      const matchTyp = filterType === 'all' || c.type === filterType;
      const matchGol = filterGoal === 'all' || c.goal === filterGoal;
      return matchQ && matchTab && matchTyp && matchGol;
    }).sort((a, b) => {
      const d = sortDir === 'asc' ? 1 : -1;
      if (sortCol === 'sent')       return (a.sent       - b.sent)       * d;
      if (sortCol === 'openRate')   return (a.openRate   - b.openRate)   * d;
      if (sortCol === 'conversion') return (a.conversion - b.conversion) * d;
      if (sortCol === 'revenue')    return (a.revenue    - b.revenue)    * d;
      return 0;
    });
  }, [search, activeTab, filterType, filterGoal, sortCol, sortDir]);

  const toggleSelect = (id: string) => setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);
  const toggleAll    = () => setSelected(selected.length === filtered.length ? [] : filtered.map(c => c.id));

  const tabCount = (tab: ActiveTab): number =>
    tab === 'all' ? CAMPAIGNS.length : CAMPAIGNS.filter(c => c.status === tab).length;

  const handleSort = (col: SortCol) => {
    if (sortCol === col) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortCol(col); setSortDir('desc'); }
  };

  const SortIcon: React.FC<{ col: SortCol }> = ({ col }) =>
    sortCol === col
      ? (sortDir === 'desc' ? <ChevronDown size={11} className="text-primary"/> : <ChevronUp size={11} className="text-primary"/>)
      : <ChevronDown size={11} className="text-muted-foreground/40"/>;

  const totalRevenue  = CAMPAIGNS.reduce((s, c) => s + c.revenue, 0);
  const totalBudget   = CAMPAIGNS.reduce((s, c) => s + c.budget, 0);
  const totalSpent    = CAMPAIGNS.reduce((s, c) => s + c.spent, 0);
  const totalSent     = CAMPAIGNS.reduce((s, c) => s + c.sent, 0);
  const avgConv       = +(CAMPAIGNS.filter(c => c.conversion > 0).reduce((s, c) => s + c.conversion, 0) / Math.max(1, CAMPAIGNS.filter(c => c.conversion > 0).length)).toFixed(1);
  const avgRoas       = +(CAMPAIGNS.filter(c => c.roas > 0).reduce((s, c) => s + c.roas, 0) / Math.max(1, CAMPAIGNS.filter(c => c.roas > 0).length)).toFixed(1);

  // aggregate for charts
  const typeBreakdown = Object.entries(typeConfig).map(([key, cfg]) => ({
    ...cfg, key,
    count: CAMPAIGNS.filter(c => c.type === key).length,
    revenue: CAMPAIGNS.filter(c => c.type === key).reduce((s, c) => s + c.revenue, 0),
  })).filter(t => t.count > 0);

  const weeklyAgg: { week: string; revenue: number }[] =
    ['T1','T2','T3','T4','T5','T6','T7','T8'].map(week => ({
      week,
      revenue: Math.round(CAMPAIGNS.reduce((s, c) => {
        const pt = c.weeklyRevenue.find(w => w.week === week);
        return s + (pt?.revenue ?? 0);
      }, 0)),
    }));

  return (
    <div className="min-h-screen bg-background text-foreground">
      {detail && <DetailPanel campaign={detail} onClose={() => setDetail(null)}/>}

      {/* Nav */}
      <div className="border-b border-border bg-card px-6 py-3 flex items-center justify-between sticky top-0 z-40 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="h-7 w-7 bg-primary rounded-lg flex items-center justify-center shadow-md shadow-primary/30">
            <Megaphone size={13} className="text-white"/>
          </div>
          <span className="font-black text-foreground text-sm tracking-tight">CRM Pro</span>
          <span className="text-muted-foreground mx-1 text-sm">›</span>
          <span className="text-muted-foreground text-sm">Chiến dịch Marketing</span>
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
            <h1 className="text-3xl font-black tracking-tight text-foreground">Chiến dịch</h1>
            <p className="text-muted-foreground text-sm mt-1">Lập kế hoạch, triển khai và đo lường hiệu suất toàn bộ chiến dịch marketing</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-4 py-2.5 bg-secondary hover:bg-muted border border-border rounded-xl text-sm font-bold text-foreground flex items-center gap-2 transition-all">
              <Download size={14}/> Báo cáo
            </button>
            <button className="px-4 py-2.5 bg-primary hover:bg-primary-light rounded-xl text-sm font-black text-white flex items-center gap-2 transition-all shadow-lg shadow-primary/25">
              <Plus size={14}/> Tạo chiến dịch
            </button>
          </div>
        </div>

        {/* KPI row */}
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
          <StatCard highlight icon={<Megaphone size={15} className="text-white"/>} label="Tổng chiến dịch"    value={String(CAMPAIGNS.length)}                         trend="+3"     trendUp  sub={`${CAMPAIGNS.filter(c=>c.status==='active').length} đang chạy`}/>
          <StatCard icon={<Send size={15}/>}         label="Tổng tin đã gửi"       value={fmt(totalSent)}                                       trend="+18.4%" trendUp  sub="Tuần này"/>
          <StatCard icon={<DollarSign size={15}/>}   label="Doanh thu phát sinh"   value={`${fmt(totalRevenue)}₫`}                              trend="+24.1%" trendUp  sub="Từ tất cả campaigns"/>
          <StatCard icon={<Target size={15}/>}       label="Chuyển đổi trung bình" value={`${avgConv}%`}                                        trend="+2.3%"  trendUp  sub="Toàn bộ kênh"/>
          <StatCard icon={<BarChart2 size={15}/>}    label="ROAS trung bình"       value={`${avgRoas}x`}                                        trend="+8.1%"  trendUp  sub="Return on ad spend"/>
          <StatCard icon={<Activity size={15}/>}     label="Ngân sách đã tiêu"     value={`${fmt(totalSpent)}₫`}                               trend={`${Math.round((totalSpent/totalBudget)*100)}%`} trendUp={totalSpent/totalBudget < 0.85} sub={`/ ${fmt(totalBudget)}₫ tổng`}/>
        </div>

        {/* Charts row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Revenue area */}
          <div className="lg:col-span-2 bg-card border border-border rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-sm font-black text-foreground">Doanh thu tổng hợp từ campaigns</div>
                <div className="text-[11px] text-muted-foreground mt-0.5">Tích lũy theo tuần (triệu ₫)</div>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={weeklyAgg}>
                <defs>
                  <linearGradient id="camRevGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#E40F2A" stopOpacity={0.15}/>
                    <stop offset="100%" stopColor="#E40F2A" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false}/>
                <XAxis dataKey="week" tick={{ fontSize:10, fill:'var(--muted-foreground)' }} axisLine={false} tickLine={false}/>
                <YAxis tick={{ fontSize:10, fill:'var(--muted-foreground)' }} axisLine={false} tickLine={false}/>
                <RTooltip contentStyle={{ background:'var(--card)', border:'1px solid var(--border)', borderRadius:'12px', fontSize:'12px', color:'var(--foreground)' }}/>
                <Area type="monotone" dataKey="revenue" stroke="#E40F2A" strokeWidth={2.5} fill="url(#camRevGrad)"/>
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Side panels */}
          <div className="space-y-4">
            {/* Channel breakdown */}
            <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
              <div className="text-sm font-black text-foreground mb-4">Phân bổ theo kênh</div>
              <div className="space-y-2.5">
                {typeBreakdown.map(t => (
                  <div key={t.key} className="flex items-center gap-2.5">
                    <div className={`p-1.5 rounded-lg ${t.bg} ${t.text} flex-shrink-0`}>{t.icon}</div>
                    <div className="flex-1">
                      <div className="flex justify-between mb-0.5">
                        <span className="text-[11px] font-bold text-foreground">{t.label}</span>
                        <span className="text-[11px] font-black text-foreground">{t.count}</span>
                      </div>
                      <div className="h-1 bg-muted rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width:`${Math.round((t.count / CAMPAIGNS.length) * 100)}%`, background:t.color }}/>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Goal breakdown */}
            <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
              <div className="text-sm font-black text-foreground mb-3">Theo mục tiêu</div>
              <div className="space-y-2">
                {Object.entries(goalConfig).map(([key, cfg]) => {
                  const count = CAMPAIGNS.filter(c => c.goal === key).length;
                  if (!count) return null;
                  return (
                    <div key={key} className="flex items-center justify-between py-1">
                      <span className={`text-[11px] font-bold flex items-center gap-1.5 ${cfg.color}`}>{cfg.icon} {cfg.label}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-1.5 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-primary rounded-full" style={{ width:`${(count / CAMPAIGNS.length) * 100}%` }}/>
                        </div>
                        <span className="text-[11px] font-black text-foreground w-4">{count}</span>
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
                <select value={filterType} onChange={e => setFilterType(e.target.value)}
                  className="bg-card border border-border rounded-xl text-[11px] font-bold text-foreground px-3 py-2 focus:outline-none focus:border-primary/50">
                  <option value="all">Tất cả kênh</option>
                  {Object.entries(typeConfig).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                </select>
                <select value={filterGoal} onChange={e => setFilterGoal(e.target.value)}
                  className="bg-card border border-border rounded-xl text-[11px] font-bold text-foreground px-3 py-2 focus:outline-none focus:border-primary/50">
                  <option value="all">Tất cả mục tiêu</option>
                  {Object.entries(goalConfig).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                </select>
                {([['sent','Đã gửi',<Send size={11}/>],['openRate','Open Rate',<MailOpen size={11}/>],['conversion','Chuyển đổi',<Target size={11}/>],['revenue','Doanh thu',<DollarSign size={11}/>]] as [SortCol, string, React.ReactNode][]).map(([col, label, icon]) => (
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
                    placeholder="Tìm tên, ID, tag..."
                    className="w-full bg-card border border-border rounded-xl pl-9 pr-8 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-all"/>
                  {search && <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"><X size={11}/></button>}
                </div>
                <div className="flex items-center gap-0.5 bg-card border border-border rounded-xl p-1">
                  {([['table', <List size={13}/>], ['grid', <LayoutGrid size={13}/>]] as [ViewMode, React.ReactNode][]).map(([m, ic]) => (
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
                {([['Kích hoạt', <Play size={11}/>], ['Tạm dừng', <Pause size={11}/>], ['Nhân bản', <Copy size={11}/>], ['Xóa', <Trash2 size={11}/>]] as [string, React.ReactNode][]).map(([label, icon]) => (
                  <button key={label} className="px-3 py-1 bg-card hover:bg-secondary text-foreground rounded-lg text-[11px] font-bold flex items-center gap-1.5 transition-all border border-border">{icon} {label}</button>
                ))}
              </div>
              <button onClick={() => setSelected([])} className="ml-auto text-muted-foreground hover:text-foreground"><X size={13}/></button>
            </div>
          )}

          {/* Grid view */}
          {viewMode === 'grid' ? (
            <div className="p-5 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filtered.map(c => <GridCard key={c.id} campaign={c} onClick={() => setDetail(c)}/>)}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-secondary/30">
                    <th className="px-5 py-3 text-left w-10">
                      <input type="checkbox" checked={selected.length === filtered.length && filtered.length > 0} onChange={toggleAll} className="accent-primary cursor-pointer"/>
                    </th>
                    <th className="px-2 py-3 text-left text-[10px] font-black text-muted-foreground uppercase tracking-widest min-w-[260px]">Chiến dịch</th>
                    <th className="px-2 py-3 text-left text-[10px] font-black text-muted-foreground uppercase tracking-widest">Kênh / Mục tiêu</th>
                    <th className="px-2 py-3 text-left text-[10px] font-black text-muted-foreground uppercase tracking-widest">Trạng thái</th>
                    <th className="px-2 py-3 text-left text-[10px] font-black text-muted-foreground uppercase tracking-widest cursor-pointer hover:text-foreground select-none" onClick={() => handleSort('sent')}>
                      <span className="flex items-center gap-1">Gửi / Mở <SortIcon col="sent"/></span>
                    </th>
                    <th className="px-2 py-3 text-left text-[10px] font-black text-muted-foreground uppercase tracking-widest cursor-pointer hover:text-foreground select-none" onClick={() => handleSort('conversion')}>
                      <span className="flex items-center gap-1">Chuyển đổi <SortIcon col="conversion"/></span>
                    </th>
                    <th className="px-2 py-3 text-left text-[10px] font-black text-muted-foreground uppercase tracking-widest cursor-pointer hover:text-foreground select-none" onClick={() => handleSort('revenue')}>
                      <span className="flex items-center gap-1">Doanh thu <SortIcon col="revenue"/></span>
                    </th>
                    <th className="px-2 py-3 text-left text-[10px] font-black text-muted-foreground uppercase tracking-widest">Ngân sách</th>
                    <th className="px-5 py-3 text-right text-[10px] font-black text-muted-foreground uppercase tracking-widest">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(campaign => {
                    const type   = typeConfig[campaign.type];
                    const status = statusConfig[campaign.status];
                    const goal   = goalConfig[campaign.goal];
                    const bpct   = budgetPct(campaign);
                    const isSel  = selected.includes(campaign.id);

                    return (
                      <tr key={campaign.id} className={`border-b border-border/60 transition-colors group ${isSel ? 'bg-primary/[0.02]' : 'hover:bg-secondary/30'}`}>
                        <td className="px-5 py-4">
                          <input type="checkbox" checked={isSel} onChange={() => toggleSelect(campaign.id)} className="accent-primary cursor-pointer"/>
                        </td>
                        <td className="px-2 py-4">
                          <div className="space-y-1.5">
                            <div className="flex items-center gap-1.5">
                              <span className="text-[10px] font-black text-primary">{campaign.id}</span>
                              {campaign.automation && <span className="text-[9px] bg-violet-50 text-violet-700 border border-violet-200 px-1.5 py-0.5 rounded-full font-bold flex items-center gap-0.5"><Zap size={8}/> Auto</span>}
                              {campaign.abTest     && <span className="text-[9px] bg-blue-50 text-blue-700 border border-blue-200 px-1.5 py-0.5 rounded-full font-bold">A/B</span>}
                            </div>
                            <p className="text-sm font-black text-foreground group-hover:text-primary transition-colors cursor-pointer leading-tight" onClick={() => setDetail(campaign)}>
                              {campaign.name}
                            </p>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-[10px] text-muted-foreground flex items-center gap-1"><Calendar size={9}/>{campaign.startDate} → {campaign.endDate}</span>
                              <span className="text-[10px] text-muted-foreground flex items-center gap-1"><Users size={9}/>{fmt(campaign.audience)}</span>
                            </div>
                            <div className="flex gap-1 flex-wrap">
                              {campaign.tags.slice(0,3).map(t => (
                                <span key={t} className="text-[9px] px-1.5 py-0.5 bg-secondary border border-border rounded-full text-muted-foreground">{t}</span>
                              ))}
                            </div>
                          </div>
                        </td>
                        <td className="px-2 py-4">
                          <div className="space-y-1.5">
                            <span className={`inline-flex items-center gap-1 text-[10px] font-black px-2 py-1 rounded-lg border ${type.bg} ${type.text} ${type.border}`}>{type.icon} {type.label}</span>
                            <div className={`flex items-center gap-1 text-[10px] font-bold ${goal.color}`}>{goal.icon} {goal.label}</div>
                          </div>
                        </td>
                        <td className="px-2 py-4">
                          <span className={`inline-flex items-center gap-1.5 text-[10px] font-black px-2 py-1 rounded-lg border ${status.bg} ${status.text} ${status.border}`}>
                            <span className={`h-1.5 w-1.5 rounded-full ${status.dot} ${status.pulse ? 'animate-pulse' : ''}`}/>{status.label}
                          </span>
                        </td>
                        <td className="px-2 py-4">
                          {campaign.sent > 0 ? (
                            <div className="space-y-0.5">
                              <div className="text-sm font-black text-foreground">{fmt(campaign.sent)}</div>
                              {campaign.openRate > 0 && (
                                <div className="flex items-center gap-1">
                                  <MailOpen size={10} className="text-muted-foreground"/>
                                  <span className="text-[11px] font-bold text-foreground">{campaign.openRate}%</span>
                                  <span className="text-[10px] text-muted-foreground">open</span>
                                </div>
                              )}
                              {campaign.clickRate > 0 && (
                                <div className="flex items-center gap-1">
                                  <MousePointer size={10} className="text-muted-foreground"/>
                                  <span className="text-[11px] font-bold text-foreground">{campaign.clickRate}%</span>
                                  <span className="text-[10px] text-muted-foreground">click</span>
                                </div>
                              )}
                            </div>
                          ) : (
                            <span className="text-[11px] text-muted-foreground italic">Chưa gửi</span>
                          )}
                        </td>
                        <td className="px-2 py-4">
                          {campaign.conversion > 0 ? (
                            <div>
                              <div className="text-sm font-black text-foreground">{campaign.conversion}%</div>
                              <div className="text-[10px] text-muted-foreground">{fmt(campaign.converted)} đơn</div>
                              <div className="flex items-center gap-1 mt-0.5">
                                {campaign.roas >= 20 ? <TrendingUp size={10} className="text-green-500"/> : campaign.roas >= 10 ? <TrendingUp size={10} className="text-amber-500"/> : <TrendingDown size={10} className="text-red-500"/>}
                                <span className={`text-[10px] font-bold ${campaign.roas >= 20 ? 'text-green-600' : campaign.roas >= 10 ? 'text-amber-600' : 'text-red-500'}`}>ROAS {campaign.roas}x</span>
                              </div>
                            </div>
                          ) : <span className="text-[11px] text-muted-foreground italic">—</span>}
                        </td>
                        <td className="px-2 py-4">
                          {campaign.revenue > 0 ? (
                            <div>
                              <div className="text-sm font-black text-foreground">{fmt(campaign.revenue)}₫</div>
                              <div className="mt-1.5 w-16"><Sparkline data={campaign.dailyData} dataKey="sent"/></div>
                            </div>
                          ) : <span className="text-[11px] text-muted-foreground italic">—</span>}
                        </td>
                        <td className="px-2 py-4">
                          <div className="w-24 space-y-1">
                            <div className="flex justify-between text-[10px]">
                              <span className="text-muted-foreground">{fmt(campaign.spent)}₫</span>
                              <span className={`font-black ${bpct > 85 ? 'text-red-500' : 'text-foreground'}`}>{bpct}%</span>
                            </div>
                            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                              <div className={`h-full rounded-full ${bpct > 85 ? 'bg-red-500' : bpct > 60 ? 'bg-amber-500' : 'bg-primary'}`} style={{ width:`${bpct}%` }}/>
                            </div>
                            <div className="text-[9px] text-muted-foreground">/{fmt(campaign.budget)}₫</div>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-all">
                            <button className="p-1.5 rounded-lg bg-secondary hover:bg-muted text-muted-foreground hover:text-foreground border border-border transition-all" title="Nhân bản"><Copy size={12}/></button>
                            <button className="p-1.5 rounded-lg bg-secondary hover:bg-muted text-muted-foreground hover:text-foreground border border-border transition-all" title="Chỉnh sửa"><Edit size={12}/></button>
                            <button onClick={() => setDetail(campaign)} className="p-1.5 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 transition-all"><ChevronRight size={12}/></button>
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
                  <p className="font-black text-foreground">Không tìm thấy chiến dịch</p>
                  <p className="text-sm mt-1">Thử tìm kiếm với từ khóa hoặc bộ lọc khác</p>
                </div>
              )}
            </div>
          )}

          {/* Footer */}
          <div className="px-5 py-3.5 border-t border-border flex items-center justify-between bg-secondary/20">
            <div className="flex items-center gap-3">
              <input type="checkbox" checked={selected.length === filtered.length && filtered.length > 0} onChange={toggleAll} className="accent-primary cursor-pointer"/>
              <span className="text-[11px] text-muted-foreground">Hiển thị <span className="font-bold text-foreground">{filtered.length}</span> / {CAMPAIGNS.length} chiến dịch</span>
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