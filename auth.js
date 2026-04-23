const { createClient } = supabase;

// 🔹 Cliente único global (NO duplicar en otros archivos)
const supabaseClient = createClient(
  "https://prjxmfhahnzosdwljode.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InByanhtZmhhaG56b3Nkd2xqb2RlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIwNjE1NjUsImV4cCI6MjA4NzYzNzU2NX0.SHZkaOrD0Em9BRJg67QS6DgZ91qJhQFtGL7YqAssULs"
);

// 🔥 Exponer globalmente
window.supabaseClient = supabaseClient;

// 🔹 Protección de páginas por rol
let yaValidado = false;

async function protegerPagina(rolesPermitidos) {

  if (yaValidado) return;
  yaValidado = true;

  try {

    // 🔹 1. Obtener sesión
    let { data: sessionData } = await supabaseClient.auth.getSession();
    let user = sessionData?.session?.user;

    // 🔹 2. Fallback móvil
    if (!user) {
      const { data: userData } = await supabaseClient.auth.getUser();
      user = userData?.user;
    }

    // 🔹 3. Sin sesión → login
    if (!user) {
      window.location.href = "login.html";
      return;
    }

    // 🔹 4. Obtener rol
    const { data: residente } = await supabaseClient
      .from("residentes")
      .select("tipo")
      .eq("user_id", user.id)
      .maybeSingle();

    // 🔹 5. Validar rol
    const tipo = residente?.tipo?.trim().toLowerCase();
    const rolesNormalizados = rolesPermitidos.map(r => r.toLowerCase());

    if (!residente || !rolesNormalizados.includes(tipo)) {
      window.location.href = "index.html";
      return;
    }

  } catch (err) {
    console.error("Error en protegerPagina:", err);
    window.location.href = "login.html";
  }
}

////////////////////////////////////////////////////////////////////////////////
// 🔥 UTILIDADES DE FECHA (ESTANDARIZADAS)
////////////////////////////////////////////////////////////////////////////////

function fechaInicioUTC(fecha){
  const d = new Date(fecha);
  d.setHours(0,0,0,0);
  return d.toISOString();
}

function fechaFinUTC(fecha){
  const d = new Date(fecha);
  d.setHours(23,59,59,999);
  return d.toISOString();
}

function formatoMX(fecha){
  if(!fecha) return "";
  return new Date(fecha).toLocaleString("es-MX");
}

////////////////////////////////////////////////////////////////////////////////
// 🔥 AJUSTE TEMPORAL PARA reportes_obras
////////////////////////////////////////////////////////////////////////////////

function fechaInicioAjustada(fecha){
  const d = new Date(fecha);
  d.setHours(0,0,0,0);
  d.setHours(d.getHours() - 6);
  return d.toISOString();
}

function fechaFinAjustada(fecha){
  const d = new Date(fecha);
  d.setHours(23,59,59,999);
  d.setHours(d.getHours() - 6);
  return d.toISOString();
}
