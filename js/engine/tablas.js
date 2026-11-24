// Generación de tablas 4x4: 16 cartas distintas, sin tablas repetidas en la ronda,
// y evitando que dos tablas compartan muchas cartas en la misma posición.

import { barajar, cryptoRandom } from './rng.js';

export const MAX_COINCIDENCIAS_POSICION = 2;

export function coincidenciasEnPosicion(a, b) {
  let n = 0;
  for (let i = 0; i < 16; i++) if (a[i] === b[i]) n++;
  return n;
}

export function generarTabla(ids, rnd = cryptoRandom) {
  return barajar(ids, rnd).slice(0, 16);
}

/**
 * Genera `n` tablas distintas entre sí y respecto a `existentes`.
 */
export function generarTablas(n, ids, existentes = [], rnd = cryptoRandom) {
  const todas = existentes.slice();
  const nuevas = [];
  const claves = new Set(todas.map((t) => t.join(',')));
  let intentos = 0;
  while (nuevas.length < n) {
    const t = generarTabla(ids, rnd);
    intentos++;
    const clave = t.join(',');
    if (claves.has(clave)) continue;
    const parecida = intentos < 500 && todas.some((o) => coincidenciasEnPosicion(o, t) > MAX_COINCIDENCIAS_POSICION);
    if (parecida) continue;
    claves.add(clave);
    todas.push(t);
    nuevas.push(t);
  }
  return nuevas;
}
