// Motor de una ronda de Lotería. Lógica pura y sin temporizadores:
// la interfaz decide cuándo cantar y cuándo gritan los bots.
//
// Estados: 'cantando' -> ('pausado' durante verificación) -> 'cantando' | 'terminada'

import { barajar, cryptoRandom } from './rng.js';
import { conjuntoCompleto } from './figures.js';

export const REGLAS_POR_DEFECTO = {
  figuras: [], // una figura = modo normal; varias = modo por etapas
  marcarAtrasadas: 'siempre', // 'siempre' | 'antes_siguiente'
  automarcado: false,
  marcadoLibre: false, // permitir marcar cartas que no han salido
  penalizacion: 'pierde_ronda', // 'ninguna' | 'pierde_ronda' | 'paga_pozo'
  empate: 'repartir', // 'repartir' | 'desempate' | 'sorteo'
  entrada: 5, // fichas virtuales por jugador
};

/** Reparto del pozo por etapa: la última se lleva la mitad, las demás se reparten el resto. */
export function repartoEtapas(n) {
  if (n <= 1) return [1];
  const resto = 0.5 / (n - 1);
  return [...Array(n - 1).fill(resto), 0.5];
}

export class Ronda {
  /**
   * @param {object} opts
   * @param {{id:string,nombre:string,esBot?:boolean,tablas:number[][]}[]} opts.jugadores
   * @param {number[]} opts.cartas ids de la baraja
   * @param {object} opts.reglas
   * @param {number} [opts.pozoInicial] arrastre de rondas desiertas
   * @param {()=>number} [opts.rnd]
   */
  constructor({ jugadores, cartas, reglas, pozoInicial = 0, rnd = cryptoRandom }) {
    this.reglas = { ...REGLAS_POR_DEFECTO, ...reglas };
    if (!this.reglas.figuras.length) throw new Error('Se necesita al menos una figura');
    this.rnd = rnd;
    this.jugadores = jugadores.map((j) => ({ ...j, esBot: !!j.esBot }));
    this.baraja = barajar(cartas, rnd);
    this.indice = 0;
    this.cantadas = [];
    this.cantadasSet = new Set();
    this.marcas = new Map(this.jugadores.map((j) => [j.id, j.tablas.map(() => new Set())]));
    this.eliminados = new Set();
    this.etapa = 0;
    this.resultados = []; // [{figura, ganadores:[{jugadorId,tablaIdx,conjunto}], cartaId, premio, desempate}]
    this.pozo = pozoInicial + this.reglas.entrada * this.jugadores.length;
    this.premios = Object.fromEntries(this.jugadores.map((j) => [j.id, 0]));
    this.penalizaciones = Object.fromEntries(this.jugadores.map((j) => [j.id, 0]));
    this.reparto = repartoEtapas(this.reglas.figuras.length);
    this.pozoEtapas = this.reparto.map((f) => Math.floor(this.pozo * f));
    this.pozoEtapas[this.pozoEtapas.length - 1] += this.pozo - this.pozoEtapas.reduce((a, b) => a + b, 0);
    this.estado = 'cantando';
    this.desierta = false;
  }

  get figuraActual() {
    return this.reglas.figuras[this.etapa];
  }
  get ultima() {
    return this.cantadas[this.cantadas.length - 1] ?? null;
  }
  get restantes() {
    return this.baraja.length - this.indice;
  }
  jugador(id) {
    return this.jugadores.find((j) => j.id === id);
  }

  /** Saca la siguiente carta. Regresa su id, o null si se acabó la baraja (ronda desierta). */
  cantar() {
    if (this.estado !== 'cantando') return null;
    if (this.indice >= this.baraja.length) {
      this.estado = 'terminada';
      this.desierta = this.resultados.length === 0 || this.etapa < this.reglas.figuras.length;
      return null;
    }
    const id = this.baraja[this.indice++];
    this.cantadas.push(id);
    this.cantadasSet.add(id);
    for (const j of this.jugadores) {
      if (j.esBot || this.reglas.automarcado || j.automarcado) this._automarcar(j, id);
    }
    return id;
  }

  _automarcar(j, cartaId) {
    j.tablas.forEach((t, ti) => {
      const i = t.indexOf(cartaId);
      if (i >= 0) this.marcas.get(j.id)[ti].add(i);
    });
  }

  /** Activa el automarcado de un jugador (p. ej. al desconectarse) y lo pone al día. */
  activarAutomarcado(jugadorId) {
    const j = this.jugador(jugadorId);
    j.automarcado = true;
    for (const c of this.cantadas) this._automarcar(j, c);
  }

  /**
   * Pone o quita la ficha de una celda.
   * @returns {{ok:boolean, marcada?:boolean, motivo?:string}}
   */
  marcar(jugadorId, tablaIdx, celda) {
    const j = this.jugador(jugadorId);
    if (!j) return { ok: false, motivo: 'jugador' };
    const set = this.marcas.get(jugadorId)[tablaIdx];
    if (set.has(celda)) {
      set.delete(celda);
      return { ok: true, marcada: false };
    }
    const carta = j.tablas[tablaIdx][celda];
    if (!this.cantadasSet.has(carta)) {
      if (!this.reglas.marcadoLibre) return { ok: false, motivo: 'no_cantada' };
    } else if (this.reglas.marcarAtrasadas === 'antes_siguiente' && carta !== this.ultima) {
      return { ok: false, motivo: 'atrasada' };
    }
    set.add(celda);
    return { ok: true, marcada: true };
  }

