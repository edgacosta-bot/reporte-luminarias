"use strict";

/* ==========================================================
   SIGE
   Sistema Integral de Gestión de Expedientes

   Archivo:
   js/router.js

   Versión:
   4.0.0

   Responsabilidad:

   Administrar la navegación entre componentes.

========================================================== */

const Router = {

    vistaActual: null,

    mostrarDashboard,

    mostrarListaProcedimientos,

    mostrarEscritorio,

    mostrarCentroTrabajo,

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
   PROCEDIMIENTO
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
   CENTRO DE TRABAJO
========================================================== */

function mostrarCentroTrabajo(idActuacion = null) {

    console.log(
        "Router.mostrarCentroTrabajo()",
        idActuacion
    );

    cambiarVista("centro-trabajo");

    const actuacionDemo = {

        id: idActuacion,

        procedimiento: "O-2026-001",

        nombre: "Integración Documental"

    };

    CentroTrabajo.render(actuacionDemo);

}


/* ==========================================================
   MÓDULOS
========================================================== */

function mostrarModulo(nombreModulo) {

    cambiarVista(nombreModulo);

    const workspace =
        document.getElementById("workspace");

    if (!workspace)
        return;

    workspace.innerHTML = `

        <div class="card">

            <div class="card-title">

                ${nombreModulo}

            </div>

            <div class="card-subtitle">

                Módulo en construcción.

            </div>

            <br>

            <button
                class="btn btn-primary"
                onclick="Router.mostrarDashboard()">

                Regresar

            </button>

        </div>

    `;

}
