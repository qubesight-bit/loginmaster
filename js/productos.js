const CLAVE_PRODUCTOS = "productos";

let productos = cargarProductos();
let productoEditandoId = null;

document.addEventListener("DOMContentLoaded", iniciarModuloProductos);

function iniciarModuloProductos() {
  const moduloProductos = document.getElementById("modulo-productos");
  if (!moduloProductos) return;

  moduloProductos.innerHTML = `
    <section class="modulo-administrativo">
      <header class="encabezado-modulo">
        <div>
          <h2>Administración de productos</h2>
          <p>Registra, consulta, edita y elimina productos.</p>
        </div>
        <span class="contador-modulo">
          <strong id="contador-productos-modulo">0</strong> productos
        </span>
      </header>

      <form id="formulario-productos">
        <div class="grupo-formulario">
          <label for="producto-nombre">Nombre del producto</label>
          <input id="producto-nombre" type="text" placeholder="Ejemplo: Laptop empresarial" required>
        </div>

        <div class="grupo-formulario">
          <label for="producto-categoria">Categoría</label>
          <input id="producto-categoria" type="text" placeholder="Ejemplo: Computadoras" required>
        </div>

        <div class="grupo-formulario">
          <label for="producto-precio">Precio</label>
          <input id="producto-precio" type="number" min="0" step="0.01" placeholder="Ejemplo: 450000" required>
        </div>

        <div class="grupo-formulario">
          <label for="producto-existencias">Existencias</label>
          <input id="producto-existencias" type="number" min="0" step="1" placeholder="Ejemplo: 8" required>
        </div>

        <div class="acciones-formulario">
          <button id="boton-guardar-producto" type="submit">Registrar producto</button>
          <button id="boton-cancelar-producto" type="button" hidden>Cancelar edición</button>
        </div>

        <p id="mensaje-productos" role="status" aria-live="polite"></p>
      </form>

      <div class="contenedor-tabla">
        <table>
          <thead>
            <tr>
              <th>Producto</th>
              <th>Categoría</th>
              <th>Precio</th>
              <th>Existencias</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody id="lista-productos"></tbody>
        </table>
      </div>
    </section>
  `;

  const formulario = document.getElementById("formulario-productos");
  const listaProductos = document.getElementById("lista-productos");
  const botonCancelar = document.getElementById("boton-cancelar-producto");

  formulario.addEventListener("submit", procesarFormularioProducto);
  listaProductos.addEventListener("click", procesarAccionProducto);
  botonCancelar.addEventListener("click", cancelarEdicionProducto);

  mostrarProductos();
}

function cargarProductos() {
  const guardados = localStorage.getItem(CLAVE_PRODUCTOS);
  if (!guardados) return [];

  try {
    const datos = JSON.parse(guardados);
    return Array.isArray(datos) ? datos : [];
  } catch (error) {
    console.error("Error cargando productos:", error);
    return [];
  }
}

function guardarProductos() {
  localStorage.setItem(CLAVE_PRODUCTOS, JSON.stringify(productos));
}

function procesarFormularioProducto(evento) {
  evento.preventDefault();

  const nombre = document.getElementById("producto-nombre").value.trim();
  const categoria = document.getElementById("producto-categoria").value.trim();
  const precioIngresado = document.getElementById("producto-precio").value;
  const existenciasIngresadas = document.getElementById("producto-existencias").value;

  if (!nombre || !categoria || !precioIngresado || !existenciasIngresadas) {
    mostrarMensajeProducto("Todos los campos son obligatorios.", "error");
    return;
  }

  const precio = Number(precioIngresado);
  const existencias = Number(existenciasIngresadas);

  if (precio <= 0) {
    mostrarMensajeProducto("El precio debe ser mayor que cero.", "error");
    return;
  }

  if (existencias < 0 || !Number.isInteger(existencias)) {
    mostrarMensajeProducto("Las existencias deben ser un número entero positivo.", "error");
    return;
  }

  if (productoEditandoId === null) {
    registrarProducto(nombre, categoria, precio, existencias);
  } else {
    actualizarProducto(nombre, categoria, precio, existencias);
  }

  guardarProductos();
  mostrarProductos();
  limpiarFormularioProducto();
}

