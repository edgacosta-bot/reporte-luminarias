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
