"use client";

import QRCode from "react-qr-code";
import { useState, useEffect } from "react";

interface QRCodeProps {
  url: string;
  size?: number;
}

export function QRCodeComponent({ url, size = 128 }: QRCodeProps) {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  if (!mounted) {
    return (
      <div 
        style={{ width: size, height: size }}
        className="bg-gray-100 animate-pulse rounded"
      />
    );
  }
  
  return (
    <div className="p-4 bg-white rounded-lg">
      <QRCode
        value={url}
        size={size}
        level="M"
      />
      <p className="mt-2 text-xs text-center text-muted-foreground truncate max-w-[128px]">
        {url}
      </p>
    </div>
  );
}