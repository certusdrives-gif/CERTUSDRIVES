// ============================================================
// CONFIGURACIÓN DE SUPABASE
// ============================================================
// IMPORTANTE: En producción (Netlify), estas variables deben 
// estar en Variables de Entorno, NO en el código

const SUPABASE_URL = 'https://alcrunnigsatnvwexssd.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFsY3J1bm5pZ3NhdG52d2V4c3NkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIxOTQzMjQsImV4cCI6MjA3Nzc3MDMyNH0.xQlhoBHJYKwMEQnIqCwq3rzG6GqOLxYI43Z4VafGorA';

// Dominio corporativo permitido
const CORPORATE_DOMAIN = '@certus.edu.pe';

// Inicializar cliente de Supabase
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
