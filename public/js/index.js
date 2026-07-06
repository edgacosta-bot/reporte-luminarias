let rolActual = "";

function toggleMenu(id){

  const el = document.getElementById(id);

  const isVisible =
    window.getComputedStyle(el).display !== "none";

  el.style.display = isVisible ? "none" : "block";

  if(!isVisible){
    setTimeout(()=>{
      el.scrollIntoView({
        behavior:"smooth",
        block:"start"
      });
    },150);
  }
}

async function moduloAmenidades(){
  await mostrarAlerta({
    titulo: "🚧 Amenidades",
    mensaje: `
      Estamos trabajando en este módulo.<br><br>
      Estará disponible próximamente.
    `
  });
}

async function logout(){
  await supabaseClient.auth.signOut();
  window.location.href = "login.html";
}

document.addEventListener("DOMContentLoaded", async () => {

  const { data } = await supabaseClient.auth.getSession();
  const user = data?.session?.user;

  if (!user) {
    window.location.href = "login.html";
    return;
  }

  const { data: residente } = await supabaseClient
    .from("residentes")
    .select("tipo, privada, casa, es_residente")
    .eq("user_id", user.id)
    .single();

  const rol = residente?.tipo || "";

  const esResidente = residente?.es_residente;

  rolActual = rol;

  const vivienda = `${residente?.privada || ""}-${residente?.casa || ""}`;

  let descripcionRol = rol.toUpperCase();

  if (rol === "residente") {
    descripcionRol =
      esResidente === true
        ? "RESIDENTE"
        : "PROPIETARIO";
  }

  if (rol === "administracion") {
    descripcionRol = "ADMINISTRACIÓN";
  }

  if (rol === "vigilante") {
    descripcionRol = "VIGILANCIA";
  }

  document.getElementById("rolTexto").innerHTML =
    `<strong>${vivienda}</strong> | ${descripcionRol}`;

  if (rol === "administracion") {
    document.getElementById("menuAdmin").style.display = "block";

    await cargarKPIs();

    setInterval(cargarKPIs, 30000); // 🔥 auto actualización cada 30s
  }
  else if (rol === "residente" || rol === "colono") {

    if (esResidente === true) {
      document.getElementById("menuResidente").style.display = "block";
    } else {
      document.getElementById("menuPropietario").style.display = "block";
    }

    // 🔥 ocultar KPIs para ambos
    document.querySelector(".kpis").style.display = "none";
  }
  else if (rol === "vigilante") {
    document.getElementById("menuVigilante").style.display = "block";

    await cargarKPIs();
    setInterval(cargarKPIs, 30000);
  }

  ["obras", "qr", "infra", "vig", "qr_res", "paq", "reportes", "infra_res", "aportaciones", "obras_res","paq_vig", "obras_vig", "inmobiliaria_vig", "actividades_vig", "otros_accesos", "servicios_vig", "sigvic_vig", "sigvic_admin", "amenidades"]
    .forEach(id => {
      const el = document.getElementById(id);
      if (el) el.style.display = "none";
    });

  // 🔥 MOSTRAR SOLO CUANDO YA SABES EL ROL
  document.body.style.visibility = "visible";

});

function abrirPaquetes() {

  if (rolActual === "vigilante") {
    window.location.href = "entrega_paquetes.html";
  } else if (rolActual === "administracion") {
    window.location.href = "entrega_paquetes.html";
  }
}

function abrirReportes() {

  if (rolActual === "administracion") {
    window.location.href = "admin_reporte_general.html";
  } else if (rolActual === "vigilante") {
    window.location.href = "reportes_fuera_horario.html";
  }
}

async function cargarKPIs(){
  try {

    const hoy = new Date(
      new Date().toLocaleString("en-US", { timeZone: "America/Mexico_City" })
    );
    hoy.setHours(0,0,0,0);

    let totalReportes = 0;

    if (rolActual === "vigilante") {

      const fechaHoyMX = new Date().toLocaleDateString("en-CA", {
        timeZone: "America/Mexico_City"
      });

      const inicio = fechaInicioUTC(fechaHoyMX);
      const fin = fechaFinUTC(fechaHoyMX);

      console.log("inicio:", inicio);
      console.log("fin:", fin);

      const { data, error } = await supabaseClient
        .from("reportes_obras")
        .select("id")
        .eq("tipo", "salida_fuera_horario")
        .gte("fecha_reporte", inicio)
        .lte("fecha_reporte", fin);

      if (error) {
        console.error(error);
        totalReportes = 0;
      } else {
        totalReportes = data?.length || 0;
      }

    } else {

      // 🔴 VECINALES
      const { data: vecinal } = await supabaseClient
        .from("incidencias_vecinales")
        .select("fecha_reporte");

      totalReportes += vecinal?.filter(r => new Date(r.fecha_reporte) >= hoy).length || 0;

      // 🔵 VIGILANTES
      const { data: vigilantes } = await supabaseClient
        .from("reportes_vigilantes")
        .select("fecha_reporte");

      totalReportes += vigilantes?.filter(r => new Date(r.fecha_reporte) >= hoy).length || 0;

      // 🟣 OBRAS
      const { data: obras } = await supabaseClient
        .from("reportes_obras")
        .select("fecha_reporte");

      totalReportes += obras?.filter(r => new Date(r.fecha_reporte) >= hoy).length || 0;

      // 🟡 AGUA
      const { data: agua } = await supabaseClient
        .from("reportes_agua_caasim")
        .select("fecha_registro");

      totalReportes += agua?.filter(r => new Date(r.fecha_registro) >= hoy).length || 0;

      // 🟢 LUMINARIAS
      const { data: luminarias } = await supabaseClient
        .from("vista_reportes_luminarias")
        .select("fecha_reporte");

      totalReportes += luminarias?.filter(r => new Date(r.fecha_reporte) >= hoy).length || 0;

    }

    // 👷 TRABAJADORES DENTRO
    const { data: trabajadores } = await supabaseClient
      .from("accesos_trabajadores")
      .select("id")
      .is("fecha_hora_salida", null);

    document.getElementById("kpiTrabajadores").innerText = trabajadores?.length || 0;

    // 🏡 ASESORES DENTRO
    const { data: asesores } = await supabaseClient.rpc("obtener_asesores_dentro");

    const kpiAsesores = document.getElementById("kpiAsesores");
    if (kpiAsesores) {
      kpiAsesores.innerText = asesores?.length || 0;
    }

    // 🚚 ABASTECIMIENTOS
    const { data: abastecimientos } = await supabaseClient.rpc("obtener_reporte_abastecimientos");

    const abiertos = abastecimientos?.filter(a => a.estatus === "DENTRO").length || 0;

    const kpiAbastecimientos = document.getElementById("kpiAbastecimientos");
    if (kpiAbastecimientos) {
      kpiAbastecimientos.innerText = abiertos;
    }

    // 📦 PAQUETES
    // 🔧 CORREGIDO: antes dependía de querySelectorAll(".kpi span")[1],
    // que se rompe al reestructurar el HTML. Ahora usa el id directo.
    const { data: paquetes } = await supabaseClient
      .from("paquetes")
      .select("id")
      .eq("entregado", false);

    const kpiPaquetes = document.getElementById("kpiPaquetes");
    if (kpiPaquetes) {
      kpiPaquetes.innerText = paquetes?.length || 0;
    }

    document.getElementById("kpiReportes").innerText = totalReportes;

  } catch (e) {
    console.error("ERROR GENERAL KPI:", e);
  }

}