// ============================================================
// CONFIGURACIÓN DE SUPABASE
// ============================================================
// IMPORTANTE: En producción (Netlify), estas variables deben 
// estar en Variables de Entorno, NO en el código

// Envolvemos en IIFE para evitar conflicto con la variable 'supabase' del CDN
;(function() {
    var SUPABASE_URL = 'https://tpciwzofvygzjikaiqco.supabase.co';
    var SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRwY2l3em9mdnlnemppa2FpcWNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcxNjQxMjcsImV4cCI6MjA5Mjc0MDEyN30.a0OBdUBO4pIgs5e018enhcU5DIfCUfvMs4ABZzaXPCk';

    // Dominio corporativo permitido - expuesto globalmente
    window.CORPORATE_DOMAIN = '@certus.edu.pe';

    // Inicializar cliente de Supabase
    // Guardamos la función createClient del CDN, luego sobreescribimos el global
    var createClient = supabase.createClient;
    window.supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
})();
