"use strict";

/* ==========================================================
   SIGE
   Sistema Integral de Gestión de Expedientes

   Archivo:
   ui.js

   Versión:
   1.0.0

   Responsabilidad:
   Construcción de la interfaz de usuario.

========================================================== */


/* ==========================================================
   INICIALIZACIÓN
========================================================== */

function inicializarUI() {

    console.log("Inicializando interfaz...");

}


/* ==========================================================
   DASHBOARD
========================================================== */

function cargarDashboard() {

    construirDashboard();

}


/* ==========================================================
   CONSTRUCCIÓN DEL DASHBOARD
========================================================== */

function construirDashboard() {

    const dashboard =
        document.getElementById("dashboardResumen");

    const workspace =
        document.getElementById("workspace");

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

    workspace.innerHTML = `

        <div class="grid grid-2">

            <div class="card">

                <div class="card-title">

                    Bienvenido

                </div>

                <div class="card-subtitle">

                    Gestión Institucional constituye el
                    centro de administración de los
                    procedimientos del fraccionamiento.

                    <br><br>

                    Desde este módulo se administrarán
                    expedientes, obras,
                    contrataciones,
                    proyectos de inversión
                    y demás procedimientos
                    institucionales.

                </div>

                <button
                    class="btn btn-primary">

                    Iniciar procedimiento

                </button>

            </div>

            <div class="card">

                <div class="card-title">

                    Módulos

                </div>

                <div class="card-subtitle">

                    Seleccione un módulo.

                </div>

                <div
                    style="
                        display:flex;
                        flex-direction:column;
                        gap:14px;
                    ">

                    <button
                        class="btn btn-secondary">

                        🏗 Gestión de Obras

                    </button>

                    <button
                        class="btn btn-light">

                        📑 Contrataciones

                    </button>

                    <button
                        class="btn btn-light">

                        🏛 Proyectos de inversión

                    </button>

                    <button
                        class="btn btn-light">

                        📊 Reportes

                    </button>

                </div>

            </div>

        </div>

    `;

}
