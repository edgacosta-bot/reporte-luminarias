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

    registrarEventosBandeja();

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
                    font-size:22px;
                    font-weight:700;
                    margin-bottom:20px;
                ">

                Buscar obra

            </div>

            <div
                style="
                    display:grid;
                    grid-template-columns:1fr 1fr;
                    gap:16px;
                    align-items:end;
                ">

                <div>

                    <label>Privada</label>

                    <select
                        id="cmbPrivada"
                        class="input">

                        <option value="">
                            Todas
                        </option>

                    </select>

                </div>

                <div>

                    <label>Lote</label>

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

function registrarEventosBandeja() {

    console.log("=== registrarEventos() ===");

    const boton =
        document.getElementById(
            "btnNuevoExpediente"
        );

    console.log("Botón encontrado:", boton);

    console.log("Router:", Router);

    console.log(
        "mostrarNuevoExpediente:",
        Router?.mostrarNuevoExpediente
    );

    if (boton) {

        boton.addEventListener(
            "click",
            function () {

                console.log("CLICK EN NUEVO EXPEDIENTE");

                Router.mostrarNuevoExpediente();

            }
        );

        console.log("Listener registrado.");

    }
    else {

        console.log("No se encontró el botón.");

    }

}

/* ==========================================================
   CONTINÚA EN LA PARTE 2
========================================================== */

/* ==========================================================
   LISTA DE EXPEDIENTES

========================================================== */

async function renderListaExpedientes() {

    const contenedor =
        document.getElementById(
            "listaExpedientes"
        );

    if (!contenedor)
        return;

    contenedor.innerHTML = "";

    const expedientes =
        await Workflow.obtenerExpedientes();

    if (!expedientes.length) {

        contenedor.innerHTML = `

            <div
                class="card"
                style="
                    text-align:center;
                    color:var(--texto-secundario);
                ">

                No existen expedientes registrados.

            </div>

        `;

        return;

    }

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
                    gap:20px;
                ">

                <div
                    style="
                        flex:1;
                    ">

                    <div
                        style="
                            font-size:14px;
                            color:var(--texto-secundario);
                        ">

                        ${expediente.folio}

                    </div>

                    <div
                        style="
                            margin-top:6px;
                            font-size:22px;
                            font-weight:700;
                            color:var(--vino);
                        ">

                        Privada ${expediente.privada} - Lote ${expediente.lote}

                    </div>

                    <div
                        style="
                            margin-top:14px;
                            display:flex;
                            gap:18px;
                            flex-wrap:wrap;
                            color:var(--texto-secundario);
                        ">

                        <div>

                            <strong>Privada:</strong>

                            ${expediente.privada}

                        </div>

                        <div>

                            <strong>Lote:</strong>

                            ${expediente.lote}

                        </div>

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
                    border-top:1px solid #E5E5E5;
                ">

            <div
                style="
                    display:flex;
                    justify-content:space-between;
                    align-items:center;
                    flex-wrap:wrap;
                    gap:16px;
                ">

                <div
                    style="
                        color:var(--texto-secundario);
                        font-size:14px;
                    ">

                    Obra en ejecución.

                </div>

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

    const workspace =
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
