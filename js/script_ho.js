// ---------------------------
// CONFIG
// ---------------------------

// URL de tu Apps Script (pon aquí tu URL real)
const API_URL = "https://script.google.com/macros/s/XXXXXXXXXXXX/exec";

// Bloques horarios (índices 0..6)
const horas = [
  ["08:00","08:50"],
  ["08:50","09:40"],
  ["10:10","11:00"],
  ["11:00","11:50"],
  ["11:50","12:40"],
  ["13:10","14:00"],
  ["14:00","14:50"]
];

// Aulas por día (1=Lunes ... 5=Viernes)
const aulas = {
  1:["1RO COMPETITIVE","2DO KIND","3RO FAIR","3RO HONEST","1RO WISE","3RO KIND","3RO NOBLE"],
  2:["2DO WISE","1RO LEADER","3RO COMPETITIVE","3RO POLITE","1RO NOBLE","3RO LEADER","3RO DOER"],
  3:["2DO FAIR","1RO POLITE","1RO FAIR","3RO CHEERFUL","1RO HONEST","1RO GIFTED","3RO GIFTED"],
  4:["1RO CREATIVE","3RO WISE","2DO CREATIVE","2DO NOBLE","2DO CHEERFUL","3RO CREATIVE","2DO COMPETITIVE"],
  5:["2DO GIFTED","1RO DOER","2DO HONEST","2DO POLITE","1RO KIND","2DO DOER","1RO CHEERFUL"]
};

// Enlace principal por aula
const enlacesAulas = {
  "1RO COMPETITIVE": "https://classroom.google.com/w/NzM3ODI3MjU3OTYz/t/all",
  "2DO KIND": "https://classroom.google.com/w/NzM3ODI3NzYzOTM5/t/all",
  "3RO FAIR": "https://classroom.google.com/w/NzUwMzY2Mjk1Mjkw/t/all",
  "3RO HONEST": "https://classroom.google.com/w/NzM3ODI5MTUzODM3/t/all",
  "1RO WISE": "https://classroom.google.com/w/NzM3ODI3MDc4MTQ0/t/all",
  "3RO KIND": "https://classroom.google.com/w/NzM3ODI3ODE1Njk2/t/all",
  "3RO NOBLE": "https://classroom.google.com/w/NzUwMzY5NjgzODQ1/t/all",
  "2DO WISE": "https://classroom.google.com/w/NzM3ODI4MDUzNDkx/t/all",
  "1RO LEADER": "https://classroom.google.com/w/NzUxOTExMjU2ODcz/t/all",
  "3RO COMPETITIVE": "https://classroom.google.com/w/NzM3ODI3NzQwNTk5/t/all",
  "3RO POLITE": "https://classroom.google.com/w/NzUwMzYzOTg2NTUw/t/all",
  "1RO NOBLE": "https://classroom.google.com/w/NzUwMzYyMjg1MTIx/t/all",
  "3RO LEADER": "https://classroom.google.com/w/Njg4NzE4OTUxNzgw/t/all",
  "3RO DOER": "https://classroom.google.com/w/NzM3ODI3Njk4MjA5/t/all",
  "2DO FAIR": "https://classroom.google.com/w/NzM3ODI3ODA4MDMw/t/all",
  "1RO POLITE": "https://classroom.google.com/w/NzUwMzYwMTM3NDIx/t/all",
  "1RO FAIR": "https://classroom.google.com/w/NzM3ODI3NDU2MTcy/t/all",
  "3RO CHEERFUL": "https://classroom.google.com/w/NzM3ODI4ODE1NzM0/t/all",
  "1RO HONEST": "https://classroom.google.com/w/NzUwMzU5NjI2NjY3/t/all",
  "1RO GIFTED": "https://classroom.google.com/w/NzM3ODI3MTY0Njk4/t/all",
  "3RO GIFTED": "https://classroom.google.com/w/NzM3ODI4MDU4OTA3/t/all",
  "1RO CREATIVE": "https://classroom.google.com/w/NzM3ODI3NDMyOTg0/t/all",
  "3RO WISE": "https://classroom.google.com/w/NzM3ODI3ODEwMTMz/t/all",
  "2DO CREATIVE": "https://classroom.google.com/w/NzM3ODI4Mzk1MDEy/t/all",
  "2DO NOBLE": "https://classroom.google.com/w/NzM3ODI4MDI2MzI0/t/all",
  "2DO CHEERFUL": "https://classroom.google.com/w/NzUwMzYzNTYwOTY0/t/all",
  "3RO CREATIVE": "https://classroom.google.com/w/NzUwMzY5NjAxNjQy/t/all",
  "2DO COMPETITIVE": "https://classroom.google.com/w/NzUwMzYxNjE1MDg2/t/all",
  "2DO GIFTED": "https://classroom.google.com/w/NzUwMzYyOTM3NTg3/t/all",
  "1RO DOER": "https://classroom.google.com/w/NzM3ODI2NjU1ODUz/t/all",
  "2DO HONEST": "https://classroom.google.com/w/NzM3ODI3NDc0NjE2/t/all",
  "2DO POLITE": "https://classroom.google.com/w/NzUwMzY1NjE3NTA4/t/all",
  "1RO KIND": "https://classroom.google.com/w/NzUwMzYyMDE2NDc4/t/all",
  "2DO DOER": "https://classroom.google.com/w/NzUwMzY0Mjk2OTY2/t/all",
  "1RO CHEERFUL": "https://classroom.google.com/w/NzM3ODI2ODQwODU4/t/all"
};

