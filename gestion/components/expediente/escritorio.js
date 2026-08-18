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
let contextoActual = window.contextoActual;

/* ==========================================================
   RENDER PRINCIPAL
========================================================== */

function render(
    data = {},
    contexto = {}
) {

   console.log("DATOS ESCRITORIO:", data);

console.log("CONTEXTO ESCRITORIO:", contexto);

console.log(
    "contexto.contexto:",
    contexto.contexto
);

console.log(
    "Claves de contexto:",
    Object.keys(contexto)
);

if (contexto.contexto) {

    console.log(
        "Claves de contexto.contexto:",
        Object.keys(contexto.contexto)
    );

}   

window.escritorioData = data;

console.log(
    "OBRA ACTUAL:",
    data.obra
);

escritorioActual = data;

contextoActual = contexto;

    
    const workspace =
        document.getElementById(
            "workspace"
        );

    if (!workspace)
        return;

      
  const html = `

${renderHeader(data)}

${renderRequisitos(data)}

${renderEstadoExpediente(data)}

${renderEjecucion(data)}

${renderVobos(data, contexto)}

`;

console.log(html);
   
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
                   ${data.obra?.tipo_obra ?? "-"}
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

    const requisitos =
    (data.requisitos ?? [])
    .filter(
        r => r.estado !== "CANCELADO"
    );

    const tarjetas = requisitos
.map((r, indice) =>
    renderTarjetaRequisito(
        r,
        indice + 1,
        contextoActual
    )
)
.join("");

   const titulo =
    contextoActual.rol === "ADMIN"
        ? "REQUISITOS PARA APROBACIÓN"
        : "DOCUMENTACIÓN DEL EXPEDIENTE";

    return `

        <section class="bloque">

            <h2 class="bloque-titulo">
    ${titulo}
</h2>

            <div class="card">

                ${tarjetas}

            </div>

        </section>

    `;

}


function renderVobos(
    data,
    contexto = {}
) {

    //----------------------------------------------------------
    // El Administrador no participa en los VoBos
    //----------------------------------------------------------

    if (contextoActual.rol === "ADMIN") {

        return "";

    }


    const vobos =
        data.vobos ?? [];

    const cargoUsuario =
    contexto.contexto?.cargo_id;

    if (!vobos.length) {

        return "";

    }


    const filas =
        vobos.map(v => {

            const esMiVobo =
                v.cargo_id === cargoUsuario;

           console.log({
    cargo: v.cargo,
    esMiVobo,
    puedeEmitir: data.mesa_directiva?.puede_emitir_vobo,
    cargoUsuario,
    cargoVobo: v.cargo_id
});


            const estado =
                v.estado === "APROBADO"
                    ? "🟢 APROBADO"
                    : "🟡 PENDIENTE";


            const fecha =
                v.fecha
                    ? new Date(v.fecha)
                        .toLocaleString("es-MX")
                    : "-";


           const accion =
    esMiVobo &&
    data.mesa_directiva?.puede_emitir_vobo

        ? `

            <div
                style="
                    margin-top:12px;
                    text-align:right;
                ">

                <button
                    class="btn btn-primary"
                    data-accion="emitir-vobo"
                    data-vobo="${v.id}">

                    Emitir VoBo

                </button>

            </div>

        `
        : "";


           return `

<tr>

    <td>

        ${v.cargo}

        ${accion}

    </td>

    <td>

        ${estado}

    </td>

    <td>

        ${fecha}

    </td>

</tr>

`;
        }).join("");


    return `

<section class="bloque">

    <h2 class="bloque-titulo">

        VISTOS BUENOS DE MESA DIRECTIVA

    </h2>

    <div class="card">

        <table
            style="
                width:100%;
                border-collapse:collapse;
            ">

            <thead>

    <tr>

        <th>
            Cargo
        </th>

        <th>
            Estado
        </th>

        <th>
            Fecha
        </th>

    </tr>

</thead>

            <tbody>

                ${filas}

            </tbody>

        </table>

    </div>

</section>

`;

}


