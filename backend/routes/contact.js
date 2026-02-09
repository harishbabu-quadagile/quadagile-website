const express = require('express');
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');
const { runQuery } = require('../database');
const { contactValidation } = require('../middleware/validation');

const router = express.Router();

// Verify reCAPTCHA token
const verifyRecaptcha = async (token) => {
  try {
    const secretKey = process.env.RECAPTCHA_SECRET_KEY;
    if (!secretKey) {
      console.warn('RECAPTCHA_SECRET_KEY not set, skipping verification');
      return { success: true };
    }

    const response = await axios.post(
      'https://www.google.com/recaptcha/api/siteverify',
      null,
      {
        params: {
          secret: secretKey,
          response: token,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error('reCAPTCHA verification error:', error);
    return { success: false, error: 'Verification failed' };
  }
};

// Send contact email notification
const sendNotificationEmail = async (formData) => {
  try {
    // In production, integrate with your email service (SendGrid, AWS SES, etc.)
    // For now, just log the notification
    console.log('Contact form submission:', {
      name: formData.name,
      email: formData.email,
      company: formData.company,
      message: formData.message.substring(0, 100) + '...',
    });

    // TODO: Implement actual email sending
    // Example with SendGrid:
    // await sgMail.send({
    //   to: process.env.CONTACT_EMAIL,
    //   from: 'noreply@quadagile.in',
    //   subject: `New Contact Form Submission from ${formData.name}`,
    //   text: `Name: ${formData.name}\nEmail: ${formData.email}\nCompany: ${formData.company}\nMessage: ${formData.message}`,
    // });

    return true;
  } catch (error) {
    console.error('Email notification error:', error);
    return false;
  }
};

// Track event in GA4
const trackGA4Event = async (eventName, params) => {
  try {
    const measurementId = process.env.GA4_MEASUREMENT_ID;
    const apiSecret = process.env.GA4_API_SECRET;

    if (!measurementId || !apiSecret) {
      return;
    }

    await axios.post(
      `https://www.google-analytics.com/mp/collect?measurement_id=${measurementId}&api_secret=${apiSecret}`,
      {
        client_id: uuidv4(),
        events: [
          {
            name: eventName,
            params: params,
          },
        ],
      }
    );
  } catch (error) {
    console.error('GA4 tracking error:', error);
  }
};

// Submit contact form
router.post('/', contactValidation, async (req, res) => {
  try {
    const { name, email, company, message, recaptchaToken } = req.body;
    const ipAddress = req.ip || req.connection.remoteAddress;
    const userAgent = req.headers['user-agent'];

    // Verify reCAPTCHA
    const recaptchaResult = await verifyRecaptcha(recaptchaToken);
    if (!recaptchaResult.success) {
      return res.status(400).json({
        success: false,
        message: 'reCAPTCHA verification failed',
      });
    }

    // Check score for reCAPTCHA v3
    if (recaptchaResult.score !== undefined && recaptchaResult.score < 0.5) {
      return res.status(400).json({
        success: false,
        message: 'Suspicious activity detected',
      });
    }

    // Save to database
    const submissionId = uuidv4();
    await runQuery(
      `INSERT INTO contact_submissions (id, name, email, company, message, ip_address, user_agent) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [submissionId, name, email, company || null, message, ipAddress, userAgent]
    );

    // Send notification email
    await sendNotificationEmail({ name, email, company, message });

    // Track in GA4
    await trackGA4Event('contact_form_submit', {
      page_location: req.headers.referer || 'unknown',
      page_title: 'Contact Form',
    });

    res.json({
      success: true,
      message: 'Thank you for your message. We will get back to you within 24 hours.',
    });
  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit form. Please try again later.',
    });
  }
});

module.exports = router;