// Enlaces de calificaciones
const enlacesCalificaciones = {
  "1RO COMPETITIVE": "https://classroom.google.com/c/NzM3ODI3MjU3OTYz/gb/sort-last-name/default",
  "2DO KIND": "https://classroom.google.com/c/NzM3ODI3NzYzOTM5/gb/sort-last-name/default",
  "3RO FAIR": "https://classroom.google.com/c/NzUwMzY2Mjk1Mjkw/gb/sort-name/default",
  "3RO HONEST": "https://classroom.google.com/c/NzM3ODI5MTUzODM3/gb/sort-name/default",
  "1RO WISE": "https://classroom.google.com/c/NzM3ODI5MTUzODM3/gb/sort-name/default",
  "3RO KIND": "https://classroom.google.com/c/NzM3ODI3ODE1Njk2/gb/sort-name/default",
  "3RO NOBLE": "https://classroom.google.com/c/NzUwMzY5NjgzODQ1/gb/sort-name/default",
  "2DO WISE": "https://classroom.google.com/c/NzM3ODI4MDUzNDkx/gb/sort-name/default",
  "1RO LEADER": "https://classroom.google.com/c/NzUxOTExMjU2ODcz/gb/sort-name/default",
  "3RO COMPETITIVE": "https://classroom.google.com/c/NzM3ODI3NzQwNTk5/gb/sort-name/default",
  "3RO POLITE": "https://classroom.google.com/c/NzUwMzYzOTg2NTUw/gb/sort-name/default",
  "1RO NOBLE": "https://classroom.google.com/c/NzUwMzYyMjg1MTIx/gb/sort-name/default",
  "3RO LEADER": "https://classroom.google.com/c/Njg4NzE4OTUxNzgw/gb/sort-name/default",
  "3RO DOER": "https://classroom.google.com/c/NzM3ODI3Njk4MjA5/gb/sort-name/default",
  "2DO FAIR": "https://classroom.google.com/c/NzM3ODI3ODA4MDMw/gb/sort-name/default",
  "1RO POLITE": "https://classroom.google.com/c/NzUwMzYwMTM3NDIx/gb/sort-name/default",
  "1RO FAIR": "https://classroom.google.com/c/NzM3ODI3NDU2MTcy/gb/sort-name/default",
  "3RO CHEERFUL": "https://classroom.google.com/c/NzM3ODI4ODE1NzM0/gb/sort-name/default",
  "1RO HONEST": "https://classroom.google.com/c/NzUwMzU5NjI2NjY3/gb/sort-name/default",
  "1RO GIFTED": "https://classroom.google.com/c/NzM3ODI3MTY0Njk4/gb/sort-name/default",
  "3RO GIFTED": "https://classroom.google.com/c/NzM3ODI4MDU4OTA3/gb/sort-name/default",
  "1RO CREATIVE": "https://classroom.google.com/c/NzM3ODI3NDMyOTg0/gb/sort-name/default",
  "3RO WISE": "https://classroom.google.com/c/NzM3ODI3ODEwMTMz/gb/sort-name/default",
  "2DO CREATIVE": "https://classroom.google.com/c/NzM3ODI4Mzk1MDEy/gb/sort-name/default",
  "2DO NOBLE": "https://classroom.google.com/c/NzM3ODI4MDI2MzI0/gb/sort-name/default",
  "2DO CHEERFUL": "https://classroom.google.com/c/NzUwMzYzNTYwOTY0/gb/sort-name/default",
  "3RO CREATIVE": "https://classroom.google.com/c/NzUwMzY5NjAxNjQy/gb/sort-name/default",
  "2DO COMPETITIVE": "https://classroom.google.com/c/NzUwMzYxNjE1MDg2/gb/sort-name/default",
  "2DO GIFTED": "https://classroom.google.com/c/NzUwMzYyOTM3NTg3/gb/sort-name/default",
  "1RO DOER": "https://classroom.google.com/c/NzM3ODI2NjU1ODUz/gb/sort-name/default",
  "2DO HONEST": "https://classroom.google.com/c/NzM3ODI3NDc0NjE2/gb/sort-name/default",
  "2DO POLITE": "https://classroom.google.com/c/NzUwMzY1NjE3NTA4/gb/sort-name/default",
  "1RO KIND": "https://classroom.google.com/c/NzUwMzYyMDE2NDc4/gb/sort-name/default",
  "2DO DOER": "https://classroom.google.com/c/NzUwMzY0Mjk2OTY2/gb/sort-name/default",
  "1RO CHEERFUL": "https://classroom.google.com/c/NzM3ODI2ODQwODU4/gb/sort-name/default"
};

