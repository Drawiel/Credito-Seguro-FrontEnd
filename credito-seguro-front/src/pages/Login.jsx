import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios'; // Importamos la instancia pública que creamos antes

// 1. Esquema de validación (Mismo que en tu backend)
const loginSchema = z.object({
  correo: z.string()
    .min(1, "El correo es requerido")
    .email("Correo inválido"),
  contraseña: z.string()
    .min(1, "La contraseña es requerida")
});

export default function Login() {
  const navigate = useNavigate();
  const [errorGeneral, setErrorGeneral] = useState('');
  
  // 2. Configuración del formulario
  const { 
    register, 
    handleSubmit, 
    formState: { errors, isSubmitting } 
  } = useForm({
    resolver: zodResolver(loginSchema)
  });

  // 3. Función que envía los datos
  const onSubmit = async (data) => {
    setErrorGeneral('');
    try {
      // NOTA: Asegúrate de que tu backend espera POST en /auth/login
      const response = await api.post('/auth/login', data);
      
      console.log("Respuesta del servidor:", response.data);

      // 4. Guardamos los tokens (Ajusta 'datos' según venga tu respuesta JSON exacta)
      // Normalmente responderConExito devuelve { success: true, mensaje: "", datos: {...} }
      const { token, refreshToken, usuario } = response.data.datos || response.data;

      if (token && refreshToken) {
        localStorage.setItem('token', token);
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('usuario', JSON.stringify(usuario));
        
        navigate('/dashboard'); 
      } else {
        setErrorGeneral("El servidor no devolvió los tokens esperados.");
      }

    } catch (error) {
      console.error(error);
      if (error.response) {
        setErrorGeneral(error.response.data.mensaje || "Credenciales incorrectas");
      } else {
        setErrorGeneral("No se pudo conectar con el servidor.");
      }
    }
  };

  // 5. Renderizado (HTML + CSS Básico)
  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Iniciar Sesión</h2>
        <p style={styles.subtitle}>Sistema de Consulta Crediticia</p>

        <form onSubmit={handleSubmit(onSubmit)} style={styles.form}>
          
          {/* Campo Correo */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>Correo Electrónico</label>
            <input 
              type="email" 
              {...register('correo')}
              style={styles.input}
              placeholder="admin@banco.com"
            />
            {errors.correo && <span style={styles.error}>{errors.correo.message}</span>}
          </div>

          {/* Campo Contraseña */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>Contraseña</label>
            <input 
              type="password" 
              {...register('contraseña')}
              style={styles.input}
              placeholder="********"
            />
            {errors.contraseña && <span style={styles.error}>{errors.contraseña.message}</span>}
          </div>

          {/* Mensaje de Error General */}
          {errorGeneral && <div style={styles.alertError}>{errorGeneral}</div>}

          {/* Botón Submit */}
          <button type="submit" disabled={isSubmitting} style={styles.button}>
            {isSubmitting ? 'Cargando...' : 'Ingresar'}
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex', justifyContent: 'center', alignItems: 'center',
    height: '100vh', backgroundColor: '#f3f4f6', fontFamily: 'Arial, sans-serif'
  },
  card: {
    backgroundColor: 'white', padding: '2rem', borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)', width: '100%', maxWidth: '400px'
  },
  title: { textAlign: 'center', color: '#111827', marginBottom: '0.5rem' },
  subtitle: { textAlign: 'center', color: '#6b7280', marginBottom: '2rem', fontSize: '0.9rem' },
  form: { display: 'flex', flexDirection: 'column', gap: '1rem' },
  inputGroup: { display: 'flex', flexDirection: 'column', gap: '0.5rem' },
  label: { fontSize: '0.9rem', fontWeight: 'bold', color: '#374151' },
  input: {
    padding: '0.75rem', borderRadius: '4px', border: '1px solid #d1d5db', fontSize: '1rem'
  },
  button: {
    padding: '0.75rem', backgroundColor: '#2563eb', color: 'white', border: 'none',
    borderRadius: '4px', fontSize: '1rem', cursor: 'pointer', fontWeight: 'bold',
    marginTop: '1rem'
  },
  error: { color: '#dc2626', fontSize: '0.8rem' },
  alertError: {
    backgroundColor: '#fee2e2', color: '#991b1b', padding: '0.75rem',
    borderRadius: '4px', fontSize: '0.9rem', textAlign: 'center'
  }
};