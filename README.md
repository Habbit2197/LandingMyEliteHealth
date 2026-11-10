# MyEliteHealth · Landing v1.1.2

Web nueva en Astro 5, sin frameworks de interfaz: HTML estático y animaciones en JavaScript sin librerías.
Paleta de azules noche y eléctricos con el rojo corazón de los iconos de la app.

## Arrancar

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # genera dist/
npm run preview    # sirve dist/ para revisarlo
```

## Antes de publicar

1. **`src/config.ts`**: pon el enlace del App Store en `appStoreURL`. Mientras esté vacío, todos los botones bajan a «Descargar» y el texto dice «Muy pronto en el App Store».
2. **`astro.config.mjs`**: cambia `site` por el dominio final.
3. **Capturas**: ver abajo.
4. **Páginas legales** (`src/pages/legal`, `src/pages/en/legal`): copiadas tal cual de la web anterior. Deben pasar revisión legal antes de publicar.

## Capturas

Van en `public/capturas/`, con exactamente estos nombres. Formatos admitidos: `.webp`, `.png` y `.jpg`. Son capturas de iPhone en vertical; recomendado 1290 × 2796 o 640 de ancho.
Si falta alguna, la web compila igual y enseña un hueco rayado con su nombre.

| Nombre | Qué debe enseñar | Dónde sale |
|---|---|---|
| `padel-partido` | Detalle de un partido (cabecera con resultado) | Hero, centro |
| `padel-hub` | Inicio del módulo de pádel | Hero y relato 1 (marcador) |
| `padel-panel` | Panel de pádel / evolución | Hero y relato 7 |
| `padel-golpes` | Golpes de la sesión | Relato 2 |
| `padel-momentum` | Momentum y filtros | Relato 3 |
| `padel-fisico` | Físico y carga del partido | Relato 4 |
| `padel-lado` | Drive frente a revés | Relato 5 |
| `padel-companeros` | Con quién juegas mejor | Relato 6 |
| `padel-compartir` | QR o tarjeta para compartir (**falta**) | Relato 8 |
| `golf` | Módulo de golf | Deportes |
| `basket` | Módulo de baloncesto | Deportes |
| `racing` | Módulo de racing | Deportes |
| `recuperacion` | Recuperación y carga | Bienestar |
| `movilidad` | Movilidad | Bienestar |

**Sacadas de la grabación de pantalla (10 nov):** `inicio`, `actividad`, `pasos`, `bienestar`, `bienestar-mental`, `nutricion`, `zonas`, `zonas-trimp`, `curva-recuperacion`, `hrv`, `recovery-stack`, `alineacion`, `alertas`, `modulos`, `herramientas`, `entrenos`, `ciclismo`, `ciclismo-fc`, `splits` y `comparar`. Salen en «Tu día» (carril deslizable), «Entrenos», la portada y «Bienestar».

Las de pádel, golf, baloncesto y racing son todavía las de la web anterior. Sustitúyelas por las nuevas con el mismo nombre.

## Animación de entrada

Pon el archivo en `public/img/` como `intro.webm`, `intro.mp4` o `intro.gif`. Se muestra a pantalla completa sobre fondo blanco al entrar, una vez por visita, con botón «Saltar». No aparece si el sistema tiene activado «Reducir movimiento». Si no hay archivo, no sale nada.

## Publicar en Cloudflare Pages

Si el repositorio es privado, Cloudflare puede no verlo desde «Connect to Git». En ese caso se publica con wrangler:

```bash
npx wrangler login                 # solo la primera vez
npm run deploy                     # build + wrangler pages deploy (proyecto «landing-myelitehealth»)
```

## Estructura

```
src/
  config.ts              enlaces, versión y precios
  pages/index.astro      la landing completa (contenido en arrays al inicio del fichero)
  components/            Screen (marco de iPhone), Icon, StoreButton, Heading, Footer
  styles/global.css      paleta y estilos
  scripts/main.js        animaciones: revelado, contadores, relato con captura fija,
                         momentum interactivo, filtros, pista, pestañas, reloj animado
public/
  capturas/              capturas de la app
  img/                   iconos de los deportes y og.jpg
```

## Reglas del contenido

- Nada inventado: los gráficos interactivos usan un partido de ejemplo y lo dicen («Ejemplo»).
- La comparativa es por tipo de app, sin nombrar productos.
- No usar «dolor», «lesión» ni «rehabilitación». Es una app de deporte y bienestar, no médica.