// Enlaces de registro
const enlacesRegistro = {
  "1RO COMPETITIVE": "registro-wise.html",
  "2DO KIND": "registro-kind.html",
  "3RO FAIR": "registro-fun.html",
  "3RO HONEST": "registro-fair.html",
  "1RO WISE": "registro-cool.html",
  "3RO KIND": "registro-best.html",
  "3RO NOBLE": "registro-creative.html",
  "2DO WISE": "registro-strong.html",
  "1RO LEADER": "registro-winner.html",
  "3RO COMPETITIVE": "registro-gifted.html",
  "3RO POLITE": "registro-nice.html",
  "1RO NOBLE": "registro-super.html",
  "3RO LEADER": "registro-happy.html",
  "3RO DOER": "registro-smart.html",
  "2DO FAIR": "aulas/smart.html",
  "1RO POLITE": "aulas/smart.html",
  "1RO FAIR": "aulas/smart.html",
  "3RO CHEERFUL": "aulas/smart.html",
  "1RO HONEST": "aulas/smart.html",
  "1RO GIFTED": "aulas/smart.html",
  "3RO GIFTED": "aulas/smart.html",
  "1RO CREATIVE": "aulas/smart.html",
  "3RO WISE": "aulas/smart.html",
  "2DO CREATIVE": "aulas/smart.html",
  "2DO NOBLE": "aulas/smart.html",
  "2DO CHEERFUL": "aulas/smart.html",
  "3RO CREATIVE": "aulas/smart.html",
  "2DO COMPETITIVE": "aulas/smart.html",
  "2DO GIFTED": "aulas/smart.html",
  "1RO DOER": "aulas/smart.html",
  "2DO HONEST": "aulas/smart.html",
  "2DO POLITE": "aulas/smart.html",
  "1RO KIND": "aulas/smart.html",
  "2DO DOER": "aulas/cheerful.html",
  "1RO CHEERFUL": "registro-bright.html"
};

// Enlaces de asistencia
const enlacesAsistencia = {
  "1RO COMPETITIVE": "asistencia-wise.html",
  "2DO KIND": "asistencia-kind.html",
  "3RO FAIR": "asistencia-fun.html",
  "3RO HONEST": "asistencia-fair.html",
  "1RO WISE": "asistencia-cool.html",
  "3RO KIND": "asistencia-best.html",
  "3RO NOBLE": "asistencia-creative.html",
  "2DO WISE": "asistencia-strong.html",
  "1RO LEADER": "asistencia-winner.html",
  "3RO COMPETITIVE": "asistencia-gifted.html",
  "3RO POLITE": "asistencia-nice.html",
  "1RO NOBLE": "asistencia-super.html",
  "3RO LEADER": "asistencia-happy.html",
  "3RO DOER": "asistencia-smart.html",
  "2DO FAIR": "aulas/smart.html",
  "1RO POLITE": "aulas/smart.html",
  "1RO FAIR": "aulas/smart.html",
  "3RO CHEERFUL": "aulas/smart.html",
  "1RO HONEST": "aulas/smart.html",
  "1RO GIFTED": "aulas/smart.html",
  "3RO GIFTED": "aulas/smart.html",
  "1RO CREATIVE": "aulas/smart.html",
  "3RO WISE": "aulas/smart.html",
  "2DO CREATIVE": "aulas/smart.html",
  "2DO NOBLE": "aulas/smart.html",
  "2DO CHEERFUL": "aulas/smart.html",
  "3RO CREATIVE": "aulas/smart.html",
  "2DO COMPETITIVE": "aulas/smart.html",
  "2DO GIFTED": "aulas/smart.html",
  "1RO DOER": "aulas/smart.html",
  "2DO HONEST": "aulas/smart.html",
  "2DO POLITE": "aulas/smart.html",
  "1RO KIND": "aulas/smart.html",
  "2DO DOER": "aulas/cheerful.html",
  "1RO CHEERFUL": "asistencia-bright.html"
};

