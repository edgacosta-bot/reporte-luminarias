"use strict";

/* ==========================================================
   SIGE
   Sistema Integral de Gestión de Expedientes

   Archivo:
   app.js

   Versión:
   2.0.0

   Responsabilidad:
   Inicializar completamente la aplicación.

========================================================== */


/* ==========================================================
   APLICACIÓN
========================================================== */

const SIGE = {

    version: "2.0.0",

    iniciado: false,

    usuario: null,

    contexto: null,

    iniciar

};


/* ==========================================================
   INICIO
========================================================== */

async function iniciar() {

    console.clear();

    console.log("");
    console.log("=======================================");
    console.log(" SIGE");
    console.log(" Sistema Integral de Gestión");
    console.log(" Versión", SIGE.version);
    console.log("=======================================");
    console.log("");

    try {

        await validarSesion();

       await validarAutorizacion();

        inicializarEstado();

        inicializarUI();

        inicializarRouter();

        Router.mostrarDashboard();

        SIGE.iniciado = true;

        console.log("");
        console.log("Aplicación iniciada correctamente.");
        console.log("");

    }

    catch (error) {

        console.error("");

        console.error("Error al iniciar SIGE");

        console.error(error);

        console.error("");

        mostrarResultadoInicio(error);

    }

}


/* ==========================================================
   SESIÓN
========================================================== */

async function validarSesion() {

    const {

        data,
        error

    } = await supabaseClient.auth.getSession();

    if (error)
        throw error;

    if (!data.session) {

        window.location.href = "../login.html";

        return;

    }

    SIGE.usuario = data.session.user;

}


/* ==========================================================
   AUTORIZACIÓN
========================================================== */

async function validarAutorizacion() {

    const { data, error } = await supabaseClient.rpc(
        "obtener_contexto_usuario_sige",
        {
            p_user_id: SIGE.usuario.id
        }
    );

    if (error)
        throw error;

    if (!data || data.length === 0)
        throw new Error("No fue posible obtener el contexto institucional.");

    const contexto = data[0];

    if (!contexto.acceso_gestion_institucional) {

        throw new Error(
            "Esta función solo es accesible para la Mesa Directiva y la Administración."
        );

    }

    SIGE.contexto = contexto;

    actualizarUsuario();

}
/* ==========================================================
   USUARIO
========================================================== */

function actualizarUsuario() {

    const contenedor =
        document.getElementById("usuarioActual");

    if (!contenedor)
        return;

    contenedor.textContent =
        SIGE.contexto.nombre_cargo;

}

/* ==========================================================
   ERROR DE INICIO
========================================================== */

function mostrarResultadoInicio(error) {

    const workspace =
        document.getElementById("workspace");

    if (!workspace)
        return;

    const accesoRestringido =
        error.message.includes("accesible para la Mesa Directiva") ||
        error.message.startsWith("SIGE-002");

    if (accesoRestringido) {

        workspace.innerHTML = `

            <div class="card">

                <div class="card-title">

                    Acceso restringido

                </div>

                <div class="card-subtitle">

                    Esta sección está disponible únicamente para la
                    <strong>Mesa Directiva</strong> y la
                    <strong>Administración</strong>.

                </div>

                <button
                    class="btn btn-primary"
                    onclick="window.location.href='../index.html'">

                    Regresar

                </button>

            </div>

        `;

        return;

    }

    workspace.innerHTML = `

        <div class="card">

            <div class="card-title">

                No fue posible iniciar SIGE

            </div>

            <div class="card-subtitle">

                ${error.message}

            </div>

            <button
                class="btn btn-primary"
                onclick="location.reload()">

                Reintentar

            </button>

        </div>

    `;

}

/* ==========================================================
   DOM
========================================================== */

document.addEventListener(

    "DOMContentLoaded",

    iniciar

);
