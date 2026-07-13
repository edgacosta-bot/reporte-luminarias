"use strict";

/* ==========================================================
   SIGE
   Sistema Integral de Gestión de Expedientes

   Archivo:
   components/obras/nueva.js

   Responsabilidad:

   Crear una nueva obra mediante el
   Workflow Engine.

   Backend:

      RPC crear_obra()

========================================================== */

const NuevaObra = {

    render,

    guardar,

    cancelar,

    cargarLotes

};

/* ==========================================================
   RENDER
========================================================== */

async function render(){

    console.log("NuevaObra.render()");

    const workspace =
        document.getElementById("workspace");

    if(!workspace)
        return;

    workspace.innerHTML = `

        <div class="card">

            <div
                style="
                    display:flex;
                    justify-content:space-between;
                    align-items:center;
                ">

                <div>

                    <div class="card-title">

                        Nueva Obra Particular

                    </div>

                    <div class="card-subtitle">

                        Registro inicial del expediente.

                    </div>

                </div>

                <button
                    id="btnCancelarNuevaObra"
                    class="btn">

                    ← Cancelar

                </button>

            </div>

        </div>

        <div style="height:20px;"></div>

        <div class="card">

            <div class="form-grid">

                <div class="form-group">

                    <label>

                        Lote

                    </label>

                    <select
                        id="cmbLote"
                        class="input">

                        <option value="">

                            Cargando...

                        </option>

                    </select>

                </div>

                <div class="form-group">

                    <label>

                        Tipo de obra

                    </label>

                    <select
                        id="cmbTipoObra"
                        class="input">

                        <option value="">

                            Seleccione...

                        </option>

                        <option value="NUEVA">

                            Obra nueva

                        </option>

                        <option value="AMPLIACION">

                            Ampliación

                        </option>

                        <option value="REMODELACION">

                            Remodelación

                        </option>

                    </select>

                </div>

                <div class="form-group">

                    <label>

                        Director Responsable
                        de Obra

                    </label>

                    <input
                        id="txtDro"
                        class="input"
                        maxlength="250">

                </div>

                <div class="form-group">

                    <label>

                        Fecha de inicio

                    </label>

                    <input
                        id="txtFechaInicio"
                        type="date"
                        class="input">

                </div>

                <div class="form-group">

                    <label>

                        Fecha estimada
                        de término

                    </label>

                    <input
                        id="txtFechaFin"
                        type="date"
                        class="input">

                </div>

            </div>

            <div
                style="
                    margin-top:30px;
                    display:flex;
                    gap:12px;
                ">

                <button
                    id="btnGuardarObra"
                    class="btn btn-primary">

                    Crear expediente

                </button>

                <button
                    id="btnCancelar2"
                    class="btn">

                    Cancelar

                </button>

            </div>

        </div>

    `;

    document
        .getElementById(
            "btnCancelarNuevaObra"
        )
        .addEventListener(
            "click",
            cancelar
        );

    document
        .getElementById(
            "btnCancelar2"
        )
        .addEventListener(
            "click",
            cancelar
        );

    document
        .getElementById(
            "btnGuardarObra"
        )
        .addEventListener(
            "click",
            guardar
        );

    await cargarLotes();

}

/* ==========================================================
   CARGAR LOTES
========================================================== */

async function cargarLotes(){

    const combo =
        document.getElementById("cmbLote");

    combo.innerHTML = "";

    const opcion =
        document.createElement("option");

    opcion.value="";

    opcion.textContent="Seleccione...";

    combo.appendChild(opcion);

    const {

        data,

        error

    } = await supabaseClient

        .from("lotes")

        .select(`
            id,
            privada,
            lote,
            registrado
        `)

        .eq(
            "registrado",
            true
        )

        .order(
            "privada"
        )

        .order(
            "lote"
        );

    if(error){

        console.error(error);

        return;

    }

    data.forEach(

        lote=>{

            const op =
                document.createElement(
                    "option"
                );

            op.value=lote.id;

            op.textContent=
                `Privada ${lote.privada} · Lote ${lote.lote}`;

            combo.appendChild(op);

        }

    );

}

/* ==========================================================
   CONTINÚA EN LA PARTE 2
========================================================== */

/* ==========================================================
   GUARDAR
========================================================== */

async function guardar(){

    const loteId =
        Number(
            document.getElementById(
                "cmbLote"
            ).value
        );

    const tipoObra =
        document.getElementById(
            "cmbTipoObra"
        ).value;

    const dro =
        document
            .getElementById(
                "txtDro"
            )
            .value
            .trim();

    const fechaInicio =
        document
            .getElementById(
                "txtFechaInicio"
            )
            .value;

    const fechaFin =
        document
            .getElementById(
                "txtFechaFin"
            )
            .value;

    /* ---------------------------------------------
       VALIDACIONES
    --------------------------------------------- */

    if(!loteId){

        alert(
            "Seleccione el lote."
        );

        return;

    }

    if(!tipoObra){

        alert(
            "Seleccione el tipo de obra."
        );

        return;

    }

    if(dro===""){

        alert(
            "Capture el Director Responsable de Obra."
        );

        return;

    }

    if(fechaInicio===""){

        alert(
            "Capture la fecha de inicio."
        );

        return;

    }

    if(fechaFin===""){

        alert(
            "Capture la fecha estimada de término."
        );

        return;

    }

    const boton =
        document.getElementById(
            "btnGuardarObra"
        );

    boton.disabled=true;

    boton.textContent=
        "Creando expediente...";

    try{

        const {

            data,

            error

        } = await supabaseClient.rpc(

            "crear_obra",

            {

                p_lote_id:
                    loteId,

                p_dro_nombre:
                    dro,

                p_fecha_inicio:
                    fechaInicio,

                p_fecha_fin:
                    fechaFin,

                p_administrador_id:
                    null,

                p_solicitante_id:
                    null

            }

        );

        if(error)
            throw error;

        if(!data.ok){

            alert(
                data.mensaje
            );

            boton.disabled=false;

            boton.textContent=
                "Crear expediente";

            return;

        }

        alert(

            "Expediente creado correctamente.\n\n" +

            "Folio: " +

            data.folio

        );

        Router.mostrarEscritorio(

            data.expediente_id

        );

    }

    catch(ex){

        console.error(ex);

        alert(

            ex.message

        );

        boton.disabled=false;

        boton.textContent=
            "Crear expediente";

    }

}

/* ==========================================================
   CANCELAR
========================================================== */

function cancelar(){

    Router.mostrarNuevoExpediente();

}

/* ==========================================================
   EXPORTACIÓN
========================================================== */

window.NuevaObra =

    NuevaObra;
