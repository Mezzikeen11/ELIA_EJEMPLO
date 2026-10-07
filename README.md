# ELIA

Torre de control frontend para la distribución pública de medicamentos. React, Vite, TypeScript, React Router, CSS y Lucide React. Inter se sirve localmente.

## Ejecutar

```sh
npm install
npm run dev
```

Abrir la dirección que muestra Vite (normalmente http://127.0.0.1:5173).

```sh
npm run build
npm run preview
```

`build` verifica TypeScript y genera la versión de producción en `dist/`.

En un entorno restringido que impida a esbuild leer carpetas superiores, se puede compilar y previsualizar con Node 22.18 o posterior:

```sh
npm run build -- --configLoader native
npm run preview -- --configLoader native
```

Esta es la configuración usada para verificar ELIA en el entorno de Codex.

## Uso

- La Torre de control incluye cinco indicadores, seis operaciones, búsqueda y filtros, actividad diaria o semanal y cumplimiento por operador.
- Estado logístico y excepción son campos independientes. El filtro permite elegir En tránsito, Llegada o Entregado.
- Entregas hoy y Retrasadas enlazan a Operaciones; Con incidencia enlaza a Incidencias. Ver todas abre Operaciones.
- Seleccionar una fila o su folio abre el resumen. Se cierra con el botón, Escape o clic fuera. El foco queda dentro del drawer y vuelve al elemento anterior al cerrarlo.
- Operaciones, Incidencias y Operadores tienen rutas propias y pantallas de próxima etapa.
- En tablet la tabla se desplaza dentro de su contenedor. En pantallas pequeñas la navegación se abre desde el menú superior.

## Estructura

`src/data.ts`: datos locales tipados, estados logísticos y categorías de excepción.

`src/App.tsx`: layout, rutas, indicadores, tabla, drawer y visualizaciones reutilizables.

`src/styles.css`: sistema visual y adaptación responsive.

Todos los datos y filtros viven en memoria y se restablecen al recargar. No hay backend, autenticación, APIs, GPS ni almacenamiento. Los datos están precargados localmente; las fechas e indicadores son fijos y no se sincronizan con servicios externos.
