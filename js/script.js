// ============================================================
// VARIABLES GLOBALES
// ============================================================

let recursosDatabase = [];
let currentUser = null;
let isAdmin = false;
let currentFilter = 'all';
let currentTypeFilter = 'all';
let currentPage = 1;
const ITEMS_PER_PAGE = 12;

// ============================================================
// VERIFICAR AUTENTICACIÓN
// ============================================================

async function checkAuth() {
    try {
        currentUser = await obtenerUsuarioActual();
        
        if (!currentUser) {
            window.location.replace('login.html');
            return;
        }
        
        // Validar dominio corporativo
        if (!currentUser.email.endsWith('@certus.edu.pe')) {
            await supabase.auth.signOut();
            window.location.replace('login.html?error=domain_not_allowed');
            return;
        }
        
        // Ocultar skeleton y mostrar contenido real
        const appbarSkeleton = document.getElementById('appbarSkeleton');
        const appbarContentRight = document.getElementById('appbarContentRight');
        
        if (appbarSkeleton) appbarSkeleton.style.display = 'none';
        if (appbarContentRight) appbarContentRight.style.display = 'flex';
        
        // Mostrar info del usuario
        document.querySelector('.user-email').textContent = currentUser.email;
        
        // Verificar si es admin
        isAdmin = await esAdministrador(currentUser.id);
        
        if (isAdmin) {
            document.getElementById('btnAdmin').style.display = 'flex';
        }
    } catch (error) {
        window.location.replace('login.html');
    }
}

// ============================================================
// CARGAR RECURSOS DESDE SUPABASE
// ============================================================

async function cargarRecursosDesdeSupabase() {
    try {
        // Mostrar skeleton loader
        document.getElementById('skeletonLoader').style.display = 'grid';
        document.getElementById('resultsGrid').style.display = 'none';
        
        const { data, error } = await supabase
            .from('recursos')
            .select('*')
            .eq('is_active', true)
            .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        recursosDatabase = data.map(r => ({
            id: r.id,
            area: r.area,
            titulo: r.titulo,
            descripcion: r.descripcion,
            enlace: r.enlace,
            palabras_clave: Array.isArray(r.palabras_clave) ? r.palabras_clave.join(', ') : ''
        }));
        
        // Ocultar skeleton loader
        document.getElementById('skeletonLoader').style.display = 'none';
        
        // Mostrar áreas y recursos
        displayAreasCarousel();
        displayResults();
        
    } catch (error) {
        console.error('❌ Error al cargar recursos:', error);
        document.getElementById('skeletonLoader').style.display = 'none';
        showError('No se pudieron cargar los recursos.');
    }
}

// ============================================================
// MOSTRAR CARRUSEL DE ÁREAS
// ============================================================

function displayAreasCarousel() {
    const carousel = document.getElementById('areasCarousel');
    
    // Áreas fijas con SVG profesionales
    const areasDefinidas = [
        {
            nombre: 'ATENCIÓN - FRONT',
            svg: '<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>'
        },
        {
            nombre: 'ATENCIÓN - CANALES',
            svg: '<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>'
        },
        {
            nombre: 'CRÉDITO Y COBRANZAS',
            svg: '<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>'
        },
        {
            nombre: 'FACTURACIÓN',
            svg: '<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>'
        },
        {
            nombre: 'RR.AA',
            svg: '<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>'
        },
        {
            nombre: 'PEC',
            svg: '<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="20" x2="12" y2="10"></line><line x1="18" y1="20" x2="18" y2="4"></line><line x1="6" y1="20" x2="6" y2="16"></line></svg>'
        },
        {
            nombre: 'REINGRESO',
            svg: '<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="1 4 1 10 7 10"></polyline><polyline points="23 20 23 14 17 14"></polyline><path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"></path></svg>'
        }
    ];
    
    carousel.innerHTML = areasDefinidas.map(area => {
        // Conteo exacto: el área del recurso debe coincidir exactamente
        const count = recursosDatabase.filter(r => {
            if (!r.area) return false;
            return r.area.toUpperCase() === area.nombre.toUpperCase();
        }).length;
        
        return `
            <div class="area-card" onclick="filterByArea('${area.nombre}')">
                <div class="area-card-content">
                    <h4>${area.nombre}</h4>
                    <p>Accede a los recursos de esta área</p>
                    <span class="area-count">${count} recurso${count !== 1 ? 's' : ''}</span>
                </div>
                <div class="area-icon">${area.svg}</div>
            </div>
        `;
    }).join('');
}

