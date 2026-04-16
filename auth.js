const { createClient } = supabase;

// 🔹 Cliente único global (NO duplicar en otros archivos)
const supabaseClient = createClient(
  "https://prjxmfhahnzosdwljode.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InByanhtZmhhaG56b3Nkd2xqb2RlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIwNjE1NjUsImV4cCI6MjA4NzYzNzU2NX0.SHZkaOrD0Em9BRJg67QS6DgZ91qJhQFtGL7YqAssULs"
);

// 🔹 Protección de páginas por rol
let yaValidado = false;
async function protegerPagina(rolesPermitidos) {

if (yaValidado) return;
yaValidado = true;  

  try {

    // 🔹 1. Obtener sesión (rápido)
    let { data: sessionData } = await supabaseClient.auth.getSession();
    let user = sessionData?.session?.user;

    // 🔹 2. Fallback móvil (CRÍTICO)
    if (!user) {
      const { data: userData } = await supabaseClient.auth.getUser();
      user = userData?.user;
    }

    // 🔹 3. Si no hay usuario → login
    if (!user) {
      console.warn("❌ Sin sesión");
      window.location.href = "login.html";
      return;
    }

    const userId = user.id;

    // 🔹 4. Obtener rol desde residentes
    const { data: residente, error } = await supabaseClient
      .from("residentes")
      .select("tipo")
      .eq("user_id", userId)
      .maybeSingle();

    console.log("👤 RESIDENTE:", residente);
    console.log("⚠️ ERROR:", error);
    console.log("🎯 ROLES PERMITIDOS:", rolesPermitidos);

    // 🔹 5. Normalizar rol
    const tipo = residente?.tipo?.trim().toLowerCase();

    // 🔹 6. Normalizar roles permitidos
    const rolesNormalizados = rolesPermitidos.map(r => r.toLowerCase());

    // 🔹 7. Validación
    if (!residente || !rolesNormalizados.includes(tipo)) {
      console.warn("⛔ Acceso no autorizado:", tipo);
      window.location.href = "index.html";
      return;
    }

    console.log("✅ Acceso permitido:", tipo);

  } catch (err) {
    console.error("🔥 Error en protegerPagina:", err);
    window.location.href = "login.html";
  }
}

////////////////////////////////////////////////////////////////////////////////
// 🔥 NUEVO BLOQUE — UTILIDADES DE FECHA (NO ROMPE NADA)
////////////////////////////////////////////////////////////////////////////////

// 🔹 Inicio del día en UTC
function fechaInicioUTC(fecha){
  const d = new Date(fecha);
  d.setHours(0,0,0,0);
  return d.toISOString();
}

// 🔹 Fin del día en UTC
function fechaFinUTC(fecha){
  const d = new Date(fecha);
  d.setHours(23,59,59,999);
  return d.toISOString();
}

// 🔹 Formato visual México
function formatoMX(fecha){
  if(!fecha) return "";
  return new Date(fecha).toLocaleString("es-MX");
}

// 🔹 TEMPORAL: ajuste especial para tablas mal guardadas (ej: reportes_obras)
function fechaInicioAjustada(fecha){
  const d = new Date(fecha);
  d.setHours(0,0,0,0);
  d.setHours(d.getHours() + 6);
  return d.toISOString();
}

function fechaFinAjustada(fecha){
  const d = new Date(fecha);
  d.setHours(23,59,59,999);
  d.setHours(d.getHours() + 6);
  return d.toISOString();
}
