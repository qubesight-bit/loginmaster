"use strict";

/*
 * =========================================================
 * LOGINMASTER - CAPA DE DATOS
 * =========================================================
 *
 * Este archivo es el único responsable de leer y escribir
 * la base administrativa almacenada en LocalStorage.
 *
 * Los módulos de interfaz deberán utilizar DataService en
 * lugar de acceder directamente a LocalStorage.
 */

const DataService = (function () {
    const CLAVE_BASE_DATOS = "loginmaster_db";
    const VERSION_BASE_DATOS = 2;

    const ENTIDADES_PERMITIDAS = [
        "clientes",
        "productos",
        "proveedores",
        "pedidos",
        "usuarios"
    ];

    /*
     * Crea la estructura inicial de la base.
     */
    function crearBaseVacia() {
        const fechaActual = new Date().toISOString();

        return {
            version: VERSION_BASE_DATOS,

            clientes: [],
            productos: [],
            proveedores: [],
            pedidos: [],
            usuarios: [],

            configuracion: {
                inventarioBajo: 10,
                registrosPorPagina: 15
            },

            metadatos: {
                creadaEn: fechaActual,
                actualizadaEn: fechaActual,
                datosAntiguosMigrados: false
            }
        };
    }

    /*
     * Produce una copia para evitar que otros módulos
     * modifiquen directamente los arreglos internos.
     */
    function copiarDatos(datos) {
        return JSON.parse(JSON.stringify(datos));
    }

    /*
     * Comprueba que el nombre recibido corresponda
     * a una entidad válida del sistema.
     */
    function validarEntidad(entidad) {
        if (!ENTIDADES_PERMITIDAS.includes(entidad)) {
            throw new Error(
                `La entidad "${entidad}" no existe.`
            );
        }
    }

    /*
     * Lee de manera segura una llave antigua.
     */
    function leerArregloAntiguo(clave) {
        try {
            const contenido =
                localStorage.getItem(clave);

            if (contenido === null) {
                return [];
            }

            const resultado =
                JSON.parse(contenido);

            if (!Array.isArray(resultado)) {
                return [];
            }

            return resultado;
        } catch (error) {
            console.error(
                `No fue posible leer la llave antigua "${clave}".`,
                error
            );

            return [];
        }
    }

    /*
     * Asegura que la base tenga todos los campos requeridos.
     */
    function normalizarBase(baseRecibida) {
        const baseNormalizada = crearBaseVacia();

        if (
            baseRecibida === null ||
            typeof baseRecibida !== "object" ||
            Array.isArray(baseRecibida)
        ) {
            return baseNormalizada;
        }

        ENTIDADES_PERMITIDAS.forEach(
            function (entidad) {
                if (Array.isArray(baseRecibida[entidad])) {
                    baseNormalizada[entidad] =
                        baseRecibida[entidad];
                }
            }
        );

        if (
            baseRecibida.configuracion &&
            typeof baseRecibida.configuracion === "object"
        ) {
            const inventarioBajo = Number(
                baseRecibida.configuracion.inventarioBajo
            );

            const registrosPorPagina = Number(
                baseRecibida.configuracion.registrosPorPagina
            );

            if (
                Number.isFinite(inventarioBajo) &&
                inventarioBajo >= 0
            ) {
                baseNormalizada.configuracion.inventarioBajo =
                    inventarioBajo;
            }

            if (
                Number.isInteger(registrosPorPagina) &&
                registrosPorPagina > 0
            ) {
                baseNormalizada.configuracion.registrosPorPagina =
                    registrosPorPagina;
            }
        }

        if (
            baseRecibida.metadatos &&
            typeof baseRecibida.metadatos === "object"
        ) {
            baseNormalizada.metadatos = {
                ...baseNormalizada.metadatos,
                ...baseRecibida.metadatos
            };
        }

        baseNormalizada.version =
            VERSION_BASE_DATOS;

        return baseNormalizada;
    }

    /*
     * Guarda la base completa.
     */
    function guardarBase(baseDatos, entidadModificada) {
        const baseNormalizada =
            normalizarBase(baseDatos);

        baseNormalizada.metadatos.actualizadaEn =
            new Date().toISOString();

        localStorage.setItem(
            CLAVE_BASE_DATOS,
            JSON.stringify(baseNormalizada)
        );

        emitirCambio(
            entidadModificada || "base",
            baseNormalizada
        );

        return copiarDatos(baseNormalizada);
    }

    /*
     * Informa a la interfaz que los datos cambiaron.
     */
    function emitirCambio(entidad, baseDatos) {
        const detalle = {
            entidad: entidad,
            baseDatos: copiarDatos(baseDatos)
        };

        window.dispatchEvent(
            new CustomEvent(
                "loginmaster:data-changed",
                {
                    detail: detalle
                }
            )
        );
    }

    /*
     * Migra los arreglos que la versión 1 guardaba
     * en llaves separadas.
     *
     * Durante esta primera etapa no se eliminan las llaves
     * antiguas, porque los CRUD todavía las utilizan.
     */
    function migrarDatosAntiguos(baseDatos) {
        const clientesAntiguos =
            leerArregloAntiguo("clientes");

        const productosAntiguos =
            leerArregloAntiguo("productos");

        const proveedoresAntiguos =
            leerArregloAntiguo("proveedores");

        let huboMigracion = false;

        if (
            baseDatos.clientes.length === 0 &&
            clientesAntiguos.length > 0
        ) {
            baseDatos.clientes =
                clientesAntiguos;

            huboMigracion = true;
        }

        if (
            baseDatos.productos.length === 0 &&
            productosAntiguos.length > 0
        ) {
            baseDatos.productos =
                productosAntiguos;

            huboMigracion = true;
        }

        if (
            baseDatos.proveedores.length === 0 &&
            proveedoresAntiguos.length > 0
        ) {
            baseDatos.proveedores =
                proveedoresAntiguos;

            huboMigracion = true;
        }

        if (huboMigracion) {
            baseDatos.metadatos.datosAntiguosMigrados =
                true;

            baseDatos.metadatos.migradosEn =
                new Date().toISOString();
        }

        return baseDatos;
    }

    /*
     * Inicializa la base central.
     */
    function inicializar() {
        try {
            const contenidoGuardado =
                localStorage.getItem(CLAVE_BASE_DATOS);

            let baseDatos;

            if (contenidoGuardado === null) {
                baseDatos = crearBaseVacia();
            } else {
                baseDatos = normalizarBase(
                    JSON.parse(contenidoGuardado)
                );
            }

            baseDatos =
                migrarDatosAntiguos(baseDatos);

            guardarBase(
                baseDatos,
                "inicializacion"
            );

            return copiarDatos(baseDatos);
        } catch (error) {
            console.error(
                "No fue posible inicializar la base de datos.",
                error
            );

            const baseRecuperada =
                crearBaseVacia();

            guardarBase(
                baseRecuperada,
                "recuperacion"
            );

            return copiarDatos(baseRecuperada);
        }
    }

    /*
     * Obtiene la base completa.
     */
    function obtenerBase() {
        try {
            const contenido =
                localStorage.getItem(CLAVE_BASE_DATOS);

            if (contenido === null) {
                return inicializar();
            }

            return copiarDatos(
                normalizarBase(
                    JSON.parse(contenido)
                )
            );
        } catch (error) {
            console.error(
                "No fue posible leer la base de datos.",
                error
            );

            return inicializar();
        }
    }

    /*
     * Obtiene todos los registros de una entidad.
     */
    function obtenerTodos(entidad) {
        validarEntidad(entidad);

        const baseDatos =
            obtenerBase();

        return copiarDatos(
            baseDatos[entidad]
        );
    }

    /*
     * Busca un registro según su identificador.
     */
    function obtenerPorId(entidad, id) {
        validarEntidad(entidad);

        const registros =
            obtenerTodos(entidad);

        const registroEncontrado =
            registros.find(
                function (registro) {
                    return String(registro.id) ===
                        String(id);
                }
            );

        if (registroEncontrado === undefined) {
            return null;
        }

        return copiarDatos(registroEncontrado);
    }

    /*
     * Genera identificadores para registros nuevos.
     */
    function generarId(entidad) {
        const prefijos = {
            clientes: "CLI",
            productos: "PRO",
            proveedores: "PRV",
            pedidos: "PED",
            usuarios: "USR"
        };

        const parteTiempo =
            Date.now().toString(36).toUpperCase();

        const parteAleatoria =
            Math.random()
                .toString(36)
                .slice(2, 7)
                .toUpperCase();

        return (
            prefijos[entidad] +
            "-" +
            parteTiempo +
            "-" +
            parteAleatoria
        );
    }

    /*
     * Agrega un registro nuevo.
     */
    function crear(entidad, datosRegistro) {
        validarEntidad(entidad);

        if (
            datosRegistro === null ||
            typeof datosRegistro !== "object" ||
            Array.isArray(datosRegistro)
        ) {
            throw new Error(
                "Los datos del registro no son válidos."
            );
        }

        const baseDatos =
            obtenerBase();

        const nuevoRegistro = {
            ...copiarDatos(datosRegistro),

            id:
                datosRegistro.id ||
                generarId(entidad),

            creadoEn:
                datosRegistro.creadoEn ||
                new Date().toISOString(),

            actualizadoEn:
                new Date().toISOString()
        };

        const idDuplicado =
            baseDatos[entidad].some(
                function (registro) {
                    return String(registro.id) ===
                        String(nuevoRegistro.id);
                }
            );

        if (idDuplicado) {
            throw new Error(
                `Ya existe un registro con el identificador "${nuevoRegistro.id}".`
            );
        }

        baseDatos[entidad].push(
            nuevoRegistro
        );

        guardarBase(
            baseDatos,
            entidad
        );

        return copiarDatos(
            nuevoRegistro
        );
    }

    /*
     * Actualiza un registro existente.
     */
    function actualizar(entidad, id, cambios) {
        validarEntidad(entidad);

        if (
            cambios === null ||
            typeof cambios !== "object" ||
            Array.isArray(cambios)
        ) {
            throw new Error(
                "Los cambios recibidos no son válidos."
            );
        }

        const baseDatos =
            obtenerBase();

        const indiceRegistro =
            baseDatos[entidad].findIndex(
                function (registro) {
                    return String(registro.id) ===
                        String(id);
                }
            );

        if (indiceRegistro === -1) {
            throw new Error(
                `No se encontró el registro "${id}".`
            );
        }

        const registroAnterior =
            baseDatos[entidad][indiceRegistro];

        const registroActualizado = {
            ...registroAnterior,
            ...copiarDatos(cambios),

            id: registroAnterior.id,

            actualizadoEn:
                new Date().toISOString()
        };

        baseDatos[entidad][indiceRegistro] =
            registroActualizado;

        guardarBase(
            baseDatos,
            entidad
        );

        return copiarDatos(
            registroActualizado
        );
    }

    /*
     * Elimina un registro según su identificador.
     */
    function eliminar(entidad, id) {
        validarEntidad(entidad);

        const baseDatos =
            obtenerBase();

        const indiceRegistro =
            baseDatos[entidad].findIndex(
                function (registro) {
                    return String(registro.id) ===
                        String(id);
                }
            );

        if (indiceRegistro === -1) {
            return null;
        }

        const registrosEliminados =
            baseDatos[entidad].splice(
                indiceRegistro,
                1
            );

        guardarBase(
            baseDatos,
            entidad
        );

        return copiarDatos(
            registrosEliminados[0]
        );
    }

    /*
     * Reemplaza todos los registros de una entidad.
     * Será utilizado durante la importación de datos.
     */
    function reemplazarTodos(entidad, registros) {
        validarEntidad(entidad);

        if (!Array.isArray(registros)) {
            throw new Error(
                "Los registros deben enviarse como un arreglo."
            );
        }

        const baseDatos =
            obtenerBase();

        baseDatos[entidad] =
            copiarDatos(registros);

        guardarBase(
            baseDatos,
            entidad
        );

        return obtenerTodos(entidad);
    }

    /*
     * Borra todos los registros de una entidad.
     */
    function limpiarEntidad(entidad) {
        return reemplazarTodos(
            entidad,
            []
        );
    }

    /*
     * Obtiene la configuración.
     */
    function obtenerConfiguracion() {
        const baseDatos =
            obtenerBase();

        return copiarDatos(
            baseDatos.configuracion
        );
    }

    /*
     * Actualiza la configuración.
     */
    function actualizarConfiguracion(cambios) {
        if (
            cambios === null ||
            typeof cambios !== "object" ||
            Array.isArray(cambios)
        ) {
            throw new Error(
                "La configuración recibida no es válida."
            );
        }

        const baseDatos =
            obtenerBase();

        baseDatos.configuracion = {
            ...baseDatos.configuracion,
            ...copiarDatos(cambios)
        };

        guardarBase(
            baseDatos,
            "configuracion"
        );

        return obtenerConfiguracion();
    }

    /*
     * Sustituye la base completa.
     * Se utilizará para importar un archivo JSON.
     */
    function reemplazarBase(baseNueva) {
        const baseNormalizada =
            normalizarBase(baseNueva);

        guardarBase(
            baseNormalizada,
            "importacion"
        );

        return obtenerBase();
    }

    /*
     * Reinicia únicamente los datos administrativos.
     */
    function limpiarDatosAdministrativos() {
        const baseDatos =
            obtenerBase();

        baseDatos.clientes = [];
        baseDatos.productos = [];
        baseDatos.proveedores = [];
        baseDatos.pedidos = [];

        guardarBase(
            baseDatos,
            "limpieza"
        );

        return obtenerBase();
    }

    return {
        CLAVE_BASE_DATOS:
            CLAVE_BASE_DATOS,

        VERSION_BASE_DATOS:
            VERSION_BASE_DATOS,

        inicializar:
            inicializar,

        obtenerBase:
            obtenerBase,

        obtenerTodos:
            obtenerTodos,

        obtenerPorId:
            obtenerPorId,

        crear:
            crear,

        actualizar:
            actualizar,

        eliminar:
            eliminar,

        reemplazarTodos:
            reemplazarTodos,

        limpiarEntidad:
            limpiarEntidad,

        obtenerConfiguracion:
            obtenerConfiguracion,

        actualizarConfiguracion:
            actualizarConfiguracion,

        reemplazarBase:
            reemplazarBase,

        limpiarDatosAdministrativos:
            limpiarDatosAdministrativos
    };
})();

/*
 * Se hace disponible para los demás módulos.
 */
window.DataService = DataService;

/*
 * Crea o migra la base al cargar este archivo.
 */
DataService.inicializar();