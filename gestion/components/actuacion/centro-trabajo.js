"use strict";

/* ==========================================================
   SIGE
   Sistema Integral de Gestión de Expedientes

   Archivo:
   components/actuacion/centro-trabajo.js

   RELEASE 001

   Responsabilidad

   Construir el Centro de Trabajo de una actuación.

   El Centro de Trabajo representa la unidad operativa
   del Workflow.

   Desde aquí el usuario puede consultar:

   • Estado de la actuación
   • Workflow
   • Control documental
   • Observaciones
   • VoBos
   • Bitácora
   • Acciones disponibles

   IMPORTANTE

   Este componente NO implementa reglas de negocio.

   Todas las decisiones deberán provenir del Workflow
   Engine mediante RPC.

========================================================== */


/* ==========================================================
   COMPONENTE
========================================================== */

const CentroTrabajo = {

    render,

    actualizar,

    destruir,

    registrarEventos,

    renderHeader,

    renderEstado,

    renderWorkflow,

    renderControlDocumental,

    renderObservaciones,

    renderVoBos,

    renderBitacora,

    renderAcciones

};



/* ==========================================================
   ESTADO INTERNO
========================================================== */

let actuacionActual = {};



/* ==========================================================
   RENDER PRINCIPAL
========================================================== */

function render(actuacion = {}) {

    actuacionActual = actuacion;

    const workspace =
        document.getElementById("workspace");

    if (!workspace)
        return;

    workspace.innerHTML = `

        ${renderHeader(actuacion)}

        ${renderEstado(actuacion)}

        ${renderWorkflow(actuacion)}

        ${renderControlDocumental(actuacion)}

        ${renderObservaciones(actuacion)}

        ${renderVoBos(actuacion)}

        ${renderBitacora(actuacion)}

        ${renderAcciones(actuacion)}

    `;

    registrarEventos();

}

/* ==========================================================
   ENCABEZADO
========================================================== */

function renderHeader(actuacion) {

    const expediente =
        actuacion.expediente
        ?? "EXP-2026-001";

    const procedimiento =
        actuacion.procedimiento
        ?? "Procedimiento Institucional";

    const nombre =
        actuacion.nombre
        ?? "Dictamen Técnico";

    const responsable =
        actuacion.responsable
        ?? "Pendiente de asignación";

    const estado =
        actuacion.estado
        ?? "En proceso";

    const prioridad =
        actuacion.prioridad
        ?? "Normal";

    const fechaInicio =
        actuacion.fechaInicio
        ?? "--/--/----";

    const fechaLimite =
        actuacion.fechaLimite
        ?? "--/--/----";

    return `

        <div class="card">

            <div
                style="
                    display:flex;
                    justify-content:space-between;
                    align-items:flex-start;
                    gap:24px;
                    flex-wrap:wrap;
                ">

                <div>

                    <div class="card-title">

                        ${nombre}

                    </div>

                    <div class="card-subtitle">

                        Expediente

                        <strong>

                            ${expediente}

                        </strong>

                        <br>

                        ${procedimiento}

                    </div>

                </div>

                <div
                    style="
                        display:flex;
                        flex-direction:column;
                        gap:8px;
                        align-items:flex-end;
                    ">

                    <span class="badge badge-warning">

                        ${estado}

                    </span>

                    <span class="badge">

                        Prioridad:
                        ${prioridad}

                    </span>

                </div>

            </div>

            <div
                style="
                    display:grid;
                    grid-template-columns:
                        repeat(auto-fit,minmax(180px,1fr));
                    gap:18px;
                    margin-top:26px;
                ">

                <div>

                    <strong>

                        Responsable

                    </strong>

                    <br>

                    ${responsable}

                </div>

                <div>

                    <strong>

                        Inicio

                    </strong>

                    <br>

                    ${fechaInicio}

                </div>

                <div>

                    <strong>

                        Fecha compromiso

                    </strong>

                    <br>

                    ${fechaLimite}

                </div>

            </div>

        </div>

    `;

}



/* ==========================================================
   ESTADO DE LA ACTUACIÓN
========================================================== */

