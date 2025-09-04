# MonetizaYT - Red Social de YouTube

MonetizaYT es una aplicación de escritorio que permite a los usuarios intercambiar visualizaciones de videos de YouTube. Los usuarios pueden subir sus videos y ganar tiempo de visualización viendo videos de otros miembros de la red social.

## Características

- 🔐 Sistema de autenticación seguro
- 📱 Aplicación de escritorio con Electron
- 🎥 Subida de URLs de YouTube
- ⏱️ Sistema de créditos por tiempo de visualización
- 👥 Red social colaborativa
- 📊 Dashboard con estadísticas

## Tecnologías Utilizadas

### Backend
- Node.js
- Express.js
- MongoDB con Mongoose
- JWT para autenticación
- bcryptjs para encriptación

### Frontend
- Electron
- HTML/CSS/JavaScript vanilla
- Interfaz moderna y responsiva

## Instalación y Configuración

### Prerrequisitos
- Node.js (v14 o superior)
- MongoDB instalado y ejecutándose

### Configuración del Backend

1. Navega al directorio del backend:
   ```bash
   cd backend
   ```

2. Instala las dependencias:
   ```bash
   npm install
   ```

3. Configura las variables de entorno en el archivo `.env`:
   ```
   MONGODB_URI=mongodb://localhost:27017/monetizayt
   JWT_SECRET=tu_secreto_jwt_aqui
   PORT=5000
   ```

4. Inicia el servidor:
   ```bash
   npm start
   ```

### Configuración del Frontend

1. Navega al directorio del frontend:
   ```bash
   cd frontend
   ```

2. Instala las dependencias:
   ```bash
   npm install
   ```

3. Inicia la aplicación:
   ```bash
   npm start
   ```

## Cómo Funciona

1. **Registro/Login**: Los usuarios se registran con username, email y contraseña
2. **Subir Videos**: Los usuarios pueden agregar URLs de YouTube a la plataforma
3. **Ver Videos**: Los usuarios ven videos de otros miembros y ganan tiempo
4. **Sistema de Créditos**: 
   - Al ver un video completo, ganas tiempo igual a la duración del video
   - Ese tiempo se añade al propietario del video para que otros vean sus videos
5. **Dashboard**: Monitoreo de estadísticas personales

## Estructura del Proyecto

```
MonetizaYT/
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   └── Video.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── user.js
│   │   └── videos.js
│   ├── middleware/
│   │   └── auth.js
│   ├── server.js
│   ├── .env
│   └── package.json
├── frontend/
│   ├── main.js
│   ├── index.html
│   ├── app.js
│   └── package.json
└── README.md
```

## API Endpoints

### Autenticación
- `POST /api/auth/register` - Registrar usuario
- `POST /api/auth/login` - Iniciar sesión

### Usuario
- `GET /api/user/profile` - Obtener perfil
- `PUT /api/user/stats` - Actualizar estadísticas

### Videos
- `POST /api/videos` - Agregar video
- `GET /api/videos/to-watch` - Videos para ver
- `POST /api/videos/:id/watched` - Marcar como visto
- `GET /api/videos/my-videos` - Mis videos

## Desarrollo Futuro

- Implementación para Android/iOS
- Integración con YouTube API para información real de videos
- Sistema de notificaciones
- Ranking y gamificación
- Chat entre usuarios

## Contribuir

1. Fork del proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT.