import supabase from './supabase.js'

export async function getHistorial() {
  const { data, error } = await supabase
    .from('historial_consultas')
    .select('*, pacientes(nombres, apellidos, codigo), citas(cita_codigo:codigo)')
    .order('fecha_atencion', { ascending: false })
  return { data, error }
}

export async function getHistorialById(id) {
  const { data, error } = await supabase
    .from('historial_consultas')
    .select('*, pacientes(nombres, apellidos), citas(codigo)')
    .eq('id', id)
    .single()
  return { data, error }
}

export async function getHistorialByPaciente(pacienteId) {
  const { data, error } = await supabase
    .from('historial_consultas')
    .select('*')
    .eq('paciente_id', pacienteId)
    .order('fecha_atencion', { ascending: false })
  return { data, error }
}

export async function updateHistorial(id, historialData) {
  const { data, error } = await supabase
    .from('historial_consultas')
    .update({
      sintomas: historialData.sintomas,
      diagnostico: historialData.diagnostico,
      tratamiento: historialData.tratamiento,
      medicamentos: historialData.medicamentos,
      observaciones: historialData.observaciones,
      proxima_cita: historialData.proxima_cita
    })
    .eq('id', id)
    .select()
  return { data, error }
}

export async function searchHistorial(query) {
  const { data, error } = await supabase
    .from('historial_consultas')
    .select('*, pacientes!inner(nombres, apellidos, codigo, documento), citas(cita_codigo:codigo)')
    .or(`nombres.ilike.%${query}%,apellidos.ilike.%${query}%,documento.ilike.%${query}%`, { referencedTable: 'pacientes' })
    .order('fecha_atencion', { ascending: false })
  return { data, error }
}
