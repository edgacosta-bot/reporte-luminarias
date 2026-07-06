let reporteValido = false;
let luminariaActual = null;
let debounceTimer = null;

/* CATÁLOGO DINÁMICO */
async function cargarCatalogo() {
 
  const select = document.getElementById('descripcion');
 
  const { data, error } = await supabaseClient
    .from('catalogo_reportes')
    .select('subtipo')
    .eq('categoria', 'luminaria')
    .eq('actor_permitido', 'residente')
    .eq('activo', true)
    .order('subtipo');
 
  if (error) {
    console.error('Error cargando catálogo:', error);
    return;
  }
 
  select.innerHTML = '<option value="">Seleccione una opción</option>';
 
  data?.forEach(item => {
    const option = document.createElement('option');
    option.value = item.subtipo;
    option.textContent = item.subtipo
      .replaceAll('_', ' ')
      .split(' ')
      .map(p => p.charAt(0).toUpperCase() + p.slice(1).toLowerCase())
      .join(' ');
    select.appendChild(option);
  });
}
 
async function init() {
  await cargarCatalogo();
}
 
init();

/* VALIDAR LUMINARIA */

document.getElementById('no_luminaria').addEventListener('input', () => {

clearTimeout(debounceTimer);

const errorNoLuminaria = document.getElementById('error_no_luminaria');
errorNoLuminaria.innerText = "";

debounceTimer = setTimeout(async () => {

const numero = Number(document.getElementById('no_luminaria').value);
const info = document.getElementById('info_luminaria');
const boton = document.getElementById('btn_enviar');

if (!numero) {
info.innerHTML = "";
luminariaActual = null;
reporteValido = false;
return;
}

const { data, error } = await supabaseClient
.from('luminarias_lookup')
.select('id, calle, privada, situacion')
.eq('no_luminaria', numero);

if (error) {
console.error(error);
return;
}

if (data && data.length > 0) {

luminariaActual = data[0];

if (data[0].situacion === "Fuera de servicio") {

info.innerHTML =
"Calle: <b>" + data[0].calle +
"</b> | Privada: <b>" + data[0].privada +
"</b><br><span class='text-orange-600'>Esta luminaria ya está registrada como fuera de servicio.</span>";

reporteValido = false;
luminariaActual = null;

return;
}

info.innerHTML =
"Calle: <b>" + data[0].calle +
"</b> | Privada: <b>" + data[0].privada + "</b>";

info.className = "text-green-600 text-sm mt-2";

reporteValido = true;

} else {

info.innerHTML = "Número de luminaria no encontrado";
info.className = "text-red-600 text-sm mt-2";

reporteValido = false;
luminariaActual = null;
}

}, 400);

});

/* LIMPIAR ERROR DE TIPO DE FALLA EN VIVO */

document.getElementById('descripcion').addEventListener('change', () => {
if (document.getElementById('descripcion').value) {
document.getElementById('error_descripcion').innerText = "";
}
});

/* ENVIAR REPORTE */

document.getElementById('formReporte').addEventListener('submit', async (e) => {

e.preventDefault();

const mensaje = document.getElementById('mensaje');
const errorNoLuminaria = document.getElementById('error_no_luminaria');
const errorDescripcion = document.getElementById('error_descripcion');

// limpiar errores previos
mensaje.innerText = "";
mensaje.className = "text-center text-sm mt-2";
errorNoLuminaria.innerText = "";
errorDescripcion.innerText = "";

const no_luminaria = Number(document.getElementById('no_luminaria').value);
const descripcion = document.getElementById('descripcion').value;
const comentario = document.getElementById('comentario').value;

let valido = true;

if (!no_luminaria) {
errorNoLuminaria.innerText = "Indica el número de luminaria";
valido = false;
} else if (!luminariaActual || !reporteValido) {
errorNoLuminaria.innerText = "Verifica que el número de luminaria sea válido";
valido = false;
}

if (!descripcion) {
errorDescripcion.innerText = "Selecciona el tipo de falla";
valido = false;
}

if (!valido) return;

try {

// 🔥 NUEVO: obtener usuario autenticado
const { data: userData } = await supabaseClient.auth.getUser();
const user = userData?.user;

if (!user) {
throw new Error("Sesión no válida");
}

// 🔥 obtener residente por user_id
const { data: residente, error: errorResidente } = await supabaseClient
.from("residentes")
.select("id, privada, casa") // 🔥 AQUÍ
.eq("user_id", user.id)
.single();

if (errorResidente || !residente) {
throw new Error("No se pudo obtener la información del usuario");
}

if (!luminariaActual) {
throw new Error("Luminaria no válida");
}

const luminaria_id = luminariaActual.id;

const { error: errorInsert } = await supabaseClient
.from('reportes_vecinales')
.insert([{
  luminaria_id: luminaria_id,
  no_luminaria: no_luminaria,
  descripcion: descripcion,
  estatus: 'NUEVO',
  observaciones: comentario,

  privada: residente.privada,
  casa: residente.casa,

  residente_id: residente.id,

  // 🔥 NUEVO (HOMOLOGACIÓN)
  creado_por: residente.id,
  rol_creador: "residente",

  fecha_reporte: new Date().toISOString()
}]);

if (errorInsert) throw errorInsert;

mensaje.innerText =
"Reporte registrado correctamente. Gracias por tu apoyo para el mantenimiento del fraccionamiento.";

mensaje.className = "text-center text-sm mt-2 text-green-600";

document.getElementById('formReporte').reset();
document.getElementById('info_luminaria').innerHTML = "";
luminariaActual = null;
reporteValido = false;

} catch (error) {

mensaje.innerText = "Error: " + error.message;
mensaje.className = "text-center text-sm mt-2 text-red-600";

console.error(error);

}

});