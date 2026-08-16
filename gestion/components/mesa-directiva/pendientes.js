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

                Expedientes en revisión

            </div>

            <div
                style="
                    margin-top:8px;
                    color:var(--texto-secundario);
                ">

                Seleccione un expediente para revisar su documentación.

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
        await Workflow.obtenerPendientesMesaDirectiva();


    if (!expedientes.length) {

        lista.innerHTML = `

            <div class="card">

                No existen expedientes en revisión.

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
                        margin-bottom:20px;
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
                            margin-top:14px;
                            line-height:1.8;
                        ">

                        <strong>Privada:</strong>
                        ${e.privada}

                        <br>

                        <strong>Lote:</strong>
                        ${e.lote}

                        <br>

                        <strong>Propietario:</strong>
                        ${e.propietario ?? "-"}

                    </div>

                    <div
                        style="
                            margin-top:22px;
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
