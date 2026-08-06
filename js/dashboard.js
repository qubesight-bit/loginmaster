document.addEventListener("DOMContentLoaded", () => {
  const nombreUsuario = localStorage.getItem("nombreUsuario");
  const usuarioLogueado = localStorage.getItem("usuarioLogueado");
  const elementoNombre = document.getElementById("nombreUsuario");
  const logoutBtn = document.getElementById("logoutBtn");

  if (!usuarioLogueado) {
    window.location.href = "index.html";
    return;
  }

  if (elementoNombre) {
    elementoNombre.textContent = nombreUsuario || "Usuario";
  }

  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.clear();
      window.location.href = "index.html";
    });
  }
});
