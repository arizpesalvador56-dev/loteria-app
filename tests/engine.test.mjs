import { test } from 'node:test';
import assert from 'node:assert/strict';
import { CARTAS } from '../js/data/cards.js';
import { ARTE } from '../js/data/art.js';
import { FIGURAS, figuraPersonalizada } from '../js/engine/figures.js';
import { barajar, seeded } from '../js/engine/rng.js';
import { generarTablas, coincidenciasEnPosicion } from '../js/engine/tablas.js';
import { Ronda, repartoEtapas } from '../js/engine/ronda.js';

const IDS = CARTAS.map((c) => c.id);

test('baraja de 54 cartas únicas con arte y 2 versos', () => {
  assert.equal(CARTAS.length, 54);
  assert.deepEqual(IDS, Array.from({ length: 54 }, (_, i) => i + 1));
  for (const c of CARTAS) {
    assert.ok(ARTE[c.id], `falta arte ${c.id}`);
    assert.ok(c.versos.length >= 2);
  }
  assert.equal(CARTAS[25].nombre, 'El Ajolote');
  assert.equal(CARTAS[37].nombre, 'El Colibrí');
});

test('figuras con las celdas de la especificación', () => {
  assert.equal(FIGURAS.cualquier_linea.conjuntos.length, 10);
  assert.equal(FIGURAS.cuadrito.conjuntos.length, 9);
  assert.deepEqual(FIGURAS.cuadrito.conjuntos[8], [10, 11, 14, 15]);
  assert.deepEqual(FIGURAS.cruz.conjuntos[0].length, 12);
  assert.deepEqual(FIGURAS.letra_l.conjuntos[0].length, 7);
  assert.equal(FIGURAS.llena.conjuntos[0].length, 16);
  assert.deepEqual(figuraPersonalizada([5, 0, 5]).conjuntos[0], [0, 5]);
});

test('Fisher-Yates conserva las cartas', () => {
  const b = barajar(IDS, seeded(1));
  assert.deepEqual([...b].sort((a, c) => a - c), IDS);
  assert.notDeepEqual(b, IDS);
});

test('tablas sin cartas repetidas, distintas y con pocas coincidencias', () => {
  const tablas = generarTablas(8, IDS, [], seeded(7));
  for (const t of tablas) {
    assert.equal(t.length, 16);
    assert.equal(new Set(t).size, 16);
  }
  for (let a = 0; a < tablas.length; a++)
    for (let b = a + 1; b < tablas.length; b++) assert.ok(coincidenciasEnPosicion(tablas[a], tablas[b]) <= 2);
});

const tablaFija = Array.from({ length: 16 }, (_, i) => i + 1); // cartas 1..16 en orden

function rondaCon(baraja, reglas = {}, jugadores) {
  const r = new Ronda({
    jugadores: jugadores ?? [{ id: 'yo', nombre: 'Yo', tablas: [tablaFija] }],
    cartas: IDS,
    reglas: { figuras: [FIGURAS.linea_h], ...reglas },
    rnd: seeded(3),
  });
  r.baraja = baraja.concat(IDS.filter((x) => !baraja.includes(x)));
  return r;
}

test('gana con línea marcada y cantada', () => {
  const r = rondaCon([1, 2, 3, 4]);
  for (let k = 0; k < 4; k++) {
    const id = r.cantar();
    assert.ok(r.marcar('yo', 0, tablaFija.indexOf(id)).ok);
  }
  const g = r.gritar('yo');
  assert.equal(g.valido, true);
  assert.deepEqual(g.resultado.ganadores[0].conjunto, [0, 1, 2, 3]);
  assert.equal(r.estado, 'terminada');
  assert.equal(r.premios.yo, 5);
});

test('no deja marcar carta no cantada; grito en falso pierde la ronda', () => {
  const r = rondaCon([1, 2, 3, 30]);
  for (let k = 0; k < 4; k++) r.cantar();
  assert.equal(r.marcar('yo', 0, 3).motivo, 'no_cantada');
  [0, 1, 2].forEach((i) => r.marcar('yo', 0, i));
  const g = r.gritar('yo');
  assert.equal(g.valido, false);
  assert.equal(g.motivo, 'grito_en_falso');
  assert.equal(r.puedeGritar('yo'), false);
});

