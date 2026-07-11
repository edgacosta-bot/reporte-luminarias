"use strict";

/* ==========================================================
   SIGE
   Sistema Integral de Gestión de Expedientes

   Archivo:
   ui.js

   Versión:
   2.0.0

   Responsabilidad:
   Construcción de la interfaz de usuario.

========================================================== */


/* ==========================================================
   INICIALIZACIÓN
========================================================== */

function inicializarUI() {

    console.log("✓ Interfaz inicializada.");

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

function construirKPIs() {

    const dashboard =
        document.getElementById("dashboardResumen");

    dashboard.innerHTML = `

        <div class="grid grid-4">

            <div class="card">

                <div class="card-title">

                    Expedientes activos

                </div>

                <div class="kpi-number">

                    12

                </div>

                <div class="kpi-label">

                    Procedimientos en curso

                </div>

            </div>

            <div class="card">

                <div class="card-title">

                    Pendientes

                </div>

                <div class="kpi-number">

                    3

                </div>

                <div class="kpi-label">

                    Requieren atención

                </div>

            </div>

            <div class="card">

                <div class="card-title">

                    Concluidos

                </div>

                <div class="kpi-number">

                    148

                </div>

                <div class="kpi-label">

                    Históricos

                </div>

            </div>

            <div class="card">

                <div class="card-title">

                    Obras activas

                </div>

                <div class="kpi-number">

                    4

                </div>

                <div class="kpi-label">

                    En ejecución

                </div>

            </div>

        </div>

    `;

}


/* ==========================================================
   DASHBOARD PRINCIPAL
========================================================== */

function construirWorkspaceDashboard() {

    const workspace =
        document.getElementById("workspace");

    workspace.innerHTML = `

        <div class="grid grid-2">

            <div class="card">

                <div class="card-title">

                    Bienvenido

                </div>

                <div class="card-subtitle">

                    Gestión Institucional será el centro
                    de administración de todos los
                    procedimientos institucionales.

                    <br><br>

                    Desde aquí se administrarán:

                    <br><br>

                    • Gestión de Obras

                    <br>

                    • Contrataciones

                    <br>

                    • Proyectos de Inversión

                    <br>

                    • Convenios

                    <br>

                    • Reportes

                </div>

                <button
                    class="btn btn-primary"
                    onclick="Router.mostrarEscritorio()">

                    Iniciar procedimiento

                </button>

            </div>

            <div class="card">

                <div class="card-title">

                    Módulos

                </div>

                <div class="card-subtitle">

                    Seleccione una opción.

                </div>

                <div
                    style="
                        display:flex;
                        flex-direction:column;
                        gap:14px;
                    ">

                    <button
                        class="btn btn-secondary"
                        onclick="Router.mostrarModulo('Gestión de Obras')">

                        🏗 Gestión de Obras

                    </button>

                    <button
                        class="btn btn-light"
                        onclick="Router.mostrarModulo('Contrataciones')">

                        📑 Contrataciones

                    </button>

                    <button
                        class="btn btn-light"
                        onclick="Router.mostrarModulo('Proyectos de Inversión')">

                        🏛 Proyectos de Inversión

                    </button>

                    <button
                        class="btn btn-light"
                        onclick="Router.mostrarModulo('Reportes')">

                        📊 Reportes

                    </button>

                </div>

            </div>

        </div>

    `;

}
