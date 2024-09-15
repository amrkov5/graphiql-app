export const toBase64 = (str: string) => {
  return btoa(
    String.fromCharCode(...new Uint8Array(new TextEncoder().encode(str)))
  );
};

export const fromBase64 = (base64: string) => {
  return decodeURIComponent(
    new TextDecoder().decode(
      Uint8Array.from(atob(decodeURIComponent(base64)), (c) => c.charCodeAt(0))
    )
  );
};
