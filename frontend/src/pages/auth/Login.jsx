import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import logo from '../../assets/images/company-logo.png'
import { useAuth } from '../../hooks/useAuth'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const { loading, login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    if (!email.trim()) {
      setError('Email is required.')
      return
    }

    if (!EMAIL_PATTERN.test(email.trim())) {
      setError('Enter a valid email address.')
      return
    }

    if (!password) {
      setError('Password is required.')
      return
    }

    const result = await login({ email, password, rememberMe })

    if (!result.success) {
      setError(result.message)
      return
    }

    navigate('/admin/dashboard', { replace: true })
  }

  return (
    <main className="admin-login">
      <section className="admin-login-card" aria-label="Admin login">
        <div className="admin-login-brand">
          <img src={logo} alt="Abhinav Infratek logo" />
          <span>
            <strong>Abhinav Infratek</strong>
            <span>Engineers & Architects</span>
          </span>
        </div>

        <h1>Admin Login</h1>
        <p className="admin-login-copy">Sign in to manage public website content, enquiries, and site settings.</p>

        <form className="admin-form" onSubmit={handleSubmit}>
          <div className="admin-field">
            <label htmlFor="admin-email">Email</label>
            <input id="admin-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="admin@yourdomain.com" autoComplete="email" disabled={loading} required />
          </div>

          <div className="admin-field">
            <label htmlFor="admin-password">Password</label>
            <div className="admin-password-field">
              <input
                id="admin-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter password"
                autoComplete="current-password"
                disabled={loading}
                required
              />
              <button className="admin-inline-button" type="button" onClick={() => setShowPassword((value) => !value)} disabled={loading}>
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          <div className="admin-form-row">
            <label className="admin-checkbox">
              <input type="checkbox" checked={rememberMe} onChange={(event) => setRememberMe(event.target.checked)} disabled={loading} />
              Remember me
            </label>
            <button className="admin-forgot" type="button" disabled>
              Forgot Password
            </button>
          </div>

          {error ? <p className="admin-error">{error}</p> : null}

          <button className="admin-submit" type="submit" disabled={loading}>
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
      </section>
    </main>
  )
}
