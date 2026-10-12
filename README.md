# Cookies para hábitos y registros
- `guardarCookie` serializa el array de objetos con `JSON.stringify` y `encodeURIComponent` protege caracteres especiales al almacenarlo en la cookie.
- `leerCookie` decodifica el valor y aplica `JSON.parse` para recuperar el array de objetos; usa `try/catch` si está corrupto.
- `guardarTodo(habitos, registros)` guarda ambos arrays en cookies separadas; `borrarCookie(nombre)` elimina la cookie indicada.
- Consola: `guardarTodo([{nombre:"Leer",activo:true}],[{habito:"Leer",fecha:"2026-10-12"}]); location.reload();` Tras recargar, comprueba `leerCookie("habitos")` y `leerCookie("registros")`.
