let lotesGlobal = [];

// 🔹 CATÁLOGO INCIDENTES
async function cargarCatalogo() {

  const select = document.getElementById("tipo");

  const { data, error } = await supabaseClient
  .from("catalogo_reportes")
  .select("subtipo")
  .eq("categoria", "vecinal")
  .eq("actor_permitido", "residente")
  .eq("activo", true)
  .order("subtipo");

if (error) {
  console.error("Error catálogo:", error);
  return;
}

  select.innerHTML = '<option value="">Tipo de incidente</option>';

  data.forEach(item => {
    const option = document.createElement("option");
    option.value = item.subtipo;
    option.textContent = item.subtipo.replaceAll("_", " ");
    select.appendChild(option);
  });
}

// 🔹 CARGAR LOTES
async function cargarLotes() {

  const { data } = await supabaseClient
    .from("lotes")
    .select("privada, lote")
    .not("privada", "in", "(ADMIN,SEG)");

  lotesGlobal = data;

  const privadas = [...new Set(data.map(l => l.privada))];

  const selectPriv = document.getElementById("privada_afectada");

  privadas.forEach(p => {
    const option = document.createElement("option");
    option.value = p;
    option.textContent = p;
    selectPriv.appendChild(option);
  });
}

// 🔹 FILTRAR LOTES
function filtrarLotes() {

  const privada = document.getElementById("privada_afectada").value;
  const selectLote = document.getElementById("lote_afectado");

  selectLote.innerHTML = '<option value="">Lote relacionado (opcional)</option>';

  const filtrados = lotesGlobal.filter(l => l.privada === privada);

  filtrados.forEach(l => {
    const option = document.createElement("option");
    option.value = l.lote;
    option.textContent = l.lote;
    selectLote.appendChild(option);
  });
}

// 🔹 ENVIAR
async function reportar() {

  const tipo = document.getElementById("tipo").value;
  const descripcion = document.getElementById("descripcion").value.trim();
  const privadaAfectada = document.getElementById("privada_afectada").value;
  const loteAfectado = document.getElementById("lote_afectado").value;
  const mensaje = document.getElementById("mensaje");
  const errorTipo = document.getElementById("error_tipo");
  const errorDescripcion = document.getElementById("error_descripcion");

  // limpiar errores previos
  errorTipo.innerText = "";
  errorDescripcion.innerText = "";
  mensaje.innerText = "";

  let valido = true;

  if (!tipo) {
    errorTipo.innerText = "Selecciona el tipo de incidente";
    valido = false;
  }

  if (!descripcion) {
    errorDescripcion.innerText = "Agrega una descripción del incidente";
    valido = false;
  }

  if (!valido) return;

  // 🔥 NUEVO: obtener residente GLOBAL
  const residente = await getResidente();

  if (!residente) {
    mensaje.innerText = "Error de sesión";
    mensaje.className = "text-center text-sm mt-2 text-red-600";
    return;
  }

// 🔍 DEBUG
console.log({
  privadaAfectada,
  loteAfectado
});

  const { error } = await supabaseClient
    .from("incidencias_vecinales")
    .insert([{
  categoria: "vecinal",
  tipo,
  descripcion,

  residente_id: residente.id,

  privada: residente.privada,
  casa: residente.casa,

  // 🔥 NUEVO (TRAZABILIDAD)
  creado_por: residente.id,
  rol_creador: "residente",

  privada_afectada: privadaAfectada ? privadaAfectada : null,
  casa_afectada: loteAfectado ? String(loteAfectado) : null,

  fecha_reporte: new Date().toISOString(),
  estatus: "nuevo",
  atendido: false
}]);

  if (error) {
    mensaje.innerText = "Error al enviar reporte";
    mensaje.className = "text-center text-sm mt-2 text-red-600";
    return;
  }

  mensaje.innerText = "Reporte enviado correctamente";
  mensaje.className = "text-center text-sm mt-2 text-green-600";

  document.getElementById("descripcion").value = "";
}

// 🔄 INIT
document.addEventListener("DOMContentLoaded", async () => {
  await cargarCatalogo();
  await cargarLotes();

  document
    .getElementById("privada_afectada")
    .addEventListener("change", filtrarLotes);

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