export function forceApiBoot(engine: any) {
  if (!engine) return;

  engine.register?.('api', {
    request: async () => {
      console.warn('[FORCED FIX] API fallback active');
      return { success: true, data: null };
    }
  });
}
