"use client"
import React, { useState, useMemo } from 'react';
import {
  Headset, MessageSquare, Clock, AlertCircle,
  CheckCircle2, Search, Filter, UserPlus,
  Mail, Phone, Globe, Send, Zap, BarChart3,
  ChevronRight, ChevronLeft, LifeBuoy, Paperclip,
  Smile, Bell, Settings, X, Tag, Trash2,
  ArrowUpRight, TrendingDown, TrendingUp,
  RefreshCw, Download, ChevronDown, ChevronUp,
  Users, Activity, Hash, Calendar, Star,
  Check, Flag, MessageCircle, Layers,
  Package, MoreHorizontal, Edit, Eye,
  Cpu, Timer, ShieldCheck, AlertTriangle
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, ResponsiveContainer,
  XAxis, YAxis, CartesianGrid, Tooltip as RTooltip, Cell
} from 'recharts';

// ─── TYPES ────────────────────────────────────────────────────────────────────

type Priority    = 'critical' | 'high' | 'medium' | 'low';
type TicketStatus= 'open' | 'pending' | 'resolved' | 'closed' | 'escalated';
type Channel     = 'web' | 'email' | 'chat' | 'phone' | 'social';
type ActiveTab   = 'all' | 'mine' | 'urgent' | 'unassigned';
type SortCol     = 'created' | 'sla' | 'priority';
type SortDir     = 'asc' | 'desc';

interface TicketCustomer {
  name: string;
  email: string;
  avatar: string;
  tier: string;
  phone: string;
}

interface ChatMessage {
  id: number;
  from: 'customer' | 'agent';
  text: string;
  time: string;
  seen?: boolean;
}

