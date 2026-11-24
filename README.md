# ¡Lotería! — prototipo jugable

App web móvil (HTML, CSS y JavaScript con módulos ES, sin paso de build) lista para envolverse con Capacitor y publicarse en Google Play y App Store.

## Correr
- `npm start` (o cualquier servidor estático en esta carpeta) y abre http://localhost:5173
- `npm test` corre las pruebas del motor (Node 20+)

## Qué incluye
- 54 cartas con ilustraciones inspiradas en juguetes de barro (`assets/barro`) y versos originales (`js/data`). Las cartas 26 y 38 son El Ajolote y El Colibrí.
- Motor de ronda (`js/engine/ronda.js`): 16 figuras + personalizadas, modo por etapas, verificación de gritos, grito en falso con penalización, empates (repartir, desempate, sorteo), varias tablas, ronda desierta con arrastre del pozo.
- Dos modos en el inicio: **Jugar en el celular** (contra rivales simulados) y **Solo cantor** para tablas físicas (empieza con un toque, botón "¡Alguien gritó Lotería!" para revisar las cartas que salieron y "Terminar" en cualquier momento).
- Además: tablas imprimibles (PDF vía imprimir), estadísticas, ajustes, voz del cantor (texto a voz), fichas personalizables, tema claro/oscuro, funciona sin internet (service worker).
- Monetización simulada (`js/services/ads.js`): intersticial al terminar ronda con límite (1 cada 2 rondas y 3 min), anuncio con recompensa (3.ª tabla 30 min), Premium.

## Siguiente fase
1. Capacitor + AdMob (implementar `proveedor` en ads.js) + compras dentro de la app (RevenueCat o billing nativo).
2. Modo fiesta y en línea: servidor con WebSockets o Supabase/Firebase; barajado y verificación del lado del servidor.
3. Voces grabadas por carta.
