"use client";

import { WebGPUCanvas } from '@/components/canvas';
import { useAspect, useTexture } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useMemo, useState, useRef } from 'react';
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
import { RotateCcw } from 'lucide-react';

import TEXTUREMAP from '@/assets/raw.jpg';
import DEPTHMAP from '@/assets/depth.png';
import EDGEMAP from '@/assets/edge.jpg';

const WIDTH = 1600;
const HEIGHT = 900;

interface MaskColor {
  r: number;
  g: number;
  b: number;
}

interface SceneSettings {
  strength: number;
  brightness: number;
  flowSmoothness: number;
  maskColor: MaskColor;
  animationDuration: number;
  animationEase: string;
  pointerSensitivity: number;
  postProcessingStrength: number;
}

const Page = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [settings, setSettings] = useState<SceneSettings>({
    strength: 0.01,
    brightness: 0.3,
    flowSmoothness: 0.002,
    maskColor: { r: 1, g: 0, b: 0.1 },
    animationDuration: 4,
    animationEase: 'power3.out',
    pointerSensitivity: 1.5,
    postProcessingStrength: 2
  });
  
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const hamburgerLine1Ref = useRef<HTMLDivElement>(null);
  const hamburgerLine2Ref = useRef<HTMLDivElement>(null);
  const hamburgerLine3Ref = useRef<HTMLDivElement>(null);
  
  useGSAP(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuOpen && 
        menuRef.current && 
        buttonRef.current && 
        !menuRef.current.contains(event.target as Node) && 
        !buttonRef.current.contains(event.target as Node)
      ) {
        setMenuOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [menuOpen]);
  
  useGSAP(() => {
    const line1 = hamburgerLine1Ref.current;
    const line2 = hamburgerLine2Ref.current;
    const line3 = hamburgerLine3Ref.current;

    if (line1 && line2 && line3) {
      if (menuOpen) {
        gsap.to(line1, { 
          rotation: 45, 
          y: 0, 
          duration: 0.3, 
          ease: "power2.out" 
        });
        gsap.to(line2, { 
          opacity: 0, 
          duration: 0.3, 
          ease: "power2.out" 
        });
        gsap.to(line3, { 
          rotation: -45, 
          y: 0, 
          duration: 0.3, 
          ease: "power2.out" 
        });
      } else {
        gsap.to(line1, { 
          rotation: 0, 
          y: -5, 
          duration: 0.3, 
          ease: "power2.out" 
        });
        gsap.to(line2, { 
          opacity: 1, 
          duration: 0.3, 
          ease: "power2.out" 
        });
        gsap.to(line3, { 
          rotation: 0, 
          y: 5, 
          duration: 0.3, 
          ease: "power2.out" 
        });
      }
    }
  }, [menuOpen]);
  
  useGSAP(() => {
    const menu = menuRef.current;
    if (menu) {
      if (menuOpen) {
        gsap.fromTo(
          menu, 
          { 
            opacity: 0, 
            backdropFilter: "blur(0px)",
            scale: 0.95,
          },
          { 
            opacity: 1, 
            backdropFilter: "blur(8px)",
            scale: 1,
            duration: 0.3, 
            ease: "power2.out",
            onStart: () => {
              menu.style.display = 'block';
            }
          }
        );
      } else {
        gsap.to(menu, { 
          opacity: 0, 
          backdropFilter: "blur(0px)",
          scale: 0.95,
          duration: 0.3, 
          ease: "power2.out",
          onComplete: () => {
            menu.style.display = 'none';
          }
        });
      }
    }
  }, [menuOpen]);
  
  const resetToDefaults = () => {
    setSettings({
      strength: 0.01,
      brightness: 0.3,
      flowSmoothness: 0.002,
      maskColor: { r: 1, g: 0, b: 0.1 },
      animationDuration: 4,
      animationEase: 'power3.out',
      pointerSensitivity: 2,
      postProcessingStrength: 2
    });
  };
  
  const handleColorChange = (channel: 'r' | 'g' | 'b', value: number): void => {
    setSettings({
      ...settings,
      maskColor: { ...settings.maskColor, [channel]: value }
    });
  };

  return (
    <div className="h-screen w-screen flex justify-center items-center">
      <WebGPUCanvas>
        <PostProcessing strength={settings.postProcessingStrength} />
        <Scene settings={settings} />
      </WebGPUCanvas>
      
      <div className='absolute flex flex-col gap-8 justify-center items-center pointer-events-none p-8'>
        <h1 
          className="font-octo text-4xl md:text-7xl font-bold text-white text-center md:max-w-[52vw] text-shadow-sm"
        >
          Spatial Resonance: A Digital Depth Symphony
        </h1>
        <p className='text-white text-sm text-center md:max-w-1/2 text-shadow-sm'>
          In the intersection of light and mathematics, this interactive canvas explores the liminal space between surface and void, where each fragment becomes a note in an algorithmic composition responding to your presence. Through WebGPU's computational poetry, depth transforms into memory and movement orchestrates cascades of luminous data dancing at 60 frames per second.
        </p>
      </div>
      
      <button
        ref={buttonRef}
        onClick={() => setMenuOpen(!menuOpen)}
        className="fixed top-4 right-4 z-50 p-3 bg-black/50 backdrop-blur-sm border border-white/20 rounded-lg text-white flex items-center justify-center w-10 h-10"
        aria-expanded={menuOpen}
        aria-haspopup="true"
        aria-controls="settings-menu"
        aria-label={menuOpen ? "Close settings" : "Open settings"}
      >
        <div className="flex flex-col justify-center items-center w-6 h-6 relative">
          <div 
            ref={hamburgerLine1Ref}
            className="w-6 h-0.5 bg-white rounded-full absolute"
            style={{ transform: "translateY(-5px)" }}
          />
          <div 
            ref={hamburgerLine2Ref}
            className="w-6 h-0.5 bg-white rounded-full absolute"
          />
          <div 
            ref={hamburgerLine3Ref}
            className="w-6 h-0.5 bg-white rounded-full absolute"
            style={{ transform: "translateY(5px)" }}
          />
        </div>
      </button>
      
      <div 
        ref={menuRef}
        id="settings-menu"
        className="fixed top-16 right-4 z-50 w-80"
        style={{ display: 'none' }}
        role="dialog"
        aria-label="Settings menu"
      >
        <div className="bg-black/50 border border-white/20 rounded-lg p-4 text-white">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Configuration</h3>
            <div className="flex gap-2">
              <button
                onClick={resetToDefaults}
                className="p-1 hover:bg-white/10 rounded transition-colors"
                title="Reset to defaults"
              >
                <RotateCcw size={16} />
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm mb-1">Effect Intensity: {settings.strength.toFixed(3)}</label>
              <input
                type="range"
                min="0"
                max="0.1"
                step="0.001"
                value={settings.strength}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                  setSettings({ ...settings, strength: parseFloat(e.target.value) })
                }
                className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
              />
            </div>

            <div>
              <label className="block text-sm mb-1">Brightness: {settings.brightness.toFixed(2)}</label>
              <input
                type="range"
                min="0.1"
                max="2"
                step="0.1"
                value={settings.brightness}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                  setSettings({ ...settings, brightness: parseFloat(e.target.value) })
                }
                className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
              />
            </div>

            <div>
              <label className="block text-sm mb-1">Flow Smoothness: {settings.flowSmoothness.toFixed(3)}</label>
              <input
                type="range"
                min="0.001"
                max="0.1"
                step="0.001"
                value={settings.flowSmoothness}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                  setSettings({ ...settings, flowSmoothness: parseFloat(e.target.value) })
                }
                className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
              />
            </div>

            <div>
              <label className="block text-sm mb-2">Mask Color</label>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-xs mb-1">R: {settings.maskColor.r.toFixed(2)}</label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={settings.maskColor.r}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                      handleColorChange('r', parseFloat(e.target.value))
                    }
                    className="w-full h-2 bg-red-500/30 rounded-lg appearance-none cursor-pointer slider"
                  />
                </div>
                <div>
                  <label className="block text-xs mb-1">G: {settings.maskColor.g.toFixed(2)}</label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={settings.maskColor.g}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                      handleColorChange('g', parseFloat(e.target.value))
                    }
                    className="w-full h-2 bg-green-500/30 rounded-lg appearance-none cursor-pointer slider"
                  />
                </div>
                <div>
                  <label className="block text-xs mb-1">B: {settings.maskColor.b.toFixed(2)}</label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={settings.maskColor.b}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                      handleColorChange('b', parseFloat(e.target.value))
                    }
                    className="w-full h-2 bg-blue-500/30 rounded-lg appearance-none cursor-pointer slider"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm mb-1">Animation Duration: {settings.animationDuration}s</label>
              <input
                type="range"
                min="1"
                max="10"
                step="0.5"
                value={settings.animationDuration}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                  setSettings({ ...settings, animationDuration: parseFloat(e.target.value) })
                }
                className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
              />
            </div>

            <div>
              <label className="block text-sm mb-1">Animation Type</label>
              <select
                value={settings.animationEase}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => 
                  setSettings({ ...settings, animationEase: e.target.value })
                }
                className="w-full bg-white/10 border border-white/20 rounded px-2 py-1 text-white"
              >
                <option value="power3.out">Power3 Out</option>
                <option value="power2.out">Power2 Out</option>
                <option value="back.out">Back Out</option>
                <option value="elastic.out">Elastic Out</option>
                <option value="bounce.out">Bounce Out</option>
                <option value="none">Linear</option>
              </select>
            </div>

            <div>
              <label className="block text-sm mb-1">Mouse Sensitivity: {settings.pointerSensitivity.toFixed(1)}</label>
              <input
                type="range"
                min="0.1"
                max="3"
                step="0.1"
                value={settings.pointerSensitivity}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                  setSettings({ ...settings, pointerSensitivity: parseFloat(e.target.value) })
                }
                className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
              />
            </div>

            <div>
              <label className="block text-sm mb-1">Post-processing: {settings.postProcessingStrength.toFixed(2)}</label>
              <input
                type="range"
                min="0"
                max="2"
                step="0.1"
                value={settings.postProcessingStrength}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                  setSettings({ ...settings, postProcessingStrength: parseFloat(e.target.value) })
                }
                className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
              />
            </div>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: white;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        }
        
        .slider::-moz-range-thumb {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: white;
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        }
      `}</style>
    </div>
  );
};

interface SceneProps {
  settings: SceneSettings;
}

const Scene: React.FC<SceneProps> = ({ settings }) => {
  const [rawMap, depthMap, edgeMap] = useTexture(
    [TEXTUREMAP.src, DEPTHMAP.src, EDGEMAP.src],
    () => {
      rawMap.colorSpace = THREE.SRGBColorSpace;
    }
  );

  const { material, uniforms } = useMemo(() => {
    const uPointer = uniform(new THREE.Vector2(0));
    const uProgress = uniform(0);

    const tDepthMap = texture(depthMap);
    const tEdgeMap = texture(edgeMap);

    const tMap = texture(
      rawMap,
      uv().add(tDepthMap.r.mul(uPointer).mul(settings.strength))
    ).mul(settings.brightness);

    const depth = tDepthMap;

    const flow = sub(1, smoothstep(0, settings.flowSmoothness, abs(depth.sub(uProgress))));

    const mask = oneMinus(tEdgeMap).mul(flow).mul(vec3(
      settings.maskColor.r, 
      settings.maskColor.g, 
      settings.maskColor.b
    ));

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
  }, [rawMap, depthMap, edgeMap, settings]);

  const [w, h] = useAspect(WIDTH, HEIGHT);

  useGSAP(() => {
    gsap.to(uniforms.uProgress, {
      value: 1,
      repeat: -1,
      duration: settings.animationDuration,
      ease: settings.animationEase,
    });
  }, [uniforms.uProgress, settings.animationDuration, settings.animationEase]);

  useFrame(({ pointer }) => {
    uniforms.uPointer.value.x = pointer.x * settings.pointerSensitivity;
    uniforms.uPointer.value.y = pointer.y * settings.pointerSensitivity;
  });

  return (
    <mesh scale={[w, h, 1]} material={material}>
      <planeGeometry />
    </mesh>
  );
};

export default Page;