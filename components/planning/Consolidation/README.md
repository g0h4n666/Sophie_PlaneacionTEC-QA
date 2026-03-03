# Modulo Consolidacion (Frontend)

Este directorio encapsula la ventana emergente de consolidacion (Paso 4 planeacion):

- `ConsolidacionWorkspace.tsx`: UI del modal fullscreen y comportamiento de interaccion.
- `workspaceStore.ts`: estado de UI/sesion del workspace (escenario seleccionado, proyecto seleccionado, colapso de panel).
- `api.ts`: acceso a endpoints backend de consolidacion.
- `logic.ts`: logica de priorizacion, normalizacion de datos y utilidades numericas/formato.
- `types.ts`: tipos compartidos del modulo.
- `schema.ts`: validacion del formulario de escenarios.
- `consolidacion.css`: estilos propios del modulo.
- `index.ts`: punto de entrada del modulo.

`Step6Consolidacion.tsx` en `components/planning/` actua como wrapper para no romper integracion existente.
