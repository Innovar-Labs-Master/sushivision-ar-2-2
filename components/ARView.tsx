
import React, { useEffect, useRef, useState } from 'react';
import { X, Camera, Move, Loader2, Info, Share2, DollarSign, Utensils, RotateCcw, Scan } from 'lucide-react';
import { ChefAnalysis } from '../types';

// Declare custom element for TypeScript is removed to avoid breaking global JSX namespace
// We will use @ts-ignore for the model-viewer element

interface Props {
  imageData?: string;
  modelUrl?: string;
  usdzUrl?: string;
  analysis?: ChefAnalysis | null;
  ingredients?: string;
  onClose: () => void;
  onAddToOrder?: () => void;
}

const ARView: React.FC<Props> = ({ imageData, modelUrl, usdzUrl, analysis, ingredients, onClose, onAddToOrder }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const modelViewerRef = useRef<any>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  // Transform State
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [userScale, setUserScale] = useState(1);

  // Interaction State
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const initialPinchDistance = useRef<number | null>(null);
  const initialPinchScale = useRef<number>(1);

  const [showInfo, setShowInfo] = useState(false);
  const [isTakingPhoto, setIsTakingPhoto] = useState(false);
  const [isModelLoading, setIsModelLoading] = useState(!!modelUrl);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');

  // Inject custom styles for animations
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      @keyframes steam {
        0% { transform: translate(-50%, 0) scale(0.8); opacity: 0; }
        40% { opacity: 0.5; }
        100% { transform: translate(-50%, -60px) scale(1.5); opacity: 0; }
      }
      @keyframes glow-pulse {
        0% { filter: drop-shadow(0 10px 20px rgba(0,0,0,0.5)) drop-shadow(0 0 0px rgba(251, 191, 36, 0)); }
        50% { filter: drop-shadow(0 20px 30px rgba(0,0,0,0.7)) drop-shadow(0 0 15px rgba(251, 191, 36, 0.4)); }
        100% { filter: drop-shadow(0 10px 20px rgba(0,0,0,0.5)) drop-shadow(0 0 0px rgba(251, 191, 36, 0)); }
      }
      @keyframes flash {
        0% { opacity: 0.8; }
        100% { opacity: 0; }
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  useEffect(() => {
    let stream: MediaStream | null = null;
    
    const startCamera = async () => {
      // Stop any existing tracks first
      if (videoRef.current && videoRef.current.srcObject) {
        const existingStream = videoRef.current.srcObject as MediaStream;
        existingStream.getTracks().forEach(track => {
          track.stop();
          track.removeEventListener('ended', () => {});
        });
        videoRef.current.srcObject = null;
      }

      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: facingMode }
        });
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setHasPermission(true);
      } catch (err) {
        console.error("Camera access denied:", err);
        setHasPermission(false);
        stream = null;
      }
    };

    startCamera();

    // Cleanup function - ensures all tracks are stopped
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => {
          track.stop();
          track.removeEventListener('ended', () => {});
        });
        stream = null;
      }
      
      if (videoRef.current) {
        if (videoRef.current.srcObject) {
          const videoStream = videoRef.current.srcObject as MediaStream;
          videoStream.getTracks().forEach(track => {
            track.stop();
            track.removeEventListener('ended', () => {});
          });
        }
        videoRef.current.srcObject = null;
      }
    };
  }, [facingMode]); // Re-run when facingMode changes

  const toggleCamera = () => {
    setFacingMode(prev => prev === 'environment' ? 'user' : 'environment');
  };

  // Mouse Handlers (Desktop)
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    dragStart.current = { x: e.clientX - position.x, y: e.clientY - position.y };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    setPosition({
      x: e.clientX - dragStart.current.x,
      y: e.clientY - dragStart.current.y
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  // Touch Handlers (Mobile - Drag & Pinch)
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      // Single touch - Drag
      setIsDragging(true);
      const clientX = e.touches[0].clientX;
      const clientY = e.touches[0].clientY;
      dragStart.current = { x: clientX - position.x, y: clientY - position.y };
    } else if (e.touches.length === 2) {
      // Two touches - Pinch
      setIsDragging(false);
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      initialPinchDistance.current = dist;
      initialPinchScale.current = userScale;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    // Crucial for preventing scrolling while interacting with AR model
    if (isDragging || initialPinchDistance.current) {
      // e.preventDefault(); // React synthetic event issue, better handled by CSS touch-action
    }

    if (e.touches.length === 1 && isDragging) {
      const clientX = e.touches[0].clientX;
      const clientY = e.touches[0].clientY;
      setPosition({
        x: clientX - dragStart.current.x,
        y: clientY - dragStart.current.y
      });
    } else if (e.touches.length === 2 && initialPinchDistance.current) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const factor = dist / initialPinchDistance.current;
      // Clamp scale between 0.5x and 3x
      setUserScale(Math.min(Math.max(initialPinchScale.current * factor, 0.5), 3));
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    initialPinchDistance.current = null;
  };

  const handleResetView = () => {
    setPosition({ x: 0, y: 0 });
    setUserScale(1);
    // Reset model rotation if possible (requires access to model-viewer API)
    if (modelViewerRef.current) {
      modelViewerRef.current.cameraOrbit = '0deg 75deg 105%';
    }
  };

  const takeSnapshot = async () => {
    if (!videoRef.current || !containerRef.current) return;
    setIsTakingPhoto(true);

    const video = videoRef.current;
    const canvas = document.createElement('canvas');

    // Set canvas to match full video resolution
    const vW = video.videoWidth;
    const vH = video.videoHeight;
    canvas.width = vW;
    canvas.height = vH;

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      setIsTakingPhoto(false);
      return;
    }

    // 1. Draw Full Video Frame
    // If using user-facing camera, we might want to mirror it, but for now let's keep it simple
    ctx.drawImage(video, 0, 0, vW, vH);

    // 2. Draw 3D Model or Image
    if (modelUrl && modelViewerRef.current) {
      try {
        // Attempt to capture the model-viewer content
        const blob = await modelViewerRef.current.toBlob({ mimeType: 'image/png' });
        const modelImage = new Image();
        modelImage.src = URL.createObjectURL(blob);

        await new Promise((resolve) => {
          modelImage.onload = () => {
            // Calculate position to match the screen view
            // This is an approximation since we are compositing a 2D screenshot of the 3D model
            // onto the video feed. For perfect alignment, we'd need to match camera intrinsics.
            // For now, we center it and apply the user's scale/position logic.

            const sW = containerRef.current!.clientWidth;
            const sH = containerRef.current!.clientHeight;
            const videoScaleRatio = Math.max(sW / vW, sH / vH);

            // The model viewer itself is a square container in our UI
            // We need to map the UI coordinates to the video canvas coordinates
            const sushiScreenX = (sW / 2) + position.x;
            const sushiScreenY = (sH / 2) + position.y;

            // Convert screen coordinates to video coordinates
            // We need to account for the "object-cover" behavior of the video
            const renderedW = vW * videoScaleRatio;
            const renderedH = vH * videoScaleRatio;
            const renderOffsetX = (sW - renderedW) / 2;
            const renderOffsetY = (sH - renderedH) / 2;

            const sushiVideoX = (sushiScreenX - renderOffsetX) / videoScaleRatio;
            const sushiVideoY = (sushiScreenY - renderOffsetY) / videoScaleRatio;

            // The model viewer is 288px (w-72) or 384px (w-96)
            const isSmallScreen = sW < 640;
            const baseCssSize = isSmallScreen ? 288 : 384;
            const sushiVideoSize = (baseCssSize * userScale) / videoScaleRatio;

            ctx.drawImage(
              modelImage,
              sushiVideoX - (sushiVideoSize / 2),
              sushiVideoY - (sushiVideoSize / 2),
              sushiVideoSize,
              sushiVideoSize
            );
            resolve(null);
          };
          modelImage.onerror = () => resolve(null);
        });
      } catch (e) {
        console.error("Failed to capture 3D model:", e);
      }
    } else if (imageData) {
      // ... existing 2D image drawing logic ...
      const sW = containerRef.current.clientWidth;
      const sH = containerRef.current.clientHeight;
      const videoScaleRatio = Math.max(sW / vW, sH / vH);
      const renderedW = vW * videoScaleRatio;
      const renderedH = vH * videoScaleRatio;
      const renderOffsetX = (sW - renderedW) / 2;
      const renderOffsetY = (sH - renderedH) / 2;
      const sushiScreenX = (sW / 2) + position.x;
      const sushiScreenY = (sH / 2) + position.y;
      const sushiVideoX = (sushiScreenX - renderOffsetX) / videoScaleRatio;
      const sushiVideoY = (sushiScreenY - renderOffsetY) / videoScaleRatio;
      const isSmallScreen = sW < 640;
      const baseCssSize = isSmallScreen ? 288 : 384;
      const sushiVideoSize = (baseCssSize * userScale) / videoScaleRatio;

      const dishImage = new Image();
      dishImage.crossOrigin = "anonymous";
      dishImage.src = imageData;

      await new Promise((resolve) => {
        dishImage.onload = () => {
          ctx.save();
          ctx.shadowColor = "rgba(0, 0, 0, 0.7)";
          ctx.shadowBlur = 30;
          ctx.shadowOffsetY = 20;
          ctx.drawImage(dishImage, sushiVideoX - (sushiVideoSize / 2), sushiVideoY - (sushiVideoSize / 2), sushiVideoSize, sushiVideoSize);
          ctx.restore();
          resolve(null);
        }
        dishImage.onerror = () => resolve(null);
      });
    }

    // 3. Draw Info Card if available
    if (analysis) {
      const cardW = 550;
      const cardH = 350;
      // Simplified positioning for snapshot
      const cardX = 40;
      const cardY = vH - cardH - 40;

      // Background
      ctx.fillStyle = 'rgba(15, 15, 20, 0.90)';
      if (typeof ctx.roundRect === 'function') {
        ctx.beginPath();
        ctx.roundRect(cardX, cardY, cardW, cardH, 30);
        ctx.fill();
      } else {
        ctx.fillRect(cardX, cardY, cardW, cardH);
      }

      // Border
      ctx.strokeStyle = 'rgba(251, 191, 36, 0.6)';
      ctx.lineWidth = 4;
      ctx.stroke();

      // Content
      let textY = cardY + 60;

      // Title
      ctx.fillStyle = '#fbbf24'; // Gold
      ctx.font = 'bold 42px serif';
      ctx.fillText(analysis.name, cardX + 30, textY);

      textY += 50;
      ctx.fillStyle = '#e5e5e5';
      ctx.font = '30px sans-serif';
      let desc = analysis.description;
      if (desc.length > 45) desc = desc.substring(0, 42) + "...";
      ctx.fillText(desc, cardX + 30, textY);

      textY += 50;
      // Price
      ctx.fillStyle = '#fbbf24';
      ctx.font = 'bold 36px sans-serif';
      ctx.fillText(`$${analysis.priceEstimate.toFixed(2)}`, cardX + 30, textY + 40);
    }

    try {
      const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, 'image/png'));
      if (blob) {
        const file = new File([blob], 'sushi-vision-ar.png', { type: 'image/png' });

        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({
            files: [file],
            title: 'Mijn Sushi Vision Creatie',
            text: `Ik heb dit gerecht ${analysis?.name || ''} bekeken in AR! #SushiVision`,
          });
        } else {
          throw new Error('Sharing not supported');
        }
      }
    } catch (e) {
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `sushi-vision-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    }

    setTimeout(() => setIsTakingPhoto(false), 1000);
  };

  return (
    <div ref={containerRef} className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center overflow-hidden select-none">

      {/* Snapshot Flash Effect */}
      {isTakingPhoto && (
        <div className="absolute inset-0 bg-white z-[110] pointer-events-none" style={{ animation: 'flash 0.5s ease-out forwards' }}></div>
      )}

      {/* Camera Feed */}
      {hasPermission === true && (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          style={{ transform: facingMode === 'user' ? 'scaleX(-1)' : 'none' }} // Mirror if user facing
        />
      )}

      {/* Error State */}
      {hasPermission === false && (
        <div className="z-20 text-center p-6 max-w-md bg-gray-900/90 rounded-xl border border-red-500/50">
          <Camera className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2">Camera Toegang Vereist</h3>
          <button onClick={onClose} className="px-6 py-2 bg-gray-800 rounded-lg">Sluiten</button>
        </div>
      )}

      {/* Loading */}
      {hasPermission === null && (
        <div className="z-20 flex flex-col items-center text-sushi-gold">
          <Loader2 className="w-12 h-12 animate-spin mb-4" />
          <p>Camera Starten...</p>
        </div>
      )}

      {/* UI Overlay */}
      {hasPermission === true && (
        <>
          {/* Header */}
          <div className="absolute top-0 left-0 right-0 p-4 sm:p-6 z-30 flex justify-between items-start bg-gradient-to-b from-black/70 to-transparent pointer-events-none">
            <div className="pointer-events-auto">
              <h2 className="text-white font-bold text-lg drop-shadow-md flex items-center gap-2">
                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                Live AR
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 bg-black/50 rounded-full text-white hover:bg-black/80 backdrop-blur-sm pointer-events-auto"
            >
              <X size={24} />
            </button>
          </div>

          {/* Right Controls */}
          <div className="absolute right-4 top-24 z-30 flex flex-col gap-4 pointer-events-auto">
            <button
              onClick={() => setShowInfo(true)}
              className="p-3 rounded-full backdrop-blur-md border transition-all bg-black/40 text-white border-white/20 hover:bg-white/10 active:scale-95"
              title="Gerecht Info"
            >
              <Info size={24} />
            </button>
            <button
              onClick={toggleCamera}
              className="p-3 rounded-full backdrop-blur-md border transition-all bg-black/40 text-white border-white/20 hover:bg-white/10 active:scale-95"
              title="Wissel Camera"
            >
              <Scan size={24} />
            </button>
            <button
              onClick={handleResetView}
              className="p-3 rounded-full backdrop-blur-md border transition-all bg-black/40 text-white border-white/20 hover:bg-white/10 active:scale-95"
              title="Reset Positie"
            >
              <RotateCcw size={24} />
            </button>
            <button
              onClick={takeSnapshot}
              className="p-3 bg-black/40 rounded-full text-white border border-white/20 backdrop-blur-md active:scale-95 hover:bg-white/10"
              title="Maak Foto"
            >
              <Share2 size={24} />
            </button>
          </div>

          {/* AR Content Container */}
          {/* Touch action none is crucial here to prevent scrolling */}
          <div
            className="absolute z-20 cursor-move touch-none"
            style={{
              transform: `translate(${position.x}px, ${position.y}px) scale(${userScale})`,
              touchAction: 'none'
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {modelUrl ? (
              // 3D Model Viewer
              <div className="w-72 h-72 sm:w-96 sm:h-96 relative">
                {isModelLoading && (
                  <div className="absolute inset-0 flex items-center justify-center z-10">
                    <Loader2 className="w-10 h-10 text-sushi-gold animate-spin" />
                  </div>
                )}
                {/* @ts-ignore */}
                <model-viewer
                  ref={modelViewerRef}
                  src={modelUrl}
                  ios-src={usdzUrl}
                  alt={analysis?.name || "AR Food"}
                  auto-rotate
                  camera-controls
                  ar
                  shadow-intensity="1"
                  environment-image="neutral"
                  style={{ width: '100%', height: '100%' }}
                  on-load={() => setIsModelLoading(false)}
                >
                  <div slot="poster" className="w-full h-full flex items-center justify-center bg-transparent">
                    <Loader2 className="w-8 h-8 text-sushi-gold animate-spin" />
                  </div>
                </model-viewer>
              </div>
            ) : (
              // 2D Image Fallback
              <div className={`relative group ${isDragging ? 'scale-105' : 'scale-100'} transition-transform flex items-center justify-center`}>
                {/* Steam Effects */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-12 bg-white/20 blur-xl rounded-full pointer-events-none"
                  style={{ animation: 'steam 2.5s infinite ease-out', animationDelay: '0s' }}></div>
                <div className="absolute top-4 left-1/2 -translate-x-1/2 w-8 h-8 bg-white/20 blur-xl rounded-full pointer-events-none"
                  style={{ animation: 'steam 2.5s infinite ease-out', animationDelay: '1s' }}></div>

                {/* The Food */}
                <img
                  src={imageData}
                  alt="AR Food"
                  className="w-72 h-72 sm:w-96 sm:h-96 object-contain pointer-events-none select-none"
                  style={{ animation: 'glow-pulse 3s infinite ease-in-out' }}
                />

                {/* Drag Hint */}
                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-2 text-white/80 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                  <Move size={12} />
                  <span className="text-xs">Sleep om te bewegen • Knijp om te vergroten</span>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Actions */}
          <div className="absolute bottom-8 z-30 w-full px-6 flex items-center justify-between pointer-events-none">
            {/* Snapshot Button */}
            <button
              onClick={takeSnapshot}
              className="w-14 h-14 rounded-full border-2 border-white flex items-center justify-center bg-white/20 backdrop-blur-sm active:scale-90 transition-transform pointer-events-auto hover:bg-white/30"
            >
              <Camera size={24} className="text-white" />
            </button>

            {/* Add to Order Button */}
            {onAddToOrder && (
              <button
                onClick={() => {
                  onAddToOrder();
                  onClose();
                }}
                className="px-6 py-3 bg-sushi-gold text-black font-bold rounded-full shadow-lg flex items-center gap-2 pointer-events-auto hover:bg-yellow-400 active:scale-95 transition-all"
              >
                <Utensils size={18} />
                <span>Toevoegen aan bestelling</span>
              </button>
            )}
          </div>

          {/* Info Modal Pop-up */}
          {showInfo && analysis && (
            <div
              className="absolute inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
              onClick={() => setShowInfo(false)}
            >
              <div
                className="bg-gray-900/95 border border-sushi-gold/40 p-6 rounded-2xl max-w-xs w-full shadow-2xl relative transform transition-all scale-100"
                onClick={e => e.stopPropagation()}
              >
                <button
                  onClick={() => setShowInfo(false)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-white p-1"
                >
                  <X size={20} />
                </button>

                <h3 className="text-2xl font-serif font-bold text-sushi-gold mb-2 pr-8 leading-tight">
                  {analysis.name}
                </h3>
                <p className="text-gray-300 text-sm mb-4 leading-relaxed">
                  {analysis.description}
                </p>

                <div className="space-y-4 border-t border-gray-800 pt-4">
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-gray-500 block mb-1 font-bold">Ingrediënten</span>
                    <p className="text-xs text-gray-300 leading-relaxed">
                      {ingredients || 'Keuze van de chef'}
                    </p>
                  </div>

                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <span className="text-[10px] uppercase tracking-widest text-gray-500 block mb-1 font-bold">Wijnadvies</span>
                      <div className="flex items-center gap-1 text-purple-300">
                        <Utensils size={12} />
                        <span className="text-xs font-medium">{analysis.pairing}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] uppercase tracking-widest text-gray-500 block mb-1 font-bold">Prijs</span>
                      <div className="flex items-center justify-end gap-1 text-sushi-gold">
                        <DollarSign size={14} />
                        <span className="text-xl font-bold">{analysis.priceEstimate.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

        </>
      )}
    </div>
  );
};

export default ARView;
