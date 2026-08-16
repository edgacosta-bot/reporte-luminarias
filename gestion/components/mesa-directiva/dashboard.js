"use strict";

/* ==========================================================
   SIGE
   Sistema Integral de Gestión Institucional

   Módulo:
   Mesa Directiva

   Dashboard
========================================================== */

const MesaDirectiva = {

    render

};


/* ==========================================================
   RENDER
========================================================== */

function render() {

    console.log(
        "MesaDirectiva.render()"
    );

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
                    font-size:30px;
                    font-weight:700;
                    color:var(--vino);
                ">

                Mesa Directiva

            </div>

            <div
                style="
                    margin-top:12px;
                    color:var(--texto-secundario);
                    font-size:17px;
                ">

                Seleccione la actividad que desea realizar.

            </div>

        </div>


        <div
            style="
                display:grid;
                gap:20px;
                margin-top:24px;
            ">

            ${renderTarjeta(

                "📋",

                "Expedientes pendientes",

                "Revisar expedientes turnados a la Mesa Directiva.",

                "pendientes"

            )}

            ${renderTarjeta(

                "🏗",

                "Obras en ejecución",

                "Consultar obras autorizadas.",

                "ejecucion"

            )}

            ${renderTarjeta(

                "📁",

                "Obras concluidas",

                "Consultar histórico de obras.",

                "concluidas"

            )}

        </div>

    `;

    registrarEventos();

}


/* ==========================================================
   TARJETA
========================================================== */

function renderTarjeta(

    icono,

    titulo,

    descripcion,

    id

) {

    return `

        <div
            id="${id}"
            class="card"
            style="
                cursor:pointer;
            ">

            <div
                style="
                    display:flex;
                    align-items:center;
                    gap:18px;
                ">

                <div
                    style="
                        font-size:42px;
                    ">

                    ${icono}

                </div>

                <div>

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

            </div>

        </div>

    `;

}


/* ==========================================================
   EVENTOS
========================================================== */

function registrarEventos() {

    document
        .getElementById(
            "pendientes"
        )
        ?.addEventListener(
            "click",
            () => MesaPendientes.render()
        );

    document
        .getElementById(
            "ejecucion"
        )
        ?.addEventListener(
            "click",
            () => MesaEjecucion.render()
        );

    document
        .getElementById(
            "concluidas"
        )
        ?.addEventListener(
            "click",
            () => MesaConcluidas.render()
        );

}


window.MesaDirectiva =
    MesaDirectiva;
