const { createClient } = supabase;

// 🔹 Cliente único (NO duplicar en otros archivos)
const supabaseClient = createClient(
  "https://prjxmfhahnzosdwljode.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InByanhtZmhhaG56b3Nkd2xqb2RlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nz20NjE1NjUsImV4cCI6MjA4NzYzNzU2NX0.SHZkaOrD0Em9BRJg67QS6DgZ91qJhQFtGL7YqAssULs"
);

// 🔹 Protección de páginas por rol
async function protegerPagina(rolesPermitidos) {

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
    console.log("🎯 ROL ESPERADO:", rolesPermitidos);

    // 🔹 5. Normalizar rol
    const tipo = residente?.tipo?.toLowerCase();

    // 🔹 6. Validación
    if (!residente || !rolesPermitidos.includes(tipo)) {
      console.warn("⛔ Acceso no autorizado");
      window.location.href = "index.html";
      return;
    }

    console.log("✅ Acceso permitido");

  } catch (err) {
    console.error("🔥 Error en protegerPagina:", err);
    window.location.href = "login.html";
  }
}
