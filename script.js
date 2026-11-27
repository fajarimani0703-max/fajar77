const tombol = document.getElementById('tombolKabur');
const hitung = document.getElementById('hitung');

const JARAK_PICU = 120;   // kursor sedekat ini -> tombol kabur (px)
const JARAK_MINIMAL = 250; // posisi baru minimal sejauh ini dari kursor (px)

let posisi = { x: 0, y: 0 }; // posisi tujuan tombol (pojok kiri atas)
let jumlahKabur = 0;

function jarak(x1, y1, x2, y2) {
  return Math.hypot(x1 - x2, y1 - y2);
}

function setPosisi(x, y) {
  posisi = { x, y };
  tombol.style.left = x + 'px';
  tombol.style.top = y + 'px';
}

function pindahkan(kursorX, kursorY) {
  const lebar = tombol.offsetWidth;
  const tinggi = tombol.offsetHeight;
  const maxX = window.innerWidth - lebar;
  const maxY = window.innerHeight - tinggi;

  let x, y;
  let percobaan = 0;

  // Acak posisi sampai cukup jauh dari kursor (maksimal 30 kali coba)
  do {
    x = Math.random() * maxX;
    y = Math.random() * maxY;
    percobaan++;
  } while (
    jarak(x + lebar / 2, y + tinggi / 2, kursorX, kursorY) < JARAK_MINIMAL &&
    percobaan < 30
  );

  setPosisi(x, y);
  jumlahKabur++;
  hitung.textContent = jumlahKabur;
}

// Event 1: kursor mendekat -> kabur sebelum sempat menyentuh tombol
document.addEventListener('mousemove', (e) => {
  const pusatX = posisi.x + tombol.offsetWidth / 2;
  const pusatY = posisi.y + tombol.offsetHeight / 2;

  if (jarak(pusatX, pusatY, e.clientX, e.clientY) < JARAK_PICU) {
    pindahkan(e.clientX, e.clientY);
  }
});

// Event 2: layar sentuh (tidak ada mousemove di HP)
tombol.addEventListener('touchstart', (e) => {
  e.preventDefault();
  const sentuh = e.touches[0];
  pindahkan(sentuh.clientX, sentuh.clientY);
}, { passive: false });

// Event 3: klik lewat keyboard (Tab lalu Enter/Spasi)
tombol.addEventListener('click', (e) => {
  e.preventDefault();
  pindahkan(-9999, -9999);
});

// Event 4: jaga tombol tetap di dalam layar saat ukuran jendela berubah
window.addEventListener('resize', () => {
  const maxX = window.innerWidth - tombol.offsetWidth;
  const maxY = window.innerHeight - tombol.offsetHeight;
  setPosisi(Math.min(posisi.x, maxX), Math.min(posisi.y, maxY));
});

// Posisi awal: tengah layar
setPosisi(
  (window.innerWidth - tombol.offsetWidth) / 2,
  (window.innerHeight - tombol.offsetHeight) / 2
);