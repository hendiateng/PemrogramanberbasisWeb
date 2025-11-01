/* ============================================================
   SITTA UT – Tugas Praktik 1 STSI4209 Pemrograman Berbasis Web
   File: script.js
   Deskripsi:
   - DOM Manipulation
   - CRUD stok (Semua User Bisa Akses)
   - Simulasi transaksi SASI (Semua User Bisa Akses)
   - Ringkasan stok & status pengiriman
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {
  const activeUser = JSON.parse(localStorage.getItem("activeUser"));

  // Redirect jika belum login
  if (!activeUser) {
    alert("Silakan login terlebih dahulu.");
    window.location.href = "index.html";
    return;
  }

  // Tampilkan greeting berdasarkan waktu
  const greet = document.getElementById("greeting");
  if (greet) {
    const hour = new Date().getHours();
    let waktu = "pagi";
    if (hour >= 12 && hour < 15) waktu = "siang";
    else if (hour >= 15 && hour < 18) waktu = "sore";
    else if (hour >= 18) waktu = "malam";
    greet.textContent = `Selamat ${waktu}, ${activeUser.name}!`;
  }

  // Tampilkan role & lokasi user di dashboard
  const infoUser = document.getElementById("userInfo");
  if (infoUser) {
    infoUser.textContent = `${activeUser.role} (${activeUser.lokasi})`;
  }

  /* ============================================================
     📦 RENDER DATA STOK BAHAN AJAR - SEMUA USER BISA LIHAT
     ============================================================ */
  const tableBody = document.getElementById("stokBody");
  if (tableBody) {
    renderTable();
    renderStokSummary();
  }

  function renderTable() {
    tableBody.innerHTML = "";
    const bahanAjar = getDataBahanAjar();
    
    bahanAjar.forEach(item => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${item.id}</td>
        <td>${item.judul}</td>
        <td>${item.penerbit}</td>
        <td>${item.stok}</td>
        <td>Rp ${item.harga.toLocaleString()}</td>
        <td><img src="${item.cover || 'assets/img/Default.jpg'}" alt="${item.judul}" width="60" onerror="this.src='assets/img/Default.jpg'"></td>
        <td>
          <button class="btnEdit" onclick="editStok('${item.id}')">Edit</button>
          <button class="btnDelete" onclick="hapusStok('${item.id}')">Hapus</button>
          <button class="btn primary" onclick="pesanBahanAjar('${item.id}')">Pesan</button>
        </td>
      `;
      tableBody.appendChild(row);
    });
  }

  /* ============================================================
     ➕ TAMBAH DATA BARU (CRUD - SEMUA USER BISA AKSES)
     ============================================================ */
  const btnAdd = document.getElementById("btnAdd");
  if (btnAdd) {
    btnAdd.addEventListener("click", () => {
      const id = prompt("Masukkan Kode Bahan Ajar:");
      const judul = prompt("Masukkan Judul Buku:");
      const penerbit = prompt("Masukkan Nama Penerbit:");
      const stok = parseInt(prompt("Masukkan Jumlah Stok:")) || 0;
      const harga = parseInt(prompt("Masukkan Harga:")) || 0;

      if (!id || !judul || !penerbit) {
        alert("Semua field wajib diisi!");
        return;
      }

      const bahanAjar = getDataBahanAjar();
      bahanAjar.push({ 
        id, 
        judul, 
        penerbit, 
        stok, 
        harga, 
        cover: "assets/img/Default.jpg" 
      });
      saveDataBahanAjar(bahanAjar);
      
      alert("Data berhasil ditambahkan!");
      renderTable();
      renderStokSummary();
    });
  }
});

/* ============================================================
   ✏️ Fungsi Edit & Hapus (CRUD) - SEMUA USER BISA AKSES
   ============================================================ */
function editStok(id) {
  const bahanAjar = getDataBahanAjar();
  const item = bahanAjar.find(i => i.id === id);
  if (!item) return alert("Data tidak ditemukan!");

  const stokBaru = parseInt(prompt(`Stok baru untuk ${item.judul}:`, item.stok));
  if (!isNaN(stokBaru)) {
    item.stok = stokBaru;
    saveDataBahanAjar(bahanAjar);
    alert("Data berhasil diperbarui!");
    location.reload();
  }
}

function hapusStok(id) {
  const bahanAjar = getDataBahanAjar();
  const index = bahanAjar.findIndex(i => i.id === id);
  if (index === -1) return alert("Data tidak ditemukan!");
  if (confirm("Yakin ingin menghapus data ini?")) {
    bahanAjar.splice(index, 1);
    saveDataBahanAjar(bahanAjar);
    alert("Data berhasil dihapus!");
    location.reload();
  }
}

/* ============================================================
   💳 Simulasi Transaksi Pemesanan Bahan Ajar (SASI) - SEMUA USER BISA AKSES
   ============================================================ */
function pesanBahanAjar(id) {
  const activeUser = JSON.parse(localStorage.getItem("activeUser"));
  if (!activeUser) {
    alert("Silakan login terlebih dahulu.");
    return;
  }

  const bahanAjar = getDataBahanAjar();
  const bahan = bahanAjar.find(item => item.id === id);
  if (!bahan) {
    alert("Data bahan ajar tidak ditemukan!");
    return;
  }

  const orders = JSON.parse(localStorage.getItem("orders")) || [];

  const newOrder = {
    doNumber: `DO${(orders.length + 5).toString().padStart(3, "0")}`,
    nama: activeUser.name,
    status: "Dalam Pengiriman",
    progress: 60,
    ekspedisi: "JNE",
    tanggalKirim: new Date().toISOString().split("T")[0],
    jenisPaket: "Reguler",
    totalBayar: bahan.harga
  };

  orders.push(newOrder);
  localStorage.setItem("orders", JSON.stringify(orders));

  alert(`Transaksi berhasil!\nNomor DO: ${newOrder.doNumber}\nJudul: ${bahan.judul}`);
}

/* ============================================================
   📊 RINGKASAN TOTAL STOK (SEMUA USER BISA LIHAT)
   ============================================================ */
function renderStokSummary() {
  const summary = document.getElementById("stokSummary");
  if (!summary) return;

  const bahanAjar = getDataBahanAjar();
  const totalStok = bahanAjar.reduce((sum, item) => sum + item.stok, 0);
  const totalJenis = bahanAjar.length;

  document.getElementById("totalStok").textContent = `Total Stok: ${totalStok}`;
  document.getElementById("totalJenis").textContent = `Total Jenis Buku: ${totalJenis}`;
}

/* ============================================================
   🚚 Gabungkan data tracking bawaan + hasil SASI
   ============================================================ */
function renderTrackingTable(list) {
  const tbody = document.getElementById("trackingBody");
  if (!tbody) return;

  tbody.innerHTML = "";
  list.forEach(item => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${item.doNumber}</td>
      <td>${item.nama}</td>
      <td>${item.status}</td>
      <td>
        <div class="progress-container">
          <div class="progress-bar" style="width: ${item.progress}%;">${item.progress}%</div>
        </div>
      </td>
      <td>${item.ekspedisi}</td>
      <td>${item.tanggalKirim}</td>
      <td>${item.jenisPaket}</td>
      <td>Rp ${item.totalBayar.toLocaleString()}</td>
    `;
    tbody.appendChild(row);
  });
}

