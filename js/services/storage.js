// Persistencia local (perfil, ajustes, estadísticas). Tolera navegadores sin almacenamiento.

const CLAVE = 'loteria.v1';

const PERFIL_INICIAL = {
  nombre: 'Tú',
  fichas: 100, // fichas virtuales, sin valor en efectivo
  premium: false,
  ficha: 'frijol',
  tema: 'auto',
  voz: 'neutra',
  modoVoz: 'verso', // 'nombre' | 'verso'
  sonido: true,
  vibracion: true,
  figurasPersonalizadas: [],
  ultimaConfig: null,
  stats: {
    rondas: 0,
    ganadas: 0,
    racha: 0,
    mejorRacha: 0,
    gritosEnFalso: 0,
    cartasSuerte: {}, // id -> veces en conjunto ganador
  },
  anuncios: { rondasDesdeUltimo: 0, ultimoMs: 0, tablaExtraHasta: 0 },
};

let mem = null;

export function cargar() {
  if (mem) return mem;
  let guardado = null;
  try {
    guardado = JSON.parse(localStorage.getItem(CLAVE) || 'null');
  } catch {
    guardado = null;
  }
  mem = {
    ...structuredClone(PERFIL_INICIAL),
    ...(guardado || {}),
    stats: { ...PERFIL_INICIAL.stats, ...(guardado?.stats || {}) },
    anuncios: { ...PERFIL_INICIAL.anuncios, ...(guardado?.anuncios || {}) },
  };
  return mem;
}

export function guardar() {
  try {
    localStorage.setItem(CLAVE, JSON.stringify(mem));
  } catch {
    /* sin almacenamiento: seguimos en memoria */
  }
}

export function actualizar(fn) {
  fn(cargar());
  guardar();
  return mem;
}

export function reiniciar() {
  mem = structuredClone(PERFIL_INICIAL);
  guardar();
  return mem;
}
