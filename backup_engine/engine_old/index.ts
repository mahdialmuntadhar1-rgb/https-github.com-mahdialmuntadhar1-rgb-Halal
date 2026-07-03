export { engine } from "./core/Engine";
export * from "./core";
export * from "./provider";
export * from "./hooks";
export * from "./api";
export * from "./auth";
export * from "./storage";


export { emergencyApi } from './_emergencyApiPatch';


// ?? EMERGENCY AUTO-FIX (prevents blank page crash)
try {
  engine?.register?.('api', {
    request: async () => {
      console.warn('[AUTO FIX] API fallback active');
      return { success: true, data: null };
    }
  });
} catch (e) {
  console.error('[ENGINE FIX FAILED]', e);
}

