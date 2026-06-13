"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Home,
  Search,
  ArrowLeft,
  Smartphone,
  Shirt,
  Laptop,
  Utensils,
  Dumbbell,
  Sparkles,
} from "lucide-react";
import Header from "@/components/header";
import Footer from "@/components/footer";

const CATEGORIES = [
  { label: "Điện thoại", icon: Smartphone, href: "/products?category=phones" },
  { label: "Thời trang", icon: Shirt, href: "/products?category=fashion" },
  { label: "Laptop", icon: Laptop, href: "/products?category=laptops" },
  { label: "Nhà bếp", icon: Utensils, href: "/products?category=kitchen" },
  { label: "Thể thao", icon: Dumbbell, href: "/products?category=sports" },
  { label: "Làm đẹp", icon: Sparkles, href: "/products?category=beauty" },
];

export default function NotFoundPage() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      {/* Main content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-16 text-center">
  
        {/* Error code */}
        <div className="text-8xl font-bold tracking-tighter leading-none mb-3">
          <span className="text-rose-500">4</span>
          <span className="text-foreground">0</span>
          <span className="text-rose-500">4</span>
        </div>

        <h1 className="text-xl font-semibold mb-2">Không tìm thấy trang này!</h1>
        <p className="text-sm text-muted-foreground max-w-xs leading-relaxed mb-8">
          Trang bạn đang tìm kiếm có thể đã bị xóa, đổi tên hoặc tạm thời không hoạt động.
        </p>

        {/* Search */}
        <form onSubmit={handleSearch} className="flex gap-2 w-full max-w-sm mb-8">
          <Input
            type="text"
            placeholder="Tìm kiếm sản phẩm..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" variant="outline" size="icon" aria-label="Tìm kiếm">
            <Search className="w-4 h-4" />
          </Button>
        </form>

        {/* CTA buttons */}
        <div className="flex flex-wrap gap-3 justify-center mb-10">
          <Button asChild className="bg-rose-500 hover:bg-rose-600 text-white">
            <Link href="/">
              <Home className="w-4 h-4 mr-2 " />
              Về trang chủ
            </Link>
          </Button>
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại
          </Button>
        </div>

        {/* Divider */}
        <div className="relative w-full max-w-sm mb-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border/60" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-background px-3 text-xs text-muted-foreground">
              hoặc khám phá danh mục
            </span>
          </div>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-2 justify-center max-w-sm">
          {CATEGORIES.map(({ label, icon: Icon, href }) => (
            <Badge
              key={label}
              variant="outline"
              className="cursor-pointer px-3 py-1.5 text-xs font-normal hover:bg-accent hover:text-accent-foreground transition-colors"
              asChild
            >
              <Link href={href}>
                <Icon className="w-3.5 h-3.5 mr-1.5" />
                {label}
              </Link>
            </Badge>
          ))}
        </div>
      </main>
      {/* Float animation */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50% { transform: translateX(-50%) translateY(-10px); }
        }
      `}</style>
    </div>
  );
}
