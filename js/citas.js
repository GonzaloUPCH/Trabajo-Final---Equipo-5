import supabase from './supabase.js'

export async function getCitas() {
  const { data, error } = await supabase
    .from('citas')
    .select('*, pacientes(nombres, apellidos, codigo)')
    .order('fecha', { ascending: false })
    .order('hora', { ascending: false })
  return { data, error }
}

export async function getCitaById(id) {
  const { data, error } = await supabase
    .from('citas')
    .select('*')
    .eq('id', id)
    .single()
  return { data, error }
}

export async function createCita(citaData) {
  const { data, error } = await supabase
    .from('citas')
    .insert(citaData)
    .select()
  return { data, error }
}

export async function updateCita(id, citaData) {
  const { data, error } = await supabase
    .from('citas')
    .update(citaData)
    .eq('id', id)
    .select()
  return { data, error }
}

export async function deleteCita(id) {
  const { count, error: countError } = await supabase
    .from('sala_espera')
    .select('*', { count: 'exact', head: true })
    .eq('cita_id', id)

  if (countError) {
    return { data: null, error: countError }
  }

  if (count > 0) {
    return { data: null, error: { message: 'No se puede eliminar una cita que está en sala de espera.' } }
  }

  const { data, error } = await supabase
    .from('citas')
    .delete()
    .eq('id', id)
  return { data, error }
}

export async function getCitasByPaciente(pacienteId) {
  const { data, error } = await supabase
    .from('citas')
    .select('*')
    .eq('paciente_id', pacienteId)
  return { data, error }
}

export async function generateCodigoCita() {
  const { count } = await supabase
    .from('citas')
    .select('*', { count: 'exact', head: true })
  return 'CIT-' + String((count || 0) + 1).padStart(4, '0')
}

export async function getPacientesForSelect() {
  const { data, error } = await supabase
    .from('pacientes')
    .select('id, codigo, nombres, apellidos')
    .order('apellidos', { ascending: true })
  return { data, error }
}

export async function confirmarCita(id) {
  const { data, error } = await supabase.rpc('confirmar_cita', { cita_id_input: id })
  return { data, error }
}
