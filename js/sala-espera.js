// js/ui.js

// Mejora la forma de mostrar errores (ya no uses alert())
export function manejarErrorSupabase(error, elementoError) {
    if (error) {
        console.error("Error en Supabase:", error);
        elementoError.textContent = `Error: ${error.message}`;
        elementoError.classList.remove('hidden');
        // Ocultar automáticamente tras 5 segundos
        setTimeout(() => elementoError.classList.add('hidden'), 5000);
    }
}

// Helper para capitalizar textos (da un toque profesional)
export function capitalizar(texto) {
    if (!texto) return "";
    return texto.charAt(0).toUpperCase() + texto.slice(1);
}