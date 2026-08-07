const CLAVE_PROVEEDORES = "proveedores";

let proveedores = cargarProveedores();
let proveedorEditandoId = null;

document.addEventListener("DOMContentLoaded", iniciarModuloProveedores);

function iniciarModuloProveedores() {
  const moduloProveedores = document.getElementById("modulo-proveedores");
  if (!moduloProveedores) return;

  moduloProveedores.innerHTML = `
    <section class="modulo-administrativo">
      <header class="encabezado-modulo">
        <h2>Administración de proveedores</h2>
        <p>Registra, consulta, edita y elimina proveedores.</p>
      </header>

      <form id="formulario-proveedores">
        <div class="grupo-formulario">
          <label for="proveedor-empresa">Nombre de la empresa</label>
          <input id="proveedor-empresa" type="text" placeholder="Ejemplo: Tecnología CR" required>
        </div>

        <div class="grupo-formulario">
          <label for="proveedor-contacto">Persona de contacto</label>
          <input id="proveedor-contacto" type="text" placeholder="Ejemplo: Carlos Vargas" required>
        </div>

        <div class="grupo-formulario">
          <label for="proveedor-correo">Correo electrónico</label>
          <input id="proveedor-correo" type="email" placeholder="Ejemplo: ventas@tecnologiacr.com" required>
        </div>

        <div class="grupo-formulario">
          <label for="proveedor-telefono">Teléfono</label>
          <input id="proveedor-telefono" type="tel" placeholder="Ejemplo: 2222-2222" required>
        </div>

        <div class="acciones-formulario">
          <button id="boton-guardar-proveedor" type="submit">Registrar proveedor</button>
          <button id="boton-cancelar-proveedor" type="button" hidden>Cancelar edición</button>
        </div>

        <p id="mensaje-proveedores" role="status" aria-live="polite"></p>
      </form>

      <div class="contenedor-tabla">
        <table>
          <thead>
            <tr>
              <th>Empresa</th>
              <th>Contacto</th>
              <th>Correo</th>
              <th>Teléfono</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody id="lista-proveedores"></tbody>
        </table>
      </div>
    </section>
  `;

  const formulario = document.getElementById("formulario-proveedores");
  const listaProveedores = document.getElementById("lista-proveedores");
  const botonCancelar = document.getElementById("boton-cancelar-proveedor");

  formulario.addEventListener("submit", procesarFormularioProveedor);
  listaProveedores.addEventListener("click", procesarAccionProveedor);
  botonCancelar.addEventListener("click", cancelarEdicionProveedor);

  mostrarProveedores();
}

function cargarProveedores() {
  const proveedoresGuardados = localStorage.getItem(CLAVE_PROVEEDORES);
  if (proveedoresGuardados === null) return [];

  try {
    const datosConvertidos = JSON.parse(proveedoresGuardados);
    return Array.isArray(datosConvertidos) ? datosConvertidos : [];
  } catch (error) {
    console.error("No se pudieron cargar los proveedores:", error);
    return [];
  }
}

function guardarProveedores() {
  localStorage.setItem(CLAVE_PROVEEDORES, JSON.stringify(proveedores));
}

function procesarFormularioProveedor(evento) {
  evento.preventDefault();

  const empresa = document.getElementById("proveedor-empresa").value.trim();
  const contacto = document.getElementById("proveedor-contacto").value.trim();
  const correo = document.getElementById("proveedor-correo").value.trim();
  const telefono = document.getElementById("proveedor-telefono").value.trim();

  if (!empresa || !contacto || !correo || !telefono) {
    mostrarMensajeProveedor("Todos los campos son obligatorios.", "error");
    return;
  }

  if (proveedorEditandoId === null) {
    registrarProveedor(empresa, contacto, correo, telefono);
  } else {
    actualizarProveedor(empresa, contacto, correo, telefono);
  }

  guardarProveedores();
  mostrarProveedores();
  limpiarFormularioProveedor();
}

function registrarProveedor(empresa, contacto, correo, telefono) {
  proveedores.push({ id: Date.now(), empresa, contacto, correo, telefono });
  mostrarMensajeProveedor("Proveedor registrado correctamente.", "exito");
}

function actualizarProveedor(empresa, contacto, correo, telefono) {
  const proveedorEncontrado = proveedores.find((proveedor) => Number(proveedor.id) === Number(proveedorEditandoId));
  if (!proveedorEncontrado) {
    mostrarMensajeProveedor("No se encontró el proveedor.", "error");
    return;
  }

  proveedorEncontrado.empresa = empresa;
  proveedorEncontrado.contacto = contacto;
  proveedorEncontrado.correo = correo;
  proveedorEncontrado.telefono = telefono;

  mostrarMensajeProveedor("Proveedor actualizado correctamente.", "exito");
}

