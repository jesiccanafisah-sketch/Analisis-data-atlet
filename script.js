const formAtlet = document.getElementById("formAtlet");
const tabelAtlet = document.getElementById("tabelAtlet");
const ringkasan = document.getElementById("ringkasan");
const pesanKosong = document.getElementById("pesanKosong");

const daftarAtlet = [];

// Membuat grafik Chart.js
const grafikAtlet = new Chart(
  document.getElementById("grafikAtlet"),
  {
    type: "bar",
    data: {
      labels: [],
      datasets: [{
        label: "Vertical Jump (cm)",
        data: [],
        backgroundColor: "#147d76",
        borderRadius: 6
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: "Tinggi lompatan (cm)"
          }
        },
        x: {
          title: {
            display: true,
            text: "Nama atlet"
          }
        }
      }
    }
  }
);

// Membuat sel tabel
function buatSel(teks) {
  const sel = document.createElement("td");
  sel.textContent = teks;
  return sel;
}

// Menambahkan atlet
formAtlet.addEventListener("submit", function(event) {
  event.preventDefault();

  const atlet = {
    id: Date.now() + Math.random(),
    nama: document.getElementById("nama").value.trim(),
    cabor: document.getElementById("cabor").value,
    sprint: Number(document.getElementById("sprint").value),
    agility: Number(document.getElementById("agility").value),
    lompat: Number(document.getElementById("lompat").value)
  };

  if (
    !atlet.nama ||
    !atlet.cabor ||
    !Number.isFinite(atlet.sprint) ||
    !Number.isFinite(atlet.agility) ||
    !Number.isFinite(atlet.lompat) ||
    atlet.sprint <= 0 ||
    atlet.agility <= 0 ||
    atlet.lompat < 0
  ) {
    alert("Periksa kembali data yang dimasukkan.");
    return;
  }

  daftarAtlet.push(atlet);
  formAtlet.reset();

  tampilkanData();
  hitungStatistik();
});

// Menampilkan data atlet di tabel
function tampilkanData() {
  tabelAtlet.replaceChildren();

  daftarAtlet.forEach(function(atlet) {
    const baris = document.createElement("tr");

    baris.append(
      buatSel(atlet.nama),
      buatSel(atlet.cabor),
      buatSel(atlet.sprint.toFixed(2)),
      buatSel(atlet.agility.toFixed(2)),
      buatSel(atlet.lompat.toFixed(1))
    );

    const selAksi = document.createElement("td");
    const tombolHapus = document.createElement("button");

    tombolHapus.textContent = "Hapus";
    tombolHapus.className = "delete-button";

    tombolHapus.addEventListener("click", function() {
      const indeks = daftarAtlet.findIndex(function(item) {
        return item.id === atlet.id;
      });

      if (indeks !== -1) {
        daftarAtlet.splice(indeks, 1);
        tampilkanData();
        hitungStatistik();
      }
    });

    selAksi.appendChild(tombolHapus);
    baris.appendChild(selAksi);
    tabelAtlet.appendChild(baris);
  });

  pesanKosong.hidden = daftarAtlet.length > 0;
}

// Menghitung statistik dan memperbarui grafik
function hitungStatistik() {
  const total = daftarAtlet.length;
  ringkasan.replaceChildren();

  if (total === 0) {
    const pesan = document.createElement("p");
    pesan.textContent =
      "Masukkan data atlet untuk memulai analisis.";

    ringkasan.appendChild(pesan);

    grafikAtlet.data.labels = [];
    grafikAtlet.data.datasets[0].data = [];
    grafikAtlet.update();
    return;
  }

  function rataRata(kunci) {
    const jumlah = daftarAtlet.reduce(function(totalNilai, atlet) {
      return totalNilai + atlet[kunci];
    }, 0);

    return jumlah / total;
  }

  const sprintTercepat = daftarAtlet.reduce(function(terbaik, atlet) {
    return atlet.sprint < terbaik.sprint ? atlet : terbaik;
  });

  const jumpTertinggi = daftarAtlet.reduce(function(terbaik, atlet) {
    return atlet.lompat > terbaik.lompat ? atlet : terbaik;
  });

  const dataRingkasan = [
    ["Jumlah atlet", total + " atlet"],
    ["Rata-rata sprint", rataRata("sprint").toFixed(2) + " detik"],
    ["Rata-rata kelincahan", rataRata("agility").toFixed(2) + " detik"],
    ["Rata-rata vertical jump", rataRata("lompat").toFixed(1) + " cm"],
    ["Sprint tercepat", sprintTercepat.nama],
    ["Vertical jump tertinggi", jumpTertinggi.nama]
  ];

  dataRingkasan.forEach(function(item) {
    const kartu = document.createElement("div");
    kartu.className = "summary-card";

    const judul = document.createElement("p");
    judul.textContent = item[0];

    const nilai = document.createElement("h3");
    nilai.textContent = item[1];

    kartu.append(judul, nilai);
    ringkasan.appendChild(kartu);
  });

  // Mengisi grafik dengan nama dan hasil vertical jump
  grafikAtlet.data.labels = daftarAtlet.map(function(atlet) {
    return atlet.nama;
  });

  grafikAtlet.data.datasets[0].data = daftarAtlet.map(function(atlet) {
    return atlet.lompat;
  });

  grafikAtlet.update();
}