function renderEstado(actuacion) {

    const avance =
        actuacion.avance
        ?? 45;

    const estado =
        actuacion.estado
        ?? "En proceso";

    const etapa =
        actuacion.etapa
        ?? "Integración documental";

    const documentos =
        actuacion.documentosPendientes
        ?? 1;

    const observaciones =
        actuacion.observacionesPendientes
        ?? 2;

    const voBos =
        actuacion.voBosPendientes
        ?? 1;

    return `

        <div class="grid grid-4">

            <div class="card">

                <div class="card-title">

                    Estado

                </div>

                <div
                    class="kpi-number"
                    style="font-size:22px;">

                    ${estado}

                </div>

                <div class="kpi-label">

                    Situación actual

                </div>

            </div>

            <div class="card">

                <div class="card-title">

                    Avance

                </div>

                <div class="kpi-number">

                    ${avance}%

                </div>

                <div class="kpi-label">

                    Workflow

                </div>

            </div>

            <div class="card">

                <div class="card-title">

                    Etapa

                </div>

                <div
                    class="kpi-number"
                    style="font-size:20px;">

                    ${etapa}

                </div>

                <div class="kpi-label">

                    Activa

                </div>

            </div>

            <div class="card">

                <div class="card-title">

                    Pendientes

                </div>

                <div
                    style="
                        margin-top:16px;
                        display:flex;
                        flex-direction:column;
                        gap:10px;
                    ">

                    <div>

                        📄 Documentos:
                        <strong>

                            ${documentos}

                        </strong>

                    </div>

                    <div>

                        💬 Observaciones:
                        <strong>

                            ${observaciones}

                        </strong>

                    </div>

                    <div>

                        ✔ VoBos:
                        <strong>

                            ${voBos}

                        </strong>

                    </div>

                </div>

            </div>

        </div>

    `;

}

/* ==========================================================
   WORKFLOW
========================================================== */

function renderWorkflow(actuacion) {

    const workflow =
        actuacion.workflow ?? obtenerWorkflowDemo();

    return `

        <div class="card">

            <div class="card-title">

                Workflow de la actuación

            </div>

            <div class="card-subtitle">

                El Workflow determina el estado
                operativo de la actuación y las
                acciones permitidas para el usuario.

            </div>

            <div
                style="
                    display:flex;
                    flex-direction:column;
                    gap:18px;
                    margin-top:24px;
                ">

                ${workflow
                    .map(renderPasoWorkflow)
                    .join("")}

            </div>

        </div>

    `;

}



/* ==========================================================
   PASO DEL WORKFLOW
========================================================== */

function renderPasoWorkflow(paso) {

    let badge = "";

    switch (paso.estado) {

        case "completado":

            badge =
                '<span class="badge badge-success">Completado</span>';

            break;

        case "activo":

            badge =
                '<span class="badge badge-warning">En proceso</span>';

            break;

        case "bloqueado":

            badge =
                '<span class="badge badge-danger">Bloqueado</span>';

            break;

        default:

            badge =
                '<span class="badge">Pendiente</span>';

    }

    return `

        <div
            class="card"
            style="
                border-left:5px solid var(--vino);
            ">

            <div
                style="
                    display:flex;
                    justify-content:space-between;
                    align-items:flex-start;
                    gap:24px;
                    flex-wrap:wrap;
                ">

                <div>

                    <strong>

                        ${paso.nombre}

                    </strong>

                    <br><br>

                    ${paso.descripcion}

                </div>

                <div>

                    ${badge}

                </div>

            </div>

        </div>

    `;

}



/* ==========================================================
   WORKFLOW DEMO

   Será sustituido por RPC.
========================================================== */

function obtenerWorkflowDemo() {

    return [

        {

            id:1,

            nombre:
                "Recepción de documentos",

            descripcion:
                "La documentación inicial fue recibida.",

            estado:
                "completado"

        },

        {

            id:2,

            nombre:
                "Integración documental",

            descripcion:
                "Se valida la documentación obligatoria.",

            estado:
                "completado"

        },

        {

            id:3,

            nombre:
                "Dictamen técnico",

            descripcion:
                "El área técnica revisa la información presentada.",

            estado:
                "activo"

        },

        {

            id:4,

            nombre:
                "Mesa Directiva",

            descripcion:
                "Pendiente de autorización.",

            estado:
                "pendiente"

        },

        {

            id:5,

            nombre:
                "Autorización final",

            descripcion:
                "Se habilitará cuando concluya la etapa anterior.",

            estado:
                "bloqueado"

        }

    ];

}

/* ==========================================================
   CONTROL DOCUMENTAL
========================================================== */

