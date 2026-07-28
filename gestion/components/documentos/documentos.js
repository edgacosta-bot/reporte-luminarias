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

        if (!archivo)
            return;

        console.log("Requisito:", expedienteRequisitoId);

        console.log("Archivo:", archivo);

    };

    input.click();

}

window.Documentos = Documentos;
