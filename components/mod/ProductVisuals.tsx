"use client";

import React, { useState } from 'react';
import { Box, ImageIcon, ZoomIn } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Shoe3DViewer from './Shoe3DViewer'; // Component 3D đã sửa lỗi ở trên

interface Props {
  images: string[];
  colors: string[];
}

export default function ProductVisuals({ images, colors }: Props) {
  // Trạng thái: '3d' hoặc index của mảng ảnh (0, 1, 2...)
  const [view, setView] = useState<'3d' | number>(0);

  return (
    <div className="flex flex-col gap-4">
      {/* KHU VỰC HIỂN THỊ CHÍNH (MAIN VIEW) */}
      <div className="relative aspect-square w-full bg-[#F5F4F4] rounded-3xl overflow-hidden border border-gray-100 shadow-sm">
        <AnimatePresence mode="wait">
          {view === '3d' ? (
            <motion.div 
              key="3d-view"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="w-full h-full"
            >
              <Shoe3DViewer colors={colors} />
            </motion.div>
          ) : (
            <motion.div 
              key={view}
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.1 }}
              className="w-full h-full relative group cursor-zoom-in"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={images[view as number]} 
                alt="Product real view" 
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 right-4 bg-white/80 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                <ZoomIn className="w-5 h-5 text-gray-600" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* DANH SÁCH ẢNH NHỎ (THUMBNAILS) */}
      <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
        {/* Nút kích hoạt 3D (Đặt đầu tiên) */}
        <button
          onClick={() => setView('3d')}
          className={`relative min-w-[80px] h-[80px] rounded-xl flex flex-col items-center justify-center border-2 transition-all shadow-sm ${
            view === '3d' ? "border-[#E40F2A] bg-white scale-105" : "border-transparent bg-gray-100 opacity-70 hover:opacity-100"
          }`}
        >
          <Box className={`w-6 h-6 ${view === '3d' ? "text-[#E40F2A]" : "text-gray-500"}`} />
          <span className="text-[10px] font-bold mt-1 uppercase">3D View</span>
          {view === '3d' && (
             <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#E40F2A] rounded-full animate-ping" />
          )}
        </button>

        {/* Danh sách ảnh thật */}
        {images.map((img, index) => (
          <button
            key={index}
            onClick={() => setView(index)}
            className={`min-w-[80px] h-[80px] rounded-xl overflow-hidden border-2 transition-all ${
              view === index ? "border-[#E40F2A] scale-105 shadow-md" : "border-transparent opacity-70 hover:opacity-100"
            }`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={img} alt={`Thumb ${index}`} className="w-full h-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}