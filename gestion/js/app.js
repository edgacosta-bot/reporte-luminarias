"use strict";

/* ==========================================================
   SIGE
   Sistema Integral de Gestión de Expedientes

   Archivo:
   app.js

   Versión:
   1.0.0

   Responsabilidad:
   Inicializar la aplicación.

========================================================== */


/* ==========================================================
   APLICACIÓN
========================================================== */

const SIGE = {

    version: "1.0.0",

    initialized: false,

    iniciar

};


/* ==========================================================
   INICIO
========================================================== */

async function iniciar() {

    console.log("");

    console.log("========================================");

    console.log(" SIGE");

    console.log(" Gestión Institucional");

    console.log(" Versión:", SIGE.version);

    console.log("========================================");

    console.log("");

    try {

        await validarSesion();

        inicializarEstado();

        inicializarRouter();

        inicializarUI();

        cargarDashboard();

        SIGE.initialized = true;

        console.log("SIGE iniciado correctamente.");

    }

    catch (error) {

        console.error("Error al iniciar SIGE:", error);

    }

}


/* ==========================================================
   VALIDAR SESIÓN
========================================================== */

async function validarSesion() {

    const { data } =
        await supabaseClient.auth.getSession();

    const usuario =
        data?.session?.user;

    if (!usuario) {

        window.location.href =
            "../login.html";

        return;

    }

    window.usuarioSIGE = usuario;

}


/* ==========================================================
   EVENTO DOM
========================================================== */

document.addEventListener(

    "DOMContentLoaded",

    iniciar

);
