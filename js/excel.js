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