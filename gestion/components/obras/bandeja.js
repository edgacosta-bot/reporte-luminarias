"use strict";

/* ==========================================================
   SIGE
   Sistema Integral de Gestión Institucional

   Archivo:
   components/obras/bandeja.js

   Módulo:
   Obras Particulares

   Componente:
   Bandeja de Expedientes

   Responsabilidad

   Mostrar los expedientes registrados
   para el proceso Obras Particulares.

   La Bandeja únicamente:

   • Localiza expedientes.
   • Permite filtrarlos.
   • Permite abrirlos.
   • Permite crear un nuevo expediente
     (Administrador).

   No administra el expediente.

   Todo el trabajo del expediente se
   realiza desde el Escritorio.

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

        ${renderEncabezado()}

        ${renderFiltros()}

        ${renderContenido()}

    `;

    registrarEventos();

    await renderListaExpedientes();

}

/* ==========================================================
   ENCABEZADO
========================================================== */

function renderEncabezado() {

    return `

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

                        Administración de expedientes.

                    </div>

                </div>

                ${renderBotonNuevoExpediente()}

            </div>

        </div>

    `;

}

/* ==========================================================
   BOTÓN NUEVO EXPEDIENTE
========================================================== */

function renderBotonNuevoExpediente() {

    /*
        En una siguiente versión
        este método verificará
        el rol del usuario.

        Temporalmente permanece
        visible para facilitar
        el desarrollo.
    */

    return `

        <button
            id="btnNuevoExpediente"
            class="btn btn-primary">

            ➕ Nuevo expediente

        </button>

    `;

}

/* ==========================================================
   FILTROS
========================================================== */

function renderFiltros() {

    return `

        <div
            class="card"
            style="
                margin-top:20px;
            ">

            <div
                style="
                    display:grid;
                    grid-template-columns:
                        2fr
                        1fr
                        1fr;
                    gap:16px;
                    align-items:end;
                ">

                <div>

                    <label>

                        Buscar expediente

                    </label>

                    <input
                        id="txtBuscar"
                        class="input"
                        type="text"
                        placeholder="Número de expediente..." />

                </div>

                <div>

                    <label>

                        Privada

                    </label>

                    <select
                        id="cmbPrivada"
                        class="input">

                        <option value="">

                            Todas

                        </option>

                    </select>

                </div>

                <div>

                    <label>

                        Lote

                    </label>

                    <select
                        id="cmbLote"
                        class="input">

                        <option value="">

                            Todos

                        </option>

                    </select>

                </div>

            </div>

        </div>

    `;

}

/* ==========================================================
   CONTENIDO
========================================================== */

function renderContenido() {

    return `

        <div
            id="contenidoBandeja"
            style="
                margin-top:24px;
            ">

            <div
                id="listaExpedientes">

            </div>

        </div>

    `;

}

/* ==========================================================
   EVENTOS
========================================================== */

function registrarEventos() {

    const boton =
        document.getElementById(
            "btnNuevoExpediente"
        );

    if (boton) {

        boton.addEventListener(

            "click",

            Router.mostrarNuevoExpediente

        );

    }

}

/* ==========================================================
   CONTINÚA EN LA PARTE 2
========================================================== */

/* ==========================================================
   LISTA DE EXPEDIENTES

   En esta versión se utilizan datos
   temporales para construir la
   Bandeja.

   En la siguiente versión estos datos
   serán obtenidos mediante Workflow.

========================================================== */

async function renderListaExpedientes() {

    const contenedor =
        document.getElementById(
            "listaExpedientes"
        );

    if (!contenedor)
        return;

    const expedientes = obtenerExpedientesDemo();

    contenedor.innerHTML = "";

    expedientes.forEach(

        expediente => {

            contenedor.innerHTML +=
                renderRegistroExpediente(
                    expediente
                );

        }

    );

}

/* ==========================================================
   REGISTRO DE EXPEDIENTE

   Representación resumida de un
   expediente dentro de la Bandeja.

========================================================== */

function renderRegistroExpediente(
    expediente
) {

    return `

        <div
            class="card"
            style="
                margin-bottom:20px;
            ">

            <div
                style="
                    display:flex;
                    justify-content:space-between;
                    align-items:flex-start;
                ">

                <div>

                    <div
                        style="
                            font-size:14px;
                            color:var(--texto-secundario);
                        ">

                        ${expediente.numero}

                    </div>

                    <div
                        style="
                            margin-top:6px;
                            font-size:22px;
                            font-weight:700;
                            color:var(--vino);
                        ">

                        ${expediente.asunto}

                    </div>

                    <div
                        style="
                            margin-top:12px;
                            color:var(--texto-secundario);
                        ">

                        Privada ${expediente.privada}

                    </div>

                    <div
                        style="
                            color:var(--texto-secundario);
                        ">

                        Lote ${expediente.lote}

                    </div>

                </div>

                <div
                    style="
                        text-align:right;
                    ">

                    <div
                        style="
                            font-size:13px;
                            color:var(--texto-secundario);
                        ">

                        Etapa

                    </div>

                    <div
                        style="
                            margin-top:6px;
                            font-weight:700;
                            color:var(--vino);
                        ">

                        ${expediente.etapa}

                    </div>

                </div>

            </div>

            <hr
                style="
                    margin:18px 0;
                    border:none;
                    border-top:1px solid #e5e5e5;
                ">

            <div
                style="
                    display:flex;
                    gap:24px;
                    flex-wrap:wrap;
                ">

                <div>

                    ✔
                    ${expediente.vistosBuenos}
                    vistos buenos

                </div>

                <div>

                    ⚠
                    ${expediente.observaciones}
                    observaciones

                </div>

            </div>

            <div
                style="
                    margin-top:20px;
                    display:flex;
                    justify-content:flex-end;
                    gap:12px;
                ">

                <button
                    class="btn btn-primary"
                    onclick="Router.mostrarEscritorio('${expediente.id}')">

                    Abrir expediente

                </button>

            </div>

        </div>

    `;

}

/* ==========================================================
   DATOS TEMPORALES

========================================================== */

function obtenerExpedientesDemo() {

    return [

        {

            id:
                "EXP001",

            numero:
                "EXP-2026-001",

            asunto:
                "Construcción de vivienda",

            privada:
                "3",

            lote:
                "18",

            etapa:
                "APROBACIÓN",

            vistosBuenos:
                "3 de 5",

            observaciones:
                2

        },

        {

            id:
                "EXP002",

            numero:
                "EXP-2026-002",

            asunto:
                "Ampliación de vivienda",

            privada:
                "5",

            lote:
                "12",

            etapa:
                "EJECUCIÓN",

            vistosBuenos:
                "5 de 5",

            observaciones:
                0

        }

    ];

}

/* ==========================================================
   CONTINÚA EN LA PARTE 3
========================================================== */

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

    const workspace =e
        document.getElementById(
            "workspace"
        );

    if (!workspace)
        return;

    workspace.innerHTML = "";

}

/* ==========================================================
   EXPORTACIÓN

========================================================== */

window.Obras =
    Obras;
