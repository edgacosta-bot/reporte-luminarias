// ===============================
// 🌐 FECHAS - GLOBAL ESTABLE
// ===============================

// 🔹 Obtener rango UTC de un día
window.getUTCDayRange = function(date = new Date()) {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);

  const end = new Date(date);
  end.setHours(23, 59, 59, 999);

  return {
    start: start.toISOString(),
    end: end.toISOString()
  };
};

// 🔹 Últimos N días
window.getLastDaysRange = function(days = 7) {
  const end = new Date();
  end.setHours(23, 59, 59, 999);

  const start = new Date();
  start.setDate(start.getDate() - days);
  start.setHours(0, 0, 0, 0);

  return {
    start: start.toISOString(),
    end: end.toISOString()
  };
};

// ===============================
// 🔥 FORMATO FECHAS (CORREGIDO)
// ===============================

// 🔹 Formato México (interpretando correctamente UTC)
window.formatMXDate = function(dateString) {
  if (!dateString) return '';

  // 🔥 FORZAR interpretación como UTC
  const date = new Date(dateString + 'Z');

  return date.toLocaleString('es-MX', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// 🔹 Solo fecha México
window.formatMXDateOnly = function(dateString) {
  if (!dateString) return '';

  const date = new Date(dateString + 'Z');

  return date.toLocaleDateString('es-MX', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
};
