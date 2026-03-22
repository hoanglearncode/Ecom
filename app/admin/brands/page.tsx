"use client"
import React, { useState } from 'react';
import { 
  Plus, Search, Filter, Download, MoreHorizontal, 
  Edit2, Trash2, Eye, ArrowUpRight, Globe, 
  CheckCircle2, AlertCircle, Archive, LayoutGrid, List
} from 'lucide-react';

// Giả định các thành phần từ Shadcn UI
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// Mock Data
const BRANDS_DATA = [
  { id: '1', name: 'Nike', slug: 'nike-store', category: 'Fashion', status: 'active', products: 1240, health: 85, logo: 'N', lastUpdate: '2 giờ trước' },
  { id: '2', name: 'Apple Inc', slug: 'apple-global', category: 'Technology', status: 'active', products: 450, health: 98, logo: 'A', lastUpdate: '5 giờ trước' },
  { id: '3', name: 'Samsung', slug: 'samsung-electronics', category: 'Electronics', status: 'inactive', products: 890, health: 45, logo: 'S', lastUpdate: '1 ngày trước' },
  { id: '4', name: 'Adidas', slug: 'adidas-vn', category: 'Fashion', status: 'archived', products: 670, health: 12, logo: 'AD', lastUpdate: '1 tuần trước' },
];

