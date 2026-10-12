# Cookies para hábitos y registros
- `guardarCookie` convierte el array a JSON con `JSON.stringify` y usa `encodeURIComponent` para proteger los caracteres especiales en la cookie.
- `leerCookie` decodifica con `decodeURIComponent` y recupera el objeto con `JSON.parse`; `try/catch` evita fallos si la cookie está corrupta.
- Un hábito tiene `{ id, nombre, descripcion, categoria }`; su formulario valida nombre no vacío y categoría.
- `guardarTodo(habitos, registros)` guarda cada array en su cookie; `borrarCookie(nombre)` elimina la cookie indicada.
- El desplegable de registros se genera recorriendo `habitos` y creando una opción por hábito; se actualiza al crear uno.
- Cada registro guarda el `habitoId` seleccionado, que coincide con el `id` del hábito para relacionarlos, además de fecha, observaciones y si se cumplió.
