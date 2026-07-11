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

    if (!dashboard)
        return;

    dashboard.innerHTML = `

        <div class="grid grid-4">

            <div class="card">

                <div class="card-title">

                    Mis procedimientos

                </div>

                <div class="kpi-number">

                    12

                </div>

                <div class="kpi-label">

                    Activos

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

    if (!workspace)
        return;

    workspace.innerHTML = `

        <div class="grid grid-2">

            <div class="card">

                <div class="card-title">

                    Bienvenido a Gestión Institucional

                </div>

                <div class="card-subtitle">

                    Desde este módulo se administran
                    todos los procedimientos
                    institucionales.

                    <br><br>

                    El Workflow determinará
                    automáticamente las acciones
                    disponibles para cada usuario.

                </div>

                <button
                    class="btn btn-primary"
                    onclick="Router.mostrarListaProcedimientos()">

                    Mis procedimientos

                </button>

            </div>

            <div class="card">

                <div class="card-title">

                    Accesos rápidos

                </div>

                <div
                    style="
                        display:flex;
                        flex-direction:column;
                        gap:14px;
                    ">

                    <button
                        class="btn btn-secondary"
                        onclick="Router.mostrarModulo('Reportes')">

                        📊 Reportes

                    </button>

                    <button
                        class="btn btn-light"
                        onclick="Router.mostrarModulo('Catálogos')">

                        ⚙ Catálogos

                    </button>

                    <button
                        class="btn btn-light"
                        onclick="Router.mostrarModulo('Administración')">

                        🛠 Administración

                    </button>

                </div>

            </div>

        </div>

    `;

}