function registrarProducto(nombre, categoria, precio, existencias) {
  productos.push({ id: Date.now(), nombre, categoria, precio, existencias });
  mostrarMensajeProducto("Producto registrado correctamente.", "exito");
}

function actualizarProducto(nombre, categoria, precio, existencias) {
  const producto = productos.find((p) => p.id === productoEditandoId);
  if (!producto) {
    mostrarMensajeProducto("No se encontró el producto.", "error");
    return;
  }

  producto.nombre = nombre;
  producto.categoria = categoria;
  producto.precio = precio;
  producto.existencias = existencias;

  mostrarMensajeProducto("Producto actualizado correctamente.", "exito");
}

function mostrarProductos() {
  actualizarContadorProductos();
  const lista = document.getElementById("lista-productos");
  if (!lista) return;

  lista.innerHTML = "";

  if (productos.length === 0) {
    lista.innerHTML = `<tr><td colspan="5">No hay productos registrados.</td></tr>`;
    return;
  }

  productos.forEach((producto) => {
    const fila = document.createElement("tr");
    fila.innerHTML = `
      <td>${producto.nombre}</td>
      <td>${producto.categoria}</td>
      <td>${formatearPrecio(producto.precio)}</td>
      <td>${producto.existencias}</td>
      <td>
        <button type="button" data-accion="editar" data-id="${producto.id}">Editar</button>
        <button type="button" data-accion="eliminar" data-id="${producto.id}">Eliminar</button>
      </td>
    `;
    lista.appendChild(fila);
  });
}

function formatearPrecio(precio) {
  return new Intl.NumberFormat("es-CR", { style: "currency", currency: "CRC" }).format(precio);
}

function procesarAccionProducto(evento) {
  const boton = evento.target.closest("button");
  if (!boton) return;

  const id = Number(boton.dataset.id);

  if (boton.dataset.accion === "editar") {
    prepararEdicionProducto(id);
  } else if (boton.dataset.accion === "eliminar") {
    eliminarProducto(id);
  }
}

function prepararEdicionProducto(id) {
  const producto = productos.find((p) => p.id === id);
  if (!producto) return;

  document.getElementById("producto-nombre").value = producto.nombre;
  document.getElementById("producto-categoria").value = producto.categoria;
  document.getElementById("producto-precio").value = producto.precio;
  document.getElementById("producto-existencias").value = producto.existencias;

  productoEditandoId = id;
  document.getElementById("boton-guardar-producto").textContent = "Guardar cambios";
  document.getElementById("boton-cancelar-producto").hidden = false;
  mostrarMensajeProducto("Editando producto seleccionado.", "informacion");
}

function eliminarProducto(id) {
  if (!confirm("¿Deseas eliminar este producto?")) return;

  productos = productos.filter((p) => p.id !== id);
  guardarProductos();
  mostrarProductos();

  if (productoEditandoId === id) limpiarFormularioProducto();
  mostrarMensajeProducto("Producto eliminado correctamente.", "exito");
}

function cancelarEdicionProducto() {
  limpiarFormularioProducto();
  mostrarMensajeProducto("Edición cancelada.", "informacion");
}

function limpiarFormularioProducto() {
  document.getElementById("formulario-productos").reset();
  productoEditandoId = null;
  document.getElementById("boton-guardar-producto").textContent = "Registrar producto";
  document.getElementById("boton-cancelar-producto").hidden = true;
}

function mostrarMensajeProducto(texto, tipo) {
  const mensaje = document.getElementById("mensaje-productos");
  if (!mensaje) return;
  mensaje.textContent = texto;
  mensaje.className = tipo;
}

function actualizarContadorProductos() {
  const contadorDashboard = document.getElementById("productos-count");
  if (contadorDashboard) contadorDashboard.textContent = productos.length;

  const contadorModulo = document.getElementById("contador-productos-modulo");
  if (contadorModulo) contadorModulo.textContent = productos.length;
}
