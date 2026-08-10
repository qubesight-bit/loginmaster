document.addEventListener("DOMContentLoaded", function () {
    console.log("LoginMaster Dashboard iniciado");

    // ==========================================
    // VERIFICAR SESIÓN
    // ==========================================

    const usuarioLogueado =
        localStorage.getItem("usuarioLogueado");

    const nombreUsuario =
        localStorage.getItem("nombreUsuario");

    if (!usuarioLogueado) {
        window.location.href = "index.html";
        return;
    }

    // ==========================================
    // MOSTRAR USUARIO
    // ==========================================

    const elementoNombre =
        document.getElementById("nombreUsuario");

    if (elementoNombre) {
        elementoNombre.textContent =
            nombreUsuario || usuarioLogueado || "Usuario";
    }

    // ==========================================
    // CERRAR SESIÓN
    // ==========================================

    const logoutBtn =
        document.getElementById("logoutBtn");

    if (logoutBtn) {
        logoutBtn.addEventListener(
            "click",
            function () {
                /*
                 * Solamente elimina la información de la sesión.
                 * Los clientes, productos y proveedores se conservan.
                 */
                localStorage.removeItem("usuarioLogueado");
                localStorage.removeItem("nombreUsuario");

                window.location.href = "index.html";
            }
        );
    }

    // ==========================================
    // BOTÓN LIMPIAR DATOS
    // ==========================================

    const clearDataBtn =
        document.getElementById("clearDataBtn");

    if (clearDataBtn) {
        clearDataBtn.addEventListener(
            "click",
            function () {
                const confirmar =
                    window.confirm(
                        "¿Deseas borrar todos los datos de clientes, productos y proveedores?"
                    );

                if (!confirmar) {
                    return;
                }

                /*
                 * Solo elimina los datos administrativos.
                 * No elimina la sesión ni otras configuraciones.
                 */
                localStorage.removeItem("clientes");
                localStorage.removeItem("productos");
                localStorage.removeItem("proveedores");

                window.alert(
                    "Los datos se han limpiado correctamente."
                );

                /*
                 * Recarga la página para que los arreglos internos
                 * de cada CRUD vuelvan a cargarse vacíos.
                 */
                window.location.reload();
            }
        );
    }

    // ==========================================
    // ACTUALIZAR CONTADORES
    // ==========================================

    actualizarContadores();

    // ==========================================
    // NAVEGACIÓN DEL SIDEBAR
    // ==========================================

    const menuItems =
        document.querySelectorAll(".menu-item");

    menuItems.forEach(function (item) {
        item.addEventListener(
            "click",
            function (event) {
                event.preventDefault();

                menuItems.forEach(function (elemento) {
                    elemento.classList.remove("active");
                });

                item.classList.add("active");

                const modulo =
                    item.getAttribute("data-modulo");

                mostrarModulo(modulo);
            }
        );
    });

    // ==========================================
    // MOSTRAR CLIENTES INICIALMENTE
    // ==========================================

    mostrarModulo("clientes");
});

// ==========================================
// ACTUALIZAR CONTADORES
// ==========================================

function actualizarContadores() {
    const clientes =
        obtenerDatosLocalStorage("clientes");

    const productos =
        obtenerDatosLocalStorage("productos");

    const proveedores =
        obtenerDatosLocalStorage("proveedores");

    const contadorClientes =
        document.getElementById("clientes-count");

    const contadorProductos =
        document.getElementById("productos-count");

    const contadorProveedores =
        document.getElementById("proveedores-count");

    if (contadorClientes) {
        contadorClientes.textContent =
            clientes.length;
    }

    if (contadorProductos) {
        contadorProductos.textContent =
            productos.length;
    }

    if (contadorProveedores) {
        contadorProveedores.textContent =
            proveedores.length;
    }
}

// ==========================================
// LEER LOCALSTORAGE
// ==========================================

function obtenerDatosLocalStorage(clave) {
    try {
        const datos =
            localStorage.getItem(clave);

        if (!datos) {
            return [];
        }

        const resultado =
            JSON.parse(datos);

        if (Array.isArray(resultado)) {
            return resultado;
        }

        return [];
    } catch (error) {
        console.error(
            "Error leyendo " + clave,
            error
        );

        return [];
    }
}

// ==========================================
// MOSTRAR LOS MÓDULOS
// ==========================================

function mostrarModulo(modulo) {
    const secciones = {
        clientes:
            document.getElementById(
                "modulo-clientes"
            ),

        productos:
            document.getElementById(
                "modulo-productos"
            ),

        proveedores:
            document.getElementById(
                "modulo-proveedores"
            )
    };

    Object.keys(secciones).forEach(
        function (nombre) {
            const seccion =
                secciones[nombre];

            if (!seccion) {
                return;
            }

            /*
             * Conservamos todos los módulos renderizados.
             * La navegación desplaza la pantalla al seleccionado.
             */
            seccion.style.display = "block";

            if (nombre === modulo) {
                seccion.classList.add("is-active");

                seccion.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            } else {
                seccion.classList.remove("is-active");
            }
        }
    );
}

// ==========================================
// PERMITIR QUE LOS CRUD ACTUALICEN LAS TARJETAS
// ==========================================

window.actualizarContadores =
    actualizarContadores;