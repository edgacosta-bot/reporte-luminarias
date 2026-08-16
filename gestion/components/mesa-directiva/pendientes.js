"use strict";

/* ==========================================================
   SIGE

   Mesa Directiva

   Expedientes pendientes
========================================================== */

const MesaPendientes = {

    render

};


async function render() {

    console.log(
        "MesaPendientes.render()"
    );

    const workspace =
        document.getElementById(
            "workspace"
        );

    if (!workspace)
        return;

    workspace.innerHTML = `

        <div class="card">

            <h1>

                Expedientes pendientes

            </h1>

            <p>

                Cargando expedientes...

            </p>

        </div>

    `;

}


window.MesaPendientes =
    MesaPendientes;
