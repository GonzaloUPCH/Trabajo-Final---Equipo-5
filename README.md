# Sistema de Gestión de Clínica

## Integrantes
- Jose Gonzalo Saldaña Rodriguez
- Kaira Johany Portocarrero Hoyos
- Reynaldo Ulises Jimenez Gamboa 
- Jeremy  Mendez Ponce de Leon
## Caso elegido
Sistema de Gestión de Clínica

## Descripción del sistema
Aplicación web funcional para la gestión integral de una clínica médica. Permite administrar pacientes, programar citas, gestionar la sala de espera virtual y mantener el historial de consultas médicas. Construida con HTML, CSS y JavaScript vanilla, autenticación y base de datos en Supabase.

## Tecnologías usadas
- HTML5, CSS3, JavaScript (ES Modules, sin frameworks)
- Supabase Auth (autenticación con email/password)
- Supabase Database (PostgreSQL)
- Supabase RLS (Row Level Security)
- Git y GitHub

## Módulos desarrollados
1. **Autenticación** — Login, registro y cierre de sesión con Supabase Auth
2. **Gestión de Pacientes** — CRUD completo con búsqueda y código auto-generado
3. **Programación de Citas** — CRUD con validación de duplicados por médico/fecha/hora y confirmación a sala de espera
4. **Sala de Espera Virtual** — Control de estados (Esperando → En Atención → Atendido), estadísticas en tiempo real y auto-refresh cada 30 segundos
5. **Historial de Consultas** — Creación automática al atender una cita, edición de diagnóstico y tratamiento

## Roles implementados
| Rol | Acceso |
|-----|--------|
| Administrador | Todo el sistema |
| Recepción | Pacientes, Citas, Sala de Espera |
| Médico | Sala de Espera, Historial |
| Enfermería | Sala de Espera |

## Credenciales de prueba
| Rol | Correo | Contraseña |
|-----|--------|------------|
| Administrador | admin@clinica.com | 123456 |
| Médico | medico@clinica.com | 123456 |

## Estructura de tablas
| Tabla | Descripción |
|-------|-------------|
| `usuarios_perfil` | Perfil de usuario vinculado a auth.users |
| `pacientes` | Registro de pacientes con datos personales y contacto de emergencia |
| `citas` | Programación de citas con médico, especialidad, fecha y prioridad |
| `sala_espera` | Control de pacientes en espera vinculados a citas confirmadas |
| `historial_consultas` | Registro clínico de consultas atendidas |

## Reglas de integración
- Los pacientes registrados aparecen automáticamente en el módulo de citas
- Al confirmar una cita, pasa automáticamente a sala de espera (transacción atómica via RPC)
- Al marcar una cita como atendida, se crea automáticamente el historial (transacción atómica via RPC)
- No puede existir historial sin cita atendida (constraint UNIQUE en cita_id)

## Instrucciones para ejecutar
### Opción 1 — Servidor local con Python
```bash
git clone https://github.com/GonzaloUPCH/Trabajo-Final---Equipo-5.git
cd Trabajo-Final---Equipo-5
python3 -m http.server 3000
# Abrir http://localhost:3000/index.html
```

### Opción 2 — URL desplegada
(https://dakuectdqyrwyvvzwepl.supabase.co)

## Capturas del sistema

## Estructura del proyecto
```
├── index.html              # Login y registro
├── database.sql            # Script SQL completo
├── pages/
│   ├── dashboard.html      # Panel principal con RBAC
│   ├── pacientes.html      # Gestión de pacientes
│   ├── citas.html          # Programación de citas
│   ├── sala-espera.html    # Sala de espera virtual
│   └── historial.html      # Historial de consultas
├── js/
│   ├── supabase.js         # Cliente Supabase
│   ├── auth.js             # Lógica de autenticación
│   ├── ui.js               # Utilidades compartidas de UI
│   ├── pacientes.js        # CRUD pacientes
│   ├── citas.js            # CRUD citas
│   ├── sala-espera.js      # Lógica sala de espera
│   └── historial.js        # CRUD historial
└── css/
    ├── global.css          # Estilos globales
    ├── auth.css            # Estilos login/registro
    ├── dashboard.css       # Estilos dashboard
    ├── pacientes.css       # Estilos módulo pacientes
    ├── citas.css           # Estilos módulo citas
    ├── sala-espera.css     # Estilos sala de espera
    └── historial.css       # Estilos historial
```

## Problemas encontrados y solución aplicada
| Problema | Solución |
|----------|----------|
| Email confirmation bloqueaba el login en desarrollo | Desactivar "Confirm email" en Supabase Auth settings |
| Race condition en generación de códigos PAC/CIT | Constraint UNIQUE en campo codigo — Supabase rechaza duplicados |
| Operaciones multi-tabla no atómicas (confirmar cita, marcar atendido) | Implementadas como funciones PostgreSQL con SECURITY DEFINER via RPC |
| Modal visible al cargar por conflicto display:flex vs .hidden | Regla CSS `.modal.hidden { display: none !important }` |
| Timezone UTC en todayISO() generaba fecha incorrecta en Perú | Reemplazado con fecha local usando getFullYear/getMonth/getDate |

## División de responsabilidades

| Integrante | Responsabilidad |
|------------|-----------------|
| Jose Gonzalo Saldaña Rodriguez | Líder del equipo |
| Reynaldo Ulises Jimenez Gamboa | Coordinador |
<img width="1600" height="757" alt="sistemasfinal1" src="https://github.com/user-attachments/assets/72e24faf-f07d-44f1-911e-b11bc8e5f941" />
<img width="1600" height="757" alt="sistemasfinal2" src="https://github.com/user-attachments/assets/b8d0de51-85b1-41fe-9dbb-6a7a9b32f5d9" />
<img width="1251" height="852" alt="sistemasfinal5" src="https://github.com/user-attachments/assets/6d5ce521-4626-4bf5-8217-8a94445d124c" />
<img width="1266" height="717" alt="sistemasfinal4" src="https://github.com/user-attachments/assets/45603e17-6a2a-4766-8a7a-1be9da93bf10" />
<img width="1547" height="860" alt="sistemasfinal3" src="https://github.com/user-attachments/assets/5f293eb9-7db4-4b95-a2ff-40a53c6ea057" />

