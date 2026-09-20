export const cardFonts = [
  {
    id: 'system',
    name: 'System Sans',
    note: 'Fast and familiar',
    stack: "ui-sans-serif, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },
  {
    id: 'atkinson',
    name: 'Atkinson Hyperlegible',
    note: 'Clear letter shapes',
    stack: "'Atkinson Hyperlegible', Arial, sans-serif",
  },
  {
    id: 'lexend',
    name: 'Lexend',
    note: 'Relaxed reading rhythm',
    stack: 'Lexend, Arial, sans-serif',
  },
  {
    id: 'verdana',
    name: 'Verdana',
    note: 'Wide and screen-friendly',
    stack: 'Verdana, Geneva, sans-serif',
  },
  {
    id: 'trebuchet',
    name: 'Trebuchet MS',
    note: 'Friendly and compact',
    stack: "'Trebuchet MS', Tahoma, sans-serif",
  },
  {
    id: 'arial',
    name: 'Arial',
    note: 'Neutral and dependable',
    stack: 'Arial, Helvetica, sans-serif',
  },
  {
    id: 'georgia',
    name: 'Georgia',
    note: 'Readable screen serif',
    stack: "Georgia, 'Times New Roman', serif",
  },
  {
    id: 'charter',
    name: 'Charter',
    note: 'Calm editorial serif',
    stack: "Charter, 'Bitstream Charter', Georgia, serif",
  },
  {
    id: 'mono',
    name: 'Monospace',
    note: 'Structured and even',
    stack: "ui-monospace, 'SFMono-Regular', Consolas, 'Liberation Mono', monospace",
  },
] as const;

export type CardFontId = (typeof cardFonts)[number]['id'];

export function cardFontStack(id: CardFontId) {
  return cardFonts.find((font) => font.id === id)?.stack ?? cardFonts[0].stack;
}
