import { Eye, EyeOff, KeyRound, Save, UserRound } from 'lucide-react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import EmptyState from '../../components/admin/EmptyState'
import PageHeader from '../../components/admin/PageHeader'
import { useAuth } from '../../hooks/useAuth'
import { changeAdminPassword, getAdminAccount, updateAdminAccount } from '../../services/accountService'

const defaultProfileValues = {
  email: '',
  fullName: '',
}

const defaultPasswordValues = {
  confirmPassword: '',
  currentPassword: '',
  newPassword: '',
}

const passwordRules = [
  { id: 'length', label: 'At least 8 characters', test: (value) => value.length >= 8 },
  { id: 'uppercase', label: 'Uppercase letter', test: (value) => /[A-Z]/.test(value) },
  { id: 'lowercase', label: 'Lowercase letter', test: (value) => /[a-z]/.test(value) },
  { id: 'number', label: 'Number', test: (value) => /\d/.test(value) },
  { id: 'special', label: 'Special character', test: (value) => /[^A-Za-z0-9]/.test(value) },
]

function extractValidationErrors(error) {
  const validationErrors = error.response?.data?.validationErrors

  if (!validationErrors) {
    return {}
  }

  return validationErrors
}

function extractErrorMessage(error, fallback) {
  const data = error.response?.data

  if (data?.message) {
    return data.message
  }

  if (data?.validationErrors) {
    return 'Please review the highlighted fields.'
  }

  return fallback
}

