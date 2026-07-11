"use strict";

/* ==========================================================
   SIGE
   Sistema Integral de Gestión de Expedientes

   Archivo:
   router.js

   Versión:
   1.0.0

   Responsabilidad:
   Administrar la navegación interna del módulo
   Gestión Institucional.

========================================================== */


/* ==========================================================
   ROUTER
========================================================== */

const Router = {

    vistaActual: "dashboard",

    mostrarDashboard,

    mostrarEscritorio,

    mostrarModulo

};


/* ==========================================================
   INICIALIZACIÓN
========================================================== */

function inicializarRouter() {

    console.log("✓ Router inicializado.");

}


/* ==========================================================
   DASHBOARD
========================================================== */

function mostrarDashboard() {

    Router.vistaActual = "dashboard";

    cargarDashboard();

}


/* ==========================================================
   ESCRITORIO DEL EXPEDIENTE
========================================================== */

function mostrarEscritorio(idExpediente = null) {

    Router.vistaActual = "expediente";

    console.log(

        "Abrir expediente:",

        idExpediente

    );

    const workspace =
        document.getElementById("workspace");

    workspace.innerHTML = `

        <div class="card">

            <div class="card-title">

                Escritorio del expediente

            </div>

            <div class="card-subtitle">

                Esta vista será desarrollada
                en el siguiente commit.

            </div>

            <button
                class="btn btn-primary"
                onclick="Router.mostrarDashboard()">

                Volver al Dashboard

            </button>

        </div>

    `;

}


/* ==========================================================
   MÓDULOS
========================================================== */

function mostrarModulo(nombre) {

    Router.vistaActual = nombre;

    console.log(

        "Abrir módulo:",

        nombre

    );

}