function mostrarProveedores() {
  actualizarContadorProveedores();
  const listaProveedores = document.getElementById("lista-proveedores");
  if (!listaProveedores) return;

  listaProveedores.innerHTML = "";

  if (proveedores.length === 0) {
    const filaVacia = document.createElement("tr");
    const celdaVacia = document.createElement("td");
    celdaVacia.colSpan = 5;
    celdaVacia.textContent = "No hay proveedores registrados.";
    filaVacia.appendChild(celdaVacia);
    listaProveedores.appendChild(filaVacia);
    return;
  }

  proveedores.forEach((proveedor) => {
    const fila = document.createElement("tr");
    fila.appendChild(crearCeldaProveedor(proveedor.empresa));
    fila.appendChild(crearCeldaProveedor(proveedor.contacto));
    fila.appendChild(crearCeldaProveedor(proveedor.correo));
    fila.appendChild(crearCeldaProveedor(proveedor.telefono));

    const celdaAcciones = document.createElement("td");
    const botonEditar = document.createElement("button");
    botonEditar.type = "button";
    botonEditar.textContent = "Editar";
    botonEditar.dataset.accion = "editar";
    botonEditar.dataset.id = proveedor.id;

    const botonEliminar = document.createElement("button");
    botonEliminar.type = "button";
    botonEliminar.textContent = "Eliminar";
    botonEliminar.dataset.accion = "eliminar";
    botonEliminar.dataset.id = proveedor.id;

    celdaAcciones.appendChild(botonEditar);
    celdaAcciones.appendChild(botonEliminar);
    fila.appendChild(celdaAcciones);
    listaProveedores.appendChild(fila);
  });
}

function crearCeldaProveedor(contenido) {
  const celda = document.createElement("td");
  celda.textContent = contenido ?? "";
  return celda;
}

function procesarAccionProveedor(evento) {
  const botonPresionado = evento.target.closest("button");
  if (!botonPresionado) return;

  const accion = botonPresionado.dataset.accion;
  const idProveedor = Number(botonPresionado.dataset.id);

  if (accion === "editar") prepararEdicionProveedor(idProveedor);
  if (accion === "eliminar") eliminarProveedor(idProveedor);
}

function prepararEdicionProveedor(idProveedor) {
  const proveedorEncontrado = proveedores.find((proveedor) => Number(proveedor.id) === Number(idProveedor));
  if (!proveedorEncontrado) {
    mostrarMensajeProveedor("No se encontró el proveedor.", "error");
    return;
  }

  document.getElementById("proveedor-empresa").value = proveedorEncontrado.empresa;
  document.getElementById("proveedor-contacto").value = proveedorEncontrado.contacto;
  document.getElementById("proveedor-correo").value = proveedorEncontrado.correo;
  document.getElementById("proveedor-telefono").value = proveedorEncontrado.telefono;

  proveedorEditandoId = Number(idProveedor);
  document.getElementById("boton-guardar-proveedor").textContent = "Guardar cambios";
  document.getElementById("boton-cancelar-proveedor").hidden = false;
  mostrarMensajeProveedor("Editando proveedor seleccionado.", "informacion");
}

function eliminarProveedor(idProveedor) {
  const confirmarEliminacion = confirm("¿Deseas eliminar este proveedor?");
  if (!confirmarEliminacion) return;

  proveedores = proveedores.filter((proveedor) => Number(proveedor.id) !== Number(idProveedor));
  guardarProveedores();
  mostrarProveedores();

  if (Number(proveedorEditandoId) === Number(idProveedor)) limpiarFormularioProveedor();
  mostrarMensajeProveedor("Proveedor eliminado correctamente.", "exito");
}

function cancelarEdicionProveedor() {
  limpiarFormularioProveedor();
  mostrarMensajeProveedor("Edición cancelada.", "informacion");
}

function limpiarFormularioProveedor() {
  const formulario = document.getElementById("formulario-proveedores");
  if (formulario) formulario.reset();

  proveedorEditandoId = null;
  const botonGuardar = document.getElementById("boton-guardar-proveedor");
  const botonCancelar = document.getElementById("boton-cancelar-proveedor");

  if (botonGuardar) botonGuardar.textContent = "Registrar proveedor";
  if (botonCancelar) botonCancelar.hidden = true;
}

function mostrarMensajeProveedor(texto, tipo) {
  const mensaje = document.getElementById("mensaje-proveedores");
  if (!mensaje) return;
  mensaje.textContent = texto;
  mensaje.className = tipo;
}

function actualizarContadorProveedores() {
  const contador = document.getElementById("proveedores-count");
  if (contador !== null) contador.textContent = proveedores.length;
}
