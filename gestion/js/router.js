"use strict";

/* ==========================================================
   SIGE
   Sistema Integral de Gestión de Expedientes

   Archivo:
   router.js

   Versión:
   3.0.0

========================================================== */

const Router = {

    vistaActual: null,

    mostrarDashboard,

    mostrarListaProcedimientos,

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
   CAMBIO DE VISTA
========================================================== */

function cambiarVista(vista) {

    Router.vistaActual = vista;

}



/* ==========================================================
   DASHBOARD
========================================================== */

function mostrarDashboard() {

    cambiarVista("dashboard");

    construirDashboard();

}



/* ==========================================================
   LISTA DE PROCEDIMIENTOS
========================================================== */

function mostrarListaProcedimientos() {

    cambiarVista("procedimientos");

    ListaProcedimientos.render();

}



/* ==========================================================
   ESCRITORIO DEL PROCEDIMIENTO
========================================================== */

function mostrarEscritorio(idProcedimiento = null) {

    cambiarVista("procedimiento");

    const procedimientoDemo = {

        id: idProcedimiento,

        numero: "O-2026-001",

        nombre: "Construcción de vivienda",

        avance: 68,

        totalActuaciones: 6,

        actuacionesCompletadas: 3

    };

    EscritorioExpediente.render(

        procedimientoDemo

    );

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

                Módulo en construcción.

            </div>

            <button
                class="btn btn-primary"
                onclick="Router.mostrarDashboard()">

                Regresar

            </button>

        </div>

    `;

}
