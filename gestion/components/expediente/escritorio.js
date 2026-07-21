"use strict";

/* ==========================================================
   SIGE
   Sistema Integral de Gestión de Expedientes

   Archivo:
   components/expediente/escritorio.js

   Versión:
   1.0.0

   Responsabilidad:

   Construir el Escritorio del Expediente.

   Este componente representa la vista principal de un
   procedimiento administrativo.

   Desde aquí se visualiza:

   • Información general
   • Estado del expediente
   • Avance
   • Actuaciones
   • Bitácora general

========================================================== */


/* ==========================================================
   ESCRITORIO
========================================================== */

const EscritorioExpediente = {

    render,

    renderHeader,

    renderResumen,

    renderActuaciones,

    renderBitacora,

    renderAcciones,

    actualizar,

    destruir

};

/* ==========================================================
   RENDER PRINCIPAL
========================================================== */

function render(data = {}) {

    console.log(
        "EscritorioExpediente.render()",
        data
    );

    const workspace =
        document.getElementById(
            "workspace"
        );

    if (!workspace)
        return;

   console.error("=== RENDER ESCRITORIO EJECUTÁNDOSE ==="); 
   
   const html = `

    ${renderHeader(data)}

    ${renderResumen(data)}

    ${renderActuaciones(data)}

    ${renderBitacora(data)}

    ${renderAcciones(data)}

`;

console.log(html);

workspace.innerHTML = html;

}


/* ==========================================================
   ENCABEZADO
========================================================== */

function renderHeader(data) {

    const expediente = data.expediente ?? {};
    const obra = data.obra ?? {};
    const resumen = data.resumen ?? {};

    return `

        <div class="card">

            <div style="
                display:flex;
                justify-content:space-between;
                align-items:flex-start;
                gap:24px;
            ">

                <div>

                    <div class="card-title"
                         style="font-size:1.8rem;">

                        ${expediente.folio ?? "-"}

                    </div>

                    <div class="card-subtitle"
                         style="
                            margin-top:6px;
                            font-size:1rem;
                            text-transform:uppercase;
                            letter-spacing:.08em;
                         ">

                        PRUEBA HEADER

                    </div>

                </div>

                <div>

                    <span class="badge badge-warning"
                          style="
                            font-size:.95rem;
                            padding:8px 16px;
                          ">

                        ${resumen.fase_actual ?? "APROBACIÓN"}

                    </span>

                </div>

            </div>

            <hr style="
                margin:20px 0;
                border:none;
                border-top:1px solid #ddd;
            ">

            <div style="
                display:grid;
                grid-template-columns:repeat(2,1fr);
                gap:20px;
            ">

                <div>

                    <strong>Privada</strong>

                    <br>

                    ${obra.privada ?? "-"}

                </div>

                <div>

                    <strong>Lote</strong>

                    <br>

                    ${obra.casa ?? "-"}

                </div>

            </div>

        </div>

    `;

}

/* ==========================================================
   RESUMEN DEL EXPEDIENTE
========================================================== */

function renderResumen(data) {

    const resumen =
        data.resumen ?? {};

    return `

        <div
            class="grid grid-4"
            style="
                margin-top:20px;
            ">

            <div class="card">

                <div class="card-title">

                    Avance General

                </div>

                <div class="kpi-number">

                    ${resumen.porcentaje_avance ?? 0}%

                </div>

                <div class="kpi-label">

                    del procedimiento

                </div>

            </div>

            <div class="card">

                <div class="card-title">

                    Actuaciones

                </div>

                <div class="kpi-number">

                    ${resumen.actuaciones_totales ?? 0}

                </div>

                <div class="kpi-label">

                    Totales

                </div>

            </div>

            <div class="card">

                <div class="card-title">

                    Completadas

                </div>

                <div class="kpi-number">

                    ${resumen.actuaciones_completadas ?? 0}

                </div>

                <div class="kpi-label">

                    Concluidas

                </div>

            </div>

            <div class="card">

                <div class="card-title">

                    Pendientes

                </div>

                <div class="kpi-number">

                    ${resumen.actuaciones_pendientes ?? 0}

                </div>

                <div class="kpi-label">

                    Por atender

                </div>

            </div>

        </div>

    `;

}

/* ==========================================================
   ACTUACIONES
========================================================== */

