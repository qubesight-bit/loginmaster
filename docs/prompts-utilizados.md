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

## Prompt 2: CRUD de productos

### Objetivo

Desarrollar un módulo para administrar productos utilizando
JavaScript, DOM y LocalStorage.

### Prompt utilizado

Actúa como desarrollador frontend y crea el contenido completo
de `js/productos.js`.

El módulo debe insertarse dentro del elemento con identificador
`modulo-productos`.

Cada producto debe contener:

- ID único.
- Nombre.
- Categoría.
- Precio.
- Cantidad de existencias.

Debe permitir registrar, consultar, editar y eliminar productos.
También debe validar que el precio sea mayor que cero y que las
existencias sean un número entero positivo.

Los productos deben guardarse en LocalStorage y permanecer
disponibles después de recargar la página. El precio debe
mostrarse en colones costarricenses.

### Revisión y adaptación

Se comprobó la sintaxis con `node --check`. Durante la primera
prueba se detectó que faltaba la función que construía el módulo.
Se corrigió el archivo y se volvió a probar el registro, edición,
eliminación, validación y persistencia de los productos.

## Prompt 3: CRUD de proveedores

### Objetivo

Desarrollar un módulo para administrar proveedores utilizando
JavaScript, DOM y LocalStorage.

### Prompt utilizado

Actúa como desarrollador frontend y crea el contenido completo
de `js/proveedores.js`.

El módulo debe insertarse dentro del elemento con identificador
`modulo-proveedores`.

Cada proveedor debe contener:

- ID único.
- Nombre de la empresa.
- Persona de contacto.
- Correo electrónico.
- Teléfono.

Debe permitir registrar, consultar, editar y eliminar
proveedores. También debe validar los campos obligatorios,
guardar la información en LocalStorage y recuperar los datos
después de recargar la página.

### Revisión y adaptación

El módulo fue probado en una página temporal independiente.
Se comprobaron el registro, la persistencia, la edición, la
cancelación de cambios, la eliminación y la validación de campos.

## Prompt 4: contadores del Dashboard

### Objetivo

Mostrar en las tarjetas del Dashboard las cantidades reales de
clientes, productos y proveedores.

### Prompt utilizado

Agrega a cada módulo CRUD una función que busque la tarjeta
correspondiente del Dashboard y actualice su contenido con la
cantidad de elementos almacenados en el arreglo.

La función debe comprobar primero que la tarjeta exista para que
los módulos también puedan probarse en páginas independientes.

### Adaptación realizada

Se agregaron funciones independientes para actualizar los
contadores de clientes, productos y proveedores. Estas funciones
se ejecutan cuando cada módulo muestra nuevamente su tabla.