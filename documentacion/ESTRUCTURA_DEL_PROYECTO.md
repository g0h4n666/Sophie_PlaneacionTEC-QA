# Sophie Platform - Documentación de Arquitectura y Archivos

Esta documentación detalla la estructura del código fuente de la plataforma Sophie, orquestador de planeación tecnológica y financiera.

## 📁 Raíz del Proyecto

| Archivo | Responsabilidad |
| :--- | :--- |
| `App.tsx` | Componente raíz. Gestiona el estado global (fases de la app, usuario, tema, permisos) y el enrutamiento lógico entre módulos. |
| `index.tsx` | Punto de entrada de React. Monta la aplicación en el DOM. |
| `types.ts` | Definiciones de tipos de TypeScript globales, enums de fases, interfaces de usuario, presupuesto y casos de negocio. |
| `index.html` | Plantilla base HTML con configuración de Tailwind CSS y fuentes. |

## 📁 Servicios (`/services`)

| Archivo | Responsabilidad |
| :--- | :--- |
| `services/gemini.ts` | Integración con Google Gemini AI. Realiza auditorías inteligentes de gastos y genera insights predictivos. |
| `services/dbService.ts` | Capa de abstracción para la persistencia. Simula la conexión con el motor de base de datos MySQL corporativo. |

## 📁 Autenticación (`/components/auth`)

| Archivo | Responsabilidad |
| :--- | :--- |
| `components/Login.tsx` | Interfaz de inicio de sesión con validación de credenciales demo y sistema de roles (RBAC). |

## 📁 Módulo de Planeación CAPEX (`/components/planning`)

Este es el módulo más complejo, dividido en 6 pasos secuenciales de gobernanza.

| Archivo | Responsabilidad |
| :--- | :--- |
| `components/Planning.tsx` | Contenedor principal del flujo de planeación. Orquesta la navegación entre los 6 pasos y gestiona el estado de las iniciativas. |
| `components/planning/ProjectFormModal.tsx` | Modal maestro para el registro de iniciativas. Incluye lógica de Matriz de Riesgo Técnico y validación de campos obligatorios. |
| `components/planning/Step1Identificacion.tsx` | Paso 1: Listado de demanda operativa. Permite registrar, editar y eliminar iniciativas. |
| `components/planning/Step2Clasificacion.tsx` | Paso 2: Clasificación de naturaleza (Fijo/Variable) y evaluación estratégica de prioridad. |
| `components/planning/Step3Soporte.tsx` | Paso 3: Gestión de documentación y modelos de soporte técnico. |
| `components/planning/Step4Validacion.tsx` | Paso 4: Interfaz para el Responsable de Planeación para validar requisitos mínimos. |
| `components/planning/Step5PressureTest.tsx` | Paso 5: Revisión crítica de coherencia financiera (VPN/I) y checklist de validación. |
| `components/planning/Step6Consolidacion.tsx` | Paso 6: Cierre del ciclo de planeación y preparación para persistencia en SAP. |
| `components/planning/BusinessCaseForm.tsx` | Formulario detallado para el flujo de caja proyectado, indicadores financieros y riesgos de inversión. |

## 📁 Módulo de Seguimiento 0+n (`/components/followup`)

Gestiona la ejecución real frente a lo planeado.

| Archivo | Responsabilidad |
| :--- | :--- |
| `components/FollowUp.tsx` | Contenedor principal de seguimiento. Gestión de visibilidad de líneas de portafolio. |
| `components/followup/Step1Plan.tsx` | Distribución mensual del presupuesto aprobado (Línea Base). |
| `components/followup/Step2Validacion.tsx` | Control de hitos técnicos y estados de revisión operativa. |
| `components/followup/Step3Liberacion.tsx` | Interfaz de envío a SAP para generación de órdenes de compra. |
| `components/followup/Step4Seguimiento.tsx` | Visualización de avance real vs proyectado y estados de SOLPED/PO/GR. |
| `components/followup/Step5Ajustes.tsx` | Gestión de traslados presupuestales y repriorización. |

## 📁 Módulos Administrativos y de Inteligencia

| Archivo | Responsabilidad |
| :--- | :--- |
| `components/Dashboard.tsx` | Métricas de alto nivel, curvas S de ejecución y distribución de capital por dirección. |
| `components/TechWatch.tsx` | Vigilancia tecnológica. Radar de tendencias y workflow de promoción a Casos de Negocio. |
| `components/UserManagement.tsx` | Gestión de usuarios y Matriz de Permisos granular por rol. |
| `components/BudgetParameters.tsx` | Configuración de variables globales (Vigencia, TRM, IVA, Techos operativos). |
| `components/DatabaseSettings.tsx` | Configuración técnica de conexión a MySQL y consola de logs. |
| `components/NewPurchaseOrders.tsx` | Gestión operativa de T-Unitarios y órdenes de compra activas. |
| `components/Audit.tsx` | Módulo de análisis financiero asistido por IA (Gemini). |

---
*Sophie v2.0 - Dirección de Planeación Tecnológica*