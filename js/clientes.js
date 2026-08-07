```javascript
const CLAVE_CLIENTES = "clientes";

let clientes = cargarClientes();
let clienteEditandoId = null;

document.addEventListener(
    "DOMContentLoaded",
    iniciarModuloClientes
);

function iniciarModuloClientes() {

    const moduloClientes = document.getElementById(
        "modulo-clientes"
    );

    if (moduloClientes === null) {
        console.warn(
            "No se encontró el elemento modulo-clientes."
        );

        return;
    }

    moduloClientes.innerHTML = `
        <section class="modulo-administrativo">

            <header class="encabezado-modulo">
                <div>
                    <h2>Administración de clientes</h2>
                    <p>
                        Registra, consulta, edita y elimina clientes.
                    </p>
                </div>

                <span class="contador-modulo">
                    <strong id="contador-clientes-modulo">0</strong>
                    clientes
                </span>
            </header>

            <form id="formulario-clientes">

                <div class="grupo-formulario">
                    <label for="cliente-nombre">
                        Nombre completo
                    </label>

                    <input
                        id="cliente-nombre"
                        type="text"
                        placeholder="Ejemplo: María López"
                        required
                    >
                </div>

                <div class="grupo-formulario">
                    <label for="cliente-correo">
                        Correo electrónico
                    </label>

                    <input
                        id="cliente-correo"
                        type="email"
                        placeholder="Ejemplo: maria@correo.com"
                        required
                    >
                </div>

                <div class="grupo-formulario">
                    <label for="cliente-telefono">
                        Teléfono
                    </label>

                    <input
                        id="cliente-telefono"
                        type="tel"
                        placeholder="Ejemplo: 8888-8888"
                        required
                    >
                </div>

                <div class="grupo-formulario">
                    <label for="cliente-estado">
                        Estado
                    </label>

                    <select id="cliente-estado" required>
                        <option value="activo">Activo</option>
                        <option value="inactivo">Inactivo</option>
                    </select>
                </div>

                <div class="acciones-formulario">

                    <button
                        id="boton-guardar-cliente"
                        type="submit"
                    >
                        Registrar cliente
                    </button>

                    <button
                        id="boton-cancelar-edicion"
                        type="button"
                        hidden
                    >
                        Cancelar edición
                    </button>

                </div>

                <p
                    id="mensaje-clientes"
                    role="status"
                    aria-live="polite"
                ></p>

            </form>

            <div class="contenedor-tabla">

                <table>

                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Correo</th>
                            <th>Teléfono</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>

                    <tbody id="lista-clientes"></tbody>

                </table>

            </div>

        </section>
    `;

    const formulario = document.getElementById(
        "formulario-clientes"
    );

    const listaClientes = document.getElementById(
        "lista-clientes"
    );

    const botonCancelar = document.getElementById(
        "boton-cancelar-edicion"
    );

    formulario.addEventListener(
        "submit",
        procesarFormularioCliente
    );

    listaClientes.addEventListener(
        "click",
        procesarAccionCliente
    );

    botonCancelar.addEventListener(
        "click",
        cancelarEdicionCliente
    );

    mostrarClientes();
}

function cargarClientes() {

    const clientesGuardados =
        localStorage.getItem(CLAVE_CLIENTES);

    if (clientesGuardados === null) {
        return [];
    }

    try {

        const datosConvertidos =
            JSON.parse(clientesGuardados);

        return Array.isArray(datosConvertidos)
            ? datosConvertidos
            : [];

    } catch (error) {

        console.error(
            "No se pudieron cargar los clientes:",
            error
        );

        return [];
    }
}

function guardarClientes() {

    localStorage.setItem(
        CLAVE_CLIENTES,
        JSON.stringify(clientes)
    );
}

function procesarFormularioCliente(evento) {

    evento.preventDefault();

    const nombre = document
        .getElementById("cliente-nombre")
        .value
        .trim();

    const correo = document
        .getElementById("cliente-correo")
        .value
        .trim();

    const telefono = document
        .getElementById("cliente-telefono")
        .value
        .trim();

    const estado = document
        .getElementById("cliente-estado")
        .value;

    if (
        nombre === "" ||
        correo === "" ||
        telefono === "" ||
        estado === ""
    ) {

        mostrarMensajeCliente(
            "Todos los campos son obligatorios.",
            "error"
        );

        return;
    }

    if (clienteEditandoId === null) {

        registrarCliente(
            nombre,
            correo,
            telefono,
            estado
        );

    } else {

        actualizarCliente(
            nombre,
            correo,
            telefono,
            estado
        );
    }

    guardarClientes();
    mostrarClientes();
    limpiarFormularioCliente();
}

function registrarCliente(
    nombre,
    correo,
    telefono,
    estado
) {

    const nuevoCliente = {

        id: Date.now(),

        nombre: nombre,

        correo: correo,

        telefono: telefono,

        estado: estado
    };

    clientes.push(nuevoCliente);

    mostrarMensajeCliente(
        "Cliente registrado correctamente.",
        "exito"
    );
}

function actualizarCliente(
    nombre,
    correo,
    telefono,
    estado
) {

    const clienteEncontrado = clientes.find(
        function (cliente) {

            return cliente.id === clienteEditandoId;

        }
    );

    if (clienteEncontrado === undefined) {

        mostrarMensajeCliente(
            "No se encontró el cliente.",
            "error"
        );

        return;
    }

    clienteEncontrado.nombre = nombre;
    clienteEncontrado.correo = correo;
    clienteEncontrado.telefono = telefono;
    clienteEncontrado.estado = estado;

    mostrarMensajeCliente(
        "Cliente actualizado correctamente.",
        "exito"
    );
}

function mostrarClientes() {

    actualizarContadorClientes();

    const listaClientes = document.getElementById(
        "lista-clientes"
    );

    if (!listaClientes) {
        return;
    }

    listaClientes.innerHTML = "";

    if (clientes.length === 0) {

        const filaVacia =
            document.createElement("tr");

        const celdaVacia =
            document.createElement("td");

        celdaVacia.colSpan = 5;

        celdaVacia.textContent =
            "No hay clientes registrados.";

        filaVacia.appendChild(celdaVacia);

        listaClientes.appendChild(filaVacia);

        return;
    }

    clientes.forEach(function (cliente) {

        const fila =
            document.createElement("tr");

        fila.appendChild(
            crearCeldaCliente(cliente.nombre)
        );

        fila.appendChild(
            crearCeldaCliente(cliente.correo)
        );

        fila.appendChild(
            crearCeldaCliente(cliente.telefono)
        );

        fila.appendChild(
            crearCeldaCliente(cliente.estado)
        );

        const celdaAcciones =
            document.createElement("td");

        const botonEditar =
            document.createElement("button");

        botonEditar.type = "button";
        botonEditar.textContent = "Editar";
        botonEditar.dataset.accion = "editar";
        botonEditar.dataset.id = cliente.id;

        const botonEliminar =
            document.createElement("button");

        botonEliminar.type = "button";
        botonEliminar.textContent = "Eliminar";
        botonEliminar.dataset.accion = "eliminar";
        botonEliminar.dataset.id = cliente.id;

        celdaAcciones.appendChild(
            botonEditar
        );

        celdaAcciones.appendChild(
            botonEliminar
        );

        fila.appendChild(
            celdaAcciones
        );

        listaClientes.appendChild(
            fila
        );
    });
}

function crearCeldaCliente(contenido) {

    const celda =
        document.createElement("td");

    celda.textContent = contenido;

    return celda;
}

function procesarAccionCliente(evento) {

    const botonPresionado =
        evento.target.closest("button");

    if (botonPresionado === null) {
        return;
    }

    const accion =
        botonPresionado.dataset.accion;

    const idCliente =
        Number(
            botonPresionado.dataset.id
        );

    if (accion === "editar") {

        prepararEdicionCliente(
            idCliente
        );
    }

    if (accion === "eliminar") {

        eliminarCliente(
            idCliente
        );
    }
}

function prepararEdicionCliente(idCliente) {

    const clienteEncontrado =
        clientes.find(
            function (cliente) {

                return cliente.id === idCliente;

            }
        );

    if (clienteEncontrado === undefined) {

        mostrarMensajeCliente(
            "No se encontró el cliente.",
            "error"
        );

        return;
    }

    document.getElementById(
        "cliente-nombre"
    ).value =
        clienteEncontrado.nombre;

    document.getElementById(
        "cliente-correo"
    ).value =
        clienteEncontrado.correo;

    document.getElementById(
        "cliente-telefono"
    ).value =
        clienteEncontrado.telefono;

    document.getElementById(
        "cliente-estado"
    ).value =
        clienteEncontrado.estado;

    clienteEditandoId =
        idCliente;

    document.getElementById(
        "boton-guardar-cliente"
    ).textContent =
        "Guardar cambios";

    document.getElementById(
        "boton-cancelar-edicion"
    ).hidden = false;

    mostrarMensajeCliente(
        "Editando cliente seleccionado.",
        "informacion"
    );
}

function eliminarCliente(idCliente) {

    const confirmarEliminacion =
        confirm(
            "¿Deseas eliminar este cliente?"
        );

    if (confirmarEliminacion === false) {
        return;
    }

    clientes =
        clientes.filter(
            function (cliente) {

                return cliente.id !== idCliente;

            }
        );

    guardarClientes();

    mostrarClientes();

    if (
        clienteEditandoId === idCliente
    ) {

        limpiarFormularioCliente();

    }

    mostrarMensajeCliente(
        "Cliente eliminado correctamente.",
        "exito"
    );
}

function cancelarEdicionCliente() {

    limpiarFormularioCliente();

    mostrarMensajeCliente(
        "Edición cancelada.",
        "informacion"
    );
}

function limpiarFormularioCliente() {

    const formulario =
        document.getElementById(
            "formulario-clientes"
        );

    formulario.reset();

    clienteEditandoId = null;

    document.getElementById(
        "boton-guardar-cliente"
    ).textContent =
        "Registrar cliente";

    document.getElementById(
        "boton-cancelar-edicion"
    ).hidden = true;
}

function mostrarMensajeCliente(
    texto,
    tipo
) {

    const mensaje =
        document.getElementById(
            "mensaje-clientes"
        );

    if (!mensaje) {
        return;
    }

    mensaje.textContent = texto;

    mensaje.className = tipo;
}

function actualizarContadorClientes() {

    const contadorDashboard =
        document.getElementById(
            "clientes-count"
        );

    if (contadorDashboard) {

        contadorDashboard.textContent =
            clientes.length;
    }

    const contadorModulo =
        document.getElementById(
            "contador-clientes-modulo"
        );

    if (contadorModulo) {

        contadorModulo.textContent =
            clientes.length;
    }
}
```
