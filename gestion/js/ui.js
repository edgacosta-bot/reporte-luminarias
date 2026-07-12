"use strict";

/* ==========================================================
   SIGE
   Sistema Integral de Gestión de Expedientes

   Archivo:
   ui.js

   Versión:
   3.0.0

   Responsabilidad:
   Construcción de la interfaz de usuario.

========================================================== */


/* ==========================================================
   INICIALIZACIÓN
========================================================== */

function inicializarUI() {

    console.log("✓ Interfaz inicializada.");

    const boton =
        document.getElementById("btnRegresar");

    if (!boton)
        return;

    boton.onclick = function () {

        switch (Router.vistaActual) {

            case "dashboard":

                window.location.href = "../index.html";
                break;

            case "procedimientos":

                Router.mostrarDashboard();
                break;

            case "procedimiento":

                Router.mostrarListaProcedimientos();
                break;

            case "centro-trabajo":

                Router.mostrarEscritorio(
                    SIGE_STATE.expedienteActual?.id ?? 1
                );
                break;

            default:

                Router.mostrarDashboard();

        }

    };

}


/* ==========================================================
   DASHBOARD
========================================================== */

function construirDashboard() {

    construirKPIs();

    construirWorkspaceDashboard();

}


/* ==========================================================
   KPIs
========================================================== */

/* ==========================================================
   KPIs
========================================================== */

function construirKPIs() {

    const dashboard =
        document.getElementById("dashboardResumen");

    if (!dashboard)
        return;

    dashboard.innerHTML = `

        <div class="grid grid-4">

            <div class="card">

                <div class="card-title">

                    Procedimientos

                </div>

                <div class="kpi-number">

                    3

                </div>

                <div class="kpi-label">

                    Disponibles

                </div>

            </div>

            <div class="card">

                <div class="card-title">

                    Expedientes

                </div>

                <div class="kpi-number">

                    —

                </div>

                <div class="kpi-label">

                    Seleccione un procedimiento

                </div>

            </div>

            <div class="card">

                <div class="card-title">

                    Etapa

                </div>

                <div class="kpi-number">

                    —

                </div>

                <div class="kpi-label">

                    Sin seleccionar

                </div>

            </div>

            <div class="card">

                <div class="card-title">

                    Estado

                </div>

                <div class="kpi-number">

                    —

                </div>

                <div class="kpi-label">

                    Pendiente

                </div>

            </div>

        </div>

    `;

}

/* ==========================================================
   DASHBOARD PRINCIPAL
========================================================== */

/* ==========================================================
   DASHBOARD PRINCIPAL
========================================================== */

function construirWorkspaceDashboard() {

    const workspace =
        document.getElementById("workspace");

    if (!workspace)
        return;

    workspace.innerHTML = `

        <div class="card">

            <div class="card-title">

                Gestión Institucional

            </div>

            <div class="card-subtitle">

                Seleccione el procedimiento cuyos
                expedientes desea administrar.

                <br><br>

                Cada procedimiento posee su propio
                flujo de trabajo, requisitos,
                indicadores y expedientes.

            </div>

        </div>

        <br>

        <div class="grid grid-3">

            <div class="card">

                <div class="card-title">

                    🏗 Obras Particulares

                </div>

                <div class="card-subtitle">

                    Expedientes para autorización,
                    ejecución y conclusión de obras
                    particulares.

                </div>

                <button
                    class="btn btn-primary"
                    onclick="Router.mostrarListaProcedimientos('OBR')"

                    Abrir expedientes

                </button>

            </div>

            <div class="card">

                <div class="card-title">

                    💰 Proyectos de Inversión

                </div>

                <div class="card-subtitle">

                    Expedientes relacionados con
                    proyectos de inversión
                    institucional.

                </div>

                <button
                    class="btn btn-primary"
                    onclick="Router.mostrarListaProcedimientos('INV')"

                    Abrir expedientes

                </button>

            </div>

            <div class="card">

                <div class="card-title">

                    🤝 Contratación de Servicios

                </div>

                <div class="card-subtitle">

                    Expedientes para contratación,
                    seguimiento y cierre de
                    servicios.

                </div>

                <button
                    class="btn btn-primary"
                    onclick="Router.mostrarListaProcedimientos('SER')"

                    Abrir expedientes

                </button>

            </div>

        </div>

    `;

}
