document.addEventListener("DOMContentLoaded", function () {
    console.log("LoginMaster Dashboard iniciado");

    // SESIÓN
    const usuarioLogueado = localStorage.getItem("usuarioLogueado");
    const nombreUsuario = localStorage.getItem("nombreUsuario");
    const rolUsuario = localStorage.getItem("rolUsuario");

    if (!usuarioLogueado) {
        window.location.href = "index.html";
        return;
    }

    // Mostrar usuario y rol
    const elementoNombre = document.getElementById("nombreUsuario");
    if (elementoNombre) {
        elementoNombre.textContent = `${nombreUsuario || usuarioLogueado} (${rolUsuario || "Sin rol"})`;
    }

    // Logout
    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", function () {
            localStorage.removeItem("usuarioLogueado");
            localStorage.removeItem("nombreUsuario");
            localStorage.removeItem("rolUsuario");
            window.location.href = "index.html";
        });
    }

    // Limpiar datos
    const clearDataBtn = document.getElementById("clearDataBtn");
    if (clearDataBtn) {
        clearDataBtn.addEventListener("click", function () {
            if (!window.confirm("¿Deseas borrar todos los datos de clientes, productos y proveedores?")) return;
            localStorage.removeItem("clientes");
            localStorage.removeItem("productos");
            localStorage.removeItem("proveedores");
            window.alert("Los datos se han limpiado correctamente.");
            actualizarContadores();
            generarIndicadores(); // 🔹 regenerar gráficos después de limpiar
        });
    }

    // Inicializar
    actualizarContadores();
    generarIndicadores();

    // Sidebar navegación
    const menuItems = document.querySelectorAll(".menu-item");
    menuItems.forEach(function (item) {
        item.addEventListener("click", function (event) {
            event.preventDefault();
            menuItems.forEach(el => el.classList.remove("active"));
            item.classList.add("active");
            mostrarModulo(item.getAttribute("data-modulo"));
        });
    });

    mostrarModulo("clientes");
});

// CONTADORES
function actualizarContadores() {
    const clientes = obtenerDatosLocalStorage("clientes");
    const productos = obtenerDatosLocalStorage("productos");
    const proveedores = obtenerDatosLocalStorage("proveedores");

    const contadorClientes = document.getElementById("clientes-count");
    const contadorProductos = document.getElementById("productos-count");
    const contadorProveedores = document.getElementById("proveedores-count");

    if (contadorClientes) contadorClientes.textContent = clientes.length;
    if (contadorProductos) contadorProductos.textContent = productos.length;
    if (contadorProveedores) contadorProveedores.textContent = proveedores.length;
}

// INDICADORES
function generarIndicadores() {
    const clientes = obtenerDatosLocalStorage("clientes");
    const productos = obtenerDatosLocalStorage("productos");
    const proveedores = obtenerDatosLocalStorage("proveedores");

    // Clientes
    const ctxClientes = document.getElementById("graficoClientes");
    if (ctxClientes) {
        new Chart(ctxClientes, {
            type: "bar",
            data: {
                labels: ["Clientes"],
                datasets: [{
                    label: "Cantidad",
                    data: [clientes.length],
                    backgroundColor: "#0078d7"
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } }
            }
        });
    }

    // Productos
    const ctxProductos = document.getElementById("graficoProductos");
    if (ctxProductos) {
        new Chart(ctxProductos, {
            type: "pie",
            data: {
                labels: ["Registrados", "Espacio libre"],
                datasets: [{
                    data: [productos.length, Math.max(0, 50 - productos.length)],
                    backgroundColor: ["#28a745", "#ccc"]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        });
    }

    // Proveedores
    const ctxProveedores = document.getElementById("graficoProveedores");
    if (ctxProveedores) {
        new Chart(ctxProveedores, {
            type: "doughnut",
            data: {
                labels: ["Proveedores activos"],
                datasets: [{
                    data: [proveedores.length],
                    backgroundColor: ["#6f42c1"]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        });
    }
}

// LEER LOCALSTORAGE
function obtenerDatosLocalStorage(clave) {
    try {
        const datos = localStorage.getItem(clave);
        if (!datos) return [];
        const resultado = JSON.parse(datos);
        return Array.isArray(resultado) ? resultado : [];
    } catch (error) {
        console.error("Error leyendo " + clave, error);
        return [];
    }
}

// MOSTRAR MÓDULOS
function mostrarModulo(modulo) {
    const secciones = {
        clientes: document.getElementById("modulo-clientes"),
        productos: document.getElementById("modulo-productos"),
        proveedores: document.getElementById("modulo-proveedores")
    };

    Object.keys(secciones).forEach(function (nombre) {
        const seccion = secciones[nombre];
        if (!seccion) return;
        seccion.style.display = "block";
        if (nombre === modulo) {
            seccion.classList.add("is-active");
            seccion.scrollIntoView({ behavior: "smooth", block: "start" });
        } else {
            seccion.classList.remove("is-active");
        }
    });
}

window.actualizarContadores = actualizarContadores;
