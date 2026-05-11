# 🏢 Sistema Web Empresarial Full-Stack

## 📘 Manual Técnico

---

## 👨‍💻 Datos del Proyecto

**Nombre del proyecto:** Sistema Web Empresarial Full-Stack  
**Desarrollador:** Edward Rene Winter Tiu  
**Carné:** 202140469  
**Tipo de proyecto:** Aplicación Web Empresarial Full-Stack  
**Modalidad:** Web y móvil  
**Base de datos:** MongoDB Atlas  
**Frontend:** React.js + Vite  
**Backend:** Node.js + Express.js  
**Aplicación móvil:** React Native + Expo  
**Despliegue:** Frontend en Vercel/Netlify y Backend en Render  

---

# 📌 1. Descripción General

El Sistema Web Empresarial Full-Stack fue desarrollado como una solución tecnológica para la gestión centralizada de información empresarial.

El sistema permite administrar clientes, proyectos, tareas y usuarios dentro de una empresa, facilitando el control de procesos internos, el seguimiento de actividades, la organización de información y la generación de reportes.

La aplicación cuenta con una interfaz web responsiva, backend con API REST, autenticación mediante JWT, control de acceso por roles, validaciones, manejo de errores, historial de acciones, reportes PDF y una aplicación móvil conectada al mismo backend.

Este proyecto está orientado a mejorar la eficiencia operativa, reducir errores en la información y permitir una mejor trazabilidad de las actividades empresariales.

---

# 🎯 2. Objetivo del Sistema

Desarrollar una aplicación web empresarial Full-Stack que permita gestionar clientes, proyectos y tareas mediante una plataforma moderna, segura, responsiva y conectada a una base de datos en la nube.

---

# ✅ 3. Funcionalidades Principales

El sistema cuenta con las siguientes funcionalidades:

- Inicio de sesión de usuarios.
- Autenticación mediante JWT.
- Control de acceso por roles.
- Gestión de usuarios.
- Gestión de clientes.
- Gestión de proyectos.
- Gestión de tareas.
- Seguimiento de avance de tareas.
- Historial de acciones.
- Generación de reportes PDF.
- Validaciones en formularios.
- Manejo de mensajes de éxito y error.
- Consumo de API REST.
- Base de datos en la nube.
- Aplicación móvil conectada al backend.
- Despliegue en servicios gratuitos.

---

# 🧱 4. Arquitectura del Sistema

El sistema utiliza una arquitectura cliente-servidor dividida en cuatro partes principales:

## 🌐 4.1 Frontend Web

El frontend web es la interfaz principal utilizada por los usuarios desde el navegador.

Está desarrollado con React.js y Vite, permitiendo una experiencia rápida, moderna y responsiva.

El frontend se comunica con el backend mediante peticiones HTTP a la API REST.

---

## ⚙️ 4.2 Backend API REST

El backend fue desarrollado con Node.js y Express.js.

Es el encargado de procesar las solicitudes del frontend y de la aplicación móvil, validar la información, autenticar usuarios, controlar permisos y comunicarse con la base de datos MongoDB Atlas.

---

## 🗄️ 4.3 Base de Datos

La base de datos utilizada es MongoDB Atlas.

En ella se almacena la información de usuarios, clientes, proyectos, tareas e historial de acciones.

---

## 📱 4.4 Aplicación Móvil

La aplicación móvil fue desarrollada con React Native y Expo.

Esta aplicación consume la misma API REST utilizada por la versión web, permitiendo que la información esté sincronizada entre ambas plataformas.

---

# 🛠️ 5. Tecnologías Utilizadas

## 🌐 Frontend Web

- React.js
- Vite
- React Router DOM
- Axios
- CSS personalizado
- Diseño responsivo

---

## ⚙️ Backend

- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JSON Web Token, JWT
- bcryptjs
- CORS
- dotenv

---

## 📱 Aplicación Móvil

- React Native
- Expo
- Axios
- Expo Go

---

## 🗄️ Base de Datos

- MongoDB Atlas

---

## 🧰 Herramientas de Desarrollo

