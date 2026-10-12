# Cookies para hábitos y registros
- `guardarCookie` convierte el array a JSON con `JSON.stringify` y usa `encodeURIComponent` para proteger los caracteres especiales en la cookie.
- `leerCookie` decodifica con `decodeURIComponent` y recupera el objeto con `JSON.parse`; `try/catch` evita fallos si la cookie está corrupta.
- Un hábito tiene `{ id, nombre, descripcion, categoria }`; el formulario exige nombre no vacío (también tras quitar espacios) y una categoría.
- `guardarTodo(habitos, registros)` guarda cada array en su cookie; `borrarCookie(nombre)` elimina la cookie indicada.
