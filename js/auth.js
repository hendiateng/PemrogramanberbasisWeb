/* ============================================================
   SITTA UT – Tugas Praktik 1 STSI4209 Pemrograman Berbasis Web
   File: auth.js
   Deskripsi: Login, validasi form, modal box, & pendaftaran real.
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("loginForm");
  const modal = document.getElementById("modal");
  const modalTitle = document.getElementById("modalTitle");
  const modalBody = document.getElementById("modalBody");
  const closeModal = document.getElementById("closeModal");
  const openRegister = document.getElementById("openRegister");
  const openForgot = document.getElementById("openForgot");

  /* ============================================================
     🔐 LOGIN FORM VALIDATION
     ============================================================ */
  form.addEventListener("submit", e => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!email || !password) {
      alert("Email dan password harus diisi!");
      return;
    }

    // Gabungkan user bawaan (data.js) & user baru dari localStorage
    const allUsers = getAllUsers();
    const user = allUsers.find(
      u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );

    if (!user) {
      alert("Email atau password yang Anda masukkan salah!");
      form.reset();
      return;
    }

    // Simpan session user login
    localStorage.setItem("activeUser", JSON.stringify(user));

    alert(`Selamat datang, ${user.name}!`);
    window.location.href = "dashboard.html";
  });

  /* ============================================================
     💬 MODAL BOX: DAFTAR & LUPA PASSWORD
     ============================================================ */

  // --- Daftar Pengguna Baru ---
  openRegister.addEventListener("click", () => {
    modalTitle.textContent = "Form Pendaftaran Pengguna Baru";
    modalBody.innerHTML = `
      <form id="formRegister" class="form">
        <div class="form-group">
          <label>Nama Lengkap</label>
          <input type="text" id="regName" required placeholder="Nama Lengkap">
        </div>
        <div class="form-group">
          <label>Email</label>
          <input type="email" id="regEmail" required placeholder="email@ut.ac.id">
        </div>
        <div class="form-group">
          <label>Password</label>
          <input type="password" id="regPassword" minlength="4" required placeholder="Minimal 4 karakter">
        </div>
        <button type="submit" class="btn primary">Daftar</button>
      </form>
    `;
    showModal();

    const regForm = document.getElementById("formRegister");
    regForm.addEventListener("submit", e => {
      e.preventDefault();
      const name = document.getElementById("regName").value.trim();
      const email = document.getElementById("regEmail").value.trim();
      const password = document.getElementById("regPassword").value.trim();

      if (!name || !email || !password) {
        alert("Semua field harus diisi!");
        return;
      }

      // Cek duplikat email
      const allUsers = getAllUsers();
      if (allUsers.some(u => u.email.toLowerCase() === email.toLowerCase())) {
        alert("Email sudah terdaftar. Silakan login.");
        hideModal();
        return;
      }

      // Simpan user baru ke localStorage
      const newUser = { email, password, role: "Mahasiswa", name, lokasi: "UPBJJ Lokal" };
      saveNewUser(newUser);

      alert("Pendaftaran berhasil! Silakan login menggunakan email dan password Anda.");
      hideModal();
    });
  });

  // --- Lupa Password ---
  openForgot.addEventListener("click", () => {
    modalTitle.textContent = "Form Lupa Password";
    modalBody.innerHTML = `
      <form id="formForgot" class="form">
        <div class="form-group">
          <label>Masukkan Email Anda</label>
          <input type="email" id="forgotEmail" required placeholder="email@ut.ac.id">
        </div>
        <div class="form-group">
          <label>Password Baru</label>
          <input type="password" id="newPassword" minlength="4" required placeholder="Password baru minimal 4 karakter">
        </div>
        <button type="submit" class="btn primary">Reset Password</button>
      </form>
    `;
    showModal();

    const forgotForm = document.getElementById("formForgot");
    forgotForm.addEventListener("submit", e => {
      e.preventDefault();
      const email = document.getElementById("forgotEmail").value.trim();
      const newPassword = document.getElementById("newPassword").value.trim();
      
      if (!email || !newPassword) {
        alert("Semua field harus diisi!");
        return;
      }

      const allUsers = getAllUsers();
      const userIndex = allUsers.findIndex(u => u.email.toLowerCase() === email.toLowerCase());

      if (userIndex === -1) {
        alert("Email tidak ditemukan di sistem!");
        return;
      }

      // Update password
      allUsers[userIndex].password = newPassword;
      localStorage.setItem("registeredUsers", JSON.stringify(allUsers.filter(user => !usersDemo.includes(user))));

      alert(`Password berhasil direset untuk ${email}!`);
      hideModal();
    });
  });

  // --- Tutup modal box ---
  closeModal.addEventListener("click", hideModal);
  modal.addEventListener("click", e => {
    if (e.target === modal) hideModal();
  });

  /* ============================================================
     ⚙️ Fungsi Show / Hide Modal
     ============================================================ */
  function showModal() {
    modal.classList.remove("hide");
  }

  function hideModal() {
    modal.classList.add("hide");
    modalTitle.textContent = "";
    modalBody.innerHTML = "";
  }
});

/* ============================================================
   💾 FUNGSI GLOBAL UNTUK REGISTRASI & LOGIN
   ============================================================ */

// Ambil daftar user gabungan (usersDemo + yang disimpan di localStorage)
function getAllUsers() {
  const localUsers = JSON.parse(localStorage.getItem("registeredUsers")) || [];
  return [...usersDemo, ...localUsers];
}

// Simpan user baru ke localStorage
function saveNewUser(newUser) {
  const localUsers = JSON.parse(localStorage.getItem("registeredUsers")) || [];
  localUsers.push(newUser);
  localStorage.setItem("registeredUsers", JSON.stringify(localUsers));
}