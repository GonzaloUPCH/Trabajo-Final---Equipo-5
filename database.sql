CREATE TABLE usuarios_perfil (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  nombre TEXT NOT NULL,
  correo TEXT NOT NULL,
  rol TEXT NOT NULL CHECK (rol IN ('Administrador', 'Recepción', 'Médico', 'Enfermería')),
  fecha_creacion TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE pacientes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  codigo TEXT UNIQUE NOT NULL,
  nombres TEXT NOT NULL,
  apellidos TEXT NOT NULL,
  tipo_documento TEXT NOT NULL CHECK (tipo_documento IN ('DNI', 'Pasaporte', 'Carné de Extranjería')),
  documento TEXT UNIQUE NOT NULL,
  fecha_nacimiento DATE NOT NULL,
  telefono TEXT,
  correo TEXT,
  direccion TEXT,
  alergias TEXT,
  contacto_emergencia_nombre TEXT,
  contacto_emergencia_parentesco TEXT,
  contacto_emergencia_telefono TEXT,
  fecha_creacion TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE citas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  codigo TEXT UNIQUE NOT NULL,
  paciente_id UUID NOT NULL REFERENCES pacientes(id) ON DELETE RESTRICT,
  especialidad TEXT NOT NULL,
  medico TEXT NOT NULL,
  fecha DATE NOT NULL,
  hora TIME NOT NULL,
  motivo TEXT,
  prioridad TEXT NOT NULL CHECK (prioridad IN ('Normal', 'Urgente', 'Emergencia')),
  justificacion_prioridad TEXT,
  estado TEXT NOT NULL DEFAULT 'Programada' CHECK (estado IN ('Programada', 'Confirmada', 'En espera', 'En atención', 'Atendida', 'Cancelada')),
  fecha_creacion TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT unique_medico_fecha_hora UNIQUE (medico, fecha, hora)
);

CREATE TABLE sala_espera (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cita_id UUID NOT NULL UNIQUE REFERENCES citas(id) ON DELETE RESTRICT,
  hora_llegada TIMESTAMPTZ DEFAULT NOW(),
  estado TEXT NOT NULL DEFAULT 'Esperando' CHECK (estado IN ('Esperando', 'En atención', 'Atendido', 'Ausente')),
  orden_prioridad INTEGER
);

CREATE TABLE historial_consultas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  paciente_id UUID NOT NULL REFERENCES pacientes(id) ON DELETE RESTRICT,
  cita_id UUID NOT NULL UNIQUE REFERENCES citas(id) ON DELETE RESTRICT,
  medico TEXT NOT NULL,
  especialidad TEXT NOT NULL,
  fecha_atencion DATE NOT NULL,
  sintomas TEXT,
  diagnostico TEXT NOT NULL,
  tratamiento TEXT,
  medicamentos TEXT,
  observaciones TEXT,
  proxima_cita DATE,
  fecha_creacion TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE usuarios_perfil ENABLE ROW LEVEL SECURITY;
ALTER TABLE pacientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE citas ENABLE ROW LEVEL SECURITY;
ALTER TABLE sala_espera ENABLE ROW LEVEL SECURITY;
ALTER TABLE historial_consultas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON usuarios_perfil
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON usuarios_perfil
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Authenticated users can SELECT" ON pacientes
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can INSERT" ON pacientes
  FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can UPDATE" ON pacientes
  FOR UPDATE TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can DELETE" ON pacientes
  FOR DELETE TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can SELECT" ON citas
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can INSERT" ON citas
  FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can UPDATE" ON citas
  FOR UPDATE TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can DELETE" ON citas
  FOR DELETE TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can SELECT" ON sala_espera
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can INSERT" ON sala_espera
  FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can UPDATE" ON sala_espera
  FOR UPDATE TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can DELETE" ON sala_espera
  FOR DELETE TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can SELECT" ON historial_consultas
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can INSERT" ON historial_consultas
  FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can UPDATE" ON historial_consultas
  FOR UPDATE TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can DELETE" ON historial_consultas
  FOR DELETE TO authenticated
  USING (true);

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.usuarios_perfil (user_id, nombre, correo, rol)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'nombre',
    NEW.email,
    NEW.raw_user_meta_data->>'rol'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE OR REPLACE FUNCTION public.confirmar_cita(cita_id_input UUID)
RETURNS void AS $$
DECLARE
  v_prioridad TEXT;
  v_orden INTEGER;
BEGIN
  SELECT prioridad INTO v_prioridad FROM public.citas WHERE id = cita_id_input;

  IF v_prioridad = 'Emergencia' THEN v_orden := 1;
  ELSIF v_prioridad = 'Urgente' THEN v_orden := 2;
  ELSE v_orden := 3;
  END IF;

  UPDATE public.citas SET estado = 'Confirmada' WHERE id = cita_id_input;

  INSERT INTO public.sala_espera (cita_id, estado, orden_prioridad)
  VALUES (cita_id_input, 'Esperando', v_orden);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.marcar_atendido(sala_espera_id_input UUID)
RETURNS void AS $$
DECLARE
  v_cita_id UUID;
  v_paciente_id UUID;
  v_medico TEXT;
  v_especialidad TEXT;
BEGIN
  SELECT se.cita_id, c.paciente_id, c.medico, c.especialidad
  INTO v_cita_id, v_paciente_id, v_medico, v_especialidad
  FROM public.sala_espera se
  JOIN public.citas c ON c.id = se.cita_id
  WHERE se.id = sala_espera_id_input;

  UPDATE public.sala_espera SET estado = 'Atendido' WHERE id = sala_espera_id_input;
  UPDATE public.citas SET estado = 'Atendida' WHERE id = v_cita_id;

  INSERT INTO public.historial_consultas (paciente_id, cita_id, medico, especialidad, fecha_atencion, diagnostico)
  VALUES (v_paciente_id, v_cita_id, v_medico, v_especialidad, CURRENT_DATE, 'Pendiente de completar')
  ON CONFLICT (cita_id) DO NOTHING;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
