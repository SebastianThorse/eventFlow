"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export function Analytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  useEffect(() => {
    // This is where you would add analytics tracking
    // For example, using Google Analytics or a custom solution
    const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : "");
    console.log(`Page view: ${url}`);
    
    // Add your actual analytics tracking here
  }, [pathname, searchParams]);
  
  return null;
}