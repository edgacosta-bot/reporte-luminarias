// ===============================
// 🔐 OBTENER RESIDENTE GLOBAL
// ===============================

let residenteCache = null;

window.getResidente = async function () {

  // 🔥 CACHE (evita consultas repetidas)
  if (residenteCache) return residenteCache;

  const { data } = await supabaseClient.auth.getUser();
  const user = data?.user;

  if (!user) return null;

  const { data: residente, error } = await supabaseClient
    .from("residentes")
    .select("id, privada, casa")
    .eq("user_id", user.id)
    .single();

  if (error || !residente) return null;

  residenteCache = residente;

  return residente;
};
