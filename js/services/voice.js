// Cantor con voz sintetizada (texto a voz del sistema) como respaldo de audios grabados.
// Para producción: reemplazar por audios pregrabados por carta y voz (assets/audio/<voz>/<id>.mp3).

export const VOCES = {
  neutra: { nombre: 'Voz neutra', rate: 1, pitch: 1, premium: false },
  feria: { nombre: 'Cantor de feria', rate: 1.12, pitch: 0.8, premium: true },
  abuelita: { nombre: 'Abuelita', rate: 0.88, pitch: 1.35, premium: true },
};

let vozSistema = null;

function elegirVozSistema() {
  const synth = globalThis.speechSynthesis;
  if (!synth) return null;
  const todas = synth.getVoices();
  return (
    todas.find((v) => v.lang === 'es-MX') ||
    todas.find((v) => v.lang?.startsWith('es-US')) ||
    todas.find((v) => v.lang?.startsWith('es')) ||
    null
  );
}

if (globalThis.speechSynthesis) {
  globalThis.speechSynthesis.onvoiceschanged = () => {
    vozSistema = elegirVozSistema();
  };
}

export function disponible() {
  return !!globalThis.speechSynthesis;
}

export function decir(texto, vozId = 'neutra') {
  const synth = globalThis.speechSynthesis;
  if (!synth) return;
  try {
    synth.cancel();
    const u = new SpeechSynthesisUtterance(texto);
    const v = VOCES[vozId] || VOCES.neutra;
    vozSistema = vozSistema || elegirVozSistema();
    if (vozSistema) u.voice = vozSistema;
    u.lang = vozSistema?.lang || 'es-MX';
    u.rate = v.rate;
    u.pitch = v.pitch;
    synth.speak(u);
  } catch {
    /* sin voz disponible */
  }
}

export function callar() {
  try {
    globalThis.speechSynthesis?.cancel();
  } catch {
    /* nada */
  }
}

/** Texto que canta el cantor para una carta. */
export function textoCarta(carta, modo, rnd = Math.random) {
  if (modo === 'verso' && carta.versos?.length) {
    const verso = carta.versos[Math.floor(rnd() * carta.versos.length)];
    return `${verso} ¡${carta.nombre}!`;
  }
  return carta.nombre;
}
