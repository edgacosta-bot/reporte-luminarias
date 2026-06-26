/* 🔥 CATÁLOGO DINÁMICO */
async function cargarCatalogo(){

  // 🔴 LÍNEA CRÍTICA (faltaba)
  const residente = await getResidente();

  // 🔴 AQUÍ EXACTO van los logs
  console.log("RESIDENTE COMPLETO:", residente);
  console.log("TIPO EXACTO:", JSON.stringify(residente?.tipo));

  if (!residente) {
    console.error("No se pudo obtener residente");
    return;
  }

  const { data, error } = await supabaseClient
    .from("catalogo_reportes")
    .select("subtipo")
    .eq("categoria","seguridad")
    .in("actor_permitido", [residente.tipo, "residente"])
    .eq("activo", true)
    .order("subtipo");

  if(error){
    console.error(error);
    return;
  }

  const select = document.getElementById("tipo");

  select.innerHTML = '<option value="">Tipo de reporte</option>'; // reset limpio

  data?.forEach(i=>{
    const opt = document.createElement("option");
    opt.value = i.subtipo;

    opt.textContent = i.subtipo
      .replaceAll("_"," ")
      .replace(/\b\w/g, l => l.toUpperCase());

    select.appendChild(opt);
  });
}

/* 👮 LISTA DE VIGILANTES (CORREGIDO) */
async function cargarVigilantes(){

  const { data, error } = await supabaseClient
    .from("residentes")
    .select("id,nombre")
    .eq("tipo","vigilante")
    .eq("activo", true)
    .not("casa", "in", "(1,6)")
    .order("nombre");

  if(error){
    console.error(error);
    return;
  }

  const select = document.getElementById("vigilante");

  data?.forEach(v=>{
    const opt = document.createElement("option");
    opt.value = v.id;
    opt.textContent = v.nombre;
    select.appendChild(opt);
  });
}

/* 🚀 ENVIAR */
async function enviar(){

  const vigilante_id = document.getElementById("vigilante").value;
  const tipo = document.getElementById("tipo").value;
  const descripcion = document.getElementById("descripcion").value.trim();
  const msg = document.getElementById("mensaje");

  const errorVigilante = document.getElementById("error_vigilante");
  const errorTipo = document.getElementById("error_tipo");
  const errorDescripcion = document.getElementById("error_descripcion");

  // limpiar errores previos
  msg.innerText = "";
  msg.className = "text-center text-sm mt-2";
  errorVigilante.innerText = "";
  errorTipo.innerText = "";
  errorDescripcion.innerText = "";

  let valido = true;

  if(!vigilante_id){
    errorVigilante.innerText = "Selecciona un vigilante";
    valido = false;
  }

  if(!tipo){
    errorTipo.innerText = "Selecciona el tipo de reporte";
    valido = false;
  }

  if(!descripcion){
    errorDescripcion.innerText = "Describe lo ocurrido";
    valido = false;
  }

  if(!valido) return;

  // 🔥 OBTENER RESIDENTE
  const residente = await getResidente();

  if (!residente) {
    msg.innerText = "Error de sesión";
    msg.className = "text-center text-sm mt-2 text-red-600";
    return;
  }

  const { error } = await supabaseClient
    .from("reportes_vigilantes")
    .insert([{
      vigilante_id,
      tipo,
      descripcion,

      privada: residente.privada,
      casa: residente.casa,

      residente_id: residente.id,

      creado_por: residente.id,
      rol_creador: residente.tipo,

      fecha_reporte: new Date().toISOString(),
      estatus: "nuevo"
    }]);

  if(error){
    console.error(error);
    msg.innerText = "Error al enviar reporte";
    msg.className = "text-center text-sm mt-2 text-red-600";
    return;
  }

  msg.innerText = "Reporte enviado correctamente";
  msg.className = "text-center text-sm mt-2 text-green-600";

  document.getElementById("descripcion").value = "";
  document.getElementById("tipo").value = "";
  document.getElementById("vigilante").value = "";
}

/* INIT */
async function init(){
  await cargarCatalogo();
  await cargarVigilantes();

  document.getElementById("vigilante").addEventListener("change", () => {
    if (document.getElementById("vigilante").value) {
      document.getElementById("error_vigilante").innerText = "";
    }
  });

  document.getElementById("tipo").addEventListener("change", () => {
    if (document.getElementById("tipo").value) {
      document.getElementById("error_tipo").innerText = "";
    }
  });

  document.getElementById("descripcion").addEventListener("input", () => {
    if (document.getElementById("descripcion").value.trim()) {
      document.getElementById("error_descripcion").innerText = "";
    }
  });
}

init();