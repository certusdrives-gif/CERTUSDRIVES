// ============================================================
// GESTIÓN DE ÁREAS - admin.html
// ============================================================

let areasGlobales = [];
let areasFiltradas = [];
let areaEditando = null;
let paginaActualAreas = 1;
const areasPorPagina = 10;

// ============================================================
// UTILIDADES: Toast para notificaciones
// ============================================================

function showToast(mensaje, tipo = 'success') {
    // Crear el elemento toast si no existe
    let toastContainer = document.getElementById('toastContainer');
    
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.id = 'toastContainer';
        toastContainer.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            display: flex;
            flex-direction: column;
            gap: 10px;
        `;
        document.body.appendChild(toastContainer);
    }
    
    // Crear el toast
    const toast = document.createElement('div');
    toast.style.cssText = `
        background: ${tipo === 'success' ? '#10b981' : tipo === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        padding: 16px 24px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        font-size: 14px;
        font-weight: 500;
        animation: slideIn 0.3s ease-out;
        min-width: 300px;
        max-width: 500px;
    `;
    toast.textContent = mensaje;
    
    // Agregar animación CSS si no existe
    if (!document.getElementById('toastAnimationStyle')) {
        const style = document.createElement('style');
        style.id = 'toastAnimationStyle';
        style.textContent = `
            @keyframes slideIn {
                from {
                    transform: translateX(400px);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            @keyframes slideOut {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(400px);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    toastContainer.appendChild(toast);
    
    // Eliminar después de 3 segundos
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease-in';
        setTimeout(() => {
            toast.remove();
            // Limpiar contenedor si está vacío
            if (toastContainer.children.length === 0) {
                toastContainer.remove();
            }
        }, 300);
    }, 3000);
}

// ============================================================
// INICIALIZACIÓN
// ============================================================

// Exponer funciones globalmente para onclick
window.cambiarTab = cambiarTab;
window.abrirModalNuevaArea = abrirModalNuevaArea;
window.cerrarModalArea = cerrarModalArea;
window.guardarArea = guardarArea;
window.editarArea = editarArea;
window.toggleActivoArea = toggleActivoArea;
window.confirmarEliminarArea = confirmarEliminarArea;
window.confirmarEliminacionArea = confirmarEliminacionArea;
window.cerrarModalConfirmarArea = cerrarModalConfirmarArea;
window.buscarAreas = buscarAreas;

// ============================================================
// FUNCIONES DE PESTAÑAS
// ============================================================

function cambiarTab(tabName) {
    // Ocultar todos los tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Desactivar todos los botones
    document.querySelectorAll('.tab-button').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Activar el tab seleccionado
    if (tabName === 'recursos') {
        document.getElementById('tabRecursos').classList.add('active');
        document.querySelector('.tab-button:first-child').classList.add('active');
    } else if (tabName === 'areas') {
        document.getElementById('tabAreas').classList.add('active');
        document.querySelector('.tab-button:last-child').classList.add('active');
        cargarAreas();
    }
}

// ============================================================
// CARGAR ÁREAS DESDE SUPABASE
// ============================================================

async function cargarAreas() {
    try {
        console.log('🔄 [ÁREAS] Cargando áreas desde Supabase...');
        
        const { data, error } = await supabase
            .from('areas')
            .select('*')
            .order('orden', { ascending: true });
        
        if (error) throw error;
        
        areasGlobales = data || [];
        areasFiltradas = [...areasGlobales];
        
        console.log('✅ [ÁREAS] Áreas cargadas desde BD:', {
            total: areasGlobales.length,
            areas: areasGlobales.map(a => ({
                nombre: a.nombre,
                correo: a.correo,
                activo: a.activo,
                orden: a.orden,
                id: a.id
            }))
        });
        
        mostrarAreas();
        
    } catch (error) {
        console.error('❌ [ÁREAS] Error al cargar áreas:', error);
        showToast('Error al cargar las áreas', 'error');
    }
}

// ============================================================
// MOSTRAR ÁREAS EN LA TABLA
// ============================================================

function mostrarAreas() {
    const tbody = document.getElementById('tablaAreas');
    
    if (!areasFiltradas || areasFiltradas.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" style="text-align: center; padding: 3rem; color: var(--text-secondary);">
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="opacity: 0.3; margin-bottom: 1rem;">
                        <path d="M3 3h18v18H3zM9 3v18"></path>
                    </svg>
                    <p>No hay áreas registradas</p>
                </td>
            </tr>
        `;
        document.getElementById('paginacionAreas').innerHTML = '';
        return;
    }
    
    // Calcular paginación
    const inicio = (paginaActualAreas - 1) * areasPorPagina;
    const fin = inicio + areasPorPagina;
    const areasPagina = areasFiltradas.slice(inicio, fin);
    
    tbody.innerHTML = areasPagina.map(area => {
        const estadoBadge = area.activo 
            ? '<span class="badge badge-active">Activo</span>' 
            : '<span class="badge badge-inactive">Inactivo</span>';
        
        const fechaCreacion = area.created_at 
            ? new Date(area.created_at).toLocaleDateString('es-PE', { day: '2-digit', month: '2-digit', year: 'numeric' })
            : '-';
        
        const correo = area.correo || '<span style="color: var(--text-secondary);">Sin correo</span>';
        const descripcion = area.descripcion || '<span style="color: var(--text-secondary);">Sin descripción</span>';
        
        // Escapar caracteres especiales para evitar problemas en onclick
        const nombreEscapado = area.nombre.replace(/'/g, "\\'").replace(/"/g, "&quot;");
        
        return `
            <tr>
                <td data-label="Orden">${area.orden}</td>
                <td data-label="Nombre"><strong>${area.nombre}</strong></td>
                <td data-label="Correo" style="max-width: 300px; word-break: break-word;">${correo}</td>
                <td data-label="Descripción" style="max-width: 300px;">${descripcion}</td>
                <td data-label="Estado">${estadoBadge}</td>
                <td data-label="Fecha Creación">${fechaCreacion}</td>
                <td data-label="Acciones">
                    <div class="action-buttons">
                        <button class="btn-icon btn-edit" onclick="editarArea('${area.id}')" title="Editar">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>
                        </button>
                        <button class="btn-icon btn-delete" onclick="confirmarEliminarArea('${area.id}', '${nombreEscapado}')" title="Eliminar">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
                        </button>
                        <button class="btn-icon ${area.activo ? 'btn-deactivate' : 'btn-activate'}" 
                                onclick="toggleActivoArea('${area.id}', ${!area.activo})" 
                                title="${area.activo ? 'Desactivar' : 'Activar'}">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                ${area.activo 
                                    ? '<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>'
                                    : '<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>'
                                }
                            </svg>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
    
    mostrarPaginacionAreas();
}

// ============================================================
// BUSCAR ÁREAS
// ============================================================

function buscarAreas() {
    const searchTerm = document.getElementById('searchAreaInput').value.toLowerCase().trim();
    
    if (!searchTerm) {
        areasFiltradas = [...areasGlobales];
    } else {
        areasFiltradas = areasGlobales.filter(area => 
            area.nombre.toLowerCase().includes(searchTerm) ||
            (area.correo && area.correo.toLowerCase().includes(searchTerm)) ||
            (area.descripcion && area.descripcion.toLowerCase().includes(searchTerm))
        );
    }
    
    paginaActualAreas = 1; // Resetear a la primera página
    mostrarAreas();
}

// ============================================================
// PAGINACIÓN DE ÁREAS
// ============================================================

function mostrarPaginacionAreas() {
    const totalPaginas = Math.ceil(areasFiltradas.length / areasPorPagina);
    const contenedor = document.getElementById('paginacionAreas');

    if (totalPaginas <= 1) {
        contenedor.innerHTML = '';
        return;
    }

    let html = '';

    // Botón anterior
    html += `
        <button 
            class="pagination-btn" 
            onclick="cambiarPaginaAreas(${paginaActualAreas - 1})" 
            ${paginaActualAreas === 1 ? 'disabled' : ''}
        >
            Anterior
        </button>
    `;

    // Números de página
    for (let i = 1; i <= totalPaginas; i++) {
        // Mostrar solo algunas páginas para no saturar
        if (
            i === 1 || 
            i === totalPaginas || 
            (i >= paginaActualAreas - 1 && i <= paginaActualAreas + 1)
        ) {
            html += `
                <button 
                    class="pagination-btn ${i === paginaActualAreas ? 'active' : ''}" 
                    onclick="cambiarPaginaAreas(${i})"
                >
                    ${i}
                </button>
            `;
        } else if (i === paginaActualAreas - 2 || i === paginaActualAreas + 2) {
            html += '<span class="pagination-dots">...</span>';
        }
    }

    // Botón siguiente
    html += `
        <button 
            class="pagination-btn" 
            onclick="cambiarPaginaAreas(${paginaActualAreas + 1})" 
            ${paginaActualAreas === totalPaginas ? 'disabled' : ''}
        >
            Siguiente
        </button>
    `;

    contenedor.innerHTML = html;
}

function cambiarPaginaAreas(nuevaPagina) {
    paginaActualAreas = nuevaPagina;
    mostrarAreas();
}

// Exponer funciones de paginación globalmente
window.cambiarPaginaAreas = cambiarPaginaAreas;

// ============================================================
// MODAL: NUEVA ÁREA
// ============================================================

function abrirModalNuevaArea() {
    areaEditando = null;
    document.getElementById('modalTituloArea').textContent = 'Nueva Área';
    document.getElementById('formArea').reset();
    document.getElementById('inputActivoArea').checked = true;
    document.getElementById('modalArea').classList.add('active');
}

// ============================================================
// MODAL: EDITAR ÁREA
// ============================================================

async function editarArea(areaId) {
    console.log('🔧 [EDITAR] Intentando editar área con ID:', areaId);
    
    try {
        console.log('🔄 [EDITAR] Consultando Supabase...');
        
        const { data, error } = await supabase
            .from('areas')
            .select('*')
            .eq('id', areaId)
            .single();
        
        if (error) {
            console.error('❌ [EDITAR] Error de Supabase:', error);
            throw error;
        }
        
        console.log('✅ [EDITAR] Área encontrada:', data);
        
        areaEditando = data;
        
        document.getElementById('modalTituloArea').textContent = 'Editar Área';
        document.getElementById('inputNombreArea').value = data.nombre;
        document.getElementById('inputCorreoArea').value = data.correo || '';
        document.getElementById('inputDescripcionArea').value = data.descripcion || '';
        document.getElementById('inputIconoArea').value = data.icono || '';
        document.getElementById('inputOrdenArea').value = data.orden;
        document.getElementById('inputActivoArea').checked = data.activo;
        
        console.log('✅ [EDITAR] Modal abierto con datos cargados');
        document.getElementById('modalArea').classList.add('active');
        
    } catch (error) {
        console.error('❌ [EDITAR] Error al cargar área:', error);
        showToast('Error al cargar el área', 'error');
    }
}

// ============================================================
// CERRAR MODAL ÁREA
// ============================================================

function cerrarModalArea() {
    document.getElementById('modalArea').classList.remove('active');
    document.getElementById('formArea').reset();
    areaEditando = null;
}

// ============================================================
// GUARDAR ÁREA (CREAR O EDITAR)
// ============================================================

// Icono por defecto para áreas sin icono personalizado
const ICONO_POR_DEFECTO = '<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>';

async function guardarArea(event) {
    event.preventDefault();
    
    const iconoIngresado = document.getElementById('inputIconoArea').value.trim();
    
    const areaData = {
        nombre: document.getElementById('inputNombreArea').value.trim(),
        correo: document.getElementById('inputCorreoArea').value.trim() || null,
        descripcion: document.getElementById('inputDescripcionArea').value.trim() || null,
        icono: iconoIngresado || ICONO_POR_DEFECTO, // Usar icono por defecto si está vacío
        orden: parseInt(document.getElementById('inputOrdenArea').value),
        activo: document.getElementById('inputActivoArea').checked
    };
    
    console.log('💾 [GUARDAR] Datos del área:', {
        ...areaData,
        iconoUsado: iconoIngresado ? 'personalizado' : 'por defecto'
    });
    
    try {
        if (areaEditando) {
            // ACTUALIZAR
            const { error } = await supabase
                .from('areas')
                .update(areaData)
                .eq('id', areaEditando.id);
            
            if (error) throw error;
            
            showToast('Área actualizada correctamente', 'success');
        } else {
            // CREAR
            const { error } = await supabase
                .from('areas')
                .insert([areaData]);
            
            if (error) throw error;
            
            showToast('Área creada correctamente', 'success');
        }
        
        cerrarModalArea();
        cargarAreas();
        
    } catch (error) {
        console.error('❌ Error al guardar área:', error);
        
        if (error.code === '23505') {
            showToast('Ya existe un área con ese nombre', 'error');
        } else {
            showToast('Error al guardar el área', 'error');
        }
    }
}

// ============================================================
// TOGGLE ACTIVO/INACTIVO
// ============================================================

async function toggleActivoArea(areaId, nuevoEstado) {
    console.log('🔄 [TOGGLE] Cambiando estado de área:', { areaId, nuevoEstado });
    
    try {
        const { error } = await supabase
            .from('areas')
            .update({ activo: nuevoEstado })
            .eq('id', areaId);
        
        if (error) {
            console.error('❌ [TOGGLE] Error:', error);
            throw error;
        }
        
        console.log('✅ [TOGGLE] Estado actualizado correctamente');
        showToast(`Área ${nuevoEstado ? 'activada' : 'desactivada'} correctamente`, 'success');
        cargarAreas();
        
    } catch (error) {
        console.error('❌ [TOGGLE] Error al cambiar estado del área:', error);
        showToast('Error al cambiar el estado', 'error');
    }
}

// ============================================================
// CONFIRMAR ELIMINAR ÁREA
// ============================================================

let areaAEliminar = null;

function confirmarEliminarArea(areaId, areaNombre) {
    areaAEliminar = areaId;
    document.getElementById('mensajeConfirmarArea').innerHTML = `
        ¿Estás seguro de que deseas eliminar el área <strong>"${areaNombre}"</strong>?<br>
        <span style="color: var(--danger);">Esta acción no se puede deshacer.</span>
    `;
    document.getElementById('modalConfirmarArea').classList.add('active');
}

// ============================================================
// ELIMINAR ÁREA
// ============================================================

async function confirmarEliminacionArea() {
    if (!areaAEliminar) return;
    
    try {
        const { error } = await supabase
            .from('areas')
            .delete()
            .eq('id', areaAEliminar);
        
        if (error) throw error;
        
        showToast('Área eliminada correctamente', 'success');
        cerrarModalConfirmarArea();
        cargarAreas();
        areaAEliminar = null;
        
    } catch (error) {
        console.error('❌ Error al eliminar área:', error);
        showToast('Error al eliminar el área. Puede que tenga recursos asociados.', 'error');
    }
}

// ============================================================
// CERRAR MODAL DE CONFIRMACIÓN
// ============================================================

function cerrarModalConfirmarArea() {
    document.getElementById('modalConfirmarArea').classList.remove('active');
    areaAEliminar = null;
}
