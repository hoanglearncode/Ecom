"use client"
import React, { useState, useMemo } from 'react';
import {
  Star, StarHalf, MessageSquare, CheckCircle2,
  XCircle, AlertTriangle, Search, Filter,
  Reply, ThumbsUp, Image as ImageIcon,
  ArrowUpRight, TrendingUp, Smile, Frown, Meh,
  Flag, Trash2, Download, Bell, Settings,
  ChevronDown, ChevronUp, X, Edit, Send,
  BarChart2, Tag, Zap, Clock, Package,
  ArrowRight, Check, Info, RefreshCw,
  ChevronLeft, ChevronRight, Eye, MoreHorizontal,
  ShieldCheck, AlertCircle, Hash, TrendingDown,
  Layers, Users, Globe, Calendar, Sparkles
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, ResponsiveContainer,
  Cell, AreaChart, Area, CartesianGrid, Tooltip as RTooltip,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, LineChart, Line
} from 'recharts';

// ─── TYPES ────────────────────────────────────────────────────────────────────

type Sentiment   = 'positive' | 'negative' | 'neutral';
type ReviewStatus= 'approved' | 'pending' | 'rejected' | 'flagged';
type SortCol     = 'date' | 'rating' | 'helpfulness';
type SortDir     = 'asc' | 'desc';
type ActiveTab   = 'all' | 'pending' | 'negative' | 'flagged';

interface ReviewUser {
  name: string;
  avatar: string;
  email: string;
  tier: string;
  totalReviews: number;
}

interface Review {
  id: string;
  user: ReviewUser;
  rating: number;
  title: string;
  comment: string;
  product: string;
  brand: string;
  category: string;
  sentiment: Sentiment;
  status: ReviewStatus;
  date: string;
  images: number;
  helpfulness: number;
  verified: boolean;
  reply?: string;
  tags: string[];
  source: string;
}

interface RatingDist {
  star: string;
  count: number;
}

interface TrendPoint {
  day: string;
  positive: number;
  negative: number;
  neutral: number;
}

