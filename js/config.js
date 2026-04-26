// ============================================================
// CONFIGURACIÓN DE SUPABASE
// ============================================================
// IMPORTANTE: En producción (Netlify), estas variables deben 
// estar en Variables de Entorno, NO en el código

const SUPABASE_URL = 'https://tpciwzofvygzjikaiqco.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRwY2l3em9mdnlnemppa2FpcWNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcxNjQxMjcsImV4cCI6MjA5Mjc0MDEyN30.a0OBdUBO4pIgs5e018enhcU5DIfCUfvMs4ABZzaXPCk';

// Dominio corporativo permitido
const CORPORATE_DOMAIN = '@certus.edu.pe';

// Inicializar cliente de Supabase
// Usamos var para evitar conflicto con window.supabase del CDN
var supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
