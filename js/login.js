// ============================================================
// LÓGICA DEL LOGIN
// ============================================================

// Cambiar entre tabs
function cambiarTab(tab) {
    const loginForm = document.getElementById('loginForm');
    const registroForm = document.getElementById('registroForm');
    const tabs = document.querySelectorAll('.tab');
    
    tabs.forEach(t => t.classList.remove('active'));
    
    if (tab === 'login') {
        loginForm.style.display = 'flex';
        registroForm.style.display = 'none';
        tabs[0].classList.add('active');
    } else {
        loginForm.style.display = 'none';
        registroForm.style.display = 'flex';
        tabs[1].classList.add('active');
    }
    
    limpiarMensajes();
}

// Handle Login
async function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    const btn = document.getElementById('loginBtn');
    
    // Deshabilitar botón
    btn.disabled = true;
    btn.innerHTML = '<span>Iniciando sesión...</span>';
    
    try {
        const result = await iniciarSesion(email, password);
        
        if (result.success) {
            mostrarMensaje('success', '¡Bienvenido! Redirigiendo...');
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1000);
        } else {
            mostrarMensaje('error', result.error || 'Error al iniciar sesión');
            btn.disabled = false;
            btn.innerHTML = '<span>Iniciar Sesión</span><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>';
        }
    } catch (error) {
        mostrarMensaje('error', 'Error de conexión. Intenta nuevamente.');
        btn.disabled = false;
        btn.innerHTML = '<span>Iniciar Sesión</span><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>';
    }
}

// Handle Registro
async function handleRegistro(event) {
    event.preventDefault();
    
    const nombre = document.getElementById('registroNombre').value.trim();
    const email = document.getElementById('registroEmail').value.trim();
    const password = document.getElementById('registroPassword').value;
    const passwordConfirm = document.getElementById('registroPasswordConfirm').value;
    const btn = document.getElementById('registroBtn');
    
    // Validar contraseñas
    if (password !== passwordConfirm) {
        mostrarMensaje('error', 'Las contraseñas no coinciden');
        return;
    }
    
    // Validar dominio
    if (!email.endsWith('@certus.edu.pe')) {
        mostrarMensaje('error', 'Solo se permiten correos @certus.edu.pe');
        return;
    }
    
    // Deshabilitar botón
    btn.disabled = true;
    btn.innerHTML = '<span>Creando cuenta...</span>';
    
    try {
        const result = await registrarUsuario(email, password, nombre);
        
        if (result.success) {
            mostrarMensaje('success', '¡Cuenta creada! Ya puedes iniciar sesión.');
            setTimeout(() => {
                cambiarTab('login');
                document.getElementById('loginEmail').value = email;
            }, 2000);
        } else {
            mostrarMensaje('error', result.error || 'Error al crear cuenta');
            btn.disabled = false;
            btn.innerHTML = '<span>Crear Cuenta</span><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>';
        }
    } catch (error) {
        mostrarMensaje('error', 'Error de conexión. Intenta nuevamente.');
        btn.disabled = false;
        btn.innerHTML = '<span>Crear Cuenta</span><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>';
    }
}

// Handle Google Login
async function handleGoogleLogin() {
    try {
        mostrarMensaje('info', 'Redirigiendo a Google...');
        const result = await loginConGoogle();
        
        if (!result.success) {
            mostrarMensaje('error', result.error || 'Error al iniciar sesión con Google');
        }
        // Si es exitoso, Supabase redirige automáticamente
    } catch (error) {
        mostrarMensaje('error', 'Error al conectar con Google. Intenta nuevamente.');
    }
}

// Mostrar mensajes
function mostrarMensaje(tipo, mensaje) {
    const container = document.getElementById('messageContainer');
    const iconos = {
        'success': '✅',
        'error': '❌',
        'info': 'ℹ️'
    };
    container.innerHTML = `
        <div class="message ${tipo}">
            ${iconos[tipo] || '📋'} ${mensaje}
        </div>
    `;
    container.style.display = 'block';
}

// Limpiar mensajes
function limpiarMensajes() {
    const container = document.getElementById('messageContainer');
    container.innerHTML = '';
    container.style.display = 'none';
}

// Verificar si ya hay sesión
window.addEventListener('DOMContentLoaded', async () => {
    // Manejar callback de Google OAuth
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    if (hashParams.get('access_token')) {
        // Mostrar loader
        const loader = document.getElementById('oauthLoading');
        if (loader) {
            loader.classList.add('active');
        }
        
        // Esperar a que Supabase procese
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        // Obtener sesión
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (session && session.user) {
            const email = session.user.email;
            
            // Validar dominio
            if (!email.endsWith('@certus.edu.pe')) {
                // Limpiar hash
                window.history.replaceState(null, null, window.location.pathname);
                
                // Cerrar sesión
                await supabase.auth.signOut();
                
                // Eliminar usuario
                try {
                    await supabase.rpc('delete_user_and_profile', { 
                        user_id: session.user.id 
                    });
                } catch (e) {
                    // Error al eliminar usuario
                }
                
                // Ocultar loader
                if (loader) {
                    loader.classList.remove('active');
                }
                
                // Mostrar error
                mostrarMensaje('error', 'Solo se permiten correos corporativos @certus.edu.pe');
                return;
            } else {
                // Email corporativo válido - ir a index
                
                // Cambiar texto del loader
                const loaderText = document.querySelector('.oauth-loading-text');
                const loaderSubtext = document.querySelector('.oauth-loading-subtext');
                if (loaderText) loaderText.textContent = '¡Acceso autorizado!';
                if (loaderSubtext) loaderSubtext.textContent = 'Redirigiendo...';
                
                // Limpiar hash
                window.history.replaceState(null, null, window.location.pathname);
                
                // Pequeña pausa antes de redirigir
                await new Promise(resolve => setTimeout(resolve, 500));
                
                window.location.href = 'index.html';
                return;
            }
        } else {
            // Ocultar loader
            if (loader) {
                loader.classList.remove('active');
            }
        }
    }
    
    // Mostrar mensaje de error si viene del parámetro
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('error') === 'domain_not_allowed') {
        mostrarMensaje('error', 'Solo se permiten correos corporativos @certus.edu.pe');
        window.history.replaceState(null, null, window.location.pathname);
    }
    
    // Verificar si ya hay sesión válida
    const user = await obtenerUsuarioActual();
    if (user && user.email.endsWith('@certus.edu.pe')) {
        window.location.href = 'index.html';
    }
});
