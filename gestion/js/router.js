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

    mostrarModulo,

    actualizarBotonRegresar

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

    actualizarBotonRegresar();

}

/* ==========================================================
   BOTÓN REGRESAR
========================================================== */

function actualizarBotonRegresar() {

    const boton =
        document.getElementById("btnRegresar");

    if (!boton)
        return;

    if (Router.vistaActual === "dashboard") {

        boton.style.visibility = "hidden";

    } else {

        boton.style.visibility = "visible";

    }

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

async function mostrarEscritorio(idProcedimiento = null) {

    cambiarVista("procedimiento");

    const procedimiento =
        await Workflow.abrirProcedimiento(
            idProcedimiento
        );

    SIGE_STATE.expedienteActual =
        procedimiento;

    EscritorioExpediente.render(
        procedimiento
    );

}

/* ==========================================================
   CENTRO DE TRABAJO
========================================================== */

async function mostrarCentroTrabajo(idActuacion = null) {

    cambiarVista("centro-trabajo");

    const actuacion =
        await Workflow.abrirActuacion(
            idActuacion
        );

    CentroTrabajo.render(
        actuacion
    );

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
