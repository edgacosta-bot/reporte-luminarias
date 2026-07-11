"use strict";

/* ==========================================================
   SIGE
   Sistema Integral de Gestión de Expedientes

   Archivo:
   components/actuacion/centro-trabajo.js

   Versión:
   1.0.0

   Responsabilidad:

   Construir el Centro de Trabajo de una
   actuación.

   Este componente constituye el principal
   espacio de trabajo del usuario.

   Aquí se concentran:

   • Estado de la actuación
   • Workflow
   • Control documental
   • Observaciones
   • VoBos
   • Bitácora
   • Acciones disponibles

========================================================== */


/* ==========================================================
   COMPONENTE
========================================================== */

const CentroTrabajo = {

    render,

    renderHeader,

    renderEstado,

    renderWorkflow,

    renderControlDocumental,

    renderObservaciones,

    renderVoBos,

    renderBitacora,

    renderAcciones,

    registrarEventos,

    actualizar,

    destruir

};



/* ==========================================================
   RENDER PRINCIPAL
========================================================== */

function render(actuacion = {}) {

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

    return `

        <div class="card">

            <div class="card-title">

                Centro de Trabajo

            </div>

            <div class="card-subtitle">

                Procedimiento

                <strong>

                    ${actuacion.procedimiento
                        ?? "O-2026-001"}

                </strong>

                <br><br>

                Actuación

                <strong>

                    ${actuacion.nombre
                        ?? "Integración Documental"}

                </strong>

            </div>

        </div>

    `;

}



/* ==========================================================
   ESTADO
========================================================== */

function renderEstado(actuacion) {

    return `

        <div class="grid grid-3">

            <div class="card">

                <div class="card-title">

                    Estado

                </div>

                <div class="kpi-number">

                    🟡

                </div>

                <div class="kpi-label">

                    En revisión

                </div>

            </div>

            <div class="card">

                <div class="card-title">

                    Documentos

                </div>

                <div class="kpi-number">

                    3 / 4

                </div>

                <div class="kpi-label">

                    Integrados

                </div>

            </div>

            <div class="card">

                <div class="card-title">

                    VoBos

                </div>

                <div class="kpi-number">

                    2 / 3

                </div>

                <div class="kpi-label">

                    Emitidos

                </div>

            </div>

        </div>

    `;

}

/* ==========================================================
   CONTROL DOCUMENTAL
========================================================== */

function renderControlDocumental(actuacion) {

    return `

        <div class="card">

            <div class="card-title">

                Control Documental

            </div>

            <div class="card-subtitle">

                El Workflow determina los documentos
                requeridos para esta actuación.

            </div>

            ${renderDocumento({

                id:1,

                nombre:"Plano arquitectónico",

                requerido:true,

                version:2,

                estado:"OBSERVADO",

                observacion:"El plano no es legible.",

                accion:"ACTUALIZAR"

            })}

            ${renderDocumento({

                id:2,

                nombre:"Comprobante de fianza",

                requerido:true,

                version:1,

                estado:"VIGENTE",

                observacion:null,

                accion:"VER"

            })}

            ${renderDocumento({

                id:3,

                nombre:"Cotización",

                requerido:true,

                version:null,

                estado:"PENDIENTE",

                observacion:null,

                accion:"SUBIR"

            })}

        </div>

    `;

}



/* ==========================================================
   DOCUMENTO
========================================================== */