function renderEstadoExpediente(data) {


    const requisitos =
        data.requisitos ?? [];


    const obligatorios =
        requisitos.filter(
            r =>
                r.obligatorio === true &&
                r.estado !== "CANCELADO"
        );


    const completos =
        obligatorios.filter(
            r =>
                r.estado === "CUMPLIDO"
        );


    const listo =
        obligatorios.length > 0 &&
        completos.length === obligatorios.length;



    const situacion =
    data.expediente?.situacion_actual
    ??
    "";


const etapa =
    data.expediente?.etapa?.clave
    ??
    "";

   const estadoActual =
    data.expediente?.estado?.clave ?? "";

const puedeAutorizar =
    estadoActual === "APR" &&
    (data.mesa_directiva?.puede_autorizar ?? false);

   console.log("=== ESTADO EXPEDIENTE ===");
console.log(data.mesa_directiva);
console.log("puedeAutorizar:", puedeAutorizar);


    let accion = "";



   if (
    situacion === "Integración de documentación" &&
    listo
)
    
    {


        accion = `

            <button
                id="btnTurnarMesaDirectiva"
                class="btn btn-primary">

                Turnar expediente a Mesa Directiva

            </button>

        `;


    }
   else if (
    situacion === "En aprobación de Mesa Directiva"
)
    
    {


        accion = `

            <div
                class="alerta-exito">

                Expediente turnado a Mesa Directiva

            </div>

        `;


    }

  const botonAutorizar =
    puedeAutorizar
        ? `
            <button
                class="btn btn-success"
                id="btnAutorizarExpediente">
                Autorizar expediente
            </button>
          `
        : "";

    return `

    <section class="bloque">

        <h2 class="bloque-titulo">

            ESTADO DEL EXPEDIENTE

        </h2>


        <div class="card">

            <p>

                Integración documental

            </p>


            <p>

                ${completos.length}
                de
                ${obligatorios.length}
                requisitos completos

            </p>


            ${accion}

            ${botonAutorizar}


        </div>


    </section>

    `;

}

function renderEjecucion(data) {

    const etapa =
        data.expediente?.etapa?.clave ?? "";

    if (etapa !== "EJE")
        return "";

    const suspendida =
        data.ejecucion?.suspendida ?? false;

    const estado =
        suspendida
            ? "🟠 Obra suspendida"
            : "🟢 Obra en ejecución";

   return `

<section class="bloque">

    <h2 class="bloque-titulo">

        EJECUCIÓN DE LA OBRA

    </h2>

    <div class="card">

        <p>

            ${estado}

        </p>

       <div
    id="accionesEjecucion">

    ${
        !suspendida
        ? `
            <button
                id="btnSuspenderObra"
                class="btn btn-warning">

                Suspender obra

            </button>

            <button
                id="btnSolicitarTerminacion"
                class="btn btn-primary">

                Solicitar terminación

            </button>
        `
        : `
            <button
                id="btnReanudarObra"
                class="btn btn-success">

                Reanudar obra

            </button>
        `
    }

</div>

    </div>

</section>

`;

}

/* ==========================================================
   TARJETA DE REQUISITO
========================================================== */

function renderTarjetaRequisito(
    r,
    numero,
    contexto = {}
) {

    const estado =
        r.estado === "CUMPLIDO"
            ? "✅"
            : "⏳";

    let documento = "";


         if (r.tipo_captura === "PDF") {
         
         
             documento =
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
         
         
         }

   const acciones = renderAccionesRequisito(
    r,
    contexto
);

    return `

        <div class="card" style="margin-top:16px;">

            <div style="font-size:18px;font-weight:600;">
             ${numero}. ${estado} ${r.nombre}
            </div>

            ${documento ? `
<div style="margin-top:12px;">
    ${documento}
</div>
` : ""}   

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

function renderAccionesRequisito(
    r,
    contexto = {}
) {

       if (
    contexto.rol === "MESA_DIRECTIVA" ||
    contexto.rol === "PRESIDENTE"
) {

    switch (r.tipo_captura) {

        case "PDF":
            return renderAccionesConsulta(r);

        case "DATOS_DRO":
            return renderAccionesDatosDRO(r);

        case "DATOS_PROPIETARIO":
            return renderAccionesDatosPropietario(r);

        default:
            return "";

    }

}

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


function renderAccionesConsulta(r) {


    if (
        r.tipo_captura === "PDF" &&
        r.archivo_nombre
    ) {

        return `

            <button
                class="btn btn-secondary"
                data-accion="consultar-documento"
                data-requisito="${r.id}">

                📄 Ver documento

            </button>

        `;

    }


    return `

        <span
            style="
                color:var(--texto-secundario);
                font-size:14px;
            ">

            Sin acciones disponibles

        </span>

    `;

}


function renderAccionesPdf(r) {

    const tieneDocumento =
        !!r.archivo_nombre;


    if (tieneDocumento) {


        return `

           <div 
    class="acciones-requisito"
    style="
        margin-top:18px;
    "
>


    <button
                    class="btn btn-outline-primary btn-sm"
                    data-accion="consultar-documento"
                    data-requisito="${r.id}">

                    Consultar

                </button>


                <button
                    class="btn btn-outline-secondary btn-sm"
                    data-accion="sustituir-documento"
                    data-requisito="${r.id}">

                    Sustituir

                </button>


            </div>

        `;

    }


    return `

        <div 
    class="acciones-requisito"
    style="
        margin-top:18px;
    "
>


    <button
                class="btn btn-primary btn-sm"
                data-accion="incorporar-documento"
                data-requisito="${r.id}">

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

    const obra =
        escritorioData?.obra ?? {};

    const tieneDRO =
        !!obra.dro_id;

    if (tieneDRO) {

        return `

            <div class="datos-requisito">

                <div class="dato-bloque">

                    <strong>
                        Director Responsable de Obra
                    </strong>

                    <br>

                    Nombre:
                    ${obra.dro_nombre ?? "No registrado"}

                    <br>

                    Teléfono:
                    ${obra.dro_telefono ?? "No registrado"}

                    <br>

                    Correo:
                    ${obra.dro_correo ?? "No registrado"}

                </div>

            </div>

        `;

    }

    return `

        <div class="acciones-requisito">

            <button

                class="btn btn-primary btn-sm"

                data-accion="ingresar-datos-dro"

                data-requisito="${r.expediente_requisito_id ?? r.id}"

            >

                Ingresar datos

            </button>

        </div>

    `;

}


