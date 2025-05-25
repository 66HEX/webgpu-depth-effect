'use client';

import { WebGPUCanvas } from '@/components/canvas';
import { useAspect, useTexture } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useMemo } from 'react';
import gsap from 'gsap';

import {
  abs,
  blendScreen,
  oneMinus,
  smoothstep,
  sub,
  texture,
  uniform,
  uv,
  vec3,
} from 'three/tsl';

import * as THREE from 'three/webgpu';
import { useGSAP } from '@gsap/react';
import { PostProcessing } from '@/components/post-processing';

import TEXTUREMAP from '@/assets/raw.jpg';
import DEPTHMAP from '@/assets/depth.png';
import EDGEMAP from '@/assets/edge.jpg';

const WIDTH = 1600;
const HEIGHT = 900;

const Scene = () => {

  const [rawMap, depthMap, edgeMap] = useTexture(
    [TEXTUREMAP.src, DEPTHMAP.src, EDGEMAP.src],
    () => {
      rawMap.colorSpace = THREE.SRGBColorSpace;
    }
  );

  const { material, uniforms } = useMemo(() => {
    const uPointer = uniform(new THREE.Vector2(0));
    const uProgress = uniform(0);

    const strength = 0.01;

    const tDepthMap = texture(depthMap);
    const tEdgeMap = texture(edgeMap);

    const tMap = texture(
      rawMap,
      uv().add(tDepthMap.r.mul(uPointer).mul(strength))
    ).mul(0.5);

    const depth = tDepthMap;

    const flow = sub(1, smoothstep(0, 0.02, abs(depth.sub(uProgress))));

    const mask = oneMinus(tEdgeMap).mul(flow).mul(vec3(0.4, 0.8, 0.5));

    const final = blendScreen(tMap, mask);

    const material = new THREE.MeshBasicNodeMaterial({
      colorNode: final,
    });

    return {
      material,
      uniforms: {
        uPointer,
        uProgress,
      },
    };
  }, [rawMap, depthMap, edgeMap]);

  const [w, h] = useAspect(WIDTH, HEIGHT);

  useGSAP(() => {
    gsap.to(uniforms.uProgress, {
      value: 1,
      repeat: -1,
      duration: 4,
      ease: 'power1.out',
    });
  }, [uniforms.uProgress]);

  useFrame(({ pointer }) => {
    uniforms.uPointer.value = pointer;
  });

  return (
    <mesh scale={[w, h, 1]} material={material}>
      <planeGeometry />
    </mesh>
  );
};


export default function Page() {
  return (
    <div className="h-screen w-screen">
      <WebGPUCanvas>
          <PostProcessing strength={1}></PostProcessing>
          <Scene></Scene>
        </WebGPUCanvas>
    </div>
  );
};
