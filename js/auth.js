import supabase from './supabase.js'

export async function registerUser(nombre, correo, password, rol) {
  const { data, error } = await supabase.auth.signUp({
    email: correo,
    password: password,
    options: {
      data: {
        nombre: nombre,
        rol: rol
      }
    }
  })
  return { data, error }
}

export async function loginUser(correo, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: correo,
    password: password
  })
  return { data, error }
}

export async function logoutUser() {
  const { error } = await supabase.auth.signOut()
  return { error }
}

export async function getCurrentUser() {
  const { data, error } = await supabase.auth.getUser()
  if (error) return null
  return data.user
}

export async function getUserProfile(userId) {
  const { data, error } = await supabase
    .from('usuarios_perfil')
    .select('*')
    .eq('user_id', userId)
    .single()
  if (error) return null
  return data
}
