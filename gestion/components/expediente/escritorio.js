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
let contextoActual = {};

/* ==========================================================
   RENDER PRINCIPAL
========================================================== */

function render(
    data = {},
    contexto = {}
) {

   console.log("DATOS ESCRITORIO:", data);

console.log("CONTEXTO ESCRITORIO:", contexto);

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

    ${renderVobos(data, contexto)}
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
        contexto.cargo_id;

    if (!vobos.length) {

        return "";

    }


    const filas =
        vobos.map(v => {

            const esMiVobo =
                v.cargo_id === cargoUsuario;


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
                v.estado === "PENDIENTE"

                    ? `
                        <button
                            class="btn btn-primary"
                            onclick="
                                emitirVoboExpediente('${v.id}')
                            ">
                            Emitir VoBo
                        </button>
                    `

                    : "";


            return `

                <tr>

                    <td>
                        ${v.cargo}
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

   const vobos =
    data.vobos ?? [];

const todosVobosAprobados =
    vobos.length > 0 &&
    vobos.every(
        v => v.estado === "APROBADO"
    );

const esPresidente =
    contextoActual.rol === "PRESIDENTE";



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
    esPresidente &&
    todosVobosAprobados
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

        return renderAccionesConsulta(r);

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
                onclick="
                    consultarDocumentoRequisito('${r.id}')
                ">

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


               <div 
    class="acciones-requisito"
    style="
        margin-top:18px;
    "
>

    <button

                        class="btn btn-outline-primary btn-sm"

                        data-accion="ingresar-datos-dro"

                        data-requisito="${r.expediente_requisito_id ?? r.id}"

                    >

                        Actualizar datos

                    </button>

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



                <div 
    class="acciones-requisito"
    style="
        margin-top:18px;
    "
>

    <button

                        class="btn btn-outline-primary btn-sm"

                        data-accion="ingresar-datos-propietario"

                        data-requisito="${r.expediente_requisito_id ?? r.id}"

                    >

                        Actualizar datos

                    </button>


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

                    try {

                        const requisitoId =
                            boton.dataset.requisito;


                        const input =
                            document.querySelector(
                                `[data-input-requisito="${requisitoId}"]`
                            );


                        const valor =
                            input?.value?.trim();


                        const resultado =
                            await Workflow.cumplirRequisito(
                                requisitoId,
                                valor
                            );


                        console.log(
                            "Resultado requisito:",
                            resultado
                        );


                        await Router.mostrarEscritorio(
                            escritorioActual.expediente.id
                        );


                    } catch(error) {


                        console.error(
                            "Error cumplir requisito:",
                            error
                        );


                        mostrarAlerta({
                            titulo:"SIGE",
                            mensaje:error.message
                        });

                    }

                }
            );

        }
    );



    /*
   /* ======================================================
   TURNAR EXPEDIENTE A MESA DIRECTIVA
====================================================== */

const btnTurnar =
    document.getElementById(
        "btnTurnarMesaDirectiva"
    );

if (btnTurnar) {

    btnTurnar.addEventListener(
        "click",
        async () => {

            try {

                await Workflow.transicionarExpediente(
                    escritorioActual.expediente.id,
                    "TUR"
                );

                await Router.mostrarEscritorio(
                    escritorioActual.expediente.id
                );

            }
            catch (error) {

                console.error(
                    "Error turnar expediente:",
                    error
                );

                mostrarAlerta({
                    titulo: "SIGE",
                    mensaje: error.message
                });

            }

        }
    );

}


/* ======================================================
   AUTORIZAR EXPEDIENTE (PRESIDENTE)
====================================================== */

const btnAutorizar =
    document.getElementById(
        "btnAutorizarExpediente"
    );

if (btnAutorizar) {

    btnAutorizar.addEventListener(
        "click",
        async () => {

            try {

                await Workflow.aprobarObraPresidente(
                    escritorioActual.expediente.id
                );

                await Router.mostrarEscritorio(
                    escritorioActual.expediente.id
                );

            }
            catch (error) {

                console.error(
                    "Error autorizar expediente:",
                    error
                );

                mostrarAlerta({
                    titulo: "SIGE",
                    mensaje: error.message
                });

            }

        }
    );

}


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


                    try {


                        const requisitoId =
                            boton.dataset.requisito;


                        const datos =
                            await mostrarFormularioDRO();


                        if(!datos)
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
                            escritorioData.expediente.id
                        );



                    } catch(error) {


                        console.error(
                            "Error datos DRO:",
                            error
                        );


                        mostrarAlerta({
                            titulo:"SIGE",
                            mensaje:error.message
                        });

                    }

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


                    try {


                        const requisitoId =
                            boton.dataset.requisito;


                        const datos =
                            await mostrarFormularioPropietario();


                        if(!datos)
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
                            escritorioData.expediente.id
                        );



                    } catch(error) {


                        console.error(
                            "Error datos Propietario:",
                            error
                        );


                        mostrarAlerta({
                            titulo:"SIGE",
                            mensaje:error.message
                        });

                    }

                }
            );


        }
    );



    /*
    ======================================================
    DOCUMENTOS PDF
    INCORPORAR
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


                    try {


                        const requisitoId =
                            boton.dataset.requisito;


                        await Documentos.incorporar(
                            requisitoId
                        );


                    } catch(error) {


                        console.error(
                            "Error incorporar documento:",
                            error
                        );


                        mostrarAlerta({
                            titulo:"SIGE",
                            mensaje:error.message
                        });

                    }

                }
            );


        }
    );



    /*
    ======================================================
    DOCUMENTOS PDF
    SUSTITUIR
    ======================================================
    */


    const botonesSustituir =
        document.querySelectorAll(
            "[data-accion='sustituir-documento']"
        );


    botonesSustituir.forEach(
        boton => {


            boton.addEventListener(
                "click",
                async () => {


                    try {


                        const requisitoId =
                            boton.dataset.requisito;


                        await Documentos.sustituir(
                            requisitoId
                        );


                    } catch(error) {


                        console.error(
                            "Error sustituir documento:",
                            error
                        );


                        mostrarAlerta({
                            titulo:"SIGE",
                            mensaje:error.message
                        });

                    }

                }
            );


        }
    );



    /*
    ======================================================
    DOCUMENTOS PDF
    CONSULTAR
    ======================================================
    */


    const botonesConsultar =
        document.querySelectorAll(
            "[data-accion='consultar-documento']"
        );


    botonesConsultar.forEach(
        boton => {


            boton.addEventListener(
                "click",
                async () => {


                    try {


                        const requisitoId =
                            boton.dataset.requisito;


                        await Documentos.consultar(
                            requisitoId
                        );


                    } catch(error) {


                        console.error(
                            "Error consultar documento:",
                            error
                        );


                        mostrarAlerta({
                            titulo:"SIGE",
                            mensaje:error.message
                        });

                    }

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

    workspace.innerHTML = "";

}

async function emitirVoboExpediente(voboId) {

    const confirmado =
        confirm(
            "¿Desea emitir el VoBo del expediente?"
        );


    if (!confirmado) {
        return;
    }


    const { data: usuarioData } =
        await supabaseClient.auth.getUser();


    const usuario =
        usuarioData.user;


    const resultado =
        await supabaseClient.rpc(
            "emitir_vobo_expediente",
            {
                p_expediente_id:
                    escritorioActual.expediente.id,

                p_usuario_id:
                    usuario.id
            }
        );


    if (resultado.error) {

        console.error(
            resultado.error
        );

        alert(
            resultado.error.message
        );

        return;

    }


    alert(
        "VoBo emitido correctamente."
    );


    await Router.mostrarEscritorio(
        escritorioActual.expediente.id
    );

}

/* ==========================================================
   EXPORTACIÓN
========================================================== */

window.EscritorioExpediente =
    EscritorioExpediente;
