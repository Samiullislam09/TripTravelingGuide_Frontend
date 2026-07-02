// Branded cover placeholder for posts that have no real image yet (most of the
// migrated WordPress catalog lost its media). Returns a self-contained SVG data
// URI in the CGHEVEN orange→red brand gradient — no external image service, and
// deterministic per seed so a given post always gets the same tile.

const PALETTES: [string, string][] = [
  ["#f97316", "#ef4444"], // brand: orange → red
  ["#fb923c", "#ea580c"],
  ["#f59e0b", "#f43f5e"],
  ["#fb7185", "#ef4444"],
];

function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

function escapeXml(s: string): string {
  return s.replace(
    /[<>&'"]/g,
    (c) =>
      ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", '"': "&quot;" }[c] as string)
  );
}

// Wrap a title into up to `maxLines` lines of ~`perLine` chars, on word breaks.
function wrapTitle(title: string, perLine = 16, maxLines = 3): string[] {
  const words = title.trim().split(/\s+/);
  const lines: string[] = [];
  let cur = "";
  for (const w of words) {
    if ((cur + " " + w).trim().length > perLine && cur) {
      lines.push(cur);
      cur = w;
      if (lines.length === maxLines - 1) break;
    } else {
      cur = (cur + " " + w).trim();
    }
  }
  if (cur && lines.length < maxLines) lines.push(cur);
  if (lines.length === maxLines) {
    const last = lines[maxLines - 1];
    if (last.length > perLine) lines[maxLines - 1] = last.slice(0, perLine - 1) + "…";
  }
  return lines;
}

export function brandCover(seed: string, title = "", w = 720, h = 1280): string {
  const [c1, c2] = PALETTES[hash(seed) % PALETTES.length];
  const lines = wrapTitle(title || "TripTravelingGuide", Math.max(12, Math.round(w / 45)));
  const fontSize = Math.round(w / 13);
  const startY = h / 2 - ((lines.length - 1) * fontSize * 1.2) / 2;

  const tspans = lines
    .map(
      (ln, i) =>
        `<text x="50%" y="${startY + i * fontSize * 1.2}" fill="#fff" font-family="system-ui,-apple-system,Segoe UI,Roboto,sans-serif" font-size="${fontSize}" font-weight="800" text-anchor="middle">${escapeXml(ln)}</text>`
    )
    .join("");

  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">` +
    `<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">` +
    `<stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/>` +
    `</linearGradient></defs>` +
    `<rect width="${w}" height="${h}" fill="url(#g)"/>` +
    tspans +
    `<text x="50%" y="94%" fill="rgba(255,255,255,.85)" font-family="system-ui,sans-serif" font-size="${Math.round(w / 26)}" font-weight="600" letter-spacing="1" text-anchor="middle">TRIPTRAVELINGGUIDE</text>` +
    `</svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}