// ---------------------------
// UTIL
// ---------------------------
function toMin(h){ return parseInt(h.split(":")[0])*60 + parseInt(h.split(":")[1]); }
function diaNombre(num){ const dias=["","Lunes","Martes","Miércoles","Jueves","Viernes"]; return dias[num]||""; }
function isApiConfigured(){ return API_URL && !API_URL.includes("XXXXXXXX"); }

// ---------------------------
// AGENDA: construcción dinámica
// ---------------------------
function generarAgenda(diaSel="todos"){
  const agenda = document.getElementById("agenda");
  if(!agenda) return console.warn("No se encontró #agenda en el DOM");
  agenda.innerHTML = "";

  horas.forEach((r,i)=>{
    const bloque = document.createElement("div");
    bloque.className = "bloque";
    bloque.dataset.fila = i;

    // hora
    const h = document.createElement("div");
    h.className = "hora";
    h.textContent = `${r[0]} - ${r[1]}`;
    bloque.appendChild(h);

    if(diaSel === "todos"){
      for(let d=1; d<=5; d++){
        const diaItem = document.createElement("div");
        diaItem.className = "dia-item";
        diaItem.dataset.dia = d;

        const label = document.createElement("span");
        label.className = "dia";
        label.textContent = `${diaNombre(d)}: `;

        const aulaNombre = aulas[d][i];

        // botón principal
        const enlace = document.createElement("a");
        enlace.className = "aula-boton";
        enlace.href = enlacesAulas[aulaNombre] || "#";
        enlace.textContent = aulaNombre;

        diaItem.appendChild(label);
        diaItem.appendChild(enlace);

        // 📌 botones secundarios
        const opciones = document.createElement("div");
        opciones.className = "opciones-aula";

        const sub1 = document.createElement("a");
        sub1.className = "opcion-boton";
        sub1.textContent = "Calificaciones";
        sub1.href = enlacesCalificaciones[aulaNombre] || "#";

        const sub2 = document.createElement("a");
        sub2.className = "opcion-boton";
        sub2.textContent = "Registro";
        sub2.href = enlacesRegistro[aulaNombre] || "#";

        const sub3 = document.createElement("a");
        sub3.className = "opcion-boton";
        sub3.textContent = "Asistencia";
        sub3.href = enlacesAsistencia[aulaNombre] || "#";

        opciones.appendChild(sub1);
        opciones.appendChild(sub2);
        opciones.appendChild(sub3);

        diaItem.appendChild(opciones);

        bloque.appendChild(diaItem);
      }
    } else {
      const diaItem = document.createElement("div");
      diaItem.className = "dia-item";
      diaItem.dataset.dia = diaSel;

      const aulaNombre = aulas[diaSel][i];
      const enlace = document.createElement("a");
      enlace.className = "aula-boton";
      enlace.href = enlacesAulas[aulaNombre] || "#";
      enlace.textContent = aulaNombre;

      diaItem.appendChild(enlace);

      // 📌 botones secundarios
      const opciones = document.createElement("div");
      opciones.className = "opciones-aula";

      const sub1 = document.createElement("a");
      sub1.className = "opcion-boton";
      sub1.textContent = "Calificaciones";
      sub1.href = enlacesCalificaciones[aulaNombre] || "#";

      const sub2 = document.createElement("a");
      sub2.className = "opcion-boton";
      sub2.textContent = "Registro";
      sub2.href = enlacesRegistro[aulaNombre] || "#";

      const sub3 = document.createElement("a");
      sub3.className = "opcion-boton";
      sub3.textContent = "Asistencia";
      sub3.href = enlacesAsistencia[aulaNombre] || "#";

      opciones.appendChild(sub1);
      opciones.appendChild(sub2);
      opciones.appendChild(sub3);

      diaItem.appendChild(opciones);

      bloque.appendChild(diaItem);
    }

    agenda.appendChild(bloque);
  });

  resaltarHora();
  attachContextHandlers();
  cargarNotas();
}

