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

    return Store.obtenerProcedimiento(

        idProcedimiento

    );

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