function renderActuaciones(expediente) {

    return `

        <div class="card">

            <div class="card-title">

                Actuaciones del procedimiento

            </div>

            <div class="card-subtitle">

                Seleccione una actuación para
                consultar su documentación,
                VoBos y observaciones.

            </div>

            <div class="workflow">

                ${renderActuacion(
                    1,
                    "Solicitud",
                    "success"
                )}

                ${renderActuacion(
                    2,
                    "Integración documental",
                    "success"
                )}

                ${renderActuacion(
                    3,
                    "Dictamen Técnico",
                    "warning"
                )}

                ${renderActuacion(
                    4,
                    "Mesa Directiva",
                    "pending"
                )}

                ${renderActuacion(
                    5,
                    "Inicio de Obra",
                    "pending"
                )}

                ${renderActuacion(
                    6,
                    "Concluido",
                    "pending"
                )}

            </div>

        </div>

    `;

}
/* ==========================================================
   ACTUACIONES
========================================================== */

function renderActuacion(
    numero,
    nombre,
    estado
) {

    let badge = "";

    switch (estado) {

        case "success":
            badge =
                '<span class="badge badge-success">Completada</span>';
            break;

        case "warning":
            badge =
                '<span class="badge badge-warning">En proceso</span>';
            break;

        default:
            badge =
                '<span class="badge">Pendiente</span>';

    }

    return `

        <div
            class="card"
            style="
                margin-top:16px;
                border-left:5px solid var(--vino);
            ">

            <div
                style="
                    display:flex;
                    justify-content:space-between;
                    align-items:flex-start;
                    gap:24px;
                ">

                <div>

                    <strong>
                        Actuación ${numero}
                    </strong>

                    <br><br>

                    ${nombre}

                    <br><br>

                    ${badge}

                </div>

                <div>

                    <button
                        class="btn btn-primary"
                        onclick="Router.mostrarCentroTrabajo(${numero})">

                        Abrir Centro de Trabajo

                    </button>

                </div>

            </div>

        </div>

    `;

}


/* ==========================================================
   BITÁCORA GENERAL
========================================================== */

function renderBitacora(expediente) {

    return `

        <div class="card">

            <div class="card-title">

                Bitácora General

            </div>

            <div class="card-subtitle">

                Últimos movimientos del expediente.

            </div>

            ${renderMovimiento(
                "15/07/2026 09:15",
                "Administrador",
                "Se integró la documentación inicial."
            )}

            ${renderMovimiento(
                "16/07/2026 12:40",
                "Secretario",
                "Se emitió observación sobre el plano arquitectónico."
            )}

            ${renderMovimiento(
                "17/07/2026 08:20",
                "Administrador",
                "Se cargó una nueva versión del plano arquitectónico."
            )}

        </div>

    `;

}


/* ==========================================================
   MOVIMIENTO
========================================================== */

function renderMovimiento(

    fecha,

    usuario,

    descripcion

) {

    return `

        <div
            class="card"
            style="
                margin-top:14px;
                border-left:5px solid var(--vino);
            ">

            <strong>

                ${fecha}

            </strong>

            <br><br>

            <strong>

                ${usuario}

            </strong>

            <br>

            ${descripcion}

        </div>

    `;

}



/* ==========================================================
   PANEL DE ACCIONES
========================================================== */

function renderAcciones(expediente) {

    return `

        <div class="card">

            <div class="card-title">

                Acciones disponibles

            </div>

            <div class="card-subtitle">

                El Workflow habilitará únicamente
                las acciones permitidas para el
                usuario autenticado.

            </div>

            <div
                style="
                    display:flex;
                    flex-wrap:wrap;
                    gap:14px;
                    margin-top:20px;
                ">

                <button
                    class="btn btn-primary">

                    Continuar revisión

                </button>

                <button
                    class="btn btn-secondary">

                    Consultar historial

                </button>

                <button
                    class="btn btn-light">

                    Información general

                </button>

            </div>

        </div>

    `;

}


/* ==========================================================
   RECARGAR
========================================================== */

function actualizar(expediente) {

    render(expediente);

}



/* ==========================================================
   DESTRUIR
========================================================== */

function destruir() {

    const workspace =
        document.getElementById("workspace");

    if (!workspace)
        return;

    workspace.innerHTML = "";

}



/* ==========================================================
   EXPORTACIÓN
========================================================== */

window.EscritorioExpediente =
    EscritorioExpediente;
