# Api nomadesV2 de Express

Base para el proyecto nomadesV2 de Express.js con entornos de ejecución y manejo de errores.

## Sobre la API:

Esta API fue construida de manera híbrida. Es decir, la parte de Repositories, Services y Controllers está desarrollada bajo el paradigma OOP (Programación Orientada a Objetos). Sin embargo, los routers y la aplicación en sí no lo están. Los middlewares, si bien forman parte de una clase, esta es una clase de métodos estáticos. De esta forma, se aprovecha la escalabilidad y el orden de la POO, pero al mismo tiempo se minimiza el consumo de recursos utilizando funciones puras siempre que sea posible (las clases en JavaScript tienen un costo, aunque no muy elevado).

En esta plantilla encontrará ambos paradigmas funcionando codo a codo. A partir de aquí, puede adaptarla según su preferencia. Si bien está construida de una manera básica, es funcional. Al revisar el código podrá ver, si desea mantener este enfoque, cómo continuar. ¡Buena suerte y buen código!

## Cómo comenzar:

### Instalaciones:

La app viene con las instalaciones básicas para comenzar a trabajar con Sequelize y una base de datos PostgreSQL. En caso de querer utilizar MySQL o SQLite, las dependencias específicas de PostgreSQL que deben desinstalarse son `pg` y `pg-hstore`.

### Scripts disponibles:

- `npm start`: Inicializa la app en modo producción con Node.js y Express (.env.production).
- `npm run dev`: Inicializa la app en modo desarrollo con Nodemon y Express (.env.development).
- `npm run unit:test`: Ejecuta todos los tests. También puede ejecutarse un test específico, por ejemplo: `npm run unit:test EnvDb`. La app se inicializa en modo test (.env.test).
- `npm run lint`: Ejecuta el linter (standard) y analiza la sintaxis del código (no realiza cambios).
- `npm run lint:fix`: Ejecuta el linter y corrige automáticamente los errores.
- `npm run gen:schema`: Inicializa la función `generateSchema`, que genera documentación Swagger para las rutas mediante una guía por consola. Si bien es susceptible de mejora, actualmente resulta muy útil para agilizar el trabajo de documentación.

La aplicación cuenta con Repositories, Services, Controllers y Middlewares genericos, estos se encuentran en la carpeta `Shared`. Luego en la carpeta `Features` estos toman a través de instancia o herencia los nombres que necesiten de acuerdo a los casos de uso. Allí también se declaran los tipos de datos que se esperan como entrada. El archivo `user.routes.js` conecta esta funcionalidad con la app a través de `mainRouter` (`routes.js`).

La aplicación puede ejecutarse con `npm run dev` (modo desarrollo) o `npm start` (producción). Los tests pueden ejecutarse solo una vez que se hayan definido los modelos y conectado la base de datos.

Se requieren dos bases de datos: una para desarrollo y otra para test. Una vez configurado todo, debe descomentar la línea correspondiente en `jest.config.js` y en el archivo `jest.setup.js` dentro de la carpeta `test`. Luego, ajuste los tests según su caso de uso.

### Manejo de errores:

- La función `catchController` se utiliza para envolver los controladores, como se detalla en `GenericController.js`.
- La función `throwError` se utiliza en los servicios. Recibe un mensaje y un código de estado:

```javascript
import eh from "./Configs/errorHandlers.js";

eh.throwError("Usuario no encontrado", 404);
```

- La función `middError` se usa en los middlewares:

```javascript
import eh from "./Configs/errorHandlers.js";

if (!user) {
  return next(eh.middError("Falta el usuario", 400));
}
```

### Acerca de `MiddlewareHandler.js`

Esta clase estática contiene una serie de métodos auxiliares para evitar la repetición de código en middlewares activos.

#### Métodos de validación disponibles:

- `validateFields`: validación y tipado de datos del body
- `validateFieldsWithItems`: validación de un objeto con un array de objetos anidados
- `validateQuery`: validación y tipado de queries (con copia debido a Express 5)
- `validateRegex`: validación de parámetros del body mediante expresiones regulares
- `middUuid`: validación de UUID
- `middIntId`: validación de ID como número entero

#### validateFields:

```javascript
import MiddlewareHandler from '../MiddlewareHandler.js'

const user = [
  {name: 'email', type: 'string'},
  {name: 'password', type: 'string'},
  {name: 'phone', type: 'int'}
];

router.post('/', MiddlewareHandler.validateFields(user), controlador);
```

Tipos de datos permitidos:
- `'string'`
- `'int'`
- `'float'`
- `'boolean'`
- `'array'` (no valida su contenido)

Los datos no declarados serán eliminados del body. Si falta alguno de los declarados o no puede convertirse al tipo esperado, se emitirá el error correspondiente.

#### validateFieldsWithItems:

Valida también un array anidado:

```javascript
import MiddlewareHandler from '../MiddlewareHandler.js'

const user = [
  {name: 'email', type: 'string'},
  {name: 'password', type: 'string'},
  {name: 'phone', type: 'int'}
];

const address = [
  {name:'street', type:'string'},
  {name:'number', type:'int'}
];

router.post('/', MiddlewareHandler.validateFieldsWithItems(user, address, 'address'), controlador);
```

Ejemplo de body:

```json
{
  "name": "Leanne Graham",
  "password": "xxxxxxxx",
  "phone": 5578896,
  "address": [
    { "street": "Kulas Light", "number": 225 },
    { "street": "Victor Plains", "number": 1230 }
  ]
}
```

#### validateQuery:

```javascript
import MiddlewareHandler from '../MiddlewareHandler.js'

const queries = [
  { name: 'page', type: 'int' },
  { name: 'size', type: 'float' },
  { name: 'fields', type: 'string' },
  { name: 'truthy', type: 'boolean' }
];

router.get('/', MiddlewareHandler.validateQuery(queries), controlador);
```

Express 5 convierte `req.query` en inmutable. La copia validada estará disponible en `req.validatedQuery`.

#### validateRegex:

```javascript
import MiddlewareHandler from '../MiddlewareHandler.js'

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

router.post('/', MiddlewareHandler.validateRegex(emailRegex, 'email', 'Introduzca un mail válido'), controlador);
```

#### middUuid y middIntId:

Funcionan de forma similar, cambiando solo el tipo de dato a validar:

```javascript
import MiddlewareHandler from '../MiddlewareHandler.js'

router.get('/:userId', MiddlewareHandler.middIntId('userId'), controlador);
```

---

Se ha intentado cubrir la mayor cantidad de casos de uso posibles. Por supuesto, pueden existir muchos más, pero esta base ofrece un punto de partida sólido.

---

Espero que esta explicación te sea útil. ¡Suerte!
