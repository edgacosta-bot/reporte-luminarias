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

    cargarPrivadas,

    cargarLotes

};

/* ==========================================================
   RENDER
========================================================== */

async function render() {

    console.log("NuevaObra.render()");

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

                        Privada

                    </label>

                    <select
                        id="cmbPrivada"
                        class="input">

                        <option value="">

                            Seleccione...

                        </option>

                    </select>

                </div>

                <div class="form-group">

                    <label>

                        Lote

                    </label>

                    <select
                        id="cmbLote"
                        class="input">

                        <option value="">

                            Seleccione una privada...

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
        .getElementById("btnCancelarNuevaObra")
        .addEventListener(
            "click",
            cancelar
        );

    document
        .getElementById("btnCancelar2")
        .addEventListener(
            "click",
            cancelar
        );

    document
        .getElementById("btnGuardarObra")
        .addEventListener(
            "click",
            guardar
        );

    await cargarPrivadas();

    document
        .getElementById("cmbPrivada")
        .addEventListener(
            "change",
            cargarLotes
        );

}


/* ==========================================================
   CARGAR PRIVADAS
========================================================== */

async function cargarPrivadas(){

    const combo =
        document.getElementById(
            "cmbPrivada"
        );

    combo.innerHTML = "";

    const opcion =
        document.createElement(
            "option"
        );

    opcion.value = "";

    opcion.textContent =
        "Seleccione...";

    combo.appendChild(opcion);

    try{

        const privadas =

            await Workflow.obtenerPrivadas();

        privadas.forEach(

            privada=>{

                const op =
                    document.createElement(
                        "option"
                    );

                op.value =
                    privada;

                op.textContent =
                    `Privada ${privada}`;

                combo.appendChild(op);

            }

        );

    }

    catch(ex){

        console.error(ex);

    }

}

/* ==========================================================
   CARGAR LOTES
========================================================== */

async function cargarLotes(){

    const privada =
        document
            .getElementById(
                "cmbPrivada"
            )
            .value;

    const combo =
        document.getElementById(
            "cmbLote"
        );

    combo.innerHTML = "";

    const opcion =
        document.createElement(
            "option"
        );

    opcion.value = "";

    opcion.textContent =
        privada
            ? "Seleccione..."
            : "Seleccione una privada...";

    combo.appendChild(opcion);

    if(!privada)
        return;

    try{

        const lotes =

            await Workflow.obtenerLotes(
                privada
            );

         console.log("Privada seleccionada:", privada);
         console.log("Lotes recibidos:", lotes);

        lotes.forEach(

            lote=>{

                const op =
                    document.createElement(
                        "option"
                    );

                op.value =
                    lote.id;

                op.textContent =
                    `Lote ${lote.lote}`;

                combo.appendChild(op);

            }

        );

    }

    catch(ex){

        console.error(ex);

    }

}

/* ==========================================================
   CONTINÚA EN LA PARTE 2
========================================================== */

/* ==========================================================
   GUARDAR
========================================================== */

async guardar() {

    const privadaSelect = document.getElementById("privada");
    const loteSelect = document.getElementById("lote");
    const tipoObraSelect = document.getElementById("tipoObra");

    const privada = privadaSelect.value;
    const loteId = loteSelect.value;
    const tipoObra = tipoObraSelect.value;

    if (!privada) {
        alert("Seleccione una privada.");
        return;
    }

    if (!loteId) {
        alert("Seleccione un lote.");
        return;
    }

    if (!tipoObra) {
        alert("Seleccione el tipo de obra.");
        return;
    }

    try {

        // Usuario autenticado
        let { data: sessionData } = await window.supabaseClient.auth.getSession();
        let user = sessionData?.session?.user;

        if (!user) {
            const { data: userData } = await window.supabaseClient.auth.getUser();
            user = userData?.user;
        }

        if (!user) {
            throw new Error("No existe una sesión autenticada.");
        }

        // Contexto institucional
        const { data: contexto, error: errorContexto } =
            await window.supabaseClient.rpc(
                "obtener_contexto_usuario_sige",
                {
                    p_user_id: user.id
                }
            );

        if (errorContexto)
            throw errorContexto;

        if (!contexto || contexto.length === 0)
            throw new Error("No fue posible obtener el contexto institucional del usuario.");

        const usuario = contexto[0];

        // Texto del lote para construir el título
        const loteTexto = loteSelect.options[loteSelect.selectedIndex].text;

        const titulo = `Obra Particular - ${privada} ${loteTexto}`;

        // Crear expediente
        const { data: expedienteId, error: errorExpediente } =
            await window.supabaseClient.rpc(
                "crear_expediente",
                {
                    p_tipo_clave: "OBR",
                    p_clasificacion: "PUB",
                    p_titulo: titulo,
                    p_administrador_id: usuario.residente_id,
                    p_interesado_nombre: null,
                    p_interesado_email: null,
                    p_interesado_telefono: null,
                    p_observaciones: null
                }
            );

        if (errorExpediente)
            throw errorExpediente;

        if (!expedienteId)
            throw new Error("La creación del expediente no devolvió un identificador.");

        Router.mostrarEscritorio(expedienteId);

    } catch (err) {

        console.error(err);
        alert(err.message || "Ocurrió un error al crear el expediente.");

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
