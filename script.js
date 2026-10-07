const MODE_UJI = false;

const WAKTU_TARGET = new Date(2026, 9, 8, 0, 50, 0); // 8 Oktober 2026, 00:50:00

const PESAN_KETIK = [
  "Hai Mine!",
  "Sebentar lagi 22 nih…",
  "Deg-degan nggak nungguin?",
  "Apapun yang terjadi di usia baru,",
  "Ingat! Mine hebat sudah bertahan 💛"
];

const LACAK = [
  { file: "Selamat Ulang Tahun.mp3", judul: "Gellen Martadinata" },
  { file: "Bergema Sampai Selamanya.mp3", judul: "Nadhif Basalamah" },
  { file: "Masa ini, Nanti, dan Masa Indah Lainnya.mp3", judul: "Raja Giannuca" }
];

const FOTO_DIA = ["dia1.jpg", "dia2.jpg", "dia3.jpg", "dia4.jpg", "dia5.jpg", "dia6.jpg"];
const EMOJI_CINTA    = ["💛", "💛", "💛", "💖", "✨", "💫"];
const WARNA_BALON    = ["#FFD34D", "#FFC233", "#FFE58A", "#F9B208", "#FFF3B8"];
const WARNA_CONFETTI = ["#FFD34D", "#F5B921", "#E8912C", "#FFF7DC", "#FFE58A", "#F9A826", "#FFC7A8"];
const WARNA_PIJAR    = ["#FFD34D", "#FFF3B8", "#FF9F43", "#FFE58A", "#FFFDF4"];
const EMOJI_CONFETTI = ["🎉", "✨", "💛", "🎂"];

const $ = (id) => document.getElementById(id);
const musikTunggu = $("musikTunggu");
const musikUtama  = $("musikUtama");

let trekAktif = 0;
let fileAktif = "";
let sudahLilin = false;
let sudahDitiup = false;
let kejutanDimulai = false;
let sentuhTerakhir = 0;

function tampilanSisa(sisaMs){
  const total = Math.max(0, Math.floor(sisaMs / 1000));
  const jam   = Math.floor(total / 3600);
  const menit = Math.floor((total % 3600) / 60);
  const detik = total % 60;
  $("nilaiJam").textContent   = String(jam).padStart(2, "0");
  $("nilaiMenit").textContent = String(menit).padStart(2, "0");
  $("nilaiDetik").textContent = String(detik).padStart(2, "0");
}

function mulaiHitungMundur(){
  const idInterval = setInterval(() => {
    const sisa = WAKTU_TARGET - Date.now();
    if (sisa <= 0){
      clearInterval(idInterval);
      tampilanSisa(0);
      if (!sudahLilin){ sudahLilin = true; gantiLayer("layerLilin"); }
      return;
    }
    tampilanSisa(sisa);
  }, 250);
}

function gantiLayer(idTarget){
  const aktif  = document.querySelector(".layer.aktif");
  const target = $(idTarget);
  if (!target) return;
  if (!aktif || aktif === target){
    target.classList.add("aktif");
    document.body.dataset.layer = target.dataset.nama;
    return;
  }
  aktif.classList.add("keluar");
  setTimeout(() => {
    aktif.classList.remove("aktif", "keluar", "masuk");
    target.classList.add("aktif", "masuk");
    document.body.dataset.layer = target.dataset.nama;
    setTimeout(() => target.classList.remove("masuk"), 1600);
  }, 500);
}

let idxPesan = 0, idxHuruf = 0, sedangHapus = false;
function langkahKetik(){
  if (document.body.dataset.layer !== "tunggu") return;
  const el = $("teksKetik");
  const pesan = PESAN_KETIK[idxPesan];

  if (!sedangHapus){
    idxHuruf++;
    el.textContent = pesan.slice(0, idxHuruf);
    if (idxHuruf >= pesan.length){
      sedangHapus = true;
      setTimeout(langkahKetik, 2600);
      return;
    }
    setTimeout(langkahKetik, 42 + Math.random() * 42);
  } else {
    idxHuruf = Math.max(0, idxHuruf - 2);
    el.textContent = pesan.slice(0, idxHuruf);
    if (idxHuruf === 0){
      sedangHapus = false;
      idxPesan = (idxPesan + 1) % PESAN_KETIK.length;
      setTimeout(langkahKetik, 480);
      return;
    }
    setTimeout(langkahKetik, 18);
  }
}

