// Ilustraciones originales en SVG (viewBox 0 0 100 100), estilo plano con contorno.
// Cada función regresa el contenido interno del <svg>. Hechas para este proyecto.

const K = '#23203A'; // contorno
const s = `stroke="${K}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"`;
const eye = (x, y, r = 3) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${K}"/>`;
const smile = (x, y, w = 8) => `<path d="M${x - w} ${y} q${w} ${w * 0.8} ${w * 2} 0" fill="none" ${s}/>`;

export const ARTE = {
  1: () => `
    <path d="M30 78 L30 90 M44 78 L44 90" ${s} fill="none"/>
    <path d="M20 60 q-8 -30 12 -34 q-14 -10 2 -16 q8 6 6 14 q14 -6 22 8 q20 -4 22 22 q4 24 -26 28 q-34 4 -38 -22z" fill="#F6E6C8" ${s}/>
    <path d="M66 52 q14 -24 22 -30 q2 16 -4 26 q12 -6 14 0 q-8 16 -24 18z" fill="#2B8C6B" ${s}/>
    <path d="M28 14 q4 -8 8 -2 q4 -8 8 0 q4 -6 6 4 q-8 4 -22 -2z" fill="#E8416F" ${s}/>
    <path d="M18 30 l-10 4 l10 4z" fill="#F2A516" ${s}/>
    <path d="M22 40 q-2 8 4 10 q4 -4 0 -10z" fill="#E8416F" ${s}/>
    ${eye(28, 30)}`,
  2: () => `
    <path d="M72 20 L80 92" ${s} fill="none"/>
    <path d="M64 16 l8 8 l8 -8 M72 8 v16" ${s} fill="none"/>
    <path d="M30 26 l-6 -16 l14 10z M62 26 l6 -16 l-14 10z" fill="#FFD166" ${s}/>
    <path d="M24 46 q0 -26 22 -26 q22 0 22 26 q0 30 -22 34 q-22 -4 -22 -34z" fill="#E8416F" ${s}/>
    <path d="M32 40 l10 4 M60 40 l-10 4" ${s}/>
    ${eye(37, 48)}${eye(55, 48)}
    <path d="M34 62 q12 10 24 0" fill="#fff" ${s}/>
    <path d="M46 80 q-4 10 6 14 q-10 0 -8 -8" fill="none" ${s}/>`,
  3: () => `
    <path d="M26 92 q4 -30 24 -32 q20 2 24 32z" fill="#8A5CF6" ${s}/>
    <circle cx="50" cy="44" r="16" fill="#F3C9A1" ${s}/>
    <path d="M34 46 q-4 -20 16 -22 q20 2 16 22 q-4 -10 -16 -12 q-12 2 -16 12z" fill="#5B3A29" ${s}/>
    <ellipse cx="50" cy="26" rx="30" ry="7" fill="#F2A516" ${s}/>
    <path d="M36 25 q14 -22 28 0z" fill="#F2A516" ${s}/>
    <circle cx="64" cy="22" r="5" fill="#E8416F" ${s}/>
    ${eye(44, 46, 2.4)}${eye(56, 46, 2.4)}
    <path d="M46 54 q4 3 8 0" fill="none" stroke="#C0392B" stroke-width="3" stroke-linecap="round"/>`,
  4: () => `
    <path d="M28 92 q2 -30 22 -32 q20 2 22 32z" fill="#3B3A5C" ${s}/>
    <path d="M44 60 l6 14 l6 -14z" fill="#fff" ${s}/>
    <circle cx="50" cy="44" r="15" fill="#F3C9A1" ${s}/>
    <rect x="36" y="12" width="28" height="20" rx="2" fill="#23203A" ${s}/>
    <path d="M26 32 h48" ${s}/>
    <path d="M38 52 q6 -6 12 0 q6 -6 12 0" fill="#23203A" ${s}/>
    ${eye(44, 43, 2.4)}${eye(56, 43, 2.4)}
    <path d="M80 50 v42" stroke="#8B5A2B" stroke-width="5" stroke-linecap="round"/>
    <circle cx="80" cy="48" r="4" fill="#F2A516" ${s}/>`,
  5: () => `
    <path d="M14 50 q36 -44 72 0 q-6 -6 -12 0 q-6 -6 -12 0 q-6 -6 -12 0 q-6 -6 -12 0 q-6 -6 -12 0 q-6 -6 -12 0z" fill="#E8416F" ${s}/>
    <path d="M38 50 q12 -40 12 -38 q0 -2 12 38" fill="none" stroke="#fff" stroke-width="3" opacity=".7"/>
    <path d="M50 12 v4 M50 50 v32 q0 8 -8 8 q-6 0 -6 -6" fill="none" ${s}/>`,
  6: () => `
    <path d="M50 62 q-24 4 -20 22 q10 -6 18 -2 q-10 8 -4 14 q8 -10 18 -14 q12 -2 18 6 q4 -20 -30 -26z" fill="#1BA6C9" ${s}/>
    <path d="M36 66 q-4 -20 14 -20 q18 0 14 20z" fill="#F3C9A1" ${s}/>
    <path d="M36 58 h28" stroke="#2FB67C" stroke-width="6"/>
    <circle cx="50" cy="34" r="13" fill="#F3C9A1" ${s}/>
    <path d="M36 34 q-6 30 -14 36 q12 -2 16 -14 q-2 -18 12 -34 q14 16 12 34 q4 12 16 14 q-8 -6 -14 -36 q-2 -16 -14 -16 q-12 0 -14 16z" fill="#F2A516" ${s}/>
    ${eye(45, 35, 2.2)}${eye(55, 35, 2.2)}`,
  7: () => `
    <path d="M30 8 L22 94 M70 8 L78 94" ${s} fill="none" stroke-width="5"/>
    ${[20, 36, 52, 68, 84].map((y) => `<path d="M${29 - (y - 8) * 0.09} ${y} H${71 + (y - 8) * 0.09}" ${s} stroke-width="5"/>`).join('')}`,
  8: () => `
    <path d="M42 8 h16 v20 q12 8 12 24 v36 q0 6 -6 6 h-28 q-6 0 -6 -6 v-36 q0 -16 12 -24z" fill="#2FB67C" ${s}/>
    <rect x="40" y="6" width="20" height="8" rx="2" fill="#8B5A2B" ${s}/>
    <rect x="34" y="52" width="32" height="22" rx="3" fill="#FFF3D6" ${s}/>
    <path d="M40 60 h20 M40 66 h14" ${s}/>
    <path d="M38 36 q0 -6 4 -10" fill="none" stroke="#fff" stroke-width="3" opacity=".6"/>`,
  9: () => `
    <path d="M24 14 h52 q8 36 0 72 h-52 q-8 -36 0 -72z" fill="#B9773E" ${s}/>
    <path d="M20 30 h60 M18 50 h64 M20 70 h60" ${s} stroke="#5B5F73" stroke-width="5"/>
    <path d="M38 16 v68 M62 16 v68" ${s} opacity=".4"/>`,
  10: () => `
    <rect x="42" y="56" width="16" height="36" rx="3" fill="#8B5A2B" ${s}/>
    <path d="M50 6 q22 0 26 20 q18 6 10 26 q-4 16 -24 14 q-12 8 -24 0 q-20 2 -24 -14 q-8 -20 10 -26 q4 -20 26 -20z" fill="#2FB67C" ${s}/>
    <circle cx="36" cy="30" r="4" fill="#E8416F"/><circle cx="62" cy="24" r="4" fill="#E8416F"/><circle cx="66" cy="48" r="4" fill="#E8416F"/><circle cx="40" cy="52" r="4" fill="#E8416F"/>`,
  11: () => `
    <ellipse cx="50" cy="54" rx="38" ry="32" fill="#9CCB5B" ${s}/>
    ${[-24, -12, 0, 12, 24].map((d) => `<path d="M${50 + d} 23 q${d * 0.6} 31 0 63" fill="none" stroke="#5F8F2B" stroke-width="3"/>`).join('')}
    <path d="M50 22 q2 -10 10 -14" fill="none" ${s}/>`,
  12: () => `
    <path d="M24 92 q2 -32 26 -34 q24 2 26 34z" fill="#E5533D" ${s}/>
    <circle cx="50" cy="40" r="15" fill="#D9A27A" ${s}/>
    <path d="M30 28 q20 -24 40 0 q-20 6 -40 0z" fill="#23203A" ${s}/>
    <path d="M38 34 l8 3 M62 34 l-8 3" ${s}/>
    ${eye(44, 40, 2.4)}${eye(56, 40, 2.4)}
    <path d="M42 50 h16" ${s}/>
    <path d="M28 70 l-12 -28 l8 -4 l10 26" fill="#F2A516" ${s}/>
    <path d="M40 26 h20" stroke="#E8416F" stroke-width="5"/>`,
  13: () => `
    <path d="M18 70 q0 -48 32 -48 q32 0 32 48z" fill="#1BA6C9" ${s}/>
    <path d="M14 70 h72 v12 h-72z" fill="#F2A516" ${s}/>
    <circle cx="50" cy="18" r="8" fill="#E8416F" ${s}/>
    <path d="M30 60 l8 -10 l8 10 l8 -10 l8 10 l8 -10" fill="none" stroke="#fff" stroke-width="3"/>`,
  14: () => `
    <path d="M30 92 q-2 -40 20 -50 q22 10 20 50z" fill="#3B3A5C" ${s}/>
    <path d="M50 12 q16 0 16 18 q0 12 -8 14 v6 h-16 v-6 q-8 -2 -8 -14 q0 -18 16 -18z" fill="#FFF7EA" ${s}/>
    <circle cx="44" cy="30" r="4.5" fill="${K}"/><circle cx="56" cy="30" r="4.5" fill="${K}"/>
    <path d="M47 40 h6 M46 46 v4 M50 46 v4 M54 46 v4" ${s} stroke-width="2"/>
    <path d="M78 8 v86" ${s} stroke="#8B5A2B" stroke-width="4"/>
    <path d="M78 10 q-26 0 -30 16 q14 -8 30 -4z" fill="#C8CCD8" ${s}/>`,
  15: () => `
    <path d="M50 18 q-10 0 -10 18 q0 6 -10 18 q-10 14 0 28 q8 10 20 10 q12 0 20 -10 q10 -14 0 -28 q-10 -12 -10 -18 q0 -18 -10 -18z" fill="#B5D33D" ${s}/>
    <path d="M50 18 q0 -8 4 -12" fill="none" ${s}/>
    <path d="M54 12 q12 -6 16 2 q-10 6 -16 -2z" fill="#2FB67C" ${s}/>
    <path d="M38 64 q-2 10 6 16" fill="none" stroke="#fff" stroke-width="3" opacity=".6"/>`,
  16: () => `
    <path d="M20 8 v86" ${s} stroke-width="5"/>
    <path d="M22 12 q20 -6 32 2 q14 8 32 0 v44 q-18 8 -32 0 q-12 -8 -32 -2z" fill="#fff" ${s}/>
    <path d="M22 12 q10 -3 20 -2 v46 q-10 -1 -20 2z" fill="#2FB67C"/>
    <path d="M66 14 q10 2 20 -2 v44 q-10 4 -20 2z" fill="#E5533D"/>
    <path d="M22 12 q20 -6 32 2 q14 8 32 0 v44 q-18 8 -32 0 q-12 -8 -32 -2z" fill="none" ${s}/>
    <circle cx="54" cy="35" r="6" fill="#C08A3E" ${s} stroke-width="2"/>`,
  17: () => `
    <path d="M50 4 v10" ${s} stroke-width="5"/>
    <rect x="44" y="12" width="12" height="36" rx="2" fill="#8B5A2B" ${s}/>
    <path d="M50 44 q-30 0 -30 24 q0 24 30 24 q30 0 30 -24 q0 -24 -30 -24z" fill="#F2A516" ${s}/>
    <circle cx="50" cy="66" r="8" fill="${K}"/>
    <path d="M46 14 v68 M50 14 v68 M54 14 v68" stroke="#fff" stroke-width="1"/>
    <rect x="40" y="80" width="20" height="4" fill="${K}"/>`,
  18: () => `
    <path d="M50 4 v14" ${s} stroke-width="5"/>
    <path d="M50 18 q-18 0 -18 16 q0 6 6 10 q-12 6 -12 22 q0 26 24 26 q24 0 24 -26 q0 -16 -12 -22 q6 -4 6 -10 q0 -16 -18 -16z" fill="#B9773E" ${s}/>
    <path d="M42 48 q-4 6 0 10 M58 48 q4 6 0 10" fill="none" ${s}/>
    <path d="M48 18 v66 M52 18 v66" stroke="#fff" stroke-width="1"/>
    <path d="M14 40 L86 78" ${s} stroke="#E8416F"/>
    <path d="M50 92 v6" ${s}/>`,
  19: () => `
    <path d="M48 70 v24 M48 94 l-6 0 M48 94 l6 0" ${s} fill="none"/>
    <path d="M30 52 q0 -16 20 -16 q20 0 26 14 q-6 18 -28 20 q-18 0 -18 -18z" fill="#fff" ${s}/>
    <path d="M44 38 q-10 -14 2 -24 q8 -6 14 0" fill="none" ${s} stroke-width="6"/>
    <path d="M44 38 q-10 -14 2 -24 q8 -6 14 0" fill="none" stroke="#fff" stroke-width="2"/>
    <path d="M60 14 l24 6 l-24 2z" fill="#F2A516" ${s}/>
    ${eye(56, 16, 2)}
    <path d="M10 94 h80" stroke="#1BA6C9" stroke-width="4"/>`,
  20: () => `
    <path d="M14 60 h70" stroke="#8B5A2B" stroke-width="5" stroke-linecap="round"/>
    <path d="M28 48 q0 -24 24 -24 q16 0 18 14 l12 2 l-12 6 q-2 14 -22 14 l-10 10 l-2 -10 q-8 -4 -8 -12z" fill="#F2A516" ${s}/>
    <path d="M36 42 q10 10 22 0" fill="#E5533D" ${s}/>
    ${eye(58, 34, 2.6)}
    <path d="M42 56 v6 M50 56 v6" ${s}/>`,
  21: () => `
    <path d="M30 94 v-24 q-14 -12 -14 -24 q0 -6 6 -6 q6 0 10 10 v-36 q0 -6 6 -6 q6 0 6 6 v26 v-34 q0 -6 6 -6 q6 0 6 6 v34 v-28 q0 -6 6 -6 q6 0 6 6 v30 v-20 q0 -6 6 -6 q6 0 6 6 v36 q0 18 -12 26 v6z" fill="#F3C9A1" ${s}/>`,
  22: () => `
    <path d="M30 8 h28 v52 q24 4 26 22 v10 h-58 v-30 z" fill="#8B5A2B" ${s}/>
    <path d="M26 92 h58" ${s} stroke-width="6"/>
    <path d="M30 20 h28 M30 30 h28" stroke="#F2A516" stroke-width="3"/>
    <path d="M38 40 q6 6 12 0 q-6 -6 -12 0z" fill="#F2A516"/>`,
  23: () => `
    <path d="M62 10 a40 40 0 1 0 22 70 a34 34 0 1 1 -22 -70z" fill="#FFE07A" ${s}/>
    ${eye(40, 46)}
    <path d="M34 62 q8 6 16 0" fill="none" ${s}/>
    <circle cx="80" cy="20" r="2" fill="#fff"/><circle cx="74" cy="40" r="1.6" fill="#fff"/>`,
  24: () => `
    <path d="M46 88 l-6 8 M54 88 l2 8" ${s}/>
    <path d="M34 50 q0 -32 22 -32 q18 0 18 18 q-2 10 -10 14 q8 20 -4 38 q-14 6 -22 -6 q-6 -12 -4 -32z" fill="#2FB67C" ${s}/>
    <path d="M64 30 q14 2 12 16 q-8 -2 -12 -6z" fill="#F2A516" ${s}/>
    <path d="M38 60 q-10 10 -4 22 q10 -8 8 -20z" fill="#E5533D" ${s}/>
    <circle cx="56" cy="32" r="5" fill="#fff" ${s} stroke-width="2"/>${eye(57, 32, 2)}
    <path d="M10 88 h80" stroke="#8B5A2B" stroke-width="5" stroke-linecap="round"/>`,
  25: () => `
    <path d="M30 92 q4 -26 20 -28 q16 2 20 28z" fill="#1BA6C9" ${s}/>
    <circle cx="50" cy="44" r="16" fill="#F3B38A" ${s}/>
    <circle cx="50" cy="48" r="5" fill="#E5533D"/>
    <path d="M40 40 q4 -4 8 0 M52 40 q4 -4 8 0" fill="none" ${s}/>
    <path d="M42 56 q8 4 16 -2" fill="none" ${s}/>
    <path d="M30 28 q20 -20 40 0z" fill="#F2A516" ${s}/>
    <path d="M78 44 h10 v30 h-10z" fill="#2FB67C" ${s}/><path d="M80 36 h6 v8 h-6z" fill="#2FB67C" ${s}/>
    <path d="M16 20 q4 -4 8 0 q4 4 8 0" fill="none" ${s} stroke-width="2"/>`,
  26: () => `
    <path d="M16 60 q34 -40 68 0 q-10 26 -34 26 q-24 0 -34 -26z" fill="#F7A1C0" ${s}/>
    <path d="M18 40 l-10 -8 M18 48 l-12 -2 M20 56 l-12 4 M82 40 l10 -8 M82 48 l12 -2 M80 56 l12 4" ${s} stroke="#E8416F"/>
    ${eye(38, 56, 3.4)}${eye(62, 56, 3.4)}
    <path d="M42 68 q8 6 16 0" fill="none" ${s}/>
    <path d="M28 84 l-6 8 M72 84 l6 8" ${s}/>`,
  27: () => `
    <path d="M50 88 q-40 -26 -40 -50 q0 -22 20 -22 q14 0 20 14 q6 -14 20 -14 q20 0 20 22 q0 24 -40 50z" fill="#E5533D" ${s}/>
    <path d="M26 32 q4 -8 12 -8" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" opacity=".7"/>`,
  28: () => `
    <path d="M8 40 h84 q0 42 -42 42 q-42 0 -42 -42z" fill="#2FB67C" ${s}/>
    <path d="M14 40 h72 q-2 34 -36 34 q-34 0 -36 -34z" fill="#E8416F"/>
    ${[[30, 52], [44, 60], [58, 52], [70, 58], [50, 48], [38, 50]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="2" ry="3" fill="${K}"/>`).join('')}`,
  29: () => `
    <ellipse cx="50" cy="40" rx="34" ry="10" fill="#FFF3D6" ${s}/>
    <path d="M16 40 v34 q34 20 68 0 v-34" fill="#E5533D" ${s}/>
    <path d="M20 46 l14 32 l16 -32 l16 32 l14 -32" fill="none" stroke="#F2A516" stroke-width="3"/>
    <path d="M30 6 l14 30 M74 4 l-16 32" ${s} stroke-width="4"/>
    <circle cx="30" cy="6" r="4" fill="#fff" ${s}/><circle cx="74" cy="4" r="4" fill="#fff" ${s}/>`,
  30: () => `
    <path d="M24 46 q10 -26 40 -20 q22 6 22 26 q0 16 -16 20 q-8 10 -20 6 q-12 2 -18 -10 q-10 -8 -8 -22z" fill="#F2785C" ${s}/>
    <path d="M44 30 q-4 20 4 44 M58 30 q-2 20 6 42" fill="none" ${s} stroke-width="2"/>
    <path d="M36 76 l-10 14 l8 0 l8 -12" fill="#F2785C" ${s}/>
    <path d="M24 40 q-14 -20 -16 -34 M28 36 q-4 -20 4 -30" fill="none" ${s} stroke-width="2"/>
    ${eye(28, 44, 2.6)}`,
  31: () => `
    ${[-14, 0, 14].map((d) => `
      <path d="M${50 + d} 92 L${50 + d * 1.6} 18" ${s} stroke="#8B5A2B" stroke-width="4"/>
      <path d="M${50 + d * 1.6} 8 l-6 12 h12z" fill="#C8CCD8" ${s}/>
      <path d="M${50 + d} 92 l-6 -12 M${50 + d} 92 l6 -12 M${50 + d} 84 l-6 -12 M${50 + d} 84 l6 -12" stroke="#E8416F" stroke-width="3" stroke-linecap="round"/>`).join('')}
    <path d="M30 60 h40" ${s} stroke="#F2A516" stroke-width="6"/>`,
  32: () => `
    <path d="M26 92 q2 -30 24 -32 q22 2 24 32z" fill="#23203A" ${s}/>
    <path d="M36 70 h28 M36 80 h28" stroke="#F2A516" stroke-width="3"/>
    <circle cx="50" cy="44" r="14" fill="#D9A27A" ${s}/>
    <path d="M18 30 q32 -14 64 0 q-8 6 -32 6 q-24 0 -32 -6z" fill="#F2A516" ${s}/>
    <path d="M36 30 q14 -26 28 0z" fill="#F2A516" ${s}/>
    <path d="M42 50 q8 -4 16 0" fill="#23203A" ${s}/>
    ${eye(44, 42, 2.2)}${eye(56, 42, 2.2)}
    <path d="M62 66 l18 -20 l6 6 l-16 22z" fill="#B9773E" ${s}/>`,
  33: () => `
    <path d="M50 4 v30" ${s} stroke-width="2"/>
    ${[[-1, 1], [1, 1]].map(([sx]) => [0, 1, 2, 3].map((i) => `<path d="M${50 + sx * 10} ${50 + i * 6} q${sx * 18} ${-14 + i * 6} ${sx * 34} ${-4 + i * 12}" fill="none" ${s}/>`).join('')).join('')}
    <circle cx="50" cy="44" r="10" fill="#3B3A5C" ${s}/>
    <ellipse cx="50" cy="66" rx="14" ry="16" fill="#8A5CF6" ${s}/>
    <circle cx="46" cy="42" r="2.4" fill="#fff"/><circle cx="54" cy="42" r="2.4" fill="#fff"/>`,
  34: () => `
    <path d="M30 92 v-30 q0 -8 20 -8 q20 0 20 8 v30z" fill="#2B8C6B" ${s}/>
    <path d="M44 54 v38 M56 54 v38" stroke="#F2A516" stroke-width="2"/>
    <circle cx="50" cy="40" r="13" fill="#D9A27A" ${s}/>
    <path d="M36 32 v-20 h28 v20z" fill="#23203A" ${s}/>
    <path d="M32 32 h36" ${s} stroke-width="5"/>
    <circle cx="50" cy="20" r="4" fill="#F2A516"/>
    ${eye(45, 40, 2.2)}${eye(55, 40, 2.2)}
    <path d="M46 48 h8" ${s}/>
    <path d="M78 16 v64" stroke="#5B5F73" stroke-width="5" stroke-linecap="round"/>`,
  35: () => `
    <path d="M50 6 l12 28 l30 2 l-24 18 l8 30 l-26 -16 l-26 16 l8 -30 l-24 -18 l30 -2z" fill="#FFD166" ${s}/>
    ${eye(43, 46, 2.4)}${eye(57, 46, 2.4)}
    ${smile(50, 54, 5)}`,
  36: () => `
    <path d="M12 38 h76 q-4 46 -38 46 q-34 0 -38 -46z" fill="#D9774A" ${s}/>
    <path d="M6 38 h88" ${s} stroke-width="5"/>
    <path d="M12 38 q-8 -16 6 -18 M88 38 q8 -16 -6 -18" fill="none" ${s}/>
    <path d="M30 50 q-2 14 8 22" fill="none" stroke="#fff" stroke-width="3" opacity=".5"/>
    <path d="M36 28 q-4 -8 2 -14 M50 28 q-4 -8 2 -14 M64 28 q-4 -8 2 -14" fill="none" stroke="#5B5F73" stroke-width="2" stroke-linecap="round"/>`,
  37: () => `
    <circle cx="50" cy="48" r="36" fill="#1BA6C9" ${s}/>
    <path d="M28 24 q10 -2 14 8 q-4 10 4 16 q-2 12 -12 10 q-4 -10 -12 -12 q-4 -12 6 -22z" fill="#2FB67C" ${s} stroke-width="2"/>
    <path d="M60 52 q12 -4 16 6 q0 12 -10 16 q-8 -6 -6 -22z" fill="#2FB67C" ${s} stroke-width="2"/>
    <path d="M60 16 q10 4 14 12 q-8 2 -14 -12z" fill="#2FB67C" ${s} stroke-width="2"/>
    <path d="M40 92 h20 M50 84 v8" ${s}/>`,
  38: () => `
    <path d="M60 40 L94 28" ${s} stroke-width="2"/>
    <path d="M30 56 q0 -18 18 -20 q12 0 14 8 q-2 14 -18 20 l-20 22 q-6 -4 -2 -10z" fill="#2FB67C" ${s}/>
    <path d="M40 46 q-24 -36 -30 -36 q4 24 18 40z" fill="#1BA6C9" ${s}/>
    <path d="M48 44 q2 -30 22 -40 q2 22 -12 42z" fill="#1BA6C9" ${s}/>
    <path d="M40 60 q6 4 14 0" fill="none" stroke="#E8416F" stroke-width="4"/>
    ${eye(54, 42, 2.4)}
    <path d="M10 84 q6 -10 14 -2 q-4 10 -14 2z" fill="#E8416F" ${s}/>`,
  39: () => `
    <path d="M44 94 v-14 q-14 0 -18 -14 q-4 -18 8 -22 q12 -2 14 12 q2 -30 10 -40 q12 -6 18 6 q4 16 -8 34 q14 -10 20 0 q2 14 -16 16 q-6 4 -12 6 v16z" fill="#4CAF50" ${s}/>
    ${[[34, 54], [60, 24], [66, 40], [74, 62]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="4.5" fill="#E8416F" ${s} stroke-width="2"/>`).join('')}
    ${[[52, 50], [58, 64], [40, 64], [62, 34]].map(([x, y]) => `<path d="M${x} ${y} l3 -3 M${x} ${y} l-3 -3" stroke="${K}" stroke-width="1.6"/>`).join('')}`,
  40: () => `
    <ellipse cx="44" cy="64" rx="18" ry="12" fill="#C08A3E" ${s}/>
    <path d="M60 62 q22 -2 22 -24 q0 -16 -14 -18 l4 10 l-8 -2" fill="none" ${s} stroke-width="6"/>
    <path d="M60 62 q22 -2 22 -24 q0 -16 -14 -18" fill="none" stroke="#C08A3E" stroke-width="3"/>
    <path d="M28 58 q-14 -6 -14 -18 l8 4 M28 70 q-14 6 -14 18 l8 -4" fill="none" ${s}/>
    <path d="M36 76 l-6 10 M46 78 l-2 10 M54 76 l4 10 M36 52 l-6 -10 M46 50 l-2 -10 M54 52 l4 -10" ${s}/>
    ${eye(30, 62, 2)}${eye(30, 68, 2)}`,
  41: () => `
    <path d="M50 92 v-44" ${s} stroke="#2B8C6B" stroke-width="4"/>
    <path d="M50 74 q-18 -10 -22 2 q12 8 22 -2z M50 64 q18 -10 22 2 q-12 8 -22 -2z" fill="#4CAF50" ${s}/>
    <path d="M50 48 q-24 -2 -22 -22 q4 -16 22 -16 q18 0 22 16 q2 20 -22 22z" fill="#E8416F" ${s}/>
    <path d="M50 14 q-12 8 -6 18 q10 4 14 -6 M38 28 q10 10 24 0" fill="none" ${s} stroke-width="2"/>`,
  42: () => `
    <path d="M50 8 q34 0 34 34 q0 18 -12 24 v12 q0 8 -8 8 h-28 q-8 0 -8 -8 v-12 q-12 -6 -12 -24 q0 -34 34 -34z" fill="#FFF7EA" ${s}/>
    <circle cx="36" cy="44" r="10" fill="#8A5CF6" ${s}/><circle cx="64" cy="44" r="10" fill="#1BA6C9" ${s}/>
    <path d="M46 62 l4 -8 l4 8z" fill="${K}"/>
    <path d="M36 74 h28 M42 70 v10 M50 70 v10 M58 70 v10" ${s} stroke-width="2"/>
    <path d="M40 18 q10 6 20 0 M30 28 l4 4 M70 28 l-4 4" fill="none" stroke="#E8416F" stroke-width="3" stroke-linecap="round"/>
    <circle cx="50" cy="26" r="4" fill="#F2A516"/>`,
  43: () => `
    <path d="M50 8 v8" ${s}/>
    <path d="M50 16 q-22 0 -24 30 q-2 20 -12 30 h72 q-10 -10 -12 -30 q-2 -30 -24 -30z" fill="#F2A516" ${s}/>
    <circle cx="50" cy="84" r="7" fill="#C08A3E" ${s}/>
    <path d="M36 40 q-2 14 -6 24" fill="none" stroke="#fff" stroke-width="3" opacity=".6"/>
    <path d="M10 40 q-4 8 0 16 M90 40 q4 8 0 16" fill="none" ${s}/>`,
  44: () => `
    <path d="M38 14 h24 v10 q20 8 20 34 q0 32 -32 32 q-32 0 -32 -32 q0 -26 20 -34z" fill="#D9774A" ${s}/>
    <path d="M30 56 q20 8 40 0" fill="none" stroke="#FFF3D6" stroke-width="4"/>
    <path d="M36 66 l6 6 l6 -6 l6 6 l6 -6" fill="none" stroke="#FFF3D6" stroke-width="3"/>
    <path d="M82 40 q12 8 0 22" fill="none" ${s}/>
    <ellipse cx="50" cy="14" rx="12" ry="3" fill="${K}"/>`,
  45: () => `
    <path d="M32 92 v-20 M68 92 v-20" ${s} stroke-width="4"/>
    <path d="M26 60 q0 -14 24 -14 q24 0 24 14 q0 16 -24 16 q-24 0 -24 -16z" fill="#C08A3E" ${s}/>
    <path d="M60 50 q4 -14 12 -16 q10 4 8 14 q-4 6 -12 6z" fill="#C08A3E" ${s}/>
    <path d="M70 34 l-8 -14 l-6 4 M62 20 l2 -10 M76 32 l6 -16 l6 2 M82 16 l-4 -8" fill="none" ${s}/>
    ${eye(74, 44, 2)}
    ${[[40, 56], [50, 62], [34, 66]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2.4" fill="#fff"/>`).join('')}`,
  46: () => `
    ${Array.from({ length: 12 }, (_, i) => { const a = (i * Math.PI) / 6; const x1 = 50 + Math.cos(a) * 30, y1 = 50 + Math.sin(a) * 30, x2 = 50 + Math.cos(a) * 44, y2 = 50 + Math.sin(a) * 44; return `<path d="M${x1.toFixed(1)} ${y1.toFixed(1)} L${x2.toFixed(1)} ${y2.toFixed(1)}" ${s} stroke="#F2A516" stroke-width="6"/>`; }).join('')}
    <circle cx="50" cy="50" r="26" fill="#FFD166" ${s}/>
    ${eye(42, 46)}${eye(58, 46)}
    ${smile(50, 56, 8)}
    <circle cx="36" cy="56" r="3" fill="#F2785C"/><circle cx="64" cy="56" r="3" fill="#F2785C"/>`,
  47: () => `
    <path d="M14 34 l18 18 l18 -32 l18 32 l18 -18 l-6 46 h-60z" fill="#FFD166" ${s}/>
    <path d="M20 80 h60 v10 h-60z" fill="#F2A516" ${s}/>
    <circle cx="50" cy="62" r="6" fill="#E8416F" ${s} stroke-width="2"/>
    <circle cx="32" cy="66" r="4" fill="#1BA6C9" ${s} stroke-width="2"/><circle cx="68" cy="66" r="4" fill="#2FB67C" ${s} stroke-width="2"/>
    <circle cx="14" cy="34" r="4" fill="#fff" ${s}/><circle cx="50" cy="20" r="4" fill="#fff" ${s}/><circle cx="86" cy="34" r="4" fill="#fff" ${s}/>`,
  48: () => `
    <path d="M6 58 h88 l-12 20 h-64z" fill="#E8416F" ${s}/>
    <path d="M12 66 h76" stroke="#FFD166" stroke-width="3"/>
    <path d="M30 58 v-20 h40 v20" fill="none" ${s} stroke="#8B5A2B" stroke-width="4"/>
    <path d="M26 38 q24 -16 48 0z" fill="#2FB67C" ${s}/>
    ${[[34, 52, '#F2A516'], [44, 50, '#8A5CF6'], [56, 52, '#E5533D'], [66, 50, '#FFD166']].map(([x, y, c]) => `<circle cx="${x}" cy="${y}" r="5" fill="${c}" ${s} stroke-width="2"/>`).join('')}
    <path d="M4 88 q12 -6 24 0 q12 6 24 0 q12 -6 24 0 q12 6 24 0" fill="none" stroke="#1BA6C9" stroke-width="4"/>`,
  49: () => `
    <rect x="44" y="78" width="12" height="16" fill="#8B5A2B" ${s}/>
    <path d="M50 6 l14 22 h-8 l16 22 h-10 l18 28 h-60 l18 -28 h-10 l16 -22 h-8z" fill="#2B8C6B" ${s}/>
    <circle cx="40" cy="62" r="3.4" fill="#E8416F"/><circle cx="60" cy="44" r="3.4" fill="#FFD166"/><circle cx="56" cy="68" r="3.4" fill="#1BA6C9"/>`,
  50: () => `
    <path d="M14 50 q20 -28 52 -16 l20 -16 q-4 32 0 64 l-20 -16 q-32 12 -52 -16z" fill="#1BA6C9" ${s}/>
    <path d="M40 34 q-8 16 0 32 M52 32 q-6 18 0 36" fill="none" ${s} stroke-width="2"/>
    <circle cx="26" cy="46" r="5" fill="#fff" ${s} stroke-width="2"/>${eye(26, 46, 2.2)}
    <path d="M14 54 q4 2 8 0" fill="none" ${s} stroke-width="2"/>`,
  51: () => `
    <path d="M48 94 q-6 -40 4 -60" fill="none" ${s} stroke="#8B5A2B" stroke-width="7"/>
    <path d="M48 94 q-6 -40 4 -60" fill="none" stroke="#C08A3E" stroke-width="3"/>
    <path d="M52 34 q-20 -20 -40 -10 q20 2 40 10z M52 34 q-10 -26 4 -28 q-2 14 -4 28z M52 34 q20 -22 38 -8 q-20 0 -38 8z M52 34 q-26 4 -34 24 q20 -18 34 -24z M52 34 q22 6 30 26 q-14 -20 -30 -26z" fill="#2FB67C" ${s}/>
    <circle cx="48" cy="38" r="4" fill="#8B5A2B" ${s} stroke-width="2"/><circle cx="56" cy="38" r="4" fill="#8B5A2B" ${s} stroke-width="2"/>`,
  52: () => `
    <path d="M26 58 h48 l-6 34 h-36z" fill="#D9774A" ${s}/>
    <path d="M22 52 h56 v8 h-56z" fill="#D9774A" ${s}/>
    <path d="M50 52 v-14" ${s} stroke="#2B8C6B"/>
    <path d="M50 44 q-16 -4 -18 -16 q12 0 18 16z M50 40 q16 -6 20 -18 q-14 0 -20 18z" fill="#4CAF50" ${s}/>
    ${[[34, 22, '#E8416F'], [50, 16, '#FFD166'], [66, 22, '#8A5CF6']].map(([x, y, c]) => `<circle cx="${x}" cy="${y}" r="7" fill="${c}" ${s} stroke-width="2"/><circle cx="${x}" cy="${y}" r="2" fill="${K}"/>`).join('')}
    <path d="M36 72 h28" stroke="#FFF3D6" stroke-width="3"/>`,
  53: () => `
    <path d="M22 92 L30 10 q30 -6 46 24 q10 22 -6 58z" fill="none" ${s} stroke="#C08A3E" stroke-width="7"/>
    <path d="M22 92 L30 10 q30 -6 46 24 q10 22 -6 58z" fill="none" stroke="#F2A516" stroke-width="3"/>
    <path d="M20 92 h54" ${s} stroke-width="6"/>
    ${[38, 46, 54, 62].map((x, i) => `<path d="M${x} ${[12, 16, 22, 30][i]} L${x - 6 + i} 90" stroke="#5B5F73" stroke-width="1.6"/>`).join('')}`,
  54: () => `
    <path d="M14 80 q-4 -14 12 -16 q-2 -20 24 -22 q26 2 24 22 q16 2 12 16 q-4 8 -36 8 q-32 0 -36 -8z" fill="#4CAF50" ${s}/>
    <circle cx="36" cy="40" r="9" fill="#4CAF50" ${s}/><circle cx="64" cy="40" r="9" fill="#4CAF50" ${s}/>
    <circle cx="36" cy="40" r="5" fill="#fff"/>${eye(37, 41, 2.4)}<circle cx="64" cy="40" r="5" fill="#fff"/>${eye(65, 41, 2.4)}
    <path d="M34 60 q16 10 32 0" fill="none" ${s}/>
    <circle cx="28" cy="58" r="3" fill="#F7A1C0"/><circle cx="72" cy="58" r="3" fill="#F7A1C0"/>
    <path d="M6 94 h88" stroke="#1BA6C9" stroke-width="4"/>`,
};

export function arteSVG(id, extraAttrs = '') {
  const fn = ARTE[id];
  const body = fn ? fn() : `<text x="50" y="60" text-anchor="middle" font-size="40">?</text>`;
  return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" ${extraAttrs}>${body}</svg>`;
}
