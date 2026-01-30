/**
 * Device detection and performance tier system
 * Determines device capabilities to optimize rendering quality
 */

export type PerformanceTier = 'high' | 'medium' | 'low';

interface DeviceInfo {
  tier: PerformanceTier;
  isMobile: boolean;
  isTablet: boolean;
  isLowEnd: boolean;
  supportsWebGL: boolean;
  deviceMemory?: number;
  hardwareConcurrency?: number;
}

/**
 * Detect device performance tier based on multiple factors
 */
export function getPerformanceTier(): PerformanceTier {
  // Server-side rendering fallback
  if (typeof window === 'undefined') return 'medium';

  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
  const isTablet = /iPad|Android(?!.*Mobile)/i.test(navigator.userAgent);

  // Check device memory (Chrome/Edge only)
  const deviceMemory = (navigator as any).deviceMemory;
  const hardwareConcurrency = navigator.hardwareConcurrency || 4;

  // Check for low-end indicators
  const hasLowMemory = deviceMemory && deviceMemory <= 4;
  const hasLowCores = hardwareConcurrency <= 4;
  const hasSlowConnection = 
    (navigator as any).connection?.effectiveType === 'slow-2g' ||
    (navigator as any).connection?.effectiveType === '2g';

  // LOW tier: Mobile with low RAM or slow connection
  if (isMobile && (hasLowMemory || hasSlowConnection)) {
    return 'low';
  }

  // LOW tier: Very old devices
  if (hasLowMemory && hasLowCores) {
    return 'low';
  }

  // MEDIUM tier: Tablets or mid-range mobile
  if (isTablet || isMobile) {
    return 'medium';
  }

  // MEDIUM tier: Desktop with limited resources
  if (deviceMemory && deviceMemory <= 8 && hasLowCores) {
    return 'medium';
  }

  // HIGH tier: Everything else (desktop with good specs)
  return 'high';
}

/**
 * Get detailed device information
 */
export function getDeviceInfo(): DeviceInfo {
  if (typeof window === 'undefined') {
    return {
      tier: 'medium',
      isMobile: false,
      isTablet: false,
      isLowEnd: false,
      supportsWebGL: false,
    };
  }

  const tier = getPerformanceTier();
  const isMobile = /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
  const isTablet = /iPad|Android(?!.*Mobile)/i.test(navigator.userAgent);

  // Check WebGL support
  let supportsWebGL = false;
  try {
    const canvas = document.createElement('canvas');
    supportsWebGL = !!(
      canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
    );
    } catch {
       supportsWebGL = false; // Keep original logic, just remove 'e'
    }

  return {
    tier,
    isMobile,
    isTablet,
    isLowEnd: tier === 'low',
    supportsWebGL,
    deviceMemory: (navigator as any).deviceMemory,
    hardwareConcurrency: navigator.hardwareConcurrency,
  };
}

/**
 * Check if user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Get optimal DPR (device pixel ratio) based on performance tier
 */
export function getOptimalDPR(tier: PerformanceTier): number {
  const baseDPR = window.devicePixelRatio || 1;
  
  switch (tier) {
    case 'low':
      return 1; // Force 1x on low-end devices
    case 'medium':
      return Math.min(baseDPR, 1.5); // Cap at 1.5x on medium
    case 'high':
      return Math.min(baseDPR, 2); // Cap at 2x on high-end
    default:
      return 1;
  }
}

/**
 * Check if device is in power saving mode (battery API)
 */
export async function isInPowerSavingMode(): Promise<boolean> {
  if (typeof window === 'undefined') return false;
  
  try {
    const battery = await (navigator as any).getBattery?.();
    if (battery) {
      // Consider power saving if battery is low and not charging
      return battery.level < 0.2 && !battery.charging;
    }
  } catch {
    // Battery API not supported
  }
  
  return false;
}