interface Ticket {
  id: string;
  subject: string;
  customer: TicketCustomer;
  priority: Priority;
  status: TicketStatus;
  channel: Channel;
  assignedTo: string;
  assignedAvatar: string;
  category: string;
  createdAt: string;
  updatedAt: string;
  slaMinutes: number;
  slaLimit: number;
  tags: string[];
  messages: ChatMessage[];
  csat?: number;
  orderId?: string;
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

interface TrendPoint { hour: string; open: number; resolved: number }
interface VolPoint   { day: string; volume: number }

// ─── DATA ─────────────────────────────────────────────────────────────────────

const trendData: TrendPoint[] = [
  { hour:'08h', open:4,  resolved:2  },
  { hour:'09h', open:8,  resolved:5  },
  { hour:'10h', open:14, resolved:9  },
  { hour:'11h', open:11, resolved:12 },
  { hour:'12h', open:6,  resolved:8  },
  { hour:'13h', open:9,  resolved:6  },
  { hour:'14h', open:16, resolved:11 },
  { hour:'15h', open:12, resolved:14 },
  { hour:'16h', open:8,  resolved:10 },
  { hour:'17h', open:5,  resolved:7  },
];

const volData: VolPoint[] = [
  { day:'T2', volume:42 }, { day:'T3', volume:58 }, { day:'T4', volume:49 },
  { day:'T5', volume:71 }, { day:'T6', volume:63 }, { day:'T7', volume:38 }, { day:'CN', volume:25 },
];

const AGENTS = ['Hoàng Nam', 'Minh Châu', 'Thanh Bình', 'Tuấn Anh', 'Ngọc Lan'];

const TICKETS: Ticket[] = [
  {
    id:'TK-8801', subject:'Lỗi thanh toán VNPay đơn hàng #12930',
    customer:{ name:'Trần Duy Mạnh', email:'manhtd@example.com', avatar:'TM', tier:'Gold', phone:'0901 234 567' },
    priority:'critical', status:'open', channel:'web', assignedTo:'Hoàng Nam', assignedAvatar:'HN',
    category:'Thanh toán', createdAt:'5 phút trước', updatedAt:'2 phút trước',
    slaMinutes:15, slaLimit:60,
    tags:['Payment','Urgent','VNPay'], orderId:'#12930',
    messages:[
      { id:1, from:'customer', text:'Chào đội ngũ hỗ trợ, tôi đã thanh toán đơn hàng #12930 qua VNPay nhưng trạng thái vẫn báo "Chờ thanh toán". Nhờ kiểm tra gấp!', time:'10:42' },
      { id:2, from:'agent',    text:'Chào bạn Mạnh! Chúng tôi ghi nhận sự chậm trễ từ cổng thanh toán. Đang kiểm tra với ngân hàng và cập nhật trong 5 phút.', time:'10:45', seen:true },
      { id:3, from:'customer', text:'Tôi đã bị trừ tiền rồi nhé, mong các bạn xử lý nhanh.', time:'10:47' },
    ],
  },
  {
    id:'TK-8802', subject:'Yêu cầu đổi trả áo hoodie bị lỗi đường may',
    customer:{ name:'Phạm Hải Yến', email:'yenph@test.vn', avatar:'PY', tier:'Silver', phone:'0912 345 678' },
    priority:'high', status:'pending', channel:'email', assignedTo:'Minh Châu', assignedAvatar:'MC',
    category:'Đổi trả', createdAt:'2 giờ trước', updatedAt:'1 giờ trước',
    slaMinutes:90, slaLimit:120,
    tags:['Return','Product'],
    messages:[
      { id:1, from:'customer', text:'Tôi mua áo hoodie và phát hiện đường may ở tay áo bị hở. Sản phẩm còn trong thời hạn đổi trả. Xin hướng dẫn thủ tục.', time:'08:30' },
      { id:2, from:'agent',    text:'Chào bạn Yến! Chúng tôi xin lỗi vì sự cố này. Bạn vui lòng chụp ảnh lỗi và gửi kèm mã đơn hàng để chúng tôi xử lý nhé.', time:'09:15', seen:true },
    ],
  },
  {
    id:'TK-8803', subject:'Tư vấn kích thước áo khoác XL vs XXL',
    customer:{ name:'Nguyễn Văn Tâm', email:'tamnv@gmail.com', avatar:'NT', tier:'Bronze', phone:'0933 456 789' },
    priority:'medium', status:'open', channel:'chat', assignedTo:'Chưa phân phối', assignedAvatar:'?',
    category:'Tư vấn', createdAt:'1 giờ trước', updatedAt:'45 phút trước',
    slaMinutes:45, slaLimit:120,
    tags:['Sizing','Pre-sale'],
    messages:[
      { id:1, from:'customer', text:'Mình cao 1m80 nặng 80kg, nên chọn XL hay XXL cho áo khoác bomber?', time:'11:20' },
    ],
  },
  {
    id:'TK-8804', subject:'Không nhận được mã giảm giá sinh nhật',
    customer:{ name:'Lê Thị Thu Hà', email:'thuha@gmail.com', avatar:'LH', tier:'Platinum', phone:'0944 567 890' },
    priority:'medium', status:'pending', channel:'email', assignedTo:'Thanh Bình', assignedAvatar:'TB',
    category:'Khuyến mãi', createdAt:'3 giờ trước', updatedAt:'2 giờ trước',
    slaMinutes:110, slaLimit:120,
    tags:['Promotion','Birthday'],
    messages:[
      { id:1, from:'customer', text:'Hôm nay là sinh nhật của tôi nhưng tôi không nhận được voucher sinh nhật như shop đã hứa qua email.', time:'09:00' },
      { id:2, from:'agent',    text:'Chào bạn Thu Hà! Chúng tôi đang kiểm tra hệ thống gửi voucher tự động. Sẽ phản hồi bạn trong 30 phút.', time:'09:20', seen:true },
      { id:3, from:'customer', text:'Đã 3 giờ rồi vẫn chưa thấy gì cả.', time:'12:00' },
    ],
  },
  {
    id:'TK-8805', subject:'Đơn hàng bị giao sai địa chỉ',
    customer:{ name:'Võ Minh Khoa', email:'khoa.vo@business.vn', avatar:'VK', tier:'Gold', phone:'0955 678 901' },
    priority:'high', status:'escalated', channel:'phone', assignedTo:'Tuấn Anh', assignedAvatar:'TA',
    category:'Vận chuyển', createdAt:'5 giờ trước', updatedAt:'30 phút trước',
    slaMinutes:180, slaLimit:180,
    tags:['Shipping','Escalated','Wrong-Address'],
    messages:[
      { id:1, from:'customer', text:'Đơn hàng của tôi bị giao tới địa chỉ sai hoàn toàn. Tôi cần giải quyết ngay hôm nay vì đây là quà sinh nhật.', time:'07:00' },
      { id:2, from:'agent',    text:'Chúng tôi đã liên hệ với đơn vị vận chuyển và đang điều phối lại.', time:'08:00', seen:true },
      { id:3, from:'customer', text:'Đã 5 tiếng rồi vẫn chưa có hàng. Tôi sẽ khiếu nại!', time:'12:00' },
    ],
  },
  {
    id:'TK-8806', subject:'Sản phẩm đến bị vỡ, cần bồi thường',
    customer:{ name:'Bùi Ngọc Linh', email:'linh.bui@corp.vn', avatar:'BL', tier:'Silver', phone:'0966 789 012' },
    priority:'critical', status:'escalated', channel:'web', assignedTo:'Hoàng Nam', assignedAvatar:'HN',
    category:'Khiếu nại', createdAt:'1 ngày trước', updatedAt:'2 giờ trước',
    slaMinutes:0, slaLimit:120,
    tags:['Damage','Compensation','Critical'],
    messages:[
      { id:1, from:'customer', text:'Tôi nhận được sản phẩm bị vỡ, đóng gói quá sơ sài. Yêu cầu hoàn tiền hoặc gửi lại hàng mới ngay hôm nay.', time:'Hôm qua' },
      { id:2, from:'agent',    text:'Chúng tôi xin lỗi về sự cố nghiêm trọng này. Đã leo thang lên quản lý và sẽ liên hệ bạn trong 1 giờ.', time:'Hôm qua', seen:true },
    ],
  },
  {
    id:'TK-8807', subject:'Yêu cầu xuất hoá đơn VAT cho đơn #14520',
    customer:{ name:'Đặng Quốc Trung', email:'trung.dang@company.com', avatar:'ĐT', tier:'Gold', phone:'0977 890 123' },
    priority:'low', status:'resolved', channel:'email', assignedTo:'Ngọc Lan', assignedAvatar:'NL',
    category:'Hóa đơn', createdAt:'2 ngày trước', updatedAt:'1 ngày trước',
    slaMinutes:0, slaLimit:240, csat:5,
    tags:['Invoice','VAT','Resolved'],
    messages:[
      { id:1, from:'customer', text:'Vui lòng xuất hoá đơn VAT 10% cho đơn hàng #14520 với thông tin công ty.', time:'2 ngày trước' },
      { id:2, from:'agent',    text:'Dạ, hoá đơn đã được xuất và gửi vào email của bạn rồi ạ. Vui lòng kiểm tra.', time:'1 ngày trước', seen:true },
    ],
  },
  {
    id:'TK-8808', subject:'Hỏi về chính sách bảo hành laptop 2 năm',
    customer:{ name:'Trần Thị Mỹ Linh', email:'mylinh@gmail.com', avatar:'TL', tier:'Bronze', phone:'0988 901 234' },
    priority:'low', status:'closed', channel:'chat', assignedTo:'Thanh Bình', assignedAvatar:'TB',
    category:'Bảo hành', createdAt:'3 ngày trước', updatedAt:'2 ngày trước',
    slaMinutes:0, slaLimit:120, csat:4,
    tags:['Warranty','Info'],
    messages:[
      { id:1, from:'customer', text:'Cho tôi hỏi chính sách bảo hành laptop tại shop có bao gồm màn hình không?', time:'3 ngày trước' },
      { id:2, from:'agent',    text:'Chào bạn! Bảo hành 2 năm của chúng tôi bao gồm lỗi phần cứng, pin và màn hình do nhà sản xuất. Không áp dụng cho va đập vật lý.', time:'3 ngày trước', seen:true },
    ],
  },
];

// ─── CONFIG ───────────────────────────────────────────────────────────────────

const priorityConfig: Record<Priority, { bg: string; text: string; border: string; dot: string; label: string }> = {
  critical: { bg:'bg-red-50',    text:'text-red-600',   border:'border-red-200',   dot:'bg-red-500',   label:'Khẩn cấp'  },
  high:     { bg:'bg-orange-50', text:'text-orange-700',border:'border-orange-200',dot:'bg-orange-500',label:'Cao'       },
  medium:   { bg:'bg-amber-50',  text:'text-amber-700', border:'border-amber-200', dot:'bg-amber-500', label:'Trung bình'},
  low:      { bg:'bg-slate-100', text:'text-slate-600', border:'border-slate-200', dot:'bg-slate-400', label:'Thấp'      },
};

const statusConfig: Record<TicketStatus, { bg: string; text: string; border: string; dot: string; label: string; pulse?: boolean }> = {
  open:       { bg:'bg-blue-50',   text:'text-blue-700',  border:'border-blue-200',  dot:'bg-blue-500',  label:'Đang mở',    pulse:true  },
  pending:    { bg:'bg-amber-50',  text:'text-amber-700', border:'border-amber-200', dot:'bg-amber-500', label:'Chờ xử lý'               },
  escalated:  { bg:'bg-red-50',    text:'text-red-600',   border:'border-red-200',   dot:'bg-primary',   label:'Leo thang',  pulse:true  },
  resolved:   { bg:'bg-green-50',  text:'text-green-700', border:'border-green-200', dot:'bg-green-500', label:'Đã giải quyết'            },
  closed:     { bg:'bg-slate-100', text:'text-slate-500', border:'border-slate-200', dot:'bg-slate-400', label:'Đã đóng'                  },
};

const channelConfig: Record<Channel, { icon: React.ReactNode; label: string }> = {
  web:    { icon:<Globe size={12}/>,          label:'Web'    },
  email:  { icon:<Mail size={12}/>,           label:'Email'  },
  chat:   { icon:<MessageSquare size={12}/>,  label:'Chat'   },
  phone:  { icon:<Phone size={12}/>,          label:'Phone'  },
  social: { icon:<Users size={12}/>,          label:'Social' },
};

const tierColor: Record<string, string> = {
  Platinum:'bg-slate-900 text-slate-100 border-slate-700',
  Gold:    'bg-amber-50 text-amber-700 border-amber-200',
  Silver:  'bg-slate-100 text-slate-600 border-slate-300',
  Bronze:  'bg-orange-50 text-orange-700 border-orange-200',
};

// ─── UTILS ────────────────────────────────────────────────────────────────────

const getSlaColor = (minutes: number, limit: number): string => {
  const pct = minutes / limit;
  if (pct <= 0) return 'text-red-500';
  if (pct < 0.25) return 'text-red-500';
  if (pct < 0.5) return 'text-amber-500';
  return 'text-green-600';
};

const getSlaBarColor = (minutes: number, limit: number): string => {
  const pct = minutes / limit;
  if (pct <= 0) return 'bg-red-500';
  if (pct < 0.25) return 'bg-red-500';
  if (pct < 0.5) return 'bg-amber-500';
  return 'bg-green-500';
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

// ─── TICKET DETAIL PANEL ──────────────────────────────────────────────────────

interface TicketPanelProps { ticket: Ticket; onClose: () => void }
const TicketPanel: React.FC<TicketPanelProps> = ({ ticket, onClose }) => {
  const [reply, setReply] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>(ticket.messages);
  const p = priorityConfig[ticket.priority];
  const s = statusConfig[ticket.status];
  const ch = channelConfig[ticket.channel];

  const sendReply = () => {
    if (!reply.trim()) return;
    setMessages(prev => [...prev, { id: Date.now(), from:'agent', text:reply, time:'Vừa xong', seen:false }]);
    setReply('');
  };

  const templates = [
    'Cảm ơn bạn đã liên hệ! Chúng tôi đang xử lý.',
    'Xin lỗi vì sự bất tiện này, chúng tôi sẽ khắc phục ngay.',
    'Vấn đề đã được ghi nhận và sẽ xử lý trong 24h.',
    'Vui lòng cung cấp thêm thông tin để chúng tôi hỗ trợ tốt hơn.',
  ];

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-foreground/20 backdrop-blur-sm" onClick={onClose}/>
      <div className="relative w-full max-w-2xl bg-card border-l border-border flex flex-col h-full shadow-2xl">

        {/* Header */}
        <div className="bg-primary px-6 pt-5 pb-0 relative overflow-hidden flex-shrink-0">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute -right-10 -top-10 w-48 h-48 rounded-full bg-white"/>
            <div className="absolute -right-4 bottom-0 w-72 h-40 rounded-full bg-white"/>
          </div>
          <div className="relative z-10">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-black bg-white/20 text-white border border-white/30 px-2 py-0.5 rounded-full tracking-widest">{ticket.id}</span>
                <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${s.bg} ${s.text} ${s.border}`}>{s.label}</span>
                <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${p.bg} ${p.text} ${p.border}`}>{p.label}</span>
              </div>
              <button onClick={onClose} className="p-1.5 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-all"><X size={14}/></button>
            </div>
            <h2 className="text-lg font-black text-white leading-tight mb-2">{ticket.subject}</h2>
            <div className="flex items-center gap-3 text-white/70 text-xs pb-4">
              <span className="flex items-center gap-1.5 font-bold text-white">{ticket.customer.name}</span>
              <span>·</span>
              <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-md border ${tierColor[ticket.customer.tier]}`}>{ticket.customer.tier}</span>
              <span>·</span>
              <span className="flex items-center gap-1">{ch.icon} {ch.label}</span>
              <span>·</span>
              <span className="flex items-center gap-1"><Clock size={10}/>{ticket.createdAt}</span>
            </div>
          </div>
        </div>

        {/* Info strip */}
        <div className="flex-shrink-0 border-b border-border bg-secondary/30 px-6 py-3 grid grid-cols-4 gap-4">
          {[
            { label:'Khách hàng',  value:ticket.customer.phone, icon:<Phone size={11}/> },
            { label:'Danh mục',   value:ticket.category,       icon:<Tag size={11}/> },
            { label:'Xử lý bởi',  value:ticket.assignedTo,    icon:<Users size={11}/> },
            { label:'Cập nhật',   value:ticket.updatedAt,     icon:<RefreshCw size={11}/> },
          ].map(i => (
            <div key={i.label}>
              <div className="text-[9px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-1 mb-0.5">{i.icon}{i.label}</div>
              <div className="text-[11px] font-bold text-foreground truncate">{i.value}</div>
            </div>
          ))}
        </div>

        {/* Tags */}
        {ticket.tags.length > 0 && (
          <div className="flex-shrink-0 px-6 py-2.5 border-b border-border flex items-center gap-2 flex-wrap bg-card">
            <span className="text-[10px] text-muted-foreground font-bold">Tags:</span>
            {ticket.tags.map(t => (
              <span key={t} className="text-[10px] px-2 py-0.5 bg-secondary border border-border rounded-full text-muted-foreground font-medium">{t}</span>
            ))}
          </div>
        )}

        {/* Template quick-replies */}
        <div className="flex-shrink-0 px-6 py-2.5 border-b border-border bg-secondary/10 flex gap-2 flex-wrap">
          <span className="text-[10px] text-muted-foreground font-bold flex items-center gap-1 mr-1"><Zap size={10} className="text-primary"/> Nhanh:</span>
          {templates.map(t => (
            <button key={t} onClick={() => setReply(t)}
              className="text-[10px] px-2.5 py-1 bg-card hover:bg-primary/10 hover:text-primary border border-border rounded-lg font-medium transition-all max-w-[160px] truncate">
              {t}
            </button>
          ))}
        </div>

        {/* Conversation */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 bg-secondary/5">
          {messages.map(msg => (
            <div key={msg.id} className={`flex flex-col gap-1.5 max-w-[85%] ${msg.from === 'agent' ? 'ml-auto items-end' : 'items-start'}`}>
              <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
                msg.from === 'agent'
                  ? 'bg-primary text-white rounded-tr-none shadow-primary/20'
                  : 'bg-card border border-border text-foreground rounded-tl-none'
              }`}>
                {msg.text}
              </div>
              <span className={`text-[10px] font-bold flex items-center gap-1 ${msg.from === 'agent' ? 'text-primary' : 'text-muted-foreground'}`}>
                {msg.from === 'agent' && msg.seen && <><CheckCircle2 size={9}/> Đã xem · </>}
                {msg.time}
              </span>
            </div>
          ))}
        </div>

        {/* Reply box */}
        <div className="flex-shrink-0 p-4 border-t border-border bg-card space-y-3">
          <div className="relative">
            <textarea
              value={reply} onChange={e => setReply(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && e.ctrlKey) sendReply(); }}
              placeholder="Nhập nội dung phản hồi... (Ctrl+Enter để gửi)"
              className="w-full min-h-[90px] bg-secondary border border-border rounded-xl p-3 pr-12 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 resize-none"
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <button className="p-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-all"><Paperclip size={14}/></button>
              <button className="p-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-all"><Smile size={14}/></button>
            </div>
            <div className="flex gap-2">
              <button onClick={onClose} className="px-4 py-2 bg-secondary hover:bg-muted border border-border rounded-xl text-sm font-bold text-foreground transition-all flex items-center gap-2">
                <CheckCircle2 size={13}/> Đóng ticket
              </button>
              <button onClick={sendReply} className="px-4 py-2 bg-primary hover:bg-primary-light text-white rounded-xl text-sm font-black transition-all flex items-center gap-2 shadow shadow-primary/25">
                <Send size={13}/> Gửi phản hồi
              </button>
            </div>
          </div>
          <p className="text-[10px] text-muted-foreground text-center">Khách hàng nhận phản hồi qua <span className="font-bold text-foreground">{channelConfig[ticket.channel].label}</span></p>
        </div>
      </div>
    </div>
  );
};

