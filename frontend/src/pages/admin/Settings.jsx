import { RefreshCw, Save, Settings as SettingsIcon } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import EmptyState from '../../components/admin/EmptyState'
import PageHeader from '../../components/admin/PageHeader'
import { getSiteSettings, updateSiteSettings } from '../../services/siteSettingsService'

const defaultFormValues = {
  aboutCompany: '',
  address: '',
  alternatePhone: '',
  companyName: '',
  email: '',
  facebookUrl: '',
  googleMapsEmbedUrl: '',
  heroSubtitle: '',
  heroTitle: '',
  instagramUrl: '',
  linkedinUrl: '',
  logo: null,
  phone: '',
  tagline: '',
  youtubeUrl: '',
}

function normalizeSettings(settings) {
  return {
    aboutCompany: settings.aboutCompany ?? '',
    address: settings.address ?? '',
    alternatePhone: settings.alternatePhone ?? '',
    companyName: settings.companyName ?? '',
    email: settings.email ?? '',
    facebookUrl: settings.facebookUrl ?? '',
    googleMapsEmbedUrl: settings.googleMapsEmbedUrl ?? '',
    heroSubtitle: settings.heroSubtitle ?? '',
    heroTitle: settings.heroTitle ?? '',
    instagramUrl: settings.instagramUrl ?? '',
    linkedinUrl: settings.linkedinUrl ?? '',
    logo: null,
    phone: settings.phone ?? '',
    tagline: settings.tagline ?? '',
    youtubeUrl: settings.youtubeUrl ?? '',
  }
}

function createPayload(values) {
  return {
    aboutCompany: values.aboutCompany.trim(),
    address: values.address.trim(),
    alternatePhone: values.alternatePhone.trim(),
    companyName: values.companyName.trim(),
    email: values.email.trim(),
    facebookUrl: values.facebookUrl.trim(),
    googleMapsEmbedUrl: values.googleMapsEmbedUrl.trim(),
    heroSubtitle: values.heroSubtitle.trim(),
    heroTitle: values.heroTitle.trim(),
    instagramUrl: values.instagramUrl.trim(),
    linkedinUrl: values.linkedinUrl.trim(),
    logo: values.logo,
    phone: values.phone.trim(),
    tagline: values.tagline.trim(),
    youtubeUrl: values.youtubeUrl.trim(),
  }
}

