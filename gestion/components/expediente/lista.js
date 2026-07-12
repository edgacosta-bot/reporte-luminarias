"use strict";

console.log("LISTA.JS VERSION 2026-07-11 15:45");

/* ==========================================================
   SIGE
   Sistema Integral de Gestión de Expedientes

   Archivo:
   components/expediente/lista.js

   Versión:
   1.0.0

   Responsabilidad:

   Mostrar la bandeja de procedimientos
   disponibles para el usuario.

========================================================== */


/* ==========================================================
   COMPONENTE
========================================================== */

const ListaProcedimientos = {

    render,

    renderCard,

    actualizar,

    destruir

};



/* ==========================================================
   DATOS DEMO

   (Se sustituirán posteriormente
   por las RPC del Workflow)
========================================================== */

const expedientesDemo = [

    {
        id: "REG-001",
        origen: "SIGVIC",
        folio: "REG-OBR-001",
        tipo: "Obra Particular",
        titulo: "Construcción Casa 27",
        etapa: "Ejecución",
        estado: "Regularización SIGVIC"
    },

    {
        id: "REG-002",
        origen: "SIGVIC",
        folio: "REG-OBR-002",
        tipo: "Obra Particular",
        titulo: "Construcción Casa 14",
        etapa: "Ejecución",
        estado: "Regularización SIGVIC"
    }

];



/* ==========================================================
   RENDER
========================================================== */

async function render() {

    console.log("ListaProcedimientos.render()");

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
                    margin-bottom:18px;
                ">

                <div>

                    <div class="card-title">

                        Expedientes

                    </div>

                    <div class="card-subtitle">

                        Seleccione un expediente
                        o cree uno nuevo.

                    </div>

                </div>

                <button
                    id="btnCrearExpediente"
                    class="btn btn-primary">

                    ➕ Crear expediente

                </button>

            </div>

            <div id="listaProcedimientos"></div>

        </div>

    `;

    document
        .getElementById("btnCrearExpediente")
        .addEventListener(
            "click",
            Router.mostrarNuevoExpediente();
        );

    const contenedor =
        document.getElementById("listaProcedimientos");

    const expedientes =
        await obtenerExpedientes();

    expedientes.forEach(expediente => {

        contenedor.innerHTML +=
            renderCard(expediente);

    });

}

/* ==========================================================
   TARJETA
========================================================== */

function renderCard(procedimiento) {

    let badge = `
        <span class="badge badge-info">
            ${procedimiento.estado}
        </span>
    `;

    return `

        <div
            class="card procedimiento-card"
            style="margin-top:18px;">

            <div
                style="
                    display:flex;
                    justify-content:space-between;
                    align-items:flex-start;
                    gap:18px;
                ">

                <div>

                    <div
                        style="
                            font-size:13px;
                            color:var(--texto-secundario);
                            margin-bottom:6px;
                        ">

                        ${procedimiento.tipo.toUpperCase()}

                    </div>

                    <div
                        style="
                            font-size:22px;
                            font-weight:700;
                            color:var(--vino);
                        ">

                        ${procedimiento.folio}

                    </div>

                    <div
                        style="
                            margin-top:8px;
                            font-size:17px;
                            font-weight:600;
                        ">

                        ${procedimiento.titulo}

                    </div>

                </div>

                <div>

                    ${badge}

                </div>

            </div>

            <div
                style="
                    margin-top:18px;
                    display:flex;
                    gap:10px;
                    flex-wrap:wrap;
                ">

                <span class="badge">

                    ${procedimiento.tipo}

                </span>

                <span class="badge badge-warning">

                    ${procedimiento.etapa}

                </span>

            </div>

            <div
                style="
                    margin-top:20px;
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

                        Origen

                    </div>

                    <strong>

                        ${procedimiento.origen}

                    </strong>

                </div>

                <button
                    class="btn btn-primary"
                    onclick="Router.mostrarEscritorio('${procedimiento.id}')">

                    Abrir

                </button>

            </div>

        </div>

    `;

}

/* ==========================================================
   OBTENER EXPEDIENTES

   (Temporalmente desde SIGVIC)

========================================================== */

async function obtenerExpedientes() {

    const { data, error } = await supabaseClient

        .from("obras")

        .select(`
            id,
            privada,
            casa,
            estatus,
            created_at
        `)

        .eq("estatus", "aprobada")

        .order("created_at", { ascending: false });

    if (error) {

        console.error(error);

        return [];

    }

    return data.map((obra, indice) => ({

        id: obra.id,

        origen: "Regularización SIGVIC",

        folio: `REG-OBR-${String(indice + 1).padStart(3,"0")}`,

        tipo: "Obra Particular",

        titulo: `Privada ${obra.privada} · Casa ${obra.casa}`,

        etapa: "Ejecución",

        estado: "Regularización SIGVIC"

    }));

}

/* ==========================================================
   ACTUALIZAR
========================================================== */

function actualizar() {

    render();

}

/* ==========================================================
   DESTRUIR
========================================================== */

function destruir() {

    const workspace =
        document.getElementById("workspace");

    if (!workspace)
        return;

    workspace.innerHTML = "";

}


function mostrarDialogoNuevoExpediente() {

    alert(
`Crear expediente

1. Obra Particular
2. Proyecto de Inversión
3. Contratación de Servicio`
    );

}
/* ==========================================================
   EXPORTACIÓN
========================================================== */

window.ListaProcedimientos =
    ListaProcedimientos;
