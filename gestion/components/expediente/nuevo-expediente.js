"use strict";

/* ==========================================================
   SIGE
   Sistema Integral de Gestión de Expedientes

   Archivo:
   components/expediente/nuevo-expediente.js

   Responsabilidad:

   Mostrar la pantalla de creación
   de un nuevo expediente.

========================================================== */

const NuevoExpediente = {

    render

};

/* ==========================================================
   RENDER
========================================================== */

function render() {

    console.log("NuevoExpediente.render()");

    const workspace =
        document.getElementById("workspace");

    if (!workspace)
        return;

    workspace.innerHTML = `

        <div class="card">

            <div
                style="
                    display:flex;
                    justify-content:space-between;
                    align-items:center;
                ">

                <div>

                    <div class="card-title">

                        Nuevo expediente

                    </div>

                    <div class="card-subtitle">

                        Seleccione el procedimiento
                        que desea iniciar.

                    </div>

                </div>

                <button
                    id="btnCancelarNuevoExpediente"
                    class="btn">

                    ← Regresar

                </button>

            </div>

        </div>

        <div style="height:18px;"></div>

        ${renderCard(

            "🏗",

            "Obra Particular",

            "Autorización, ejecución y conclusión de obras particulares.",

            "OBR"

        )}

        ${renderCard(

            "💰",

            "Proyecto de Inversión",

            "Adquisición de bienes e inversión institucional.",

            "INV"

        )}

        ${renderCard(

            "🤝",

            "Contratación de Servicios",

            "Contratación, seguimiento y cierre de servicios.",

            "CON"

        )}

    `;

    document
        .getElementById(
            "btnCancelarNuevoExpediente"
        )
        .addEventListener(
            "click",
            Router.mostrarListaProcedimientos
        );

}

/* ==========================================================
   TARJETA
========================================================== */

function renderCard(

    icono,

    titulo,

    descripcion,

    tipo

){

    return `

        <div
            class="card"
            style="margin-bottom:20px;">

            <div
                style="
                    display:flex;
                    justify-content:space-between;
                    align-items:center;
                    gap:20px;
                ">

                <div
                    style="
                        display:flex;
                        gap:18px;
                        align-items:flex-start;
                    ">

                    <div
                        style="
                            font-size:42px;
                            width:60px;
                            text-align:center;
                        ">

                        ${icono}

                    </div>

                    <div>

                        <div
                            style="
                                font-size:22px;
                                font-weight:700;
                            ">

                            ${titulo}

                        </div>

                        <div
                            style="
                                margin-top:8px;
                                color:var(--texto-secundario);
                            ">

                            ${descripcion}

                        </div>

                    </div>

                </div>

                <button
                    class="btn btn-primary"
                    onclick="seleccionarProcedimiento('${tipo}')">

                    Seleccionar

                </button>

            </div>

        </div>

    `;

}

/* ==========================================================
   SELECCIÓN
========================================================== */

function seleccionarProcedimiento(tipo){

    console.log(
        "Procedimiento seleccionado:",
        tipo
    );

    // FRONT-006
    // Aquí se invocará:
    //
    // Workflow.crearExpediente(tipo);

}

/* ==========================================================
   EXPORTACIÓN
========================================================== */

window.NuevoExpediente =
    NuevoExpediente;
