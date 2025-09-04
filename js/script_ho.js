// ⚡ URL de tu Apps Script publicado
const API_URL = "https://script.google.com/macros/s/AKfycbw1mS8LPlBvzBq0AJzx4fUIzGJ5--0s-L5Pf5Ya2m1xuBMZuk7-Ympt8CZZ4JeVEDTC1w/exec";

// ⏰ Definir bloques horarios
const horas = [
  ["08:00","08:50"],
  ["08:50","09:40"],
  ["10:10","11:00"],
  ["11:00","11:50"],
  ["11:50","12:40"],
  ["13:10","14:00"],
  ["14:00","14:50"]
];

const aMin = h => parseInt(h.split(":")[0])*60 + parseInt(h.split(":")[1]);

// 📌 Resaltar el día actual
marcarDia(new Date().getDay());

// 📌 Resaltar la hora actual
function resaltarHora(){
  const ahora = new Date();
  const actual = ahora.getHours()*60 + ahora.getMinutes();
  const filas = document.querySelectorAll("#tabla-horario tbody tr");

  filas.forEach(fila => {
    fila.querySelectorAll("td").forEach(td => td.classList.remove("hora-actual"));
  });

  horas.forEach((r,i)=>{
    const ini = aMin(r[0]), fin = aMin(r[1]);
    if(actual >= ini && actual < fin){
      filas[i].querySelectorAll("td").forEach(td => td.classList.add("hora-actual"));
    }
  });
}
resaltarHora();
setInterval(resaltarHora,60000);

// 📌 Botón flotante → Ir a la hora actual
function irAHoraActual(){
  const activa = document.querySelector(".hora-actual");
  if(activa) activa.scrollIntoView({behavior:"smooth", block:"center"});
}

// 📌 Mostrar mensaje dinámico
function actualizarMensaje(diaSemana, fecha=null){
  const mensaje = document.getElementById("mensaje-dia");
  const dias = ["Domingo","Lunes","Martes","Miércoles","Jueves","Viernes","Sábado"];

  if(diaSemana >= 1 && diaSemana <= 5){
    let texto = `Mostrando horario del ${dias[diaSemana]}`;
    if(fecha){
      const opciones = { day:"numeric", month:"long", year:"numeric" };
      texto += ` (${fecha.toLocaleDateString("es-ES", opciones)})`;
    }
    mensaje.textContent = texto;
  } else {
    mensaje.textContent = "Mostrando horario completo";
  }
}

// 📌 Filtro de día
function mostrarDia(val){
  const filas = document.querySelectorAll("#tabla-horario tbody tr");
  const cabeceras = document.querySelectorAll("#tabla-horario thead th");

  if(val === "todos"){
    cabeceras.forEach(th => th.style.display = "");
    filas.forEach(fila=>{
      fila.querySelectorAll("td").forEach(td => td.style.display = "");
    });
    actualizarMensaje(0);
    return;
  }

  const colSeleccionada = parseInt(val);

  cabeceras.forEach((th,i)=>{
    if(i === 0){ 
      th.style.display = "";
    }else{
      th.style.display = (i === colSeleccionada) ? "" : "none";
    }
  });

  filas.forEach(fila=>{
    fila.querySelectorAll("td").forEach((td,j)=>{
      if(j === 0){
        td.style.display = "";
      }else{
        td.style.display = (j === colSeleccionada) ? "" : "none";
      }
    });
  });

  actualizarMensaje(colSeleccionada);
}
document.getElementById("filtro-dia").addEventListener("change",e=>{
  mostrarDia(e.target.value);
});

// 📌 Botón "Mostrar todos"
document.getElementById("btn-todos").addEventListener("click",()=>{
  document.getElementById("filtro-dia").value="todos";
  mostrarDia("todos");
});

// 📌 Selector de fecha (sincronizado con filtro de día)
document.getElementById("selector-fecha").addEventListener("change",e=>{
  if(!e.target.value) return;
  const [anio,mes,dia] = e.target.value.split("-").map(Number);
  const fecha = new Date(anio,mes-1,dia);
  const diaSemana = fecha.getDay();
  marcarDia(diaSemana);

  if(diaSemana >= 1 && diaSemana <= 5){
    document.getElementById("filtro-dia").value = diaSemana;
    mostrarDia(String(diaSemana));
  } else {
    document.getElementById("filtro-dia").value = "todos";
    mostrarDia("todos");
  }

  actualizarMensaje(diaSemana, fecha);
});

