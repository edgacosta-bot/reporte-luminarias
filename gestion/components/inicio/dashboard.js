"use strict";

/* ==========================================================
   SIGE
   Sistema Integral de Gestión Institucional

   Archivo:
   components/inicio/dashboard.js

   Responsabilidad:

   Mostrar la pantalla principal de
   Gestión Institucional.

========================================================== */

const Dashboard = {

    render

};

/* ==========================================================
   RENDER
========================================================== */

function render() {

    console.log("Dashboard.render()");

    const workspace =
        document.getElementById(
            "workspace"
        );

    if (!workspace)
        return;

    workspace.innerHTML = `

        <div class="card">

            <div class="card-title">

                Gestión Institucional

            </div>

            <div class="card-subtitle">

                Seleccione el módulo con el que desea trabajar.

            </div>

        </div>

        <div
            style="
                margin-top:24px;
                display:grid;
                gap:20px;
            ">

            ${renderModulo(

                "🏗",

                "Obras Particulares",

                "Administración integral de obras particulares.",

                "obras"

            )}

            ${renderModulo(

                "💰",

                "Proyectos de Inversión",

                "Adquisición de bienes e inversión institucional.",

                "inversiones"

            )}

            ${renderModulo(

                "🤝",

                "Contratación de Servicios",

                "Administración de contratos de prestación de servicios.",

                "servicios"

            )}

        </div>

        <div
            class="card"
            style="
                margin-top:24px;
                border:2px dashed #8B0000;
            ">

            <div class="card-title">

                🛠 Modo Desarrollo

            </div>

            <div class="card-subtitle">

                Accesos temporales para desarrollo.

                <br>

                Eliminar antes de producción.

            </div>

            <div
                style="
                    margin-top:20px;
                ">

                <button
                    id="btnAbrirExpedienteDemo"
                    class="btn btn-primary">

                    Abrir expediente de prueba

                </button>

            </div>

        </div>

    `;

    document
        .getElementById("modulo-obras")
        .addEventListener(
            "click",
            Router.mostrarNuevoExpediente
        );

    document
        .getElementById("modulo-inversiones")
        .addEventListener(
            "click",
            () => {

                mostrarProximamente(
                    "Proyectos de Inversión"
                );

            }
        );

    document
        .getElementById("modulo-servicios")
        .addEventListener(
            "click",
            () => {

                mostrarProximamente(
                    "Contratación de Servicios"
                );

            }
        );

    document
        .getElementById(
            "btnAbrirExpedienteDemo"
        )
        .addEventListener(
            "click",
            () => {

                Router.mostrarEscritorio(

                    "dcd84b93-0790-49ab-ada2-13c5d9ef083a"

                );

            }
        );

}

/* ==========================================================
   TARJETA
========================================================== */

function renderModulo(

    icono,

    titulo,

    descripcion,

    id

){

    return `

        <div
            id="modulo-${id}"
            class="card"
            style="
                cursor:pointer;
                transition:.20s;
            ">

            <div
                style="
                    display:flex;
                    gap:18px;
                    align-items:center;
                ">

                <div
                    style="
                        font-size:44px;
                        width:70px;
                        text-align:center;
                    ">

                    ${icono}

                </div>

                <div
                    style="
                        flex:1;
                    ">

                    <div
                        style="
                            font-size:22px;
                            font-weight:700;
                            color:var(--vino);
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

                <div
                    style="
                        font-size:26px;
                        color:#999;
                    ">

                    ›

                </div>

            </div>

        </div>

    `;

}

/* ==========================================================
   PRÓXIMAMENTE
========================================================== */

async function mostrarProximamente(nombre){

    await mostrarAlerta({

        titulo: nombre,

        mensaje:
            "Este módulo será habilitado en una siguiente etapa."

    });

}

/* ==========================================================
   EXPORTACIÓN
========================================================== */

window.Dashboard =
    Dashboard;
