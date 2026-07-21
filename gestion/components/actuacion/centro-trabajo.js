"use strict";

/* ==========================================================
   SIGE
   Sistema Integral de Gestión de Expedientes

   Archivo:
   components/actuacion/centro-trabajo.js

   RELEASE 001

   MÓDULO 1
   Infraestructura del componente

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

        ${renderHeaderCentroTrabajo(actuacion)}

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

function renderHeaderCentroTrabajo(actuacion) {

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
        actuacion.avance ?? 45;

    const estado =
        actuacion.estado ?? "En proceso";

    const etapa =
        actuacion.etapa ?? "Integración documental";

    const documentos =
        actuacion.documentosPendientes ?? 1;

    const observaciones =
        actuacion.observacionesPendientes ?? 2;

    const voBos =
        actuacion.voBosPendientes ?? 1;

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
                        <strong>${documentos}</strong>

                    </div>

                    <div>

                        💬 Observaciones:
                        <strong>${observaciones}</strong>

                    </div>

                    <div>

                        ✔ VoBos:
                        <strong>${voBos}</strong>

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
        actuacion.workflow
        ?? obtenerWorkflowDemo();

    return `

        <div class="card">

            <div class="card-title">

                Workflow de la actuación

            </div>

            <div class="card-subtitle">

                El Workflow determina la etapa
                actual del procedimiento y las
                transiciones disponibles para
                el usuario.

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

                <div
                    style="flex:1;">

                    <strong>

                        ${paso.nombre}

                    </strong>

                    <br><br>

                    ${paso.descripcion}

                    ${paso.responsable
                        ? `
                            <br><br>

                            <strong>

                                Responsable

                            </strong>

                            <br>

                            ${paso.responsable}
                        `
                        : ""
                    }

                </div>

                <div
                    style="
                        display:flex;
                        flex-direction:column;
                        align-items:flex-end;
                        gap:12px;
                    ">

                    ${badge}

                    ${paso.fecha
                        ? `
                            <small>

                                ${paso.fecha}

                            </small>
                        `
                        : ""
                    }

                </div>

            </div>

        </div>

    `;

}



/* ==========================================================
   WORKFLOW DEMO

   Sustituido posteriormente por RPC
========================================================== */

