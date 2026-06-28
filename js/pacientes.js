import supabase from './supabase.js'

export async function getPacientes() {
  const { data, error } = await supabase
    .from('pacientes')
    .select('*')
    .order('fecha_creacion', { ascending: false })
  return { data, error }
}

export async function getPacienteById(id) {
  const { data, error } = await supabase
    .from('pacientes')
    .select('*')
    .eq('id', id)
    .single()
  return { data, error }
}

export async function searchPacientes(query) {
  const { data, error } = await supabase
    .from('pacientes')
    .select('*')
    .or(`nombres.ilike.%${query}%,apellidos.ilike.%${query}%,documento.ilike.%${query}%,codigo.ilike.%${query}%`)
    .order('fecha_creacion', { ascending: false })
  return { data, error }
}

export async function createPaciente(pacienteData) {
  const { data, error } = await supabase
    .from('pacientes')
    .insert(pacienteData)
    .select()
  return { data, error }
}

export async function updatePaciente(id, pacienteData) {
  const { data, error } = await supabase
    .from('pacientes')
    .update(pacienteData)
    .eq('id', id)
    .select()
  return { data, error }
}

export async function deletePaciente(id) {
  const { count, error: countError } = await supabase
    .from('citas')
    .select('*', { count: 'exact', head: true })
    .eq('paciente_id', id)

  if (countError) {
    return { data: null, error: countError }
  }

  if (count > 0) {
    return { data: null, error: { message: 'No se puede eliminar un paciente con citas registradas.' } }
  }

  const { data, error } = await supabase
    .from('pacientes')
    .delete()
    .eq('id', id)
  return { data, error }
}

export async function generateCodigoPaciente() {
  const { count } = await supabase
    .from('pacientes')
    .select('*', { count: 'exact', head: true })
  return 'PAC-' + String((count || 0) + 1).padStart(4, '0')
}