function renderDocumento(documento) {

    let badge = "";

    let boton = "";

    switch(documento.estado){

        case "VIGENTE":

            badge =
                '<span class="badge badge-success">Vigente</span>';

            boton = `

                <button
                    class="btn btn-secondary documento-ver"
                    data-id="${documento.id}">

                    Ver documento

                </button>

            `;

            break;

        case "OBSERVADO":

            badge =
                '<span class="badge badge-danger">Observado</span>';

            boton = `

                <button
                    class="btn btn-primary documento-actualizar"
                    data-id="${documento.id}">

                    Actualizar versión

                </button>

            `;

            break;

        default:

            badge =
                '<span class="badge">Pendiente</span>';

            boton = `

                <button
                    class="btn btn-primary documento-subir"
                    data-id="${documento.id}">

                    Subir documento

                </button>

            `;

    }

    return `

        <div
            class="card"
            style="
                margin-top:18px;
                border-left:5px solid var(--vino);
            ">

            <div
                style="
                    display:flex;
                    justify-content:space-between;
                    align-items:flex-start;
                    gap:20px;
                ">

                <div>

                    <div
                        style="
                            font-size:18px;
                            font-weight:600;
                        ">

                        ${documento.nombre}

                    </div>

                    <div
                        style="
                            margin-top:8px;
                            color:var(--texto-secundario);
                        ">

                        Documento requerido

                    </div>

                    <div
                        style="
                            margin-top:10px;
                        ">

                        ${badge}

                    </div>

                </div>

                <div
                    style="
                        text-align:right;
                    ">

                    <strong>

                        ${documento.version
                            ? "Versión " + documento.version
                            : "Sin versión"}

                    </strong>

                </div>

            </div>

            ${renderObservacionDocumento(documento)}

            <div
                style="
                    margin-top:18px;
                ">

                ${boton}

            </div>

        </div>

    `;

}



/* ==========================================================
   OBSERVACIÓN DEL DOCUMENTO
========================================================== */

function renderObservacionDocumento(documento){

    if(!documento.observacion)
        return "";

    return `

        <div
            style="
                margin-top:18px;
                padding:16px;
                border-radius:10px;
                background:#FEF2F2;
                border:1px solid #FECACA;
            ">

            <strong>

                Observación

            </strong>

            <br><br>

            ${documento.observacion}

        </div>

    `;

}

/* ==========================================================
   OBSERVACIONES
========================================================== */

function renderObservaciones(actuacion) {

    return `

        <div class="card">

            <div class="card-title">

                Observaciones

            </div>

            <div class="card-subtitle">

                Revise las observaciones pendientes
                y atiéndalas para continuar con
                el procedimiento.

            </div>

            ${renderObservacion({

                id:1,

                usuario:"Secretario",

                fecha:"16/07/2026 12:40",

                documento:"Plano arquitectónico",

                descripcion:"El plano arquitectónico no es legible. Favor de adjuntar una versión con mayor resolución.",

                atendida:false

            })}

            ${renderObservacion({

                id:2,

                usuario:"Tesorero",

                fecha:"17/07/2026 09:10",

                documento:"Comprobante de fianza",

                descripcion:"Documento validado correctamente.",

                atendida:true

            })}

        </div>

    `;

}



/* ==========================================================
   OBSERVACIÓN
========================================================== */

function renderObservacion(observacion){

    const estado = observacion.atendida

        ?

        '<span class="badge badge-success">Atendida</span>'

        :

        '<span class="badge badge-warning">Pendiente</span>';



    const boton = observacion.atendida

        ?

        `

            <button
                class="btn btn-secondary"
                disabled>

                Atendida

            </button>

        `

        :

        `

            <button
                class="btn btn-primary atender-observacion"
                data-id="${observacion.id}">

                Atender observación

            </button>

        `;



    return `

        <div
            class="card"
            style="
                margin-top:18px;
                border-left:5px solid #F59E0B;
            ">

            <div
                style="
                    display:flex;
                    justify-content:space-between;
                    align-items:flex-start;
                    gap:18px;
                ">

                <div>

                    <strong>

                        ${observacion.usuario}

                    </strong>

                    <br>

                    ${observacion.fecha}

                    <br><br>

                    <strong>

                        Documento

                    </strong>

                    <br>

                    ${observacion.documento}

                </div>

                <div>

                    ${estado}

                </div>

            </div>

            <div
                style="
                    margin-top:18px;
                    padding:16px;
                    background:#FFF7ED;
                    border-radius:10px;
                ">

                ${observacion.descripcion}

            </div>

            <div
                style="
                    margin-top:18px;
                    display:flex;
                    justify-content:flex-end;
                ">

                ${boton}

            </div>

        </div>

    `;

}