function renderControlDocumental(actuacion) {

    const documentos =
        actuacion.documentos ?? obtenerDocumentosDemo();

    return `

        <div class="card">

            <div class="card-title">

                Control documental

            </div>

            <div class="card-subtitle">

                Documentación requerida para la
                actuación y su estado dentro del
                Workflow.

            </div>

            <div
                style="
                    display:flex;
                    flex-direction:column;
                    gap:18px;
                    margin-top:24px;
                ">

                ${documentos
                    .map(renderDocumento)
                    .join("")}

            </div>

        </div>

    `;

}



/* ==========================================================
   DOCUMENTO
========================================================== */

function renderDocumento(documento) {

    let badge = "";
    let accion = "";
    let claseBoton = "btn btn-primary";

    switch (documento.estado) {

        case "vigente":

            badge =
                '<span class="badge badge-success">Vigente</span>';

            accion = `
                <button class="btn btn-secondary">
                    Ver documento
                </button>
            `;

            break;

        case "pendiente":

            badge =
                '<span class="badge">Pendiente</span>';

            accion = `
                <button class="${claseBoton}">
                    Subir documento
                </button>
            `;

            break;

        case "observado":

            badge =
                '<span class="badge badge-warning">
                    Observado
                </span>';

            accion = `
                <button class="${claseBoton}">
                    Actualizar versión
                </button>

                <button class="btn btn-secondary">
                    Ver documento
                </button>
            `;

            break;

        case "no_requerido":

            badge =
                '<span class="badge">
                    No requerido
                </span>';

            accion = "";

            break;

        default:

            badge =
                '<span class="badge">
                    Sin estado
                </span>';

    }

    return `

        <div
            class="card"
            style="
                border-left:5px solid var(--vino);
            ">

            <div
                style="
                    display:flex;
                    justify-content:space-between;
                    gap:24px;
                    flex-wrap:wrap;
                ">

                <div>

                    <strong>

                        ${documento.nombre}

                    </strong>

                    <br><br>

                    ${documento.descripcion}

                    <br><br>

                    ${badge}

                </div>

                <div
                    style="
                        display:flex;
                        gap:12px;
                        flex-wrap:wrap;
                        align-items:flex-start;
                    ">

                    ${accion}

                </div>

            </div>

        </div>

    `;

}



/* ==========================================================
   DOCUMENTOS DEMO

   Posteriormente serán obtenidos mediante RPC.
========================================================== */

function obtenerDocumentosDemo() {

    return [

        {

            id:1,

            nombre:
                "Plano arquitectónico",

            descripcion:
                "Versión oficial del proyecto.",

            estado:
                "observado"

        },

        {

            id:2,

            nombre:
                "Memoria descriptiva",

            descripcion:
                "Documento técnico.",

            estado:
                "vigente"

        },

        {

            id:3,

            nombre:
                "Fianza",

            descripcion:
                "Garantía del procedimiento.",

            estado:
                "pendiente"

        },

        {

            id:4,

            nombre:
                "Impacto ambiental",

            descripcion:
                "No aplica para este procedimiento.",

            estado:
                "no_requerido"

        }

    ];

}

/* ==========================================================
   OBSERVACIONES
========================================================== */

function renderObservaciones(actuacion) {

    const observaciones =
        actuacion.observaciones
        ?? obtenerObservacionesDemo();

    return `

        <div class="card">

            <div class="card-title">

                Observaciones

            </div>

            <div class="card-subtitle">

                Observaciones emitidas durante la
                revisión de la actuación.

            </div>

            <div
                style="
                    display:flex;
                    flex-direction:column;
                    gap:18px;
                    margin-top:24px;
                ">

                ${observaciones
                    .map(renderObservacion)
                    .join("")}

            </div>

        </div>

    `;

}



/* ==========================================================
   OBSERVACIÓN
========================================================== */

function renderObservacion(observacion) {

    let badge = "";
    let accion = "";

    switch (observacion.estado) {

        case "pendiente":

            badge =
                '<span class="badge badge-warning">Pendiente</span>';

            accion = `
                <button class="btn btn-primary">

                    Atender observación

                </button>
            `;

            break;

        case "atendida":

            badge =
                '<span class="badge badge-success">Atendida</span>';

            accion = `
                <button class="btn btn-secondary">

                    Consultar atención

                </button>
            `;

            break;

        case "cancelada":

            badge =
                '<span class="badge">Cancelada</span>';

            accion = "";

            break;

        default:

            badge =
                '<span class="badge">Registrada</span>';

    }

    return `

        <div
            class="card"
            style="
                border-left:5px solid var(--vino);
            ">

            <div
                style="
                    display:flex;
                    justify-content:space-between;
                    gap:24px;
                    flex-wrap:wrap;
                ">

                <div
                    style="flex:1;min-width:320px;">

                    <strong>

                        ${observacion.usuario}

                    </strong>

                    <br>

                    <small>

                        ${observacion.fecha}

                    </small>

                    <br><br>

                    ${observacion.descripcion}

                    <br><br>

                    <strong>

                        Documento relacionado:

                    </strong>

                    ${observacion.documento}

                    <br><br>

                    ${badge}

                </div>

                <div
                    style="
                        display:flex;
                        align-items:flex-start;
                    ">

                    ${accion}

                </div>

            </div>

        </div>

    `;

}



