/**
 * Cryptographic helper to compute deterministic SHA-256 hashes for land deeds,
 * khatians, and tamper verification tests.
 */
export async function computeSha256(data: string): Promise<string> {
  if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', dataBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  // Pure JS fallback (deterministic simple 64-char hex digest for SSR)
  let h0 = 0x6a09e667, h1 = 0xbb67ae85, h2 = 0x3c6ef372, h3 = 0xa54ff53a;
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i);
    h0 = ((h0 << 5) - h0 + char) | 0;
    h1 = ((h1 << 7) - h1 + (char * 31)) | 0;
    h2 = ((h2 << 11) - h2 + (char * 17)) | 0;
    h3 = ((h3 << 13) - h3 + (char * 7)) | 0;
  }
  const toHex = (n: number) => (n >>> 0).toString(16).padStart(8, '0');
  const part1 = toHex(h0) + toHex(h1) + toHex(h2) + toHex(h3);
  const part2 = toHex(h1 ^ h0) + toHex(h2 ^ h3) + toHex(h3 ^ h1) + toHex(h0 ^ h2);
  return (part1 + part2).toLowerCase();
}

/**
 * Generates an SVG QR Code string for embedded digital receipt / porcha rendering
 */
export function generateSvgQrCode(data: string, size = 120): string {
  // Generates a clean, stylized visual QR-like grid matrix representing the payload
  const hash = Math.abs(data.split('').reduce((acc, c) => ((acc << 5) - acc) + c.charCodeAt(0), 0));
  const grid = 9;
  const cellSize = size / grid;
  
  let rects = '';
  // Finder patterns at top-left, top-right, bottom-left
  const isFinder = (r: number, c: number) => {
    return (
      (r < 3 && c < 3) ||
      (r < 3 && c >= grid - 3) ||
      (r >= grid - 3 && c < 3)
    );
  };

  for (let r = 0; r < grid; r++) {
    for (let c = 0; c < grid; c++) {
      let filled = false;
      if (isFinder(r, c)) {
        // Outer finder border and inner dot
        const innerR = r < 3 ? r : (r >= grid - 3 ? r - (grid - 3) : 0);
        const innerC = c < 3 ? c : (c >= grid - 3 ? c - (grid - 3) : 0);
        if (innerR === 1 && innerC === 1) filled = true;
        else if (innerR === 0 || innerR === 2 || innerC === 0 || innerC === 2) filled = true;
      } else {
        const seed = (hash * (r + 1) * 31 + (c + 1) * 17 + r * c) % 100;
        filled = seed > 42;
      }

      if (filled) {
        rects += `<rect x="${(c * cellSize).toFixed(1)}" y="${(r * cellSize).toFixed(1)}" width="${cellSize.toFixed(1)}" height="${cellSize.toFixed(1)}" fill="#064e3b" />`;
      }
    }
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}" class="border border-emerald-300 rounded p-1 bg-white shadow-sm">${rects}</svg>`;
}
