// Interfaz de la app. Pantallas: inicio, nueva partida, juego, modo cantor,
// tablas para imprimir, estadísticas, ajustes y Premium.

import { CARTAS, CARTA_POR_ID, CATEGORIAS } from './data/cards.js';
import { arteSVG } from './data/art.js';
import { FIGURAS, ORDEN_FIGURAS, figuraPersonalizada } from './engine/figures.js';
import { barajar } from './engine/rng.js';
import { generarTablas } from './engine/tablas.js';
import { Ronda } from './engine/ronda.js';
import * as almacen from './services/storage.js';
import * as voz from './services/voice.js';
import * as anuncios from './services/ads.js';

const IDS = CARTAS.map((c) => c.id);
const $app = document.getElementById('app');
const $ = (sel, root = document) => root.querySelector(sel);
const esc = (t) => String(t).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

export const VELOCIDADES = {
  lento: { nombre: 'Lento', ms: 9000 },
  normal: { nombre: 'Normal', ms: 5500 },
  rapido: { nombre: 'Rápido', ms: 2500 },
  manual: { nombre: 'Manual', ms: 0 },
};
const DIFICULTAD = {
  facil: { nombre: 'Fácil', reaccion: [2500, 5000] },
  normal: { nombre: 'Normal', reaccion: [1200, 3000] },
  dificil: { nombre: 'Difícil', reaccion: [500, 1500] },
};
const NOMBRES_BOTS = ['Doña Chona', 'Don Beto', 'Tía Lupe', 'El Profe', 'Memo', 'Paquita', 'Güero'];
const ETAPAS = ['cualquier_linea', 'esquinas_centro', 'llena'];
const FICHAS = {
  frijol: { nombre: 'Frijol', premium: false },
  maiz: { nombre: 'Maíz', premium: false },
  corcholata: { nombre: 'Corcholata', premium: false },
  estrella: { nombre: 'Estrella', premium: true },
  corazon: { nombre: 'Corazón', premium: true },
};

let perfil = almacen.cargar();

const CONFIG_INICIAL = {
  figura: 'cualquier_linea',
  modalidad: 'una', // 'una' | 'etapas'
  velocidad: 'normal',
  rivales: 3,
  dificultad: 'normal',
  numTablas: 1,
  automarcado: false,
  marcarAtrasadas: 'siempre',
  penalizacion: 'pierde_ronda',
  empate: 'repartir',
};
let config = { ...CONFIG_INICIAL, ...(perfil.ultimaConfig || {}) };

// ---------------------------------------------------------------- utilidades

function aplicarTema() {
  if (perfil.tema === 'auto') document.documentElement.removeAttribute('data-theme');
  else document.documentElement.dataset.theme = perfil.tema;
}

function cartaHTML(id, clase = '') {
  const c = CARTA_POR_ID[id];
  return `<div class="carta ${clase}" style="--cat:${CATEGORIAS[c.categoria]}" title="${esc(c.nombre)}">
    <span class="num">${c.numero}</span>
    <div class="arte">${arteSVG(id)}</div>
    <div class="nombre">${esc(c.nombre)}</div>
  </div>`;
}

function miniFig(figura, grande = false) {
  const on = new Set(figura.conjuntos[0]);
  const anim = figura.conjuntos.length > 1 ? ` data-anim="${figura.id}"` : '';
  return `<span class="mini-fig ${grande ? 'grande' : ''}"${anim}>${Array.from({ length: 16 }, (_, i) => `<i class="${on.has(i) ? 'on' : ''}"></i>`).join('')}</span>`;
}

// Anima las figuras con varias formas de cumplirse (líneas, cuadritos).
let pasoAnim = 0;
setInterval(() => {
  pasoAnim++;
  document.querySelectorAll('[data-anim]').forEach((el) => {
    const f = obtenerFigura(el.dataset.anim);
    if (!f) return;
    const on = new Set(f.conjuntos[pasoAnim % f.conjuntos.length]);
    el.querySelectorAll('i').forEach((i, k) => i.classList.toggle('on', on.has(k)));
  });
}, 900);

function obtenerFigura(id) {
  if (FIGURAS[id]) return FIGURAS[id];
  const p = perfil.figurasPersonalizadas.find((f) => f.id === id);
  return p ? { ...figuraPersonalizada(p.celdas, p.nombre), id: p.id } : null;
}

function fichaSVG(tipo = perfil.ficha) {
  const f = {
    frijol: `<ellipse cx="50" cy="50" rx="40" ry="28" fill="#6B3A2A" stroke="#2b1710" stroke-width="5" transform="rotate(-25 50 50)"/><path d="M30 44 q16 -10 34 -4" stroke="#fff" stroke-width="5" fill="none" opacity=".5" stroke-linecap="round"/>`,
    maiz: `<path d="M50 8 q34 10 30 48 q-6 34 -30 36 q-24 -2 -30 -36 q-4 -38 30 -48z" fill="#FFC93C" stroke="#8a5a00" stroke-width="5"/><path d="M38 30 q-6 16 0 30" stroke="#fff" stroke-width="5" fill="none" opacity=".6" stroke-linecap="round"/>`,
    corcholata: `<circle cx="50" cy="50" r="42" fill="#E8416F" stroke="#7a1030" stroke-width="5" stroke-dasharray="8 5"/><circle cx="50" cy="50" r="26" fill="#FFC93C" stroke="#7a1030" stroke-width="3"/>`,
    estrella: `<path d="M50 6 l12 28 l30 2 l-24 18 l8 30 l-26 -16 l-26 16 l8 -30 l-24 -18 l30 -2z" fill="#FFC93C" stroke="#23203A" stroke-width="5" stroke-linejoin="round"/>`,
    corazon: `<path d="M50 88 q-40 -26 -40 -50 q0 -22 20 -22 q14 0 20 14 q6 -14 20 -14 q20 0 20 22 q0 24 -40 50z" fill="#E8416F" stroke="#23203A" stroke-width="5"/>`,
  }[tipo] || '';
  return `<svg class="ficha" viewBox="0 0 100 100">${f}</svg>`;
}

function toast(msg, ms = 1800) {
  document.querySelectorAll('.toast').forEach((t) => t.remove());
  const t = document.createElement('div');
  t.className = 'toast';
  t.setAttribute('role', 'status');
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), ms);
}

function vibrar(patron) {
  if (perfil.vibracion && navigator.vibrate) {
    try { navigator.vibrate(patron); } catch { /* nada */ }
  }
}

let audioCtx = null;
function sonido(tipo) {
  if (!perfil.sonido) return;
  try {
    audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
    const notas = { carta: [660], marca: [880], error: [180], gana: [523, 659, 784, 1046] }[tipo] || [440];
    notas.forEach((f, k) => {
      const o = audioCtx.createOscillator();
      const g = audioCtx.createGain();
      o.type = tipo === 'error' ? 'square' : 'triangle';
      o.frequency.value = f;
      const t0 = audioCtx.currentTime + k * 0.12;
      g.gain.setValueAtTime(0.0001, t0);
      g.gain.exponentialRampToValueAtTime(0.18, t0 + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.22);
      o.connect(g).connect(audioCtx.destination);
      o.start(t0);
      o.stop(t0 + 0.25);
    });
  } catch { /* sin audio */ }
}

