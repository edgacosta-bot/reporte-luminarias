"use strict";

/* ==========================================================
   SIGE
   Sistema Integral de Gestión Institucional

   Archivo:
   components/obras/bandeja.js

   Responsabilidad:

   Bandeja del módulo
   Obras Particulares.

========================================================== */

const Obras = {

    render,

    actualizar,

    destruir

};

/* ==========================================================
   RENDER
========================================================== */

async function render() {

    console.log("Obras.render()");

    const workspace =
        document.getElementById(
            "workspace"
        );

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

                        Administración integral de obras particulares.

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
            style="
                margin-top:20px;
                display:grid;
                grid-template-columns:repeat(4,1fr);
                gap:16px;
            ">

        </div>

        <div
            id="listaObras"
            style="margin-top:20px;">

        </div>

    `;

    document
        .getElementById(
            "btnNuevaObra"
        )
        .addEventListener(
            "click",
            Router.mostrarNuevaObra
        );

    await cargarDashboard();

    await cargarObras();

}

/* ==========================================================
   DASHBOARD
========================================================== */

async function cargarDashboard() {

    const contenedor =
        document.getElementById(
            "kpiObras"
        );

    contenedor.innerHTML = `

        ${kpi("Aprobación",0)}

        ${kpi("Ejecución",0)}

        ${kpi("Terminación",0)}

        ${kpi("Archivo",0)}

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
                    color:var(--texto-secundario);
                    font-size:13px;
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
   OBRAS
========================================================== */

async function cargarObras(){

    const contenedor =
        document.getElementById(
            "listaObras"
        );

    const privadas =
        await Workflow.obtenerPrivadas();

    contenedor.innerHTML = "";

    privadas.forEach(

        privada => {

            contenedor.innerHTML +=
                renderPrivada(
                    privada
                );

        }

    );

}

/* ==========================================================
   TARJETA
========================================================== */

function renderPrivada(privada){

    return `

        <div
            class="card"
            style="
                margin-bottom:18px;
            ">

            <div
                style="
                    display:flex;
                    justify-content:space-between;
                    align-items:center;
                ">

                <div>

                    <div
                        style="
                            font-size:20px;
                            font-weight:700;
                            color:var(--vino);
                        ">

                        Privada ${privada}

                    </div>

                    <div
                        style="
                            margin-top:6px;
                            color:var(--texto-secundario);
                        ">

                        Administrar obras de esta privada.

                    </div>

                </div>

                <button
                    class="btn btn-primary"
                    onclick="Router.mostrarNuevaObra()">

                    Nueva obra

                </button>

            </div>

        </div>

    `;

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

window.Obras =
    Obras;