// ============================================================
// MOSTRAR RESULTADOS
// ============================================================

function displayResults(filteredData = null) {
    const resultsGrid = document.getElementById('resultsGrid');
    const noResults = document.getElementById('noResults');
    const resultsTitle = document.getElementById('resultsTitle');
    const paginationContainer = document.getElementById('paginationContainer');
    const skeletonLoader = document.getElementById('skeletonLoader');
    
    // Ocultar skeleton loader
    if (skeletonLoader) skeletonLoader.style.display = 'none';
    
    const data = filteredData || recursosDatabase;
    
    if (data.length === 0) {
        resultsGrid.style.display = 'none';
        noResults.style.display = 'block';
        if (paginationContainer) paginationContainer.style.display = 'none';
        return;
    }
    
    resultsGrid.style.display = 'grid';
    noResults.style.display = 'none';
    
    if (currentFilter !== 'all') {
        resultsTitle.textContent = `Recursos - ${currentFilter}`;
    } else {
        resultsTitle.textContent = 'Todos los Recursos';
    }
    
    // Calcular paginación
    const totalPages = Math.ceil(data.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const paginatedData = data.slice(startIndex, endIndex);
    
    resultsGrid.innerHTML = paginatedData.map(recurso => `
        <div class="result-card" onclick="openLink('${recurso.enlace}')">
            <div class="result-icon">
                ${getIconForLink(recurso.enlace)}
            </div>
            <div class="result-content">
                <span class="result-category">${recurso.area}</span>
                <h4>${recurso.titulo}</h4>
                <p>${recurso.descripcion || 'Sin descripción'}</p>
                <a href="${recurso.enlace}" target="_blank" class="result-link" onclick="event.stopPropagation()">
                    Abrir enlace
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                        <polyline points="15 3 21 3 21 9"/>
                        <line x1="10" y1="14" x2="21" y2="3"/>
                    </svg>
                </a>
            </div>
        </div>
    `).join('');
    
    // Mostrar paginación
    renderPagination(totalPages, data.length);
}

// ============================================================
// PAGINACIÓN
// ============================================================

function renderPagination(totalPages, totalItems) {
    const paginationContainer = document.getElementById('paginationContainer');
    
    if (!paginationContainer || totalPages <= 1) {
        if (paginationContainer) paginationContainer.style.display = 'none';
        return;
    }
    
    paginationContainer.style.display = 'flex';
    
    let paginationHTML = '<div class="pagination">';
    
    // Información de resultados
    const startItem = ((currentPage - 1) * ITEMS_PER_PAGE) + 1;
    const endItem = Math.min(currentPage * ITEMS_PER_PAGE, totalItems);
    paginationHTML += `<div class="pagination-info">Mostrando ${startItem}-${endItem} de ${totalItems} recursos</div>`;
    
    paginationHTML += '<div class="pagination-buttons">';
    
    // Botón anterior
    paginationHTML += `
        <button class="pagination-btn" onclick="changePage(${currentPage - 1})" ${currentPage === 1 ? 'disabled' : ''}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
            Anterior
        </button>
    `;
    
    // Números de página
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage < maxVisiblePages - 1) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    if (startPage > 1) {
        paginationHTML += `<button class="pagination-btn page-number" onclick="changePage(1)">1</button>`;
        if (startPage > 2) {
            paginationHTML += `<span class="pagination-ellipsis">...</span>`;
        }
    }
    
    for (let i = startPage; i <= endPage; i++) {
        paginationHTML += `
            <button class="pagination-btn page-number ${i === currentPage ? 'active' : ''}" onclick="changePage(${i})">
                ${i}
            </button>
        `;
    }
    
    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            paginationHTML += `<span class="pagination-ellipsis">...</span>`;
        }
        paginationHTML += `<button class="pagination-btn page-number" onclick="changePage(${totalPages})">${totalPages}</button>`;
    }
    
    // Botón siguiente
    paginationHTML += `
        <button class="pagination-btn" onclick="changePage(${currentPage + 1})" ${currentPage === totalPages ? 'disabled' : ''}>
            Siguiente
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
        </button>
    `;
    
    paginationHTML += '</div></div>';
    
    paginationContainer.innerHTML = paginationHTML;
}

