"use strict";

/* ==========================================================
   SIGE
   Sistema Integral de Gestión Institucional

   Archivo:
   js/router.js

   Responsabilidad:

   Administrar la navegación del Front.

========================================================== */

const Router = {

    vistaActual: null,

    mostrarDashboard,

    mostrarBandejaObras,

    mostrarNuevoExpediente,

    mostrarNuevaObra,

    mostrarEscritorio,

    mostrarCentroTrabajo,

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
        document.getElementById(
            "btnRegresar"
        );

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

    Dashboard.render();

}

/* ==========================================================
   BANDEJA DE OBRAS
========================================================== */

function mostrarBandejaObras() {

    cambiarVista("obras");

    Obras.render();

}

/* ==========================================================
   NUEVA OBRA
========================================================== */

function mostrarNuevaObra() {

    cambiarVista("nueva-obra");

    NuevaObra.render();

}


/* ==========================================================
   ESCRITORIO
========================================================== */

async function mostrarEscritorio(
    idExpediente = null
) {

    cambiarVista("escritorio");

    const expediente =
    await Workflow.abrirObra(
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

    cambiarVista(
        "centro-trabajo"
    );

    const actuacion =
        await Workflow.abrirActuacion(
            idActuacion
        );

    CentroTrabajo.render(
        actuacion
    );

}

/* ==========================================================
   EXPORTACIÓN
========================================================== */

window.Router = Router;
