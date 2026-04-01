function protegerPagina(rolesPermitidos) {

  const usuario = localStorage.getItem("usuario_valido");
  const rol = localStorage.getItem("rol");

  // 🔒 Sin sesión
  if (!usuario) {
    window.location.href = "login.html";
    return;
  }

  // 🔒 Sin rol permitido
  if (!rolesPermitidos.includes(rol)) {
    window.location.href = "index.html";
  }
}