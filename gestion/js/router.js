"use strict";

/* ==========================================================
   SIGE
   Sistema Integral de Gestión de Expedientes

   Archivo:
   router.js

   Versión:
   2.0.0

   Responsabilidad:
   Controlar toda la navegación interna
   de Gestión Institucional.

========================================================== */


/* ==========================================================
   ROUTER
========================================================== */

const Router = {

    vistaActual: null,

    mostrarDashboard,

    mostrarEscritorio,

    mostrarModulo,

    cambiarVista

};


/* ==========================================================
   INICIALIZACIÓN
========================================================== */

function inicializarRouter() {

    console.log("✓ Router inicializado.");

}


/* ==========================================================
   CAMBIO DE VISTA
========================================================== */

function cambiarVista(nombreVista) {

    Router.vistaActual = nombreVista;

}


/* ==========================================================
   DASHBOARD
========================================================== */

function mostrarDashboard() {

    cambiarVista("dashboard");

    construirDashboard();

}


/* ==========================================================
   ESCRITORIO
========================================================== */

function mostrarEscritorio(idExpediente = null) {

    cambiarVista("expediente");

    const workspace =
        document.getElementById("workspace");

    workspace.innerHTML = `

        <div class="card">

            <div class="card-title">

                Expediente

            </div>

            <div class="card-subtitle">

                Expediente:
                ${idExpediente ?? "Nuevo procedimiento"}

            </div>

            <div style="margin-top:20px;">

                <button
                    class="btn btn-primary"
                    onclick="Router.mostrarDashboard()">

                    Regresar

                </button>

            </div>

        </div>

    `;

}


/* ==========================================================
   MÓDULOS
========================================================== */

function mostrarModulo(nombreModulo) {

    cambiarVista(nombreModulo);

    const workspace =
        document.getElementById("workspace");

    workspace.innerHTML = `

        <div class="card">

            <div class="card-title">

                ${nombreModulo}

            </div>

            <div class="card-subtitle">

                Este módulo será desarrollado
                en siguientes entregas.

            </div>

            <button
                class="btn btn-primary"
                onclick="Router.mostrarDashboard()">

                Volver

            </button>

        </div>

    `;

}
