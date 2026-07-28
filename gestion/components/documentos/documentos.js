"use strict";

/* ==========================================================
   SIGE
   Módulo documental
========================================================== */

const Documentos = {

    incorporar

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
        const bucket = "documentos";
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

        console.log("Requisito:", expedienteRequisitoId);

        console.log("Archivo:", archivo);

        console.log("supabaseClient =", window.supabaseClient);
         console.log("supabaseClient.storage =", window.supabaseClient?.storage);

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

    };

    input.click();

}

window.Documentos = Documentos;
