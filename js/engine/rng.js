// Generador de azar. Usa crypto cuando existe; acepta una semilla para pruebas.

export function cryptoRandom() {
  const c = globalThis.crypto;
  if (c && c.getRandomValues) {
    const a = new Uint32Array(1);
    c.getRandomValues(a);
    return a[0] / 2 ** 32;
  }
  return Math.random();
}

/** mulberry32: determinista, solo para pruebas y repeticiones. */
export function seeded(seed) {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

/** Fisher-Yates. Regresa una copia barajada. */
export function barajar(arr, rnd = cryptoRandom) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
