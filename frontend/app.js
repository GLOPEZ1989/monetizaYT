const API_URL = 'http://localhost:5000/api';
let currentUser = null;

// Elementos DOM
const authSection = document.getElementById('auth-section');
const dashboard = document.getElementById('dashboard');
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');

// Funciones de autenticación
function showLogin() {
    loginForm.classList.remove('hidden');
    registerForm.classList.add('hidden');
}

function showRegister() {
    loginForm.classList.add('hidden');
    registerForm.classList.remove('hidden');
}

async function login() {
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;
    
    if (!username || !password) {
        alert('Por favor completa todos los campos');
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            localStorage.setItem('token', data.token);
            currentUser = data.user;
            showDashboard();
            loadUserData();
        } else {
            alert(data.message || 'Error al iniciar sesión');
        }
    } catch (error) {
        alert('Error de conexión');
        console.error('Error:', error);
    }
}

async function register() {
    const username = document.getElementById('register-username').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    
    if (!username || !email || !password) {
        alert('Por favor completa todos los campos');
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, email, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            alert('Registro exitoso! Ahora puedes iniciar sesión');
            showLogin();
        } else {
            alert(data.message || 'Error al registrarse');
        }
    } catch (error) {
        alert('Error de conexión');
        console.error('Error:', error);
    }
}

function logout() {
    localStorage.removeItem('token');
    currentUser = null;
    authSection.classList.remove('hidden');
    dashboard.classList.add('hidden');
    showLogin();
}

function showDashboard() {
    authSection.classList.add('hidden');
    dashboard.classList.remove('hidden');
}

// Funciones del dashboard
async function loadUserData() {
    const token = localStorage.getItem('token');
    
    try {
        const response = await fetch(`${API_URL}/user/profile`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        const data = await response.json();
        
        if (response.ok) {
            updateStats(data);
            loadVideosToWatch();
            loadMyVideos();
        }
    } catch (error) {
        console.error('Error loading user data:', error);
    }
}

function updateStats(userData) {
    document.getElementById('earned-time').textContent = Math.floor(userData.earnedTime / 60) || 0;
    document.getElementById('watch-time').textContent = Math.floor(userData.watchTime / 60) || 0;
    document.getElementById('my-videos').textContent = userData.videosCount || 0;
}

async function addVideo() {
    const videoUrl = document.getElementById('video-url').value;
    const token = localStorage.getItem('token');
    
    if (!videoUrl) {
        alert('Por favor ingresa una URL de YouTube');
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/videos`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ youtubeUrl: videoUrl })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            alert('Video agregado exitosamente!');
            document.getElementById('video-url').value = '';
            loadUserData();
            loadMyVideos(); // Recargar mis videos
        } else {
            alert(data.message || 'Error al agregar video');
        }
    } catch (error) {
        alert('Error de conexión');
        console.error('Error:', error);
    }
}

async function loadVideosToWatch() {
    const token = localStorage.getItem('token');
    
    try {
        const response = await fetch(`${API_URL}/videos/to-watch`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        const data = await response.json();
        
        if (response.ok) {
            displayVideosToWatch(data.videos);
        }
    } catch (error) {
        console.error('Error loading videos:', error);
    }
}

function displayVideosToWatch(videos) {
    const container = document.getElementById('videos-to-watch');
    
    if (videos.length === 0) {
        container.innerHTML = '<p style="color: rgba(255,255,255,0.7);">No hay videos disponibles para ver</p>';
        return;
    }
    
    container.innerHTML = videos.map(video => `
        <div class="video-item">
            <div>
                <div class="video-title">${video.title}</div>
                <small style="color: rgba(255,255,255,0.6);">Por: ${video.owner.username}</small>
            </div>
            <div>
                <span class="video-time">${Math.floor(video.duration / 60)}min</span>
                <button class="btn btn-primary" style="width: auto; padding: 8px 16px; margin-left: 10px;" onclick="watchVideo('${video._id}', '${video.youtubeUrl}')">Ver</button>
            </div>
        </div>
    `).join('');
}

async function watchVideo(videoId, youtubeUrl) {
    const token = localStorage.getItem('token');
    
    // Abrir video en el navegador
    require('electron').shell.openExternal(youtubeUrl);
    
    // Simular que el usuario vio el video (en una implementación real, esto sería más complejo)
    setTimeout(async () => {
        try {
            await fetch(`${API_URL}/videos/${videoId}/watched`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            loadUserData(); // Recargar datos del usuario
        } catch (error) {
            console.error('Error marking video as watched:', error);
        }
    }, 2000);
}

async function loadMyVideos() {
    const token = localStorage.getItem('token');
    
    try {
        const response = await fetch(`${API_URL}/videos/my-videos`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        const data = await response.json();
        
        if (response.ok) {
            displayMyVideos(data.videos);
        }
    } catch (error) {
        console.error('Error loading my videos:', error);
    }
}

function displayMyVideos(videos) {
    const container = document.getElementById('my-videos');
    
    if (videos.length === 0) {
        container.innerHTML = '<p style="color: rgba(255,255,255,0.7);">No tienes videos subidos</p>';
        return;
    }
    
    container.innerHTML = videos.map(video => `
        <div class="video-item">
            <div>
                <div class="video-title">${video.title}</div>
                <small style="color: rgba(255,255,255,0.6);">Vistas: ${video.views} | Duración: ${Math.floor(video.duration / 60)}min</small>
            </div>
            <div>
                <span class="video-time">${Math.floor(video.watchTime / 60)}min vistos</span>
                <button class="btn btn-primary" style="width: auto; padding: 8px 16px; margin-left: 10px;" onclick="window.open('${video.youtubeUrl}', '_blank')">Ver</button>
            </div>
        </div>
    `).join('');
}

// Verificar si hay token guardado al cargar la página
window.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    if (token) {
        // Verificar si el token es válido
        fetch(`${API_URL}/user/profile`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Token inválido');
            }
        })
        .then(data => {
            currentUser = data;
            showDashboard();
            loadUserData();
        })
        .catch(() => {
            localStorage.removeItem('token');
            showLogin();
        });
    } else {
        showLogin();
    }
});