function confeti() {
  const capa = document.createElement('div');
  capa.className = 'confeti';
  const colores = ['#E8416F', '#FFC93C', '#2FB67C', '#3B7BE8', '#8A5CF6', '#1BA6C9'];
  for (let i = 0; i < 90; i++) {
    const p = document.createElement('i');
    p.style.left = Math.random() * 100 + '%';
    p.style.background = colores[i % colores.length];
    p.style.animationDuration = 1.8 + Math.random() * 1.8 + 's';
    p.style.animationDelay = Math.random() * 0.6 + 's';
    p.style.borderRadius = i % 3 ? '2px' : '50%';
    capa.appendChild(p);
  }
  document.body.appendChild(capa);
  setTimeout(() => capa.remove(), 4500);
}

function dialogo(html, { cerrable = true } = {}) {
  cerrarDialogo();
  const capa = document.createElement('div');
  capa.className = 'capa';
  capa.innerHTML = `<div class="dialogo" role="dialog" aria-modal="true">${html}</div>`;
  if (cerrable) capa.addEventListener('click', (e) => e.target === capa && cerrarDialogo());
  document.body.appendChild(capa);
  return capa;
}
function cerrarDialogo() {
  document.querySelectorAll('.capa').forEach((c) => c.remove());
}

/** Anuncio simulado (en la app nativa lo reemplaza el proveedor real). */
function anuncioSimulado({ tipo }) {
  return new Promise((resolve) => {
    const segundos = tipo === 'recompensa' ? 5 : 4;
    const capa = dialogo(`
      <p class="nota">Anuncio${tipo === 'recompensa' ? ' con recompensa' : ''} · se quita con Premium</p>
      <div class="anuncio">Espacio publicitario<br>(simulado)</div>
      <button class="btn bloque" id="cerrar-anuncio" disabled>Cerrar en ${segundos}</button>`, { cerrable: false });
    const b = $('#cerrar-anuncio', capa);
    let n = segundos;
    const t = setInterval(() => {
      n--;
      if (n <= 0) {
        clearInterval(t);
        b.disabled = false;
        b.textContent = tipo === 'recompensa' ? 'Reclamar recompensa' : 'Cerrar';
      } else b.textContent = `Cerrar en ${n}`;
    }, 1000);
    b.onclick = () => { cerrarDialogo(); resolve(true); };
  });
}

function barra(titulo, extra = '') {
  return `<header class="barra">
    <button class="btn icono" data-ir="inicio" aria-label="Regresar">←</button>
    <h2>${titulo}</h2>${extra}
  </header>`;
}

function opciones(nombre, valores, actual) {
  return `<div class="opciones" role="group">${Object.entries(valores)
    .map(([k, v]) => `<button class="opcion" data-opt="${nombre}" data-val="${k}" aria-pressed="${String(k) === String(actual)}">${v}</button>`)
    .join('')}</div>`;
}

function paso(nombre, valor, min, max) {
  return `<div class="paso">
    <button class="btn chico icono" data-paso="${nombre}" data-d="-1" ${valor <= min ? 'disabled' : ''} aria-label="Menos">−</button>
    <output>${valor}</output>
    <button class="btn chico icono" data-paso="${nombre}" data-d="1" ${valor >= max ? 'disabled' : ''} aria-label="Más">+</button>
  </div>`;
}

// ---------------------------------------------------------------- navegación

let pantallaActual = 'inicio';
const pantallas = {};

function ir(nombre, ...args) {
  if (pantallaActual === 'juego' && nombre !== 'juego') detenerJuego();
  if (pantallaActual === 'cantor' && nombre !== 'cantor') detenerCantor();
  pantallaActual = nombre;
  cerrarDialogo();
  voz.callar();
  pantallas[nombre](...args);
  window.scrollTo(0, 0);
}

document.addEventListener('click', (e) => {
  const b = e.target.closest('[data-ir]');
  if (b) ir(b.dataset.ir);
});

// ---------------------------------------------------------------- inicio

pantallas.inicio = () => {
  const muestra = [1, 14, 23, 46, 6];
  $app.innerHTML = `
  <section class="inicio">
    <div style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap">
      <span class="pill">🫘 ${perfil.fichas} fichas</span>
      ${perfil.premium ? '<span class="pill premium">★ Premium</span>' : ''}
    </div>
    <h1 class="logo">¡Lotería!</h1>
    <p class="subtitulo">La de siempre, en tu celular.</p>
    <div class="abanico" aria-hidden="true">
      ${muestra.map((id, k) => `<div style="transform:rotate(${(k - 2) * 9}deg) translateY(${Math.abs(k - 2) * 8}px)">${cartaHTML(id)}</div>`).join('')}
    </div>
    <nav class="menu">
      <button class="modo modo-celular" data-ir="nueva">
        <span class="modo-icono" aria-hidden="true">📱</span>
        <span><b>Jugar en el celular</b><small>Tu tabla en la pantalla contra otros jugadores</small></span>
      </button>
      <button class="modo modo-cantor" data-ir="cantor">
        <span class="modo-icono" aria-hidden="true">📣</span>
        <span><b>Solo cantor</b><small>Para jugar con tablas físicas. Un toque y empieza</small></span>
      </button>
      <div class="menu-sec">
        <button class="btn" data-ir="imprimir">Tablas para imprimir</button>
        <button class="btn" data-ir="stats">Estadísticas</button>
        <button class="btn" data-ir="ajustes">Ajustes</button>
        <button class="btn morado" data-ir="premium">${perfil.premium ? 'Premium ★' : 'Premium'}</button>
      </div>
    </nav>
    <p class="nota">Modo fiesta (un celular canta y los demás juegan) y modo en línea vienen en la siguiente versión. Las fichas son virtuales y no tienen valor en dinero.</p>
  </section>`;
};

// ---------------------------------------------------------------- nueva partida

let tablasJugador = [];

function asegurarTablas() {
  const max = anuncios.maxTablas(perfil);
  config.numTablas = Math.min(config.numTablas, max);
  if (tablasJugador.length > config.numTablas) tablasJugador = tablasJugador.slice(0, config.numTablas);
  if (tablasJugador.length < config.numTablas) {
    tablasJugador.push(...generarTablas(config.numTablas - tablasJugador.length, IDS, tablasJugador));
  }
}

