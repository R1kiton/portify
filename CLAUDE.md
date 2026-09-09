Actúa como un Desarrollador Full-Stack Senior y arquitecto de software. Vas a construir la plataforma completa "Prolify", un sistema de tarjetas de presentación digitales dinámicas basado en el documento de requerimientos adjunto.

### Stack Tecnológico a Utilizar
- Framework: Next.js 14+ (App Router, TypeScript)
- UI / Estilos: Tailwind CSS, Shadcn UI, Lucide React Icons
- Base de Datos y Auth: Supabase (PostgreSQL, Supabase Auth, Supabase Storage)
- Utilidades: @react-pdf/renderer (generación de CVs en PDF), qrcode.react (códigos QR), vcard-creator (contacto vCard)

---

### 1. Estructura de Rutas
Implementa las siguientes rutas dentro del App Router:
1. `/[slug]`: Prolify pública visible para cualquier visitante sin autenticación.
2. `/[slug]/admin`: Panel privado de administración del estudiante propietario (requiere auth y validación de propiedad del slug).
3. `/admin`: Panel del Administrador de la Plataforma (gestión global de usuarios y perfiles).
4. `/login`: Pantalla de inicio de sesión unificada.

---

### 2. Modelo de Datos (PostgreSQL / Supabase Schema)
Diseña e implementa el esquema de base de datos considerando:
- **users**: id, email, role ('admin_plataforma' | 'estudiante'), is_active (boolean), created_at.
- **students**: id, user_id (FK), slug (único, ej: 'luisjz'), created_at.
- **profiles**: id, student_id (FK), full_name, career, short_bio, avatar_url, selected_template ('minimal', 'modern', 'classic'), state ('draft' | 'published').
- **cv_sections**: id, profile_id (FK), section_type ('education' | 'experience'), title, institution, start_date, end_date, description, order_index.
- **skills**: id, profile_id (FK), name, category ('technical' | 'soft'), level.
- **projects**: id, profile_id (FK), title, description, role_academic_tag (boolean), github_url, live_url, order_index.
- **contact_links**: id, profile_id (FK), platform ('linkedin' | 'github' | 'email' | 'phone'), url_value.

*Nota de Estado (Borrador vs Publicado):* Cada estudiante administra una versión 'draft' y una 'published'. El visitante en `/[slug]` SOLO puede ver datos con estado 'published'.

---

### 3. Roles, Permisos y Seguridad (RLS)
- **Visitante**: Acceso público de lectura a `/[slug]` solo para perfiles en estado `published`.
- **Estudiante**: Acceso exclusivo de lectura/escritura a `/[slug]/admin` donde `student.user_id === auth.uid()`. No puede modificar ni ver el panel de otros estudiantes. Validación: Impide publicar si falta nombre o carrera.
- **Administrador de Plataforma**: Acceso completo a `/admin`. Puede crear usuarios estudiantes (asignando email, contraseña y slug), activar/desactivar cuentas, restablecer contraseñas, eliminar cuentas y suplantar/entrar al panel de cualquier estudiante para editar y publicar su perfil.

---

### 4. Funcionalidades Requeridas por Módulo

#### A. Vista Pública (Ruta `/[slug]`)
- Jerarquía de contenido:
  1. Header: Foto de perfil, Nombre completo, Carrera/Profesión, Reseña breve.
  2. Bloque principal: CV (Educación y Experiencia), Habilidades categorizadas, Proyectos (etiquetando proyectos académicos) y Contactos. Ocultar secciones vacías.
  3. Tarjeta Digital: Código QR apuntando a la URL actual (`/[slug]`), botón para "Guardar Contacto" (.vcf usando vcard-creator) y botón "Descargar CV en PDF".
- La descarga de PDF debe generar el documento dinámicamente usando la plantilla seleccionada por el estudiante (`selected_template`).

#### B. Panel del Estudiante (Ruta `/[slug]/admin`)
- Formulario interactivo por pestañas/secciones para modificar: Foto, Datos Personales, CV, Habilidades, Proyectos y Contactos.
- Selector visual de plantillas de PDF para la exportación de su CV.
- Botones de acción: "Guardar Borrador", "Previsualizar" (abre la vista previa en nueva pestaña) y "Publicar Cambios".

#### C. Panel del Administrador (Ruta `/admin`)
- Tabla de estudiantes registrados: Muestra email, slug, estado de cuenta (activa/inactiva) y estado del perfil (publicado, borrador, vacío).
- Formulario de creación de nuevos estudiantes (Email, Password temporal, Slug personalizado).
- Acciones de gestión: Activar/Desactivar cuenta, Cambiar contraseña, Eliminar usuario, y botón "Editar como Administrador" que redirige al panel del estudiante seleccionado.

---

### 5. Entregables de Código
Genera el proyecto completo con:
1. Configuración de Supabase (SQL de migración con tablas, FKs y políticas RLS).
2. Componentes UI de Shadcn/Tailwind responsivos (adaptados a móvil, tablet y escritorio).
3. Componente de generación de PDF con `@react-pdf/renderer` ofreciendo al menos 2 plantillas visuales distintas.
4. Generador de archivos vCard y código QR.
5. Datos Mock de prueba (semilla) para un Administrador y dos Estudiantes.