  estaMarcada(jugadorId, tablaIdx, celda) {
    return this.marcas.get(jugadorId)[tablaIdx].has(celda);
  }

  /** Conjunto completo (marcado y cantado) de la figura actual en alguna tabla del jugador. */
  completo(jugadorId, figura = this.figuraActual) {
    const j = this.jugador(jugadorId);
    for (let ti = 0; ti < j.tablas.length; ti++) {
      const set = this.marcas.get(jugadorId)[ti];
      const conj = conjuntoCompleto(j.tablas[ti], (i) => set.has(i), this.cantadasSet, figura);
      if (conj) return { tablaIdx: ti, conjunto: conj };
    }
    return null;
  }

  /** ¿El jugador completó la figura justo con la última carta? (para empates) */
  _completoConUltima(jugadorId) {
    const r = this.completo(jugadorId);
    if (!r) return null;
    const j = this.jugador(jugadorId);
    const usaUltima = r.conjunto.some((i) => j.tablas[r.tablaIdx][i] === this.ultima);
    return usaUltima ? r : null;
  }

  puedeGritar(jugadorId) {
    return this.estado === 'cantando' && !this.eliminados.has(jugadorId);
  }

  /**
   * Un jugador grita "¡Lotería!". Verifica y resuelve empates.
   * @returns {{valido:boolean, motivo?:string, penalizacion?:string, resultado?:object, terminada?:boolean}}
   */
  gritar(jugadorId) {
    if (!this.puedeGritar(jugadorId)) return { valido: false, motivo: 'no_puede' };
    this.estado = 'pausado';
    const r = this.completo(jugadorId);
    if (!r) {
      const pen = this.reglas.penalizacion;
      if (pen === 'pierde_ronda') this.eliminados.add(jugadorId);
      if (pen === 'paga_pozo') {
        this.penalizaciones[jugadorId] += this.reglas.entrada;
        this.pozoEtapas[this.pozoEtapas.length - 1] += this.reglas.entrada;
        this.pozo += this.reglas.entrada;
      }
      this.estado = 'cantando';
      return { valido: false, motivo: 'grito_en_falso', penalizacion: pen };
    }

    // Empatan quienes completaron con la misma carta (además del que gritó).
    const ganadores = [{ jugadorId, ...r }];
    for (const j of this.jugadores) {
      if (j.id === jugadorId || this.eliminados.has(j.id)) continue;
      const otro = this._completoConUltima(j.id);
      if (otro) ganadores.push({ jugadorId: j.id, ...otro });
    }

    let finales = ganadores;
    let desempate = [];
    if (ganadores.length > 1) {
      if (this.reglas.empate === 'sorteo') {
        finales = [ganadores[Math.floor(this.rnd() * ganadores.length)]];
      } else if (this.reglas.empate === 'desempate') {
        ({ finales, desempate } = this._desempatar(ganadores));
      }
    }

    const premioTotal = this.pozoEtapas[this.etapa];
    const cada = Math.floor(premioTotal / finales.length);
    finales.forEach((g, k) => {
      this.premios[g.jugadorId] += cada + (k === 0 ? premioTotal - cada * finales.length : 0);
    });

    const resultado = {
      figura: this.figuraActual,
      etapa: this.etapa,
      cartaId: this.ultima,
      ganadores: finales,
      empatados: ganadores,
      premio: premioTotal,
      desempate,
    };
    this.resultados.push(resultado);
    this.etapa++;
    const terminada = this.etapa >= this.reglas.figuras.length;
    this.estado = terminada ? 'terminada' : 'cantando';
    return { valido: true, resultado, terminada };
  }

  /** Sigue cantando: gana quien tenga primero la carta siguiente en alguna de sus tablas. */
  _desempatar(ganadores) {
    const desempate = [];
    let vivos = ganadores;
    while (this.indice < this.baraja.length && vivos.length > 1) {
      const id = this.baraja[this.indice++];
      this.cantadas.push(id);
      this.cantadasSet.add(id);
      desempate.push(id);
      const conCarta = vivos.filter((g) => this.jugador(g.jugadorId).tablas.some((t) => t.includes(id)));
      if (conCarta.length >= 1) vivos = conCarta;
    }
    if (vivos.length > 1) return { finales: vivos, desempate }; // se acabó la baraja: repartir
    return { finales: vivos, desempate };
  }

  /** Cartas de la suerte: las del conjunto ganador del jugador. */
  cartasGanadoras(jugadorId) {
    const ids = [];
    for (const res of this.resultados) {
      for (const g of res.ganadores) {
        if (g.jugadorId === jugadorId) {
          const t = this.jugador(jugadorId).tablas[g.tablaIdx];
          ids.push(...g.conjunto.map((i) => t[i]));
        }
      }
    }
    return ids;
  }

  /** Pozo que pasa a la siguiente ronda si quedó desierta. */
  get arrastre() {
    if (!this.desierta) return 0;
    return this.pozoEtapas.slice(this.etapa).reduce((a, b) => a + b, 0);
  }
}
