# 💳 Sistema de Membresías

Aplicación móvil multiplataforma desarrollada con React Native y Expo para la gestión de membresías y suscripciones. Permite a los usuarios registrarse, explorar planes de membresía en diferentes categorías y gestionar sus suscripciones activas.

## 📋 Tabla de Contenidos

- [Características](#-características)
- [Tecnologías](#-tecnologías)
- [Requisitos Previos](#-requisitos-previos)
- [Instalación](#-instalación)
- [Configuración](#-configuración)
- [Uso](#-uso)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Scripts Disponibles](#-scripts-disponibles)
- [Arquitectura](#-arquitectura)
- [Variables de Entorno](#-variables-de-entorno)
- [Contribuir](#-contribuir)
- [Licencia](#-licencia)

## ✨ Características

- 🔐 **Autenticación de usuarios** con Firebase Authentication
  - Registro de nuevos usuarios
  - Inicio de sesión
  - Gestión de sesión persistente
- 📱 **Gestión de Planes de Membresía**
  - Múltiples categorías: Fitness, Streaming, E-learning, Coworking, Servicios Digitales
  - Visualización de planes con precios mensuales y anuales
  - Detalles de cada plan con características y beneficios
- 👤 **Perfil de Usuario**
  - Información del usuario
  - Gestión de suscripciones activas
  - Cancelación de suscripciones
- 🎨 **Interfaz Moderna**
  - Diseño limpio y minimalista
  - Componentes reutilizables
  - Navegación intuitiva
- 🔒 **Rutas Protegidas**
  - Acceso restringido a usuarios autenticados
  - Redirección automática según estado de autenticación

## 🛠 Tecnologías

- **React Native** (0.81.5) - Framework para aplicaciones móviles
- **Expo** (~54.0.20) - Plataforma para desarrollo React Native
- **Expo Router** (~6.0.13) - Sistema de navegación basado en archivos
- **TypeScript** (5.9.2) - Tipado estático
- **Firebase** (12.4.0) - Backend como servicio
  - Firebase Authentication - Autenticación
  - Cloud Firestore - Base de datos
- **React Navigation** (7.1.8) - Navegación entre pantallas
- **React Native Safe Area Context** (5.6.0) - Manejo de áreas seguras

## 📦 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js** (versión 18 o superior)
- **npm** o **yarn**
- **Git**
- **Expo CLI** (se instala automáticamente con npm)
- Para desarrollo iOS: **Xcode** (solo en macOS)
- Para desarrollo Android: **Android Studio** y **Android SDK**

## 🚀 Instalación

1. **Clonar el repositorio**

   ```bash
   git clone https://github.com/Martin10123/prueba-tecnica.git
   cd prueba-tecnica
   ```

2. **Instalar dependencias**

   ```bash
   npm install
   ```

   O si prefieres usar yarn:

   ```bash
   yarn install
   ```

3. **Configurar Firebase** (ver sección de Configuración)

## ⚙️ Configuración

### Configuración de Firebase

La aplicación utiliza Firebase para autenticación y almacenamiento de datos. Las credenciales de Firebase están configuradas en `app.json` dentro de `extra.env`. Si necesitas usar tus propias credenciales:

1. Crea un proyecto en [Firebase Console](https://console.firebase.google.com/)
2. Habilita Firebase Authentication (Email/Password)
3. Crea una base de datos Firestore
4. Actualiza las variables en `app.json`:

   ```json
   "extra": {
     "env": {
       "FIREBASE_API_KEY": "tu-api-key",
       "FIREBASE_AUTH_DOMAIN": "tu-proyecto.firebaseapp.com",
       "FIREBASE_PROJECT_ID": "tu-proyecto-id",
       "FIREBASE_STORAGE_BUCKET": "tu-proyecto.firebasestorage.app",
       "FIREBASE_MESSAGING_SENDER_ID": "tu-sender-id",
       "FIREBASE_APP_ID": "tu-app-id"
     }
   }
   ```

### Estructura de Firestore

La aplicación espera las siguientes colecciones en Firestore:

- **`users`**: Documentos de usuarios con estructura:
  ```typescript
  {
    name: string;
    email: string;
    createdAt: Timestamp;
    subscriptions: Subscription[];
  }
  ```

- **`plans`**: Colección de planes de membresía (se seed automáticamente si está vacía)

- **`subscriptions`**: Suscripciones de usuarios

## 💻 Uso

### Desarrollo

1. **Iniciar el servidor de desarrollo**

   ```bash
   npm start
   ```

   O con opciones específicas:

   ```bash
   # Para Android
   npm run android

   # Para iOS
   npm run ios

   # Para Web
   npm run web
   ```

2. **Escanear el código QR**

   - Instala la app **Expo Go** en tu dispositivo móvil
   - Escanea el código QR que aparece en la terminal o navegador
   - La app se cargará en tu dispositivo

3. **Usar un emulador/simulador**

   - Presiona `a` para abrir en Android Emulator
   - Presiona `i` para abrir en iOS Simulator (solo macOS)

### Flujo de la Aplicación

1. **Pantalla Inicial**: Muestra opciones para iniciar sesión o registrarse
2. **Autenticación**: Usuario se registra o inicia sesión
3. **Planes**: Una vez autenticado, el usuario es redirigido a la lista de planes
4. **Detalles del Plan**: El usuario puede ver detalles de cada plan
5. **Suscripción**: El usuario puede suscribirse a un plan
6. **Perfil**: El usuario puede ver y gestionar sus suscripciones desde el perfil

## 📁 Estructura del Proyecto

```
prueba-tecnica/
├── app/                          # Rutas de la aplicación (Expo Router)
│   ├── _layout.tsx              # Layout principal
│   ├── index.tsx                # Pantalla de inicio
│   ├── auth/                    # Rutas de autenticación
│   │   ├── login.tsx           # Pantalla de login
│   │   └── register.tsx        # Pantalla de registro
│   └── (protected)/            # Rutas protegidas
│       ├── _layout.tsx         # Layout con navegación
│       ├── plans/             # Pantallas de planes
│       │   ├── index.tsx      # Lista de planes
│       │   └── [planId].tsx   # Detalle de plan
│       └── profile.tsx        # Perfil de usuario
├── src/
│   ├── core/                   # Lógica de negocio
│   │   ├── auth/              # Servicios de autenticación
│   │   │   ├── firebaseAuth.ts
│   │   │   └── service.ts
│   │   ├── plans/             # Servicios de planes
│   │   │   ├── firestore.ts
│   │   │   └── service.ts
│   │   ├── subscriptions/     # Servicios de suscripciones
│   │   │   └── service.ts
│   │   ├── types.ts           # Tipos TypeScript
│   │   └── user/              # Contexto de usuario
│   │       └── UserProvider.tsx
│   ├── infra/                 # Infraestructura
│   │   ├── firebase/          # Configuración de Firebase
│   │   │   └── config.ts
│   │   └── api.ts
│   └── ui/                    # Componentes de UI
│       ├── atoms/            # Componentes básicos
│       │   ├── Button.tsx
│       │   ├── Text.tsx
│       │   ├── Input.tsx
│       │   ├── Avatar.tsx
│       │   ├── colors.ts
│       │   └── ...
│       └── components/        # Componentes compuestos
│           └── NavBar.tsx
├── app.json                   # Configuración de Expo
├── package.json              # Dependencias del proyecto
└── tsconfig.json            # Configuración de TypeScript
```

## 🎯 Scripts Disponibles

- `npm start` - Inicia el servidor de desarrollo de Expo
- `npm run android` - Inicia la app en Android
- `npm run ios` - Inicia la app en iOS (solo macOS)
- `npm run web` - Inicia la app en el navegador web
- `npm run lint` - Ejecuta el linter para verificar el código
- `npm run reset-project` - Restablece el proyecto a un estado inicial

## 🏗 Arquitectura

La aplicación sigue una arquitectura modular:

- **UI Layer** (`src/ui/`): Componentes reutilizables y componentes de UI
- **Business Logic** (`src/core/`): Lógica de negocio, servicios y providers
- **Infrastructure** (`src/infra/`): Configuración de servicios externos (Firebase)
- **Routes** (`app/`): Navegación y pantallas usando Expo Router

### Principios de Diseño

- **Separación de responsabilidades**: Cada módulo tiene una responsabilidad clara
- **Reutilización**: Componentes UI reutilizables en `src/ui/atoms`
- **Tipado fuerte**: Uso extensivo de TypeScript para type safety
- **Context API**: Estado global del usuario mediante React Context

## 🔐 Variables de Entorno

Las variables de entorno están configuradas en `app.json` bajo `extra.env`. Puedes acceder a ellas mediante `expo-constants`:

```typescript
import Constants from "expo-constants";
const apiKey = Constants.expoConfig?.extra?.env?.FIREBASE_API_KEY;
```

## 📝 Categorías de Planes

La aplicación soporta las siguientes categorías de planes:

1. **Fitness** 💪 - Planes de gimnasio (Basic, Plus, Elite)
2. **Streaming** 📺 - Planes de streaming (Individual, Familiar, Premium)
3. **E-learning** 📚 - Planes de cursos en línea
4. **Coworking** 🏢 - Planes de espacios de trabajo compartido
5. **Servicios Digitales** 💻 - Planes de servicios digitales

## 🤝 Contribuir

Las contribuciones son bienvenidas. Para contribuir:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto es privado y todos los derechos están reservados.

## 👤 Autor

**Martin Elias**

- GitHub: [@Martin10123](https://github.com/Martin10123)
- Repositorio: [https://github.com/Martin10123/prueba-tecnica](https://github.com/Martin10123/prueba-tecnica)

## 🙏 Agradecimientos

- [Expo](https://expo.dev/) por la excelente plataforma de desarrollo
- [Firebase](https://firebase.google.com/) por los servicios backend
- La comunidad de React Native

---

Si tienes preguntas o sugerencias, no dudes en abrir un issue en el repositorio.