function extractValidationErrors(error) {
  const validationErrors = error.response?.data?.validationErrors

  if (!validationErrors) {
    return {}
  }

  if (Array.isArray(validationErrors)) {
    return validationErrors.reduce((errors, item) => {
      if (item.field && item.message) {
        errors[item.field] = item.message
      }

      return errors
    }, {})
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

export default function Settings() {
  const [error, setError] = useState('')
  const [formErrors, setFormErrors] = useState({})
  const [formValues, setFormValues] = useState(defaultFormValues)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [settings, setSettings] = useState(null)
  const [successMessage, setSuccessMessage] = useState('')

  const applySettings = (nextSettings) => {
    setSettings(nextSettings)
    setFormValues(normalizeSettings(nextSettings))
  }

  const fetchSettings = useCallback(async ({ showLoader = false } = {}) => {
    if (showLoader) {
      setIsLoading(true)
    }

    setError('')

    try {
      applySettings(await getSiteSettings())
    } catch (requestError) {
      setError(extractErrorMessage(requestError, 'Unable to load site settings.'))
    } finally {
      if (showLoader) {
        setIsLoading(false)
      }
    }
  }, [])

  useEffect(() => {
    let isMounted = true

    async function loadSettings() {
      try {
        const data = await getSiteSettings()

        if (isMounted) {
          applySettings(data)
        }
      } catch (requestError) {
        if (isMounted) {
          setError(extractErrorMessage(requestError, 'Unable to load site settings.'))
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    loadSettings()

    return () => {
      isMounted = false
    }
  }, [])

  const updateField = (event) => {
    const { files, name, type, value } = event.target

    setFormValues((currentValues) => ({
      ...currentValues,
      [name]: type === 'file' ? files[0] ?? null : value,
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setIsSaving(true)
    setError('')
    setFormErrors({})
    setSuccessMessage('')

    try {
      const updatedSettings = await updateSiteSettings(createPayload(formValues))
      applySettings(updatedSettings)
      setSuccessMessage('Site settings saved successfully.')
    } catch (requestError) {
      setFormErrors(extractValidationErrors(requestError))
      setError(extractErrorMessage(requestError, 'Unable to save site settings.'))
    } finally {
      setIsSaving(false)
    }
  }

  const renderFieldError = (field) => (formErrors[field] ? <small className="admin-field-error">{formErrors[field]}</small> : null)

  return (
    <section>
      <PageHeader
        breadcrumb="Site Settings / General"
        title="Settings"
        description="Manage homepage content, contact details, social links, and public branding."
        action={
          <button className="admin-primary-button" type="submit" form="site-settings-form" disabled={isSaving || isLoading}>
            <Save aria-hidden="true" size={18} />
            {isSaving ? 'Saving...' : 'Save Settings'}
          </button>
        }
      />

      {successMessage ? (
        <p className="admin-success" role="status">
          {successMessage}
        </p>
      ) : null}

      {error ? (
        <div className="admin-error admin-inline-alert" role="alert">
          <span>{error}</span>
          <button className="admin-secondary-button" type="button" onClick={() => fetchSettings({ showLoader: true })}>
            <RefreshCw aria-hidden="true" size={16} />
            Retry
          </button>
        </div>
      ) : null}

      <div className="admin-table-card">
        <div className="table-toolbar">
          <strong>Site Settings</strong>
          <button className="admin-secondary-button" type="button" onClick={() => fetchSettings({ showLoader: true })} disabled={isLoading}>
            <RefreshCw aria-hidden="true" size={16} />
            {isLoading ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>

        {isLoading ? (
          <div className="admin-table-loading" role="status">
            Loading site settings...
          </div>
        ) : settings ? (
          <form className="admin-form admin-settings-form" id="site-settings-form" onSubmit={handleSubmit}>
            <div className="admin-settings-section">
              <h2>Company Information</h2>
              <div className="admin-form-grid">
                <div className="admin-field">
                  <label htmlFor="settings-company-name">Company Name</label>
                  <input id="settings-company-name" name="companyName" value={formValues.companyName} onChange={updateField} required />
                  {renderFieldError('companyName')}
                </div>
                <div className="admin-field">
                  <label htmlFor="settings-tagline">Tagline</label>
                  <input id="settings-tagline" name="tagline" value={formValues.tagline} onChange={updateField} />
                  {renderFieldError('tagline')}
                </div>
              </div>
              <div className="admin-field">
                <label htmlFor="settings-about">About Company</label>
                <textarea id="settings-about" name="aboutCompany" value={formValues.aboutCompany} onChange={updateField} />
                {renderFieldError('aboutCompany')}
              </div>
            </div>

            <div className="admin-settings-section">
              <h2>Hero Section</h2>
              <div className="admin-form-grid">
                <div className="admin-field">
                  <label htmlFor="settings-hero-title">Hero Title</label>
                  <input id="settings-hero-title" name="heroTitle" value={formValues.heroTitle} onChange={updateField} />
                  {renderFieldError('heroTitle')}
                </div>
                <div className="admin-field">
                  <label htmlFor="settings-hero-subtitle">Hero Subtitle</label>
                  <input id="settings-hero-subtitle" name="heroSubtitle" value={formValues.heroSubtitle} onChange={updateField} />
                  {renderFieldError('heroSubtitle')}
                </div>
              </div>
            </div>

            <div className="admin-settings-section">
              <h2>Contact Details</h2>
              <div className="admin-form-grid">
                <div className="admin-field">
                  <label htmlFor="settings-phone">Phone Number</label>
                  <input id="settings-phone" name="phone" value={formValues.phone} onChange={updateField} />
                  {renderFieldError('phone')}
                </div>
                <div className="admin-field">
                  <label htmlFor="settings-alternate-phone">Alternate Phone</label>
                  <input id="settings-alternate-phone" name="alternatePhone" value={formValues.alternatePhone} onChange={updateField} />
                  {renderFieldError('alternatePhone')}
                </div>
                <div className="admin-field">
                  <label htmlFor="settings-email">Email</label>
                  <input id="settings-email" name="email" type="email" value={formValues.email} onChange={updateField} />
                  {renderFieldError('email')}
                </div>
                <div className="admin-field">
                  <label htmlFor="settings-maps">Google Maps Embed URL</label>
                  <input id="settings-maps" name="googleMapsEmbedUrl" value={formValues.googleMapsEmbedUrl} onChange={updateField} />
                  {renderFieldError('googleMapsEmbedUrl')}
                </div>
              </div>
              <div className="admin-field">
                <label htmlFor="settings-address">Address</label>
                <textarea id="settings-address" name="address" value={formValues.address} onChange={updateField} />
                {renderFieldError('address')}
              </div>
            </div>

            <div className="admin-settings-section">
              <h2>Branding</h2>
              {settings.logoUrl ? (
                <div className="admin-logo-preview">
                  <img src={settings.logoUrl} alt="Current company logo" />
                </div>
              ) : null}
              <div className="admin-field">
                <label htmlFor="settings-logo">Logo</label>
                <input id="settings-logo" name="logo" type="file" accept="image/jpeg,image/png,image/webp" onChange={updateField} />
                {settings.logoUrl ? <small className="admin-help-text">Leave empty to keep the existing logo.</small> : null}
                {renderFieldError('logo')}
              </div>
            </div>

            <div className="admin-settings-section">
              <h2>Social Links</h2>
              <div className="admin-form-grid">
                <div className="admin-field">
                  <label htmlFor="settings-facebook">Facebook URL</label>
                  <input id="settings-facebook" name="facebookUrl" value={formValues.facebookUrl} onChange={updateField} />
                  {renderFieldError('facebookUrl')}
                </div>
                <div className="admin-field">
                  <label htmlFor="settings-instagram">Instagram URL</label>
                  <input id="settings-instagram" name="instagramUrl" value={formValues.instagramUrl} onChange={updateField} />
                  {renderFieldError('instagramUrl')}
                </div>
                <div className="admin-field">
                  <label htmlFor="settings-linkedin">LinkedIn URL</label>
                  <input id="settings-linkedin" name="linkedinUrl" value={formValues.linkedinUrl} onChange={updateField} />
                  {renderFieldError('linkedinUrl')}
                </div>
                <div className="admin-field">
                  <label htmlFor="settings-youtube">YouTube URL</label>
                  <input id="settings-youtube" name="youtubeUrl" value={formValues.youtubeUrl} onChange={updateField} />
                  {renderFieldError('youtubeUrl')}
                </div>
              </div>
            </div>
          </form>
        ) : (
          <EmptyState
            icon={SettingsIcon}
            title="No settings record found"
            description="The backend should create a default settings record automatically."
          />
        )}
      </div>
    </section>
  )
}
