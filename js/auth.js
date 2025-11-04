// ============================================================
// MÓDULO DE AUTENTICACIÓN
// ============================================================

// Login con Google
async function loginConGoogle() {
    try {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: window.location.origin + '/login.html',
                queryParams: {
                    hd: 'certus.edu.pe',
                    prompt: 'select_account'
                }
            }
        });

        if (error) throw error;
        
        return { success: true, data };
    } catch (error) {
        console.error('❌ Error al iniciar sesión con Google:', error);
        return { success: false, error: error.message };
    }
}

// Validar usuario después del callback de OAuth
async function validarUsuarioDespuesDeOAuth() {
    try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
            console.warn('⚠️ No se pudo obtener sesión:', error.message);
            return true; // Continuar, checkAuth lo manejará
        }
        
        if (session && session.user) {
            const email = session.user.email;
            
            // Si el email no es corporativo, eliminar usuario y sesión
            if (!email.endsWith('@certus.edu.pe')) {
                // Cerrar sesión sin mostrar errores
                await supabase.auth.signOut().catch(() => {});
                
                // Intentar eliminar el usuario de la base de datos
                try {
                    await supabase.rpc('delete_user_and_profile', { user_id: session.user.id });
                } catch (e) {
                    // Silenciar error de eliminación
                }
                
                // Redirigir a login con error
                window.location.href = 'login.html?error=domain_not_allowed';
                return false;
            }
        }
        
        return true;
    } catch (error) {
        // Silenciar errores de validación
        console.warn('⚠️ Error en validación OAuth, continuando...');
        return true;
    }
}

// Registrar nuevo usuario
async function registrarUsuario(email, password, fullName) {
    try {
        // Validar dominio corporativo
        if (!email.endsWith(CORPORATE_DOMAIN)) {
            throw new Error(`Solo se permiten correos ${CORPORATE_DOMAIN}`);
        }

        // Registrar en Supabase Auth
        const { data, error } = await supabase.auth.signUp({
            email: email,
            password: password,
            options: {
                data: {
                    full_name: fullName
                }
            }
        });

        if (error) throw error;

        return { success: true, data };
    } catch (error) {
        console.error('❌ Error al registrar:', error);
        return { success: false, error: error.message };
    }
}

// Iniciar sesión
async function iniciarSesion(email, password) {
    try {
        // Validar dominio corporativo
        if (!email.endsWith(CORPORATE_DOMAIN)) {
            throw new Error(`Solo se permiten correos ${CORPORATE_DOMAIN}`);
        }

        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password
        });

        if (error) throw error;

        // Registrar en audit log
        await registrarAuditLog('LOGIN', 'auth', data.user.id);

        return { success: true, user: data.user };
    } catch (error) {
        console.error('❌ Error al iniciar sesión:', error);
        return { success: false, error: error.message };
    }
}

// Cerrar sesión
async function cerrarSesion() {
    try {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;

        // Registrar en audit log
        await registrarAuditLog('LOGOUT', 'auth', null);

        localStorage.clear();
        window.location.href = 'login.html';
    } catch (error) {
        console.error('❌ Error al cerrar sesión:', error);
    }
}

// Obtener usuario actual
async function obtenerUsuarioActual() {
    try {
        const { data: { user }, error } = await supabase.auth.getUser();
        
        if (error) return null;
        if (!user) return null;

        // Obtener perfil completo desde la tabla profiles
        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

        if (profileError) return { ...user, profile: null };

        return { ...user, profile };
    } catch (error) {
        return null;
    }
}

// Verificar si es admin
async function esAdministrador() {
    try {
        // Obtener usuario actual
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError) throw userError;
        if (!user) return false;

        // Consultar rol desde profiles
        const { data, error } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single();

        if (error) throw error;
        return data?.role === 'admin';
    } catch (error) {
        console.error('❌ Error al verificar rol:', error);
        return false;
    }
}

// Registrar en audit log
async function registrarAuditLog(action, tableName, recordId, oldData = null, newData = null) {
    try {
        const user = await obtenerUsuarioActual();
        if (!user) return;

        const { error } = await supabase
            .from('audit_logs')
            .insert({
                user_id: user.id,
                action: action,
                table_name: tableName,
                record_id: recordId,
                old_data: oldData,
                new_data: newData
            });

        if (error) throw error;
    } catch (error) {
        console.error('❌ Error al registrar audit log:', error);
    }
}