test('marcado libre: ficha sobre carta no cantada no cuenta', () => {
  const r = rondaCon([1, 2, 3, 30], { marcadoLibre: true, penalizacion: 'paga_pozo' });
  for (let k = 0; k < 4; k++) r.cantar();
  [0, 1, 2, 3].forEach((i) => assert.ok(r.marcar('yo', 0, i).ok));
  const g = r.gritar('yo');
  assert.equal(g.valido, false);
  assert.equal(r.penalizaciones.yo, 5);
  assert.equal(r.estado, 'cantando');
});

test('regla de marcar solo antes de la siguiente carta', () => {
  const r = rondaCon([1, 2], { marcarAtrasadas: 'antes_siguiente' });
  r.cantar();
  r.cantar();
  assert.equal(r.marcar('yo', 0, 0).motivo, 'atrasada');
  assert.ok(r.marcar('yo', 0, 1).ok);
});

test('empate con la misma carta reparte el pozo', () => {
  const otra = [1, 2, 3, 4, ...Array.from({ length: 12 }, (_, i) => 40 + i)];
  const r = rondaCon(
    [1, 2, 3, 4],
    {},
    [
      { id: 'yo', nombre: 'Yo', tablas: [tablaFija] },
      { id: 'bot', nombre: 'Bot', esBot: true, tablas: [otra] },
    ],
  );
  for (let k = 0; k < 4; k++) r.cantar();
  [0, 1, 2, 3].forEach((i) => r.marcar('yo', 0, i));
  const g = r.gritar('bot');
  assert.equal(g.valido, true);
  assert.equal(g.resultado.ganadores.length, 2);
  assert.equal(r.premios.yo + r.premios.bot, 10);
});

test('empate con desempate: gana quien tiene la siguiente carta', () => {
  const otra = [1, 2, 3, 4, ...Array.from({ length: 12 }, (_, i) => 40 + i)];
  const r = rondaCon(
    [1, 2, 3, 4, 45],
    { empate: 'desempate' },
    [
      { id: 'yo', nombre: 'Yo', esBot: true, tablas: [tablaFija] },
      { id: 'bot', nombre: 'Bot', esBot: true, tablas: [otra] },
    ],
  );
  for (let k = 0; k < 4; k++) r.cantar();
  const g = r.gritar('yo');
  assert.deepEqual(g.resultado.ganadores.map((x) => x.jugadorId), ['bot']);
  assert.deepEqual(g.resultado.desempate, [45]);
});

test('modo por etapas sigue la ronda y reparte el pozo', () => {
  assert.deepEqual(repartoEtapas(3), [0.25, 0.25, 0.5]);
  const r = rondaCon([1, 2, 3, 4, 13, 16], { figuras: [FIGURAS.linea_h, FIGURAS.esquinas] }, [
    { id: 'yo', nombre: 'Yo', esBot: true, tablas: [tablaFija] },
    { id: 'b', nombre: 'B', esBot: true, tablas: [Array.from({ length: 16 }, (_, i) => 54 - i)] },
  ]);
  for (let k = 0; k < 4; k++) r.cantar();
  assert.equal(r.gritar('yo').terminada, false);
  assert.equal(r.figuraActual.id, 'esquinas');
  r.cantar();
  r.cantar();
  const g = r.gritar('yo');
  assert.equal(g.terminada, true);
  assert.equal(r.premios.yo, 10);
});

test('varias tablas: gana con cualquiera; ronda desierta arrastra el pozo', () => {
  const r = rondaCon([20, 21, 22, 23], {}, [{ id: 'yo', nombre: 'Yo', tablas: [tablaFija, [20, 21, 22, 23, ...Array.from({ length: 12 }, (_, i) => 30 + i)]] }]);
  r.reglas.automarcado = true;
  for (let k = 0; k < 4; k++) r.cantar();
  const g = r.gritar('yo');
  assert.equal(g.resultado.ganadores[0].tablaIdx, 1);

  const d = rondaCon([], { figuras: [FIGURAS.llena] }, [{ id: 'yo', nombre: 'Yo', tablas: [tablaFija] }]);
  while (d.cantar() !== null);
  assert.equal(d.desierta, true);
  assert.equal(d.arrastre, 5);
});
