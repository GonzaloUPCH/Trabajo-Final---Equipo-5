import supabase from './supabase.js'

export async function getSalaEspera() {
  const { data, error } = await supabase
    .from('sala_espera')
    .select('*, citas(codigo, especialidad, medico, fecha, hora, prioridad, paciente_id, pacientes(nombres, apellidos))')
    .order('orden_prioridad', { ascending: true })
    .order('hora_llegada', { ascending: true })
  return { data, error }
}

export async function updateEstadoSalaEspera(id, nuevoEstado) {
  const { data: registro, error: registroError } = await supabase
    .from('sala_espera')
    .select('cita_id, citas(especialidad, medico, paciente_id)')
    .eq('id', id)
    .single()

  if (registroError) {
    return { data: null, error: registroError }
  }

  const { error: updateError } = await supabase
    .from('sala_espera')
    .update({ estado: nuevoEstado })
    .eq('id', id)

  if (updateError) {
    return { data: null, error: updateError }
  }

  if (nuevoEstado === 'En atención') {
    const { error } = await supabase
      .from('citas')
      .update({ estado: 'En atención' })
      .eq('id', registro.cita_id)
    return { data: registro, error }
  }

  if (nuevoEstado === 'Atendido') {
    const { error: rpcError } = await supabase.rpc('marcar_atendido', { sala_espera_id_input: id })
    if (rpcError) return { data: null, error: rpcError }
    return { data: null, error: null }
  }

  return { data: registro, error: null }
}

export async function removeFromSalaEspera(id) {
  const { data, error } = await supabase
    .from('sala_espera')
    .delete()
    .eq('id', id)
  return { data, error }
}

export async function getSalaEsperaStats() {
  const { data, error } = await supabase
    .from('sala_espera')
    .select('estado')

  const stats = { esperando: 0, enAtencion: 0, atendido: 0, ausente: 0 }

  if (error || !data) {
    return stats
  }

  data.forEach((row) => {
    if (row.estado === 'Esperando') stats.esperando++
    else if (row.estado === 'En atención') stats.enAtencion++
    else if (row.estado === 'Atendido') stats.atendido++
    else if (row.estado === 'Ausente') stats.ausente++
  })

  return stats
}
