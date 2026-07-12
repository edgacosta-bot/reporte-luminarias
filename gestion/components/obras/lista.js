"use strict";

/* ==========================================================
   SIGE
   Sistema Integral de Gestión de Expedientes

   Archivo:
   components/obras/lista.js

   Responsabilidad:

   Mostrar el módulo
   Obras Particulares.

========================================================== */

const Obras = {

    render,

    renderCard,

    actualizar,

    destruir

};

/* ==========================================================
   RENDER
========================================================== */

async function render() {

    console.log("Obras.render()");

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

                        Obras Particulares

                    </div>

                    <div class="card-subtitle">

                        Administración de obras particulares.

                    </div>

                </div>

                <button
                    id="btnNuevaObra"
                    class="btn btn-primary">

                    ➕ Nueva obra

                </button>

            </div>

        </div>

        <div
            id="kpiObras"
            style="margin-top:18px;">

        </div>

        <div
            id="listaObras"
            style="margin-top:18px;">

        </div>

    `;

    document
        .getElementById(
            "btnNuevaObra"
        )
        .addEventListener(
            "click",
            () => {

                console.log(
                    "Nueva obra"
                );

                // FRONT-006
                // Router.mostrarNuevaObra();

            }
        );

    renderKPIs();

    const contenedor =
        document.getElementById(
            "listaObras"
        );

    const obras =
        await obtenerObras();

    obras.forEach(obra => {

        contenedor.innerHTML +=
            renderCard(obra);

    });

}

/* ==========================================================
   KPI
========================================================== */

function renderKPIs() {

    const div =
        document.getElementById(
            "kpiObras"
        );

    div.innerHTML = `

        <div
            style="
                display:grid;
                grid-template-columns:
                    repeat(4,1fr);
                gap:16px;
            ">

            ${kpi(
                "Aprobación",
                0
            )}

            ${kpi(
                "Ejecución",
                15
            )}

            ${kpi(
                "Terminación",
                0
            )}

            ${kpi(
                "Archivo",
                0
            )}

        </div>

    `;

}

function kpi(

    titulo,

    valor

){

    return `

        <div class="card">

            <div
                style="
                    font-size:14px;
                    color:var(--texto-secundario);
                ">

                ${titulo}

            </div>

            <div
                style="
                    margin-top:8px;
                    font-size:34px;
                    font-weight:700;
                    color:var(--vino);
                ">

                ${valor}

            </div>

        </div>

    `;

}

/* ==========================================================
   TARJETA
========================================================== */

function renderCard(obra){

    return `

        <div
            class="card"
            style="margin-top:18px;">

            <div
                style="
                    display:flex;
                    justify-content:space-between;
                    align-items:center;
                ">

                <div>

                    <div
                        style="
                            font-size:13px;
                            color:var(--texto-secundario);
                        ">

                        ${obra.folio}

                    </div>

                    <div
                        style="
                            margin-top:6px;
                            font-size:20px;
                            font-weight:700;
                        ">

                        ${obra.titulo}

                    </div>

                    <div
                        style="
                            margin-top:10px;
                        ">

                        <span class="badge">

                            ${obra.etapa}

                        </span>

                    </div>

                </div>

                <button
                    class="btn btn-primary"
                    onclick="Router.mostrarEscritorio('${obra.id}')">

                    Abrir

                </button>

            </div>

        </div>

    `;

}

/* ==========================================================
   DATOS
========================================================== */

async function obtenerObras(){

    const {

        data,

        error

    } = await supabaseClient

        .from("obras")

        .select(`
            id,
            privada,
            casa,
            estatus,
            created_at
        `)

        .eq(
            "estatus",
            "aprobada"
        )

        .order(
            "created_at",
            {
                ascending:false
            }
        );

    if(error){

        console.error(error);

        return [];

    }

    return data.map(
        (obra, indice)=>({

            id:
                obra.id,

            folio:
                `REG-${String(indice+1).padStart(3,"0")}`,

            titulo:
                `Privada ${obra.privada} · Casa ${obra.casa}`,

            etapa:
                "Ejecución"

        })
    );

}

/* ==========================================================
   ACTUALIZAR
========================================================== */

function actualizar(){

    render();

}

/* ==========================================================
   DESTRUIR
========================================================== */

function destruir(){

    const workspace =
        document.getElementById(
            "workspace"
        );

    if(workspace){

        workspace.innerHTML = "";

    }

}

/* ==========================================================
   EXPORTACIÓN
========================================================== */

window.Obras = Obras;
