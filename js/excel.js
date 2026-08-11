document.addEventListener(
    "DOMContentLoaded",
    function () {

        const excelUpload =
            document.getElementById(
                "excelUpload"
            );

        const exportExcelBtn =
            document.getElementById(
                "exportExcelBtn"
            );

        const importJsonBtn =
            document.getElementById(
                "importJsonBtn"
            );

        const jsonUpload =
            document.getElementById(
                "jsonUpload"
            );

        const exportJsonBtn =
            document.getElementById(
                "exportJsonBtn"
            );

        if (excelUpload) {
            excelUpload.addEventListener(
                "change",
                importarExcel
            );
        }

        if (exportExcelBtn) {
            exportExcelBtn.addEventListener(
                "click",
                exportarExcel
            );
        }

        if (importJsonBtn) {
            importJsonBtn.addEventListener(
                "click",
                function () {
                    if (jsonUpload) {
                        jsonUpload.click();
                    }
                }
            );
        }

        if (jsonUpload) {
            jsonUpload.addEventListener(
                "change",
                importarJson
            );
        }

        if (exportJsonBtn) {
            exportJsonBtn.addEventListener(
                "click",
                exportarJson
            );
        }

    }
);


// ==========================================
// IMPORTAR EXCEL
// ==========================================

function importarExcel(event) {

    const archivo =
        event.target.files[0];


    if (!archivo) {

        return;

    }


    if (typeof XLSX === "undefined") {

        alert(
            "No se pudo cargar la librería de Excel."
        );

        return;

    }


    const lector =
        new FileReader();


    lector.onload =
        function (e) {

            try {

                const datos =
                    new Uint8Array(
                        e.target.result
                    );


                const workbook =
                    XLSX.read(
                        datos,
                        {
                            type: "array"
                        }
                    );


                let seImportoAlgo = false;


                // ==================================
                // CLIENTES
                // ==================================

                const hojaClientes =
                    buscarHoja(
                        workbook,
                        [
                            "Clientes",
                            "clientes"
                        ]
                    );


                if (hojaClientes) {

                    const datosClientes =
                        XLSX.utils.sheet_to_json(
                            hojaClientes,
                            {
                                defval: ""
                            }
                        );


                    const clientesNormalizados =
                        datosClientes.map(
                            function (cliente) {

                                return {

                                    id:
                                        cliente.id ||
                                        Date.now() +
                                        Math.random(),

                                    nombre:
                                        cliente.nombre ||
                                        cliente.Nombre ||
                                        "",

                                    correo:
                                        cliente.correo ||
                                        cliente.Correo ||
                                        "",

                                    telefono:
                                        cliente.telefono ||
                                        cliente.Telefono ||
                                        "",

                                    estado:
                                        cliente.estado ||
                                        cliente.Estado ||
                                        "activo"

                                };

                            }
                        );


                    localStorage.setItem(
                        "clientes",
                        JSON.stringify(
                            clientesNormalizados
                        )
                    );


                    seImportoAlgo = true;

                }


                // ==================================
                // PRODUCTOS
                // ==================================

                const hojaProductos =
                    buscarHoja(
                        workbook,
                        [
                            "Productos",
                            "productos"
                        ]
                    );


                if (hojaProductos) {

                    const datosProductos =
                        XLSX.utils.sheet_to_json(
                            hojaProductos,
                            {
                                defval: ""
                            }
                        );


                    const productosNormalizados =
                        datosProductos.map(
                            function (producto) {

                                return {

                                    id:
                                        producto.id ||
                                        Date.now() +
                                        Math.random(),

                                    nombre:
                                        producto.nombre ||
                                        producto.Nombre ||
                                        "",

                                    categoria:
                                        producto.categoria ||
                                        producto.Categoria ||
                                        "",

                                    precio:
                                        Number(
                                            producto.precio ||
                                            producto.Precio ||
                                            0
                                        ),

                                    existencias:
                                        Number(
                                            producto.existencias ||
                                            producto.Existencias ||
                                            0
                                        )

                                };

                            }
                        );


                    localStorage.setItem(
                        "productos",
                        JSON.stringify(
                            productosNormalizados
                        )
                    );


                    seImportoAlgo = true;

                }


                // ==================================
                // PROVEEDORES
                // ==================================

                const hojaProveedores =
                    buscarHoja(
                        workbook,
                        [
                            "Proveedores",
                            "proveedores"
                        ]
                    );


                if (hojaProveedores) {

                    const datosProveedores =
                        XLSX.utils.sheet_to_json(
                            hojaProveedores,
                            {
                                defval: ""
                            }
                        );


                    const proveedoresNormalizados =
                        datosProveedores.map(
                            function (proveedor) {

                                return {

                                    id:
                                        proveedor.id ||
                                        Date.now() +
                                        Math.random(),

                                    empresa:
                                        proveedor.empresa ||
                                        proveedor.Empresa ||
                                        "",

                                    contacto:
                                        proveedor.contacto ||
                                        proveedor.Contacto ||
                                        "",

                                    correo:
                                        proveedor.correo ||
                                        proveedor.Correo ||
                                        "",

                                    telefono:
                                        proveedor.telefono ||
                                        proveedor.Telefono ||
                                        ""

                                };

                            }
                        );


                    localStorage.setItem(
                        "proveedores",
                        JSON.stringify(
                            proveedoresNormalizados
                        )
                    );


                    seImportoAlgo = true;

                }


                if (!seImportoAlgo) {

                    alert(
                        "El archivo no contiene las hojas Clientes, Productos o Proveedores."
                    );

                    return;

                }


                alert(
                    "¡Datos importados correctamente!"
                );


                location.reload();


            } catch (error) {

                console.error(
                    "Error importando Excel:",
                    error
                );


                alert(
                    "No se pudo leer el archivo Excel."
                );

            }

        };


    lector.readAsArrayBuffer(
        archivo
    );


    event.target.value = "";

}


