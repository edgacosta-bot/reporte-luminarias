"use strict";

/* ==========================================================
   SIGE
   Módulo documental
========================================================== */

const Documentos = {

    incorporar,

    consultar

};

async function incorporar(expedienteRequisitoId) {

    const input = document.createElement("input");

    input.type = "file";

    input.accept = "application/pdf";

    input.onchange = async () => {

        const archivo = input.files[0];

        const extension = archivo.name.split(".").pop().toLowerCase();

       if (extension !== "pdf") {

    alert("Únicamente se permiten archivos PDF.");

    return;

}

        if (!archivo)
            return;

        const nombreArchivo = archivo.name;
        const tamanoBytes = archivo.size;
        const mimeType = archivo.type;
        const bucket = "Documentos";
        const rutaStorage =
    crypto.randomUUID() + ".pdf";

        console.log({
    expedienteRequisitoId,
    bucket,
    rutaStorage,
    nombreArchivo,
    mimeType,
    tamanoBytes
});

        
         const { error } = await window.supabaseClient.storage
    .from(bucket)
    .upload(
        rutaStorage,
        archivo,
        {
            upsert: false
        }
    );

if (error) {

    console.error(error);

    alert("No fue posible cargar el documento.");

    return;

}

const {
    data,
    error: errorRpc
} = await Workflow.registrarDocumentoRequisito(
    expedienteRequisitoId,
    bucket,
    rutaStorage,
    nombreArchivo,
    mimeType,
    tamanoBytes
);

       await Router.mostrarEscritorio(
    SIGE_STATE.expedienteActual.expediente.id
);

       
    };

    input.click();

}

async function consultar(expedienteRequisitoId) {

    const {
    data,
    error
} = await Workflow.consultarDocumento(
    expedienteRequisitoId
);

if (error) {

    console.error(error);

    alert("No fue posible consultar el documento.");

    return;

}

   if (!data.ok) {

    alert(data.mensaje);

    return;

}

const {
    data: urlData,
    error: urlError
} = await window.supabaseClient.storage
    .from(data.bucket)
    .createSignedUrl(
        data.ruta_storage,
        300
    );

if (urlError) {

    console.error(urlError);

    alert("No fue posible obtener el documento.");

    return;

}

window.open(
    urlData.signedUrl,
    "_blank"
);



window.Documentos = Documentos;
