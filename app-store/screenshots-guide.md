# Guía de Capturas de Pantalla — App Store

Esta guía describe los requisitos y recomendaciones para preparar las capturas de pantalla de Recovery App para su publicación en la App Store de Apple.

## Tamaños requeridos para iPhone

Apple exige capturas de pantalla en los siguientes tamaños. Son obligatorias al menos las de 6.9" y 6.5" (o 5.5"):

| Dispositivo          | Resolución (píxeles) | Orientación |
|----------------------|----------------------|-------------|
| iPhone 6.9" (Pro Max) | 1320 x 2868          | Vertical    |
| iPhone 6.5"           | 1284 x 2778          | Vertical    |
| iPhone 5.5"           | 1242 x 2208          | Vertical    |

> **Nota:** Si subes capturas para 6.9", Apple las usará automáticamente para los modelos de 6.7". Las de 6.5" cubren los modelos anteriores de iPhone Plus/Max.

## Pantallas recomendadas para capturar

Se recomienda incluir entre 5 y 10 capturas de pantalla que muestren las funciones principales de la app. A continuación se listan las 5 más importantes:

### 1. Pantalla de inicio de sesión (Login)
- Muestra la pantalla de login con el logo de Recovery App sobre el fondo azul (#2196F3).
- Transmite confianza y profesionalismo desde el primer vistazo.
- **Texto sugerido sobre la captura:** "Acceso seguro para tu equipo clínico"

### 2. Panel principal con estadísticas (Dashboard)
- Captura el dashboard mostrando tarjetas con resumen de pacientes activos, citas del día y clínicas.
- Demuestra la visión global que ofrece la app.
- **Texto sugerido:** "Todo tu centro de rehabilitación en un vistazo"

### 3. Lista de pacientes
- Muestra la pantalla de listado de pacientes con fotos de perfil, nombres y estado del tratamiento.
- Resalta la facilidad de búsqueda y acceso a expedientes.
- **Texto sugerido:** "Gestiona todos tus pacientes en un solo lugar"

### 4. Programación de citas
- Captura el módulo de agenda/citas mostrando un calendario con citas programadas.
- Transmite organización y eficiencia en la gestión del tiempo.
- **Texto sugerido:** "Agenda inteligente sin conflictos de horario"

### 5. Tarjetas de clínica (Clinic Cards)
- Muestra la pantalla de selección o listado de clínicas con sus tarjetas visuales.
- Resalta el soporte multi-clínica como diferenciador clave.
- **Texto sugerido:** "Administra todas tus sucursales desde una app"

## Consejos para capturas de pantalla de calidad

### Preparación del dispositivo
- Usa un iPhone físico o el Simulador de Xcode con los tamaños indicados.
- Asegúrate de que la barra de estado muestre hora fija (09:41 AM es el estándar de Apple) y batería al 100%.
- En Xcode Simulator puedes usar `Simulator > Device > Override Status Bar` para fijar estos valores.
- Usa datos de demostración realistas (nombres ficticios, citas coherentes).

### Diseño y presentación
- Añade un fondo de color sólido (#2196F3 o blanco) detrás de la captura del dispositivo para crear tarjetas visuales atractivas.
- Agrega textos descriptivos cortos sobre cada captura usando Figma, Canva o herramientas similares.
- Mantén consistencia visual en todas las capturas (misma fuente, mismo estilo de marco de dispositivo).
- Usa el marco del iPhone (device mockup) para dar contexto visual profesional.

### Herramientas recomendadas
- **Figma:** Para diseñar las tarjetas de capturas con textos y marcos.
- **Canva:** Alternativa sencilla con plantillas de App Store listas para usar.
- **Screenshot Designer (App Store Connect):** La propia herramienta de Apple para cargar y previsualizar.
- **Xcode Simulator:** Para capturar directamente en los tamaños correctos.

### Validación antes de subir
- Verifica que cada imagen tenga exactamente la resolución requerida.
- Comprueba que los archivos estén en formato PNG o JPEG.
- Asegúrate de que no haya contenido inapropiado, marcas de agua ni logotipos de terceros.
- Revisa que el contenido sea representativo y honesto de la funcionalidad real de la app.