// ==========================================
// BUSCAR HOJA
// ==========================================

function buscarHoja(
    workbook,
    nombres
) {

    for (
        let i = 0;
        i < nombres.length;
        i++
    ) {

        const nombre =
            nombres[i];


        if (
            workbook.Sheets[nombre]
        ) {

            return workbook.Sheets[
                nombre
            ];

        }

    }


    return null;

}


// ==========================================
// EXPORTAR EXCEL
// ==========================================

function exportarExcel() {

    if (
        typeof XLSX === "undefined"
    ) {

        alert(
            "No se pudo cargar la librería Excel."
        );

        return;

    }


    const clientes =
        obtenerDatos(
            "clientes"
        );

    const productos =
        obtenerDatos(
            "productos"
        );

    const proveedores =
        obtenerDatos(
            "proveedores"
        );


    const workbook =
        XLSX.utils.book_new();


    const hojaClientes =
        XLSX.utils.json_to_sheet(
            clientes
        );


    const hojaProductos =
        XLSX.utils.json_to_sheet(
            productos
        );


    const hojaProveedores =
        XLSX.utils.json_to_sheet(
            proveedores
        );


    XLSX.utils.book_append_sheet(
        workbook,
        hojaClientes,
        "Clientes"
    );


    XLSX.utils.book_append_sheet(
        workbook,
        hojaProductos,
        "Productos"
    );


    XLSX.utils.book_append_sheet(
        workbook,
        hojaProveedores,
        "Proveedores"
    );


    XLSX.writeFile(
        workbook,
        "LoginMaster_Backup.xlsx"
    );

}


// ==========================================
// IMPORTAR JSON
// ==========================================

function importarJson(event) {

    const archivo = event.target.files[0];

    if (!archivo) {
        return;
    }

    const lector = new FileReader();

    lector.onload = function (e) {
        try {
            const datos = JSON.parse(e.target.result);
            const payload = datos && datos.data ? datos.data : datos;

            const clientes = Array.isArray(payload.clientes) ? payload.clientes : [];
            const productos = Array.isArray(payload.productos) ? payload.productos : [];
            const proveedores = Array.isArray(payload.proveedores) ? payload.proveedores : [];

            localStorage.setItem("clientes", JSON.stringify(clientes));
            localStorage.setItem("productos", JSON.stringify(productos));
            localStorage.setItem("proveedores", JSON.stringify(proveedores));

            alert("¡Datos JSON importados correctamente!");
            location.reload();

        } catch (error) {
            console.error("Error importando JSON:", error);
            alert("No se pudo leer el archivo JSON.");
        }
    };

    lector.readAsText(archivo);
    event.target.value = "";
}


// ==========================================
// EXPORTAR JSON
// ==========================================

function exportarJson() {

    const payload = {
        exportadoEn: new Date().toISOString(),
        clientes: obtenerDatos("clientes"),
        productos: obtenerDatos("productos"),
        proveedores: obtenerDatos("proveedores")
    };

    const contenido = JSON.stringify(payload, null, 2);
    const blob = new Blob([contenido], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const enlace = document.createElement("a");

    enlace.href = url;
    enlace.download = "LoginMaster_Datos.json";
    document.body.appendChild(enlace);
    enlace.click();
    document.body.removeChild(enlace);
    URL.revokeObjectURL(url);
}


// ==========================================
// OBTENER DATOS
// ==========================================

function obtenerDatos(clave) {

    try {

        const datos =
            localStorage.getItem(
                clave
            );


        if (!datos) {

            return [];

        }


        const resultado =
            JSON.parse(datos);


        return Array.isArray(resultado)
            ? resultado
            : [];


    } catch (error) {

        console.error(error);

        return [];

    }

}