function renderAccionesDatosPropietario(r) {

    const obra =
        escritorioData?.obra ?? {};

    const tienePropietario =
        !!obra.propietario_id;

    if (tienePropietario) {

        return `

            <div class="datos-requisito">

                <div class="dato-bloque">

                    <strong>
                        Propietario
                    </strong>

                    <br>

                    Nombre:
                    ${obra.propietario_nombre ?? "No registrado"}

                    <br>

                    Teléfono:
                    ${obra.propietario_telefono ?? "No registrado"}

                    <br>

                    Correo:
                    ${obra.propietario_correo ?? "No registrado"}

                </div>

            </div>

        `;

    }

    return `

        <div class="acciones-requisito">

            <button

                class="btn btn-primary btn-sm"

                data-accion="ingresar-datos-propietario"

                data-requisito="${r.expediente_requisito_id ?? r.id}"

            >

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

    console.log("registrarEventosRequisitos()");

    registrarEventosRequisitosSimples();

    registrarEventoTurnarMesa();

    registrarEventoAutorizar();

    registrarEventosDRO();

    registrarEventosPropietario();

    registrarEventosDocumentos();

    registrarEventosVobos();

    registrarEventosSuspension();

    registrarEventosReanudacion();

    registrarEventoSolicitarTerminacion();

}


/* ======================================================
   HELPER
====================================================== */

function registrarClick(id, callback) {

    const elemento =
        document.getElementById(id);

    if (!elemento)
        return;

    elemento.addEventListener(
        "click",
        async () => {

            try {

                await callback();

            } catch (error) {

                console.error(error);

                mostrarAlerta({
                    titulo: "SIGE",
                    mensaje: error.message
                });

            }

        }
    );

}


/* ======================================================
   REQUISITOS SIMPLES
====================================================== */

function registrarEventosRequisitosSimples() {

    const botones =
        document.querySelectorAll(
            "[data-accion='cumplir-requisito']"
        );

    botones.forEach(
        boton => {

            boton.addEventListener(
                "click",
                async () => {

                    try {

                        const requisitoId =
                            boton.dataset.requisito;

                        const input =
                            document.querySelector(
                                `[data-input-requisito="${requisitoId}"]`
                            );

                        const valor =
                            input?.value?.trim();

                        await Workflow.cumplirRequisito(
                            requisitoId,
                            valor
                        );

                        await Router.mostrarEscritorio(
                            escritorioActual.expediente.id
                        );

                    } catch (error) {

                        console.error(error);

                        mostrarAlerta({
                            titulo: "SIGE",
                            mensaje: error.message
                        });

                    }

                }
            );

        }
    );

}



/* ======================================================
   TURNAR A MESA DIRECTIVA
====================================================== */

function registrarEventoTurnarMesa() {

    registrarClick(

        "btnTurnarMesaDirectiva",

        async () => {

            await Workflow.transicionarExpediente(

                escritorioActual.expediente.id,

                "TUR"

            );

            await Router.mostrarEscritorio(

                escritorioActual.expediente.id

            );

        }

    );

}

/* ======================================================
   AUTORIZAR EXPEDIENTE
====================================================== */

function registrarEventoAutorizar() {

    registrarClick(

        "btnAutorizarExpediente",

        async () => {

            await Workflow.aprobarObraPresidente(

                escritorioActual.expediente.id

            );

            await Router.mostrarEscritorio(

                escritorioActual.expediente.id

            );

        }

    );

}


/* ======================================================
   DATOS DEL DRO
====================================================== */

function registrarEventosDRO() {

    const botones =
        document.querySelectorAll(
            "[data-accion='ingresar-datos-dro']"
        );

    botones.forEach(

        boton => {

            boton.addEventListener(

                "click",

                async () => {

                    try {

                        const requisitoId =
                            boton.dataset.requisito;

                        const datos =
                            await mostrarFormularioDRO();

                        if (!datos)
                            return;

                        await Workflow.guardarDatosDRO(

                            escritorioData.obra.id,

                            datos

                        );

                        await Workflow.cumplirRequisito(

                            requisitoId,

                            "DRO registrado"

                        );

                        await Router.mostrarEscritorio(

                            escritorioActual.expediente.id

                        );

                    } catch (error) {

                        console.error(error);

                        mostrarAlerta({

                            titulo: "SIGE",

                            mensaje: error.message

                        });

                    }

                }

            );

        }

    );

}


/* ======================================================
   DATOS DEL PROPIETARIO
====================================================== */

function registrarEventosPropietario() {

    const botones =
        document.querySelectorAll(
            "[data-accion='ingresar-datos-propietario']"
        );

    botones.forEach(

        boton => {

            boton.addEventListener(

                "click",

                async () => {

                    try {

                        const requisitoId =
                            boton.dataset.requisito;

                        const datos =
                            await mostrarFormularioPropietario();

                        if (!datos)
                            return;

                        await Workflow.guardarDatosPropietario(

                            escritorioData.obra.id,

                            datos

                        );

                        await Workflow.cumplirRequisito(

                            requisitoId,

                            "Propietario registrado"

                        );

                        await Router.mostrarEscritorio(

                            escritorioActual.expediente.id

                        );

                    } catch (error) {

                        console.error(error);

                        mostrarAlerta({

                            titulo: "SIGE",

                            mensaje: error.message

                        });

                    }

                }

            );

        }

    );

}


/* ======================================================
   DOCUMENTOS
====================================================== */

function registrarEventosDocumentos() {

    /*
    ------------------------------------------------------
    INCORPORAR
    ------------------------------------------------------
    */

    document
        .querySelectorAll(
            "[data-accion='incorporar-documento']"
        )
        .forEach(

            boton => {

                boton.addEventListener(

                    "click",

                    async () => {

                        try {

                            await Documentos.incorporar(

                                boton.dataset.requisito

                            );

                        } catch (error) {

                            console.error(error);

                            mostrarAlerta({

                                titulo: "SIGE",

                                mensaje: error.message

                            });

                        }

                    }

                );

            }

        );

    /*
    ------------------------------------------------------
    SUSTITUIR
    ------------------------------------------------------
    */

    document
        .querySelectorAll(
            "[data-accion='sustituir-documento']"
        )
        .forEach(

            boton => {

                boton.addEventListener(

                    "click",

                    async () => {

                        try {

                            await Documentos.sustituir(

                                boton.dataset.requisito

                            );

                        } catch (error) {

                            console.error(error);

                            mostrarAlerta({

                                titulo: "SIGE",

                                mensaje: error.message

                            });

                        }

                    }

                );

            }

        );

    /*
    ------------------------------------------------------
    CONSULTAR
    ------------------------------------------------------
    */

    document
        .querySelectorAll(
            "[data-accion='consultar-documento']"
        )
        .forEach(

            boton => {

                boton.addEventListener(

                    "click",

                    async () => {

                        try {

                            await Documentos.consultar(

                                boton.dataset.requisito

                            );

                        } catch (error) {

                            console.error(error);

                            mostrarAlerta({

                                titulo: "SIGE",

                                mensaje: error.message

                            });

                        }

                    }

                );

            }

        );

}


/* ======================================================
   VOBOS
====================================================== */

function registrarEventosVobos() {

    const botones =
        document.querySelectorAll(
            "[data-accion='emitir-vobo']"
        );

    console.log(
        "Botones VoBo encontrados:",
        botones.length
    );

    botones.forEach(

        boton => {

            boton.addEventListener(

                "click",

                async () => {

                    try {

                        await emitirVoboExpediente(

                            boton.dataset.vobo

                        );

                    } catch (error) {

                        console.error(error);

                        mostrarAlerta({

                            titulo: "SIGE",

                            mensaje: error.message

                        });

                    }

                }

            );

        }

    );

}


/* ======================================================
   SUSPENSIÓN
====================================================== */

function registrarEventosSuspension() {

    registrarClick(

        "btnSuspenderObra",

        async () => {

            const datos =
                await mostrarFormularioSuspensionObra();

            if (!datos)
                return;

            await Workflow.suspenderObra(

                escritorioActual.expediente.id,

                datos.motivo,

                datos.observaciones

            );

            await Router.mostrarEscritorio(

                escritorioActual.expediente.id

            );

        }

    );

}

/* ======================================================
   REANUDACIÓN
====================================================== */

function registrarEventosReanudacion() {

    registrarClick(

        "btnReanudarObra",

        async () => {

            await Workflow.reanudarObra(

                escritorioActual.expediente.id

            );

            await Router.mostrarEscritorio(

                escritorioActual.expediente.id

            );

        }

    );

}


/* ======================================================
   SOLICITAR TERMINACIÓN
====================================================== */

function registrarEventoSolicitarTerminacion() {

    registrarClick(

        "btnSolicitarTerminacion",

        async () => {

            const datos =
                await mostrarFormularioTerminacionObra();

            if (!datos)
                return;

            console.log(
                "Solicitud de terminación:",
                datos
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

    /*
    ======================================================
    INCORPORAR DOCUMENTO PDF
    ======================================================
    */

    const botonesDocumento =
        document.querySelectorAll(
            "[data-accion='incorporar-documento']"
        );


    botonesDocumento.forEach(
        boton => {


            boton.addEventListener(
                "click",
                async () => {


                    const requisitoId =
                        boton.dataset.requisito;


                    console.log(
                        "Incorporar documento:",
                        requisitoId
                    );


                    await Documentos.incorporar(
                        requisitoId
                    );


                }
            );


        }
    );
   
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

   console.log("ANTES DE CONSTRUIR HTML");

    workspace.innerHTML = "";

}

async function emitirVoboExpediente(voboId) {

    console.log("1. Entró a emitirVoboExpediente");
    console.log("VoBo recibido:", voboId);

    const confirmado =
        confirm(
            "¿Desea emitir el VoBo del expediente?"
        );

    console.log("2. Confirmado:", confirmado);

    if (!confirmado) {
        console.log("Proceso cancelado por el usuario.");
        return;
    }

    try {

        console.log("3. Obteniendo usuario...");

        const { data: usuarioData, error: usuarioError } =
            await supabaseClient.auth.getUser();

        console.log("4. UsuarioData:", usuarioData);
        console.log("5. UsuarioError:", usuarioError);

        if (usuarioError)
            throw usuarioError;

        const usuario = usuarioData.user;

        console.log("6. Usuario:", usuario);

       console.log("SIGE_STATE:", SIGE_STATE);
console.log("SIGE_STATE.expedienteActual:", SIGE_STATE.expedienteActual);
console.log("escritorioActual:", escritorioActual);
console.log("window.escritorioData:", window.escritorioData); 
       console.log("7. Antes de llamar RPC");

        const resultado =
    await Workflow.emitirVobo(
        SIGE_STATE.expedienteActual.expediente.id
    );

        console.log("8. Después de RPC");
        console.log("RPC RESULTADO:", resultado.data);
        console.log("RPC ERROR:", resultado.error);

        if (resultado.error) {

            console.error("9. Error RPC:", resultado.error);

            alert(resultado.error.message);

            return;

        }

        console.log("10. RPC ejecutada correctamente.");

        alert(
            "VoBo emitido correctamente."
        );

        console.log("11. Recargando escritorio...");

        await Router.mostrarEscritorio(
            escritorioActual.expediente.id
        );

        console.log("12. Escritorio recargado.");

    }
    catch (error) {

        console.error("ERROR GENERAL emitirVoboExpediente:", error);

        alert(error.message);

    }

}

/* ==========================================================
   EXPORTACIÓN
========================================================== */

window.EscritorioExpediente =
    EscritorioExpediente;

