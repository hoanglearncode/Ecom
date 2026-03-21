"use client";

import React, { useEffect, useMemo } from "react";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

export function ShoeModel({ mainColor }: { mainColor: string }) {
  // ĐÂY LÀ FILE GIÀY CHUẨN (High Quality) - Model này có đầy đủ các bộ phận chi tiết
  // Link này thuộc kho lưu trữ mẫu chính thức của Poimandres (đội ngũ tạo ra React Three Fiber)
  const { scene } = useGLTF("https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/shoe/model.gltf");
  
  // Tạo bản sao để tránh lỗi render
  const copiedScene = useMemo(() => scene.clone(), [scene]);

  useEffect(() => {
    copiedScene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        const mat = mesh.material as THREE.MeshStandardMaterial;

        // Tối ưu hóa chất liệu để nhìn giống "hàng thật"
        mat.roughness = 0.4; // Độ nhám vải
        mat.metalness = 0.2; // Độ bóng nhẹ

        // Model giày chuẩn thường có các Mesh name: 'mesh', 'laces', 'caps', 'inner'
        // Ta sẽ áp màu "AI Export" vào các phần này
        if (['mesh', 'laces', 'caps'].includes(mesh.name)) {
          mat.color.set(new THREE.Color(mainColor));
        }
      }
    });
  }, [copiedScene, mainColor]);

  // Scale 2.5 để giày to và rõ ràng hơn, xoay nhẹ để tạo góc nhìn đẹp
  return <primitive object={copiedScene} scale={2.5} position={[0, -0.5, 0]} rotation={[0, -Math.PI / 4, 0]} />;
}