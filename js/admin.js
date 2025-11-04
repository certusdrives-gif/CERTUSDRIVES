// ============================================
// ADMIN.JS - Panel de Administración CRUD
// ============================================

let recursosOriginales = [];
let recursosFiltrados = [];
let paginaActual = 1;
const recursosPorPagina = 10;
let recursoAEliminar = null;

// ============================================
// INICIALIZACIÓN
// ============================================

window.addEventListener('DOMContentLoaded', async () => {
    await verificarAccesoAdmin();
    await cargarDatosIniciales();
});

// Verificar que el usuario es admin
async function verificarAccesoAdmin() {
    try {
        // Manejar callback de OAuth (Google)
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        if (hashParams.get('access_token')) {
            window.history.replaceState(null, null, window.location.pathname);
            await new Promise(resolve => setTimeout(resolve, 1500));
        }
        
        const usuario = await obtenerUsuarioActual();
        
        if (!usuario) {
            window.location.href = 'login.html';
            return;
        }
        
        // Validar dominio corporativo
        if (!usuario.email.endsWith('@certus.edu.pe')) {
            await supabase.auth.signOut().catch(() => {});
            window.location.href = 'login.html?error=domain_not_allowed';
            return;
        }

        const esAdmin = await esAdministrador();
        
        if (!esAdmin) {
            mostrarToast('Acceso denegado. Solo administradores.', 'error');
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000);
            return;
        }

        // Mostrar email del usuario
        document.getElementById('userEmail').textContent = usuario.email;
        
    } catch (error) {
        console.error('Error verificando acceso:', error);
        window.location.href = 'login.html';
    }
}

// ============================================
// CARGA DE DATOS
// ============================================

async function cargarDatosIniciales() {
    mostrarCargando();
    try {
        // Mostrar skeleton loaders
        const tableSkeleton = document.getElementById('tableSkeleton');
        const recursosTable = document.getElementById('recursosTable');
        const statsSkeleton = document.getElementById('statsSkeleton');
        const statsContent = document.getElementById('statsContent');
        
        if (tableSkeleton) tableSkeleton.style.display = 'block';
        if (recursosTable) recursosTable.style.display = 'none';
        if (statsSkeleton) statsSkeleton.style.display = 'flex';
        if (statsContent) statsContent.style.display = 'none';
        
        await cargarRecursos();
        actualizarEstadisticas();
        cargarOpcionesArea();
        
        // Ocultar skeletons y mostrar contenido real
        if (tableSkeleton) tableSkeleton.style.display = 'none';
        if (recursosTable) recursosTable.style.display = 'table';
        if (statsSkeleton) statsSkeleton.style.display = 'none';
        if (statsContent) statsContent.style.display = 'flex';
    } catch (error) {
        console.error('Error cargando datos:', error);
        mostrarToast('Error al cargar los recursos', 'error');
        // Ocultar skeletons en caso de error
        const tableSkeleton = document.getElementById('tableSkeleton');
        const statsSkeleton = document.getElementById('statsSkeleton');
        if (tableSkeleton) tableSkeleton.style.display = 'none';
        if (statsSkeleton) statsSkeleton.style.display = 'none';
    }
    ocultarCargando();
}

async function cargarRecursos() {
    try {
        const { data, error } = await supabase
            .from('recursos')
            .select(`
                *,
                profiles:created_by (
                    email,
                    full_name
                )
            `)
            .order('created_at', { ascending: false });

        if (error) throw error;

        recursosOriginales = data || [];
        recursosFiltrados = [...recursosOriginales];
        mostrarRecursos();
        
    } catch (error) {
        console.error('Error cargando recursos:', error);
        throw error;
    }
}

// ============================================
// ESTADÍSTICAS
// ============================================

function actualizarEstadisticas() {
    const total = recursosOriginales.length;
    const activos = recursosOriginales.filter(r => r.is_active).length;
    const areasUnicas = [...new Set(recursosOriginales.map(r => r.area))].length;

    document.getElementById('totalRecursos').textContent = total;
    document.getElementById('recursosActivos').textContent = activos;
    document.getElementById('totalAreas').textContent = areasUnicas;
}

