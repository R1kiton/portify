# EProfile — Tarjeta de presentación digital

Plataforma de tarjetas de presentación digitales para estudiantes: perfil,
currículum, proyectos y contacto en una sola ruta permanente
(`eprofile.com/<slug>`), compartible con un enlace fijo y un código QR.

Proyecto integrador — asignatura Nuevas Tecnologías.

## Alcance implementado

- **Roles**: visitante (sin cuenta), estudiante (propietario) y administrador
  de plataforma, cada uno con su propio panel y permisos.
- **EProfile pública** (`/[slug]`): foto, nombre, carrera y reseña primero;
  después CV, habilidades, proyectos, reconocimientos y contacto. Las
  secciones vacías no se muestran.
- **CV en PDF** (`/[slug]/cv.pdf`), generado en el momento a partir de la
  misma información publicada, con **dos plantillas** a elegir (clásica y
  moderna) — punto extra.
- **vCard** (`/[slug]/vcard`) y **tarjeta con código QR** (`/[slug]/card`,
  imprimible) que apuntan a la misma ruta permanente.
- **Panel del estudiante** (`/[slug]/admin`): edición de perfil, foto,
  formación, experiencia, proyectos (con etiqueta de "académico"),
  habilidades y reconocimientos; borrador, vista previa y publicación.
  No se puede publicar sin al menos nombre y carrera.
- **Panel de plataforma** (`/admin`): crear cuentas de estudiante, ver el
  estado de cada perfil (vacío / borrador / publicado) y de la cuenta
  (activa / desactivada), reiniciar contraseña, desactivar/reactivar,
  eliminar, y entrar al panel de cualquier estudiante para apoyarlo.
- **Aislamiento**: cada acción del servidor vuelve a verificar sesión y
  propiedad, no solo la interfaz — un estudiante nunca puede leer ni
  modificar el perfil de otro.
- **Publicación por snapshot**: editar nunca afecta lo público. Publicar
  copia el estado actual a un snapshot; los visitantes y el PDF siempre leen
  ese snapshot, nunca el borrador en edición.

## Checklist de criterios de aceptación

- [x] La primera vista muestra foto, nombre, carrera y reseña antes que el resto.
- [x] El CV se consulta en el sitio y se descarga en PDF con la misma información.
- [x] El estudiante actualiza su contenido desde el panel sin escribir código.
- [x] Los cambios publicados se ven desde otro dispositivo, sin iniciar sesión.
- [x] El visitante consulta la EProfile libremente; solo el dueño (o el admin) la modifica.
- [x] Los borradores no aparecen en público hasta publicarse.
- [x] Interfaces adaptables (celular y computadora) con Tailwind.
- [x] El QR abre la ruta definitiva y funciona sin sesión de administrador.
- [x] vCard y enlaces de contacto con datos correctos.
- [x] El administrador crea cuenta, edita/publica un perfil, y el cambio se refleja en su ruta.
- [x] Ningún estudiante accede al perfil de otro (verificado en cada Server Action).
- [x] (Extra) El estudiante elige plantilla y el PDF se genera con ese formato.
- [ ] Respaldo/restauración de datos: no implementado en la app — usa las
      copias de seguridad automáticas de Supabase (Point-in-Time Recovery) o
      `pg_dump`/`pg_restore` manuales sobre `DIRECT_URL`.

## Stack

- **Next.js 16** (App Router, Turbopack, Server Actions/Server Functions).
- **React 19**, **TypeScript**, **Tailwind CSS v4**.
- **PostgreSQL** (pensado para **Supabase**) + **Prisma ORM 7** con el
  adaptador `@prisma/adapter-pg`.
- **Autenticación propia**: sesión en cookie firmada con JWT (`jose`),
  contraseñas con `bcryptjs`. Sin librerías de terceros de auth.
- **`@react-pdf/renderer`** para el CV en PDF, **`qrcode`** para el QR.
- Fotos de perfil: subidas al sistema de archivos local (`public/uploads`) —
  suficiente para desarrollo/entrega local; en un despliegue serverless real
  se reemplazaría por Supabase Storage.

## Configuración

1. Copia `.env.example` a `.env` y completa:
   - `DATABASE_URL` / `DIRECT_URL`: desde tu proyecto de Supabase
     (Project Settings → Database → Connection string). `DATABASE_URL` usa el
     puerto **6543** (pooler, para la app); `DIRECT_URL` usa el puerto
     **5432** (conexión directa, para migraciones).
   - `SESSION_SECRET`: una cadena aleatoria larga (`openssl rand -base64 32`).
   - `NEXT_PUBLIC_APP_URL`: la URL pública donde corre la app (usada para
     construir el enlace del QR y la vCard).
   - `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` (opcional): credenciales del
     administrador que crea el script de semilla.

2. Instala dependencias y genera el cliente de Prisma:

   ```bash
   npm install
   ```

3. Aplica el esquema a tu base de datos:

   ```bash
   npm run db:migrate
   ```

4. (Opcional) Carga datos de ejemplo — un administrador y un estudiante demo:

   ```bash
   npm run db:seed
   ```

5. Levanta el servidor de desarrollo:

   ```bash
   npm run dev
   ```

## Cuentas de acceso de prueba (tras `db:seed`)

| Rol                  | Correo                         | Contraseña      | Ruta               |
| -------------------- | ------------------------------- | --------------- | ------------------ |
| Administrador         | valor de `SEED_ADMIN_EMAIL`     | `SEED_ADMIN_PASSWORD` | `/admin`      |
| Estudiante (demo)      | `demo.estudiante@eprofile.com` | `Demo1234!`      | `/demo/admin`       |

El perfil demo se crea en borrador; publícalo desde `/demo/admin` para verlo
en `/demo`.

## Pasos para probar

1. Inicia sesión como administrador en `/login` → crea una cuenta de
   estudiante (correo, nombre, dirección/slug) → copia la contraseña
   temporal que se muestra una sola vez.
2. Inicia sesión con esa cuenta en `/login` → completa perfil, CV,
   proyectos y habilidades en `/[slug]/admin`.
3. Guarda, revisa `/[slug]/admin/preview` y publica desde el panel.
4. Abre `/[slug]` en otro navegador o dispositivo (sin sesión) para
   confirmar que los cambios se ven, descarga el CV en PDF y la vCard.
5. Desde `/admin`, entra al panel del estudiante para verificar que el
   administrador también puede editar y publicar en su nombre.

## Estructura de datos (resumen)

`User` (cuenta: correo, contraseña, rol) 1—1 `Student` (slug, encabezado,
contacto, `publishedSnapshot`) 1—N `Education`, `Experience`, `Project`,
`Skill`, `Achievement`. El borrador vive en las tablas relacionales; publicar
copia su forma actual a `publishedSnapshot` (JSON), que es lo único que leen
los visitantes, el PDF y la vCard.

## Limitaciones conocidas y pasos futuros

- Las fotos se guardan en el disco local del servidor (`public/uploads`);
  para un despliegue en una plataforma serverless habría que moverlas a
  almacenamiento de objetos (p. ej. Supabase Storage).
- No hay reordenamiento manual de las secciones del CV (se muestran en el
  orden en que se agregaron).
- No hay recuperación de contraseña autoservicio para el estudiante; el
  administrador de plataforma la reinicia.
- El respaldo/restauración de datos se apoya en las herramientas de Supabase
  o `pg_dump`, no hay una función de backup dentro de la app.
