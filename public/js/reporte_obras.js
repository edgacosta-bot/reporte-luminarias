// 🔐 VARIABLES
let actorInfo = document.getElementById("actorInfo");
let actor = "residente";

// 🔐 OBTENER RESIDENTE (NUEVO MODELO)
async function inicializarResidente(){

  const residente = await getResidente();

  if (!residente) {
    actorInfo.innerText = "Error de sesión";
    return null;
  }

  actorInfo.innerText = `Privada ${residente.privada} - Casa ${residente.casa}`;

  return residente;
}

// 🔥 CATÁLOGO
async function cargarCatalogo() {
  const select = document.getElementById("tipo");

 const { data, error } = await supabaseClient
  .from("catalogo_reportes")
  .select("subtipo")
  .eq("categoria", "obras")
  .eq("actor_permitido", actor)
  .eq("activo", true);

if (error) {
  console.error("Error cargando catálogo:", error);
  return;
}

  select.innerHTML = '<option value="">Tipo de reporte</option>';

  if (data) {
    data.forEach(item => {
      const option = document.createElement("option");
      option.value = item.subtipo;
      option.textContent = item.subtipo.replaceAll("_", " ");
      select.appendChild(option);
    });
  }
}

// 🔥 OBRAS
async function cargarObras() {

  const select = document.getElementById("obra");

  const { data, error } = await supabaseClient
    .from("obras")
    .select("id, privada, casa")
    .eq("estatus", "aprobada");

  if (error) {
  console.error("Error cargando obras:", error);
  return;
}

  
  select.innerHTML = '<option value="">Selecciona obra</option>';

  if (data) {
    data.forEach(item => {
      const option = document.createElement("option");
      option.value = item.id;
      option.textContent = `Privada ${item.privada} - Casa ${item.casa}`;
      select.appendChild(option);
    });
  }
}

// 🔥 FILTRAR TRABAJADORES
document.getElementById("obra").addEventListener("change", async (e) => {

  const obra_id = e.target.value;
  const select = document.getElementById("trabajador");

  select.innerHTML = '<option value="">Selecciona trabajador</option>';

  if (obra_id) {
    document.getElementById("error_obra").innerText = "";
  }

  if (!obra_id) return;

 const { data, error } = await supabaseClient
  .from("trabajadores_obra")
  .select("id, nombre")
  .eq("obra_id", obra_id)
  .eq("activo", true);

if (error) {
  console.error("Error cargando trabajadores:", error);
  return;
}

  if (data) {
    data.forEach(item => {
      const option = document.createElement("option");
      option.value = item.id;
      option.textContent = item.nombre;
      select.appendChild(option);
    });
  }
});

// 🚀 ENVIAR
async function enviarReporte() {

  const tipo = document.getElementById("tipo").value;
  const descripcion = document.getElementById("descripcion").value.trim();
  const trabajador_id = document.getElementById("trabajador").value;
  const obra_id = document.getElementById("obra").value;

  const mensaje = document.getElementById("mensaje");
  const errorTipo = document.getElementById("error_tipo");
  const errorObra = document.getElementById("error_obra");
  const errorDescripcion = document.getElementById("error_descripcion");

  // limpiar errores previos
  mensaje.innerText = "";
  mensaje.className = "text-center text-sm mt-2";
  errorTipo.innerText = "";
  errorObra.innerText = "";
  errorDescripcion.innerText = "";

  let valido = true;

  if (!tipo) {
    errorTipo.innerText = "Selecciona el tipo de reporte";
    valido = false;
  }

  if (!obra_id) {
    errorObra.innerText = "Selecciona la obra";
    valido = false;
  }

  if (!descripcion) {
    errorDescripcion.innerText = "Describe el problema";
    valido = false;
  }

  if (!valido) return;

  // 🔥 NUEVO: obtener residente
  const residente = await getResidente();

  if (!residente) {
    mensaje.innerText = "Error de sesión";
    mensaje.className = "text-center text-sm mt-2 text-red-600";
    return;
  }

 const dataInsert = {
  tipo: tipo,
  descripcion: descripcion,
  trabajador_id: trabajador_id || null,
  obra_id: obra_id,
  privada: residente.privada,
  casa: residente.casa,
  residente_id: residente.id,

  // 🔥 NUEVO (CLAVE)
  creado_por: residente.id,
  rol_creador: "residente",
  fecha_reporte: new Date().toISOString(),
  estatus: "nuevo"
};

  const { error } = await supabaseClient
    .from("reportes_obras")
    .insert([dataInsert]);

  if (error) {
    console.error("Error insert:", error);
    mensaje.innerText = error.message || "Error al enviar";
    mensaje.className = "text-center text-sm mt-2 text-red-600";
    return;
  }

  mensaje.innerText = "Reporte enviado correctamente";
  mensaje.className = "text-center text-sm mt-2 text-green-600";
}

// INIT
window.addEventListener("DOMContentLoaded", async () => {
  await inicializarResidente();
  cargarCatalogo();
  cargarObras();

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
});