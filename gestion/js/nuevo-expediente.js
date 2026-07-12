"use strict";

/* ==========================================================
   SIGE
   Sistema Integral de Gestión de Expedientes

   Archivo:
   js/nuevo-expediente.js

   Responsabilidad:

   Mostrar la pantalla para crear
   un nuevo expediente.

========================================================== */

const NuevoExpediente = {

    render

};

/* ==========================================================
   RENDER
========================================================== */

function render() {

    const workspace =
        document.getElementById("workspace");

    if (!workspace)
        return;

    workspace.innerHTML = `

        <div class="card">

            <div class="card-title">

                Nuevo expediente

            </div>

            <div class="card-subtitle">

                Seleccione el procedimiento
                que desea iniciar.

            </div>

        </div>

        <div
            class="grid grid-3"
            style="margin-top:20px; gap:20px;">

            ${renderCard(
                "🏗",
                "Obra Particular",
                "Administración de obras particulares.",
                "OBR"
            )}

            ${renderCard(
                "💰",
                "Proyecto de Inversión",
                "Adquisición de bienes.",
                "INV"
            )}

            ${renderCard(
                "🤝",
                "Contratación de Servicios",
                "Prestación de servicios.",
                "CON"
            )}

        </div>

    `;

}

/* ==========================================================
   TARJETA
========================================================== */

function renderCard(

    icono,

    titulo,

    descripcion,

    tipo

) {

    return `

        <div class="card">

            <div
                style="
                    font-size:54px;
                    text-align:center;
                    margin-bottom:18px;
                ">

                ${icono}

            </div>

            <div
                style="
                    font-size:22px;
                    font-weight:700;
                    text-align:center;
                ">

                ${titulo}

            </div>

            <div
                style="
                    margin-top:12px;
                    color:var(--texto-secundario);
                    text-align:center;
                    min-height:60px;
                ">

                ${descripcion}

            </div>

            <button
                class="btn btn-primary"
                style="
                    width:100%;
                    margin-top:22px;
                "
                onclick="crearExpediente('${tipo}')">

                Seleccionar

            </button>

        </div>

    `;

}

/* ==========================================================
   CREAR
========================================================== */

async function crearExpediente(

    tipo

){

    console.log(
        "Nuevo expediente:",
        tipo
    );

    // Próximo entregable:
    // Workflow.crearExpediente(tipo);

}

window.NuevoExpediente =
    NuevoExpediente;