pantallas.nueva = () => {
  asegurarTablas();
  const max = anuncios.maxTablas(perfil);
  const figurasDisp = [...ORDEN_FIGURAS, ...perfil.figurasPersonalizadas.map((f) => f.id)];
  $app.innerHTML = `
  ${barra('Nueva partida')}
  <section class="seccion">
    <h3>Modalidad</h3>
    ${opciones('modalidad', { una: 'Una figura', etapas: 'Por etapas' }, config.modalidad)}
    <p class="nota">${config.modalidad === 'etapas' ? 'Primero cualquier línea, luego esquinas y centro, y al final tabla llena. Las fichas no se quitan entre etapas.' : 'Gana quien complete la figura primero.'}</p>
  </section>
  <section class="seccion ${config.modalidad === 'etapas' ? 'oculto' : ''}">
    <h3>Figura ganadora <span class="nota">${esc(obtenerFigura(config.figura)?.nombre || '')}</span></h3>
    <div class="figuras">
      ${figurasDisp.map((id) => { const f = obtenerFigura(id); return `<button class="opcion" data-opt="figura" data-val="${id}" aria-pressed="${id === config.figura}">${miniFig(f)}${esc(f.nombre)}</button>`; }).join('')}
      <button class="opcion" id="crear-figura">${perfil.premium ? '' : '<span class="candado">🔒</span>'}＋ Dibujar figura</button>
    </div>
  </section>
  <section class="seccion">
    <h3>Cantor</h3>
    ${opciones('velocidad', Object.fromEntries(Object.entries(VELOCIDADES).map(([k, v]) => [k, v.nombre])), config.velocidad)}
  </section>
  <section class="seccion">
    <h3>Jugadores</h3>
    <div class="fila"><span>Rivales de la app</span>${paso('rivales', config.rivales, 1, 7)}</div>
    <div class="fila"><span>Qué tan rápido gritan</span>${opciones('dificultad', Object.fromEntries(Object.entries(DIFICULTAD).map(([k, v]) => [k, v.nombre])), config.dificultad)}</div>
    <div class="fila"><span>Mis tablas <span class="nota">(máx. ${max}${perfil.premium ? '' : ', 4 con Premium'})</span></span>${paso('numTablas', config.numTablas, 1, max)}</div>
    ${!perfil.premium && max < 3 ? '<button class="btn chico amarillo" id="ver-anuncio">▶ Ver anuncio y desbloquear una 3.ª tabla por 30 min</button>' : ''}
  </section>
  <section class="seccion">
    <h3>Reglas</h3>
    <div class="fila"><span>Automarcado</span><input type="checkbox" class="switch" data-chk="automarcado" ${config.automarcado ? 'checked' : ''}></div>
    <div class="fila"><span>Marcar cartas atrasadas</span>${opciones('marcarAtrasadas', { siempre: 'Siempre', antes_siguiente: 'Solo la última' }, config.marcarAtrasadas)}</div>
    <div class="fila"><span>Grito en falso</span>${opciones('penalizacion', { ninguna: 'Nada', pierde_ronda: 'Pierde la ronda', paga_pozo: 'Paga otra vez' }, config.penalizacion)}</div>
    <div class="fila"><span>Empate</span>${opciones('empate', { repartir: 'Repartir', desempate: 'Desempate', sorteo: 'Sorteo' }, config.empate)}</div>
  </section>
  <section class="seccion">
    <h3>Tus tablas <button class="btn chico" id="otras-tablas">Cambiar tablas</button></h3>
    <div class="tablas">${tablasJugador.map((t, k) => tablaHTML(t, k, null)).join('')}</div>
  </section>
  <div class="grito-wrap"><button class="btn grito" id="empezar">¡A jugar!</button></div>`;

  $app.querySelectorAll('[data-opt]').forEach((b) => (b.onclick = () => {
    config[b.dataset.opt] = b.dataset.val;
    pantallas.nueva();
  }));
  $app.querySelectorAll('[data-paso]').forEach((b) => (b.onclick = () => {
    config[b.dataset.paso] += Number(b.dataset.d);
    pantallas.nueva();
  }));
  $app.querySelectorAll('[data-chk]').forEach((c) => (c.onchange = () => { config[c.dataset.chk] = c.checked; }));
  $('#otras-tablas').onclick = () => { tablasJugador = []; pantallas.nueva(); };
  $('#crear-figura').onclick = () => (perfil.premium ? editorFigura(() => pantallas.nueva()) : ofrecerPremium('Las figuras personalizadas son de Premium.'));
  const va = $('#ver-anuncio');
  if (va) va.onclick = async () => {
    if (await anuncios.verParaTablaExtra(anuncioSimulado)) {
      perfil = almacen.cargar();
      toast('¡Listo! Tienes una tabla extra por 30 minutos');
      pantallas.nueva();
    }
  };
  $('#empezar').onclick = () => {
    almacen.actualizar((p) => { p.ultimaConfig = { ...config }; });
    ir('juego');
  };
};

function editorFigura(alGuardar) {
  const sel = new Set();
  const capa = dialogo(`
    <h2>Dibuja tu figura</h2>
    <p class="nota">Toca las celdas que hay que llenar.</p>
    <div class="editor" style="margin:12px auto;width:max-content">${Array.from({ length: 16 }, (_, i) => `<button data-c="${i}" aria-label="Celda ${i + 1}"></button>`).join('')}</div>
    <input id="nombre-fig" class="opcion" style="width:100%" maxlength="24" placeholder="Nombre (ej. La Escalerita)">
    <div class="acciones"><button class="btn primario" id="guardar-fig">Guardar figura</button><button class="btn" id="cancelar-fig">Cancelar</button></div>`);
  capa.querySelectorAll('[data-c]').forEach((b) => (b.onclick = () => {
    const i = Number(b.dataset.c);
    sel.has(i) ? sel.delete(i) : sel.add(i);
    b.classList.toggle('on', sel.has(i));
  }));
  $('#cancelar-fig', capa).onclick = cerrarDialogo;
  $('#guardar-fig', capa).onclick = () => {
    if (sel.size < 2) return toast('Elige al menos 2 celdas');
    const nombre = $('#nombre-fig', capa).value.trim() || 'Mi figura';
    const id = 'custom_' + Date.now().toString(36);
    almacen.actualizar((p) => p.figurasPersonalizadas.push({ id, nombre, celdas: [...sel].sort((a, b) => a - b) }));
    perfil = almacen.cargar();
    config.figura = id;
    cerrarDialogo();
    alGuardar?.();
  };
}

function ofrecerPremium(motivo) {
  const capa = dialogo(`<h2>★ Premium</h2><p>${esc(motivo)}</p>
    <div class="acciones"><button class="btn morado" id="ver-premium">Ver Premium</button><button class="btn" id="luego">Ahora no</button></div>`);
  $('#ver-premium', capa).onclick = () => ir('premium');
  $('#luego', capa).onclick = cerrarDialogo;
}

// ---------------------------------------------------------------- juego

let J = null; // estado del juego en curso

function tablaHTML(celdas, idx, ronda, ganadoras = null) {
  return `<div class="tabla" data-tabla="${idx}">
    <div class="cab"><span>Tabla ${idx + 1}</span></div>
    <div class="rejilla">${celdas.map((id, i) => {
      const marcada = ronda?.estaMarcada('yo', idx, i);
      const gan = ganadoras?.has(i);
      return `<button class="celda ${marcada ? 'marcada' : ''} ${gan ? 'ganadora' : ''}" data-celda="${i}" aria-label="${esc(CARTA_POR_ID[id].nombre)}${marcada ? ', marcada' : ''}">${cartaHTML(id)}${marcada ? fichaSVG() : ''}</button>`;
    }).join('')}</div>
  </div>`;
}

function construirRonda() {
  const figuras = config.modalidad === 'etapas' ? ETAPAS.map((id) => FIGURAS[id]) : [obtenerFigura(config.figura) || FIGURAS.cualquier_linea];
  const botsTablas = generarTablas(config.rivales, IDS, tablasJugador);
  const nombres = barajar(NOMBRES_BOTS).slice(0, config.rivales);
  const jugadores = [
    { id: 'yo', nombre: perfil.nombre || 'Tú', tablas: tablasJugador },
    ...botsTablas.map((t, k) => ({ id: 'bot' + k, nombre: nombres[k], esBot: true, tablas: [t] })),
  ];
  return new Ronda({
    jugadores,
    cartas: IDS,
    pozoInicial: J?.arrastre || 0,
    reglas: {
      figuras,
      automarcado: config.automarcado,
      marcarAtrasadas: config.marcarAtrasadas,
      penalizacion: config.penalizacion,
      empate: config.empate,
      marcadoLibre: true, // permite fichas en cartas no cantadas para que el grito en falso tenga sentido
      entrada: 5,
    },
  });
}

