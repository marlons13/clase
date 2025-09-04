// ---------------------------
// CONFIG
// ---------------------------

// URL de tu Apps Script (pon aquí tu URL)
const API_URL = "https://script.google.com/macros/s/AKfycbxT-jWMtNJoVgcqR15LKCXnsSGvBnqyOeERldNSOrNx-nk9GGGmuIuZe2V80vc92Pz4GA/exec";

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

// Enlaces por aula (ajusta rutas luego)
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
    bloque.dataset.fila = i; // clave fila

    // hora
    const h = document.createElement("div");
    h.className = "hora";
    h.textContent = `${r[0]} - ${r[1]}`;
    bloque.appendChild(h);

    // si mostramos todos los días: creamos un .dia-item por cada día
    if(diaSel === "todos"){
      for(let d=1; d<=5; d++){
        const diaItem = document.createElement("div");
        diaItem.className = "dia-item";
        diaItem.dataset.dia = d;

        const label = document.createElement("span");
        label.className = "dia";
        label.textContent = `${diaNombre(d)}: `;

        const aulaNombre = aulas[d][i];
        const enlace = document.createElement("a");
        enlace.className = "aula-boton";
        enlace.href = enlacesAulas[aulaNombre] || "#";
        enlace.textContent = aulaNombre;
        enlace.setAttribute("aria-label", `${aulaNombre} - ${diaNombre(d)} ${r[0]}-${r[1]}`);

        diaItem.appendChild(label);
        diaItem.appendChild(enlace);
        bloque.appendChild(diaItem);
      }
    } else {
      // vista por día: un solo dia-item por bloque
      const diaItem = document.createElement("div");
      diaItem.className = "dia-item";
      diaItem.dataset.dia = diaSel;

      const aulaNombre = aulas[diaSel][i];
      const enlace = document.createElement("a");
      enlace.className = "aula-boton";
      enlace.href = enlacesAulas[aulaNombre] || "#";
      enlace.textContent = aulaNombre;
      enlace.setAttribute("aria-label", `${aulaNombre} - ${diaNombre(diaSel)} ${r[0]}-${r[1]}`);

      diaItem.appendChild(enlace);
      bloque.appendChild(diaItem);
    }

    agenda.appendChild(bloque);
  });

  // una vez que la agenda está en el DOM:
  resaltarHora();
  attachContextHandlers(); // para cada .dia-item
  cargarNotas(); // carga notas (desde API o local)
}

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




