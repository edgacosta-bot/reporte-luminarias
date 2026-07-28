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

    registrarDocumentoRequisito

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

    console.log("Workflow.crearObra()", parametros);
   
    return await window.supabaseClient.rpc(
    "crear_expediente",
    parametros
);

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

  const {
    data,
    error
} = await Workflow.registrarDocumentoRequisito(
    expedienteRequisitoId,
    bucket,
    rutaStorage,
    nombreArchivo,
    mimeType,
    tamanoBytes
);

console.log("RPC:", data, error);
}

/* ==========================================================
   EXPORTACIÓN
========================================================== */

window.Workflow =
    Workflow;