pantallas.juego = () => {
  asegurarTablas();
  if (perfil.fichas < 5) {
    almacen.actualizar((p) => { p.fichas += 50; });
    perfil = almacen.cargar();
    toast('Te regalamos 50 fichas para seguir jugando');
  }
  const arrastre = J?.arrastre || 0;
  J = { ronda: null, timer: null, botTimers: new Map(), pausado: false, arrastre, terminado: false };
  J.ronda = construirRonda();
  renderJuego();
  const r = J.ronda;
  mostrarAnuncioInicio(r);
};

function mostrarAnuncioInicio(r) {
  const nombres = r.reglas.figuras.map((f) => f.nombre).join(' → ');
  const capa = dialogo(`
    <p class="nota">Figura</p>
    <div style="display:flex;gap:12px;justify-content:center">${r.reglas.figuras.map((f) => miniFig(f, true)).join('')}</div>
    <h2 style="margin-top:8px">${esc(nombres)}</h2>
    <p>Pozo: <b>${r.pozo}</b> fichas · Entrada: 5</p>
    <div class="acciones"><button class="btn primario" id="arrancar">¡Se va y se corre!</button></div>`, { cerrable: false });
  $('#arrancar', capa).onclick = () => {
    cerrarDialogo();
    voz.decir('¡Se va y se corre!', perfil.voz);
    setTimeout(() => siguienteCarta(), 1400);
  };
}

function renderJuego() {
  const r = J.ronda;
  const fig = r.figuraActual;
  const vel = VELOCIDADES[config.velocidad];
  $app.innerHTML = `
  <header class="barra">
    <button class="btn icono" id="salir" aria-label="Salir">✕</button>
    <h2 style="font-size:18px">${miniFig(fig)} <span id="fig-nombre">${esc(fig.nombre)}</span></h2>
    <span class="pill" id="pozo">🫘 ${r.pozoEtapas[r.etapa] ?? 0}</span>
    <span class="pill" id="contador">0/54</span>
  </header>
  <section class="cantor">
    <div class="actual" id="actual">${cartaPorSalir()}</div>
    <div class="info">
      <div class="verso" id="verso">Prepárate…</div>
      <div class="progreso"><i id="barra-tiempo"></i></div>
      <div class="controles">
        ${vel.ms ? '<button class="btn chico" id="pausa">⏸ Pausa</button>' : '<button class="btn chico amarillo" id="siguiente">Siguiente carta ▶</button>'}
        <button class="btn chico" id="repetir" aria-label="Repetir la última carta">🔊 Repetir</button>
      </div>
      <div class="historial" id="historial" aria-label="Cartas cantadas"></div>
    </div>
  </section>
  <div class="rivales" id="rivales"></div>
  <section class="tablas" id="tablas">${r.jugador('yo').tablas.map((t, k) => tablaHTML(t, k, r)).join('')}</section>
  <div class="grito-wrap"><button class="btn grito" id="grito">¡LOTERÍA!</button></div>`;

  renderRivales();
  $('#salir').onclick = () => {
    const capa = dialogo(`<h2>¿Salir de la ronda?</h2><p>Perderás tu entrada al pozo.</p>
      <div class="acciones"><button class="btn primario" id="si-salir">Salir</button><button class="btn" id="no-salir">Seguir jugando</button></div>`);
    pausar(true);
    $('#si-salir', capa).onclick = () => {
      if (!J.terminado) registrarRonda();
      ir('inicio');
    };
    $('#no-salir', capa).onclick = () => { cerrarDialogo(); pausar(false); };
  };
  const bp = $('#pausa');
  if (bp) bp.onclick = () => pausar(!J.pausado);
  const bs = $('#siguiente');
  if (bs) bs.onclick = () => siguienteCarta();
  $('#repetir').onclick = () => {
    const u = J.ronda.ultima;
    if (u) voz.decir(CARTA_POR_ID[u].nombre, perfil.voz);
  };
  $('#grito').onclick = () => grita('yo');
  $('#tablas').addEventListener('click', alTocarCelda);
}

function cartaPorSalir() {
  return `<div class="carta" style="background:var(--rosa);display:grid;place-items:center;color:#fff;font-weight:800;font-size:28px">?</div>`;
}

function renderRivales() {
  const r = J.ronda;
  $('#rivales').innerHTML = r.jugadores
    .filter((j) => j.esBot)
    .map((j) => {
      const fuera = r.eliminados.has(j.id);
      const casi = !fuera && faltanPara(j) === 1;
      return `<span class="pill rival ${fuera ? 'fuera' : ''} ${casi ? 'casi' : ''}" title="${casi ? 'Le falta una' : ''}">${esc(j.nombre)}${casi ? ' · ¡le falta una!' : ''}</span>`;
    })
    .join('');
}

/** Cuántas cartas le faltan al bot para su figura más cercana. */
function faltanPara(j) {
  const r = J.ronda;
  const t = j.tablas[0];
  let min = 99;
  for (const conj of r.figuraActual.conjuntos) {
    const f = conj.filter((i) => !r.cantadasSet.has(t[i])).length;
    min = Math.min(min, f);
  }
  return min;
}

function programarSiguiente() {
  clearTimeout(J.timer);
  const ms = VELOCIDADES[config.velocidad].ms;
  const barraT = $('#barra-tiempo');
  if (!ms || !barraT) return;
  barraT.classList.remove('corre');
  void barraT.offsetWidth;
  barraT.style.animationDuration = ms + 'ms';
  barraT.classList.add('corre');
  J.timer = setTimeout(siguienteCarta, ms);
}

function siguienteCarta() {
  if (!J || J.pausado || J.terminado) return;
  const r = J.ronda;
  if (r.estado !== 'cantando') return;
  const id = r.cantar();
  if (id === null) return finDeRonda();
  const c = CARTA_POR_ID[id];
  $('#actual').innerHTML = cartaHTML(id);
  const texto = voz.textoCarta(c, perfil.modoVoz);
  const verso = perfil.modoVoz === 'verso' ? texto.replace(`¡${c.nombre}!`, '').trim() : '';
  $('#verso').innerHTML = `<b>${esc(c.nombre)}</b>${esc(verso)}`;
  $('#contador').textContent = `${r.cantadas.length}/54`;
  const h = $('#historial');
  h.insertAdjacentHTML('afterbegin', cartaHTML(id));
  sonido('carta');
  voz.decir(texto, perfil.voz);
  if (config.automarcado) refrescarTablas();
  actualizarBotonGrito();
  renderRivales();
  revisarBots();
  programarSiguiente();
}

function refrescarTablas(ganadorasPorTabla = {}) {
  const r = J.ronda;
  $('#tablas').innerHTML = r.jugador('yo').tablas.map((t, k) => tablaHTML(t, k, r, ganadorasPorTabla[k])).join('');
}

