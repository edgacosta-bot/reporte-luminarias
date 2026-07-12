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
   OBTENER LOTES
========================================================== */

async function obtenerLotes(privada) {

    const {
        data,
        error
    } = await supabaseClient

        .from("lotes")

        .select(`
            id,
            lote,
            registrado
        `)

        .eq(
            "privada",
            privada
        )

        .order(
            "lote"
        );

    if (error) {

        console.error(error);

        throw error;

    }

    return data;

}


/* ==========================================================
   ABRIR OBRA
========================================================== */

async function abrirObra(idExpediente) {

    console.log(
        "Workflow.abrirObra()",
        idExpediente
    );

    const {
        data,
        error
    } = await supabaseClient.rpc(

        "obtener_expediente",

        {

            p_expediente_id:
                idExpediente

        }

    );

    if (error) {

        console.error(error);

        throw error;

    }

    const expediente =

        Array.isArray(data)

            ? data[0]

            : data;

    if (!expediente)

        throw new Error(

            "Expediente inexistente."

        );

    return {

        id:
            expediente.id,

        folio:
            expediente.folio,

        titulo:
            expediente.titulo,

        estado:
            expediente.estado,

        tipo:
            expediente.tipo,

        avance:
            expediente.porcentaje_avance ?? 0,

        etapa:
            expediente.fase ?? "",

        expediente

    };

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