function letupCinta(x, y){
  const jumlah = 7 + Math.floor(Math.random() * 4);
  for (let i = 0; i < jumlah; i++){
    const s = document.createElement("span");
    s.className = "hati-letup";
    s.textContent = EMOJI_CINTA[Math.floor(Math.random() * EMOJI_CINTA.length)];
    s.style.left = x + "px";
    s.style.top  = y + "px";
    s.style.fontSize = (14 + Math.random() * 18) + "px";
    s.style.setProperty("--dx", (Math.random() * 170 - 85) + "px");
    s.style.setProperty("--dy", (-(90 + Math.random() * 150)) + "px");
    s.style.setProperty("--rot", (Math.random() * 100 - 50) + "deg");
    s.style.setProperty("--tunda", (Math.random() * 0.16) + "s");
    document.body.appendChild(s);
    s.addEventListener("animationend", () => s.remove());
  }
}

function pasangLoveBurst(){
  const zona = $("layerTunggu");
  zona.addEventListener("touchstart", (e) => {
    if (document.body.dataset.layer !== "tunggu") return;
    sentuhTerakhir = Date.now();
    const t = e.touches[0];
    if (t) letupCinta(t.clientX, t.clientY);
  }, { passive: true });

  zona.addEventListener("click", (e) => {
    if (document.body.dataset.layer !== "tunggu") return;
    if (Date.now() - sentuhTerakhir < 700) return;
    letupCinta(e.clientX, e.clientY);
  });
}

function pasangTombolMusik(){
  const tombol = $("tombolMusik");
  tombol.addEventListener("click", () => {
    if (musikTunggu.paused){
      musikTunggu.volume = 0.85;
      musikTunggu.play()
        .then(() => { tombol.textContent = "Jeda Musik"; })
        .catch(() => toast("⚠️ File tunggu.mp3 belum ada di folder projek."));
    } else {
      musikTunggu.pause();
      tombol.textContent = "Nyalakan Musik";
    }
  });
}

const TIUP_DURASI = 2000;   // lama menahan jari (milidetik)
let tiupMulai = 0, tiupRaf = null, sedangMeniup = false, kueSentuhTerakhir = 0;

function percikan(x, y, jumlah, jarakMin, jarakMaks){
  const frag = document.createDocumentFragment();
  for (let i = 0; i < jumlah; i++){
    const p = document.createElement("span");
    p.className = "pijar";
    const sudut = Math.random() * Math.PI * 2;
    const jarak = jarakMin + Math.random() * (jarakMaks - jarakMin);
    p.style.setProperty("--x", x + "px");
    p.style.setProperty("--y", y + "px");
    p.style.setProperty("--dx", (Math.cos(sudut) * jarak) + "px");
    p.style.setProperty("--dy", (Math.sin(sudut) * jarak) + "px");
    p.style.setProperty("--warna", WARNA_PIJAR[Math.floor(Math.random() * WARNA_PIJAR.length)]);
    p.addEventListener("animationend", () => p.remove());
    frag.appendChild(p);
  }
  document.body.appendChild(frag);
}

function kembangApi(){
  const l = window.innerWidth, t = window.innerHeight;
  setTimeout(() => percikan(l * 0.5,  t * 0.26, 46, 50, 185), 150);
  setTimeout(() => percikan(l * 0.24, t * 0.2,  38, 44, 160), 520);
  setTimeout(() => percikan(l * 0.78, t * 0.22, 38, 44, 160), 880);
  setTimeout(() => percikan(l * 0.5,  t * 0.42, 42, 50, 180), 1180);
}