/* ==========================================================
   VOBOS
========================================================== */

function renderVoBos(actuacion) {

    return `

        <div class="card">

            <div class="card-title">

                VoBos del Workflow

            </div>

            <div class="card-subtitle">

                Estado actual de aprobación
                de la actuación.

            </div>

            ${renderVoBo({

                id:1,

                responsable:"Presidente",

                estado:"PENDIENTE",

                fecha:null

            })}

            ${renderVoBo({

                id:2,

                responsable:"Secretario",

                estado:"EMITIDO",

                fecha:"17/07/2026 10:45"

            })}

            ${renderVoBo({

                id:3,

                responsable:"Tesorero",

                estado:"EMITIDO",

                fecha:"17/07/2026 09:22"

            })}

        </div>

    `;

}



/* ==========================================================
   VOBO
========================================================== */

function renderVoBo(vobo){

    let badge="";

    let accion="";

    switch(vobo.estado){

        case "EMITIDO":

            badge =
                '<span class="badge badge-success">Emitido</span>';

            accion = `

                <button
                    class="btn btn-secondary"
                    disabled>

                    Emitido

                </button>

            `;

            break;

        default:

            badge =
                '<span class="badge badge-warning">Pendiente</span>';

                    Pendiente

                </span>';

            accion = `

                <button
                    class="btn btn-primary emitir-vobo"
                    data-id="${vobo.id}">

                    Emitir VoBo

                </button>

            `;

    }

    return `

        <div
            class="card"
            style="
                margin-top:18px;
                border-left:5px solid #2563EB;
            ">

            <div
                style="
                    display:flex;
                    justify-content:space-between;
                    align-items:flex-start;
                    gap:20px;
                ">

                <div>

                    <strong>

                        ${vobo.responsable}

                    </strong>

                    <br><br>

                    ${vobo.fecha
                        ?? "Pendiente de emisión"}

                </div>

                <div>

                    ${badge}

                </div>

            </div>

            <div
                style="
                    margin-top:18px;
                    display:flex;
                    justify-content:flex-end;
                ">

                ${accion}

            </div>

        </div>

    `;

}

/* ==========================================================
   BITÁCORA
========================================================== */

function renderBitacora(actuacion) {

    return `

        <div class="card">

            <div class="card-title">

                Bitácora de la actuación

            </div>

            <div class="card-subtitle">

                Historial cronológico de eventos.

            </div>

            ${renderEventoBitacora({

                fecha:"15/07/2026 09:18",

                usuario:"Administrador",

                descripcion:"Se registró la actuación."

            })}

            ${renderEventoBitacora({

                fecha:"16/07/2026 12:40",

                usuario:"Secretario",

                descripcion:"Se emitió una observación al plano arquitectónico."

            })}

            ${renderEventoBitacora({

                fecha:"17/07/2026 08:22",

                usuario:"Administrador",

                descripcion:"Se cargó la versión 2 del plano arquitectónico."

            })}

        </div>

    `;

}



/* ==========================================================
   EVENTO
========================================================== */

function renderEventoBitacora(evento){

    return `

        <div
            class="card"
            style="
                margin-top:16px;
                border-left:4px solid var(--vino);
            ">

            <strong>

                ${evento.fecha}

            </strong>

            <br><br>

            <strong>

                ${evento.usuario}

            </strong>

            <br>

            ${evento.descripcion}

        </div>

    `;

}



/* ==========================================================
   ACCIONES
========================================================== */

