document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("formLogin");
  const mensajeError = document.getElementById("mensajeError");

  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const usuario = document.getElementById("usuario").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!usuario || !password) {
      mensajeError.textContent = "Por favor, completa todos los campos.";
      return;
    }

    try {
      const res = await fetch('/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usuario, password })
      });

      const text = await res.text();

      if (!res.ok) {
        mensajeError.textContent = text;
      } else {
        window.location.href = '/dashboard';
      }
    } catch (err) {
      mensajeError.textContent = "Error de conexión con el servidor.";
    }
  });
});