# Lista de Verificación — Envío a la App Store

Completa todos los pasos de este checklist antes de enviar Recovery App a revisión de Apple.

---

## Cuenta y configuración inicial

- [ ] **Apple Developer Program** — Cuenta activa con suscripción anual ($99/año). Inscríbete en [developer.apple.com](https://developer.apple.com).
- [ ] **App Store Connect** — Acceso verificado a [appstoreconnect.apple.com](https://appstoreconnect.apple.com).
- [ ] **Certificados y perfiles de aprovisionamiento** — Configurados en Xcode o a través de EAS Build (automático con `eas build`).
- [ ] **Apple Team ID** — Obtenido desde el portal de Apple Developer. Actualizar en `eas.json` → `submit.production.ios.appleTeamId`.
- [ ] **Apple ID** — El correo de tu cuenta Apple Developer. Actualizar en `eas.json` → `submit.production.ios.appleId`.
- [ ] **App Store Connect App ID (ascAppId)** — Creado al registrar la app en App Store Connect. Actualizar en `eas.json` → `submit.production.ios.ascAppId`.

---

## Recursos gráficos

- [ ] **Ícono de la app** — Archivo PNG de 1024x1024 píxeles, sin canal alfa (sin transparencia). Referencia: `assets/icon.png`.
- [ ] **Capturas de pantalla iPhone 6.9"** — Mínimo 1, máximo 10. Resolución: 1320x2868 px. Ver `app-store/screenshots-guide.md`.
- [ ] **Capturas de pantalla iPhone 6.5"** — Mínimo 1, máximo 10. Resolución: 1284x2778 px.
- [ ] **Capturas de pantalla iPhone 5.5"** — Mínimo 1, máximo 10. Resolución: 1242x2208 px.
- [ ] **Capturas para iPad** (opcional, recomendado ya que la app soporta tablet) — 12.9" (2048x2732 px).

---

## Contenido de la ficha en App Store Connect

- [ ] **Nombre de la app** — "Recovery App - Clínica de Rehabilitación" (máx. 30 caracteres el nombre principal).
- [ ] **Subtítulo** — "Gestión integral de pacientes y citas" (máx. 30 caracteres).
- [ ] **Descripción** — Texto completo de hasta 4.000 caracteres. Ver `app-store/description.txt`.
- [ ] **Palabras clave** — Máx. 100 caracteres: `rehabilitación,fisioterapia,pacientes,clínica,citas,salud,médico,terapia,gestión,agenda`.
- [ ] **Novedades (What's New)** — "¡Bienvenido a Recovery App! Primera versión con gestión completa de pacientes, familias, citas y clínicas de rehabilitación."
- [ ] **Categoría principal** — Medical (Médica).
- [ ] **Categoría secundaria** — Business (Negocios).
- [ ] **Clasificación de contenido** — Completar el cuestionario de clasificación por edad en App Store Connect (previsiblemente: 4+).

---

## Información legal y privacidad

- [ ] **Política de Privacidad (URL)** — Publica el archivo `app-store/privacy-policy.md` en una URL pública accesible (p. ej., en el sitio web de la clínica o en GitHub Pages). Esta URL es **obligatoria** para apps que acceden a datos de salud.
- [ ] **URL de soporte** — URL de una página de soporte o contacto (puede ser una página sencilla o un correo de contacto).
- [ ] **URL de marketing** (opcional) — Sitio web de Recovery Clinic.
- [ ] **Revisión de permisos de privacidad** — Verificar que `app.json` incluye `NSCameraUsageDescription` y `NSPhotoLibraryUsageDescription` con descripciones claras.

---

## Build y envío técnico

- [ ] **Versión y número de build correctos** — `version: "1.0.0"` y `buildNumber: "1"` en `app.json`.
- [ ] **Bundle Identifier confirmado** — `com.recoveryclinic.app` registrado en Apple Developer y en `app.json`.
- [ ] **Construir la app para producción:**
  ```bash
  eas build --platform ios --profile production
  ```
- [ ] **Verificar que el build se completó sin errores** en [expo.dev](https://expo.dev) o en la salida del CLI.
- [ ] **Enviar a App Store Connect:**
  ```bash
  eas submit --platform ios
  ```
- [ ] **Verificar en App Store Connect** que el build aparece en la sección "TestFlight & Builds".

---

## Pruebas previas al envío

- [ ] **Pruebas en dispositivo físico** — Instalar y probar el build de producción en al menos un iPhone real.
- [ ] **Flujo completo de usuario** — Verificar login, creación de pacientes, agenda de citas y gestión multi-clínica.
- [ ] **Permisos del sistema** — Confirmar que las solicitudes de cámara y galería muestran los mensajes correctos.
- [ ] **Sin datos de prueba expuestos** — Asegurarse de que la build no incluye credenciales, datos reales de pacientes ni configuraciones de desarrollo.

---

## Envío a revisión

- [ ] **Seleccionar el build** en App Store Connect → tu app → versión → "Build".
- [ ] **Completar información de revisión** — Incluir datos de contacto del revisor, instrucciones de acceso (si la app requiere login) y cualquier nota especial.
- [ ] **Credenciales de demo** (si aplica) — Proporcionar usuario y contraseña de demostración para que el equipo de Apple pueda revisar la app.
- [ ] **Enviar para revisión** haciendo clic en "Submit for Review" en App Store Connect.
- [ ] **Esperar respuesta de Apple** — El proceso de revisión suele tardar entre **1 y 3 días hábiles**.

---

## Después de la aprobación

- [ ] Confirmar la fecha de publicación (inmediata o programada).
- [ ] Verificar que la ficha de la app se ve correctamente en la App Store.
- [ ] Comunicar el lanzamiento al equipo y a las clínicas piloto.
- [ ] Monitorear las métricas iniciales y reseñas en App Store Connect.
