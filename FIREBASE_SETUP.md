# Configuración de Firebase

Sigue estos pasos para conectar la aplicación Recovery App a Firebase.

## 1. Crear proyecto en Firebase

1. Ve a [console.firebase.google.com](https://console.firebase.google.com)
2. Haz clic en **"Agregar proyecto"**
3. Ingresa el nombre del proyecto (ej. `recovery-app`)
4. Haz clic en **"Continuar"** y sigue los pasos del asistente
5. Selecciona la plataforma **Web** (`</>`) para obtener las credenciales

## 2. Habilitar Autenticación

1. En el panel izquierdo, ve a **Autenticación** → **Método de acceso**
2. Haz clic en **"Correo electrónico/Contraseña"**
3. Activa el primer interruptor y guarda
4. Ve a **Usuarios** → **Agregar usuario** y crea el usuario administrador

## 3. Crear base de datos Firestore

1. En el panel izquierdo, ve a **Firestore Database**
2. Haz clic en **"Crear base de datos"**
3. Selecciona la región más cercana (ej. `us-central1`)
4. Elige **"Iniciar en modo de prueba"** (para desarrollo)
5. Haz clic en **"Habilitar"**

### Reglas de seguridad recomendadas (para producción):

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## 4. Copiar credenciales

1. Ve a **Configuración del proyecto** (ícono de engranaje) → **General**
2. Desplázate hasta la sección **"Tus apps"**
3. Copia el objeto `firebaseConfig`
4. Abre el archivo `services/firebase.js` y reemplaza los valores de ejemplo:

```js
const firebaseConfig = {
  apiKey: "AIzaSy...",           // tu apiKey real
  authDomain: "tu-proyecto.firebaseapp.com",
  projectId: "tu-proyecto",
  storageBucket: "tu-proyecto.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

## 5. Instalar dependencias

Ejecuta el siguiente comando en la raíz del proyecto:

```bash
npm install firebase
```

## 6. Probar la conexión

Inicia la aplicación con:

```bash
npx expo start
```

Si las credenciales son correctas, el inicio de sesión usará Firebase en lugar del modo demo.

---

## Modo Demo (sin Firebase)

Si no configuras Firebase, la aplicación funciona con datos de demostración:

- **Correo:** `admin@recovery.com`
- **Contraseña:** `123456`

Los datos demo incluyen pacientes y citas de ejemplo con nombres mexicanos.