interface TopicItem {
  topic: string;
  count: number;
  sentiment: Sentiment;
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

interface SentimentBadgeProps { sentiment: Sentiment }
interface StatusBadgeProps    { status: ReviewStatus }
interface StarRowProps        { rating: number; size?: number }
interface RiskBarProps        { score: number }

// ─── DATA ─────────────────────────────────────────────────────────────────────

const ratingDist: RatingDist[] = [
  { star: '5★', count: 640 },
  { star: '4★', count: 320 },
  { star: '3★', count: 110 },
  { star: '2★', count: 45  },
  { star: '1★', count: 20  },
];

const trendData: TrendPoint[] = [
  { day: 'T2', positive: 42, negative: 8,  neutral: 12 },
  { day: 'T3', positive: 55, negative: 14, neutral: 9  },
  { day: 'T4', positive: 38, negative: 6,  neutral: 15 },
  { day: 'T5', positive: 67, negative: 18, neutral: 10 },
  { day: 'T6', positive: 48, negative: 22, neutral: 18 },
  { day: 'T7', positive: 72, negative: 9,  neutral: 14 },
  { day: 'CN', positive: 90, negative: 5,  neutral: 20 },
];

const topicData: TopicItem[] = [
  { topic: 'Giao hàng nhanh',     count: 284, sentiment: 'positive' },
  { topic: 'Chất lượng tốt',      count: 231, sentiment: 'positive' },
  { topic: 'Đóng gói cẩn thận',   count: 187, sentiment: 'positive' },
  { topic: 'Giá hợp lý',          count: 143, sentiment: 'positive' },
  { topic: 'Chất liệu kém',        count: 52,  sentiment: 'negative' },
  { topic: 'Giao hàng trễ',        count: 41,  sentiment: 'negative' },
  { topic: 'Màu khác hình',        count: 38,  sentiment: 'negative' },
  { topic: 'CSKH nhiệt tình',      count: 127, sentiment: 'positive' },
];

const REVIEWS: Review[] = [
  {
    id: 'REV-9921',
    user: { name: 'Nguyễn Minh Anh', avatar: 'NA', email: 'minhanh@gmail.com', tier: 'Gold', totalReviews: 14 },
    rating: 5, title: 'Sản phẩm tuyệt vời, giao hàng siêu tốc!',
    comment: 'Sản phẩm vượt mong đợi! Đóng gói rất cẩn thận, không bị trầy xước gì cả. Shipper giao đúng giờ, có gọi điện trước. Mình sẽ tiếp tục ủng hộ shop trong tương lai. Highly recommend!',
    product: 'iPhone 15 Pro Max 256GB', brand: 'Apple', category: 'Điện thoại',
    sentiment: 'positive', status: 'approved', date: '12/10/2024',
    images: 3, helpfulness: 47, verified: true,
    reply: 'Cảm ơn bạn đã tin tưởng và ủng hộ shop! Chúng tôi rất vui khi bạn hài lòng với sản phẩm. Hẹn gặp lại bạn lần sau nhé! 🎉',
    tags: ['Giao nhanh', 'Chính hãng', 'Đóng gói tốt'], source: 'Web'
  },
  {
    id: 'REV-9922',
    user: { name: 'Hoàng Thùy Linh', avatar: 'HL', email: 'linhht@yahoo.com', tier: 'Silver', totalReviews: 6 },
    rating: 2, title: 'Chất lượng không như quảng cáo',
    comment: 'Chất lượng vải không giống như trong hình quảng cáo. Sau khi giặt một lần đã có dấu hiệu bị xù lông và phai màu. Cần xem lại quy trình kiểm soát chất lượng. Thất vọng lắm.',
    product: 'Áo Hoodie Oversize Form Rộng', brand: 'Dirty Coins', category: 'Thời trang',
    sentiment: 'negative', status: 'pending', date: '11/10/2024',
    images: 2, helpfulness: 31, verified: true,
    tags: ['Chất lượng kém', 'Phai màu'], source: 'App'
  },
  {
    id: 'REV-9920',
    user: { name: 'Trần Đức Hùng', avatar: 'TH', email: 'duchung@corp.vn', tier: 'Platinum', totalReviews: 38 },
    rating: 4, title: 'Laptop tốt nhưng pin hơi yếu',
    comment: 'Máy chạy mượt, màn hình đẹp, bàn phím gõ sướng tay. Tuy nhiên pin chỉ được khoảng 6 tiếng dùng thực tế, thấp hơn so với quảng cáo 10 tiếng. Hiệu năng tổng thể vẫn ổn.',
    product: 'MacBook Air M3 16GB', brand: 'Apple', category: 'Laptop',
    sentiment: 'neutral', status: 'approved', date: '10/10/2024',
    images: 1, helpfulness: 89, verified: true,
    tags: ['Hiệu năng tốt', 'Pin yếu'], source: 'Web'
  },
  {
    id: 'REV-9919',
    user: { name: 'Lê Thị Phương', avatar: 'LP', email: 'phuong.le@gmail.com', tier: 'Bronze', totalReviews: 2 },
    rating: 1, title: 'BỊ LỪA! Hàng giả không phải hàng thật',
    comment: 'Đặt hàng chính hãng nhưng nhận được hàng fake. Tem bảo hành bị cắt góc, hộp bị móp. Liên hệ shop không phản hồi suốt 3 ngày. Sẽ kiếu nại lên sàn ngay!',
    product: 'Nước hoa Chanel No.5 EDP 100ml', brand: 'Chanel', category: 'Mỹ phẩm',
    sentiment: 'negative', status: 'flagged', date: '09/10/2024',
    images: 4, helpfulness: 124, verified: false,
    tags: ['Hàng giả', 'Urgent', 'Không phản hồi'], source: 'App'
  },
  {
    id: 'REV-9918',
    user: { name: 'Phạm Quốc Bảo', avatar: 'PB', email: 'bao.pham@tech.com', tier: 'Gold', totalReviews: 22 },
    rating: 5, title: 'Tai nghe xịn, âm thanh đỉnh!',
    comment: 'ANC hoạt động rất tốt, chặn tiếng ồn gần như hoàn toàn. Âm thanh bass mạnh, treble trong. Pin 30h dùng thực tế. Thiết kế gọn nhẹ, đeo thoải mái cả ngày. Worth every penny!',
    product: 'Sony WH-1000XM5', brand: 'Sony', category: 'Âm thanh',
    sentiment: 'positive', status: 'approved', date: '08/10/2024',
    images: 2, helpfulness: 67, verified: true,
    reply: 'Cảm ơn bạn Bảo đã để lại đánh giá chi tiết! Chúng tôi rất vui được phục vụ bạn.',
    tags: ['ANC tốt', 'Pin lâu', 'Giá trị'], source: 'Web'
  },
  {
    id: 'REV-9917',
    user: { name: 'Võ Thị Mai Lan', avatar: 'VL', email: 'mailan@shop.vn', tier: 'Silver', totalReviews: 9 },
    rating: 3, title: 'Tạm ổn nhưng còn nhiều chỗ cần cải thiện',
    comment: 'Sản phẩm đúng mô tả, giao hàng đúng hẹn. Nhưng bao bì khá đơn giản, không sang như hình. Dịch vụ CSKH phản hồi hơi chậm, phải chờ gần 2 ngày mới được trả lời.',
    product: 'Bình giữ nhiệt Stanley 1L', brand: 'Stanley', category: 'Gia dụng',
    sentiment: 'neutral', status: 'pending', date: '07/10/2024',
    images: 0, helpfulness: 18, verified: true,
    tags: ['CSKH chậm', 'Đúng mô tả'], source: 'App'
  },
  {
    id: 'REV-9916',
    user: { name: 'Đinh Văn Khoa', avatar: 'ĐK', email: 'khoa.dinh@gmail.com', tier: 'Gold', totalReviews: 17 },
    rating: 5, title: 'Sneaker đẹp quá, flex cả tuần!',
    comment: 'Giày đúng size, chất liệu da tổng hợp mềm mại, đế êm. Mẫu này đang hot trend mà giá lại tốt hơn các nơi khác. Giao hàng trong 2 ngày. Shop đóng gói rất kỹ, có hộp đẹp.',
    product: 'Nike Air Force 1 Low White', brand: 'Nike', category: 'Giày dép',
    sentiment: 'positive', status: 'approved', date: '06/10/2024',
    images: 5, helpfulness: 53, verified: true,
    tags: ['Đúng size', 'Đóng gói đẹp', 'Giá tốt'], source: 'Social'
  },
  {
    id: 'REV-9915',
    user: { name: 'Bùi Ngọc Hà', avatar: 'BH', email: 'ha.bui@yahoo.com', tier: 'Bronze', totalReviews: 3 },
    rating: 2, title: 'Giao hàng quá chậm, sản phẩm ổn',
    comment: 'Đặt hàng ngày 1/10 mà đến 7/10 mới nhận được. Shop không thông báo lý do delay. Phải tự gọi cho shipper hỏi thăm. Sản phẩm thì ổn nhưng trải nghiệm mua hàng rất tệ.',
    product: 'Đèn bàn LED Philips', brand: 'Philips', category: 'Gia dụng',
    sentiment: 'negative', status: 'pending', date: '07/10/2024',
    images: 1, helpfulness: 29, verified: true,
    tags: ['Giao chậm', 'Không thông báo'], source: 'Web'
  },
];

// ─── UTILS ────────────────────────────────────────────────────────────────────

const sentimentConfig: Record<Sentiment, { bg: string; text: string; icon: React.ReactNode; label: string; border: string }> = {
  positive: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200', icon: <Smile size={11}/>, label: 'Tích cực' },
  negative: { bg: 'bg-red-50',   text: 'text-red-600',   border: 'border-red-200',   icon: <Frown size={11}/>, label: 'Tiêu cực' },
  neutral:  { bg: 'bg-slate-100',text: 'text-slate-600', border: 'border-slate-200', icon: <Meh  size={11}/>, label: 'Trung lập' },
};

const statusConfig: Record<ReviewStatus, { bg: string; text: string; border: string; label: string; dot: string }> = {
  approved: { bg:'bg-green-50',  text:'text-green-700', border:'border-green-200', label:'Đã duyệt',  dot:'bg-green-500' },
  pending:  { bg:'bg-amber-50',  text:'text-amber-700', border:'border-amber-200', label:'Chờ duyệt', dot:'bg-amber-500' },
  rejected: { bg:'bg-red-50',    text:'text-red-600',   border:'border-red-200',   label:'Từ chối',   dot:'bg-red-500'   },
  flagged:  { bg:'bg-orange-50', text:'text-orange-700',border:'border-orange-200',label:'Gắn cờ',   dot:'bg-orange-500'},
};

const tierColor: Record<string, string> = {
  Platinum: 'bg-slate-900 text-slate-100 border-slate-700',
  Gold:     'bg-amber-50 text-amber-700 border-amber-200',
  Silver:   'bg-slate-100 text-slate-600 border-slate-300',
  Bronze:   'bg-orange-50 text-orange-700 border-orange-200',
};

const sourceIcon: Record<string, React.ReactNode> = {
  Web:    <Globe size={11}/>,
  App:    <Sparkles size={11}/>,
  Social: <Users size={11}/>,
};

// ─── SUB-COMPONENTS ───────────────────────────────────────────────────────────

const StarRow: React.FC<StarRowProps> = ({ rating, size = 13 }) => (
  <div className="flex gap-0.5 text-primary">
    {[1,2,3,4,5].map(i => (
      <Star key={i} size={size} fill={i <= rating ? 'currentColor' : 'none'} strokeWidth={1.5}/>
    ))}
  </div>
);

const SentimentBadge: React.FC<SentimentBadgeProps> = ({ sentiment }) => {
  const s = sentimentConfig[sentiment];
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black border ${s.bg} ${s.text} ${s.border}`}>
      {s.icon} {s.label}
    </span>
  );
};

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const s = statusConfig[status];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg text-[10px] font-black border ${s.bg} ${s.text} ${s.border}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`}/>{s.label}
    </span>
  );
};

