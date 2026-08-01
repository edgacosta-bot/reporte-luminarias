"use strict";

/* ==========================================================
   SIGE
   Módulo documental
========================================================== */

const Documentos = {

    incorporar,

    consultar,

    sustituir

};

async function incorporar(expedienteRequisitoId) {

    const input =
        document.createElement("input");


    input.type = "file";

    input.accept = "application/pdf";


    input.onchange = async () => {

        try {


            const archivo =
                input.files[0];


            if (!archivo)
                return;



            const extension =
                archivo.name
                    .split(".")
                    .pop()
                    .toLowerCase();



            if (extension !== "pdf") {

                mostrarAlerta({

                    titulo:"SIGE",

                    mensaje:
                        "Únicamente se permiten archivos PDF."

                });

                return;

            }



            const nombreArchivo =
                archivo.name;


            const tamanoBytes =
                archivo.size;


            const mimeType =
                archivo.type;


            const bucket =
                "Documentos";


            const rutaStorage =
                crypto.randomUUID()
                + ".pdf";



            console.log(
                "Preparando documento:",
                {
                    expedienteRequisitoId,
                    bucket,
                    rutaStorage,
                    nombreArchivo,
                    mimeType,
                    tamanoBytes
                }
            );



            const {
                error: errorStorage
            } =
            await window.supabaseClient.storage

                .from(bucket)

                .upload(
                    rutaStorage,
                    archivo,
                    {
                        upsert:false
                    }
                );



            if(errorStorage){


                console.error(
                    errorStorage
                );


                throw new Error(
                    "No fue posible cargar el documento."
                );

            }



            const {
                data,
                error:errorRpc
            } =
            await Workflow.registrarDocumentoRequisito(

                expedienteRequisitoId,

                bucket,

                rutaStorage,

                nombreArchivo,

                mimeType,

                tamanoBytes

            );



            if(errorRpc){

                throw errorRpc;

            }



            console.log(
                "Documento registrado:",
                data
            );



            const actualizado =
                await Workflow.cumplirRequisito(

                    expedienteRequisitoId,

                    "Documento incorporado"

                );



            console.log(
                "Requisito cumplido:",
                actualizado
            );



            await Router.mostrarEscritorio(

                SIGE_STATE.expedienteActual.expediente.id

            );



        } catch(error){


            console.error(
                "Error incorporar documento:",
                error
            );


            mostrarAlerta({

                titulo:"SIGE",

                mensaje:error.message

            });


        }


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

    window.open(
        data.url,
        "_blank"
    );

}

async function sustituir(expedienteRequisitoId) {

    const input = document.createElement("input");

    input.type = "file";

    input.accept = "application/pdf";

    input.onchange = async () => {

        const archivo = input.files[0];

        if (!archivo)
            return;

        const extension =
            archivo.name
                .split(".")
                .pop()
                .toLowerCase();

        if (extension !== "pdf") {

            alert(
                "Únicamente se permiten archivos PDF."
            );

            return;

        }

        const nombreArchivo = archivo.name;
        const tamanoBytes = archivo.size;
        const mimeType = archivo.type;
        const bucket = "Documentos";
        const rutaStorage =
            crypto.randomUUID() + ".pdf";

        const { error } =
            await window.supabaseClient.storage
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

            alert(
                "No fue posible cargar el documento."
            );

            return;

        }

        const {
            data,
            error: errorRpc
        } =
        await Workflow.sustituirDocumentoRequisito(
            expedienteRequisitoId,
            bucket,
            rutaStorage,
            nombreArchivo,
            mimeType,
            tamanoBytes
        );

        if (errorRpc || !data?.ok) {

            console.error(errorRpc ?? data);

            alert(
                data?.mensaje ??
                "No fue posible sustituir el documento."
            );

            return;

        }

        await Router.mostrarEscritorio(
            SIGE_STATE.expedienteActual.expediente.id
        );

    };

    input.click();

}
window.Documentos = Documentos;