function renderAcciones(actuacion){

    return `

        <div class="card">

            <div class="card-title">

                Acciones disponibles

            </div>

            <div class="card-subtitle">

                El Workflow únicamente habilita
                las acciones permitidas para
                este usuario.

            </div>

            <div
                style="
                    display:grid;
                    grid-template-columns:
                        repeat(auto-fit,minmax(260px,1fr));
                    gap:16px;
                    margin-top:24px;
                ">

                ${renderAccion({

                    icono:"📄",

                    titulo:"Actualizar plano arquitectónico",

                    descripcion:"Atender la observación del Secretario.",

                    clase:"btn-primary",

                    accion:"actualizar-plano"

                })}

                ${renderAccion({

                    icono:"✔",

                    titulo:"Emitir VoBo",

                    descripcion:"Continuar el Workflow.",

                    clase:"btn-secondary",

                    accion:"emitir-vobo"

                })}

                ${renderAccion({

                    icono:"🕓",

                    titulo:"Consultar historial",

                    descripcion:"Ver todas las versiones y movimientos.",

                    clase:"btn-light",

                    accion:"historial"

                })}

            </div>

        </div>

    `;

}



/* ==========================================================
   ACCIÓN
========================================================== */

function renderAccion(accion){

    return `

        <div
            class="card"
            style="
                display:flex;
                flex-direction:column;
                gap:14px;
            ">

            <div
                style="
                    font-size:32px;
                ">

                ${accion.icono}

            </div>

            <strong>

                ${accion.titulo}

            </strong>

            <div
                style="
                    color:var(--texto-secundario);
                ">

                ${accion.descripcion}

            </div>

            <button
                class="btn ${accion.clase}"
                data-accion="${accion.accion}">

                Ejecutar

            </button>

        </div>

    `;

}

/* ==========================================================
   EVENTOS
========================================================== */

function registrarEventos() {

    document

        .querySelectorAll(

            ".documento-subir"

        )

        .forEach(

            boton => {

                boton.addEventListener(

                    "click",

                    () => {

                        console.log(

                            "Subir documento",

                            boton.dataset.id

                        );

                    }

                );

            }

        );



    document

        .querySelectorAll(

            ".documento-actualizar"

        )

        .forEach(

            boton => {

                boton.addEventListener(

                    "click",

                    () => {

                        console.log(

                            "Actualizar documento",

                            boton.dataset.id

                        );

                    }

                );

            }

        );



    document

        .querySelectorAll(

            ".documento-ver"

        )

        .forEach(

            boton => {

                boton.addEventListener(

                    "click",

                    () => {

                        console.log(

                            "Ver documento",

                            boton.dataset.id

                        );

                    }

                );

            }

        );



    document

        .querySelectorAll(

            ".emitir-vobo"

        )

        .forEach(

            boton => {

                boton.addEventListener(

                    "click",

                    () => {

                        console.log(

                            "Emitir VoBo",

                            boton.dataset.id

                        );

                    }

                );

            }

        );



    document

        .querySelectorAll(

            ".atender-observacion"

        )

        .forEach(

            boton => {

                boton.addEventListener(

                    "click",

                    () => {

                        console.log(

                            "Atender observación",

                            boton.dataset.id

                        );

                    }

                );

            }

        );



    document

        .querySelectorAll(

            "[data-accion]"

        )

        .forEach(

            boton => {

                boton.addEventListener(

                    "click",

                    () => {

                        console.log(

                            "Acción:",

                            boton.dataset.accion

                        );

                    }

                );

            }

        );



    console.log(

        "✓ Centro de Trabajo listo."

    );

}



/* ==========================================================
   ACTUALIZAR
========================================================== */

function actualizar(actuacion) {

    render(actuacion);

}



/* ==========================================================
   DESTRUIR
========================================================== */

function destruir() {

    const workspace =

        document.getElementById(

            "workspace"

        );

    if(!workspace)
        return;

    workspace.innerHTML = "";

}



/* ==========================================================
   EXPORTACIÓN
========================================================== */

window.CentroTrabajo =
    CentroTrabajo;
