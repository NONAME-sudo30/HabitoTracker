function guardarCookie(nombre, valor) {
  const contenido = encodeURIComponent(JSON.stringify(valor));
  document.cookie = `${nombre}=${contenido}; path=/; SameSite=Lax`;
}

function leerCookie(nombre) {
  const prefijo = `${nombre}=`;
  const cookie = document.cookie
    .split("; ")
    .find((parte) => parte.startsWith(prefijo));

  if (!cookie) {
    return null;
  }

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
