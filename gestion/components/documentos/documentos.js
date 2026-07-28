"use strict";

/* ==========================================================
   SIGE
   Módulo documental
========================================================== */

const Documentos = {

    incorporar

};

function incorporar(expedienteRequisitoId) {

    const input = document.createElement("input");

    input.type = "file";

    input.accept = "application/pdf";

    input.onchange = () => {

        const archivo = input.files[0];

        const extension = archivo.name.split(".").pop().toLowerCase();

       if (extension !== "pdf") {

    alert("Únicamente se permiten archivos PDF.");

    return;

}

        if (!archivo)
            return;

        console.log("Requisito:", expedienteRequisitoId);

        console.log("Archivo:", archivo);

    };

    input.click();

}

window.Documentos = Documentos;
