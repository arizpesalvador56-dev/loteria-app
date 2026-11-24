// Figuras ganadoras para tabla de 4x4. Celdas numeradas 0..15 por filas.

const filas = [0, 1, 2, 3].map((r) => [0, 1, 2, 3].map((c) => r * 4 + c));
const columnas = [0, 1, 2, 3].map((c) => [0, 1, 2, 3].map((r) => r * 4 + c));
const diagonales = [[0, 5, 10, 15], [3, 6, 9, 12]];
const cuadritos = [0, 1, 2, 4, 5, 6, 8, 9, 10].map((i) => [i, i + 1, i + 4, i + 5]);

export const FIGURAS = {
  linea_h: { id: 'linea_h', nombre: 'Línea horizontal', alias: 'Chorro, renglón', conjuntos: filas },
  linea_v: { id: 'linea_v', nombre: 'Línea vertical', alias: 'Columna', conjuntos: columnas },
  diagonal: { id: 'diagonal', nombre: 'Diagonal', alias: '', conjuntos: diagonales },
  cualquier_linea: { id: 'cualquier_linea', nombre: 'Cualquier línea', alias: 'Chorro libre', conjuntos: [...filas, ...columnas, ...diagonales] },
  esquinas: { id: 'esquinas', nombre: 'Cuatro esquinas', alias: 'Esquinas', conjuntos: [[0, 3, 12, 15]] },
  centro: { id: 'centro', nombre: 'Centro', alias: 'Pozo', conjuntos: [[5, 6, 9, 10]] },
  cuadrito: { id: 'cuadrito', nombre: 'Cuadrito', alias: 'Cuadro chico', conjuntos: cuadritos },
  esquinas_centro: { id: 'esquinas_centro', nombre: 'Esquinas y centro', alias: '', conjuntos: [[0, 3, 12, 15, 5, 6, 9, 10]] },
  marco: { id: 'marco', nombre: 'Marco', alias: 'Orilla, contorno', conjuntos: [[0, 1, 2, 3, 4, 7, 8, 11, 12, 13, 14, 15]] },
  equis: { id: 'equis', nombre: 'Equis', alias: 'X', conjuntos: [[0, 5, 10, 15, 3, 6, 9, 12]] },
  cruz: { id: 'cruz', nombre: 'Cruz', alias: '', conjuntos: [[1, 2, 4, 5, 6, 7, 8, 9, 10, 11, 13, 14]] },
  letra_l: { id: 'letra_l', nombre: 'Letra L', alias: '', conjuntos: [[0, 4, 8, 12, 13, 14, 15]] },
  letra_t: { id: 'letra_t', nombre: 'Letra T', alias: '', conjuntos: [[0, 1, 2, 3, 5, 6, 9, 10, 13, 14]] },
  letra_u: { id: 'letra_u', nombre: 'Letra U', alias: '', conjuntos: [[0, 4, 8, 12, 13, 14, 15, 3, 7, 11]] },
  letra_c: { id: 'letra_c', nombre: 'Letra C', alias: '', conjuntos: [[0, 1, 2, 3, 4, 8, 12, 13, 14, 15]] },
  llena: { id: 'llena', nombre: 'Tabla llena', alias: 'Llenas', conjuntos: [Array.from({ length: 16 }, (_, i) => i)] },
};

export const ORDEN_FIGURAS = Object.keys(FIGURAS);

export function figuraPersonalizada(celdas, nombre = 'Personalizada') {
  const set = [...new Set(celdas)].filter((c) => c >= 0 && c < 16).sort((a, b) => a - b);
  if (set.length === 0) throw new Error('La figura necesita al menos una celda');
  return { id: 'custom', nombre, alias: '', conjuntos: [set] };
}

/** Celdas de muestra para dibujar la figura (el primer conjunto). */
export function celdasMuestra(figura) {
  return new Set(figura.conjuntos[0]);
}

/**
 * Busca un conjunto de la figura que esté completo.
 * @param {number[]} celdas  ids de carta de la tabla (16)
 * @param {(i:number)=>boolean} marcada  si la celda i cuenta como marcada
 * @param {Set<number>} cantadas  ids de cartas que ya salieron
 * @returns {number[]|null}  el conjunto ganador o null
 */
export function conjuntoCompleto(celdas, marcada, cantadas, figura) {
  for (const conj of figura.conjuntos) {
    if (conj.every((i) => marcada(i) && cantadas.has(celdas[i]))) return conj;
  }
  return null;
}
