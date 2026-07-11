"use strict";

/* ==========================================================
   SIGE
   Data Store temporal

   Será sustituido posteriormente
   por llamadas RPC.
========================================================== */

const Store = {

    obtenerProcedimiento,

    obtenerActuacion

};


/* ==========================================================
   PROCEDIMIENTO
========================================================== */

function obtenerProcedimiento(id) {

    return {

        id,

        numero: "O-2026-001",

        nombre: "Construcción de vivienda",

        avance: 68,

        totalActuaciones: 6,

        actuacionesCompletadas: 3

    };

}


/* ==========================================================
   ACTUACIÓN
========================================================== */

function obtenerActuacion(id) {

    return {

        id,

        procedimiento: "O-2026-001",

        nombre: "Integración Documental"

    };

}


window.Store = Store;