function obtenerWorkflowDemo() {

    return [

        {

            id:1,

            nombre:
                "Recepción",

            descripcion:
                "Solicitud recibida e integrada.",

            responsable:
                "Mesa de Control",

            estado:
                "completado",

            fecha:
                "15/07/2026"

        },

        {

            id:2,

            nombre:
                "Integración documental",

            descripcion:
                "Validación de documentos obligatorios.",

            responsable:
                "Secretaría",

            estado:
                "completado",

            fecha:
                "16/07/2026"

        },

        {

            id:3,

            nombre:
                "Dictamen Técnico",

            descripcion:
                "Revisión técnica del expediente.",

            responsable:
                "Dirección Técnica",

            estado:
                "activo",

            fecha:
                "17/07/2026"

        },

        {

            id:4,

            nombre:
                "Mesa Directiva",

            descripcion:
                "Pendiente de autorización.",

            responsable:
                "Mesa Directiva",

            estado:
                "pendiente"

        },

        {

            id:5,

            nombre:
                "Resolución",

            descripcion:
                "Disponible al concluir todas las etapas.",

            responsable:
                "Presidencia",

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
        actuacion.documentos
        ?? obtenerDocumentosDemo();

    return `

        <div class="card">

            <div class="card-title">

                Control documental

            </div>

            <div class="card-subtitle">

                Documentos requeridos para esta
                actuación conforme al Workflow.

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
    let acciones = "";

    switch (documento.estado) {

        case "vigente":

            badge =
                '<span class="badge badge-success">Vigente</span>';

            acciones = `

                <button
                    class="btn btn-secondary">

                    Ver documento

                </button>

            `;

            break;

        case "pendiente":

            badge =
                '<span class="badge">Pendiente</span>';

            acciones = `

                <button
                    class="btn btn-primary">

                    Subir documento

                </button>

            `;

            break;

        case "observado":

            badge =
                '<span class="badge badge-warning">Observado</span>';

            acciones = `

                <button
                    class="btn btn-primary">

                    Actualizar versión

                </button>

                <button
                    class="btn btn-secondary">

                    Ver documento

                </button>

            `;

            break;

        case "rechazado":

            badge =
                '<span class="badge badge-danger">Rechazado</span>';

            acciones = `

                <button
                    class="btn btn-primary">

                    Sustituir documento

                </button>

            `;

            break;

        case "no_requerido":

            badge =
                '<span class="badge">No requerido</span>';

            acciones = "";

            break;

        default:

            badge =
                '<span class="badge">Sin estado</span>';

            acciones = "";

            break;

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
                    style="flex:1;min-width:340px;">

                    <strong>

                        ${documento.nombre}

                    </strong>

                    <br><br>

                    ${documento.descripcion}

                    <br><br>

                    ${badge}

                    ${documento.version
                        ? `

                            <br><br>

                            <strong>

                                Versión

                            </strong>

                            ${documento.version}

                        `
                        : ""
                    }

                    ${documento.fecha
                        ? `

                            <br>

                            <strong>

                                Fecha

                            </strong>

                            ${documento.fecha}

                        `
                        : ""
                    }

                </div>

                <div
                    style="
                        display:flex;
                        flex-wrap:wrap;
                        gap:10px;
                        align-items:flex-start;
                    ">

                    ${acciones}

                </div>

            </div>

        </div>

    `;

}


/* ==========================================================
   DOCUMENTOS DEMO

   Sustituido posteriormente por RPC
========================================================== */

function obtenerDocumentosDemo() {

    return [

        {

            id:1,

            nombre:
                "Solicitud firmada",

            descripcion:
                "Documento inicial del procedimiento.",

            estado:
                "vigente",

            version:
                "1.0",

            fecha:
                "15/07/2026"

        },

        {

            id:2,

            nombre:
                "Plano arquitectónico",

            descripcion:
                "Plano oficial presentado por el promovente.",

            estado:
                "observado",

            version:
                "2.1",

            fecha:
                "17/07/2026"

        },

        {

            id:3,

            nombre:
                "Memoria descriptiva",

            descripcion:
                "Documento técnico del proyecto.",

            estado:
                "vigente",

            version:
                "1.2",

            fecha:
                "16/07/2026"

        },

        {

            id:4,

            nombre:
                "Fianza",

            descripcion:
                "Garantía requerida por el procedimiento.",

            estado:
                "pendiente"

        },

        {

            id:5,

            nombre:
                "Resolución ambiental",

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

                Observaciones registradas durante
                el desarrollo de esta actuación.

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
    let acciones = "";

    switch (observacion.estado) {

        case "pendiente":

            badge =
                '<span class="badge badge-warning">Pendiente</span>';

            acciones = `

                <button
                    class="btn btn-primary">

                    Atender observación

                </button>

            `;

            break;

        case "atendida":

            badge =
                '<span class="badge badge-success">Atendida</span>';

            acciones = `

                <button
                    class="btn btn-secondary">

                    Consultar atención

                </button>

            `;

            break;

        case "cancelada":

            badge =
                '<span class="badge">Cancelada</span>';

            acciones = "";

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
                    style="flex:1;min-width:340px;">

                    <strong>

                        ${observacion.usuario}

                    </strong>

                    <br>

                    <small>

                        ${observacion.fecha}

                    </small>

                    <br><br>

                    ${observacion.descripcion}

                    ${observacion.documento
                        ? `

                            <br><br>

                            <strong>

                                Documento relacionado

                            </strong>

                            <br>

                            ${observacion.documento}

                        `
                        : ""
                    }

                    <br><br>

                    ${badge}

                </div>

                <div
                    style="
                        display:flex;
                        flex-wrap:wrap;
                        gap:10px;
                        align-items:flex-start;
                    ">

                    ${acciones}

                </div>

            </div>

        </div>

    `;

}



/* ==========================================================
   OBSERVACIONES DEMO

   Sustituido posteriormente por RPC
========================================================== */

function obtenerObservacionesDemo() {

    return [

        {

            id:1,

            usuario:
                "Dirección Técnica",

            fecha:
                "18/07/2026 09:15",

            documento:
                "Plano arquitectónico",

            descripcion:
                "Actualizar el plano para incorporar las observaciones realizadas durante la revisión técnica.",

            estado:
                "pendiente"

        },

        {

            id:2,

            usuario:
                "Secretaría",

            fecha:
                "17/07/2026 15:40",

            documento:
                "Memoria descriptiva",

            descripcion:
                "La observación fue solventada correctamente mediante la versión 1.2.",

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
                Workflow para concluir esta etapa.

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
    let acciones = "";

    switch (vobo.estado) {

        case "emitido":

            badge =
                '<span class="badge badge-success">Emitido</span>';

            acciones = `

                <button
                    class="btn btn-secondary">

                    Consultar VoBo

                </button>

            `;

            break;

        case "pendiente":

            badge =
                '<span class="badge badge-warning">Pendiente</span>';

            acciones = `

                <button
                    class="btn btn-primary">

                    Emitir VoBo

                </button>

            `;

            break;

        case "rechazado":

            badge =
                '<span class="badge badge-danger">Rechazado</span>';

            acciones = `

                <button
                    class="btn btn-secondary">

                    Consultar rechazo

                </button>

            `;

            break;

        default:

            badge =
                '<span class="badge">Sin definir</span>';

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
                    style="flex:1;min-width:340px;">

                    <strong>

                        ${vobo.responsable}

                    </strong>

                    <br>

                    ${vobo.cargo}

                    <br><br>

                    ${badge}

                    <br><br>

                    <strong>

                        Fecha

                    </strong>

                    <br>

                    ${vobo.fecha ?? "--/--/----"}

                </div>

                <div
                    style="
                        display:flex;
                        flex-wrap:wrap;
                        gap:10px;
                        align-items:flex-start;
                    ">

                    ${acciones}

                </div>

            </div>

        </div>

    `;

}



/* ==========================================================
   VoBos DEMO

   Sustituido posteriormente por RPC
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
                "18/07/2026",

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
                null,

            estado:
                "pendiente"

        },

        {

            id:3,

            responsable:
                "Arq. José Ramírez",

            cargo:
                "Presidente",

            fecha:
                null,

            estado:
                "pendiente"

        }

    ];

}

/* ==========================================================
   BITÁCORA
========================================================== */

function renderBitacora(actuacion) {

    const movimientos =
        actuacion.bitacora
        ?? obtenerBitacoraDemo();

    return `

        <div class="card">

            <div class="card-title">

                Bitácora de la actuación

            </div>

            <div class="card-subtitle">

                Registro cronológico de todos los
                movimientos realizados durante
                esta actuación.

            </div>

            <div
                style="
                    display:flex;
                    flex-direction:column;
                    gap:16px;
                    margin-top:24px;
                ">

                ${movimientos
                    .map(renderMovimiento)
                    .join("")}

            </div>

        </div>

    `;

}



/* ==========================================================
   MOVIMIENTO
========================================================== */

function renderMovimiento(movimiento) {

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
                    gap:20px;
                    flex-wrap:wrap;
                ">

                <div style="flex:1;">

                    <strong>

                        ${movimiento.usuario}

                    </strong>

                    <br>

                    <small>

                        ${movimiento.fecha}

                    </small>

                    <br><br>

                    ${movimiento.descripcion}

                </div>

                <div>

                    <span class="badge">

                        ${movimiento.tipo}

                    </span>

                </div>

            </div>

        </div>

    `;

}



/* ==========================================================
   ACCIONES DEL WORKFLOW
========================================================== */

function renderAcciones(actuacion) {

    const acciones =
        actuacion.acciones
        ?? obtenerAccionesDemo();

    return `

        <div class="card">

            <div class="card-title">

                Acciones disponibles

            </div>

            <div class="card-subtitle">

                Estas acciones son determinadas
                por el Workflow para el estado
                actual de la actuación.

            </div>

            <div
                style="
                    display:flex;
                    flex-wrap:wrap;
                    gap:14px;
                    margin-top:24px;
                ">

                ${acciones
                    .map(renderAccion)
                    .join("")}

            </div>

        </div>

    `;

}



/* ==========================================================
   ACCIÓN
========================================================== */

function renderAccion(accion) {

    return `

        <button
            class="${accion.clase || 'btn btn-primary'}"
            data-accion="${accion.codigo}">

            ${accion.nombre}

        </button>

    `;

}



/* ==========================================================
   EVENTOS
========================================================== */

function registrarEventos() {

    document
        .querySelectorAll("[data-accion]")
        .forEach(boton => {

            boton.addEventListener(

                "click",

                manejarAccionWorkflow

            );

        });

}



/* ==========================================================
   MANEJADOR DE ACCIONES
========================================================== */

function manejarAccionWorkflow(evento) {

    const codigo =
        evento.currentTarget.dataset.accion;

    console.log(

        "Acción Workflow:",

        codigo

    );

    /*
        RELEASE 002

        Este método ejecutará la RPC
        correspondiente enviada por
        el Workflow Engine.

    */

}



/* ==========================================================
   ACTUALIZAR
========================================================== */

function actualizar(actuacion = actuacionActual) {

    render(actuacion);

}



/* ==========================================================
   DESTRUIR
========================================================== */

function destruir() {

    const workspace =
        document.getElementById("workspace");

    if (workspace) {

        workspace.innerHTML = "";

    }

}



/* ==========================================================
   DATOS DEMO
========================================================== */

function obtenerBitacoraDemo() {

    return [

        {

            usuario:
                "Administrador",

            fecha:
                "15/07/2026 09:15",

            descripcion:
                "Se registró el expediente.",

            tipo:
                "Registro"

        },

        {

            usuario:
                "Dirección Técnica",

            fecha:
                "16/07/2026 12:40",

            descripcion:
                "Se emitió observación al plano arquitectónico.",

            tipo:
                "Observación"

        },

        {

            usuario:
                "Administrador",

            fecha:
                "17/07/2026 08:20",

            descripcion:
                "Se integró una nueva versión del plano.",

            tipo:
                "Documento"

        },

        {

            usuario:
                "Secretaría",

            fecha:
                "18/07/2026 10:05",

            descripcion:
                "La actuación quedó lista para VoBo.",

            tipo:
                "Workflow"

        }

    ];

}



function obtenerAccionesDemo() {

    return [

        {

            codigo:
                "ACTUALIZAR_PLANO",

            nombre:
                "Actualizar plano"

        },

        {

            codigo:
                "EMITIR_VOBO",

            nombre:
                "Emitir VoBo",

            clase:
                "btn btn-secondary"

        },

        {

            codigo:
                "CONSULTAR_HISTORIAL",

            nombre:
                "Consultar historial",

            clase:
                "btn btn-light"

        }

    ];

}



/* ==========================================================
   EXPORTACIÓN
========================================================== */

window.CentroTrabajo = CentroTrabajo;