function actualizarBotonGrito() {
  const r = J.ronda;
  const b = $('#grito');
  if (!b) return;
  const fuera = r.eliminados.has('yo');
  b.disabled = fuera;
  b.textContent = fuera ? 'Fuera de esta ronda' : '¡LOTERÍA!';
  // Con automarcado avisamos cuando ya se puede gritar.
  b.classList.toggle('listo', !fuera && config.automarcado && !!r.completo('yo'));
}

function alTocarCelda(e) {
  const celda = e.target.closest('[data-celda]');
  if (!celda || !J || J.terminado) return;
  const tablaIdx = Number(celda.closest('[data-tabla]').dataset.tabla);
  const i = Number(celda.dataset.celda);
  const r = J.ronda;
  const res = r.marcar('yo', tablaIdx, i);
  if (!res.ok) {
    celda.classList.remove('error');
    void celda.offsetWidth;
    celda.classList.add('error');
    sonido('error');
    toast(res.motivo === 'atrasada' ? 'Con esta regla solo puedes marcar la última carta' : 'Esa carta todavía no sale');
    return;
  }
  celda.classList.toggle('marcada', res.marcada);
  celda.querySelector('.ficha')?.remove();
  if (res.marcada) {
    celda.insertAdjacentHTML('beforeend', fichaSVG());
    sonido('marca');
    vibrar(15);
  }
  actualizarBotonGrito();
}

function revisarBots() {
  const r = J.ronda;
  const [a, b] = DIFICULTAD[config.dificultad].reaccion;
  for (const j of r.jugadores) {
    if (!j.esBot || r.eliminados.has(j.id) || J.botTimers.has(j.id)) continue;
    if (r.completo(j.id)) {
      const t = setTimeout(() => {
        J.botTimers.delete(j.id);
        if (J && !J.terminado && J.ronda === r && r.puedeGritar(j.id) && r.completo(j.id)) grita(j.id);
      }, a + Math.random() * (b - a));
      J.botTimers.set(j.id, t);
    }
  }
}

function limpiarBots() {
  J.botTimers.forEach((t) => clearTimeout(t));
  J.botTimers.clear();
}

function pausar(si) {
  if (!J) return;
  J.pausado = si;
  const bp = $('#pausa');
  if (bp) bp.textContent = si ? '▶ Seguir' : '⏸ Pausa';
  const barraT = $('#barra-tiempo');
  if (si) {
    clearTimeout(J.timer);
    limpiarBots();
    barraT?.classList.remove('corre');
  } else {
    revisarBots();
    programarSiguiente();
  }
}

function grita(jugadorId) {
  const r = J.ronda;
  if (!r.puedeGritar(jugadorId)) return;
  clearTimeout(J.timer);
  limpiarBots();
  J.pausado = true;
  const nombre = r.jugador(jugadorId).nombre;
  const esYo = jugadorId === 'yo';
  voz.decir(esYo ? '¡Lotería!' : `¡Lotería! grita ${nombre}`, perfil.voz);
  vibrar([60, 40, 60]);
  dialogo(`<div class="grito-grande">¡Lotería!</div><p>${esYo ? 'Gritaste' : `Grita <b>${esc(nombre)}</b>`}… revisando la tabla</p>`, { cerrable: false });

  setTimeout(() => {
    const res = r.gritar(jugadorId);
    if (!res.valido) {
      if (esYo) {
        almacen.actualizar((p) => { p.stats.gritosEnFalso++; });
        sonido('error');
        const pen = { ninguna: 'Esta vez no hay castigo.', pierde_ronda: 'Quedas fuera de esta ronda.', paga_pozo: 'Pagas 5 fichas otra vez al pozo.' }[res.penalizacion];
        const capa = dialogo(`<h2>¡Grito en falso!</h2><p>Te falta completar la figura con cartas que ya salieron. ${pen}</p>
          <div class="acciones"><button class="btn primario" id="seguir">Seguir</button></div>`, { cerrable: false });
        $('#seguir', capa).onclick = () => {
          cerrarDialogo();
          actualizarBotonGrito();
          $('#pozo').textContent = `🫘 ${r.pozoEtapas[r.etapa]}`;
          J.pausado = false;
          if (r.eliminados.has('yo') && r.jugadores.every((j) => !j.esBot || r.eliminados.has(j.id))) return finDeRonda();
          revisarBots();
          programarSiguiente();
        };
      } else {
        cerrarDialogo();
        J.pausado = false;
        revisarBots();
        programarSiguiente();
      }
      return;
    }
    mostrarResultadoEtapa(res);
  }, 1300);
}

function mostrarResultadoEtapa(res) {
  const r = J.ronda;
  const { resultado, terminada } = res;
  const ganeYo = resultado.ganadores.some((g) => g.jugadorId === 'yo');
  const mias = {};
  resultado.ganadores.filter((g) => g.jugadorId === 'yo').forEach((g) => (mias[g.tablaIdx] = new Set(g.conjunto)));
  refrescarTablas(mias);
  if (resultado.desempate.length) {
    resultado.desempate.forEach((id) => $('#historial').insertAdjacentHTML('afterbegin', cartaHTML(id)));
    $('#contador').textContent = `${r.cantadas.length}/54`;
  }
  if (ganeYo) {
    confeti();
    sonido('gana');
    vibrar([100, 50, 100, 50, 200]);
  }
  const nombres = resultado.ganadores.map((g) => (g.jugadorId === 'yo' ? 'Tú' : r.jugador(g.jugadorId).nombre));
  const ganadorBot = resultado.ganadores.find((g) => g.jugadorId !== 'yo');
  const tablaBot = ganadorBot ? r.jugador(ganadorBot.jugadorId).tablas[ganadorBot.tablaIdx] : null;
  const empateTxt = resultado.empatados.length > 1
    ? `<p class="nota">Empate entre ${resultado.empatados.length}. ${resultado.desempate.length ? `Se desempató con ${resultado.desempate.map((id) => CARTA_POR_ID[id].nombre).join(', ')}.` : config.empate === 'sorteo' ? 'Se decidió por sorteo.' : 'Se reparte el premio.'}</p>`
    : '';
  const cuerpo = `
    <h2>${ganeYo ? '¡Ganaste!' : `Ganó ${esc(nombres.join(' y '))}`}</h2>
    <p>${esc(resultado.figura.nombre)} · Premio: <b>${resultado.premio}</b> fichas</p>
    ${empateTxt}
    ${tablaBot ? `<div class="rejilla" style="max-width:220px;margin:10px auto">${tablaBot.map((id, i) => `<div class="celda ${ganadorBot.conjunto.includes(i) ? 'ganadora' : ''}">${cartaHTML(id)}${ganadorBot.conjunto.includes(i) ? fichaSVG('frijol') : ''}</div>`).join('')}</div>` : ''}`;

  if (!terminada) {
    const capa = dialogo(`${cuerpo}<p>Sigue la ronda. Ahora va: <b>${esc(r.figuraActual.nombre)}</b> ${miniFig(r.figuraActual)}</p>
      <div class="acciones"><button class="btn primario" id="continuar">Seguir cantando</button></div>`, { cerrable: false });
    $('#continuar', capa).onclick = () => {
      cerrarDialogo();
      $('#fig-nombre').textContent = r.figuraActual.nombre;
      $('.barra .mini-fig').outerHTML = miniFig(r.figuraActual);
      $('#pozo').textContent = `🫘 ${r.pozoEtapas[r.etapa]}`;
      J.pausado = false;
      renderRivales();
      actualizarBotonGrito();
      revisarBots();
      programarSiguiente();
    };
    return;
  }
  finDeRonda(cuerpo);
}