export default function Account() {
  const { updateAdmin } = useAuth()
  const [account, setAccount] = useState(null)
  const [error, setError] = useState('')
  const [formErrors, setFormErrors] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const [isSavingPassword, setIsSavingPassword] = useState(false)
  const [isSavingProfile, setIsSavingProfile] = useState(false)
  const [passwordValues, setPasswordValues] = useState(defaultPasswordValues)
  const [profileValues, setProfileValues] = useState(defaultProfileValues)
  const [showPasswords, setShowPasswords] = useState({})
  const [successMessage, setSuccessMessage] = useState('')

  const passwordScore = useMemo(
    () => passwordRules.filter((rule) => rule.test(passwordValues.newPassword)).length,
    [passwordValues.newPassword],
  )
  const strengthLabel = ['Very weak', 'Weak', 'Fair', 'Good', 'Strong', 'Excellent'][passwordScore]

  const applyAccount = useCallback((nextAccount) => {
    setAccount(nextAccount)
    setProfileValues({
      email: nextAccount.email ?? '',
      fullName: nextAccount.fullName ?? '',
    })
  }, [])

  const fetchAccount = useCallback(async () => {
    setError('')
    setIsLoading(true)

    try {
      applyAccount(await getAdminAccount())
    } catch (requestError) {
      setError(extractErrorMessage(requestError, 'Unable to load account details.'))
    } finally {
      setIsLoading(false)
    }
  }, [applyAccount])

  useEffect(() => {
    let isMounted = true

    async function loadInitialAccount() {
      try {
        const nextAccount = await getAdminAccount()

        if (isMounted) {
          applyAccount(nextAccount)
        }
      } catch (requestError) {
        if (isMounted) {
          setError(extractErrorMessage(requestError, 'Unable to load account details.'))
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    loadInitialAccount()

    return () => {
      isMounted = false
    }
  }, [applyAccount])

  const updateProfileField = (event) => {
    const { name, value } = event.target
    setProfileValues((currentValues) => ({ ...currentValues, [name]: value }))
  }

  const updatePasswordField = (event) => {
    const { name, value } = event.target
    setPasswordValues((currentValues) => ({ ...currentValues, [name]: value }))
  }

  const handleProfileSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setFormErrors({})
    setSuccessMessage('')
    setIsSavingProfile(true)

    try {
      const updatedAccount = await updateAdminAccount({
        email: profileValues.email.trim(),
        fullName: profileValues.fullName.trim(),
      })
      applyAccount(updatedAccount)
      updateAdmin({
        email: updatedAccount.email,
        name: updatedAccount.fullName,
        token: updatedAccount.token,
        type: updatedAccount.type,
        expiresIn: updatedAccount.expiresIn,
      })
      setSuccessMessage('Profile updated successfully.')
    } catch (requestError) {
      setFormErrors(extractValidationErrors(requestError))
      setError(extractErrorMessage(requestError, 'Unable to update profile.'))
    } finally {
      setIsSavingProfile(false)
    }
  }

  const handlePasswordSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setFormErrors({})
    setSuccessMessage('')

    if (passwordValues.newPassword !== passwordValues.confirmPassword) {
      setFormErrors({ confirmPassword: 'Confirm password must match new password.' })
      return
    }

    setIsSavingPassword(true)

    try {
      const response = await changeAdminPassword(passwordValues)
      setPasswordValues(defaultPasswordValues)
      setSuccessMessage(response.message || 'Password changed successfully.')
    } catch (requestError) {
      setFormErrors(extractValidationErrors(requestError))
      setError(extractErrorMessage(requestError, 'Unable to change password.'))
    } finally {
      setIsSavingPassword(false)
    }
  }

  const togglePassword = (field) => {
    setShowPasswords((currentValues) => ({ ...currentValues, [field]: !currentValues[field] }))
  }

  const renderFieldError = (field) => (formErrors[field] ? <small className="admin-field-error">{formErrors[field]}</small> : null)

  if (isLoading) {
    return <div className="admin-table-loading">Loading account...</div>
  }

  if (!account) {
    return <EmptyState actionLabel="Retry" message={error || 'Unable to load account details.'} onAction={fetchAccount} title="Account unavailable" />
  }

  return (
    <section>
      <PageHeader
        breadcrumb="Settings / My Account"
        description="Manage your administrator profile and password."
        title="My Account"
      />

      {successMessage ? (
        <p className="admin-success" role="status">
          {successMessage}
        </p>
      ) : null}
      {error ? (
        <p className="admin-error account-alert" role="alert">
          {error}
        </p>
      ) : null}

      <div className="account-grid">
        <form className="admin-panel account-panel" onSubmit={handleProfileSubmit}>
          <h2>
            <UserRound aria-hidden="true" />
            Profile
          </h2>

          <div className="admin-field">
            <label htmlFor="account-full-name">Full Name</label>
            <input id="account-full-name" name="fullName" value={profileValues.fullName} onChange={updateProfileField} disabled={isSavingProfile} required />
            {renderFieldError('fullName')}
          </div>

          <div className="admin-field">
            <label htmlFor="account-email">Email</label>
            <input id="account-email" name="email" type="email" value={profileValues.email} onChange={updateProfileField} disabled={isSavingProfile} required />
            {renderFieldError('email')}
          </div>

          <button className="admin-primary-button" type="submit" disabled={isSavingProfile}>
            <Save aria-hidden="true" />
            {isSavingProfile ? 'Saving...' : 'Save Changes'}
          </button>
        </form>

        <form className="admin-panel account-panel" onSubmit={handlePasswordSubmit}>
          <h2>
            <KeyRound aria-hidden="true" />
            Change Password
          </h2>

          {['currentPassword', 'newPassword', 'confirmPassword'].map((field) => (
            <div className="admin-field" key={field}>
              <label htmlFor={`account-${field}`}>
                {field === 'currentPassword' ? 'Current Password' : field === 'newPassword' ? 'New Password' : 'Confirm Password'}
              </label>
              <div className="admin-password-field">
                <input
                  id={`account-${field}`}
                  name={field}
                  type={showPasswords[field] ? 'text' : 'password'}
                  value={passwordValues[field]}
                  onChange={updatePasswordField}
                  disabled={isSavingPassword}
                  autoComplete={field === 'currentPassword' ? 'current-password' : 'new-password'}
                  required
                />
                <button className="admin-inline-button" type="button" onClick={() => togglePassword(field)} disabled={isSavingPassword}>
                  {showPasswords[field] ? <EyeOff aria-hidden="true" /> : <Eye aria-hidden="true" />}
                  <span>{showPasswords[field] ? 'Hide' : 'Show'}</span>
                </button>
              </div>
              {renderFieldError(field)}
            </div>
          ))}

          <div className="admin-password-strength" aria-live="polite">
            <span>Strength: {strengthLabel}</span>
            <span className="admin-password-strength-bar">
              <span style={{ width: `${(passwordScore / passwordRules.length) * 100}%` }} />
            </span>
          </div>

          <ul className="admin-password-rules">
            {passwordRules.map((rule) => (
              <li className={rule.test(passwordValues.newPassword) ? 'is-valid' : ''} key={rule.id}>
                {rule.label}
              </li>
            ))}
          </ul>

          <button className="admin-primary-button" type="submit" disabled={isSavingPassword}>
            <KeyRound aria-hidden="true" />
            {isSavingPassword ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>
    </section>
  )
}
