import { Mail, MapPin, MessageCircle, Phone } from 'lucide-react'
import { useState } from 'react'
import { submitPublicEnquiry } from '../../services/publicWebsiteService'

const defaultFormValues = {
  email: '',
  message: '',
  name: '',
  phone: '',
  projectType: '',
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

export default function Contact({ isLoading, settings }) {
  const [error, setError] = useState('')
  const [formErrors, setFormErrors] = useState({})
  const [formValues, setFormValues] = useState(defaultFormValues)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  const phones = [settings?.phone, settings?.alternatePhone].filter(Boolean)
  const contactItems = [
    {
      id: 'address',
      icon: MapPin,
      label: 'Address',
      value: settings?.address,
    },
    {
      href: settings?.email ? `mailto:${settings.email}` : undefined,
      id: 'email',
      icon: Mail,
      label: 'Email',
      value: settings?.email,
    },
    {
      href: phones[0] ? `tel:${phones[0].replaceAll(' ', '')}` : undefined,
      id: 'phone',
      icon: Phone,
      label: 'Phone Numbers',
      value: phones.join(' / '),
    },
    {
      href: 'https://wa.me/919483787605',
      id: 'whatsapp',
      icon: MessageCircle,
      label: 'WhatsApp',
      target: '_blank',
      rel: 'noopener noreferrer',
      value: '+91 94837 87605',
    },
  ].filter((item) => item.value)

  const updateField = (event) => {
    const { name, value } = event.target
    setFormValues((currentValues) => ({ ...currentValues, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setFormErrors({})
    setSuccessMessage('')
    setIsSubmitting(true)

    try {
      await submitPublicEnquiry({
        email: formValues.email.trim(),
        message: formValues.message.trim(),
        name: formValues.name.trim(),
        phone: formValues.phone.trim(),
        projectType: formValues.projectType,
      })
      setFormValues(defaultFormValues)
      setSuccessMessage('Thank you. Your enquiry has been submitted successfully.')
    } catch (requestError) {
      setFormErrors(extractValidationErrors(requestError))
      setError(extractErrorMessage(requestError, 'Unable to submit enquiry. Please try again.'))
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderFieldError = (field) => (formErrors[field] ? <small className="form-error">{formErrors[field]}</small> : null)

  return (
    <section className="contact-section section-block" id="contact">
      <div className="container contact-grid">
        <div className="contact-info">
          <p className="section-kicker">Contact</p>
          <h2>Start a project conversation with {settings?.companyName || 'Abhinav Infratek'}.</h2>
          <p>{isLoading ? 'Loading contact information...' : settings?.aboutCompany}</p>

          <div className="contact-list">
            {contactItems.map((item) => {
              const Icon = item.icon
              const content = (
                <>
                  <span className="contact-item-icon" aria-hidden="true">
                    <Icon />
                  </span>
                  <span>
                    <strong>{item.label}</strong>
                    <span>{item.value}</span>
                  </span>
                </>
              )

              return item.href ? (
                <a className="contact-item" href={item.href} key={item.id} target={item.target} rel={item.rel}>
                  {content}
                </a>
              ) : (
                <div className="contact-item" key={item.id}>
                  {content}
                </div>
              )
            })}
          </div>
          {settings?.googleMapsEmbedUrl ? (
            <a
              className="map-placeholder map-placeholder--link"
              href={settings.googleMapsEmbedUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Open Abhinav Infratek location in Google Maps"
            >
              <span className="map-placeholder-label">Google Maps</span>
              <span className="map-placeholder-action">View Location</span>
            </a>
          ) : (
            <div className="map-placeholder" aria-label="Google Maps location placeholder">
              <span className="map-placeholder-label">Google Maps</span>
              <strong>{settings?.address || 'Location will be updated soon'}</strong>
            </div>
          )}
        </div>

        <form className="contact-form" onSubmit={handleSubmit}>
          {successMessage ? (
            <p className="form-success" role="status">
              {successMessage}
            </p>
          ) : null}
          {error ? (
            <p className="form-error form-error--panel" role="alert">
              {error}
            </p>
          ) : null}

          <div className="form-field">
            <label htmlFor="contact-name">Name</label>
            <input id="contact-name" name="name" type="text" placeholder="Your name" value={formValues.name} onChange={updateField} required />
            {renderFieldError('name')}
          </div>
          <div className="form-field">
            <label htmlFor="contact-email">Email</label>
            <input id="contact-email" name="email" type="email" placeholder="you@example.com" value={formValues.email} onChange={updateField} required />
            {renderFieldError('email')}
          </div>
          <div className="form-field">
            <label htmlFor="contact-phone">Phone</label>
            <input id="contact-phone" name="phone" type="tel" placeholder="+91 XXXXX XXXXX" value={formValues.phone} onChange={updateField} required />
            {renderFieldError('phone')}
          </div>
          <div className="form-field">
            <label htmlFor="contact-project">Project Type</label>
            <select id="contact-project" name="projectType" value={formValues.projectType} onChange={updateField} required>
              <option value="" disabled>
                Select project type
              </option>
              <option>Residential</option>
              <option>Commercial</option>
              <option>Industrial</option>
              <option>Infrastructure</option>
            </select>
            {renderFieldError('projectType')}
          </div>
          <div className="form-field form-field--full">
            <label htmlFor="contact-message">Message</label>
            <textarea
              id="contact-message"
              name="message"
              placeholder="Tell us about your project"
              rows="5"
              value={formValues.message}
              onChange={updateField}
              required
            />
            {renderFieldError('message')}
          </div>
          <button className="site-button site-button--primary form-submit" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Sending...' : 'Send Message'}
          </button>
        </form>
      </div>
    </section>
  )
}
