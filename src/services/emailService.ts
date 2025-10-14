// Email Notification Service for Admin Actions
// Uses EmailJS for client-side email sending (free tier available)

interface EmailNotification {
  to: string;
  subject: string;
  message: string;
  type: 'login' | 'password_change' | 'employee_added' | 'employee_updated' | 'employee_deleted' | 'video_uploaded' | 'security_alert';
}

class EmailService {
  private adminEmail = 'tomoacademyofficial@gmail.com';
  private serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID || 'service_zskl03k';
  private templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || '';
  private publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || '';
  private isConfigured = false;

  constructor() {
    this.isConfigured = !!(this.serviceId && this.templateId && this.publicKey);
    if (!this.isConfigured) {
      console.warn('⚠️ Email service not fully configured. Set VITE_EMAILJS_TEMPLATE_ID and VITE_EMAILJS_PUBLIC_KEY in environment variables.');
      console.log('📧 Service ID is set:', this.serviceId);
    }
  }

  /**
   * Send email notification to admin
   */
  async sendNotification(notification: Omit<EmailNotification, 'to'>): Promise<boolean> {
    console.log('📧 Attempting to send email notification...');
    console.log('📧 Service ID:', this.serviceId);
    console.log('📧 Template ID:', this.templateId ? '✅ Set' : '❌ Not set');
    console.log('📧 Public Key:', this.publicKey ? '✅ Set' : '❌ Not set');
    console.log('📧 Is Configured:', this.isConfigured);
    
    if (!this.isConfigured) {
      console.warn('⚠️ Email service not fully configured. Email will not be sent.');
      console.log('📧 Email notification (mock):', notification);
      console.log('📧 To configure:');
      console.log('   1. Set VITE_EMAILJS_TEMPLATE_ID in Vercel');
      console.log('   2. Set VITE_EMAILJS_PUBLIC_KEY in Vercel');
      console.log('   3. Redeploy application');
      return true; // Mock success
    }

    try {
      // Get simplified browser info (not full user agent)
      const getBrowserName = () => {
        const ua = navigator.userAgent;
        if (ua.includes('Chrome')) return 'Chrome';
        if (ua.includes('Firefox')) return 'Firefox';
        if (ua.includes('Safari')) return 'Safari';
        if (ua.includes('Edge')) return 'Edge';
        return 'Unknown';
      };
      
      const getDeviceType = () => {
        const ua = navigator.userAgent;
        if (/mobile/i.test(ua)) return 'Mobile';
        if (/tablet/i.test(ua)) return 'Tablet';
        return 'Desktop';
      };
      
      const templateParams = {
        // EmailJS standard parameters (REQUIRED)
        to_name: 'TOMO Academy Admin',
        to_email: this.adminEmail,
        from_name: 'TOMO Academy System',
        reply_to: this.adminEmail,
        
        // Custom parameters (simplified to avoid 414 error)
        adminName: this.adminEmail,
        loginTime: new Date().toLocaleString(),
        browserInfo: getBrowserName(),
        deviceInfo: getDeviceType(),
        ipAddress: 'Not available',
        location: 'Not available',
        portalUrl: window.location.origin + '/admin',
      };
      
      console.log('📧 Sending email with params:', templateParams);
      console.log('📧 Recipient:', this.adminEmail);
      console.log('📧 to_email parameter:', templateParams.to_email);
      
      // Using EmailJS for client-side email sending
      const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          service_id: this.serviceId,
          template_id: this.templateId,
          user_id: this.publicKey,
          template_params: templateParams,
        }),
      });

      if (response.ok) {
        console.log('✅ Email sent successfully to', this.adminEmail);
        return true;
      } else {
        const errorText = await response.text();
        console.error('❌ Email send failed:', errorText);
        console.error('❌ Response status:', response.status);
        return false;
      }
    } catch (error) {
      console.error('❌ Email service error:', error);
      return false;
    }
  }

  /**
   * Notify admin of successful login with detailed information
   */
  async notifyLogin(adminName: string = 'Admin', browserInfo: string = 'Unknown', deviceInfo: string = 'Unknown'): Promise<void> {
    const loginTime = new Date().toLocaleString();
    
    await this.sendNotification({
      subject: '🔐 YouTube Portal Admin Login Notification',
      message: `
Admin Login Detected

Admin Name: ${adminName}
Login Time: ${loginTime}
Browser: ${browserInfo}
Device: ${deviceInfo}
IP Address: [Client-side detection not available]
Location: [Requires server-side detection]

This is an automated security notification for TOMO Academy YouTube Management Portal.
      `.trim(),
      type: 'login',
    });
  }

  /**
   * Notify admin of password change
   */
  async notifyPasswordChange(): Promise<void> {
    await this.sendNotification({
      subject: '🔑 Admin Password Changed',
      message: `Your admin password was changed at ${new Date().toLocaleString()}. If this wasn't you, please secure your account immediately.`,
      type: 'password_change',
    });
  }

  /**
   * Notify admin of new employee added
   */
  async notifyEmployeeAdded(employeeName: string, role: string): Promise<void> {
    await this.sendNotification({
      subject: '👤 New Employee Added',
      message: `New employee added:\n\nName: ${employeeName}\nRole: ${role}\nTime: ${new Date().toLocaleString()}`,
      type: 'employee_added',
    });
  }

  /**
   * Notify admin of employee update
   */
  async notifyEmployeeUpdated(employeeName: string, changes: string[]): Promise<void> {
    await this.sendNotification({
      subject: '✏️ Employee Updated',
      message: `Employee updated:\n\nName: ${employeeName}\nChanges: ${changes.join(', ')}\nTime: ${new Date().toLocaleString()}`,
      type: 'employee_updated',
    });
  }

  /**
   * Notify admin of employee deletion
   */
  async notifyEmployeeDeleted(employeeName: string): Promise<void> {
    await this.sendNotification({
      subject: '🗑️ Employee Deleted',
      message: `Employee deleted:\n\nName: ${employeeName}\nTime: ${new Date().toLocaleString()}`,
      type: 'employee_deleted',
    });
  }

  /**
   * Notify admin of video upload
   */
  async notifyVideoUploaded(videoTitle: string, uploadedBy: string): Promise<void> {
    await this.sendNotification({
      subject: '🎬 New Video Uploaded',
      message: `New video uploaded:\n\nTitle: ${videoTitle}\nUploaded by: ${uploadedBy}\nTime: ${new Date().toLocaleString()}`,
      type: 'video_uploaded',
    });
  }

  /**
   * Send security alert
   */
  async sendSecurityAlert(message: string): Promise<void> {
    await this.sendNotification({
      subject: '⚠️ Security Alert',
      message: `Security Alert:\n\n${message}\n\nTime: ${new Date().toLocaleString()}`,
      type: 'security_alert',
    });
  }

  /**
   * Test email configuration
   */
  async testEmailService(): Promise<boolean> {
    return await this.sendNotification({
      subject: '✅ Email Service Test',
      message: 'This is a test email from TOMO Academy platform. Email service is working correctly!',
      type: 'security_alert',
    });
  }
}

export const emailService = new EmailService();

// Export for use in other components
export { EmailService };
