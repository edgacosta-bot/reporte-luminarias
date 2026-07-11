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

    renderAcciones

};



/* ==========================================================
   RENDER PRINCIPAL
========================================================== */

function render(expediente = {}) {

    const workspace =
        document.getElementById("workspace");

    if (!workspace)
        return;

    workspace.innerHTML = `

        ${renderHeader(expediente)}

        ${renderResumen(expediente)}

        ${renderActuaciones(expediente)}

        ${renderBitacora(expediente)}

        ${renderAcciones(expediente)}

    `;

}



/* ==========================================================
   ENCABEZADO
========================================================== */

function renderHeader(expediente) {

    return `

        <div class="card">

            <div class="card-title">

                Expediente

                ${expediente.numero ?? "O-2026-001"}

            </div>

            <div class="card-subtitle">

                ${expediente.nombre
                    ??
                    "Construcción de vivienda"}

                <br><br>

                Estado actual

                <span class="badge badge-warning">

                    Revisión Mesa Directiva

                </span>

            </div>

        </div>

    `;

}

/* ==========================================================
   RESUMEN DEL EXPEDIENTE
========================================================== */

function renderResumen(expediente) {

    return `

        <div class="grid grid-3">

            <div class="card">

                <div class="card-title">

                    Avance General

                </div>

                <div class="kpi-number">

                    ${expediente.avance ?? "68"}%

                </div>

                <div class="kpi-label">

                    Procedimiento

                </div>

            </div>

            <div class="card">

                <div class="card-title">

                    Actuaciones

                </div>

                <div class="kpi-number">

                    ${expediente.totalActuaciones ?? "6"}

                </div>

                <div class="kpi-label">

                    Definidas

                </div>

            </div>

            <div class="card">

                <div class="card-title">

                    Concluidas

                </div>

                <div class="kpi-number">

                    ${expediente.actuacionesCompletadas ?? "3"}

                </div>

                <div class="kpi-label">

                    Terminadas

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

    console.log("renderActuacion()", numero);

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
                        onclick="
                            console.log('CLICK ACTUACIÓN', ${numero});
                            Router.mostrarCentroTrabajo(${numero});
                        ">

                        Abrir Centro de Trabajo

                    </button>

                </div>

            </div>

        </div>

    `;

}

/* ==========================================================
   ACTUACIÓN
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
    onclick="
        console.log('CLICK ACTUACIÓN', ${numero});
        Router.mostrarCentroTrabajo(${numero});
    ">

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
   EVENTOS
========================================================== */

function registrarEventos() {

    console.log("✓ Escritorio del expediente listo.");

}



/* ==========================================================
   APERTURA DE ACTUACIÓN
========================================================== */

function abrirActuacion(numeroActuacion) {

    console.log(

        "Abrir actuación:",

        numeroActuacion

    );

    /*
        En el siguiente Sprint esta función
        será sustituida por:

        Router.mostrarActuacion(id);

    */

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