function changePage(page) {
    currentPage = page;
    displayResults();
    document.getElementById('resultsSection').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ============================================================
// BÚSQUEDA
// ============================================================

function performSearch() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase().trim();
    const suggestionsContainer = document.getElementById('searchSuggestions');
    
    // Si está vacío, ocultar sugerencias y mostrar todos los recursos
    if (!searchTerm) {
        suggestionsContainer.classList.remove('show');
        suggestionsContainer.innerHTML = '';
        currentFilter = 'all';
        displayResults();
        return;
    }
    
    const normalize = (text) => {
        return text.toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '');
    };
    
    const normalizedSearch = normalize(searchTerm);
    
    const filtered = recursosDatabase.filter(recurso => {
        const searchableText = normalize(`
            ${recurso.area} 
            ${recurso.titulo} 
            ${recurso.descripcion} 
            ${recurso.palabras_clave}
        `);
        
        return searchableText.includes(normalizedSearch);
    });
    
    // Mostrar sugerencias en tiempo real
    if (filtered.length > 0) {
        const maxSuggestions = 5; // Máximo 5 sugerencias
        const suggestions = filtered.slice(0, maxSuggestions);
        
        suggestionsContainer.innerHTML = suggestions.map(recurso => `
            <div class="suggestion-item" onclick="selectSuggestion('${recurso.enlace}')">
                <div class="suggestion-icon">
                    ${getIconForLink(recurso.enlace)}
                </div>
                <div class="suggestion-content">
                    <div class="suggestion-area">${recurso.area}</div>
                    <div class="suggestion-title">${highlightMatch(recurso.titulo, searchTerm)}</div>
                    <div class="suggestion-description">${recurso.descripcion || 'Sin descripción'}</div>
                </div>
            </div>
        `).join('');
        
        if (filtered.length > maxSuggestions) {
            suggestionsContainer.innerHTML += `
                <div class="suggestion-item" style="justify-content: center; color: var(--primary); font-weight: 600;" onclick="showAllSearchResults()">
                    Ver todos los ${filtered.length} resultados
                </div>
            `;
        }
        
        suggestionsContainer.classList.add('show');
    } else {
        suggestionsContainer.innerHTML = '<div class="no-suggestions">No se encontraron resultados</div>';
        suggestionsContainer.classList.add('show');
    }
    
    // Actualizar resultados principales
    currentPage = 1;
    currentFilter = `Búsqueda: "${searchTerm}"`;
    displayResults(filtered);
}

function highlightMatch(text, searchTerm) {
    if (!searchTerm) return text;
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    return text.replace(regex, '<strong style="color: var(--primary);">$1</strong>');
}

function selectSuggestion(enlace) {
    // Ocultar sugerencias
    document.getElementById('searchSuggestions').classList.remove('show');
    // Abrir enlace
    window.open(enlace, '_blank');
}