function registrarRonda() {
  const r = J.ronda;
  J.terminado = true;
  const gane = r.premios.yo > 0;
  const neto = r.premios.yo - r.reglas.entrada - r.penalizaciones.yo;
  const suerte = r.cartasGanadoras('yo');
  almacen.actualizar((p) => {
    p.fichas = Math.max(0, p.fichas + neto);
    p.stats.rondas++;
    if (gane) {
      p.stats.ganadas++;
      p.stats.racha++;
      p.stats.mejorRacha = Math.max(p.stats.mejorRacha, p.stats.racha);
    } else {
      p.stats.racha = 0;
    }
    for (const id of suerte) p.stats.cartasSuerte[id] = (p.stats.cartasSuerte[id] || 0) + 1;
  });
  perfil = almacen.cargar();
  J.arrastre = r.arrastre;
  return { neto, gane };
}

function finDeRonda(cuerpo = null) {
  clearTimeout(J.timer);
  limpiarBots();
  const r = J.ronda;
  const { neto } = registrarRonda();
  const resumen = cuerpo || `<h2>Ronda desierta</h2><p>Se acabaron las cartas y nadie gritó. El pozo de <b>${r.arrastre}</b> fichas pasa a la siguiente ronda.</p>`;
  const capa = dialogo(`${resumen}
    <p class="nota">Tus fichas: ${neto >= 0 ? '+' : ''}${neto} → ${perfil.fichas}</p>
    <div class="acciones">
      <button class="btn primario" id="otra">Otra ronda (mismas tablas)</button>
      <button class="btn" id="cambiar">Cambiar tablas o reglas</button>
      <button class="btn" id="menu">Menú</button>
    </div>`, { cerrable: false });
  const conAnuncio = async (destino) => {
    cerrarDialogo();
    await anuncios.alTerminarRonda(anuncioSimulado);
    perfil = almacen.cargar();
    ir(destino);
  };
  $('#otra', capa).onclick = () => conAnuncio('juego');
  $('#cambiar', capa).onclick = () => conAnuncio('nueva');
  $('#menu', capa).onclick = () => conAnuncio('inicio');
}

function detenerJuego() {
  if (!J) return;
  clearTimeout(J.timer);
  limpiarBots();
}

// ---------------------------------------------------------------- modo solo cantor
// Para jugar con tablas de cartón: un toque para empezar y se termina cuando quieran.

let K = null;
const VEL_CANTOR = { lento: 'Lento', normal: 'Normal', rapido: 'Rápido', manual: 'Manual' };

function nuevaBarajaCantor() {
  const vel = K?.velocidad || perfil.velCantor || 'normal';
  K = { baraja: barajar(IDS), i: 0, timer: null, pausado: false, velocidad: vel, inicio: 0 };
}

pantallas.cantor = () => {
  nuevaBarajaCantor();
  renderCantorInicio();
};

function renderCantorInicio() {
  $app.innerHTML = `
  ${barra('Solo cantor')}
  <section class="cantor-inicio">
    <div class="abanico" aria-hidden="true">
      ${[35, 43, 48].map((id, k) => `<div style="transform:rotate(${(k - 1) * 10}deg) translateY(${Math.abs(k - 1) * 8}px)">${cartaHTML(id)}</div>`).join('')}
    </div>
    <p class="subtitulo">Repartan sus tablas de cartón y sus frijoles.<br>La app canta las cartas y lleva la cuenta.</p>
    <button class="btn grito" id="k-empezar">¡Empezar a cantar!</button>
    <div class="cantor-vel">
      <span class="nota">Velocidad</span>
      ${opciones('k-vel', VEL_CANTOR, K.velocidad)}
    </div>
  </section>`;
  $app.querySelectorAll('[data-opt="k-vel"]').forEach((b) => (b.onclick = () => {
    K.velocidad = b.dataset.val;
    almacen.actualizar((p) => { p.velCantor = K.velocidad; });
    renderCantorInicio();
  }));
  $('#k-empezar').onclick = () => {
    K.inicio = Date.now();
    voz.decir('¡Se va y se corre!', perfil.voz);
    renderCantor();
    K.timer = setTimeout(() => cantarK(), 1400);
  };
}

function renderCantor() {
  const salidas = new Set(K.baraja.slice(0, K.i));
  const actual = K.i ? K.baraja[K.i - 1] : null;
  const manual = K.velocidad === 'manual';
  $app.innerHTML = `
  <header class="barra">
    <h2>Solo cantor</h2>
    <span class="pill" id="k-cuenta">${K.i}/54</span>
    <button class="btn chico" id="k-terminar">Terminar</button>
  </header>
  <div class="cantor-solo">
    <div>
      <div class="grande" id="k-carta">${actual ? cartaHTML(actual) : cartaPorSalir()}</div>
      <p class="verso" style="text-align:center" id="k-verso">${actual ? `<b>${esc(CARTA_POR_ID[actual].nombre)}</b>` : '¡Se va y se corre!'}</p>
      <div class="progreso" style="margin:8px 0"><i id="k-barra"></i></div>
      <div class="controles" style="justify-content:center">
        ${manual ? '' : `<button class="btn ${K.pausado ? 'primario' : ''}" id="k-play">${K.pausado ? '▶ Seguir' : '⏸ Pausa'}</button>`}
        <button class="btn amarillo" id="k-sig">Siguiente ▶</button>
        <button class="btn icono" id="k-rep" aria-label="Repetir la carta">🔊</button>
      </div>
      <button class="btn grito" id="k-loteria" style="margin-top:12px">¡Alguien gritó Lotería!</button>
      <div style="margin-top:12px">${opciones('k-vel', VEL_CANTOR, K.velocidad)}</div>
    </div>
    <div>
      <h3 style="margin:4px 0 8px">Cartas que ya salieron</h3>
      <div class="baraja-grid">${IDS.map((id) => cartaHTML(id, salidas.has(id) ? 'salio' : '')).join('')}</div>
    </div>
  </div>`;
  const bp = $('#k-play');
  if (bp) bp.onclick = () => {
    K.pausado = !K.pausado;
    if (K.pausado) clearTimeout(K.timer);
    renderCantor();
    if (!K.pausado) programarK();
  };
  $('#k-sig').onclick = () => { clearTimeout(K.timer); cantarK(); };
  $('#k-rep').onclick = () => actual && voz.decir(voz.textoCarta(CARTA_POR_ID[actual], perfil.modoVoz), perfil.voz);
  $('#k-terminar').onclick = () => terminarCantor('¿Terminar la partida?');
  $('#k-loteria').onclick = verificarCantor;
  $app.querySelectorAll('[data-opt="k-vel"]').forEach((b) => (b.onclick = () => {
    K.velocidad = b.dataset.val;
    almacen.actualizar((p) => { p.velCantor = K.velocidad; });
    clearTimeout(K.timer);
    if (K.velocidad === 'manual') K.pausado = false;
    renderCantor();
    if (!K.pausado && K.velocidad !== 'manual') programarK();
  }));
}

