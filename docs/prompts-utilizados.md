# Prompts utilizados durante el desarrollo

## Prompt 1: CRUD de clientes

### Objetivo

Desarrollar el módulo de administración de clientes utilizando
JavaScript, manipulación del DOM y LocalStorage.

### Prompt utilizado

Actúa como desarrollador frontend y genera el contenido completo
del archivo `js/clientes.js` para un sistema administrativo web.

El módulo debe insertarse dentro de un elemento HTML con el
identificador `modulo-clientes`.

Cada cliente debe contener:

- ID único.
- Nombre completo.
- Correo electrónico.
- Teléfono.
- Estado activo o inactivo.

El módulo debe permitir:

- Registrar clientes.
- Consultar los clientes en una tabla.
- Editar clientes existentes.
- Eliminar clientes con confirmación.
- Validar que los campos obligatorios no estén vacíos.
- Guardar la información en LocalStorage.
- Recuperar la información al recargar la página.
- Mostrar mensajes sobre el resultado de cada operación.

Utiliza variables, constantes, funciones, objetos, arreglos,
condicionales, eventos, métodos de arreglos y manipulación del DOM.

El código debe estar escrito en JavaScript sin bibliotecas externas
y debe ser comprensible para estudiantes que están aprendiendo
desarrollo web.

### Respuesta obtenida

La IA generó un módulo CRUD que construye dinámicamente el
formulario y la tabla de clientes. También implementó funciones
para registrar, mostrar, editar, eliminar, guardar y recuperar los
clientes.

### Revisión y adaptación

Se comprobó la sintaxis con `node --check`. Después se creó una
página temporal que contenía el elemento `modulo-clientes` para
probar el módulo antes de integrarlo con el Dashboard.

Se verificaron estas operaciones:

- Registro de clientes.
- Persistencia después de recargar la página.
- Edición de clientes.
- Eliminación con confirmación.

El módulo quedó preparado para integrarse posteriormente con el
Dashboard desarrollado por el otro integrante.