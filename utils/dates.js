// ===============================
// 🌐 FECHAS - ESTÁNDAR GLOBAL
// ===============================

// 🔹 Obtener rango UTC de un día (HOY, AYER, etc)
export function getUTCDayRange(date = new Date()) {
  const start = new Date(date)
  start.setHours(0, 0, 0, 0)

  const end = new Date(date)
  end.setHours(23, 59, 59, 999)

  return {
    start: start.toISOString(),
    end: end.toISOString()
  }
}

// 🔹 Últimos N días (ej: 7 días)
export function getLastDaysRange(days = 7) {
  const end = new Date()
  end.setHours(23, 59, 59, 999)

  const start = new Date()
  start.setDate(start.getDate() - days)
  start.setHours(0, 0, 0, 0)

  return {
    start: start.toISOString(),
    end: end.toISOString()
  }
}

// 🔹 Formatear fecha a México (visualización)
export function formatMXDate(dateString) {
  if (!dateString) return ''

  return new Date(dateString).toLocaleString('es-MX', {
    timeZone: 'America/Mexico_City',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 🔹 Solo fecha (sin hora)
export function formatMXDateOnly(dateString) {
  if (!dateString) return ''

  return new Date(dateString).toLocaleDateString('es-MX', {
    timeZone: 'America/Mexico_City',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}