- Visual Studio Code
- Git
- GitHub
- Postman o Thunder Client
- Navegador web
- Render
- Vercel o Netlify

---

# 📂 6. Estructura General del Proyecto

```txt
proyecto-fullstack-empresarial/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middlewares/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   └── server.js
│   ├── package.json
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── styles/
│   │   └── App.jsx
│   ├── package.json
│   └── vite.config.js
│
├── mobile/
│   ├── src/
│   │   ├── components/
│   │   ├── screens/
│   │   ├── services/
│   │   └── navigation/
│   ├── App.js
│   └── package.json
│
└── README.md
```

---

# 🔐 7. Módulo de Autenticación

El módulo de autenticación permite que los usuarios ingresen al sistema mediante correo electrónico y contraseña.

Cuando el usuario inicia sesión correctamente, el backend genera un token JWT que se utiliza para acceder a las rutas protegidas del sistema.

## Funciones principales

- Inicio de sesión.
- Validación de credenciales.
- Generación de token JWT.
- Protección de rutas privadas.
- Control de sesión en el frontend.
- Cierre de sesión.

## Nota de seguridad

El sistema no permite registro público de usuarios.  

Los usuarios son creados y administrados únicamente por un usuario con rol Administrador.

Esto permite mantener un mayor control sobre el acceso al sistema.

---

# 👥 8. Módulo de Usuarios

El módulo de usuarios permite administrar las cuentas que tienen acceso al sistema.

## Funciones principales

- Crear usuarios.
- Listar usuarios.
- Editar usuarios.
- Eliminar usuarios.
- Asignar roles.
- Controlar permisos según rol.

## Roles disponibles

- Administrador.
- Usuario.

## Permisos del Administrador

El administrador puede:

- Gestionar usuarios.
- Gestionar clientes.
- Gestionar proyectos.
- Gestionar tareas.
- Consultar historial.
- Generar reportes.

## Permisos del Usuario

El usuario puede acceder únicamente a las funciones permitidas según su rol dentro del sistema.

---

# 🧾 9. Módulo de Clientes

El módulo de clientes permite administrar la información de los clientes de la empresa.

## Funciones principales

- Crear clientes.
- Listar clientes.
- Editar clientes.
- Eliminar clientes.
- Validar información ingresada.
- Asociar clientes a proyectos.

## Campos principales

- Nombre.
- Correo electrónico.
- Teléfono.
- Empresa.
- Estado.

## Validaciones aplicadas

- Nombre obligatorio.
- Correo obligatorio.
- Formato válido de correo electrónico.
- Teléfono obligatorio.
- Empresa obligatoria.
- Validación de clientes duplicados.

---

# 📁 10. Módulo de Proyectos

El módulo de proyectos permite crear y administrar proyectos asociados a clientes.

## Funciones principales

- Crear proyectos.
- Listar proyectos.
- Editar proyectos.
- Eliminar proyectos.
- Asociar proyectos a clientes.
- Consultar detalles del proyecto.
- Visualizar tareas relacionadas al proyecto.

## Campos principales

- Nombre del proyecto.
- Descripción.
- Cliente asociado.
- Fecha de inicio.
- Fecha de finalización.
- Estado del proyecto.

## Validaciones aplicadas

- Nombre obligatorio.
- Descripción obligatoria.
- Cliente obligatorio.
- Fecha de inicio obligatoria.
- Fecha de finalización obligatoria.
- Validación de fechas.
- Estado obligatorio.

---

# ✅ 11. Módulo de Tareas

El módulo de tareas permite administrar actividades pertenecientes a los proyectos.

Cada tarea puede tener un responsable, prioridad, estado y porcentaje de progreso.

## Funciones principales

- Crear tareas.
- Listar tareas.
- Editar tareas.
- Eliminar tareas.
- Asignar responsable.
- Definir prioridad.
- Cambiar estado.
- Registrar avance.
- Dar seguimiento a tareas.

## Campos principales

- Nombre de la tarea.
- Descripción.
- Proyecto asociado.
- Responsable.
- Prioridad.
- Estado.
- Progreso.