function showAllSearchResults() {
    // Ocultar sugerencias
    document.getElementById('searchSuggestions').classList.remove('show');
    // Scroll a resultados
    document.getElementById('resultsSection').scrollIntoView({ behavior: 'smooth' });
}

// ============================================================
// FILTRAR POR ÁREA
// ============================================================

function filterByArea(area) {
    currentFilter = area;
    applyFilters();
    populateAreasDropdown();
    document.getElementById('resultsSection').scrollIntoView({ behavior: 'smooth' });
}

function filterByType(tipo) {
    currentTypeFilter = tipo;
    applyFilters();
    populateTiposDropdown();
    document.getElementById('resultsSection').scrollIntoView({ behavior: 'smooth' });
}

function applyFilters() {
    let filtered = recursosDatabase;
    
    // Filtrar por área (coincidencia exacta)
    if (currentFilter !== 'all') {
        filtered = filtered.filter(r => {
            if (!r.area) return false;
            return r.area.toUpperCase() === currentFilter.toUpperCase();
        });
    }
    
    // Filtrar por tipo de documento
    if (currentTypeFilter !== 'all') {
        filtered = filtered.filter(r => {
            if (!r.enlace) return false;
            const urlLower = r.enlace.toLowerCase();
            
            switch(currentTypeFilter) {
                case 'drive':
                    return urlLower.includes('drive.google.com') || urlLower.includes('docs.google.com/file');
                case 'sheets':
                    return urlLower.includes('sheets.google.com') || urlLower.includes('docs.google.com/spreadsheets');
                case 'docs':
                    return urlLower.includes('docs.google.com/document');
                case 'slides':
                    return urlLower.includes('docs.google.com/presentation');
                case 'forms':
                    return urlLower.includes('docs.google.com/forms');
                case 'youtube':
                    return urlLower.includes('youtube.com') || urlLower.includes('youtu.be');
                case 'pdf':
                    return urlLower.includes('.pdf');
                default:
                    return true;
            }
        });
    }
    
    displayResults(filtered);
}

// ============================================================
// DROPDOWN DE ÁREAS
// ============================================================

function toggleAreasDropdown() {
    const dropdown = document.getElementById('dropdownAreas');
    const button = document.getElementById('btnAreas');
    const dropdownTipos = document.getElementById('dropdownTipos');
    const buttonTipos = document.getElementById('btnTipos');
    
    dropdown.classList.toggle('show');
    button.classList.toggle('active');
    
    // Cerrar dropdown de tipos si está abierto
    if (dropdownTipos && dropdownTipos.classList.contains('show')) {
        dropdownTipos.classList.remove('show');
        buttonTipos.classList.remove('active');
    }
}

function toggleTiposDropdown() {
    const dropdown = document.getElementById('dropdownTipos');
    const button = document.getElementById('btnTipos');
    const dropdownAreas = document.getElementById('dropdownAreas');
    const buttonAreas = document.getElementById('btnAreas');
    
    dropdown.classList.toggle('show');
    button.classList.toggle('active');
    
    // Cerrar dropdown de áreas si está abierto
    if (dropdownAreas && dropdownAreas.classList.contains('show')) {
        dropdownAreas.classList.remove('show');
        buttonAreas.classList.remove('active');
    }
}

