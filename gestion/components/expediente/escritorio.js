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

    renderRequisitos,

    renderBitacora,

    renderAcciones,

    actualizar,

    destruir

};

let escritorioActual = null;

/* ==========================================================
   RENDER PRINCIPAL
========================================================== */

function render(data = {}) {

   console.log("DATOS ESCRITORIO:", data);

   window.escritorioData = data;

   console.log(
       "OBRA ACTUAL:",
       data.obra
   );

   escritorioActual = data;

    
    const workspace =
        document.getElementById(
            "workspace"
        );

    if (!workspace)
        return;

      
  const html = `

    ${renderHeader(data)}

    ${renderRequisitos(data)}

    ${renderBitacora(data)}

`;
   
workspace.innerHTML = html;

   registrarEventosRequisitos();   

}


/* ==========================================================
   ENCABEZADO
========================================================== */

function renderHeader(data) {

    const expediente = data.expediente ?? {};

    const etiquetaResolucion =
        expediente.tipo_resolucion === "REGULARIZACION"
            ? "Fecha de regularización"
            : "Fecha de autorización";

    const fechaResolucion =
        expediente.fecha_resolucion
            ? new Date(expediente.fecha_resolucion)
                .toLocaleDateString("es-MX")
            : "-";

    return `

        <section class="bloque">

            <h2 class="bloque-titulo">
                DATOS GENERALES DEL EXPEDIENTE
            </h2>

            <div class="card">
        

            <div style="
                display:grid;
                grid-template-columns:repeat(3,1fr);
                gap:20px;
            ">

                <div>
                    <strong>Tipo de expediente</strong>
                    <br>
                    ${expediente.tipo?.nombre ?? "-"}
                </div>

                <div>
                    <strong>Tipo de obra</strong>
                    <br>
                    ${expediente.tipo_obra ?? "-"}
                </div>

               <div>
                   <strong>Director Responsable de Obra</strong>
                   <br>
                   ${data.obra?.dro_nombre ?? "-"}
               </div>

                <div>
                    <strong>Folio</strong>
                    <br>
                    ${expediente.folio ?? "-"}
                </div>

                <div>
                    <strong>Privada</strong>
                    <br>
                    ${expediente.privada ?? "-"}
                </div>

                <div>
                    <strong>Lote</strong>
                    <br>
                    ${expediente.lote ?? "-"}
                </div>

                <div>
                    <strong>Calle</strong>
                    <br>
                    ${expediente.calle ?? "-"}
                </div>

                <div>
                      <strong>Situación actual</strong>
                      <br>
                      ${expediente.situacion_actual ?? "-"}
                 </div>

                <div>
                     <strong>Etapa</strong>
                     <br>
                      ${expediente.etapa?.nombre ?? "-"}
                </div>

                <div>
                    <strong>${etiquetaResolucion}</strong>
                    <br>
                    ${fechaResolucion}
                </div>

            </div>

                    </div>

        </section>

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
   REQUISITOS DE LA ETAPA
========================================================== */

function renderRequisitos(data) {

    const requisitos = data.requisitos ?? [];

    const tarjetas = requisitos
    .map((r, indice) =>
        renderTarjetaRequisito(r, indice + 1)
    )
    .join("");

    return `

        <section class="bloque">

            <h2 class="bloque-titulo">
                REQUISITOS PARA APROBACIÓN
            </h2>

            <div class="card">

                ${tarjetas}

            </div>

        </section>

    `;

}

/* ==========================================================
   TARJETA DE REQUISITO
========================================================== */

function renderTarjetaRequisito(r, numero) {

    const estado =
        r.estado === "CUMPLIDO"
            ? "✅"
            : "⏳";

    const documento =
    r.archivo_nombre
        ? `
            <strong>Documento vigente</strong><br>
            ${r.archivo_nombre}<br>
            Versión ${r.version ?? 1}
        `
        : `
            <strong>Documento vigente</strong><br>
            No existe documento incorporado.
        `;

    const acciones = renderAccionesRequisito(r);

    return `

        <div class="card" style="margin-top:16px;">

            <div style="font-size:18px;font-weight:600;">
             ${numero}. ${estado} ${r.nombre}
            </div>

            <div style="margin-top:12px;">
                ${documento}
            </div>

            <div
                style="
                    margin-top:18px;
                    display:flex;
                    gap:10px;
                    flex-wrap:wrap;
                ">

                ${acciones}

            </div>

        </div>

    `;
}


/* ==========================================================
   ACCIONES DEL REQUISITO
========================================================== */

function renderAccionesRequisito(r) {

    switch (r.tipo_captura) {

        case "PDF":
            return renderAccionesPdf(r);

        case "TELEFONO":
            return renderAccionesDato(r);

        case "EMAIL":
            return renderAccionesDato(r);


        case "DATOS_DRO":
            return renderAccionesDatosDRO(r);


        case "DATOS_PROPIETARIO":
            return renderAccionesDatosPropietario(r);


        default:
            return "";

    }

}
function renderAccionesPdf(r) {

    const tieneDocumento = !!r.archivo_nombre;

    if (tieneDocumento) {

        return `
            <div class="acciones-requisito">

                <button
                    class="btn btn-outline-primary btn-sm"
                    data-accion="consultar-documento"
                    data-requisito="${r.expediente_requisito_id}">
                    Consultar
                </button>

                <button
                    class="btn btn-outline-secondary btn-sm"
                    data-accion="sustituir-documento"
                    data-requisito="${r.expediente_requisito_id}">
                    Sustituir
                </button>

            </div>
        `;

    }

    return `
        <div class="acciones-requisito">

            <button
                class="btn btn-primary btn-sm"
                data-accion="incorporar-documento"
                data-requisito="${r.expediente_requisito_id}">
                Incorporar documento
            </button>

        </div>
    `;

}


function renderAccionesDato(r) {

    console.log("REQUISITO:", r);

    const requisitoId =
        r.expediente_requisito_id ?? r.id;

    return `
        <div class="acciones-requisito">

            <input
                type="text"
                class="form-control form-control-sm"
                data-requisito="${r.id}"
                placeholder="${r.nombre}">

            <button
                class="btn btn-primary btn-sm"
                data-accion="cumplir-requisito"
                data-requisito="${requisitoId}">
                Guardar
            </button>

        </div>
    `;

}


function renderAccionesDatosDRO(r) {

    return `
        <div class="acciones-requisito">

            <button
                class="btn btn-primary btn-sm"
                data-accion="ingresar-datos-dro"
                data-requisito="${r.expediente_requisito_id ?? r.id}">
                
                Ingresar datos

            </button>

        </div>
    `;

}

function renderAccionesDatosPropietario(r) {

    return `
        <div class="acciones-requisito">

            <button
                class="btn btn-primary btn-sm"
                data-accion="ingresar-datos-propietario"
                data-requisito="${r.expediente_requisito_id ?? r.id}">
                
                Ingresar datos

            </button>

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


function registrarEventosRequisitos() {


    /*
    ======================================================
    REQUISITOS SIMPLES
    TELEFONO / EMAIL
    ======================================================
    */

    const botones =
        document.querySelectorAll(
            "[data-accion='cumplir-requisito']"
        );


    botones.forEach(
        boton => {

            boton.addEventListener(
                "click",
                async () => {


                    const requisitoId =
                        boton.dataset.requisito;


                    const input =
                        document.querySelector(
                            `[data-input-requisito="${requisitoId}"]`
                        );


                    const valor =
                        input?.value?.trim();



                    console.log({
                        requisitoId,
                        valor
                    });



                    const resultado =
                        await Workflow.cumplirRequisito(
                            requisitoId,
                            valor
                        );


                    console.log(
                        "Resultado RPC:",
                        resultado
                    );


                }
            );

        }
    );



    /*
    ======================================================
    DATOS DEL DRO
    ======================================================
    */

    const botonesDRO =
        document.querySelectorAll(
            "[data-accion='ingresar-datos-dro']"
        );


    botonesDRO.forEach(
        boton => {


            boton.addEventListener(
                "click",
                async () => {


                    const requisitoId =
                        boton.dataset.requisito;


                    console.log(
                        "Abrir formulario DRO",
                        requisitoId
                    );


                                const datos =
                await mostrarFormularioDRO();
            
            
            if(!datos){
                return;
            }
            
            
            console.log(
                "Datos capturados DRO:",
                datos
            );
            
            
            const resultado =
                await Workflow.guardarDatosDRO(
                    escritorioData.obra.id,
                    datos
                );
            
            
            console.log(
                "Resultado guardar DRO:",
                resultado
            );

                }
            );


        }
    );



    /*
    ======================================================
    DATOS DEL PROPIETARIO
    ======================================================
    */

    const botonesPropietario =
        document.querySelectorAll(
            "[data-accion='ingresar-datos-propietario']"
        );


    botonesPropietario.forEach(
        boton => {


            boton.addEventListener(
                "click",
                async () => {


                    const requisitoId =
                        boton.dataset.requisito;


                    console.log(
                        "Abrir formulario Propietario",
                        requisitoId
                    );


                }
            );


        }
    );


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