## Validaciones aplicadas

- Nombre obligatorio.
- Proyecto obligatorio.
- Responsable obligatorio.
- Prioridad obligatoria.
- Estado obligatorio.
- Progreso dentro del rango permitido.
- Validación de datos incompletos.

---

# 🕘 12. Módulo de Historial

El módulo de historial registra automáticamente acciones importantes realizadas dentro del sistema.

Este módulo permite mantener trazabilidad de las operaciones realizadas por los usuarios.

## Eventos registrados

- Creación de clientes.
- Actualización de clientes.
- Eliminación de clientes.
- Creación de proyectos.
- Actualización de proyectos.
- Eliminación de proyectos.
- Creación de tareas.
- Actualización de tareas.
- Eliminación de tareas.
- Cambio de estado de tareas.
- Cambio de progreso de tareas.
- Seguimiento de tareas.
- Creación de usuarios.
- Actualización de usuarios.
- Eliminación de usuarios.
- Generación de reportes.

## Corrección implementada

Durante el desarrollo se corrigió el registro de seguimiento de tareas agregando el siguiente tipo al modelo `History.js`:

```js
'task_followup_created'
```

Esto permite guardar correctamente los seguimientos realizados sobre las tareas.

---

# 📄 13. Módulo de Reportes PDF

El sistema permite generar reportes en formato PDF con información del sistema.

Este módulo facilita la presentación de datos para revisión, impresión o entrega administrativa.

## Información incluida en los reportes

- Información general de proyectos.
- Tareas relacionadas.
- Estado de avance.
- Responsables.
- Porcentaje de progreso.
- Fechas importantes.
- Historial de actividades.

---

# 🗄️ 14. Base de Datos

La base de datos utilizada es MongoDB Atlas, un servicio de base de datos en la nube.

## Colecciones principales

```txt
users
clients
projects
tasks
histories
```

## Relación lógica de entidades

- Un cliente puede tener varios proyectos.
- Un proyecto pertenece a un cliente.
- Un proyecto puede tener varias tareas.
- Una tarea pertenece a un proyecto.
- Una tarea puede tener un responsable.
- El historial almacena acciones realizadas dentro del sistema.

---

# 🔒 15. Seguridad Implementada

## 15.1 Autenticación con JWT

El backend genera un token JWT cuando el usuario inicia sesión correctamente.

Ejemplo general:

```js
const token = jwt.sign(
  { id: user._id, role: user.role },
  process.env.JWT_SECRET,
  { expiresIn: '7d' }
);
```

El token se utiliza para acceder a rutas protegidas del sistema.

---

## 15.2 Encriptación de Contraseñas

Las contraseñas de los usuarios se almacenan cifradas utilizando bcryptjs.

Ejemplo general:

```js
const hashedPassword = await bcrypt.hash(password, 10);
```

Esto evita almacenar contraseñas en texto plano dentro de la base de datos.

---

## 15.3 Protección de Rutas

El backend utiliza middlewares para verificar que el usuario esté autenticado antes de acceder a rutas privadas.

## Validaciones realizadas

- Verificación de existencia del token.
- Validación del token JWT.
- Obtención de datos del usuario autenticado.
- Control de permisos según rol.

---

## 15.4 Control de Roles

El sistema limita el acceso a ciertas funciones dependiendo del rol del usuario.

## Ejemplo de permisos

- El administrador puede gestionar usuarios, clientes, proyectos, tareas, historial y reportes.
- El usuario puede acceder únicamente a las funciones permitidas según su rol.

---

## 15.5 Variables de Entorno

Los datos sensibles no deben almacenarse directamente en el código fuente.

Ejemplo de archivo `.env.example`:

```env
PORT=5000
MONGODB_URI=TU_URI_DE_MONGODB_ATLAS
JWT_SECRET=TU_CLAVE_SECRETA
FRONTEND_URL=https://tu-frontend.vercel.app
```

El archivo `.env` real no debe subirse al repositorio de GitHub.

---

# 🧪 16. Validaciones del Sistema

