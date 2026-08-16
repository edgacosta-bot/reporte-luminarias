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

            <div
                style="
                    font-size:28px;
                    font-weight:700;
                    color:var(--vino);
                ">

                Expedientes pendientes de revisión

            </div>

        </div>

        <div
            id="listaPendientes"
            style="
                margin-top:20px;
            ">

            Cargando...

        </div>

    `;


    const lista =
        document.getElementById(
            "listaPendientes"
        );

    const expedientes =
        (
            await Workflow.obtenerExpedientes()
        ).filter(

            e => e.etapa ===
                "APROBACIÓN"

        );


    if (!expedientes.length) {

        lista.innerHTML = `

            <div class="card">

                No existen expedientes pendientes.

            </div>

        `;

        return;

    }


    lista.innerHTML =
        expedientes.map(

            e => `

                <div
                    class="card"
                    style="
                        margin-top:18px;
                    ">

                    <div
                        style="
                            font-size:22px;
                            font-weight:700;
                            color:var(--vino);
                        ">

                        ${e.folio}

                    </div>

                    <div
                        style="
                            margin-top:8px;
                        ">

                        Privada ${e.privada}

                        ·

                        Lote ${e.lote}

                    </div>

                    <div
                        style="
                            margin-top:18px;
                            text-align:right;
                        ">

                        <button
                            class="btn btn-primary"
                            onclick="Router.mostrarEscritorio('${e.id}')">

                            Revisar expediente

                        </button>

                    </div>

                </div>

            `

        ).join("");

}


window.MesaPendientes =
    MesaPendientes;
