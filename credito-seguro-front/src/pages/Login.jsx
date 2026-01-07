import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import logo from '../assets/logo.png'; // 👈 logo

// Validación
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

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(loginSchema)
  });

  const onSubmit = async (data) => {
    setErrorGeneral('');
    try {
      const response = await api.post('/auth/login', data);
      const { token, refreshToken, usuario } = response.data.datos || response.data;

      if (!token || !refreshToken) {
        setErrorGeneral("El servidor no devolvió los tokens esperados.");
        return;
      }

      localStorage.setItem('token', token);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('usuario', JSON.stringify(usuario));

      const rol = usuario?.rol;
      const tipoEntidad = usuario?.entidad?.tipoEntidad;

      if (rol === "ADMINISTRADOR") navigate("/admin");
      else if (tipoEntidad === "MORAL") navigate("/banco");
      else navigate("/cliente");

    } catch (error) {
      if (error.response) {
        setErrorGeneral(error.response.data.mensaje || "Credenciales incorrectas");
      } else {
        setErrorGeneral("No se pudo conectar con el servidor.");
      }
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>

        {/* Logo */}
        <div style={styles.logoContainer}>
          <img src={logo} alt="Crédito Seguro" style={styles.logo} />
          <h1 style={styles.brand}>CRÉDITO SEGURO</h1>
        </div>

        <p style={styles.subtitle}>Sistema de Consulta Crediticia</p>

        <form onSubmit={handleSubmit(onSubmit)} style={styles.form}>

          {/* Correo */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>Correo electrónico</label>
            <input
              type="email"
              {...register('correo')}
              style={styles.input}
              placeholder="admin@banco.com"
            />
            {errors.correo && <span style={styles.error}>{errors.correo.message}</span>}
          </div>

          {/* Contraseña */}
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

          {errorGeneral && <div style={styles.alertError}>{errorGeneral}</div>}

          <button type="submit" disabled={isSubmitting} style={styles.primaryButton}>
            {isSubmitting ? 'Cargando...' : 'Iniciar sesión'}
          </button>
        </form>

        {/* Botones secundarios */}
        <div style={styles.actions}>
          <button onClick={() => navigate('/registrar-cuenta')} style={styles.secondaryButton}>
            Crear cuenta
          </button>

          <button onClick={() => navigate('/registrar-entidad')} style={styles.secondaryButton}>
            Registrar Entidad
          </button>

        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#f3f4f6',
    fontFamily: 'Arial, sans-serif'
  },
  card: {
    backgroundColor: '#ffffff',
    padding: '2.5rem',
    borderRadius: '12px',
    width: '100%',
    maxWidth: '420px',
    boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
  },
  logoContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.5rem',
    marginBottom: '1rem'
  },
  logo: {
    height: '60px',
    width: '60px',
    objectFit: 'contain'
  },
  brand: {
    fontSize: '1.4rem',
    fontWeight: 'bold',
    color: '#1f2937',
    letterSpacing: '0.05em'
  },
  subtitle: {
    textAlign: 'center',
    color: '#6b7280',
    marginBottom: '1.8rem',
    fontSize: '0.9rem'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.4rem'
  },
  label: {
    fontSize: '0.85rem',
    fontWeight: '600',
    color: '#374151'
  },
  input: {
    padding: '0.75rem',
    borderRadius: '6px',
    border: '1px solid #d1d5db',
    fontSize: '0.95rem'
  },
  primaryButton: {
    marginTop: '1rem',
    padding: '0.75rem',
    backgroundColor: '#2563eb',
    color: '#ffffff',
    border: 'none',
    borderRadius: '6px',
    fontSize: '1rem',
    fontWeight: 'bold',
    cursor: 'pointer'
  },
  actions: {
    marginTop: '1.5rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.6rem'
  },
  secondaryButton: {
    padding: '0.65rem',
    backgroundColor: '#e5e7eb',
    border: 'none',
    borderRadius: '6px',
    fontSize: '0.9rem',
    cursor: 'pointer'
  },
  outlineButton: {
    padding: '0.65rem',
    backgroundColor: '#ffffff',
    border: '1px solid #2563eb',
    color: '#2563eb',
    borderRadius: '6px',
    fontSize: '0.9rem',
    cursor: 'pointer'
  },
  error: {
    color: '#dc2626',
    fontSize: '0.75rem'
  },
  alertError: {
    backgroundColor: '#fee2e2',
    color: '#991b1b',
    padding: '0.75rem',
    borderRadius: '6px',
    fontSize: '0.85rem',
    textAlign: 'center'
  }
};