El sistema cuenta con validaciones tanto en frontend como en backend.

---

## 16.1 Validaciones en Frontend

Se validan los datos antes de enviarlos al servidor.

## Validaciones comunes

- Campos obligatorios.
- Formato de correo electrónico.
- Contraseña mínima.
- Fechas válidas.
- Selección de cliente en proyectos.
- Selección de proyecto en tareas.
- Progreso dentro de un rango permitido.
- Mensajes de error al usuario.

Ejemplo general:

```js
if (!email || !password) {
  setError('Todos los campos son obligatorios');
}
```

---

## 16.2 Validaciones en Backend

El backend valida nuevamente los datos recibidos para evitar registros incorrectos.

## Validaciones comunes

- Campos requeridos.
- Correos duplicados.
- IDs válidos.
- Existencia de registros relacionados.
- Permisos de usuario.
- Manejo de errores internos.

Ejemplo general:

```js
if (!name) {
  return res.status(400).json({
    message: 'El nombre es obligatorio'
  });
}
```

---

# 🌐 17. API REST

El backend expone endpoints REST para la comunicación con el frontend y la aplicación móvil.

---

## 17.1 Autenticación

```http
POST /api/auth/login
```

Permite iniciar sesión y obtener un token JWT.

---

## 17.2 Usuarios

```http
GET /api/users
POST /api/users
PUT /api/users/:id
DELETE /api/users/:id
```

Permite realizar operaciones CRUD sobre usuarios.

---

## 17.3 Clientes

```http
GET /api/clients
POST /api/clients
PUT /api/clients/:id
DELETE /api/clients/:id
```

Permite realizar operaciones CRUD sobre clientes.

---

## 17.4 Proyectos

```http
GET /api/projects
POST /api/projects
GET /api/projects/:id
PUT /api/projects/:id
DELETE /api/projects/:id
```

Permite realizar operaciones CRUD sobre proyectos.

---

## 17.5 Tareas

```http
GET /api/tasks
POST /api/tasks
GET /api/tasks/:id
PUT /api/tasks/:id
DELETE /api/tasks/:id
```

Permite realizar operaciones CRUD sobre tareas.

---

## 17.6 Historial

```http
GET /api/history
```

Permite consultar el historial de acciones registradas en el sistema.

---

## 17.7 Reportes

```http
GET /api/reports
GET /api/reports/pdf
```

Permite generar y consultar reportes del sistema.

---

# 💻 18. Configuración Local del Proyecto

## 18.1 Requisitos Previos

Antes de ejecutar el proyecto se debe contar con:

- Node.js instalado.
- npm instalado.
- Cuenta en MongoDB Atlas.
- Git instalado.
- Editor de código, preferiblemente Visual Studio Code.
- Navegador web.

---

## 18.2 Clonar el Repositorio

```bash
git clone https://github.com/USUARIO/NOMBRE_REPOSITORIO.git
cd NOMBRE_REPOSITORIO
```

---

## 18.3 Configurar Backend

Ingresar a la carpeta del backend:

```bash
cd backend
```

Instalar dependencias:

```bash
npm install
```

Crear archivo `.env` tomando como base `.env.example`:

```env
PORT=5000
MONGODB_URI=TU_URI_DE_MONGODB_ATLAS
JWT_SECRET=TU_CLAVE_SECRETA
FRONTEND_URL=http://localhost:5173
```

Ejecutar backend en desarrollo:

```bash
npm run dev
```

El backend se ejecutará en:

```txt
http://localhost:5000
```

---

## 18.4 Configurar Frontend

Ingresar a la carpeta del frontend:

```bash
cd frontend
```

Instalar dependencias:

```bash
npm install
```

Ejecutar frontend:

```bash
npm run dev
```

El frontend se ejecutará en:

```txt
http://localhost:5173
```

---

## 18.5 Configurar Aplicación Móvil

Ingresar a la carpeta mobile:

```bash
cd mobile
```

Instalar dependencias:

```bash
npm install
```

Ejecutar Expo:

```bash
npx expo start --tunnel
```

