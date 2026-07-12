"use strict";

/* ==========================================================
   SIGE
   Sistema Integral de Gestión de Expedientes

   Archivo:
   js/router.js

   Versión:
   5.0.0

   Responsabilidad:

   Administrar la navegación entre componentes.

========================================================== */

const Router = {

    vistaActual: null,

    mostrarDashboard,

    mostrarListaProcedimientos,

    mostrarNuevoExpediente,

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

    boton.style.visibility =
        Router.vistaActual === "dashboard"
            ? "hidden"
            : "visible";

}


/* ==========================================================
   DASHBOARD
========================================================== */

function mostrarDashboard() {

    cambiarVista("dashboard");

    construirDashboard();

}


/* ==========================================================
   LISTA DE EXPEDIENTES
========================================================== */

function mostrarListaProcedimientos(
    claveProcedimiento = null
) {

    cambiarVista("procedimientos");

    ListaProcedimientos.render(
        claveProcedimiento
    );

}


/* ==========================================================
   NUEVO EXPEDIENTE
========================================================== */

function mostrarNuevoExpediente() {

    cambiarVista("nuevo-expediente");

    if (
        typeof NuevoExpediente !== "undefined"
    ) {

        NuevoExpediente.render();

        return;

    }

    console.warn(
        "NuevoExpediente aún no está disponible."
    );

}


/* ==========================================================
   ESCRITORIO DEL EXPEDIENTE
========================================================== */

async function mostrarEscritorio(
    idExpediente = null
) {

    cambiarVista("procedimiento");

    const expediente =
        await Workflow.abrirProcedimiento(
            idExpediente
        );

    SIGE_STATE.expedienteActual =
        expediente;

    EscritorioExpediente.render(
        expediente
    );

}


/* ==========================================================
   CENTRO DE TRABAJO
========================================================== */

async function mostrarCentroTrabajo(
    idActuacion = null
) {

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
