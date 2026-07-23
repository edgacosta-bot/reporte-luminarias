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

/* ==========================================================
   BIENVENIDA INSTITUCIONAL
========================================================== */

async function mostrarBienvenidaInstitucional() {

    return new Promise((resolve) => {

        const overlay = document.createElement("div");

        overlay.id = "bienvenidaSIGE";

        overlay.style.cssText = `
            position: fixed;
            inset: 0;
            background: linear-gradient(180deg,#fafafa 0%,#ffffff 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 99999;
            opacity: 1;
            transition: opacity .8s ease;
        `;

        overlay.innerHTML = `

            <div
                style="
                    text-align:center;
                    max-width:720px;
                    padding:60px;
                    opacity:0;
                    transform:translateY(20px);
                    transition:all .8s ease;
                "
                id="bienvenidaContenido">

                <div
                    style="
                        font-size:18px;
                        letter-spacing:5px;
                        color:#8B1E3F;
                        font-weight:700;
                        margin-bottom:18px;
                    ">

                    SIGE

                </div>

                <div
                    style="
                        font-size:22px;
                        color:#666;
                        margin-bottom:50px;
                    ">

                    Sistema Integral de Gestión Institucional

                </div>

                <div
                    style="
                        width:90px;
                        height:4px;
                        background:#8B1E3F;
                        margin:0 auto 45px auto;
                        border-radius:4px;
                    ">

                </div>

                <div
                    style="
                        font-size:18px;
                        color:#777;
                        margin-bottom:14px;
                    ">

                    Bienvenido

                </div>

                <div
                    style="
                        font-size:36px;
                        font-weight:700;
                        color:#8B1E3F;
                        line-height:1.3;
                    ">

                    ${SIGE.contexto.nombre_cargo}

                </div>

            </div>

        `;

        document.body.appendChild(overlay);

        requestAnimationFrame(() => {

            const contenido =
                document.getElementById("bienvenidaContenido");

            contenido.style.opacity = "1";
            contenido.style.transform = "translateY(0)";

        });

        setTimeout(() => {

            overlay.style.opacity = "0";

            setTimeout(() => {

                overlay.remove();

                resolve();

            }, 800);

        }, 2200);

    });

}