Luego se debe escanear el código QR desde la aplicación Expo Go en el dispositivo móvil.

---

# 🚀 19. Despliegue del Sistema

---

## 19.1 Despliegue del Backend

El backend puede desplegarse en Render.

## Configuración recomendada

```txt
Build Command: npm install
Start Command: npm start
```

## Variables de entorno en Render

```env
PORT=5000
MONGODB_URI=URI_REAL_DE_MONGODB
JWT_SECRET=CLAVE_SECRETA_SEGURA
FRONTEND_URL=https://tu-frontend.vercel.app
```

---

## 19.2 Despliegue del Frontend

El frontend puede desplegarse en Vercel o Netlify.

## Configuración recomendada

```txt
Build Command: npm run build
Output Directory: dist
```

En caso de utilizar una URL de API mediante variables de entorno, se debe configurar la URL pública del backend desplegado.

---

## 19.3 Despliegue de Base de Datos

La base de datos se encuentra alojada en MongoDB Atlas.

## Pasos generales

1. Crear un clúster en MongoDB Atlas.
2. Crear usuario de base de datos.
3. Configurar acceso por IP.
4. Obtener cadena de conexión.
5. Agregar la cadena de conexión en las variables de entorno del backend.

---

# 🔄 20. Manejo de CORS

El backend permite la comunicación entre el frontend y la API mediante CORS.

Configuración general:

```js
origin: [
  'http://localhost:5173',
  process.env.FRONTEND_URL
]
```

Esto permite trabajar localmente y también en producción con la URL pública del frontend.

---

# 📱 21. Aplicación Móvil

La aplicación móvil fue desarrollada utilizando React Native con Expo.

## Características

- Inicio de sesión.
- Conexión con el backend principal.
- Consumo de API REST.
- Visualización de información del sistema.
- Sincronización con la aplicación web.
- Pruebas desde Expo Go.

## Ejecución

```bash
cd mobile
npm install
npx expo start --tunnel
```

El modo `--tunnel` permite probar la aplicación aunque el celular no esté en la misma red local que la computadora.

---

# 🧪 22. Pruebas Realizadas

---

## 22.1 Pruebas de Autenticación

- Inicio de sesión con usuario válido.
- Inicio de sesión con contraseña incorrecta.
- Acceso a rutas protegidas sin token.
- Cierre de sesión.

---

## 22.2 Pruebas de Clientes

- Crear cliente.
- Editar cliente.
- Eliminar cliente.
- Validar campos obligatorios.
- Validar correo electrónico.
- Validar información duplicada.

---

## 22.3 Pruebas de Proyectos

- Crear proyecto asociado a cliente.
- Editar proyecto.
- Eliminar proyecto.
- Validar fechas.
- Cambiar estado del proyecto.
- Visualizar detalle del proyecto.

---

## 22.4 Pruebas de Tareas

- Crear tarea asociada a proyecto.
- Editar tarea.
- Eliminar tarea.
- Cambiar prioridad.
- Cambiar estado.
- Actualizar progreso.
- Registrar seguimiento.

---

## 22.5 Pruebas de Historial

- Verificar registro de creación.
- Verificar registro de edición.
- Verificar registro de eliminación.
- Verificar registro de seguimiento de tareas.
- Verificar corrección del tipo `task_followup_created`.

---

## 22.6 Pruebas de Reportes

- Generación de reportes PDF.
- Visualización del archivo generado.
- Verificación de información de proyectos.
- Verificación de información de tareas.
- Verificación de responsables y avances.

---

## 22.7 Pruebas en Aplicación Móvil

- Inicio de sesión desde Expo Go.
- Consulta de información desde el backend desplegado.
- Sincronización entre web y móvil.
- Prueba de cambios reflejados en ambas plataformas.

---

# 🧾 23. Comandos Importantes

## Backend

```bash
cd backend
npm install
npm run dev
npm start
```

---

## Frontend

```bash
cd frontend
npm install
npm run dev
npm run build
```

---

## Mobile

```bash
cd mobile
npm install
npx expo start
npx expo start --tunnel
```

---

## Git