const StatCard: React.FC<StatCardProps> = ({ icon, label, value, sub, trend, trendUp, highlight }) => (
  <div className={`rounded-2xl p-5 flex flex-col gap-3 border transition-all hover:shadow-md ${highlight ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20' : 'bg-card border-border'}`}>
    <div className="flex items-center justify-between">
      <div className={`p-2.5 rounded-xl ${highlight ? 'bg-white/20' : 'bg-primary/8 text-primary'}`}>{icon}</div>
      {trend && (
        <span className={`flex items-center gap-0.5 text-[11px] font-bold px-2 py-0.5 rounded-full ${
          highlight ? 'bg-white/20 text-white' : trendUp ? 'text-green-600 bg-green-50' : 'text-red-500 bg-red-50'
        }`}>
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

// ─── REPLY MODAL ──────────────────────────────────────────────────────────────

interface ReplyModalProps { review: Review; onClose: () => void }
const ReplyModal: React.FC<ReplyModalProps> = ({ review, onClose }) => {
  const [text, setText] = useState('');
  const templates = ['Cảm ơn bạn đã tin tưởng!', 'Chúng tôi xin lỗi về trải nghiệm này.', 'Chúng tôi đã ghi nhận và sẽ cải thiện.'];
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-foreground/20 backdrop-blur-sm" onClick={onClose}/>
      <div className="relative bg-card border border-border rounded-2xl w-full max-w-lg shadow-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-black text-foreground flex items-center gap-2"><Reply size={16} className="text-primary"/> Phản hồi đánh giá</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground"><X size={15}/></button>
        </div>
        <div className="bg-secondary border border-border rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-7 w-7 bg-primary/10 text-primary rounded-lg flex items-center justify-center text-xs font-black">{review.user.avatar}</div>
            <span className="text-sm font-bold text-foreground">{review.user.name}</span>
            <StarRow rating={review.rating} size={11}/>
          </div>
          <p className="text-sm text-muted-foreground italic">"{review.comment.slice(0, 120)}..."</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {templates.map(t => (
            <button key={t} onClick={() => setText(t)}
              className="text-[11px] px-3 py-1.5 bg-secondary hover:bg-primary/10 hover:text-primary border border-border rounded-lg font-medium transition-all">
              {t}
            </button>
          ))}
        </div>
        <textarea
          value={text} onChange={e => setText(e.target.value)}
          placeholder="Nhập nội dung phản hồi..."
          className="w-full min-h-[120px] bg-secondary border border-border rounded-xl p-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 resize-none"
        />
        <div className="flex gap-2">
          <button onClick={onClose} className="flex-1 py-2.5 bg-secondary hover:bg-muted border border-border rounded-xl text-sm font-bold text-foreground transition-all">Hủy</button>
          <button className="flex-1 py-2.5 bg-primary hover:bg-primary-light text-white rounded-xl text-sm font-black transition-all flex items-center justify-center gap-2 shadow shadow-primary/25">
            <Send size={14}/> Gửi phản hồi
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── REVIEW CARD ──────────────────────────────────────────────────────────────

interface ReviewCardProps {
  review: Review;
  selected: boolean;
  onToggle: () => void;
  onReply: () => void;
}
const ReviewCard: React.FC<ReviewCardProps> = ({ review, selected, onToggle, onReply }) => {
  const [expanded, setExpanded] = useState(false);
  const isLong = review.comment.length > 160;
  const displayText = (!expanded && isLong) ? review.comment.slice(0, 160) + '…' : review.comment;

  return (
    <div className={`border-b border-border transition-colors group ${selected ? 'bg-primary/[0.03]' : 'hover:bg-secondary/30'}`}>
      <div className="p-5">
        <div className="flex gap-4">
          {/* Checkbox */}
          <div className="pt-0.5 flex-shrink-0">
            <input type="checkbox" checked={selected} onChange={onToggle} className="accent-primary cursor-pointer mt-1"/>
          </div>

          {/* Avatar */}
          <div className="flex-shrink-0">
            <div className="h-10 w-10 rounded-xl bg-secondary border border-border flex items-center justify-center text-sm font-black text-foreground">
              {review.user.avatar}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0 space-y-2.5">
            {/* Row 1: user + meta */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-black text-foreground">{review.user.name}</span>
              <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-md border ${tierColor[review.user.tier] ?? ''}`}>{review.user.tier}</span>
              <span className="text-[10px] text-muted-foreground">{review.user.totalReviews} đánh giá</span>
              {review.verified && (
                <span className="text-[10px] text-green-600 font-bold flex items-center gap-0.5 bg-green-50 border border-green-200 px-1.5 py-0.5 rounded-full">
                  <ShieldCheck size={10}/> Đã xác minh
                </span>
              )}
              <span className="ml-auto text-[10px] text-muted-foreground flex items-center gap-1"><Calendar size={10}/>{review.date}</span>
            </div>

            {/* Row 2: stars + badges */}
            <div className="flex flex-wrap items-center gap-2">
              <StarRow rating={review.rating}/>
              <SentimentBadge sentiment={review.sentiment}/>
              <StatusBadge status={review.status}/>
              <span className="text-[10px] text-muted-foreground flex items-center gap-1 ml-auto">
                {sourceIcon[review.source]} {review.source}
              </span>
            </div>

            {/* Row 3: title */}
            <p className="text-sm font-bold text-foreground leading-tight">{review.title}</p>

            {/* Row 4: comment */}
            <p className="text-sm text-muted-foreground leading-relaxed">
              {displayText}
              {isLong && (
                <button onClick={() => setExpanded(!expanded)} className="text-primary font-bold ml-1 hover:underline text-xs">
                  {expanded ? 'Thu gọn' : 'Xem thêm'}
                </button>
              )}
            </p>

            {/* Row 5: tags */}
            {review.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {review.tags.map(t => (
                  <span key={t} className="text-[10px] px-2 py-0.5 bg-secondary border border-border rounded-full text-muted-foreground font-medium">{t}</span>
                ))}
              </div>
            )}

            {/* Row 6: images */}
            {review.images > 0 && (
              <div className="flex gap-2">
                {Array.from({ length: review.images }).map((_, i) => (
                  <div key={i} className="h-14 w-14 rounded-lg bg-secondary border border-border flex items-center justify-center text-muted-foreground hover:border-primary hover:text-primary cursor-pointer transition-all">
                    <ImageIcon size={16}/>
                  </div>
                ))}
              </div>
            )}

            {/* Reply preview */}
            {review.reply && (
              <div className="bg-primary/[0.04] border border-primary/20 rounded-xl p-3 flex gap-2">
                <Reply size={13} className="text-primary flex-shrink-0 mt-0.5"/>
                <div>
                  <span className="text-[10px] font-black text-primary">Phản hồi của Shop:</span>
                  <p className="text-xs text-muted-foreground mt-0.5">{review.reply}</p>
                </div>
              </div>
            )}

            {/* Row 7: footer actions */}
            <div className="flex items-center gap-3 pt-1">
              <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                <ThumbsUp size={11}/> {review.helpfulness} người thấy hữu ích
              </span>
              <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                <Package size={11}/>
                <span className="font-medium text-foreground">{review.product}</span>
                <span className="text-muted-foreground">· {review.brand}</span>
              </span>

              {/* Action buttons */}
              <div className="ml-auto flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
                {!review.reply && (
                  <button onClick={onReply}
                    className="px-3 py-1.5 bg-primary/10 hover:bg-primary hover:text-white text-primary rounded-lg text-[11px] font-bold flex items-center gap-1.5 transition-all border border-primary/20">
                    <Reply size={11}/> Phản hồi
                  </button>
                )}
                {review.status === 'pending' && (
                  <button className="px-2.5 py-1.5 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg text-[11px] font-bold flex items-center gap-1 transition-all border border-green-200">
                    <Check size={11}/> Duyệt
                  </button>
                )}
                <button className="p-1.5 rounded-lg bg-secondary hover:bg-muted text-muted-foreground hover:text-amber-600 transition-all border border-border" title="Gắn cờ"><Flag size={12}/></button>
                <button className="p-1.5 rounded-lg bg-secondary hover:bg-red-50 text-muted-foreground hover:text-red-500 transition-all border border-border" title="Xóa"><Trash2 size={12}/></button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── MAIN ─────────────────────────────────────────────────────────────────────

export default function ReviewManagement() {
  const [search, setSearch]             = useState('');
  const [activeTab, setActiveTab]       = useState<ActiveTab>('all');
  const [filterStar, setFilterStar]     = useState<number>(0);
  const [filterCat, setFilterCat]       = useState('all');
  const [sortCol, setSortCol]           = useState<SortCol>('date');
  const [sortDir, setSortDir]           = useState<SortDir>('desc');
  const [selected, setSelected]         = useState<string[]>([]);
  const [replyTarget, setReplyTarget]   = useState<Review | null>(null);

  const categories = useMemo(() => ['all', ...Array.from(new Set(REVIEWS.map(r => r.category)))], []);

  const filtered = useMemo<Review[]>(() => {
    return REVIEWS.filter(r => {
      const q = search.toLowerCase();
      const matchQ    = r.comment.toLowerCase().includes(q) || r.title.toLowerCase().includes(q) || r.product.toLowerCase().includes(q) || r.user.name.toLowerCase().includes(q);
      const matchTab  = activeTab === 'all' || (activeTab === 'pending' && r.status === 'pending') || (activeTab === 'negative' && r.sentiment === 'negative') || (activeTab === 'flagged' && r.status === 'flagged');
      const matchStar = filterStar === 0 || r.rating === filterStar;
      const matchCat  = filterCat === 'all' || r.category === filterCat;
      return matchQ && matchTab && matchStar && matchCat;
    }).sort((a, b) => {
      const d = sortDir === 'asc' ? 1 : -1;
      if (sortCol === 'rating')      return (a.rating - b.rating) * d;
      if (sortCol === 'helpfulness') return (a.helpfulness - b.helpfulness) * d;
      return a.date.localeCompare(b.date) * d * -1;
    });
  }, [search, activeTab, filterStar, filterCat, sortCol, sortDir]);

  const toggleSelect  = (id: string) => setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);
  const toggleAll     = () => setSelected(selected.length === filtered.length ? [] : filtered.map(r => r.id));

  const tabCount = (tab: ActiveTab): number => {
    if (tab === 'all')      return REVIEWS.length;
    if (tab === 'pending')  return REVIEWS.filter(r => r.status  === 'pending').length;
    if (tab === 'negative') return REVIEWS.filter(r => r.sentiment==='negative').length;
    if (tab === 'flagged')  return REVIEWS.filter(r => r.status  === 'flagged').length;
    return 0;
  };

  const SortIcon: React.FC<{ col: SortCol }> = ({ col }) =>
    sortCol === col
      ? (sortDir === 'desc' ? <ChevronDown size={11} className="text-primary"/> : <ChevronUp size={11} className="text-primary"/>)
      : <ChevronDown size={11} className="text-muted-foreground/40"/>;

  return (
    <div className="min-h-screen bg-background text-foreground">
      {replyTarget && <ReplyModal review={replyTarget} onClose={() => setReplyTarget(null)}/>}

      {/* Nav */}
      <div className="border-b border-border bg-card px-6 py-3 flex items-center justify-between sticky top-0 z-40 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="h-7 w-7 bg-primary rounded-lg flex items-center justify-center shadow-md shadow-primary/30">
            <Star size={13} className="text-white" fill="white"/>
          </div>
          <span className="font-black text-foreground text-sm tracking-tight">CRM Pro</span>
          <span className="text-muted-foreground mx-1 text-sm">›</span>
          <span className="text-muted-foreground text-sm">Quản lý đánh giá</span>
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
            <h1 className="text-3xl font-black tracking-tight text-foreground">Đánh giá & Phản hồi</h1>
            <p className="text-muted-foreground text-sm mt-1">Giám sát, phân tích và xử lý toàn bộ review từ khách hàng</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-4 py-2.5 bg-secondary hover:bg-muted border border-border rounded-xl text-sm font-bold text-foreground flex items-center gap-2 transition-all">
              <Download size={14}/> Xuất báo cáo
            </button>
            <button className="px-4 py-2.5 bg-primary hover:bg-primary-light rounded-xl text-sm font-black text-white flex items-center gap-2 transition-all shadow-lg shadow-primary/25">
              <Check size={14}/> Duyệt tất cả
            </button>
          </div>
        </div>

        {/* KPI row */}
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
          <StatCard highlight icon={<Star size={15} className="text-white" fill="white"/>} label="Điểm đánh giá TB" value="4.8★" trend="+0.2" trendUp sub="Dựa trên 1,240 review"/>
          <StatCard icon={<MessageSquare size={15}/>} label="Tổng đánh giá"    value="1,240"  trend="+9.4%"  trendUp sub="↑ 108 tuần này"/>
          <StatCard icon={<Clock size={15}/>}         label="Chờ xử lý"        value="32"     trend="+4"     trendUp={false} sub="Cần phản hồi ngay"/>
          <StatCard icon={<AlertCircle size={15}/>}   label="Gắn cờ khẩn"     value="5"      trend="-3"     trendUp sub="Giảm so với tuần trước"/>
          <StatCard icon={<Reply size={15}/>}         label="Tỉ lệ phản hồi"  value="78%"    trend="+5%"    trendUp sub="Mục tiêu 90%"/>
          <StatCard icon={<Zap size={15}/>}           label="Thời gian phản hồi" value="2.4h" trend="-0.8h" trendUp sub="TB trong 7 ngày"/>
        </div>

        {/* Analytics row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

          {/* Sentiment trend */}
          <div className="lg:col-span-2 bg-card border border-border rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-sm font-black text-foreground">Xu hướng cảm xúc 7 ngày</div>
                <div className="text-[11px] text-muted-foreground mt-0.5">Phân loại review theo tâm lý khách hàng</div>
              </div>
              <div className="flex items-center gap-4 text-[11px] text-muted-foreground">
                <span className="flex items-center gap-1.5"><span className="h-2 w-3 bg-green-500 rounded-sm inline-block"/> Tích cực</span>
                <span className="flex items-center gap-1.5"><span className="h-2 w-3 bg-primary rounded-sm inline-block"/> Tiêu cực</span>
                <span className="flex items-center gap-1.5"><span className="h-2 w-3 bg-slate-300 rounded-sm inline-block"/> Trung lập</span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="posGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#22c55e" stopOpacity={0.2}/>
                    <stop offset="100%" stopColor="#22c55e" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="negGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#E40F2A" stopOpacity={0.15}/>
                    <stop offset="100%" stopColor="#E40F2A" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false}/>
                <XAxis dataKey="day" tick={{ fontSize:10, fill:'var(--muted-foreground)' }} axisLine={false} tickLine={false}/>
                <YAxis tick={{ fontSize:10, fill:'var(--muted-foreground)' }} axisLine={false} tickLine={false}/>
                <RTooltip contentStyle={{ background:'var(--card)', border:'1px solid var(--border)', borderRadius:'12px', fontSize:'12px', color:'var(--foreground)' }}/>
                <Area type="monotone" dataKey="positive" stroke="#22c55e" strokeWidth={2} fill="url(#posGrad)"/>
                <Area type="monotone" dataKey="negative" stroke="#E40F2A" strokeWidth={2} fill="url(#negGrad)"/>
                <Area type="monotone" dataKey="neutral"  stroke="#94a3b8" strokeWidth={1.5} fill="none" strokeDasharray="4 4"/>
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Right column */}
          <div className="space-y-4">
            {/* Rating distribution */}
            <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
              <div className="text-sm font-black text-foreground mb-4">Phân bổ số sao</div>
              <div className="space-y-2.5">
                {ratingDist.map(r => {
                  const total = ratingDist.reduce((s, x) => s + x.count, 0);
                  const pct   = Math.round((r.count / total) * 100);
                  return (
                    <button key={r.star} onClick={() => setFilterStar(filterStar === parseInt(r.star) ? 0 : parseInt(r.star))}
                      className={`flex items-center gap-2 w-full group transition-all rounded-lg px-1 py-0.5 ${filterStar === parseInt(r.star) ? 'bg-primary/5' : 'hover:bg-secondary'}`}>
                      <span className="text-[11px] font-black text-foreground w-5 text-right">{r.star[0]}</span>
                      <Star size={10} className="text-primary" fill="currentColor"/>
                      <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full transition-all" style={{ width:`${pct}%` }}/>
                      </div>
                      <span className="text-[10px] text-muted-foreground w-8 text-right">{r.count}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Sentiment breakdown */}
            <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles size={14} className="text-primary"/>
                <span className="text-sm font-black text-foreground">Phân tích AI</span>
              </div>
              {([['positive',82,'bg-green-500'],['negative',12,'bg-primary'],['neutral',6,'bg-slate-300']] as [Sentiment, number, string][]).map(([sent, val, color]) => {
                const cfg = sentimentConfig[sent];
                return (
                  <div key={sent} className="mb-3 last:mb-0">
                    <div className="flex justify-between items-center mb-1">
                      <span className={`text-[11px] font-bold flex items-center gap-1.5 ${cfg.text}`}>{cfg.icon} {cfg.label}</span>
                      <span className="text-[11px] font-black text-foreground">{val}%</span>
                    </div>
                    <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                      <div className={`h-full ${color} rounded-full`} style={{ width:`${val}%` }}/>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Topic cloud */}
        <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Hash size={14} className="text-primary"/>
              <span className="text-sm font-black text-foreground">Chủ đề nổi bật từ AI</span>
            </div>
            <span className="text-[11px] text-muted-foreground">Được trích xuất từ nội dung review</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {topicData.map(t => {
              const cfg = sentimentConfig[t.sentiment];
              const size = t.count > 200 ? 'text-sm px-3 py-1.5' : t.count > 100 ? 'text-[11px] px-2.5 py-1' : 'text-[10px] px-2 py-0.5';
              return (
                <button key={t.topic} className={`font-bold rounded-full border transition-all hover:shadow-sm ${size} ${cfg.bg} ${cfg.text} ${cfg.border}`}>
                  {t.topic} <span className="opacity-60 ml-1">{t.count}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Reviews table */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">

          {/* Tabs + toolbar */}
          <div className="border-b border-border">
            {/* Tabs */}
            <div className="flex items-center gap-1 px-5 pt-4 border-b border-border/50">
              {(['all','pending','negative','flagged'] as ActiveTab[]).map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)}
                  className={`relative pb-3 px-1 text-[11px] font-black uppercase tracking-widest flex items-center gap-1.5 transition-all ${
                    activeTab === tab ? 'text-primary border-b-2 border-primary -mb-px' : 'text-muted-foreground hover:text-foreground'
                  }`}>
                  {{ all:'Tất cả', pending:'Chờ duyệt', negative:'Tiêu cực', flagged:'Gắn cờ' }[tab]}
                  <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-black ${activeTab === tab ? 'bg-primary text-white' : 'bg-secondary text-muted-foreground'}`}>
                    {tabCount(tab)}
                  </span>
                </button>
              ))}
            </div>

            {/* Toolbar */}
            <div className="px-5 py-3 flex flex-col md:flex-row gap-3 items-start md:items-center justify-between bg-secondary/20">
              <div className="flex items-center gap-2 flex-wrap">
                {/* Category filter */}
                <select value={filterCat} onChange={e => setFilterCat(e.target.value)}
                  className="bg-card border border-border rounded-xl text-[11px] font-bold text-foreground px-3 py-2 focus:outline-none focus:border-primary/50">
                  {categories.map(c => <option key={c} value={c}>{c === 'all' ? 'Tất cả danh mục' : c}</option>)}
                </select>

                {/* Sort */}
                <button onClick={() => { if(sortCol==='date'){setSortDir(d=>d==='asc'?'desc':'asc')} else {setSortCol('date');setSortDir('desc')} }}
                  className={`px-3 py-2 rounded-xl text-[11px] font-bold border flex items-center gap-1.5 transition-all ${sortCol==='date'?'bg-primary text-white border-primary':'bg-card text-muted-foreground border-border hover:bg-secondary'}`}>
                  <Calendar size={11}/> Ngày <SortIcon col="date"/>
                </button>
                <button onClick={() => { if(sortCol==='rating'){setSortDir(d=>d==='asc'?'desc':'asc')} else {setSortCol('rating');setSortDir('desc')} }}
                  className={`px-3 py-2 rounded-xl text-[11px] font-bold border flex items-center gap-1.5 transition-all ${sortCol==='rating'?'bg-primary text-white border-primary':'bg-card text-muted-foreground border-border hover:bg-secondary'}`}>
                  <Star size={11}/> Rating <SortIcon col="rating"/>
                </button>
                <button onClick={() => { if(sortCol==='helpfulness'){setSortDir(d=>d==='asc'?'desc':'asc')} else {setSortCol('helpfulness');setSortDir('desc')} }}
                  className={`px-3 py-2 rounded-xl text-[11px] font-bold border flex items-center gap-1.5 transition-all ${sortCol==='helpfulness'?'bg-primary text-white border-primary':'bg-card text-muted-foreground border-border hover:bg-secondary'}`}>
                  <ThumbsUp size={11}/> Hữu ích <SortIcon col="helpfulness"/>
                </button>

                {filterStar > 0 && (
                  <button onClick={() => setFilterStar(0)} className="px-3 py-2 bg-primary/10 text-primary border border-primary/20 rounded-xl text-[11px] font-bold flex items-center gap-1.5">
                    {filterStar}★ <X size={11}/>
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2 w-full md:w-auto">
                <div className="relative flex-1 md:w-72">
                  <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"/>
                  <input value={search} onChange={e => setSearch(e.target.value)}
                    placeholder="Tìm review, sản phẩm, khách hàng..."
                    className="w-full bg-card border border-border rounded-xl pl-9 pr-8 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-all"/>
                  {search && <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"><X size={11}/></button>}
                </div>
              </div>
            </div>
          </div>

          {/* Bulk bar */}
          {selected.length > 0 && (
            <div className="px-5 py-2.5 bg-primary/[0.05] border-b border-primary/20 flex items-center gap-3">
              <span className="text-sm font-bold text-primary">{selected.length} đã chọn</span>
              <div className="flex gap-2 flex-wrap">
                {([['Duyệt tất cả', <Check size={11}/>], ['Từ chối', <X size={11}/>], ['Gắn cờ', <Flag size={11}/>], ['Xóa', <Trash2 size={11}/>]] as [string, React.ReactNode][]).map(([label, icon]) => (
                  <button key={label} className="px-3 py-1 bg-card hover:bg-secondary text-foreground rounded-lg text-[11px] font-bold flex items-center gap-1.5 transition-all border border-border">
                    {icon} {label}
                  </button>
                ))}
              </div>
              <button onClick={() => setSelected([])} className="ml-auto text-muted-foreground hover:text-foreground transition-all"><X size={13}/></button>
            </div>
          )}

          {/* List */}
          <div className="divide-y divide-border/0">
            {filtered.length > 0
              ? filtered.map(r => (
                  <ReviewCard
                    key={r.id}
                    review={r}
                    selected={selected.includes(r.id)}
                    onToggle={() => toggleSelect(r.id)}
                    onReply={() => setReplyTarget(r)}
                  />
                ))
              : (
                <div className="py-20 text-center text-muted-foreground">
                  <Search size={32} className="mx-auto mb-3 opacity-40"/>
                  <p className="font-black text-foreground">Không tìm thấy đánh giá</p>
                  <p className="text-sm mt-1">Thử tìm kiếm với từ khóa hoặc bộ lọc khác</p>
                </div>
              )
            }
          </div>

          {/* Footer / Pagination */}
          <div className="px-5 py-3.5 border-t border-border flex items-center justify-between bg-secondary/20">
            <div className="flex items-center gap-3">
              <input type="checkbox" checked={selected.length === filtered.length && filtered.length > 0} onChange={toggleAll} className="accent-primary cursor-pointer"/>
              <span className="text-[11px] text-muted-foreground">
                Hiển thị <span className="font-bold text-foreground">{filtered.length}</span> / {REVIEWS.length} đánh giá
              </span>
            </div>
            <div className="flex items-center gap-1">
              <button className="h-7 w-7 rounded-lg bg-secondary hover:bg-muted border border-border flex items-center justify-center text-muted-foreground hover:text-foreground transition-all">
                <ChevronLeft size={13}/>
              </button>
              {([1,2,3,'…',42] as (number|string)[]).map((p, i) => (
                <button key={i} className={`h-7 min-w-[28px] px-1 rounded-lg text-[11px] font-bold transition-all ${p === 1 ? 'bg-primary text-white shadow shadow-primary/25' : 'text-muted-foreground hover:bg-secondary hover:text-foreground'}`}>{p}</button>
              ))}
              <button className="h-7 w-7 rounded-lg bg-secondary hover:bg-muted border border-border flex items-center justify-center text-muted-foreground hover:text-foreground transition-all">
                <ChevronRight size={13}/>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}