const BrandManagement = () => {
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

  return (
    <div className="flex flex-col gap-8 p-8 bg-background min-h-screen">
      
      {/* --- HEADER SECTION --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Hệ thống Thương hiệu</h1>
          <p className="text-muted-foreground font-medium">Quản lý và theo dõi hiệu suất của 128 đối tác chiến lược.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="border-border hover:bg-secondary">
            <Download className="mr-2 h-4 w-4" /> Xuất dữ liệu
          </Button>
          <Button className="bg-primary hover:bg-primary-light text-white shadow-lg shadow-primary/20">
            <Plus className="mr-2 h-4 w-4" /> Thêm thương hiệu mới
          </Button>
        </div>
      </div>

      {/* --- ANALYTICS CARDS --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Tổng thương hiệu" value="1,284" change="+12.5%" trend="up" />
        <StatsCard title="Đang hoạt động" value="892" change="+3.2%" trend="up" />
        <StatsCard title="Tỷ lệ lấp đầy" value="94.2%" change="-0.4%" trend="down" />
        <StatsCard title="Thương hiệu VIP" value="48" change="+2" trend="up" />
      </div>

      {/* --- MAIN CONTENT --- */}
      <Card className="border-border bg-card/50 backdrop-blur-sm shadow-xl overflow-hidden">
        <Tabs defaultValue="all" className="w-full">
          <div className="flex flex-col sm:flex-row items-center justify-between p-4 border-b border-border gap-4">
            <TabsList className="bg-muted/50 border border-border">
              <TabsTrigger value="all" className="data-[state=active]:bg-primary data-[state=active]:text-white">Tất cả</TabsTrigger>
              <TabsTrigger value="active" className="data-[state=active]:bg-primary data-[state=active]:text-white">Hoạt động</TabsTrigger>
              <TabsTrigger value="inactive" className="data-[state=active]:bg-primary data-[state=active]:text-white">Chờ duyệt</TabsTrigger>
              <TabsTrigger value="archived" className="data-[state=active]:bg-primary data-[state=active]:text-white">Lưu trữ</TabsTrigger>
            </TabsList>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Tìm mã, tên thương hiệu..." className="pl-9 bg-background border-border" />
              </div>
              <Button variant="outline" size="icon"><Filter className="h-4 w-4" /></Button>
              <div className="flex border border-border rounded-lg overflow-hidden">
                <Button 
                  variant={viewMode === 'table' ? 'secondary' : 'ghost'} 
                  size="icon" onClick={() => setViewMode('table')}
                  className="rounded-none h-9 w-9"
                >
                  <List className="h-4 w-4" />
                </Button>
                <Button 
                  variant={viewMode === 'grid' ? 'secondary' : 'ghost'} 
                  size="icon" onClick={() => setViewMode('grid')}
                  className="rounded-none h-9 w-9"
                >
                  <LayoutGrid className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <TabsContent value="all" className="m-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-secondary/30">
                  <TableRow>
                    <TableHead className="w-[50px]"><Checkbox /></TableHead>
                    <TableHead className="font-bold">Thương hiệu</TableHead>
                    <TableHead className="font-bold">Danh mục</TableHead>
                    <TableHead className="font-bold">Sức khỏe Brand</TableHead>
                    <TableHead className="font-bold text-center">Sản phẩm</TableHead>
                    <TableHead className="font-bold">Trạng thái</TableHead>
                    <TableHead className="text-right font-bold">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {BRANDS_DATA.map((brand) => (
                    <TableRow key={brand.id} className="hover:bg-muted/30 transition-all group">
                      <TableCell><Checkbox /></TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10 border border-border rounded-lg">
                            <AvatarFallback className="bg-primary-lighter text-primary font-bold">{brand.logo}</AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <span className="font-bold text-sm text-foreground group-hover:text-primary transition-colors cursor-pointer">{brand.name}</span>
                            <span className="text-xs text-muted-foreground">/{brand.slug}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                         <Badge variant="secondary" className="font-normal">{brand.category}</Badge>
                      </TableCell>
                      <TableCell className="w-[200px]">
                        <div className="flex flex-col gap-1.5">
                          <div className="flex justify-between text-[10px] font-bold uppercase">
                            <span>Score: {brand.health}%</span>
                          </div>
                          <Progress value={brand.health} className="h-1.5" indicatorClassName={brand.health > 70 ? 'bg-green-500' : 'bg-primary'} />
                        </div>
                      </TableCell>
                      <TableCell className="text-center font-semibold">{brand.products.toLocaleString()}</TableCell>
                      <TableCell>
                        <StatusBadge status={brand.status} />
                      </TableCell>
                      <TableCell className="text-right">
                        <BrandActions brand={brand} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
        
        {/* Pagination */}
        <div className="flex items-center justify-between p-4 bg-muted/20 border-t border-border">
          <p className="text-sm text-muted-foreground font-medium">Hiển thị 1-10 trên 128 kết quả</p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled>Trước</Button>
            <Button variant="outline" size="sm" className="bg-primary text-white border-primary">1</Button>
            <Button variant="outline" size="sm">2</Button>
            <Button variant="outline" size="sm">Sau</Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

// --- SUB-COMPONENTS ---

const StatsCard = ({ title, value, change, trend }: { title: string, value: string, change: string, trend: 'up' | 'down' }) => (
  <Card className="border-border hover:border-primary/50 transition-colors shadow-sm">
    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
      <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
      <div className={`p-2 rounded-md ${trend === 'up' ? 'bg-green-100 text-green-600' : 'bg-primary-lighter text-primary'}`}>
        <ArrowUpRight className={`h-4 w-4 ${trend === 'down' && 'rotate-90'}`} />
      </div>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <p className="text-xs font-semibold mt-1 flex items-center gap-1">
        <span className={trend === 'up' ? 'text-green-600' : 'text-primary'}>{change}</span>
        <span className="text-muted-foreground font-normal">so với tháng trước</span>
      </p>
    </CardContent>
  </Card>
);

const StatusBadge = ({ status }: { status: string }) => {
  const configs: Record<string, any> = {
    active: { label: 'Hoạt động', class: 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400', icon: <CheckCircle2 size={12} className="mr-1"/> },
    inactive: { label: 'Chờ duyệt', class: 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400', icon: <AlertCircle size={12} className="mr-1"/> },
    archived: { label: 'Lưu trữ', class: 'bg-muted text-muted-foreground border-border', icon: <Archive size={12} className="mr-1"/> },
  };
  const config = configs[status] || configs.inactive;
  return (
    <Badge variant="outline" className={`px-2 py-0.5 rounded-full font-medium flex w-fit items-center ${config.class}`}>
      {config.icon} {config.label}
    </Badge>
  );
};

const BrandActions = ({ brand }: { brand: any }) => (
  <div className="flex justify-end gap-1">
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary">
                <Eye size={16} />
              </Button>
            </SheetTrigger>
            <SheetContent className="sm:max-w-md border-l border-border bg-card">
              <SheetHeader>
                <SheetTitle className="text-2xl font-bold flex items-center gap-2">
                   <div className="p-2 bg-primary/10 rounded-lg text-primary">{brand.logo}</div>
                   {brand.name}
                </SheetTitle>
                <SheetDescription>Cập nhật lần cuối: {brand.lastUpdate}</SheetDescription>
              </SheetHeader>
              <div className="mt-8 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-secondary rounded-lg border border-border">
                    <p className="text-xs text-muted-foreground uppercase font-bold">Tổng doanh thu</p>
                    <p className="text-xl font-bold">$45,230</p>
                  </div>
                  <div className="p-4 bg-secondary rounded-lg border border-border">
                    <p className="text-xs text-muted-foreground uppercase font-bold">Conversion</p>
                    <p className="text-xl font-bold">12.4%</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="font-bold flex items-center gap-2"><Globe size={16} className="text-primary"/> Thông tin liên hệ</h4>
                  <div className="text-sm space-y-2 text-muted-foreground">
                    <p>Website: <span className="text-foreground font-medium underline">www.{brand.slug}.com</span></p>
                    <p>Email: <span className="text-foreground font-medium italic">contact@{brand.slug}.com</span></p>
                  </div>
                </div>
                <Button className="w-full bg-primary text-white">Chỉnh sửa hồ sơ</Button>
              </div>
            </SheetContent>
          </Sheet>
        </TooltipTrigger>
        <TooltipContent>Xem chi tiết</TooltipContent>
      </Tooltip>
    </TooltipProvider>

    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground"><MoreHorizontal size={16}/></Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel>Hành động</DropdownMenuLabel>
        <DropdownMenuItem><Edit2 className="mr-2 h-4 w-4" /> Chỉnh sửa</DropdownMenuItem>
        <DropdownMenuItem><Download className="mr-2 h-4 w-4" /> Tải báo cáo</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-primary focus:text-white focus:bg-primary"><Trash2 className="mr-2 h-4 w-4" /> Xóa thương hiệu</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  </div>
);

export default BrandManagement;