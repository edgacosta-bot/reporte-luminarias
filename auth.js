function cargarConfiguracionDesdeEnvJs() {
  if (window.__APP_ENV__) return;

  const request = new XMLHttpRequest();
  request.open('GET', 'env.js', false);

  try {
    request.send(null);
  } catch (error) {
    return;
  }

  if (request.status < 200 || request.status >= 400) {
    return;
  }

  const match = request.responseText.match(/window\.__APP_ENV__\s*=\s*(\{[\s\S]*\});?/);
  if (!match) return;

  window.__APP_ENV__ = JSON.parse(match[1]);
}

cargarConfiguracionDesdeEnvJs();

function obtenerConfiguracionSupabase() {
  const config = window.__APP_ENV__;

  if (!config?.SUPABASE_URL || !config?.SUPABASE_ANON_KEY) {
    throw new Error('Falta la configuración de Supabase en env.js');
  }

  return config;
}

function createSupabaseClient() {
  const { SUPABASE_URL, SUPABASE_ANON_KEY } = obtenerConfiguracionSupabase();
  return supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}

async function validarPinVigilante(pinInput) {
  const pin = (pinInput || '').toString().trim();

  if (!pin) return null;

  const { data, error } = await supabaseClient
    .rpc('login_vigilante_por_pin', { p_pin: pin });

  if (error) {
    console.error('Error validando PIN vigilante:', error);
    return null;
  }

  if (!data) return null;
  return Array.isArray(data) ? (data[0] || null) : data;
}

// 🔹 Cliente único global (NO duplicar en otros archivos)
const supabaseClient = createSupabaseClient();

// 🔥 Exponer globalmente
window.supabaseClient = supabaseClient;
window.createSupabaseClient = createSupabaseClient;
window.validarPinVigilante = validarPinVigilante;

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
