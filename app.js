(() => {
  function guardarCookie(nombre, valor) {
    const contenido = encodeURIComponent(JSON.stringify(valor));
    document.cookie = `${nombre}=${contenido}; path=/; SameSite=Lax`;
  }

  function leerCookie(nombre) {
    const prefijo = `${nombre}=`;
    const cookie = document.cookie.split("; ").find((parte) => parte.startsWith(prefijo));
    if (!cookie) return null;
    try {
      return JSON.parse(decodeURIComponent(cookie.slice(prefijo.length)));
    } catch (error) {
      console.error(`No se pudo leer la cookie "${nombre}":`, error);
      return null;
    }
  }

  function borrarCookie(nombre) {
    document.cookie = `${nombre}=; Max-Age=0; path=/; SameSite=Lax`;
  }

  function guardarTodo(habitos, registros) {
    guardarCookie("habitos", habitos);
    guardarCookie("registros", registros);
  }

  const $ = (id) => document.getElementById(id);
  const formulario = $("formulario-habito");

  if (formulario) {
    const campoNombre = $("nombre");
    const formularioRegistro = $("formulario-registro");
    const selectorHabito = $("habito-registro");
    const almacenado = leerCookie("habitos");
    const historial = leerCookie("registros");
    let habitos = Array.isArray(almacenado) ? almacenado : [];
    let registros = Array.isArray(historial) ? historial : [];

    function actualizarHabitos() {
      selectorHabito.replaceChildren(new Option("Elige un hábito", ""));
      habitos.forEach((habito) => selectorHabito.add(new Option(habito.nombre, habito.id)));
    }

    function mostrarDatos() {
      $("datos-habitos").textContent = JSON.stringify(habitos, null, 2);
      $("datos-registros").textContent = JSON.stringify(registros, null, 2);
      $("estado").textContent = habitos.length || registros.length ? "Datos recuperados." : "Sin datos guardados.";
      actualizarHabitos();
    }

    window.obtenerDatosSeguimiento = () => ({ habitos, registros });
    window.toggleCumplido = (id) => {
      const registro = registros.find((item) => item.id === id);
      if (!registro) return false;
      registro.cumplido = !registro.cumplido;
      guardarTodo(habitos, registros);
      mostrarDatos();
      return true;
    };

    campoNombre.addEventListener("input", () => {
      campoNombre.setCustomValidity("");
      $("error-nombre").textContent = "";
    });

    formulario.addEventListener("submit", (evento) => {
      evento.preventDefault();
      const nombre = campoNombre.value.trim();
      if (!nombre) {
        campoNombre.setCustomValidity("El nombre no puede estar vacío.");
        $("error-nombre").textContent = "El nombre no puede estar vacío.";
        campoNombre.reportValidity();
        return;
      }
      habitos.push({
        id: crypto.randomUUID(),
        nombre,
        descripcion: $("descripcion").value.trim(),
        categoria: $("categoria").value,
      });
      guardarTodo(habitos, registros);
      formulario.reset();
      $("error-nombre").textContent = "";
      mostrarDatos();
    });

    formularioRegistro.addEventListener("submit", (evento) => {
      evento.preventDefault();
      const fecha = $("fecha-registro").value;
      if (!selectorHabito.value || !fecha) {
        $("error-registro").textContent = "Selecciona un hábito y una fecha.";
        return;
      }
      registros.push({
        id: crypto.randomUUID(),
        habitoId: selectorHabito.value,
        fecha,
        observaciones: $("observaciones").value.trim(),
        cumplido: $("cumplido").checked,
      });
      guardarTodo(habitos, registros);
      formularioRegistro.reset();
      $("error-registro").textContent = "";
      mostrarDatos();
    });

    $("borrar").addEventListener("click", () => {
      borrarCookie("habitos");
      borrarCookie("registros");
      habitos = [];
      registros = [];
      mostrarDatos();
    });

    mostrarDatos();
    return;
  }

  const filas = $("filas");
  if (!filas) return;

  function actualizarTabla() {
    if (!window.opener || window.opener.closed || typeof window.opener.obtenerDatosSeguimiento !== "function") {
      $("aviso").textContent = "Abre el seguimiento desde la página principal para editar registros.";
      return;
    }

    const { habitos, registros } = window.opener.obtenerDatosSeguimiento();
    filas.replaceChildren();
    let cumplidos = 0;
    registros.forEach((registro) => {
      const fila = filas.insertRow();
      const habito = habitos.find((item) => item.id === registro.habitoId);
      [habito ? habito.nombre : "Hábito no disponible", registro.fecha, registro.observaciones || "—"]
        .forEach((valor) => { fila.insertCell().textContent = valor; });

      const estado = fila.insertCell();
      estado.textContent = registro.cumplido ? "✓" : "✗";
      estado.className = registro.cumplido ? "cumplido" : "fallado";
      const accion = fila.insertCell();
      const boton = document.createElement("button");
      boton.type = "button";
      boton.textContent = "Cambiar";
      boton.addEventListener("click", () => {
        if (!window.opener || window.opener.closed || typeof window.opener.toggleCumplido !== "function" || !window.opener.toggleCumplido(registro.id)) {
          $("aviso").textContent = "No se pudo actualizar el registro en la página principal.";
          return;
        }
        $("aviso").textContent = "";
        actualizarTabla();
      });
      accion.append(boton);
      if (registro.cumplido) cumplidos++;
    });

    $("resumen").textContent = `Cumplidos: ${cumplidos} · Fallados: ${registros.length - cumplidos}`;
    if (!registros.length) $("aviso").textContent = "Todavía no hay registros.";
  }

  actualizarTabla();
})();