// ─── MAIN ─────────────────────────────────────────────────────────────────────

export default function SupportManagement() {
  const [search, setSearch]         = useState('');
  const [activeTab, setActiveTab]   = useState<ActiveTab>('all');
  const [filterPrio, setFilterPrio] = useState<string>('all');
  const [filterCat, setFilterCat]   = useState('all');
  const [sortCol, setSortCol]       = useState<SortCol>('created');
  const [sortDir, setSortDir]       = useState<SortDir>('asc');
  const [selected, setSelected]     = useState<string[]>([]);
  const [detail, setDetail]         = useState<Ticket | null>(null);

  const categories = useMemo(() => ['all', ...Array.from(new Set(TICKETS.map(t => t.category)))], []);

  const filtered = useMemo<Ticket[]>(() => {
    return TICKETS
      .filter(t => {
        const q = search.toLowerCase();
        const matchQ    = t.subject.toLowerCase().includes(q) || t.customer.name.toLowerCase().includes(q) || t.id.toLowerCase().includes(q);
        const matchTab  = activeTab === 'all'
          || (activeTab === 'mine'       && t.assignedTo === 'Hoàng Nam')
          || (activeTab === 'urgent'     && (t.priority === 'critical' || t.priority === 'high'))
          || (activeTab === 'unassigned' && t.assignedTo === 'Chưa phân phối');
        const matchPrio = filterPrio === 'all' || t.priority === filterPrio;
        const matchCat  = filterCat  === 'all' || t.category === filterCat;
        return matchQ && matchTab && matchPrio && matchCat;
      })
      .sort((a, b) => {
        const d = sortDir === 'asc' ? 1 : -1;
        if (sortCol === 'sla')      return (a.slaMinutes - b.slaMinutes) * d;
        if (sortCol === 'priority') {
          const order: Record<Priority,number> = { critical:0, high:1, medium:2, low:3 };
          return (order[a.priority] - order[b.priority]) * d;
        }
        return 0;
      });
  }, [search, activeTab, filterPrio, filterCat, sortCol, sortDir]);

  const toggleSelect = (id: string) => setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);
  const toggleAll    = () => setSelected(selected.length === filtered.length ? [] : filtered.map(t => t.id));

  const tabCount = (tab: ActiveTab): number => {
    if (tab === 'all')        return TICKETS.length;
    if (tab === 'mine')       return TICKETS.filter(t => t.assignedTo === 'Hoàng Nam').length;
    if (tab === 'urgent')     return TICKETS.filter(t => t.priority === 'critical' || t.priority === 'high').length;
    if (tab === 'unassigned') return TICKETS.filter(t => t.assignedTo === 'Chưa phân phối').length;
    return 0;
  };

  const SortIcon: React.FC<{ col: SortCol }> = ({ col }) =>
    sortCol === col
      ? (sortDir === 'asc' ? <ChevronUp size={11} className="text-primary"/> : <ChevronDown size={11} className="text-primary"/>)
      : <ChevronDown size={11} className="text-muted-foreground/40"/>;

  const handleSort = (col: SortCol) => {
    if (sortCol === col) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortCol(col); setSortDir('asc'); }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {detail && <TicketPanel ticket={detail} onClose={() => setDetail(null)}/>}

      {/* Nav */}
      <div className="border-b border-border bg-card px-6 py-3 flex items-center justify-between sticky top-0 z-40 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="h-7 w-7 bg-primary rounded-lg flex items-center justify-center shadow-md shadow-primary/30">
            <Headset size={13} className="text-white"/>
          </div>
          <span className="font-black text-foreground text-sm tracking-tight">CRM Pro</span>
          <span className="text-muted-foreground mx-1 text-sm">›</span>
          <span className="text-muted-foreground text-sm">Help Desk</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-green-600 bg-green-50 border border-green-200 px-2.5 py-1 rounded-full">
            <span className="h-1.5 w-1.5 bg-green-500 rounded-full animate-pulse"/>
            Real-time
          </div>
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
            <h1 className="text-3xl font-black tracking-tight text-foreground">Help Desk</h1>
            <p className="text-muted-foreground text-sm mt-1">Quản lý và xử lý toàn bộ yêu cầu hỗ trợ khách hàng</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-4 py-2.5 bg-secondary hover:bg-muted border border-border rounded-xl text-sm font-bold text-foreground flex items-center gap-2 transition-all">
              <Download size={14}/> Xuất báo cáo
            </button>
            <button className="px-4 py-2.5 bg-primary hover:bg-primary-light rounded-xl text-sm font-black text-white flex items-center gap-2 transition-all shadow-lg shadow-primary/25">
              <UserPlus size={14}/> Tạo ticket
            </button>
          </div>
        </div>

        {/* KPI row */}
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
          <StatCard highlight icon={<Clock size={15} className="text-white"/>}         label="Phản hồi trung bình" value="14 phút"  trend="-2m"    trendUp sub="Mục tiêu: ≤20 phút"/>
          <StatCard icon={<AlertCircle size={15}/>}   label="Đang chờ xử lý"   value="32"       trend="+4"     trendUp={false} sub="Cần xử lý ngay"/>
          <StatCard icon={<Activity size={15}/>}      label="Đang xử lý"       value="28"       trend="+3"     trendUp sub="Trong ca hôm nay"/>
          <StatCard icon={<CheckCircle2 size={15}/>}  label="Hoàn thành hôm nay" value="142"   trend="+18%"   trendUp sub="So với hôm qua"/>
          <StatCard icon={<Star size={15}/>}          label="CSAT Score"       value="96.4%"    trend="+1.2%"  trendUp sub="Từ 342 phản hồi"/>
          <StatCard icon={<Zap size={15}/>}           label="SLA đúng hạn"     value="91.2%"    trend="-2.1%"  trendUp={false} sub="Mục tiêu: ≥95%"/>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Open vs Resolved */}
          <div className="lg:col-span-2 bg-card border border-border rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-sm font-black text-foreground">Ticket mở vs Đã giải quyết</div>
                <div className="text-[11px] text-muted-foreground mt-0.5">Theo giờ trong ngày hôm nay</div>
              </div>
              <div className="flex items-center gap-4 text-[11px] text-muted-foreground">
                <span className="flex items-center gap-1.5"><span className="h-2 w-3 bg-primary rounded-sm inline-block"/> Mở mới</span>
                <span className="flex items-center gap-1.5"><span className="h-2 w-3 bg-green-500 rounded-sm inline-block"/> Giải quyết</span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="openGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#E40F2A" stopOpacity={0.15}/>
                    <stop offset="100%" stopColor="#E40F2A" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="resGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#22c55e" stopOpacity={0.15}/>
                    <stop offset="100%" stopColor="#22c55e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false}/>
                <XAxis dataKey="hour" tick={{ fontSize:10, fill:'var(--muted-foreground)' }} axisLine={false} tickLine={false}/>
                <YAxis tick={{ fontSize:10, fill:'var(--muted-foreground)' }} axisLine={false} tickLine={false}/>
                <RTooltip contentStyle={{ background:'var(--card)', border:'1px solid var(--border)', borderRadius:'12px', fontSize:'12px', color:'var(--foreground)' }}/>
                <Area type="monotone" dataKey="open"     stroke="#E40F2A" strokeWidth={2} fill="url(#openGrad)"/>
                <Area type="monotone" dataKey="resolved" stroke="#22c55e" strokeWidth={2} fill="url(#resGrad)"/>
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Side panels */}
          <div className="space-y-4">
            {/* Volume per day */}
            <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
              <div className="text-sm font-black text-foreground mb-3">Khối lượng 7 ngày</div>
              <ResponsiveContainer width="100%" height={90}>
                <BarChart data={volData} barSize={20}>
                  <XAxis dataKey="day" tick={{ fontSize:10, fill:'var(--muted-foreground)' }} axisLine={false} tickLine={false}/>
                  <RTooltip contentStyle={{ background:'var(--card)', border:'1px solid var(--border)', borderRadius:'8px', fontSize:'11px', color:'var(--foreground)' }}/>
                  <Bar dataKey="volume" radius={[4,4,0,0]}>
                    {volData.map((_, i) => <Cell key={i} fill={i === volData.length - 2 ? '#E40F2A' : 'var(--muted)'}/>)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Agent status */}
            <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="text-sm font-black text-foreground">Agent trực tuyến</div>
                <span className="text-[10px] text-green-600 font-bold bg-green-50 border border-green-200 px-1.5 py-0.5 rounded-full">5 online</span>
              </div>
              <div className="space-y-2.5">
                {AGENTS.map((agent, i) => {
                  const loads = [3, 7, 2, 5, 1];
                  const maxLoad = 8;
                  return (
                    <div key={agent} className="flex items-center gap-2.5">
                      <div className="h-7 w-7 bg-primary/10 text-primary rounded-lg flex items-center justify-center text-xs font-black flex-shrink-0">
                        {agent.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-0.5">
                          <span className="text-[11px] font-bold text-foreground truncate">{agent}</span>
                          <span className="text-[10px] text-muted-foreground">{loads[i]}/{maxLoad}</span>
                        </div>
                        <div className="h-1 bg-muted rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${loads[i] >= 7 ? 'bg-red-500' : loads[i] >= 5 ? 'bg-amber-500' : 'bg-green-500'}`}
                            style={{ width: `${(loads[i] / maxLoad) * 100}%` }}/>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Ticket list */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">

          {/* Tabs */}
          <div className="border-b border-border">
            <div className="flex items-center gap-1 px-5 pt-3 border-b border-border/50">
              {(['all','mine','urgent','unassigned'] as ActiveTab[]).map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)}
                  className={`relative pb-3 px-1 text-[11px] font-black uppercase tracking-widest flex items-center gap-1.5 transition-all ${
                    activeTab === tab ? 'text-primary border-b-2 border-primary -mb-px' : 'text-muted-foreground hover:text-foreground'
                  }`}>
                  {{ all:'Tất cả', mine:'Của tôi', urgent:'Khẩn cấp', unassigned:'Chưa phân công' }[tab]}
                  <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-black ${activeTab === tab ? 'bg-primary text-white' : 'bg-secondary text-muted-foreground'}`}>
                    {tabCount(tab)}
                  </span>
                </button>
              ))}
            </div>

            {/* Toolbar */}
            <div className="px-5 py-3 flex flex-col md:flex-row gap-3 items-start md:items-center justify-between bg-secondary/20">
              <div className="flex items-center gap-2 flex-wrap">
                {/* Priority filter */}
                {(['all','critical','high','medium','low'] as const).map(p => (
                  <button key={p} onClick={() => setFilterPrio(p)}
                    className={`px-3 py-1.5 rounded-lg text-[11px] font-bold capitalize transition-all ${
                      filterPrio === p
                        ? 'bg-primary text-white shadow shadow-primary/20'
                        : 'bg-card text-muted-foreground hover:bg-muted border border-border'
                    }`}>
                    {p === 'all' ? 'Tất cả ưu tiên' : priorityConfig[p as Priority]?.label ?? p}
                  </button>
                ))}

                <div className="w-px h-4 bg-border mx-1"/>

                {/* Category filter */}
                <select value={filterCat} onChange={e => setFilterCat(e.target.value)}
                  className="bg-card border border-border rounded-xl text-[11px] font-bold text-foreground px-3 py-2 focus:outline-none focus:border-primary/50">
                  {categories.map(c => <option key={c} value={c}>{c === 'all' ? 'Tất cả danh mục' : c}</option>)}
                </select>

                {/* Sort buttons */}
                <button onClick={() => handleSort('priority')}
                  className={`px-3 py-1.5 rounded-xl text-[11px] font-bold border flex items-center gap-1.5 transition-all ${sortCol==='priority'?'bg-primary text-white border-primary':'bg-card text-muted-foreground border-border hover:bg-secondary'}`}>
                  <Flag size={11}/> Ưu tiên <SortIcon col="priority"/>
                </button>
                <button onClick={() => handleSort('sla')}
                  className={`px-3 py-1.5 rounded-xl text-[11px] font-bold border flex items-center gap-1.5 transition-all ${sortCol==='sla'?'bg-primary text-white border-primary':'bg-card text-muted-foreground border-border hover:bg-secondary'}`}>
                  <Timer size={11}/> SLA <SortIcon col="sla"/>
                </button>
              </div>

              <div className="relative w-full md:w-72">
                <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"/>
                <input value={search} onChange={e => setSearch(e.target.value)}
                  placeholder="Tìm ticket, khách hàng, ID..."
                  className="w-full bg-card border border-border rounded-xl pl-9 pr-8 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-all"/>
                {search && <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"><X size={11}/></button>}
              </div>
            </div>
          </div>

          {/* Bulk bar */}
          {selected.length > 0 && (
            <div className="px-5 py-2.5 bg-primary/[0.05] border-b border-primary/20 flex items-center gap-3">
              <span className="text-sm font-bold text-primary">{selected.length} đã chọn</span>
              <div className="flex gap-2 flex-wrap">
                {([['Gán agent', <Users size={11}/>],['Đóng tất cả', <CheckCircle2 size={11}/>],['Gắn cờ', <Flag size={11}/>],['Xóa', <Trash2 size={11}/>]] as [string, React.ReactNode][]).map(([label, icon]) => (
                  <button key={label} className="px-3 py-1 bg-card hover:bg-secondary text-foreground rounded-lg text-[11px] font-bold flex items-center gap-1.5 transition-all border border-border">
                    {icon} {label}
                  </button>
                ))}
              </div>
              <button onClick={() => setSelected([])} className="ml-auto text-muted-foreground hover:text-foreground transition-all"><X size={13}/></button>
            </div>
          )}

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-secondary/30">
                  <th className="px-5 py-3 text-left w-10">
                    <input type="checkbox" checked={selected.length === filtered.length && filtered.length > 0} onChange={toggleAll} className="accent-primary cursor-pointer"/>
                  </th>
                  <th className="px-2 py-3 text-left text-[10px] font-black text-muted-foreground uppercase tracking-widest min-w-[300px]">Chi tiết Ticket</th>
                  <th className="px-2 py-3 text-left text-[10px] font-black text-muted-foreground uppercase tracking-widest">Ưu tiên</th>
                  <th className="px-2 py-3 text-left text-[10px] font-black text-muted-foreground uppercase tracking-widest">Trạng thái</th>
                  <th className="px-2 py-3 text-left text-[10px] font-black text-muted-foreground uppercase tracking-widest">Kênh</th>
                  <th className="px-2 py-3 text-left text-[10px] font-black text-muted-foreground uppercase tracking-widest">SLA còn lại</th>
                  <th className="px-2 py-3 text-left text-[10px] font-black text-muted-foreground uppercase tracking-widest">Người xử lý</th>
                  <th className="px-5 py-3 text-right text-[10px] font-black text-muted-foreground uppercase tracking-widest">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(ticket => {
                  const p = priorityConfig[ticket.priority];
                  const s = statusConfig[ticket.status];
                  const ch = channelConfig[ticket.channel];
                  const isSel = selected.includes(ticket.id);
                  const slaColor = getSlaColor(ticket.slaMinutes, ticket.slaLimit);
                  const slaBarColor = getSlaBarColor(ticket.slaMinutes, ticket.slaLimit);
                  const slaExpired = ticket.slaMinutes <= 0;

                  return (
                    <tr key={ticket.id} className={`border-b border-border/60 transition-colors group ${isSel ? 'bg-primary/[0.02]' : 'hover:bg-secondary/30'}`}>
                      <td className="px-5 py-4">
                        <input type="checkbox" checked={isSel} onChange={() => toggleSelect(ticket.id)} className="accent-primary cursor-pointer"/>
                      </td>
                      <td className="px-2 py-4">
                        <div className="flex items-start gap-3">
                          <div className={`mt-1.5 h-2 w-2 rounded-full flex-shrink-0 ${s.dot} ${s.pulse ? 'animate-pulse' : ''}`}/>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 mb-0.5">
                              <span className="text-[10px] font-black text-primary">{ticket.id}</span>
                              {ticket.orderId && <span className="text-[10px] text-muted-foreground">{ticket.orderId}</span>}
                              {ticket.csat && (
                                <span className="text-[10px] font-bold text-amber-600 flex items-center gap-0.5 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded-full">
                                  <Star size={9} fill="currentColor"/> {ticket.csat}
                                </span>
                              )}
                            </div>
                            <p className="text-sm font-bold text-foreground group-hover:text-primary transition-colors leading-tight mb-1 cursor-pointer" onClick={() => setDetail(ticket)}>
                              {ticket.subject}
                            </p>
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="text-[11px] text-muted-foreground font-medium">{ticket.customer.name}</span>
                              <span className={`text-[9px] font-black px-1 py-0.5 rounded border ${tierColor[ticket.customer.tier]}`}>{ticket.customer.tier}</span>
                              <span className="text-muted-foreground">·</span>
                              <span className="text-[10px] text-muted-foreground">{ticket.createdAt}</span>
                              <span className="text-muted-foreground">·</span>
                              <span className="text-[10px] text-muted-foreground flex items-center gap-0.5">
                                <MessageCircle size={9}/> {ticket.messages.length}
                              </span>
                            </div>
                            {ticket.tags.length > 0 && (
                              <div className="flex gap-1 mt-1.5 flex-wrap">
                                {ticket.tags.slice(0,3).map(t => (
                                  <span key={t} className="text-[9px] px-1.5 py-0.5 bg-secondary border border-border rounded-full text-muted-foreground">{t}</span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-2 py-4">
                        <span className={`inline-flex items-center gap-1.5 text-[10px] font-black px-2 py-1 rounded-lg border ${p.bg} ${p.text} ${p.border}`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${p.dot}`}/>{p.label}
                        </span>
                      </td>
                      <td className="px-2 py-4">
                        <span className={`inline-flex items-center gap-1.5 text-[10px] font-black px-2 py-1 rounded-lg border ${s.bg} ${s.text} ${s.border}`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${s.dot} ${s.pulse ? 'animate-pulse' : ''}`}/>{s.label}
                        </span>
                      </td>
                      <td className="px-2 py-4">
                        <div className={`flex items-center gap-1.5 text-[11px] font-bold text-muted-foreground`}>
                          {ch.icon} {ch.label}
                        </div>
                      </td>
                      <td className="px-2 py-4">
                        <div className="w-28 space-y-1">
                          <div className="flex items-center justify-between">
                            <span className={`text-[10px] font-black ${slaColor}`}>
                              {slaExpired ? 'Quá hạn!' : `${ticket.slaMinutes} phút`}
                            </span>
                            {slaExpired && <AlertTriangle size={10} className="text-red-500"/>}
                          </div>
                          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                            <div className={`h-full rounded-full ${slaBarColor} transition-all`}
                              style={{ width: `${Math.max(0, (ticket.slaMinutes / ticket.slaLimit) * 100)}%` }}/>
                          </div>
                          <div className="text-[9px] text-muted-foreground">Giới hạn {ticket.slaLimit}p</div>
                        </div>
                      </td>
                      <td className="px-2 py-4">
                        <div className="flex items-center gap-2">
                          <div className={`h-7 w-7 rounded-lg flex items-center justify-center text-xs font-black flex-shrink-0 ${
                            ticket.assignedTo === 'Chưa phân phối' ? 'bg-secondary border border-dashed border-border text-muted-foreground' : 'bg-primary/10 text-primary'
                          }`}>
                            {ticket.assignedAvatar === '?' ? '?' : ticket.assignedAvatar}
                          </div>
                          <span className={`text-[11px] font-bold ${ticket.assignedTo === 'Chưa phân phối' ? 'text-muted-foreground italic' : 'text-foreground'}`}>
                            {ticket.assignedTo}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-all">
                          <button className="p-1.5 rounded-lg bg-secondary hover:bg-muted text-muted-foreground hover:text-foreground transition-all border border-border" title="Xem"><Eye size={12}/></button>
                          <button className="p-1.5 rounded-lg bg-secondary hover:bg-muted text-muted-foreground hover:text-foreground transition-all border border-border" title="Gán agent"><Users size={12}/></button>
                          <button onClick={() => setDetail(ticket)} className="p-1.5 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary transition-all border border-primary/20" title="Mở ticket">
                            <ChevronRight size={12}/>
                          </button>
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
                <p className="font-black text-foreground">Không tìm thấy ticket</p>
                <p className="text-sm mt-1">Thử tìm kiếm với từ khóa hoặc bộ lọc khác</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-5 py-3.5 border-t border-border flex items-center justify-between bg-secondary/20">
            <div className="flex items-center gap-3">
              <input type="checkbox" checked={selected.length === filtered.length && filtered.length > 0} onChange={toggleAll} className="accent-primary cursor-pointer"/>
              <span className="text-[11px] text-muted-foreground">
                Hiển thị <span className="font-bold text-foreground">{filtered.length}</span> / {TICKETS.length} tickets
              </span>
            </div>
            <div className="flex items-center gap-1">
              <button className="h-7 w-7 rounded-lg bg-secondary hover:bg-muted border border-border flex items-center justify-center text-muted-foreground transition-all">
                <ChevronLeft size={13}/>
              </button>
              {([1,2,3,'…',12] as (number|string)[]).map((p, i) => (
                <button key={i} className={`h-7 min-w-[28px] px-1 rounded-lg text-[11px] font-bold transition-all ${p === 1 ? 'bg-primary text-white shadow shadow-primary/25' : 'text-muted-foreground hover:bg-secondary'}`}>{p}</button>
              ))}
              <button className="h-7 w-7 rounded-lg bg-secondary hover:bg-muted border border-border flex items-center justify-center text-muted-foreground transition-all">
                <ChevronRight size={13}/>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}