function cargarOpcionesArea() {
    const iconos = {
        'ATENCIÓN - FRONT': '👥',
        'ATENCIÓN- CANALES': '📞',
        'CRÉDITO Y COBRANZAS': '💰',
        'FACTURACIÓN': '📄',
        'RR.HH': '👤',
        'PEC': '📊',
        'REINGRESO': '🔄'
    };
    
    const areas = [...new Set(recursosOriginales.map(r => r.area))].sort();
    const select = document.getElementById('filtroArea');
    
    select.innerHTML = '<option value="">Todas las áreas</option>';
    
    areas.forEach(area => {
        const option = document.createElement('option');
        option.value = area;
        const icono = iconos[area] || '📁';
        option.textContent = `${icono} ${area}`;
        select.appendChild(option);
    });
}

// ============================================
// MOSTRAR RECURSOS EN TABLA
// ============================================

function mostrarRecursos() {
    const tbody = document.getElementById('tablaRecursos');
    
    if (recursosFiltrados.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="8" style="text-align: center; padding: 2rem; color: #6c757d;">
                    No hay recursos para mostrar
                </td>
            </tr>
        `;
        return;
    }

    // Calcular paginación
    const inicio = (paginaActual - 1) * recursosPorPagina;
    const fin = inicio + recursosPorPagina;
    const recursosPagina = recursosFiltrados.slice(inicio, fin);

    tbody.innerHTML = recursosPagina.map(recurso => `
        <tr>
            <td><span class="area-badge">${recurso.area}</span></td>
            <td><strong>${recurso.titulo}</strong></td>
            <td>${recurso.descripcion || '<em>Sin descripción</em>'}</td>
            <td>
                <a href="${recurso.enlace}" target="_blank" class="enlace-link">
                    🔗 Ver Drive
                </a>
            </td>
            <td>
                <div class="palabras-clave">
                    ${(recurso.palabras_clave || []).map(p => 
                        `<span class="palabra-tag">${p}</span>`
                    ).join('')}
                </div>
            </td>
            <td>
                <span class="estado-badge ${recurso.is_active ? 'estado-activo' : 'estado-inactivo'}">
                    ${recurso.is_active ? '✅ Activo' : '❌ Inactivo'}
                </span>
            </td>
            <td>${formatearFecha(recurso.created_at)}</td>
            <td>
                <div class="actions-cell">
                    <button class="btn-icon btn-edit" onclick="editarRecurso('${recurso.id}')" title="Editar">
                        ✏️
                    </button>
                    <button class="btn-icon btn-delete" onclick="abrirModalEliminar('${recurso.id}')" title="Eliminar">
                        🗑️
                    </button>
                </div>
            </td>
        </tr>
    `).join('');

    mostrarPaginacion();
}

// ============================================
// PAGINACIÓN
// ============================================

function mostrarPaginacion() {
    const totalPaginas = Math.ceil(recursosFiltrados.length / recursosPorPagina);
    const contenedor = document.getElementById('paginacion');

    if (totalPaginas <= 1) {
        contenedor.innerHTML = '';
        return;
    }

    let html = '';

    // Botón Anterior
    if (paginaActual > 1) {
        html += `<button class="page-btn" onclick="cambiarPagina(${paginaActual - 1})">← Anterior</button>`;
    }

    // Números de página
    for (let i = 1; i <= totalPaginas; i++) {
        if (
            i === 1 || 
            i === totalPaginas || 
            (i >= paginaActual - 1 && i <= paginaActual + 1)
        ) {
            html += `<button class="page-btn ${i === paginaActual ? 'active' : ''}" onclick="cambiarPagina(${i})">${i}</button>`;
        } else if (i === paginaActual - 2 || i === paginaActual + 2) {
            html += `<span style="padding: 0.5rem;">...</span>`;
        }
    }

    // Botón Siguiente
    if (paginaActual < totalPaginas) {
        html += `<button class="page-btn" onclick="cambiarPagina(${paginaActual + 1})">Siguiente →</button>`;
    }

    contenedor.innerHTML = html;
}

function cambiarPagina(pagina) {
    paginaActual = pagina;
    mostrarRecursos();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ============================================
// BÚSQUEDA Y FILTROS
// ============================================

function buscarRecursos() {
    const termino = document.getElementById('searchInput').value.toLowerCase().trim();
    
    if (!termino) {
        aplicarFiltros();
        return;
    }

    recursosFiltrados = recursosOriginales.filter(recurso => {
        const textoCompleto = `
            ${recurso.area} 
            ${recurso.titulo} 
            ${recurso.descripcion || ''} 
            ${(recurso.palabras_clave || []).join(' ')}
        `.toLowerCase();

        return textoCompleto.includes(termino);
    });

    paginaActual = 1;
    mostrarRecursos();
}

function filtrarPorArea() {
    aplicarFiltros();
}

function filtrarPorEstado() {
    aplicarFiltros();
}

function aplicarFiltros() {
    const areaSeleccionada = document.getElementById('filtroArea').value;
    const estadoSeleccionado = document.getElementById('filtroEstado').value;

    recursosFiltrados = recursosOriginales.filter(recurso => {
        // Filtro por área
        if (areaSeleccionada && recurso.area !== areaSeleccionada) {
            return false;
        }

        // Filtro por estado
        if (estadoSeleccionado === 'activos' && !recurso.is_active) {
            return false;
        }
        if (estadoSeleccionado === 'inactivos' && recurso.is_active) {
            return false;
        }

        return true;
    });

    paginaActual = 1;
    mostrarRecursos();
}

// ============================================
// CREAR NUEVO RECURSO
// ============================================

function abrirModalNuevo() {
    document.getElementById('modalTitulo').textContent = 'Nuevo Recurso';
    document.getElementById('formRecurso').reset();
    document.getElementById('recursoId').value = '';
    document.getElementById('inputActivo').checked = true;
    document.getElementById('modalRecurso').style.display = 'block';
}

// ============================================
// EDITAR RECURSO
// ============================================

function editarRecurso(id) {
    const recurso = recursosOriginales.find(r => r.id === id);
    
    if (!recurso) {
        mostrarToast('Recurso no encontrado', 'error');
        return;
    }

    document.getElementById('modalTitulo').textContent = 'Editar Recurso';
    document.getElementById('recursoId').value = recurso.id;
    document.getElementById('inputArea').value = recurso.area;
    document.getElementById('inputTitulo').value = recurso.titulo;
    document.getElementById('inputDescripcion').value = recurso.descripcion || '';
    document.getElementById('inputEnlace').value = recurso.enlace;
    document.getElementById('inputPalabras').value = (recurso.palabras_clave || []).join(', ');
    document.getElementById('inputActivo').checked = recurso.is_active;
    
    document.getElementById('modalRecurso').style.display = 'block';
}

// ============================================
// GUARDAR RECURSO (CREATE/UPDATE)
// ============================================

async function guardarRecurso(event) {
    event.preventDefault();

    const id = document.getElementById('recursoId').value;
    const area = document.getElementById('inputArea').value.trim();
    const titulo = document.getElementById('inputTitulo').value.trim();
    const descripcion = document.getElementById('inputDescripcion').value.trim();
    const enlace = document.getElementById('inputEnlace').value.trim();
    const palabrasInput = document.getElementById('inputPalabras').value.trim();
    const isActive = document.getElementById('inputActivo').checked;

    // Validaciones
    if (!area || !titulo || !enlace) {
        mostrarToast('Por favor completa todos los campos obligatorios', 'error');
        return;
    }

    if (!enlace.startsWith('http')) {
        mostrarToast('El enlace debe comenzar con http:// o https://', 'error');
        return;
    }

    // Procesar palabras clave
    const palabrasClave = palabrasInput 
        ? palabrasInput.split(',').map(p => p.trim()).filter(p => p)
        : [];

    // Obtener usuario actual
    const usuario = await obtenerUsuarioActual();

    const datosRecurso = {
        area,
        titulo,
        descripcion: descripcion || null,
        enlace,
        palabras_clave: palabrasClave,
        is_active: isActive
    };

    try {
        if (id) {
            // ACTUALIZAR
            const { error } = await supabase
                .from('recursos')
                .update(datosRecurso)
                .eq('id', id);

            if (error) throw error;

            // Registrar auditoría
            await registrarAuditLog('UPDATE', 'recursos', id);

            mostrarToast('✅ Recurso actualizado correctamente', 'success');
        } else {
            // CREAR
            datosRecurso.created_by = usuario.id;

            const { error } = await supabase
                .from('recursos')
                .insert([datosRecurso]);

            if (error) throw error;

            // Registrar auditoría
            await registrarAuditLog('CREATE', 'recursos', null);

            mostrarToast('✅ Recurso creado correctamente', 'success');
        }

        cerrarModal();
        await cargarDatosIniciales();

    } catch (error) {
        console.error('Error guardando recurso:', error);
        mostrarToast('❌ Error al guardar el recurso', 'error');
    }
}

// ============================================
// ELIMINAR RECURSO
// ============================================

function abrirModalEliminar(id) {
    recursoAEliminar = id;
    document.getElementById('modalConfirmar').style.display = 'block';
}

async function confirmarEliminar() {
    if (!recursoAEliminar) return;

    try {
        const { error } = await supabase
            .from('recursos')
            .delete()
            .eq('id', recursoAEliminar);

        if (error) throw error;

        // Registrar auditoría
        await registrarAuditLog('DELETE', 'recursos', recursoAEliminar);

        mostrarToast('✅ Recurso eliminado correctamente', 'success');
        cerrarModalConfirmar();
        await cargarDatosIniciales();

    } catch (error) {
        console.error('Error eliminando recurso:', error);
        mostrarToast('❌ Error al eliminar el recurso', 'error');
    }
}

// ============================================
// MODALES
// ============================================

function cerrarModal() {
    document.getElementById('modalRecurso').style.display = 'none';
}

function cerrarModalConfirmar() {
    document.getElementById('modalConfirmar').style.display = 'none';
    recursoAEliminar = null;
}

// Cerrar modal al hacer clic fuera
window.onclick = function(event) {
    const modalRecurso = document.getElementById('modalRecurso');
    const modalConfirmar = document.getElementById('modalConfirmar');
    
    if (event.target === modalRecurso) {
        cerrarModal();
    }
    if (event.target === modalConfirmar) {
        cerrarModalConfirmar();
    }
};

// ============================================
// NAVEGACIÓN
// ============================================

function volverAlInicio() {
    window.location.href = 'index.html';
}

async function cerrarSesionAdmin() {
    try {
        await cerrarSesion();
        window.location.href = 'login.html';
    } catch (error) {
        console.error('Error cerrando sesión:', error);
        mostrarToast('Error al cerrar sesión', 'error');
    }
}

// ============================================
// UTILIDADES
// ============================================

function formatearFecha(fecha) {
    const date = new Date(fecha);
    return date.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}

function mostrarToast(mensaje, tipo = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = mensaje;
    toast.className = `toast ${tipo}`;
    toast.style.display = 'block';

    setTimeout(() => {
        toast.style.display = 'none';
    }, 4000);
}

function mostrarCargando() {
    const tbody = document.getElementById('tablaRecursos');
    tbody.innerHTML = `
        <tr>
            <td colspan="8" style="text-align: center; padding: 2rem;">
                <div style="font-size: 2rem;">⏳</div>
                <div>Cargando recursos...</div>
            </td>
        </tr>
    `;
}

function ocultarCargando() {
    // La función mostrarRecursos() reemplazará el contenido
}