function pasangKue(){
  const kue = $("kueUltah");
  const cincin = kue.querySelector(".cincin");

  function ulangiTiup(){
    tiupRaf = requestAnimationFrame(() => {
      if (!sedangMeniup) return;
      const p = Math.min(1, (Date.now() - tiupMulai) / TIUP_DURASI);
      cincin.style.setProperty("--progres", (p * 100).toFixed(1));
      kue.style.setProperty("--tiup", (1 - p).toFixed(3));
      if (p >= 1){ selesaiTiup(); } else { ulangiTiup(); }
    });
  }

  function mulaiTiup(){
    if (sudahDitiup || sedangMeniup) return;
    sedangMeniup = true;
    tiupMulai = Date.now();
    kue.classList.add("menahan", "ditiup");
    $("teksTiup").textContent = "";
    ulangiTiup();
  }

  function batalTiup(){
    if (sudahDitiup || !sedangMeniup) return;
    sedangMeniup = false;
    cancelAnimationFrame(tiupRaf);
    kue.classList.remove("menahan", "ditiup");
    cincin.style.setProperty("--progres", 0);
    kue.style.setProperty("--tiup", 1);
    $("teksTiup").textContent = "eits, jangan dilepas! tahan terus 😤";
  }

  function selesaiTiup(){
    sedangMeniup = false;
    sudahDitiup = true;
    cancelAnimationFrame(tiupRaf);
    kue.classList.remove("menahan", "ditiup");
    kue.classList.add("padam");
    $("teksTiup").textContent = "fiuuuh… permohonan terkunci";
    kembangApi();

    musikTunggu.pause();
    putarTrek(0, false);   // siapkan lagu1 tanpa paksa play di sini
    musikUtama.play().catch(() => {});

    setTimeout(mulaiKejutan, 1400);
  }

  kue.addEventListener("touchstart", (e) => {
    e.preventDefault();
    kueSentuhTerakhir = Date.now();
    mulaiTiup();
  }, { passive: false });
  kue.addEventListener("touchend", batalTiup);
  kue.addEventListener("touchcancel", batalTiup);

  kue.addEventListener("mousedown", () => {
    if (Date.now() - kueSentuhTerakhir < 700) return;
    mulaiTiup();
  });
  window.addEventListener("mouseup", () => {
    if (Date.now() - kueSentuhTerakhir < 700) return;
    batalTiup();
  });
}

function sapaanSekarang(){
  const j = new Date().getHours();
  if (j >= 4 && j < 11)  return "selamat pagi mine!";
  if (j >= 11 && j < 15) return "selamat siang mine!";
  if (j >= 15 && j < 18) return "selamat sore mine!";
  return "selamat malam mine!";
}

function mulaiKejutan(){
  if (kejutanDimulai) return;
  kejutanDimulai = true;

  $("sapaanHeader").textContent = sapaanSekarang();
  gantiLayer("layerKejutan");
  tebarBalon(26);
  musikUtama.play().catch(() => {
    document.addEventListener("touchstart", function pancing(){
      musikUtama.play().catch(() => {});
      document.removeEventListener("touchstart", pancing);
    }, { once: true, passive: true });
  });
}

function tebarBalon(jumlah){
  const wadah = $("wadahBalon");
  if (wadah.childElementCount > 0) return;
  for (let i = 0; i < jumlah; i++){
    const b = document.createElement("div");
    b.className = "balon";
    b.innerHTML = '<span class="balon-isi"></span>';
    b.style.setProperty("--x", (Math.random() * 94) + "%");
    b.style.setProperty("--goyang", (Math.random() * 80 - 40) + "px");
    b.style.setProperty("--skala", (0.6 + Math.random() * 0.7).toFixed(2));
    b.style.setProperty("--durasi", (8 + Math.random() * 6) + "s");
    b.style.setProperty("--tunda", (-(Math.random() * 14)).toFixed(2) + "s");
    b.style.setProperty("--warna", WARNA_BALON[Math.floor(Math.random() * WARNA_BALON.length)]);
    wadah.appendChild(b);
  }
}

