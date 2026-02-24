import { emailConfig } from '../config/email';

export const sendFormSubmission = async (formData, formType = 'Contact') => {
  try {
    // Simulate API call with demo data
    // In production, replace with actual Resend API call
    console.log('Form Submission:', { formData, formType });
    
    // Demo: Simulate successful submission after 1 second
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Demo success response
    return {
      success: true,
      message: 'Thank you for your submission! We will get back to you shortly.'
    };
    
    /* 
    // Production code (uncomment when ready):
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${emailConfig.resendApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: emailConfig.fromEmail,
        to: emailConfig.recipientEmail,
        subject: `New ${formType} Form Submission - ${emailConfig.companyName}`,
        html: generateEmailHTML(formData, formType)
      })
    });
    
    if (!response.ok) {
      throw new Error('Failed to send email');
    }
    
    return {
      success: true,
      message: 'Thank you for your submission! We will get back to you shortly.'
    };
    */
  } catch (error) {
    console.error('Email submission error:', error);
    return {
      success: false,
      message: 'There was an error submitting your form. Please try again later.'
    };
  }
};

const generateEmailHTML = (formData, formType) => {
  const fields = Object.entries(formData)
    .filter(([key, value]) => value && typeof value !== 'boolean')
    .map(([key, value]) => `
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">${formatFieldName(key)}</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${value}</td>
      </tr>
    `).join('');

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>New ${formType} Form Submission</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #000; border-bottom: 2px solid #000; padding-bottom: 10px;">
            New ${formType} Form Submission
          </h2>
          <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
            ${fields}
          </table>
          <p style="margin-top: 20px; color: #666; font-size: 12px;">
            This email was sent from ${emailConfig.companyName} website contact form.
          </p>
        </div>
      </body>
    </html>
  `;
};

const formatFieldName = (key) => {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase())
    .trim();
};
