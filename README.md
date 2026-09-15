# Landing page — SINC Maquinarias

Landing estática (HTML/CSS/JS puro, sin build) para mostrar Equilimpia y
Biorecolector 4500, con botón de contacto por WhatsApp. No incluye precios
ni venta online.

## Estructura

```
site/
├── index.html
├── assets/
│   ├── css/styles.css
│   ├── js/main.js
│   ├── img/        (logos, fotos de producto)
│   └── video/       (videos reales del Biorecolector 4500 en funcionamiento)
└── README.md
```

## Ver en local

```bash
cd site
python3 -m http.server 8080
```

Y abrir http://localhost:8080

## Publicar en GitHub Pages

Opción simple, sin dominio propio todavía:

1. Subir esta carpeta `site/` a un repositorio de GitHub (puede ser este
   mismo repo u otro nuevo solo para la web).
2. En GitHub → Settings → Pages, elegir la rama y la carpeta `/site`
   (o mover el contenido a `/docs` o a la raíz de un repo dedicado, según
   la opción que ofrezca GitHub Pages).
3. GitHub va a publicar la página en `https://<usuario>.github.io/<repo>/`.
4. Cuando se compre un dominio propio (ej. sincmaquinarias.com.ar), se
   configura como "Custom domain" en esa misma sección de Settings → Pages.

## Pendientes de contenido (marcados en la página)

- Video real de **Equilimpia** en funcionamiento (hoy solo hay foto de
  estudio del producto). Está dejado un espacio placeholder en la sección
  de Equilimpia para agregarlo apenas esté disponible.
- Confirmar con SINC qué casos de éxito adicionales al de Haras Los
  Turfistas son reales, para poder nombrarlos con cliente y cifras
  verificadas en la sección "Casos de aplicación".
