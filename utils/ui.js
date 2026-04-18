// ===============================
// 🔥 UI GLOBAL MENSAJES PRO
// ===============================

window.ui = {

  alert: function(msg) {
    this.show(msg, "info");
  },

  error: function(msg) {
    this.show(msg, "error");
  },

  success: function(msg) {
    this.show(msg, "success");
  },

  warn: function(msg) {
    this.show(msg, "warn");
  },

  show: function(msg, tipo = "info") {

    const colores = {
      info: "#2563eb",
      success: "#16a34a",
      error: "#dc2626",
      warn: "#f59e0b"
    };

    const div = document.createElement("div");

    div.innerText = msg;

    div.style.position = "fixed";
    div.style.bottom = "20px";
    div.style.left = "50%";
    div.style.transform = "translateX(-50%)";
    div.style.background = colores[tipo] || "#2563eb";
    div.style.color = "white";
    div.style.padding = "14px 20px";
    div.style.borderRadius = "12px";
    div.style.fontSize = "14px";
    div.style.boxShadow = "0 10px 25px rgba(0,0,0,0.3)";
    div.style.zIndex = "9999";
    div.style.opacity = "0";
    div.style.transition = "opacity 0.3s";

    document.body.appendChild(div);

    setTimeout(() => div.style.opacity = "1", 50);

    setTimeout(() => {
      div.style.opacity = "0";
      setTimeout(() => div.remove(), 300);
    }, 2500);
  }

};
