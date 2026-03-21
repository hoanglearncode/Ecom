"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense } from "react"
import { OrbitControls, ContactShadows, Environment } from "@react-three/drei";
import { ShoeModel } from "./ShoeModel";

export default function Perfect3DPreview({ activeColor }: { activeColor: string }) {
  return (
    <div className="w-full h-full bg-[#F5F4F4] relative">
      <Canvas shadows camera={{ position: [0, 0, 3], fov: 40 }}>
        {/* Ánh sáng studio để làm nổi bật chi tiết giày */}
        <ambientLight intensity={0.7} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} castShadow />
        <pointLight position={[-10, -10, -10]} intensity={1} />
        
        <Suspense fallback={null}>
          <Environment preset="city" /> {/* Phản chiếu ánh sáng thành phố lên da giày */}
          <ShoeModel mainColor={activeColor} />
          
          {/* Đổ bóng thực tế cực mịn dưới đế giày */}
          <ContactShadows 
            position={[0, -0.85, 0]} 
            opacity={0.5} 
            scale={10} 
            blur={3} 
            far={1} 
          />
        </Suspense>

        <OrbitControls 
          enablePan={false} 
          minPolarAngle={Math.PI / 4} 
          maxPolarAngle={Math.PI / 2} 
        />
      </Canvas>
      
      {/* Hiệu ứng mờ ảo góc dưới để trông chuyên nghiệp */}
      <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-gray-200/50 to-transparent pointer-events-none" />
    </div>
  );
}