```bash
git add .
git commit -m "Actualización del sistema"
git push
```

---

# 🧹 24. Buenas Prácticas Aplicadas

- Separación entre frontend, backend y mobile.
- Uso de arquitectura modular.
- Controladores separados por módulo.
- Modelos definidos con Mongoose.
- Rutas REST organizadas.
- Uso de variables de entorno.
- Autenticación mediante JWT.
- Contraseñas cifradas.
- Validaciones en frontend y backend.
- Manejo de errores.
- Código organizado.
- Uso de Git y GitHub.
- Despliegue en servicios gratuitos.
- Base de datos en la nube.
- No subir credenciales sensibles al repositorio.

---

# 🛡️ 25. Recomendaciones de Seguridad

Para mantener seguro el proyecto, se recomienda:

- No subir el archivo `.env` al repositorio.
- Usar `.env.example` como plantilla.
- Cambiar periódicamente el `JWT_SECRET`.
- No compartir credenciales de MongoDB Atlas.
- Restringir accesos innecesarios en MongoDB Atlas.
- Mantener las dependencias actualizadas.
- Revisar permisos de usuario.
- Utilizar HTTPS en producción.
- No exponer contraseñas ni tokens en el frontend.
- Revisar los logs del backend periódicamente.

---

# 🛠️ 26. Mantenimiento del Sistema

Para mantener el sistema funcionando correctamente se recomienda:

- Revisar logs del backend en Render.
- Verificar el estado del clúster en MongoDB Atlas.
- Probar periódicamente el inicio de sesión.
- Revisar que los reportes PDF se generen correctamente.
- Validar que el frontend esté consumiendo la URL correcta del backend.
- Mantener actualizado el repositorio de GitHub.
- Realizar pruebas después de cada cambio importante.
- Verificar que las variables de entorno sigan configuradas correctamente.
- Revisar que no existan errores de CORS en producción.

---

# 🧩 27. Problemas Solucionados Durante el Desarrollo

## 27.1 Registro de seguimiento de tareas

Durante las pruebas se detectó que el historial no aceptaba el tipo de evento utilizado para registrar seguimientos de tareas.

## Problema

```txt
'task_followup_created' is not a valid enum value
```

## Solución

Se agregó el valor correspondiente en el modelo `History.js`:

```js
'task_followup_created'
```

Con esta corrección, el sistema registra correctamente los seguimientos realizados sobre las tareas.

---

## 27.2 Configuración de CORS

Se configuró el backend para permitir solicitudes desde el entorno local y desde el frontend desplegado.

Configuración general:

```js
origin: [
  'http://localhost:5173',
  process.env.FRONTEND_URL
]
```

---

# 📊 28. Cumplimiento de Requerimientos

## Requerimientos funcionales cumplidos

- Gestión de usuarios.
- Inicio de sesión.
- Control de roles.
- Gestión de clientes.
- Gestión de proyectos.
- Gestión de tareas.
- CRUD completo.
- Protección de rutas.
- Mensajes de éxito y error.
- Historial de acciones.
- Reportes PDF.

---

## Requerimientos técnicos cumplidos

- Frontend con framework moderno.
- Diseño responsivo.
- Consumo de API REST.
- Formularios con validaciones.
- Backend con Node.js y Express.
- API REST segura.
- Autenticación JWT.
- CRUD completo.
- Manejo de errores.
- Base de datos en la nube.
- Modelado de entidades.
- Despliegue en servicios gratuitos.

---

# 🏁 29. Conclusión

El Sistema Web Empresarial Full-Stack cumple con los requerimientos principales de una aplicación empresarial moderna.

La plataforma permite gestionar usuarios, clientes, proyectos y tareas de manera centralizada, segura y eficiente. Además, cuenta con autenticación JWT, control de roles, validaciones, historial de acciones, generación de reportes PDF, base de datos en la nube y una aplicación móvil conectada al mismo backend.

El proyecto fue desarrollado utilizando tecnologías actuales y buenas prácticas de programación, permitiendo su despliegue en servicios gratuitos y su acceso desde internet.

---
