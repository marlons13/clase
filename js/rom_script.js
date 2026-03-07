const puzzle = document.getElementById('puzzle');
const cols = 6;
const rows = 4;
const totalPieces = cols * rows;
let pieces = [];

function crearPiezas() {
  pieces = [];

  for (let i = 0; i < totalPieces; i++) {
    const piece = document.createElement('div');
    piece.classList.add('piece');
    piece.draggable = true;

    const x = i % cols;
    const y = Math.floor(i / cols);
    piece.style.backgroundPosition = `-${x * 150}px -${y * 150}px`;
    piece.dataset.index = i;

    pieces.push(piece);
  }

  pieces = pieces.sort(() => Math.random() - 0.5);
  pieces.forEach((p, i) => {
    p.style.animationDelay = `${i * 0.05}s`;
    puzzle.appendChild(p);
  });

  addDragEvents();
}

function addDragEvents() {
  document.querySelectorAll('.piece').forEach(p => {
    p.addEventListener('dragstart', e => {
      dragged = e.target;
    });
  });
}

let dragged;

puzzle.addEventListener('dragover', e => {
  e.preventDefault();
});

puzzle.addEventListener('drop', e => {
  const target = e.target;
  if (target.classList.contains('piece') && target !== dragged) {
    const draggedClone = dragged.cloneNode(true);
    const targetClone = target.cloneNode(true);

    puzzle.replaceChild(draggedClone, target);
    puzzle.replaceChild(targetClone, dragged);

    addDragEvents();
    checkWin();
  }
});

function checkWin() {
  const current = [...puzzle.children];
  const isCorrect = current.every((el, index) => el.dataset.index == index);
  if (isCorrect) {
    puzzle.innerHTML = '';
    document.getElementById('win-screen').classList.remove('hidden');

    // Lanzar confetti 🎉
    confetti({
      particleCount: 150,
      spread: 100,
      origin: { y: 0.6 }
    });
  }
}

document.getElementById('restart-btn').addEventListener('click', () => {
  document.getElementById('win-screen').classList.add('hidden');
  puzzle.innerHTML = '';
  crearPiezas();
});

crearPiezas();