function cantarK() {
  if (!K) return;
  if (K.i >= 54) return terminarCantor('Se acabaron las cartas', true);
  K.i++;
  const id = K.baraja[K.i - 1];
  renderCantor();
  const c = CARTA_POR_ID[id];
  const texto = voz.textoCarta(c, perfil.modoVoz);
  const verso = texto.replace(`¡${c.nombre}!`, '').trim();
  if (perfil.modoVoz === 'verso') $('#k-verso').innerHTML = `<b>${esc(c.nombre)}</b>${esc(verso)}`;
  voz.decir(texto, perfil.voz);
  sonido('carta');
  if (!K.pausado && K.velocidad !== 'manual') programarK();
}

function programarK() {
  clearTimeout(K.timer);
  const ms = VELOCIDADES[K.velocidad].ms;
  if (!ms) return;
  const b = $('#k-barra');
  if (b) {
    b.classList.remove('corre');
    void b.offsetWidth;
    b.style.animationDuration = ms + 'ms';
    b.classList.add('corre');
  }
  K.timer = setTimeout(() => cantarK(), ms);
}

/** Alguien gritó: se pausa y se muestran las cartas cantadas para revisar su tabla. */
function verificarCantor() {
  clearTimeout(K.timer);
  const estabaPausado = K.pausado;
  K.pausado = true;
  $('#k-barra')?.classList.remove('corre');
  voz.decir('¡Lotería! A revisar la tabla.', perfil.voz);
  vibrar([60, 40, 60]);
  const salidas = K.baraja.slice(0, K.i);
  const capa = dialogo(`
    <div class="grito-grande" style="font-size:48px">¡Lotería!</div>
    <p>Revisen la tabla con las ${salidas.length} cartas que han salido:</p>
    <div class="baraja-grid" style="grid-template-columns:repeat(auto-fill,minmax(48px,1fr))">${salidas.map((id) => cartaHTML(id, 'salio')).join('')}</div>
    <div class="acciones">
      <button class="btn verde" id="k-gano">✓ Sí ganó</button>
      <button class="btn" id="k-falso">✗ Fue en falso, seguir cantando</button>
    </div>`, { cerrable: false });
  $('#k-gano', capa).onclick = () => {
    confeti();
    sonido('gana');
    terminarCantor('¡Tenemos ganador!', true);
  };
  $('#k-falso', capa).onclick = () => {
    cerrarDialogo();
    K.pausado = estabaPausado;
    renderCantor();
    if (!K.pausado && K.velocidad !== 'manual') programarK();
  };
}

/** Termina cuando ellos quieran. `final` = ya terminó, solo ofrecer otra partida. */
function terminarCantor(titulo, final = false) {
  clearTimeout(K.timer);
  const estabaPausado = K.pausado;
  K.pausado = true;
  $('#k-barra')?.classList.remove('corre');
  const min = K.inicio ? Math.max(1, Math.round((Date.now() - K.inicio) / 60000)) : 0;
  const capa = dialogo(`
    <h2>${esc(titulo)}</h2>
    <p>Salieron <b>${K.i}</b> de 54 cartas${min ? ` en ${min} min` : ''}.</p>
    <div class="acciones">
      <button class="btn primario" id="k-otra">Otra partida</button>
      ${final ? '' : '<button class="btn" id="k-volver">Seguir cantando</button>'}
      <button class="btn" id="k-menu">Salir al menú</button>
    </div>`, { cerrable: false });
  $('#k-otra', capa).onclick = () => {
    cerrarDialogo();
    nuevaBarajaCantor();
    K.inicio = Date.now();
    voz.decir('¡Se va y se corre!', perfil.voz);
    renderCantor();
    K.timer = setTimeout(() => cantarK(), 1400);
  };
  const v = $('#k-volver', capa);
  if (v) v.onclick = () => {
    cerrarDialogo();
    K.pausado = estabaPausado;
    renderCantor();
    if (!K.pausado && K.velocidad !== 'manual') programarK();
  };
  $('#k-menu', capa).onclick = () => ir('inicio');
}

function detenerCantor() {
  if (K) clearTimeout(K.timer);
  K = null;
}

// ---------------------------------------------------------------- imprimir

let imprimibles = [];
pantallas.imprimir = () => {
  if (!imprimibles.length) imprimibles = generarTablas(6, IDS);
  $app.innerHTML = `
  ${barra('Tablas para imprimir')}
  <section class="seccion no-print">
    <div class="fila"><span>¿Cuántas tablas?</span>${paso('imp', imprimibles.length, 1, 16)}</div>
    <p class="nota">Cada tabla es distinta y comparten pocas cartas en la misma posición. Usa “Imprimir” y elige “Guardar como PDF” para descargarlas.</p>
    <div class="controles"><button class="btn primario" id="imprimir">🖨 Imprimir o guardar PDF</button><button class="btn" id="regenerar">Generar otras</button></div>
  </section>
  <div class="imprimibles">${imprimibles.map((t, k) => `<div class="imprimible"><h4>¡Lotería! · Tabla ${k + 1}</h4><div class="rejilla">${t.map((id) => cartaHTML(id)).join('')}</div></div>`).join('')}</div>`;
  $app.querySelectorAll('[data-paso]').forEach((b) => (b.onclick = () => {
    const n = imprimibles.length + Number(b.dataset.d);
    imprimibles = n < imprimibles.length ? imprimibles.slice(0, n) : [...imprimibles, ...generarTablas(1, IDS, imprimibles)];
    pantallas.imprimir();
  }));
  $('#imprimir').onclick = () => window.print();
  $('#regenerar').onclick = () => { imprimibles = generarTablas(imprimibles.length, IDS); pantallas.imprimir(); };
};

// ---------------------------------------------------------------- estadísticas

pantallas.stats = () => {
  const s = perfil.stats;
  const pct = s.rondas ? Math.round((s.ganadas / s.rondas) * 100) : 0;
  const suerte = Object.entries(s.cartasSuerte).sort((a, b) => b[1] - a[1]).slice(0, 6);
  $app.innerHTML = `
  ${barra('Estadísticas')}
  <div class="kpis">
    <div class="kpi"><b>${s.rondas}</b><span>Rondas jugadas</span></div>
    <div class="kpi"><b>${s.ganadas}</b><span>Ganadas (${pct}%)</span></div>
    <div class="kpi"><b>${s.racha}</b><span>Racha actual</span></div>
    <div class="kpi"><b>${s.mejorRacha}</b><span>Mejor racha</span></div>
    <div class="kpi"><b>${perfil.fichas}</b><span>Fichas</span></div>
    <div class="kpi"><b>${s.gritosEnFalso}</b><span>Gritos en falso</span></div>
  </div>
  <section class="seccion">
    <h3>Tus cartas de la suerte</h3>
    ${suerte.length ? `<div class="suerte">${suerte.map(([id, n]) => `<div>${cartaHTML(Number(id))}<p class="nota" style="text-align:center;margin:2px 0">${n}×</p></div>`).join('')}</div>` : '<p class="nota">Gana una ronda para descubrirlas.</p>'}
  </section>`;
};

// ---------------------------------------------------------------- ajustes

