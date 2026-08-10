# LoginMaster - Sistema Administrativo

LoginMaster es un sistema administrativo desarrollado en **HTML, CSS y JavaScript** que permite gestionar clientes, productos y proveedores, con autenticación de usuarios y roles diferenciados.

---

## 🚀 Características principales
- **Autenticación de usuarios** con almacenamiento en `localStorage`.
- **Roles**:
  - **Administrador**: acceso completo a CRUD y todos los indicadores.
  - **Operador**: acceso restringido, sin permisos de eliminación y con indicadores básicos.
- **Dashboard**:
  - Contadores dinámicos de clientes, productos y proveedores.
  - Indicadores visuales con **Chart.js**:
    - Clientes registrados (barra).
    - Productos en inventario (pie).
    - Proveedores activos (doughnut).
  - Indicadores avanzados (solo Administrador):
    - Evolución de clientes en el tiempo (línea).
    - Productos por categoría (barras apiladas).
    - % de proveedores activos (gauge/doughnut).
- **Diseño responsive** adaptado a escritorio y móvil.
- **Funciones extra**:
  - Importar y exportar datos en Excel.
  - Modo oscuro/claro.

---

## 📂 Estructura del proyecto
