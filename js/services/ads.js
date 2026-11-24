// Capa de anuncios. En la web muestra anuncios simulados; en la app nativa se conecta
// a la red real (p. ej. AdMob con @capacitor-community/admob) implementando `proveedor`.
//
// Reglas de la especificación:
// - Intersticial solo al terminar una ronda, nunca durante el juego.
// - Límite de frecuencia: como máximo uno cada 2 rondas y uno cada 3 minutos.
// - Premium no ve anuncios.

import { actualizar, cargar } from './storage.js';

export const LIMITE = { cadaRondas: 2, minMs: 3 * 60 * 1000 };
export const TABLA_EXTRA_MS = 30 * 60 * 1000;

/** Proveedor intercambiable. `mostrar` regresa una promesa que se resuelve al cerrar. */
export const proveedor = {
  intersticial: null, // (opts) => Promise<void>
  recompensa: null, // (opts) => Promise<boolean>  true si lo vio completo
};

/** Decide si toca intersticial (función pura para pruebas). */
export function tocaIntersticial(estado, ahora, premium) {
  if (premium) return false;
  if (estado.rondasDesdeUltimo + 1 < LIMITE.cadaRondas) return false;
  if (ahora - estado.ultimoMs < LIMITE.minMs) return false;
  return true;
}

/** Llamar al terminar cada ronda. Regresa true si se mostró un anuncio. */
export async function alTerminarRonda(mostrarSimulado) {
  const p = cargar();
  const ahora = Date.now();
  if (!tocaIntersticial(p.anuncios, ahora, p.premium)) {
    actualizar((d) => {
      d.anuncios.rondasDesdeUltimo++;
    });
    return false;
  }
  await (proveedor.intersticial || mostrarSimulado)({ tipo: 'intersticial' });
  actualizar((d) => {
    d.anuncios.rondasDesdeUltimo = 0;
    d.anuncios.ultimoMs = ahora;
  });
  return true;
}

/** Anuncio con recompensa: tabla extra por 30 minutos. */
export async function verParaTablaExtra(mostrarSimulado) {
  const visto = await (proveedor.recompensa || mostrarSimulado)({ tipo: 'recompensa' });
  if (visto) {
    actualizar((d) => {
      d.anuncios.tablaExtraHasta = Date.now() + TABLA_EXTRA_MS;
    });
  }
  return visto;
}

export function maxTablas(perfil = cargar()) {
  if (perfil.premium) return 4;
  return Date.now() < perfil.anuncios.tablaExtraHasta ? 3 : 2;
}
