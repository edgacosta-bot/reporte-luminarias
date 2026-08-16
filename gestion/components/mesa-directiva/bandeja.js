"use strict";

/* ==========================================================
   SIGE

   Módulo:
   Mesa Directiva

   Bandeja
========================================================== */

const MesaDirectiva = {

    render,

    actualizar,

    destruir

};


async function render() {

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

        <div
            class="card">

            <h1>

                Mesa Directiva

            </h1>

            <p>

                Bandeja en construcción.

            </p>

        </div>

    `;

}


function actualizar() {

    render();

}


function destruir() {

    const workspace =
        document.getElementById(
            "workspace"
        );

    if (workspace)
        workspace.innerHTML = "";

}


window.MesaDirectiva =
    MesaDirectiva;