// ---------------------------
// Resto del código (resaltado, notas, controles...)
// ---------------------------
// ⚠️ Aquí mantenemos igual todo lo que ya tenías:
// - resaltarHora()
// - actualizarMensaje()
// - attachContextHandlers()
// - cargarNotas(), guardarNota()
// - cargarNotasLocal(), guardarNotaLocal()
// - inicialización DOMContentLoaded
// ---------------------------


// ---------------------------
// Resaltar hora actual
// ---------------------------
function resaltarHora(){
  const ahora = new Date();
  const actual = ahora.getHours()*60 + ahora.getMinutes();
  document.querySelectorAll(".bloque").forEach(b => b.classList.remove("hora-actual"));
  horas.forEach((r,i)=>{
    if(actual >= toMin(r[0]) && actual < toMin(r[1])){
      const b = document.querySelector(`.bloque[data-fila='${i}']`);
      if(b) b.classList.add("hora-actual");
    }
  });
}
setInterval(resaltarHora, 60000);

// ---------------------------
// CONTROLES / MENSAJE
// ---------------------------
function actualizarMensaje(diaSel, fecha=null){
  const m = document.getElementById("mensaje-dia");
  if(!m) return;
  if(diaSel === "todos"){
    m.textContent = "Mostrando agenda completa";
  } else {
    let texto = `Mostrando agenda del ${diaNombre(Number(diaSel))}`;
    if(fecha){
      const opts = { day:"numeric", month:"long", year:"numeric" };
      texto += ` (${fecha.toLocaleDateString("es-ES", opts)})`;
    }
    m.textContent = texto;
  }
}

// ---------------------------
// HANDLERS: contexto para cada dia-item
// ---------------------------
function attachContextHandlers(){
  // eliminar handlers previos (si hay)
  document.querySelectorAll(".dia-item").forEach(item => {
    item.oncontextmenu = null;
  });

  // asignar nuevo handler
  document.querySelectorAll(".dia-item").forEach(item => {
    item.addEventListener("contextmenu", async ev => {
      ev.preventDefault();
      const dia = item.dataset.dia;                 // 1..5
      const fila = item.closest(".bloque").dataset.fila;
      // nota actual (si existe)
      const existente = item.querySelector(".nota")?.textContent || "";
      const nueva = prompt(`Nota para ${diaNombre(Number(dia))} — ${horas[fila][0]}:`, existente);
      if(nueva === null) return; // cancel
      if(!isApiConfigured()){
        // fallback a localStorage
        guardarNotaLocal(Number(fila), Number(dia), nueva.trim());
        await cargarNotasLocal();
        return;
      }
      await guardarNota(Number(fila), Number(dia), nueva.trim());
    });
  });
}

// ---------------------------
// NOTAS: compatibilidad API <-> DOM
// ---------------------------

// cargar notas (desde Google Sheets si API_URL configurada; sino desde localStorage)
async function cargarNotas(){
  if(!isApiConfigured()){
    return cargarNotasLocal();
  }

  try{
    const res = await fetch(API_URL);
    const notas = await res.json(); // espera [{fila: "0", dia: "1", nota:"..."}, ...]

    // limpiar notas previas
    document.querySelectorAll(".nota").forEach(n => n.remove());

    const filtro = document.getElementById("filtro-dia")?.value || "todos";

    notas.forEach(n => {
      // n.fila, n.dia, n.nota (pueden venir como strings)
      const fila = String(n.fila);
      const dia  = String(n.dia);
      const texto = n.nota;

      // Buscar el dia-item correspondiente
      const selector = `.bloque[data-fila='${fila}'] .dia-item[data-dia='${dia}']`;
      const diaItem = document.querySelector(selector);

      if(!diaItem) return; // no existe la celda visible (ej. notas con dia=2 pero estás mostrando solo dia=3)

      if(texto && texto.trim() !== ""){
        const d = document.createElement("div");
        d.className = "nota";
        d.textContent = texto;
        diaItem.appendChild(d);
      }
    });
  }catch(err){
    console.error("Error cargando notas (API):", err);
  }
}