function pasangMenu(){
  const menu = $("menuBawah");
  if (!menu) return;
  menu.addEventListener("click", (e) => {
    const tombol = e.target.closest(".menu-item");
    if (!tombol || tombol.classList.contains("aktif")) return;

    menu.querySelectorAll(".menu-item").forEach((m) =>
      m.classList.toggle("aktif", m === tombol)
    );

    const target = tombol.dataset.target;
    document.querySelectorAll("#layerKejutan .panel").forEach((p) =>
      p.classList.toggle("aktif", p.dataset.panel === target)
    );

    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

function pasangGridFoto(){
  const grid = $("gridFoto");
  if (!grid) return;

  FOTO_DIA.forEach((file, i) => {
    const fig = document.createElement("figure");
    fig.className = "bingkai-foto";
    fig.innerHTML = '<img src="' + file + '" alt="foto dia ' + (i + 1) + '" loading="lazy">';

    const img = fig.querySelector("img");
    img.addEventListener("error", function sekali(){
      img.removeEventListener("error", sekali);
      img.src = gambarCadangan(i + 1);
    });
    img.addEventListener("click", () => bukaFotoLayar(img.src));
    grid.appendChild(fig);
  });
}

function bukaFotoLayar(src){
  $("fotoLayarImg").src = src;
  $("fotoLayar").classList.add("tampil");
}

function pasangFotoLayar(){
  $("fotoLayar").addEventListener("click", () => {
    $("fotoLayar").classList.remove("tampil");
  });
}

const GALERI = { index: 0, jumlah: 6, auto: true, timer: null, jeda: 3800 };

function pasangGaleri(){
  const trek = $("galeriTrek");
  const galeri = $("galeri");
  const titikWadah = $("galeriTitik");
  const badgeJeda = $("galeriJeda");

  for (let i = 0; i < GALERI.jumlah; i++){
    const t = document.createElement("button");
    t.type = "button";
    t.className = "titik-foto" + (i === 0 ? " aktif" : "");
    t.setAttribute("aria-label", "foto " + (i + 1));
    t.addEventListener("click", () => { keSlide(i); ulangAuto(); });
    titikWadah.appendChild(t);
  }

  function posisi(){ return -(GALERI.index * (100 / GALERI.jumlah)); }

  function tandaiTitik(){
    titikWadah.querySelectorAll(".titik-foto").forEach((t, i) =>
      t.classList.toggle("aktif", i === GALERI.index)
    );
  }

  function keSlide(i){
    GALERI.index = (i + GALERI.jumlah) % GALERI.jumlah;
    trek.style.transform = "translate3d(" + posisi() + "%,0,0)";
    tandaiTitik();
  }

  function ulangAuto(){
    stopAuto();
    if (GALERI.auto){
      GALERI.timer = setInterval(() => keSlide(GALERI.index + 1), GALERI.jeda);
    }
  }
  function stopAuto(){
    if (GALERI.timer){ clearInterval(GALERI.timer); GALERI.timer = null; }
  }

  function toggleJeda(){
    GALERI.auto = !GALERI.auto;
    badgeJeda.classList.toggle("tampil", !GALERI.auto);
    ulangAuto();
  }

  let menyeret = false, bergerak = false, startX = 0, dragDx = 0, lebar = 0;

  galeri.addEventListener("pointerdown", (e) => {
    menyeret = true; bergerak = false;
    startX = e.clientX; dragDx = 0;
    lebar = galeri.clientWidth;
    trek.style.transition = "none";
    if (galeri.setPointerCapture) galeri.setPointerCapture(e.pointerId);
  });

  galeri.addEventListener("pointermove", (e) => {
    if (!menyeret) return;
    dragDx = e.clientX - startX;
    if (Math.abs(dragDx) > 6) bergerak = true;
    const persen = (dragDx / lebar) * 100;
    trek.style.transform = "translate3d(" + (posisi() + persen) + "%,0,0)";
  });

  function akhirSeret(){
    if (!menyeret) return;
    menyeret = false;
    trek.style.transition = "";
    if (Math.abs(dragDx) > 44){
      keSlide(GALERI.index + (dragDx < 0 ? 1 : -1));
    } else {
      keSlide(GALERI.index);
      if (!bergerak) toggleJeda();
    }
    dragDx = 0;
    ulangAuto();
  }
  galeri.addEventListener("pointerup", akhirSeret);
  galeri.addEventListener("pointercancel", () => {
    menyeret = false; dragDx = 0;
    trek.style.transition = "";
    keSlide(GALERI.index);
  });

  keSlide(0);
  ulangAuto();
}

const MEMO = { kunci: false, terbuka: [], cocok: 0, langkah: 0, total: 6 };

function perbaruiMemoStatus(){
  $("memoStatus").textContent =
    "Langkah: " + MEMO.langkah + " • Pasangan: " + MEMO.cocok + "/" + MEMO.total;
}

function buatPapan(){
  const papan = $("memoPapan");
  papan.innerHTML = "";
  MEMO.terbuka = []; MEMO.cocok = 0; MEMO.langkah = 0; MEMO.kunci = false;
  $("memoMenang").classList.remove("tampil");
  perbaruiMemoStatus();

  const daftar = [];
  for (let i = 1; i <= MEMO.total; i++){ daftar.push(i, i); }
  for (let i = daftar.length - 1; i > 0; i--){
    const j = Math.floor(Math.random() * (i + 1));
    [daftar[i], daftar[j]] = [daftar[j], daftar[i]];
  }

  daftar.forEach((n) => {
    const kartu = document.createElement("div");
    kartu.className = "kartu-memo";
    kartu.dataset.foto = n;
    kartu.innerHTML =
      '<div class="kartu-dalam">' +
        '<div class="kartu-muka kartu-belakang">22</div>' +
        '<div class="kartu-muka kartu-depan"><img src="foto' + n + '.jpg" data-nomor="' + n + '" alt="foto ' + n + '" draggable="false"></div>' +
      '</div>';
    kartu.addEventListener("click", () => bukaKartu(kartu));
    papan.appendChild(kartu);
  });

  papan.querySelectorAll(".kartu-depan img").forEach((img) => {
    img.addEventListener("error", function sekali(){
      img.removeEventListener("error", sekali);
      img.src = gambarCadangan(Number(img.dataset.nomor));
    });
  });
}

function bukaKartu(kartu){
  if (MEMO.kunci) return;
  if (kartu.classList.contains("buka") || kartu.classList.contains("cocok")) return;

  kartu.classList.add("buka");
  MEMO.terbuka.push(kartu);

  if (MEMO.terbuka.length === 2){
    MEMO.langkah++;
    MEMO.kunci = true;
    const [a, b] = MEMO.terbuka;

    if (a.dataset.foto === b.dataset.foto){
      setTimeout(() => {
        a.classList.add("cocok"); b.classList.add("cocok");
        a.classList.remove("buka"); b.classList.remove("buka");
        MEMO.terbuka = []; MEMO.cocok++; MEMO.kunci = false;
        perbaruiMemoStatus();
        if (MEMO.cocok === MEMO.total) menangMemo();
      }, 380);
    } else {
      setTimeout(() => {
        a.classList.remove("buka"); b.classList.remove("buka");
        MEMO.terbuka = []; MEMO.kunci = false;
      }, 850);
    }
    perbaruiMemoStatus();
  }
}

function menangMemo(){
  const menang = $("memoMenang");
  menang.classList.add("tampil");
  menang.scrollIntoView({ behavior: "smooth", block: "center" });
  setTimeout(() => {
    const r = menang.getBoundingClientRect();
    ledakkanConfetti(r.left + r.width / 2, r.top + 30, 90);
  }, 380);
}

function pasangMemo(){
  $("memoUlang").addEventListener("click", buatPapan);
  buatPapan();
}

function gambarDaftarLagu(){
  const wadah = $("daftarLagu");
  if (!wadah) return;
  const sedangMain = !musikUtama.paused && !musikUtama.ended;
  wadah.innerHTML = LACAK.map((t, i) => {
    const aktif = i === trekAktif;
    return `
    <button class="lagu${aktif ? " aktif" : ""}" data-indeks="${i}" type="button">
      <span class="lagu-status">${aktif && sedangMain ? "▶" : "♪"}</span>
      <span class="lagu-info"><strong>${t.judul}</strong><small>${t.file}</small></span>
    </button>`;
  }).join("");
  $("laguAktif").textContent = LACAK[trekAktif].judul;
}

function sinkronPiringan(){
  const jalan = !musikUtama.paused && !musikUtama.ended;
  document.body.classList.toggle("musik-jalan", jalan);
  gambarDaftarLagu();
}

function putarTrek(i){
  trekAktif = i;
  const file = LACAK[i].file;
  if (fileAktif !== file){
    musikUtama.src = file;
    fileAktif = file;
  }
  musikTunggu.pause();
  musikTunggu.currentTime = 0;
  musikUtama.volume = 1;
  musikUtama.play().catch(() => toast("⚠️ File " + file + " belum ada di folder projek."));
  sinkronPiringan();
}

function pasangPanelMusik(){
  // Ketuk piringan = putar / jeda
  $("piringanPanel").addEventListener("click", () => {
    if (musikUtama.paused){
      if (!fileAktif){ putarTrek(0); }
      else { musikUtama.play().catch(() => {}); }
    } else {
      musikUtama.pause();
    }
  });

  // Ketuk judul lagu = ganti lagu secara langsung
  $("daftarLagu").addEventListener("click", (e) => {
    const tombol = e.target.closest(".lagu");
    if (tombol) putarTrek(Number(tombol.dataset.indeks));
  });

  musikUtama.addEventListener("play", sinkronPiringan);
  musikUtama.addEventListener("pause", sinkronPiringan);
  musikUtama.addEventListener("ended", () => {
    if (document.body.dataset.layer === "kejutan"){
      putarTrek((trekAktif + 1) % LACAK.length);
    }
  });

  gambarDaftarLagu();
}

function tebarKilau(){
  const wadah = $("wadahKilau");
  for (let i = 0; i < 16; i++){
    const k = document.createElement("span");
    k.className = "kilau";
    k.textContent = "✦";
    k.style.left = (Math.random() * 96) + "%";
    k.style.top  = (Math.random() * 92) + "%";
    k.style.fontSize = (9 + Math.random() * 9) + "px";
    k.style.setProperty("--dur", (6 + Math.random() * 7) + "s");
    k.style.setProperty("--tunda", (-(Math.random() * 8)) + "s");
    wadah.appendChild(k);
  }
}

function gambarCadangan(n){
  const svg =
    "<svg xmlns='http://www.w3.org/2000/svg' width='600' height='750'>" +
    "<rect width='100%' height='100%' fill='#FFE9A8'/>" +
    "<circle cx='300' cy='290' r='130' fill='#FFD34D'/>" +
    "<text x='300' y='330' font-size='110' text-anchor='middle'>🎂</text>" +
    "<text x='300' y='520' font-size='44' text-anchor='middle' font-family='sans-serif' fill='#9A7422' font-weight='bold'>foto" + n + ".jpg</text>" +
    "<text x='300' y='570' font-size='26' text-anchor='middle' font-family='sans-serif' fill='#B99544'>taruh fotonya di folder projek ya 💛</text>" +
    "</svg>";
  return "data:image/svg+xml," + encodeURIComponent(svg);
}

function pasangFotoCadangan(){
  document.querySelectorAll(".galeri img").forEach((img, i) => {
    img.addEventListener("error", function sekali(){
      img.removeEventListener("error", sekali);
      img.src = gambarCadangan(i + 1);
    });
  });
  const fotoUcapan = document.querySelector(".ucapan-foto");
  if (fotoUcapan){
    fotoUcapan.addEventListener("error", function sekali(){
      fotoUcapan.removeEventListener("error", sekali);
      fotoUcapan.src = gambarCadangan(7);
    });
  }
}

function toast(pesan){
  const t = document.createElement("div");
  t.className = "toast";
  t.textContent = pesan;
  document.body.appendChild(t);
  setTimeout(() => {
    t.classList.add("hilang");
    setTimeout(() => t.remove(), 450);
  }, 3400);
}

function ledakkanConfetti(x, y, jumlah){
  const frag = document.createDocumentFragment();
  for (let i = 0; i < jumlah; i++){
    const c = document.createElement("span");
    const pakaiEmoji = (i % 18 === 0);
    c.className = "confetti" + (pakaiEmoji ? " teks" : (Math.random() < .3 ? " bulat" : ""));

    c.style.setProperty("--x", x + "px");
    c.style.setProperty("--y", y + "px");
    c.style.setProperty("--dx", (Math.random() * 330 - 165) + "px");
    c.style.setProperty("--puncak", (-(60 + Math.random() * 195)) + "px");
    c.style.setProperty("--jatuh", (window.innerHeight * (0.45 + Math.random() * 0.5)) + "px");
    c.style.setProperty("--putar", (360 + Math.random() * 560) + "deg");
    c.style.setProperty("--durasi", (1.5 + Math.random() * 1.2) + "s");
    c.style.setProperty("--tunda", (Math.random() * 0.25) + "s");

    if (pakaiEmoji){
      c.textContent = EMOJI_CONFETTI[Math.floor(Math.random() * EMOJI_CONFETTI.length)];
      c.style.setProperty("--ukuran", (15 + Math.random() * 10) + "px");
    } else {
      c.style.setProperty("--warna", WARNA_CONFETTI[Math.floor(Math.random() * WARNA_CONFETTI.length)]);
      c.style.setProperty("--ukuran", (7 + Math.random() * 7) + "px");
    }

    c.addEventListener("animationend", () => c.remove());
    frag.appendChild(c);
  }
  document.body.appendChild(frag);
}

function langsungKeLilin(){
  $("layerTunggu").classList.remove("aktif", "masuk");
  $("layerLilin").classList.add("aktif", "masuk");
  document.body.dataset.layer = "lilin";
}

document.addEventListener("DOMContentLoaded", () => {
  tebarKilau();
  pasangFotoCadangan();
  pasangTombolMusik();
  pasangLoveBurst();
  pasangKue();
  pasangMenu();
  pasangGaleri();
  pasangMemo();
  pasangPanelMusik();
  langkahKetik();
pasangGridFoto();
pasangFotoLayar();

  if (MODE_UJI || (WAKTU_TARGET - Date.now()) <= 0){
    sudahLilin = true;
    langsungKeLilin();
  } else {
    tampilanSisa(WAKTU_TARGET - Date.now());
    mulaiHitungMundur();
  }
});