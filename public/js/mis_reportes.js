let residenteId, seleccionado=null;

const MODO_PRUEBA_EVALUACION = false;

function puedeEvaluar(fecha){
  if (MODO_PRUEBA_EVALUACION) return true;

  return (new Date() - new Date(fecha)) / 86400000 >= 3;
}

async function obtenerUsuario(){
  const { data } = await supabaseClient.auth.getUser();
  const user = data.user;

  const { data: residente } = await supabaseClient
    .from("residentes")
    .select("id")
    .eq("user_id", user.id)
    .single();

  residenteId = residente?.id;
}

function rangoRapido(dias){
  const rango = getLastDaysRange(dias);
  document.getElementById("inicio").value = rango.start.split("T")[0];
  document.getElementById("fin").value = rango.end.split("T")[0];
  cargar();
}

async function cargar(){

  if (!residenteId) return;

  document.getElementById("lista").innerHTML = "Cargando...";

  const inicio = document.getElementById("inicio").value;
  const fin = document.getElementById("fin").value;

  let queryObras = supabaseClient.from("reportes_obras").select("*").eq("residente_id", residenteId);
  if (inicio && fin) queryObras = queryObras.gte("fecha_reporte", fechaInicioUTC(inicio)).lte("fecha_reporte", fechaFinUTC(fin));
  const { data: obras } = await queryObras;

  let queryVecinal = supabaseClient.from("incidencias_vecinales").select("*").eq("residente_id", residenteId);
  if (inicio && fin) queryVecinal = queryVecinal.gte("fecha_reporte", fechaInicioUTC(inicio)).lte("fecha_reporte", fechaFinUTC(fin));
  const { data: vecinales } = await queryVecinal;

  let queryVigilantes = supabaseClient.from("reportes_vigilantes").select("*").eq("residente_id", residenteId);
  if (inicio && fin) queryVigilantes = queryVigilantes.gte("fecha_reporte", fechaInicioUTC(inicio)).lte("fecha_reporte", fechaFinUTC(fin));
  const { data: vigilantes } = await queryVigilantes;

  // 🔵 MAPA DE VIGILANTES DESDE RESIDENTES
let mapaVigilantes = {};

const { data: listaVigilantes, error: errVig } = await supabaseClient
  .from("residentes")
  .select("id, nombre")
  .eq("tipo", "vigilante")
  .not("casa", "in", "(1,6)");

if (errVig) {
  console.error("Error cargando vigilantes:", errVig);
}

listaVigilantes?.forEach(v => {
  mapaVigilantes[v.id] = v.nombre;
});

console.log("MAPA VIGILANTES:", mapaVigilantes);

  let queryLuminarias = supabaseClient.from("reportes_vecinales").select("*").eq("residente_id", residenteId);
  if (inicio && fin) queryLuminarias = queryLuminarias.gte("fecha_reporte", fechaInicioUTC(inicio)).lte("fecha_reporte", fechaFinUTC(fin));
  const { data: luminarias } = await queryLuminarias;

  let queryAgua = supabaseClient
  .from("reportes_agua_caasim")
  .select("*")
  .eq("residente_id", residenteId);

if (inicio && fin) {
  queryAgua = queryAgua
    .gte("fecha_reporte", fechaInicioUTC(inicio))
    .lte("fecha_reporte", fechaFinUTC(fin));
}

const { data: agua } = await queryAgua;

  // 🔥 RESTAURADO (CRÍTICO)
  const { data: evals } = await supabaseClient
    .from("evaluaciones_reportes")
    .select("reporte_id");

  console.log("EVALS:", evals);

  const evaluados = new Set(
  evals?.map(e => String(e.reporte_id))
);

  let todos = [];

  obras?.forEach(r=> todos.push({
  id:"obra-"+r.id,
  id_real: r.id,
  tipo:"obra",
  descripcion:r.descripcion,
  fecha:r.fecha_reporte,

  // 🔥 NUEVO
  ubicacion: `Privada ${r.privada || ""} - Lote ${r.casa || ""}`
}));

vecinales?.forEach(r=> todos.push({
  id:"vec-"+r.id,
  id_real: r.id,
  tipo:"vecinal",
  descripcion:r.descripcion,
  fecha:r.fecha_reporte,

  // 🔥 NUEVO
  ubicacion: `Privada ${r.privada || ""} - Lote ${r.casa || ""}`
}));

vigilantes?.forEach(r=> todos.push({
  id:"vig-"+r.id,
  id_real: r.id,
  tipo:"vigilante",
  descripcion: r.descripcion,
  fecha: r.fecha_reporte,

  // 🔥 NUEVO
  vigilante_nombre: mapaVigilantes[r.vigilante_id] || "Vigilante desconocido"
}));

  luminarias?.forEach(r=> todos.push({
  id:"lum-"+r.id,
  tipo:"luminaria",
  descripcion: `Luminaria: ${r.no_luminaria}\n${r.descripcion}`,
  fecha:r.fecha_reporte
}));
  agua?.forEach(r=> todos.push({
  id:"agua-"+r.id,
  tipo:"agua",
  descripcion: `No. reporte: ${r.numero_reporte}\n${r.tipo_falla || ""}`,
  fecha:r.fecha_reporte
}));

  todos.sort((a,b)=> new Date(b.fecha) - new Date(a.fecha));

  const grupos = { obra:[], vecinal:[], vigilante:[], luminaria:[], agua:[] };
  todos.forEach(r=> grupos[r.tipo]?.push(r));

  let html="";

  function renderGrupo(titulo, tipo){
    if (!grupos[tipo].length) return "";

    let bloque = `<h3 class="text-base font-semibold text-gray-700 mt-5 mb-2">${titulo}</h3>`;

    grupos[tipo].forEach(r => {

      let esEvaluable = ["obra","vecinal","vigilante"].includes(r.tipo);
      const id = r.id_real || r.id;
      console.log("ID ACTUAL:", id);
      let puede = esEvaluable && !evaluados.has(String(id));
      let habilitado = puede && puedeEvaluar(r.fecha);

      bloque += `
  <div class="bg-gray-50 border border-gray-200 rounded-lg p-3 mb-3">

    ${r.tipo === "obra" ? `
  <div class="text-sm text-gray-600 mb-1">
    <strong>Obra reportada:</strong> ${r.ubicacion}
  </div>
` : ""}

${r.tipo === "vecinal" ? `
  <div class="text-sm text-gray-600 mb-1">
    <strong>Lote reportado:</strong> ${r.ubicacion}
  </div>
` : ""}

    ${r.vigilante_nombre ? `
      <div class="text-sm text-gray-600 mb-1">
        <strong>Vigilante reportado:</strong> ${r.vigilante_nombre}
      </div>
    ` : ""}

    <div class="text-sm text-gray-800 whitespace-pre-line">${r.descripcion}</div>
    <div class="text-xs text-gray-400 mt-1">${formatMXDate(r.fecha)}</div>

       ${puede ? `

  <button
    onclick="${habilitado ? `abrir('${id}')` : ''}"
    ${!habilitado ? 'disabled' : ''}
    class="w-full mt-3 py-2 rounded-lg text-sm transition ${habilitado ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}"
  >
    Evaluar atención
  </button>

  ${!habilitado ? `
    <div class="text-xs text-gray-400 text-center mt-2">
      La evaluación se habilitará automáticamente después de 3 días.
    </div>
  ` : ""}

` : ""}
      </div>
      `;
    });

    return bloque;
  }

  html += renderGrupo("🟡 OBRAS", "obra");
  html += renderGrupo("🔴 VECINALES", "vecinal");
  html += renderGrupo("🟢 VIGILANTES", "vigilante");
  html += renderGrupo("💡 LUMINARIAS", "luminaria");
  html += renderGrupo("💧 AGUA", "agua");

  document.getElementById("lista").innerHTML = html || "Sin resultados";
}

function abrir(id){
  seleccionado=id;
  const modal = document.getElementById("modal");
  modal.classList.remove("hidden");
  modal.classList.add("flex");
}

async function evaluar(tipo){
  const { data } = await supabaseClient.auth.getUser();

  const { error } = await supabaseClient
  .from("evaluaciones_reportes")
  .insert([{
    reporte_id: seleccionado,
    tipo_reporte:"general",
    calificacion:tipo,
    residente_id: residenteId,
    fecha:new Date()
  }]);

if (error) {
  console.error(error);
  alert("Error al guardar evaluación");
  return;
}

  const modal = document.getElementById("modal");
  modal.classList.add("hidden");
  modal.classList.remove("flex");

alert(
`Gracias por tu evaluación.

Tu opinión servirá para mejorar la forma en que la administración atiende los reportes de los residentes.`
);

cargar();
}

async function init(){
  await obtenerUsuario();
  await cargar();
}

init();