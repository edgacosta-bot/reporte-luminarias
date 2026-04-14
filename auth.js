const { createClient } = supabase;

const supabaseClient = createClient(
  "https://prjxmfhahnzosdwljode.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InByanhtZmhhaG56b3Nkd2xqb2RlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIwNjE1NjUsImV4cCI6MjA4NzYzNzU2NX0.SHZkaOrD0Em9BRJg67QS6DgZ91qJhQFtGL7YqAssULs"
);

async function protegerPagina(rolesPermitidos) {

  // 🔹 Intenta obtener sesión (rápido)
  let { data: sessionData } = await supabaseClient.auth.getSession();
  let user = sessionData?.session?.user;

  // 🔹 🔥 Fallback para móvil (clave)
  if (!user) {
    const { data: userData } = await supabaseClient.auth.getUser();
    user = userData?.user;
  }

  // 🔹 Si no hay usuario → login
  if (!user) {
    window.location.href = "login.html";
    return;
  }

  const userId = user.id;

  // 🔹 Obtener rol
  const { data: residente } = await supabaseClient
    .from("residentes")
    .select("tipo")
    .eq("user_id", userId)
    .maybeSingle();

  // 🔹 Validar rol
  if (!residente || !rolesPermitidos.includes(residente.tipo)) {
    window.location.href = "index.html";
  }
}
