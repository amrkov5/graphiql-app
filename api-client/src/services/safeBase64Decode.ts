export const safeBase64Decode = (str: string): string | null => {
  try {
    let cleanStr = decodeURIComponent(str).replace(/[^A-Za-z0-9+/=]/g, '');
    const padding = cleanStr.length % 4;
    if (padding !== 0) {
      cleanStr += '='.repeat(4 - padding);
    }
    const decoded = atob(cleanStr);
    return decodeURIComponent(escape(decoded));
  } catch (error) {
    return null;
  }
};
