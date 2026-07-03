export const emergencyApi = {
  request: async () => {
    console.warn('[EMERGENCY PATCH] API fallback active');
    return { success: true, data: null };
  }
};
