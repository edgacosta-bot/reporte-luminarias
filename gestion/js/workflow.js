"use strict";

/* ==========================================================
   SIGE
   Sistema Integral de Gestión Institucional

   Archivo:
   js/workflow.js

   Responsabilidad:

   Única capa autorizada para comunicarse
   con Supabase / RPC.

========================================================== */

const Workflow = {

    abrirObra,
    abrirActuacion,
    obtenerPrivadas,
    obtenerLotes,
    obtenerCalles,
    obtenerExpedientes,
    obtenerTiposObra,
    crearObra,
    registrarDocumentoRequisito,
    sustituirDocumentoRequisito,
    consultarDocumento,
    cumplirRequisito,
    guardarDatosPropietario,
    guardarDatosDRO

};
/* ==========================================================
   OBTENER PRIVADAS
========================================================== */

async function obtenerPrivadas() {

    const {
        data,
        error
    } = await supabaseClient

        .from("lotes")

        .select("privada")

        .order("privada");

    if (error) {

        console.error(error);

        throw error;

    }

    return [

        ...new Set(

            data.map(

                x => x.privada

            )

        )

    ];

}


/* ==========================================================
   OBTENER LOTES DISPONIBLES
========================================================== */

async function obtenerLotes(privada) {

    const {

        data,

        error

    } = await supabaseClient.rpc(

        "obtener_lotes_disponibles",

        {

            p_privada: privada

        }

    );

    if (error) {

        console.error(error);

        throw error;

    }

    return data;

}

async function obtenerCalles(privada) {

    const { data, error } =
        await window.supabaseClient.rpc(
            "obtener_calles_por_privada",
            {
                p_privada: privada
            }
        );

    if (error)
        throw error;

    return data ?? [];

}

/* ==========================================================
   OBTENER Tipos de Obras
========================================================== */

async function obtenerTiposObra() {

    const { data, error } =
        await window.supabaseClient.rpc(
            "obtener_tipos_obra"
        );

    console.log("RPC obtener_tipos_obra");
    console.log({ data, error });

    if (error)
        throw error;

    return data ?? [];

}

/* ==========================================================
   OBTENER EXPEDIENTES
========================================================== */

async function obtenerExpedientes() {

    const {

        data,

        error

    } = await supabaseClient.rpc(

        "obtener_bandeja_expedientes"

    );

    if (error) {

        console.error(error);

        throw error;

    }

    return data ?? [];

}

/* ==========================================================
   ABRIR EXPEDIENTE
========================================================== */

async function abrirObra(idExpediente) {

    console.log(
        "Workflow.abrirObra()",
        idExpediente
    );

    if (!idExpediente) {

        throw new Error(
            "No se recibió el identificador del expediente."
        );

    }

    const {
        data,
        error
    } = await supabaseClient.rpc(

        "obtener_escritorio_expediente",

        {

            p_expediente_id:
                idExpediente

        }

    );

    if (error) {

        console.error(error);

        throw error;

    }

    if (!data) {

        throw new Error(
            "El expediente no existe."
        );

    }

    console.log(
        "Expediente recibido:",
        data
    );

    return data;

}


/* ==========================================================
   CREAR OBRA

   (Temporal)

========================================================== */

async function crearObra(parametros) {

    console.log(
        "Workflow.crearObra()",
        parametros
    );

    const respuesta =
        await window.supabaseClient.rpc(
            "crear_obra",
            parametros
        );

    console.log(
        "Workflow.crearObra respuesta completa:",
        respuesta
    );

    return respuesta;

}


/* ==========================================================
   ACTUACIÓN
========================================================== */

async function abrirActuacion(idActuacion){

    return Store.obtenerActuacion(

        idActuacion

    );

}

async function registrarDocumentoRequisito(
    expedienteRequisitoId,
    bucket,
    rutaStorage,
    nombreArchivo,
    mimeType,
    tamanoBytes
) {

 const { data, error: errorRpc } =
    await window.supabaseClient.rpc(
        "registrar_documento_requisito",
        {
            p_expediente_requisito_id: expedienteRequisitoId,
            p_bucket: bucket,
            p_ruta_storage: rutaStorage,
            p_nombre_archivo: nombreArchivo,
            p_mime_type: mimeType,
            p_tamano_bytes: tamanoBytes
        }
    );


return {
    data,
    error: errorRpc
};

}

async function sustituirDocumentoRequisito(
    expedienteRequisitoId,
    bucket,
    rutaStorage,
    nombreArchivo,
    mimeType,
    tamanoBytes
) {

    const {
        data,
        error: errorRpc
    } = await window.supabaseClient.rpc(
        "sustituir_documento_requisito",
        {
            p_expediente_requisito_id: expedienteRequisitoId,
            p_bucket: bucket,
            p_ruta_storage: rutaStorage,
            p_nombre_archivo: nombreArchivo,
            p_mime_type: mimeType,
            p_tamano_bytes: tamanoBytes
        }
    );

    return {
        data,
        error: errorRpc
    };

}

async function consultarDocumento(
    expedienteRequisitoId
) {

    const {
        data,
        error
    } = await window.supabaseClient.rpc(
        "consultar_documento_requisito",
        {
            p_expediente_requisito_id:
                expedienteRequisitoId
        }
    );

    if (
        error ||
        !data?.ok
    ) {

        return {
            data,
            error
        };

    }

    const {
        data: urlData
    } = window.supabaseClient.storage
        .from(data.bucket)
        .getPublicUrl(
            data.ruta_storage
        );

    return {
        data: {
            ok: true,
            url: urlData.publicUrl,
            archivo_nombre: data.archivo_nombre
        },
        error: null
    };

}


async function cumplirRequisito(
    requisitoId,
    valor
) {

   console.log("RPC cumplir_requisito:", {
    requisitoId,
    valor
});

   const { data, error } =
    await window.supabaseClient.rpc(
        "cumplir_requisito",
        {
            p_requisito_id: requisitoId,
            p_valor: valor
        }
    );

   if (error)
    throw error;

   return data;

}

async function guardarDatosDRO(
    obraId,
    datos
) {


    console.log(
        "Workflow.guardarDatosDRO()",
        {
            obraId,
            datos
        }
    );


    const {
        data,
        error
    } = await window.supabaseClient.rpc(

        "guardar_datos_dro",

        {

            p_obra_id:
                obraId,

            p_nombre:
                datos.nombre,

            p_telefono:
                datos.telefono,

            p_correo:
                datos.correo

        }

    );


    if (error) {

        console.error(error);

        throw error;

    }


    return data;


}

async function guardarDatosPropietario(
    obraId,
    datos
) {


    console.log(
        "Workflow.guardarDatosPropietario()",
        {
            obraId,
            datos
        }
    );


    const {
        data,
        error
    } = await window.supabaseClient.rpc(

        "guardar_datos_propietario",

        {

            p_obra_id:
                obraId,

            p_nombre:
                datos.nombre,

            p_telefono:
                datos.telefono,

            p_correo:
                datos.correo

        }

    );


    if (error) {

        console.error(error);

        throw error;

    }


    return data;


}

/* ==========================================================
   EXPORTACIÓN
========================================================== */

window.Workflow =
    Workflow;
