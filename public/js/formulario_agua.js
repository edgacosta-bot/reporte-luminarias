let residenteGlobal = null;

window.addEventListener("DOMContentLoaded", async () => {

  await protegerPagina(["colono","residente","admin"]);

  residenteGlobal = await getResidente();

  if (!residenteGlobal) {
    alert("Sesión no válida");
    return;
  }

  cargarCalles();

  const hoy = new Date();
  const fechaHoy =
    hoy.getFullYear() + "-" +
    String(hoy.getMonth() + 1).padStart(2, '0') + "-" +
    String(hoy.getDate()).padStart(2, '0');

  // limpiar errores en vivo conforme se llenan los campos
  document.getElementById("numero_reporte").addEventListener("input", () => {
    if (document.getElementById("numero_reporte").value.trim()) {
      document.getElementById("error_numero_reporte").innerText = "";
    }
  });

  document.getElementById("fecha_reporte").addEventListener("input", () => {
    if (document.getElementById("fecha_reporte").value) {
      document.getElementById("error_fecha_reporte").innerText = "";
    }
  });

  document.getElementById("tipo_falla").addEventListener("change", () => {
    if (document.getElementById("tipo_falla").value) {
      document.getElementById("error_tipo_falla").innerText = "";
    }
  });

  document.getElementById("calle").addEventListener("change", () => {
    if (document.getElementById("calle").value) {
      document.getElementById("error_calle").innerText = "";
    }
  });

  document.getElementById("medio_reporte").addEventListener("change", () => {
    if (document.getElementById("medio_reporte").value) {
      document.getElementById("error_medio_reporte").innerText = "";
    }
  });

});

async function cargarCalles(){

  if(!residenteGlobal) return;

  const { data } = await supabaseClient
    .from("ubicaciones")
    .select("id, calle")
    .eq("privada", residenteGlobal.privada)
    .order("calle");

  const select = document.getElementById("calle");
  select.innerHTML = '<option value="">Selecciona calle</option>';

  const callesUnicas = [...new Map(data.map(item => [item.calle, item])).values()];

  callesUnicas.forEach(c => {
    const option = document.createElement("option");
    option.value = c.id;
    option.textContent = c.calle;
    select.appendChild(option);
  });
}

async function guardar(){

  const numero_reporte = document.getElementById("numero_reporte").value.trim();
  const fecha_reporte = document.getElementById("fecha_reporte").value;
  const tipo_falla = document.getElementById("tipo_falla").value;
  const calle_id = document.getElementById("calle").value;
  const medio_reporte = document.getElementById("medio_reporte").value;
  const observaciones = document.getElementById("observaciones").value.trim();

  const msg = document.getElementById("msg");

  const errorNumeroReporte = document.getElementById("error_numero_reporte");
  const errorFechaReporte = document.getElementById("error_fecha_reporte");
  const errorTipoFalla = document.getElementById("error_tipo_falla");
  const errorCalle = document.getElementById("error_calle");
  const errorMedioReporte = document.getElementById("error_medio_reporte");

  // limpiar errores previos
  msg.innerText = "";
  msg.className = "text-center text-sm mt-2";
  errorNumeroReporte.innerText = "";
  errorFechaReporte.innerText = "";
  errorTipoFalla.innerText = "";
  errorCalle.innerText = "";
  errorMedioReporte.innerText = "";

  let valido = true;

  if (!numero_reporte) {
    errorNumeroReporte.innerText = "Indica el número de reporte";
    valido = false;
  }

  if (!fecha_reporte) {
    errorFechaReporte.innerText = "Selecciona la fecha del reporte";
    valido = false;
  }

  if (!tipo_falla) {
    errorTipoFalla.innerText = "Selecciona el tipo de falla";
    valido = false;
  }

  if (!calle_id) {
    errorCalle.innerText = "Selecciona la calle";
    valido = false;
  }

  if (!medio_reporte) {
    errorMedioReporte.innerText = "Selecciona el medio de reporte";
    valido = false;
  }

  if (!valido) return;

  if (!residenteGlobal) {
    msg.innerText = "No se pudo identificar al residente";
    msg.className = "text-center text-sm mt-2 text-red-600";
    return;
  }

  // 🔥 CONVERSIÓN CORRECTA A TIMESTAMP (CLAVE)
  const fechaISO = new Date(fecha_reporte + "T00:00:00").toISOString();

  const { error } = await supabaseClient
    .from("reportes_agua_caasim")
    .insert([{
      residente_id: residenteGlobal.id,
      privada: residenteGlobal.privada,
      casa: residenteGlobal.casa,
      calle_id,
      numero_reporte,
      tipo_falla,
      medio_reporte,
      observaciones,
      estatus: "reportado",
      fecha_reporte: fechaISO
    }]);

  if(error){
    console.error(error);
    msg.innerText = "Error al guardar";
    msg.className = "text-center text-sm mt-2 text-red-600";
    return;
  }

  msg.innerText = "Reporte guardado correctamente";
  msg.className = "text-center text-sm mt-2 text-green-600";

  document.getElementById("numero_reporte").value = "";
  document.getElementById("observaciones").value = "";

  const hoy = new Date();
  const fechaHoy =
    hoy.getFullYear() + "-" +
    String(hoy.getMonth() + 1).padStart(2, '0') + "-" +
    String(hoy.getDate()).padStart(2, '0');

  document.getElementById("fecha_reporte").value = fechaHoy;
}