/* ==========================================================
   OBSERVACIONES DEMO

   Posteriormente serán obtenidas mediante RPC.
========================================================== */

function obtenerObservacionesDemo() {

    return [

        {

            id:1,

            usuario:
                "Dirección Técnica",

            fecha:
                "18/07/2026 09:30",

            documento:
                "Plano arquitectónico",

            descripcion:
                "Actualizar el plano para incorporar el cajón adicional de estacionamiento solicitado durante la revisión.",

            estado:
                "pendiente"

        },

        {

            id:2,

            usuario:
                "Secretaría",

            fecha:
                "17/07/2026 12:10",

            documento:
                "Memoria descriptiva",

            descripcion:
                "Se verificó la corrección realizada y la observación quedó solventada.",

            estado:
                "atendida"

        }

    ];

}

/* ==========================================================
   VISTOS BUENOS (VoBos)
========================================================== */

function renderVoBos(actuacion) {

    const voBos =
        actuacion.voBos
        ?? obtenerVoBosDemo();

    return `

        <div class="card">

            <div class="card-title">

                Vistos Buenos

            </div>

            <div class="card-subtitle">

                Autorizaciones requeridas por el
                Workflow para concluir la actuación.

            </div>

            <div
                style="
                    display:flex;
                    flex-direction:column;
                    gap:18px;
                    margin-top:24px;
                ">

                ${voBos
                    .map(renderVoBo)
                    .join("")}

            </div>

        </div>

    `;

}



/* ==========================================================
   VoBo
========================================================== */

function renderVoBo(vobo) {

    let badge = "";
    let accion = "";

    switch (vobo.estado) {

        case "emitido":

            badge =
                '<span class="badge badge-success">Emitido</span>';

            accion = `
                <button class="btn btn-secondary">

                    Consultar VoBo

                </button>
            `;

            break;

        case "pendiente":

            badge =
                '<span class="badge badge-warning">Pendiente</span>';

            accion = `
                <button class="btn btn-primary">

                    Emitir VoBo

                </button>
            `;

            break;

        case "rechazado":

            badge =
                '<span class="badge badge-danger">Rechazado</span>';

            accion = `
                <button class="btn btn-secondary">

                    Consultar rechazo

                </button>
            `;

            break;

        default:

            badge =
                '<span class="badge">

                    Sin definir

                </span>';

    }

    return `

        <div
            class="card"
            style="
                border-left:5px solid var(--vino);
            ">

            <div
                style="
                    display:flex;
                    justify-content:space-between;
                    gap:24px;
                    flex-wrap:wrap;
                ">

                <div
                    style="flex:1;min-width:320px;">

                    <strong>

                        ${vobo.responsable}

                    </strong>

                    <br>

                    <small>

                        ${vobo.cargo}

                    </small>

                    <br><br>

                    Estado:

                    ${badge}

                    <br><br>

                    <strong>

                        Fecha

                    </strong>

                    <br>

                    ${vobo.fecha}

                </div>

                <div
                    style="
                        display:flex;
                        align-items:flex-start;
                    ">

                    ${accion}

                </div>

            </div>

        </div>

    `;

}



/* ==========================================================
   VoBos DEMO

   Posteriormente serán obtenidos mediante RPC.
========================================================== */

function obtenerVoBosDemo() {

    return [

        {

            id:1,

            responsable:
                "Ing. Carlos Hernández",

            cargo:
                "Director Técnico",

            fecha:
                "18/07/2026 11:40",

            estado:
                "emitido"

        },

        {

            id:2,

            responsable:
                "Lic. María González",

            cargo:
                "Secretaría",

            fecha:
                "--/--/----",

            estado:
                "pendiente"

        },

        {

            id:3,

            responsable:
                "Arq. José Ramírez",

            cargo:
                "Presidencia",

            fecha:
                "--/--/----",

            estado:
                "pendiente"

        }

    ];

}
