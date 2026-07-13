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

    crearObra

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

async function crearObra({

    privada,

    lote,

    tipo

}){

    console.log(

        "Nueva obra",

        privada,

        lote,

        tipo

    );

    /*
       FRONT-006

       Sustituir por:

       rpc(
          crear_expediente_obra
       );

    */

    return true;

}


/* ==========================================================
   ACTUACIÓN
========================================================== */

async function abrirActuacion(idActuacion){

    return Store.obtenerActuacion(

        idActuacion

    );

}


/* ==========================================================
   EXPORTACIÓN
========================================================== */

window.Workflow =
    Workflow;
