"use strict";

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

    registrarEventos,

    actualizar,

    destruir

};



/* ==========================================================
   DATOS DEMO

   (Se sustituirán posteriormente
   por las RPC del Workflow)
========================================================== */

const procedimientosDemo = [

    {

        id:"1",

        numero:"O-2026-001",

        tipo:"Obra",

        nombre:"Construcción de vivienda",

        estado:"Revisión Mesa Directiva",

        avance:68,

        responsable:"Presidente"

    },

    {

        id:"2",

        numero:"O-2026-002",

        tipo:"Obra",

        nombre:"Ampliación de cochera",

        estado:"Autorizado",

        avance:100,

        responsable:"Administrador"

    },

    {

        id:"3",

        numero:"O-2026-003",

        tipo:"Obra",

        nombre:"Construcción de alberca",

        estado:"Observado",

        avance:42,

        responsable:"Administrador"

    }

];



/* ==========================================================
   RENDER
========================================================== */

function render() {

    const workspace =
        document.getElementById("workspace");

    if(!workspace)
        return;

    workspace.innerHTML = `

        <div class="card">

            <div class="card-title">

                Mis procedimientos

            </div>

            <div class="card-subtitle">

                Seleccione un procedimiento
                para continuar su trámite.

            </div>

            <div id="listaProcedimientos">

            </div>

        </div>

    `;

    const contenedor =
        document.getElementById(
            "listaProcedimientos"
        );

    procedimientosDemo.forEach(

        procedimiento=>{

            contenedor.innerHTML +=
                renderCard(procedimiento);

        }

    );

    registrarEventos();

}

/* ==========================================================
   TARJETA
========================================================== */

function renderCard(procedimiento) {

    let badge = "";

    switch (procedimiento.estado) {

        case "Autorizado":

            badge =
                '<span class="badge badge-success">Autorizado</span>';

            break;

        case "Observado":

            badge =
                '<span class="badge badge-danger">Observado</span>';

            break;

        default:

            badge =
                '<span class="badge badge-warning">En revisión</span>';

    }

    return `

        <div
            class="card procedimiento-card"
            data-id="${procedimiento.id}"
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

                        ${procedimiento.numero}

                    </div>

                    <div
                        style="
                            margin-top:8px;
                            font-size:17px;
                            font-weight:600;
                        ">

                        ${procedimiento.nombre}

                    </div>

                </div>

                <div>

                    ${badge}

                </div>

            </div>

            <div
                style="
                    margin-top:20px;
                ">

                <div
                    style="
                        display:flex;
                        justify-content:space-between;
                        margin-bottom:6px;
                        font-size:14px;
                    ">

                    <span>

                        Avance

                    </span>

                    <strong>

                        ${procedimiento.avance}%

                    </strong>

                </div>

                <div
                    style="
                        width:100%;
                        height:10px;
                        background:#E5E7EB;
                        border-radius:999px;
                        overflow:hidden;
                    ">

                    <div
                        style="
                            width:${procedimiento.avance}%;
                            height:100%;
                            background:var(--vino);
                        ">

                    </div>

                </div>

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

                        Responsable actual

                    </div>

                    <strong>

                        ${procedimiento.responsable}

                    </strong>

                </div>

                <button
                    class="btn btn-primary abrir-procedimiento"
                    data-id="${procedimiento.id}">

                    Abrir

                </button>

            </div>

        </div>

    `;

}

/* ==========================================================
   EVENTOS
========================================================== */

function registrarEventos() {

    const botones =
        document.querySelectorAll(
            ".abrir-procedimiento"
        );

    botones.forEach(

        boton => {

            boton.addEventListener(

                "click",

                function () {

                    const id =
                        this.dataset.id;

                    abrirProcedimiento(id);

                }

            );

        }

    );

}



/* ==========================================================
   ABRIR PROCEDIMIENTO
========================================================== */

function abrirProcedimiento(idProcedimiento) {

    console.log(

        "Abrir procedimiento:",

        idProcedimiento

    );

    /*
        Sprint siguiente:

        1) Obtener el procedimiento desde Supabase.

        2) Obtener actuaciones.

        3) Router.mostrarEscritorio(idProcedimiento);

    */

    if (

        typeof Router !== "undefined"

        &&

        typeof Router.mostrarEscritorio === "function"

    ) {

        Router.mostrarEscritorio(

            idProcedimiento

        );

    }

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



/* ==========================================================
   EXPORTACIÓN
========================================================== */

window.ListaProcedimientos =
    ListaProcedimientos;
