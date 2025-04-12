'use client';

import React, { useState } from 'react';
import { Send, Map, Phone, Mail, Clock } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSubmitStatus({
        success: true,
        message: 'Thank you for your message! Our team will get back to you soon.'
      });
      
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    } catch {
      setSubmitStatus({
        success: false,
        message: 'Sorry, there was an error sending your message. Please try again later.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="contact-page">
      <section className="hero-section">
        <h1>Contact Us</h1>
        <p className="lead">We&apos;d love to hear from you! Please fill out the form below or reach out directly.</p>
      </section>

      <section className="contact-section">
        <div className="contact-container">
          <div className="contact-info">
            <h2>Get in Touch</h2>
            <p>
              Have questions, feedback, or need assistance? Our team is here to help you. 
              We typically respond within 24 hours.
            </p>
            
            <div className="contact-details">
              <div className="contact-item">
                <div className="contact-icon">
                  <Map size={20} />
                </div>
                <div className="contact-text">
                  <h3>Address</h3>
                  <p>123 Match Street, New York, NY 10001</p>
                </div>
              </div>
              
              <div className="contact-item">
                <div className="contact-icon">
                  <Phone size={20} />
                </div>
                <div className="contact-text">
                  <h3>Phone</h3>
                  <p>+1 (212) 555-7890</p>
                </div>
              </div>
              
              <div className="contact-item">
                <div className="contact-icon">
                  <Mail size={20} />
                </div>
                <div className="contact-text">
                  <h3>Email</h3>
                  <p>support@webmatcha.com</p>
                </div>
              </div>
              
              <div className="contact-item">
                <div className="contact-icon">
                  <Clock size={20} />
                </div>
                <div className="contact-text">
                  <h3>Support Hours</h3>
                  <p>Monday - Friday: 9AM - 6PM EST</p>
                </div>
              </div>
            </div>
            
            <div className="social-links">
              <h3>Follow Us</h3>
              <div className="social-icons">
                <a href="https://facebook.com/" target="_blank" rel="noopener noreferrer" className="social-icon">
                  Facebook
                </a>
                <a href="https://twitter.com/" target="_blank" rel="noopener noreferrer" className="social-icon">
                  Twitter
                </a>
                <a href="https://instagram.com/" target="_blank" rel="noopener noreferrer" className="social-icon">
                  Instagram
                </a>
                <a href="https://linkedin.com/" target="_blank" rel="noopener noreferrer" className="social-icon">
                  LinkedIn
                </a>
              </div>
            </div>
          </div>
          
          <div className="contact-form-container">
            <h2>Send Us a Message</h2>
            
            {submitStatus && (
              <div className={`alert ${submitStatus.success ? 'bg-success' : 'bg-error'} text-white p-md rounded mb-md`}>
                {submitStatus.message}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-group">
                <label htmlFor="name" className="form-label">Your Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="form-control"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="email" className="form-label">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="form-control"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="subject" className="form-label">Subject</label>
                <select
                  id="subject"
                  name="subject"
                  className="form-control"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select a subject</option>
                  <option value="General Inquiry">General Inquiry</option>
                  <option value="Technical Support">Technical Support</option>
                  <option value="Account Issues">Account Issues</option>
                  <option value="Billing Questions">Billing Questions</option>
                  <option value="Feedback">Feedback</option>
                  <option value="Partnership">Partnership</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="message" className="form-label">Message</label>
                <textarea
                  id="message"
                  name="message"
                  className="form-control"
                  placeholder="Your message here..."
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <button 
                type="submit" 
                className="btn btn-primary" 
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span>Sending...</span>
                ) : (
                  <span className="d-flex align-items-center gap-sm">
                    Send Message <Send size={16} />
                  </span>
                )}
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
