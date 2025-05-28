document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("formRegister");
  const mensajeError = document.getElementById("mensajeError");

  form.addEventListener("submit", async function (e) {
    e.preventDefault();
    mensajeError.textContent = "";

    const nombre = document.getElementById("nombre").value.trim();
    const email = document.getElementById("email").value.trim();
    const contrasena = document.getElementById("contrasena").value.trim();
    const confirmar = document.getElementById("confirmar").value.trim();

    if (!nombre || !email || !contrasena || !confirmar) {
      e.preventDefault();
      mensajeError.textContent = "Por favor, completa todos los campos.";
      return;
    }

    if (contrasena !== confirmar) {
      e.preventDefault();
      mensajeError.textContent = "Las contraseñas no coinciden.";
      return;
    }
    try {
      const res = await fetch('/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, email, contrasena, confirmar })
      });

      const text = await res.text();

      if (!res.ok) {
        mensajeError.textContent = text;
      } else {
        window.location.href = '/login';
      }
    } catch (err) {
      mensajeError.textContent = "Error de conexión con el servidor.";
    }
  });
});
