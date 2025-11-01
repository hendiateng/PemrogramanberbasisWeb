/* ============================================================
   SITTA UT – Session & User Info Global
   Deskripsi: Menangani login session, user info, dan logout
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {
  const activeUser = JSON.parse(localStorage.getItem("activeUser"));

  // Redirect ke login jika belum login
  if (!activeUser) {
    alert("Silakan login terlebih dahulu.");
    window.location.href = "index.html";
    return;
  }

  // Tampilkan greeting otomatis jika ada elemen #greeting
  const greet = document.getElementById("greeting");
  if (greet) {
    const hour = new Date().getHours();
    let waktu = "pagi";
    if (hour >= 12 && hour < 15) waktu = "siang";
    else if (hour >= 15 && hour < 18) waktu = "sore";
    else if (hour >= 18) waktu = "malam";
    greet.textContent = `Selamat ${waktu}, ${activeUser.name}!`;
  }

  // Tampilkan role & lokasi user jika ada elemen #userInfo
  const infoUser = document.getElementById("userInfo");
  if (infoUser) {
    infoUser.textContent = `${activeUser.role} (${activeUser.lokasi})`;
  }

  // Logout global untuk semua halaman
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("activeUser");
      window.location.href = "index.html";
    });
  }
});