pantallas.ajustes = () => {
  const vocesOpc = Object.fromEntries(Object.entries(voz.VOCES).map(([k, v]) => [k, (v.premium && !perfil.premium ? '🔒 ' : '') + v.nombre]));
  const fichasOpc = Object.fromEntries(Object.entries(FICHAS).map(([k, v]) => [k, (v.premium && !perfil.premium ? '🔒 ' : '') + v.nombre]));
  $app.innerHTML = `
  ${barra('Ajustes')}
  <section class="seccion">
    <h3>Tu nombre</h3>
    <input id="nombre" class="opcion" style="width:100%" maxlength="20" value="${esc(perfil.nombre)}">
  </section>
  <section class="seccion">
    <h3>Cantor</h3>
    <div class="fila"><span>Voz</span>${opciones('voz', vocesOpc, perfil.voz)}</div>
    <div class="fila"><span>Qué canta</span>${opciones('modoVoz', { nombre: 'Solo el nombre', verso: 'Verso y nombre' }, perfil.modoVoz)}</div>
    ${voz.disponible() ? '' : '<p class="nota">Este navegador no tiene voz; las cartas se muestran escritas.</p>'}
    <button class="btn chico" id="probar-voz">🔊 Probar voz</button>
  </section>
  <section class="seccion">
    <h3>Fichas</h3>
    ${opciones('ficha', fichasOpc, perfil.ficha)}
    <div style="width:56px;height:56px;position:relative;margin-top:10px">${fichaSVG()}</div>
  </section>
  <section class="seccion">
    <h3>Pantalla y sonido</h3>
    <div class="fila"><span>Tema</span>${opciones('tema', { auto: 'Automático', light: 'Claro', dark: 'Oscuro' }, perfil.tema)}</div>
    <div class="fila"><span>Sonidos</span><input type="checkbox" class="switch" data-chk="sonido" ${perfil.sonido ? 'checked' : ''}></div>
    <div class="fila"><span>Vibración</span><input type="checkbox" class="switch" data-chk="vibracion" ${perfil.vibracion ? 'checked' : ''}></div>
  </section>
  <section class="seccion">
    <h3>Figuras personalizadas ${perfil.premium ? '' : '<span class="candado">🔒 Premium</span>'}</h3>
    ${perfil.figurasPersonalizadas.length ? `<div class="opciones">${perfil.figurasPersonalizadas.map((f) => `<span class="opcion">${miniFig(figuraPersonalizada(f.celdas))} ${esc(f.nombre)} <button class="btn chico" data-borrar="${f.id}" aria-label="Borrar">✕</button></span>`).join('')}</div>` : '<p class="nota">Aún no tienes figuras propias.</p>'}
    <button class="btn chico" id="nueva-fig" style="margin-top:8px">＋ Dibujar figura</button>
  </section>
  <section class="seccion">
    <h3>Datos</h3>
    <button class="btn chico" id="borrar-todo">Borrar estadísticas y empezar de cero</button>
  </section>`;
  $('#nombre').onchange = (e) => { almacen.actualizar((p) => { p.nombre = e.target.value.trim() || 'Tú'; }); perfil = almacen.cargar(); };
  $app.querySelectorAll('[data-opt]').forEach((b) => (b.onclick = () => {
    const k = b.dataset.opt, v = b.dataset.val;
    if ((k === 'voz' && voz.VOCES[v].premium && !perfil.premium) || (k === 'ficha' && FICHAS[v].premium && !perfil.premium)) {
      return ofrecerPremium(k === 'voz' ? 'Todas las voces del cantor vienen con Premium.' : 'Las fichas especiales vienen con Premium.');
    }
    almacen.actualizar((p) => { p[k] = v; });
    perfil = almacen.cargar();
    aplicarTema();
    pantallas.ajustes();
  }));
  $app.querySelectorAll('[data-chk]').forEach((c) => (c.onchange = () => { almacen.actualizar((p) => { p[c.dataset.chk] = c.checked; }); perfil = almacen.cargar(); }));
  $app.querySelectorAll('[data-borrar]').forEach((b) => (b.onclick = () => {
    almacen.actualizar((p) => { p.figurasPersonalizadas = p.figurasPersonalizadas.filter((f) => f.id !== b.dataset.borrar); });
    perfil = almacen.cargar();
    if (config.figura === b.dataset.borrar) config.figura = 'cualquier_linea';
    pantallas.ajustes();
  }));
  $('#probar-voz').onclick = () => voz.decir(voz.textoCarta(CARTA_POR_ID[1], perfil.modoVoz), perfil.voz);
  $('#nueva-fig').onclick = () => (perfil.premium ? editorFigura(() => pantallas.ajustes()) : ofrecerPremium('Las figuras personalizadas son de Premium.'));
  $('#borrar-todo').onclick = () => {
    const capa = dialogo(`<h2>¿Borrar todo?</h2><p>Se reinician fichas, estadísticas y ajustes.</p>
      <div class="acciones"><button class="btn primario" id="si">Borrar</button><button class="btn" id="no">Cancelar</button></div>`);
    $('#si', capa).onclick = () => { perfil = almacen.reiniciar(); aplicarTema(); ir('inicio'); };
    $('#no', capa).onclick = cerrarDialogo;
  };
};

// ---------------------------------------------------------------- premium

pantallas.premium = () => {
  $app.innerHTML = `
  ${barra('Premium')}
  <section class="seccion" style="text-align:center">
    <h1 class="logo" style="font-size:52px">★ Premium</h1>
    <ul class="lista-premium">
      <li>Sin anuncios entre rondas (y en modo fiesta, toda la sala sin anuncios)</li>
      <li>Todas las voces del cantor: feria, abuelita y más</li>
      <li>Figuras personalizadas dibujadas por ti</li>
      <li>Hasta 4 tablas por ronda</li>
      <li>Fichas especiales y temas</li>
      <li>Salas más grandes (cuando salga el modo en línea)</li>
    </ul>
    <div class="precios">
      <div class="precio"><span>Mensual</span><b>$39</b><span class="nota">MXN</span></div>
      <div class="precio"><span>Anual</span><b>$299</b><span class="nota">MXN</span></div>
      <div class="precio"><span>De por vida</span><b>$499</b><span class="nota">MXN</span></div>
    </div>
    <p class="nota">Precios de ejemplo. En la app publicada el pago se hace con Google Play / App Store.</p>
    <button class="btn ${perfil.premium ? '' : 'morado'} bloque" id="toggle-premium">${perfil.premium ? 'Desactivar Premium (demo)' : 'Activar Premium (demo, sin cobro)'}</button>
  </section>
  <section class="seccion">
    <h3>Paquetes temáticos <span class="pill">Próximamente</span></h3>
    <p class="nota">Barajas de futbol, Navidad, Día de Muertos y educativas (inglés, química), como compra individual.</p>
  </section>`;
  $('#toggle-premium').onclick = () => {
    almacen.actualizar((p) => { p.premium = !p.premium; if (!p.premium) { p.voz = voz.VOCES[p.voz]?.premium ? 'neutra' : p.voz; p.ficha = FICHAS[p.ficha]?.premium ? 'frijol' : p.ficha; } });
    perfil = almacen.cargar();
    toast(perfil.premium ? '¡Premium activado (demo)!' : 'Premium desactivado');
    pantallas.premium();
  };
};

// ---------------------------------------------------------------- arranque

aplicarTema();
ir('inicio');

if ('serviceWorker' in navigator && location.protocol === 'https:' && !location.hostname.endsWith('claude.ai') && !location.hostname.endsWith('claudeusercontent.com')) {
  navigator.serviceWorker.register('sw.js').catch(() => {});
}
