document.addEventListener("DOMContentLoaded", () => {
  const nombreUsuario = localStorage.getItem("nombreUsuario");
  const usuarioLogueado = localStorage.getItem("usuarioLogueado");

  if (!usuarioLogueado) {
    // Si no hay sesión activa, regresar al login
    window.location.href = "index.html";
  }

  document.getElementById("nombreUsuario").textContent = nombreUsuario;

  // Botón de cerrar sesión
  document.getElementById("logoutBtn").addEventListener("click", () => {
    localStorage.clear();
    window.location.href = "index.html";
  });
});
const nombreUsuario = localStorage.getItem("nombreUsuario");

const elementoNombre = document.getElementById("nombreUsuario");

// ========================================
// MOSTRAR USUARIO
// ========================================

if (nombreUsuario) {

```
elementoNombre.textContent = nombreUsuario;
```

} else {

```
elementoNombre.textContent = "Usuario";
```

}

// ========================================
// CERRAR SESIÓN
// ========================================

const logoutBtn = document.getElementById("logoutBtn");

logoutBtn.addEventListener("click", function () {

```
localStorage.clear();

window.location.href = "index.html";
```

});
