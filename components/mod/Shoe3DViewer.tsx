"use client";

import React, { Suspense, useState, useEffect, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { 
  useGLTF, 
  OrbitControls, 
  ContactShadows, 
  Environment, 
  Html 
} from "@react-three/drei";
import * as THREE from "three";

// 1. Loader đơn giản: Bỏ useProgress để tránh lỗi "Cannot update a component while rendering"
function SimpleLoader() {
  return (
    <Html center>
      <div className="flex flex-col items-center justify-center bg-white/90 p-3 rounded-xl shadow-lg border border-[#E40F2A]/20 w-32">
        <div className="w-8 h-8 border-4 border-[#E40F2A]/20 border-t-[#E40F2A] rounded-full animate-spin" />
        <p className="text-[10px] mt-2 font-bold text-[#E40F2A] uppercase tracking-tighter italic">
          Đang tải 3D...
        </p>
      </div>
    </Html>
  );
}

// 2. Component Model: Có cơ chế dự phòng (Fallback) nếu link chết
function ShoeModel({ mainColor }: { mainColor: string }) {
  // Sử dụng link chính thức từ kho demo của Google/Khronos hoặc local
  // Link này tôi đã kiểm tra lại, nếu vẫn 404, hãy tải về bỏ vào /public/models/shoe.glb
  const MODEL_URL = "https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/shoe/model.gltf";
  
  try {
    const { scene } = useGLTF(MODEL_URL);
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const copiedScene = useMemo(() => scene.clone(), [scene]);

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
      copiedScene.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh;
          const mat = mesh.material as THREE.MeshStandardMaterial;
          // Áp màu cho các phần mesh chính của giày
          if (['mesh', 'laces', 'caps', 'inner'].includes(mesh.name)) {
            mat.color.set(new THREE.Color(mainColor));
          }
        }
      });
    }, [copiedScene, mainColor]);

    return <primitive object={copiedScene} scale={2} position={[0, -0.4, 0]} />;
  } catch (error) {
    // Nếu link chết, trả về một khối hộp để không crash trang
    return (
      <mesh scale={0.6}>
        <boxGeometry />
        <meshStandardMaterial color={mainColor} />
      </mesh>
    );
  }
}

export default function Shoe3DViewer({ colors }: { colors: string[] }) {
  const [activeColor, setActiveColor] = useState(colors[0]);
  const [mounted, setMounted] = useState(false);

  // Sửa lỗi Hydration: Chỉ render sau khi đã mount vào Client
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-full aspect-square bg-[#F5F4F4] rounded-3xl flex items-center justify-center">
         <p className="text-gray-400 font-medium">Khởi tạo môi trường 3D...</p>
      </div>
    );
  }

  return (
    <div className="relative w-full aspect-square bg-[#F5F4F4] rounded-3xl overflow-hidden border border-gray-100 shadow-inner">
      <Canvas shadows camera={{ position: [0, 0, 2.5], fov: 45 }} dpr={[1, 2]}>
        <ambientLight intensity={0.7} />
        <spotLight position={[5, 5, 5]} angle={0.15} penumbra={1} castShadow intensity={2} />
        <pointLight position={[-5, 5, -5]} intensity={1} />
        
        <Suspense fallback={<SimpleLoader />}>
          <Environment preset="city" />
          <ShoeModel mainColor={activeColor} />
          <ContactShadows position={[0, -0.8, 0]} opacity={0.3} scale={10} blur={2} far={1} />
        </Suspense>

        <OrbitControls 
          enablePan={false} 
          minPolarAngle={Math.PI / 4} 
          maxPolarAngle={Math.PI / 2.1} 
          makeDefault
        />
      </Canvas>

      {/* Selector màu sắc UI */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-white/90 backdrop-blur-md p-3 rounded-2xl shadow-xl border border-white z-10">
        {colors.map((color) => (
          <button
            key={color}
            onClick={() => setActiveColor(color)}
            className={`w-8 h-8 rounded-full border-2 transition-all transform active:scale-90 ${
              activeColor === color ? "border-[#E40F2A] scale-125 shadow-md" : "border-transparent"
            }`}
            style={{ backgroundColor: color }}
            aria-label={`Chọn màu ${color}`}
          />
        ))}
      </div>

      <div className="absolute top-4 left-4 pointer-events-none">
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-white/50 px-2 py-1 rounded">
          Xoay 360° • 3D Mode
        </span>
      </div>
    </div>
  );
}