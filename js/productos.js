const CLAVE_PRODUCTOS = "productos";

let productos = cargarProductos();
let productoEditandoId = null;

document.addEventListener(
    "DOMContentLoaded",
    iniciarModuloProductos
);

function iniciarModuloProductos() {
    const moduloProductos = document.getElementById(
        "modulo-productos"
    );

    if (moduloProductos === null) {
        console.warn(
            "No se encontró el elemento modulo-productos."
        );

        return;
    }

    moduloProductos.innerHTML = `
        <section class="modulo-administrativo">
            <header class="encabezado-modulo">
                <h2>Administración de productos</h2>

                <p>
                    Registra, consulta, edita y elimina productos.
                </p>
            </header>

            <form id="formulario-productos">
                <div class="grupo-formulario">
                    <label for="producto-nombre">
                        Nombre del producto
                    </label>

                    <input
                        id="producto-nombre"
                        type="text"
                        placeholder="Ejemplo: Laptop empresarial"
                        required
                    >
                </div>

                <div class="grupo-formulario">
                    <label for="producto-categoria">
                        Categoría
                    </label>

                    <input
                        id="producto-categoria"
                        type="text"
                        placeholder="Ejemplo: Computadoras"
                        required
                    >
                </div>

                <div class="grupo-formulario">
                    <label for="producto-precio">
                        Precio
                    </label>

                    <input
                        id="producto-precio"
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="Ejemplo: 450000"
                        required
                    >
                </div>

                <div class="grupo-formulario">
                    <label for="producto-existencias">
                        Existencias
                    </label>

                    <input
                        id="producto-existencias"
                        type="number"
                        min="0"
                        step="1"
                        placeholder="Ejemplo: 8"
                        required
                    >
                </div>

                <div class="acciones-formulario">
                    <button
                        id="boton-guardar-producto"
                        type="submit"
                    >
                        Registrar producto
                    </button>

                    <button
                        id="boton-cancelar-producto"
                        type="button"
                        hidden
                    >
                        Cancelar edición
                    </button>
                </div>

                <p
                    id="mensaje-productos"
                    role="status"
                    aria-live="polite"
                ></p>
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

    const formulario = document.getElementById(
        "formulario-productos"
    );

    const listaProductos = document.getElementById(
        "lista-productos"
    );

    const botonCancelar = document.getElementById(
        "boton-cancelar-producto"
    );

    formulario.addEventListener(
        "submit",
        procesarFormularioProducto
    );

    listaProductos.addEventListener(
        "click",
        procesarAccionProducto
    );

    botonCancelar.addEventListener(
        "click",
        cancelarEdicionProducto
    );

    mostrarProductos();
}

function cargarProductos() {
    const productosGuardados =
        localStorage.getItem(CLAVE_PRODUCTOS);

    if (productosGuardados === null) {
        return [];
    }

    try {
        const datosConvertidos = JSON.parse(
            productosGuardados
        );

        if (Array.isArray(datosConvertidos)) {
            return datosConvertidos;
        }

        return [];
    } catch (error) {
        console.error(
            "No se pudieron cargar los productos:",
            error
        );

        return [];
    }
}

function guardarProductos() {
    const productosConvertidosATexto =
        JSON.stringify(productos);

    localStorage.setItem(
        CLAVE_PRODUCTOS,
        productosConvertidosATexto
    );
}

function procesarFormularioProducto(evento) {
    evento.preventDefault();

    const nombre = document
        .getElementById("producto-nombre")
        .value
        .trim();

    const categoria = document
        .getElementById("producto-categoria")
        .value
        .trim();

    const precioIngresado = document
        .getElementById("producto-precio")
        .value;

    const existenciasIngresadas = document
        .getElementById("producto-existencias")
        .value;

    if (
        nombre === "" ||
        categoria === "" ||
        precioIngresado === "" ||
        existenciasIngresadas === ""
    ) {
        mostrarMensajeProducto(
            "Todos los campos son obligatorios.",
            "error"
        );

        return;
    }

    const precio = Number(precioIngresado);
    const existencias = Number(existenciasIngresadas);

    if (precio <= 0) {
        mostrarMensajeProducto(
            "El precio debe ser mayor que cero.",
            "error"
        );

        return;
    }

    if (
        existencias < 0 ||
        Number.isInteger(existencias) === false
    ) {
        mostrarMensajeProducto(
            "Las existencias deben ser un número entero positivo.",
            "error"
        );

        return;
    }

    if (productoEditandoId === null) {
        registrarProducto(
            nombre,
            categoria,
            precio,
            existencias
        );
    } else {
        actualizarProducto(
            nombre,
            categoria,
            precio,
            existencias
        );
    }

    guardarProductos();
    mostrarProductos();
    limpiarFormularioProducto();
}

function registrarProducto(
    nombre,
    categoria,
    precio,
    existencias
) {
    const nuevoProducto = {
        id: Date.now(),
        nombre: nombre,
        categoria: categoria,
        precio: precio,
        existencias: existencias
    };

    productos.push(nuevoProducto);

    mostrarMensajeProducto(
        "Producto registrado correctamente.",
        "exito"
    );
}

function actualizarProducto(
    nombre,
    categoria,
    precio,
    existencias
) {
    const productoEncontrado = productos.find(
        function (producto) {
            return producto.id === productoEditandoId;
        }
    );

    if (productoEncontrado === undefined) {
        mostrarMensajeProducto(
            "No se encontró el producto.",
            "error"
        );

        return;
    }

    productoEncontrado.nombre = nombre;
    productoEncontrado.categoria = categoria;
    productoEncontrado.precio = precio;
    productoEncontrado.existencias = existencias;

    mostrarMensajeProducto(
        "Producto actualizado correctamente.",
        "exito"
    );
}

function mostrarProductos() {
    const listaProductos = document.getElementById(
        "lista-productos"
    );

    listaProductos.innerHTML = "";

    if (productos.length === 0) {
        const filaVacia = document.createElement("tr");
        const celdaVacia = document.createElement("td");

        celdaVacia.colSpan = 5;
        celdaVacia.textContent =
            "No hay productos registrados.";

        filaVacia.appendChild(celdaVacia);
        listaProductos.appendChild(filaVacia);

        return;
    }

    productos.forEach(function (producto) {
        const fila = document.createElement("tr");

        fila.appendChild(
            crearCeldaProducto(producto.nombre)
        );

        fila.appendChild(
            crearCeldaProducto(producto.categoria)
        );

        fila.appendChild(
            crearCeldaProducto(
                formatearPrecio(producto.precio)
            )
        );

        fila.appendChild(
            crearCeldaProducto(producto.existencias)
        );

        const celdaAcciones =
            document.createElement("td");

        const botonEditar =
            document.createElement("button");

        botonEditar.type = "button";
        botonEditar.textContent = "Editar";
        botonEditar.dataset.accion = "editar";
        botonEditar.dataset.id = producto.id;

        const botonEliminar =
            document.createElement("button");

        botonEliminar.type = "button";
        botonEliminar.textContent = "Eliminar";
        botonEliminar.dataset.accion = "eliminar";
        botonEliminar.dataset.id = producto.id;

        celdaAcciones.appendChild(botonEditar);
        celdaAcciones.appendChild(botonEliminar);

        fila.appendChild(celdaAcciones);
        listaProductos.appendChild(fila);
    });
}

function crearCeldaProducto(contenido) {
    const celda = document.createElement("td");

    celda.textContent = contenido;

    return celda;
}

function formatearPrecio(precio) {
    const formatoColones = new Intl.NumberFormat(
        "es-CR",
        {
            style: "currency",
            currency: "CRC"
        }
    );

    return formatoColones.format(precio);
}

function procesarAccionProducto(evento) {
    const botonPresionado =
        evento.target.closest("button");

    if (botonPresionado === null) {
        return;
    }

    const accion = botonPresionado.dataset.accion;

    const idProducto = Number(
        botonPresionado.dataset.id
    );

    if (accion === "editar") {
        prepararEdicionProducto(idProducto);
    }

    if (accion === "eliminar") {
        eliminarProducto(idProducto);
    }
}

function prepararEdicionProducto(idProducto) {
    const productoEncontrado = productos.find(
        function (producto) {
            return producto.id === idProducto;
        }
    );

    if (productoEncontrado === undefined) {
        mostrarMensajeProducto(
            "No se encontró el producto.",
            "error"
        );

        return;
    }

    document.getElementById(
        "producto-nombre"
    ).value = productoEncontrado.nombre;

    document.getElementById(
        "producto-categoria"
    ).value = productoEncontrado.categoria;

    document.getElementById(
        "producto-precio"
    ).value = productoEncontrado.precio;

    document.getElementById(
        "producto-existencias"
    ).value = productoEncontrado.existencias;

    productoEditandoId = idProducto;

    document.getElementById(
        "boton-guardar-producto"
    ).textContent = "Guardar cambios";

    document.getElementById(
        "boton-cancelar-producto"
    ).hidden = false;

    mostrarMensajeProducto(
        "Editando producto seleccionado.",
        "informacion"
    );
}

function eliminarProducto(idProducto) {
    const confirmarEliminacion = confirm(
        "¿Deseas eliminar este producto?"
    );

    if (confirmarEliminacion === false) {
        return;
    }

    productos = productos.filter(
        function (producto) {
            return producto.id !== idProducto;
        }
    );

    guardarProductos();
    mostrarProductos();

    if (productoEditandoId === idProducto) {
        limpiarFormularioProducto();
    }

    mostrarMensajeProducto(
        "Producto eliminado correctamente.",
        "exito"
    );
}

function cancelarEdicionProducto() {
    limpiarFormularioProducto();

    mostrarMensajeProducto(
        "Edición cancelada.",
        "informacion"
    );
}

function limpiarFormularioProducto() {
    const formulario = document.getElementById(
        "formulario-productos"
    );

    formulario.reset();

    productoEditandoId = null;

    document.getElementById(
        "boton-guardar-producto"
    ).textContent = "Registrar producto";

    document.getElementById(
        "boton-cancelar-producto"
    ).hidden = true;
}

function mostrarMensajeProducto(texto, tipo) {
    const mensaje = document.getElementById(
        "mensaje-productos"
    );

    mensaje.textContent = texto;
    mensaje.className = tipo;
}