/* ============================================================
   🚦 RINGKASAN STATUS PENGIRIMAN (SEMUA USER BISA LIHAT)
   ============================================================ */
function renderTrackingSummary() {
  const summary = document.getElementById("trackingSummary");
  if (!summary) return;

  const localOrders = JSON.parse(localStorage.getItem("orders")) || [];
  const allTracking = [...dataTracking, ...localOrders];

  const totalDO = allTracking.length;
  const dalamPengiriman = allTracking.filter(i => i.status === "Dalam Pengiriman").length;
  const terkirim = allTracking.filter(i => i.status === "Terkirim").length;
  const disiapkan = allTracking.filter(i => i.status === "Disiapkan").length;

  document.getElementById("totalDO").textContent = `Total DO: ${totalDO}`;
  document.getElementById("dalamPengiriman").textContent = `Dalam Pengiriman: ${dalamPengiriman}`;
  document.getElementById("terkirim").textContent = `Terkirim: ${terkirim}`;
  document.getElementById("disiapkan").textContent = `Disiapkan: ${disiapkan}`;
}

// Load tracking data ketika halaman tracking dimuat
document.addEventListener("DOMContentLoaded", () => {
  const tableTracking = document.getElementById("trackingBody");
  if (tableTracking) {
    const localOrders = JSON.parse(localStorage.getItem("orders")) || [];
    const allTracking = [...dataTracking, ...localOrders];
    renderTrackingTable(allTracking);
    renderTrackingSummary();
  }
});