function populateAreasDropdown() {
    const dropdown = document.getElementById('dropdownAreas');
    
    // Áreas fijas con SVG
    const areasDefinidas = [
        {
            nombre: 'ATENCIÓN - FRONT',
            svg: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>'
        },
        {
            nombre: 'ATENCIÓN - CANALES',
            svg: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>'
        },
        {
            nombre: 'CRÉDITO Y COBRANZAS',
            svg: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>'
        },
        {
            nombre: 'FACTURACIÓN',
            svg: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>'
        },
        {
            nombre: 'RR.AA',
            svg: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>'
        },
        {
            nombre: 'PEC',
            svg: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/></svg>'
        },
        {
            nombre: 'REINGRESO',
            svg: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="1 4 1 10 7 10"/><polyline points="23 20 23 14 17 14"/><path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"/></svg>'
        }
    ];
    
    let html = `
        <div class="dropdown-item ${currentFilter === 'all' ? 'active' : ''}" onclick="currentFilter='all'; applyFilters(); populateAreasDropdown(); toggleAreasDropdown();">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
            <span>Todas las áreas</span>
        </div>
    `;
    
    areasDefinidas.forEach(area => {
        const isActive = currentFilter === area.nombre ? 'active' : '';
        html += `
            <div class="dropdown-item ${isActive}" onclick="filterByArea('${area.nombre}'); toggleAreasDropdown();">
                ${area.svg}
                <span>${area.nombre}</span>
            </div>
        `;
    });
    
    dropdown.innerHTML = html;
}

function populateTiposDropdown() {
    const dropdown = document.getElementById('dropdownTipos');
    
    if (!dropdown) {
        return;
    }
    
    const tiposDocumento = [
        {
            nombre: 'Google Drive',
            tipo: 'drive',
            icono: '<img src="https://ssl.gstatic.com/images/branding/product/1x/drive_2020q4_32dp.png" width="20" height="20" alt="Drive">'
        },
        {
            nombre: 'Google Sheets',
            tipo: 'sheets',
            icono: '<img src="https://ssl.gstatic.com/images/branding/product/1x/sheets_2020q4_32dp.png" width="20" height="20" alt="Sheets">'
        },
        {
            nombre: 'Google Docs',
            tipo: 'docs',
            icono: '<img src="https://ssl.gstatic.com/images/branding/product/1x/docs_2020q4_32dp.png" width="20" height="20" alt="Docs">'
        },
        {
            nombre: 'Google Slides',
            tipo: 'slides',
            icono: '<img src="https://ssl.gstatic.com/images/branding/product/1x/slides_2020q4_32dp.png" width="20" height="20" alt="Slides">'
        },
        {
            nombre: 'Google Forms',
            tipo: 'forms',
            icono: '<img src="https://ssl.gstatic.com/images/branding/product/1x/forms_2020q4_32dp.png" width="20" height="20" alt="Forms">'
        },
        {
            nombre: 'YouTube',
            tipo: 'youtube',
            icono: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#FF0000"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>'
        },
        {
            nombre: 'PDF',
            tipo: 'pdf',
            icono: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#E74C3C"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>'
        }
    ];
    
    let html = `
        <div class="dropdown-item ${currentTypeFilter === 'all' ? 'active' : ''}" onclick="filterByType('all'); toggleTiposDropdown();">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><polyline points="13 2 13 9 20 9"/></svg>
            <span>Todos los tipos</span>
        </div>
    `;
    
    tiposDocumento.forEach(tipo => {
        const isActive = currentTypeFilter === tipo.tipo ? 'active' : '';
        html += `
            <div class="dropdown-item ${isActive}" onclick="filterByType('${tipo.tipo}'); toggleTiposDropdown();">
                ${tipo.icono}
                <span>${tipo.nombre}</span>
            </div>
        `;
    });
    
    dropdown.innerHTML = html;
}

// ============================================================
// CARRUSEL
// ============================================================