// guardar nota en Google Sheets via API
async function guardarNota(fila, dia, nota){
  // si nota vacía -> borrar (en Apps Script actualmente se guarda vacía; podrías ajustar para borrar fila)
  try{
    await fetch(API_URL, {
      method: "POST",
      body: JSON.stringify({ fila, dia, nota })
    });
    await cargarNotas();
  }catch(err){
    console.error("Error guardando nota (API):", err);
    alert("No se pudo guardar la nota en el servidor (revisa consola).");
  }
}

// ---------------------------
// FALLBACK: localStorage (si no hay API_URL)
// ---------------------------
function keyLocal(fila, dia){ return `nota_f${fila}_d${dia}`; }

function guardarNotaLocal(fila, dia, nota){
  if(!nota || nota.trim() === "") {
    localStorage.removeItem(keyLocal(fila,dia));
  } else {
    localStorage.setItem(keyLocal(fila,dia), nota.trim());
  }
  console.log("Nota guardada localmente:", fila, dia, nota);
}

async function cargarNotasLocal(){
  // limpiar previas
  document.querySelectorAll(".nota").forEach(n => n.remove());

  document.querySelectorAll(".bloque").forEach(b => {
    const fila = b.dataset.fila;
    // buscar cada dia-item dentro del bloque
    b.querySelectorAll(".dia-item").forEach(di => {
      const dia = di.dataset.dia;
      const k = keyLocal(fila, dia);
      const nota = localStorage.getItem(k);
      if(nota){
        const d = document.createElement("div");
        d.className = "nota";
        d.textContent = nota;
        di.appendChild(d);
      }
    });
  });
}

// ---------------------------
// DOMContentLoaded: inicialización y listeners
// ---------------------------
window.addEventListener("DOMContentLoaded", ()=>{
  // controles
  const filtro = document.getElementById("filtro-dia");
  const btnTodos = document.getElementById("btn-todos");
  const selectorFecha = document.getElementById("selector-fecha");
  const btnDark = document.getElementById("toggle-dark");

  // eventos
  filtro?.addEventListener("change", e => {
    const val = e.target.value;
    generarAgenda(val);
    actualizarMensaje(val);
  });

  btnTodos?.addEventListener("click", ()=>{
    if(filtro) filtro.value = "todos";
    generarAgenda("todos");
    actualizarMensaje("todos");
  });

  selectorFecha?.addEventListener("change", e=>{
    if(!e.target.value) return;
    const [y,m,d] = e.target.value.split("-").map(Number);
    const fecha = new Date(y, m-1, d);
    const dia = fecha.getDay();
    if(dia >=1 && dia <=5){
      if(filtro) filtro.value = dia;
      generarAgenda(dia);
      actualizarMensaje(dia, fecha);
    } else {
      if(filtro) filtro.value = "todos";
      generarAgenda("todos");
      actualizarMensaje("todos", fecha);
    }
  });

  // modo oscuro persistente
  if(localStorage.getItem("modoOscuro") === "true"){
    document.body.classList.add("dark");
    if(btnDark) btnDark.textContent = "☀️";
  }
  btnDark?.addEventListener("click", ()=>{
    document.body.classList.toggle("dark");
    const oscuro = document.body.classList.contains("dark");
    btnDark.textContent = oscuro ? "☀️" : "🌙";
    localStorage.setItem("modoOscuro", oscuro ? "true" : "false");
  });

  // fecha inicial y generación
  const hoy = new Date();
  const yyyy = hoy.getFullYear();
  const mm = String(hoy.getMonth()+1).padStart(2,"0");
  const dd = String(hoy.getDate()).padStart(2,"0");
  if(selectorFecha) selectorFecha.value = `${yyyy}-${mm}-${dd}`;

  const diaHoy = hoy.getDay();
  if(diaHoy >=1 && diaHoy <=5){
    if(filtro) filtro.value = diaHoy;
    generarAgenda(diaHoy);
    actualizarMensaje(diaHoy, hoy);
  } else {
    if(filtro) filtro.value = "todos";
    generarAgenda("todos");
    actualizarMensaje("todos", hoy);
  }

  // si no hay API configurada, avisamos (solo una vez)
  if(!isApiConfigured()){
    console.warn("API_URL no configurada: acciones de notas usarán localStorage hasta que pegues la URL de Apps Script.");
  }
});

