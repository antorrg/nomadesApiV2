# nomadesApiV2

Refactorizacion del servidor del proyecto nomades de Express.js con entornos de ejecución y manejo de errores.

## Sobre la API:

Esta API fue construida de manera híbrida. Es decir, la parte de Repositories, Services y Controllers está desarrollada bajo el paradigma OOP (Programación Orientada a Objetos). Sin embargo, los routers y la aplicación en sí no lo están. Los middlewares, si bien forman parte de una clase, esta es una clase de métodos estáticos. De esta forma, se aprovecha la escalabilidad y el orden de la POO, pero al mismo tiempo se minimiza el consumo de recursos utilizando funciones puras siempre que sea posible (las clases en JavaScript tienen un costo, aunque no es muy elevado).

## Cómo comenzar:

### Instalaciones:

Para levantar la app es necesario primero hacer 3 copias del archivo `.env.example` a saber: 
- `.env.development`
- `.env.test`
- `.env`


Deberán ser una copia fiel de la variable `.env.example`, la variable de entorno `.env` será la que leerá la aplicacion de vite (en el caso de usarla como monorepositorio).

La idea de esto es que en `.env.development` y en `.env.test` haya dos bases de datos postgres con diferentes nombres, si bien ambas utilizarán el mismo modelo, porque los tests que se correrán con `vitest` utilizarán la base de datos que haya declarado en la variable de test. 

En el archivo `.env` puede declarar la misma DB que utiliza en desarrollo u otra a su gusto.

Luego, en la raíz del proyecto, en la consola debe ejecutar `npm install`, esto instalará los paquetes necesarios.

### Scripts disponibles:

- `npm start`: Inicializa la app en modo producción con Node.js y Express (.env.production).
- `npm run dev`: Inicializa la app en modo desarrollo con Nodemon y Express (.env.development).
- `npm run unit:test`: Ejecuta todos los tests. También puede ejecutarse un test específico, por ejemplo: `npm run unit:test EnvDb`. La app se inicializa en modo test (.env.test).
- `npm run integration:test`: Ejecuta los test de integración (tests de rutas) que se encuentran en la carpeta test.  La app se inicializa en modo test (.env.test).
- `npm run lint`: Ejecuta el linter (standard) y analiza la sintaxis del código (no realiza cambios).
- `npm run lint:fix`: Ejecuta el linter y corrige automáticamente los errores.
- `npm run gen:schema`: Inicializa la función `generateSchema`, que genera documentación Swagger para las rutas mediante una guía por consola. Si bien es susceptible de mejora, actualmente resulta muy útil para agilizar el trabajo de documentación.

La aplicación cuenta con Repositories, Services, Controllers y Middlewares genericos, estos se encuentran en la carpeta `Shared`. Luego en la carpeta `Features` estos toman a través de instancia o herencia los nombres que necesiten de acuerdo a los casos de uso. Allí también se declaran los tipos de datos que se esperan como entrada. El archivo `user.routes.js` conecta esta funcionalidad con la app a través de `mainRouter` (`routes.js`).

La aplicación puede ejecutarse con `npm run dev` (modo desarrollo) o `npm start` (producción). Los tests pueden ejecutarse solo una vez que se hayan definido los modelos y conectado la base de datos.



## 📸 Flujo de manejo de imágenes

El servicio trabaja con **tres casos principales** al actualizar o eliminar registros que incluyen imágenes.
Se usan dos flags en el `body`:

* `useImg`: indica si se debe **seguir usando la imagen anterior**.
* `saver`: indica si se debe **guardar la imagen anterior en la base de datos** (sin eliminarla del storage).

---

### 1. Creación (`create`)

* El registro se crea en DB con la URL de la imagen nueva (`picture`, `landing`, etc.).
* Si se habilita manejo de imágenes (`useImage = true` en el servicio), la imagen nueva reemplaza a la anterior.
* La anterior, si existía, se elimina mediante `handleImageDeletion`.

---

### 2. Actualización (`update`)

1. Se compara la URL de la imagen en DB (`oldImgUrl`) con la nueva (`newData[nameImage]`).

   * Si no cambió, no se hace nada.

   * Si cambió, entran las opciones:

   * **`saver: true`**
     → La imagen anterior se guarda en la tabla `Image` (persistencia histórica).
     → No se elimina del storage.

   * **`useImg: true`**
     → El cliente pide seguir usando la imagen anterior.
     → Se elimina el registro en la tabla `Image`, pero la imagen en storage se conserva.

   * **Caso por defecto (`saver: false` y `useImg: false`)**
     → La imagen anterior se elimina tanto de la DB como del storage.

---

### 3. Eliminación (`delete`)

* Si el registro tiene imagen:

  * **`saver: true`** no aplica aquí (ya que la intención es borrar el registro).
  * Se borra la referencia en DB (`deleteImageFromDb`).
  * Se borra también del storage (`oldImagesHandler(..., false)`).

---

### 4. Recuperación (`getAll`, `getById`, etc.)

* Se devuelven los registros con la URL activa de la imagen.
* En el caso de no existir imágenes en DB, `ImgsService.getImages` devuelve una **imagen de fallback** (referencial).

---

### 🔎 Ejemplo práctico con flags

| Operación                           | useImg  | saver   | Resultado                                                         |
| ----------------------------------- | ------- | ------- | ----------------------------------------------------------------- |
| **Update** con imagen nueva         | `false` | `false` | Borra la anterior de DB y storage, guarda la nueva.               |
| **Update** con imagen nueva         | `false` | `true`  | Guarda la anterior en DB, mantiene en storage, registra la nueva. |
| **Update** manteniendo imagen vieja | `true`  | `false` | Reusa la vieja, elimina solo la referencia en DB.                 |
| **Delete** de registro              | —       | —       | Borra imagen en DB y storage.                                     |


---