function scrollCarousel(direction) {
    const carousel = document.getElementById('areasCarousel');
    const scrollAmount = 350;
    
    if (direction === 'left') {
        carousel.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    } else {
        carousel.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
}

// ============================================================
// UTILIDADES
// ============================================================

function getIconForLink(url) {
    if (!url) return '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><polyline points="13 2 13 9 20 9"/></svg>';
    
    const urlLower = url.toLowerCase();
    
    // Google Drive
    if (urlLower.includes('drive.google.com') || urlLower.includes('docs.google.com/file')) {
        return '<img src="https://ssl.gstatic.com/images/branding/product/1x/drive_2020q4_32dp.png" alt="Google Drive">';
    }
    // Google Sheets
    if (urlLower.includes('sheets.google.com') || urlLower.includes('docs.google.com/spreadsheets')) {
        return '<img src="https://ssl.gstatic.com/images/branding/product/1x/sheets_2020q4_32dp.png" alt="Google Sheets">';
    }
    // Google Docs
    if (urlLower.includes('docs.google.com/document')) {
        return '<img src="https://ssl.gstatic.com/images/branding/product/1x/docs_2020q4_32dp.png" alt="Google Docs">';
    }
    // Google Slides
    if (urlLower.includes('docs.google.com/presentation')) {
        return '<img src="https://ssl.gstatic.com/images/branding/product/1x/slides_2020q4_32dp.png" alt="Google Slides">';
    }
    // Google Forms
    if (urlLower.includes('docs.google.com/forms')) {
        return '<img src="https://ssl.gstatic.com/images/branding/product/1x/forms_2020q4_32dp.png" alt="Google Forms">';
    }
    // YouTube
    if (urlLower.includes('youtube.com') || urlLower.includes('youtu.be')) {
        return '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="#FF0000"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>';
    }
    // PDF
    if (urlLower.includes('.pdf')) {
        return '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="#E74C3C"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><text x="7" y="17" font-size="6" fill="white" font-weight="bold">PDF</text></svg>';
    }
    
    // Default - Documento genérico
    return '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><polyline points="13 2 13 9 20 9"/></svg>';
}

function openLink(url) {
    if (url) {
        window.open(url, '_blank');
    }
}

function showError(message) {
    const resultsGrid = document.getElementById('resultsGrid');
    resultsGrid.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 60px; color: #E74C3C;">
            <h3>⚠️ Error</h3>
            <p>${message}</p>
        </div>
    `;
}

function irAdminPanel() {
    window.location.href = 'admin.html';
}

// ============================================================
// INICIALIZACIÓN
// ============================================================

window.addEventListener('DOMContentLoaded', async () => {
    await checkAuth();
    await cargarRecursosDesdeSupabase();
    
    // Inicializar dropdowns
    populateAreasDropdown();
    populateTiposDropdown();
    
    // Event listener para el botón de áreas
    const btnAreas = document.getElementById('btnAreas');
    if (btnAreas) {
        btnAreas.addEventListener('click', function(e) {
            e.stopPropagation();
            toggleAreasDropdown();
        });
    }
    
    // Event listener para el botón de tipos
    const btnTipos = document.getElementById('btnTipos');
    if (btnTipos) {
        btnTipos.addEventListener('click', function(e) {
            e.stopPropagation();
            toggleTiposDropdown();
        });
    }
    
    // Cerrar dropdowns al hacer click fuera
    document.addEventListener('click', function(event) {
        const dropdownAreas = document.getElementById('dropdownAreas');
        const buttonAreas = document.getElementById('btnAreas');
        const dropdownTipos = document.getElementById('dropdownTipos');
        const buttonTipos = document.getElementById('btnTipos');
        const searchSuggestions = document.getElementById('searchSuggestions');
        const searchInput = document.getElementById('searchInput');
        
        if (dropdownAreas && buttonAreas && !dropdownAreas.contains(event.target) && !buttonAreas.contains(event.target)) {
            dropdownAreas.classList.remove('show');
            buttonAreas.classList.remove('active');
        }
        
        if (dropdownTipos && buttonTipos && !dropdownTipos.contains(event.target) && !buttonTipos.contains(event.target)) {
            dropdownTipos.classList.remove('show');
            buttonTipos.classList.remove('active');
        }
        
        // Cerrar sugerencias al hacer clic fuera del buscador
        if (searchSuggestions && searchInput && !searchSuggestions.contains(event.target) && !searchInput.contains(event.target)) {
            searchSuggestions.classList.remove('show');
        }
    });
});
