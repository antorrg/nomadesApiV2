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


