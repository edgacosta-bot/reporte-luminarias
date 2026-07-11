"use strict";

/* ==========================================================
   SIGE
   Workflow

   Capa de negocio del Frontend.

   Esta capa será la única autorizada
   para comunicarse con las RPC del
   Workflow Engine.

========================================================== */

const Workflow = {

    abrirProcedimiento,

    abrirActuacion

};


/* ==========================================================
   PROCEDIMIENTO
========================================================== */

async function abrirProcedimiento(idProcedimiento) {

    const {

        data,

        error

    } = await supabaseClient.rpc(

        "obtener_expediente",

        {

            p_expediente_id: idProcedimiento

        }

    );

    if (error)
        throw error;

    const expediente =

        Array.isArray(data)

            ? data[0]

            : data;

    return {

        id: expediente.id,

        numero: expediente.folio,

        nombre: expediente.titulo,

        estado: expediente.estado,

        tipo: expediente.tipo,

        clasificacion: expediente.clasificacion,

        avance: 0,

        totalActuaciones: 0,

        actuacionesCompletadas: 0

    };

}
/* ==========================================================
   ACTUACIÓN
========================================================== */

async function abrirActuacion(idActuacion) {

    return Store.obtenerActuacion(

        idActuacion

    );

}


window.Workflow = Workflow;
