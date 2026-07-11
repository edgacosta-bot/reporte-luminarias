"use strict";

/* ==========================================================
   SIGE
   Sistema Integral de Gestión de Expedientes

   Archivo:
   bootstrap.js

   Versión:
   1.0.0

   Responsabilidad:
   Inicializadores temporales del sistema.

   NOTA:
   Estas funciones serán sustituidas gradualmente
   por sus módulos definitivos (state.js, router.js,
   api.js, etc.).

========================================================== */


/* ==========================================================
   ESTADO GLOBAL
========================================================== */

window.SIGE_STATE = {

    usuario: null,

    vistaActual: "dashboard",

    moduloActual: "gestion",

    expedienteActual: null,

    dashboard: {}

};


/* ==========================================================
   ESTADO
========================================================== */

function inicializarEstado() {

    console.log("✓ Estado inicializado.");

}


/* ==========================================================
   ROUTER
========================================================== */

function inicializarRouter() {

    console.log("✓ Router inicializado.");

}


/* ==========================================================
   CARGA DE USUARIO
========================================================== */

function obtenerUsuarioActual() {

    return window.usuarioSIGE ?? null;

}


/* ==========================================================
   UTILIDADES
========================================================== */

function cambiarTitulo(subtitulo) {

    const elemento = document.getElementById("subtitulo");

    if (!elemento) return;

    elemento.textContent = subtitulo;

}