// 📌 Marcar día
function marcarDia(dia){
  document.querySelectorAll("#tabla-horario tr td, #tabla-horario tr th")
          .forEach(c=>c.classList.remove("dia-actual"));

  if(dia>=1 && dia<=5){
    document.querySelectorAll("#tabla-horario tr").forEach(f=>{
      const cel = f.querySelectorAll("td,th")[dia];
      if(cel) cel.classList.add("dia-actual");
    });
  }
}

// 📌 ================== Notas rápidas con Google Sheets ==================
async function cargarNotas(){
  try{
    const res = await fetch(API_URL);
    const notas = await res.json();

    // limpiar todas las notas
    document.querySelectorAll(".nota").forEach(n=>n.remove());

    notas.forEach(n=>{
      const td = document.querySelector(
        `#tabla-horario tbody tr:nth-child(${parseInt(n.fila)+1}) td:nth-child(${parseInt(n.columna)+1})`
      );
      if(td){
        const aula = td.querySelector(".aula-boton");
        if(aula && n.nota){
          const d = document.createElement("div");
          d.className = "nota";
          d.textContent = n.nota;
          aula.appendChild(d);
        }
      }
    });
  }catch(err){
    console.error("Error cargando notas:",err);
  }
}

async function guardarNota(fila,columna,nota){
  try{
    await fetch(API_URL,{
      method:"POST",
      body: JSON.stringify({fila,columna,nota})
    });
    await cargarNotas();
  }catch(err){
    console.error("Error guardando nota:",err);
  }
}

// Asignar clic derecho a cada celda
const filasTB = document.querySelectorAll("#tabla-horario tbody tr");
filasTB.forEach((tr,r)=>{
  const celdas = tr.querySelectorAll("td");
  for(let c=1; c<celdas.length; c++){
    const td = celdas[c];
    td.addEventListener("contextmenu",async ev=>{
      ev.preventDefault();
      const aula = td.querySelector(".aula-boton");
      if(!aula) return;
      const fila = r;   // índice de fila
      const columna = c; // índice de columna
      const actual = aula.querySelector(".nota")?.textContent || "";
      const nueva = prompt("Escribe una nota (vacío para borrar):", actual);
      if(nueva === null) return;
      await guardarNota(fila,columna,nueva.trim());
    });
  }
});

// 📌 Recordatorio automático
setInterval(()=>{
  const ahora = new Date();
  const actual = ahora.getHours()*60 + ahora.getMinutes();
  horas.forEach(r=>{
    const ini = aMin(r[0]);
    if(actual === ini-5){
      alert("⏰ Próxima clase en 5 minutos: " + r[0] + " - " + r[1]);
    }
  });
},60000);

// 📌 🌙 Modo oscuro
const btnDark = document.getElementById("toggle-dark");
if(localStorage.getItem("modoOscuro")==="true"){
  document.body.classList.add("dark");
  btnDark.textContent="☀️";
}
btnDark.addEventListener("click",()=>{
  document.body.classList.toggle("dark");
  const oscuro=document.body.classList.contains("dark");
  btnDark.textContent = oscuro ? "☀️" : "🌙";
  localStorage.setItem("modoOscuro", oscuro);
});

// 📌 Fecha actual automática
window.addEventListener("DOMContentLoaded",()=>{
  const hoy = new Date();
  const yyyy = hoy.getFullYear();
  const mm = String(hoy.getMonth()+1).padStart(2,"0");
  const dd = String(hoy.getDate()).padStart(2,"0");
  document.getElementById("selector-fecha").value = `${yyyy}-${mm}-${dd}`;

  const diaSemana = hoy.getDay();
  marcarDia(diaSemana);

  if(diaSemana >= 1 && diaSemana <= 5){
    document.getElementById("filtro-dia").value = diaSemana;
    mostrarDia(String(diaSemana));
  } else {
    document.getElementById("filtro-dia").value = "todos";
    mostrarDia("todos");
  }

  actualizarMensaje(diaSemana, hoy);

  // cargar notas iniciales desde Sheets
  cargarNotas();
});
