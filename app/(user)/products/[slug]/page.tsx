"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Sparkles, Box, RefreshCw, ChevronRight, Zap, Layers, CheckCircle2 } from 'lucide-react';
import Shoe3DViewer from '@/components/mod/Shoe3DViewer'; // Component 3D chúng ta đã làm

// Danh sách ảnh mẫu để demo nhanh
const SAMPLE_IMAGES = [
  "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=600",
  "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=600",
  "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?q=80&w=600"
];

export default function AI3DLabPage() {
  const [step, setStep] = useState<'upload' | 'processing' | 'preview'>('upload');
  const [selectedImg, setSelectedImg] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  // Giả lập quá trình AI quét ảnh
  useEffect(() => {
    if (step === 'processing') {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => setStep('preview'), 500);
            return 100;
          }
          return prev + 2;
        });
      }, 50);
      return () => clearInterval(interval);
    }
  }, [step]);

  const startProcess = (img: string) => {
    setSelectedImg(img);
    setStep('processing');
    setProgress(0);
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] text-[#1a1a1a] font-sans">
      {/* HEADER HIỆU ỨNG */}
      <header className="max-w-7xl mx-auto px-6 pt-12 pb-8 text-center">
        <motion.div 
          initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary mb-4"
        >
          <Sparkles size={16} />
          <span className="text-xs font-bold uppercase tracking-widest">AI Generation Lab</span>
        </motion.div>
        <h1 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter mb-4">
          Từ Ảnh Chụp <span className="text-primary text-outline">Đến 3D</span>
        </h1>
        <p className="text-gray-500 max-w-2xl mx-auto text-lg">
          Công nghệ AI độc quyền trích xuất không gian từ hình ảnh 2D, kiến tạo mô hình 3D hoàn chỉnh chỉ trong vài giây.
        </p>
      </header>

      <main className="max-w-6xl mx-auto px-6 pb-20">
        <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            
            {/* CỘT TRÁI: KHU VỰC ĐẦU VÀO (INPUT) */}
            <div className="p-8 md:p-12 border-r border-gray-50 bg-gray-50/30">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Layers className="text-primary" size={20} /> 1. Đầu vào 2D
              </h3>

              <AnimatePresence mode="wait">
                {step === 'upload' ? (
                  <motion.div 
                    key="upload-ui"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="space-y-8"
                  >
                    <div className="grid grid-cols-3 gap-4">
                      {SAMPLE_IMAGES.map((img, i) => (
                        <button 
                          key={i} 
                          onClick={() => startProcess(img)}
                          className="group relative aspect-square rounded-2xl overflow-hidden border-4 border-transparent hover:border-primary transition-all shadow-md"
                        >
                          <img src={img} alt="Sample" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                          <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                        </button>
                      ))}
                    </div>

                    <label className="flex flex-col items-center justify-center w-full aspect-[16/9] border-2 border-dashed border-gray-200 rounded-3xl cursor-pointer hover:bg-white hover:border-primary/50 transition-all group">
                      <div className="bg-white p-4 rounded-full shadow-sm group-hover:scale-110 transition-transform">
                        <Upload className="text-primary" />
                      </div>
                      <span className="mt-4 font-bold text-gray-400">Tải ảnh giày của bạn</span>
                      <input type="file" className="hidden" />
                    </label>
                  </motion.div>
                ) : (
                  <motion.div 
                    key="image-active"
                    initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                    className="relative aspect-square rounded-3xl overflow-hidden shadow-2xl"
                  >
                    <img src={selectedImg!} alt="Active" className="w-full h-full object-cover" />
                    
                    {/* HIỆU ỨNG SCAN (KHI ĐANG XỬ LÝ) */}
                    {step === 'processing' && (
                      <motion.div 
                        initial={{ top: "0%" }}
                        animate={{ top: "100%" }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                        className="absolute left-0 right-0 h-1 bg-primary shadow-[0_0_20px_rgba(228,15,42,0.8)] z-10"
                      />
                    )}

                    {step === 'preview' && (
                      <div className="absolute inset-0 bg-primary/20 backdrop-blur-[2px] flex items-center justify-center">
                        <div className="bg-white p-3 rounded-full shadow-lg">
                           <CheckCircle2 className="text-green-500 w-8 h-8" />
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* CỘT PHẢI: KHU VỰC KẾT QUẢ (OUTPUT) */}
            <div className="p-8 md:p-12 flex flex-col justify-center">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Box className="text-primary" size={20} /> 2. Kết quả 3D
              </h3>

              <div className="relative aspect-square w-full rounded-3xl bg-gray-100 flex items-center justify-center overflow-hidden">
                <AnimatePresence mode="wait">
                  {step === 'upload' && (
                    <motion.div 
                      key="idle"
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      className="text-center p-8 text-gray-400"
                    >
                      <Box size={64} className="mx-auto mb-4 opacity-20" />
                      <p className="font-medium italic">Vui lòng chọn ảnh để bắt đầu trích xuất</p>
                    </motion.div>
                  )}

                  {step === 'processing' && (
                    <motion.div 
                      key="proc"
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      className="text-center w-full px-12"
                    >
                      <RefreshCw className="w-12 h-12 text-primary animate-spin mx-auto mb-6" />
                      <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden mb-4">
                        <motion.div 
                          className="h-full bg-primary" 
                          style={{ width: `${progress}%` }} 
                        />
                      </div>
                      <p className="text-primary font-black italic animate-pulse">
                        AI ĐANG TÁI CẤU TRÚC: {progress}%
                      </p>
                    </motion.div>
                  )}

                  {step === 'preview' && (
                    <motion.div 
                      key="preview-3d"
                      initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                      className="w-full h-full relative"
                    >
                      <Shoe3DViewer colors={["#E40F2A", "#1a1a1a", "#666666"]} />
                      
                      <button 
                        onClick={() => setStep('upload')}
                        className="absolute top-4 right-4 bg-white/90 p-3 rounded-full hover:bg-primary hover:text-white transition-colors shadow-lg"
                      >
                        <RefreshCw size={20} />
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {step === 'preview' && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  className="mt-8 flex gap-4"
                >
                  <button className="flex-1 bg-black text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-gray-800 transition-all">
                    LƯU VÀO CỬA HÀNG <ChevronRight size={18} />
                  </button>
                  <button className="px-6 border-2 border-gray-100 rounded-2xl hover:bg-gray-50 transition-all">
                    TẢI .GLB
                  </button>
                </motion.div>
              )}
            </div>
          </div>
        </div>

        {/* INFO CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          <div className="p-8 bg-white rounded-[2rem] border border-gray-100 shadow-sm">
             <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center mb-6">
                <Zap size={24} />
             </div>
             <h4 className="font-black italic mb-2">TỐC ĐỘ XỬ LÝ</h4>
             <p className="text-sm text-gray-500">Thuật toán NeRF giúp tạo mô hình chỉ trong chưa đầy 30 giây thay vì hàng giờ render thủ công.</p>
          </div>
          <div className="p-8 bg-white rounded-[2rem] border border-gray-100 shadow-sm">
             <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
                <Layers size={24} />
             </div>
             <h4 className="font-black italic mb-2">ĐỘ CHI TIẾT CAO</h4>
             <p className="text-sm text-gray-500">Tự động nhận diện chất liệu vải, da và các phản xạ ánh sáng từ bức ảnh gốc của bạn.</p>
          </div>
          <div className="p-8 bg-white rounded-[2rem] border border-gray-100 shadow-sm">
             <div className="w-12 h-12 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center mb-6">
                <CheckCircle2 size={24} />
             </div>
             <h4 className="font-black italic mb-2">ĐA NỀN TẢNG</h4>
             <p className="text-sm text-gray-500">Mô hình xuất ra định dạng chuẩn .GLB, tương thích với tất cả các thiết bị AR/VR hiện nay.</p>
          </div>
        </div>
      </main>

      <footer className="py-12 border-t border-gray-100 text-center">
         <p className="text-gray-400 text-sm italic">© 2026 AI Fashion eCommerce System - AI Lab Prototype</p>
      </footer>
    </div>
  );
}