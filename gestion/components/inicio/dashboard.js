"use strict";

/* ==========================================================
   SIGE
   Sistema Integral de Gestión Institucional

   Archivo:
   components/inicio/dashboard.js

   Responsabilidad:

   Mostrar la pantalla principal de
   Gestión Institucional.

   Desde esta pantalla el usuario
   selecciona el proceso administrativo
   con el que desea trabajar.

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

       <div
    style="
        margin-bottom:32px;
    ">

    <div
        style="
            font-size:18px;
            color:var(--texto-secundario);
            margin-bottom:8px;
        ">

        Bienvenido a SIGE

    </div>

    <div
        style="
            font-size:32px;
            font-weight:700;
            color:var(--vino);
            margin-bottom:10px;
        ">

        ${SIGE.contexto.nombre_cargo}

    </div>

    <div
        style="
            font-size:18px;
            color:var(--texto-secundario);
        ">

        Seleccione el proceso institucional que desea gestionar.

    </div>

</div>

        <div
            style="
                display:grid;
                gap:20px;
            ">

            ${renderModulo(

                "🏗",

                "Obras Particulares",

                "Gestionar expedientes.",

                "obras"

            )}

            ${renderModulo(

                "🏛",

                "Proyectos de Inversión",

                "Gestionar proyectos.",

                "inversiones"

            )}

            ${renderModulo(

                "📄",

                "Contratación de Servicios",

                "Gestionar expedientes.",

                "servicios"

            )}

        </div>

        ${renderModoDesarrollo()}

    `;

    registrarEventosDashboard();

}


function registrarEventosDashboard() {

    console.log("=== registrarEventos ===");

    const moduloObras =
        document.getElementById("modulo-obras");

    console.log("moduloObras:", moduloObras);

    console.log("Router:", Router);

    console.log(
        "mostrarBandejaObras:",
        Router?.mostrarBandejaObras
    );

    if (!moduloObras) {

        console.error(
            "No existe modulo-obras"
        );

        return;

    }

    moduloObras.addEventListener(

        "click",

        () => {

            console.log(
                "CLICK SOBRE OBRAS"
            );

            Router.mostrarBandejaObras();

        }

    );

    console.log(
        "Listener registrado."
    );

}

/* ==========================================================
   TARJETA DE PROCESO
========================================================== */

function renderModulo(

    icono,

    titulo,

    descripcion,

    id

) {

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
                    align-items:center;
                    gap:18px;
                ">

                <div
                    style="
                        width:72px;
                        text-align:center;
                        font-size:44px;
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
   MODO DESARROLLO

   Eliminar antes de liberar la versión
   de producción.
========================================================== */

function renderModoDesarrollo() {

    return `

        <div
            class="card"
            style="
                margin-top:28px;
                border:2px dashed #8B0000;
            ">

            <div class="card-title">

                🛠 Modo Desarrollo

            </div>

            <div class="card-subtitle">

                Accesos temporales para pruebas internas.

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

}

/* ==========================================================
   PRÓXIMAMENTE
========================================================== */

async function mostrarProximamente(
    nombre
) {

    await mostrarAlerta({

        titulo: nombre,

        mensaje:
            "Este proceso administrativo estará disponible en una siguiente etapa."

    });

}

/* ==========================================================
   EXPORTACIÓN
========================================================== */

window.Dashboard =
    Dashboard;
