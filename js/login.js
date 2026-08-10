const usuarios = [
  {
    usuario: "admin",
    password: "1234",
    nombre: "Administrador",
    rol: "Administrador"
  },
  {
    usuario: "ulysses",
    password: "1234",
    nombre: "Ulysses",
    rol: "Operador"
  }
];

const formulario = document.getElementById("loginForm");
const mensaje = document.getElementById("mensaje");

console.log("LoginMaster: formulario encontrado:", formulario);

formulario.addEventListener("submit", function (evento) {
  evento.preventDefault();

  console.log("BOTÓN DE LOGIN PRESIONADO");

  const usuarioIngresado = document.getElementById("usuario").value.trim();
  const passwordIngresada = document.getElementById("password").value;

  const usuarioEncontrado = usuarios.find(function (item) {
    return item.usuario === usuarioIngresado &&
           item.password === passwordIngresada;
  });

  if (usuarioEncontrado) {
    console.log("LOGIN CORRECTO");

    localStorage.setItem("usuarioLogueado", usuarioEncontrado.usuario);
    localStorage.setItem("nombreUsuario", usuarioEncontrado.nombre);
    localStorage.setItem("rolUsuario", usuarioEncontrado.rol); // 🔹 Guardar rol

    mensaje.textContent = "✓ Inicio de sesión correcto";
    mensaje.className = "mensaje exito";

    // Redirigir al dashboard
    setTimeout(() => {
      window.location.href = "dashboard.html";
    }, 1000);

  } else {
    console.log("LOGIN INCORRECTO");

    mensaje.textContent = "✗ Usuario o contraseña incorrectos";
    mensaje.className = "mensaje error";
  }
});
