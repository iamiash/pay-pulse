import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import Optional
import logging
from app.core.config import settings

logger = logging.getLogger("paypulse_email_service")

class EmailService:
    def __init__(self):
        self.smtp_host = getattr(settings, "SMTP_HOST", "smtp.gmail.com")
        self.smtp_port = getattr(settings, "SMTP_PORT", 587)
        self.smtp_user = getattr(settings, "SMTP_USERNAME", "")
        self.smtp_pass = getattr(settings, "SMTP_PASSWORD", "")
        self.sender_email = getattr(settings, "SMTP_FROM_EMAIL", "noreply@paypulse.com")
        self.sender_name = getattr(settings, "SMTP_FROM_NAME", "PayPulse Security")

    def _send_email(self, recipient_email: str, subject: str, html_content: str) -> bool:
        if not self.smtp_user or not self.smtp_pass:
            logger.info(f"[EMAIL SIMULATION] To: {recipient_email} | Subject: {subject}")
            return True

        try:
            msg = MIMEMultipart("alternative")
            msg["Subject"] = subject
            msg["From"] = f"{self.sender_name} <{self.sender_email}>"
            msg["To"] = recipient_email

            html_part = MIMEText(html_content, "html")
            msg.attach(html_part)

            with smtplib.SMTP(self.smtp_host, self.smtp_port) as server:
                server.starttls()
                server.login(self.smtp_user, self.smtp_pass)
                server.sendmail(self.sender_email, recipient_email, msg.as_string())
            
            return True
        except Exception as e:
            logger.error(f"Failed to deliver email to {recipient_email}: {str(e)}")
            logger.info(f"[EMAIL SIMULATION FALLBACK] To: {recipient_email} | Subject: {subject}")
            return True

    def send_user_id_email(self, recipient_email: str, full_name: str, user_id: str, verification_token: Optional[str] = None) -> bool:
        subject = "Welcome to PayPulse - Your Permanent User ID"
        frontend_url = getattr(settings, "FRONTEND_URL", "http://localhost:3000")
        verify_url = f"{frontend_url}/verify-email?token={verification_token}" if verification_token else "#"
        
        html = f"""
        <!DOCTYPE html>
        <html>
        <body style="font-family: 'Segoe UI', Helvetica, Arial, sans-serif; background-color: #141620; color: #FFFFFF; padding: 30px;">
            <div style="max-width: 500px; margin: 0 auto; background: linear-gradient(145deg, #2A2D3E 0%, #1A1D27 100%); border: 1px solid rgba(254,203,110,0.4); border-radius: 16px; padding: 30px; text-align: center; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
                <h1 style="color: #FECB6E; margin-bottom: 2px; font-weight: 900; font-size: 28px;">PayPulse</h1>
                <p style="font-size: 11px; color: #FFD89B; margin-top: 0; text-transform: uppercase; letter-spacing: 1px;">Smart Subscription Tracker</p>
                <hr style="border: 0; border-top: 1px solid rgba(254,203,110,0.2); margin: 20px 0;" />
                
                <h2 style="color: #FFFFFF; font-size: 18px; margin-bottom: 10px;">Welcome, {full_name}!</h2>
                <p style="font-size: 13px; color: #B8B8AC; line-height: 1.5;">Your PayPulse account has been created successfully.</p>
                
                <div style="background-color: #141620; border: 1px dashed #FECB6E; border-radius: 12px; padding: 18px; margin: 25px 0;">
                    <p style="font-size: 10px; color: #FECB6E; font-weight: bold; text-transform: uppercase; letter-spacing: 1.5px; margin: 0;">Your Permanent User ID</p>
                    <p style="font-size: 26px; font-weight: 900; color: #FFFFFF; letter-spacing: 3px; margin: 8px 0; font-family: monospace;">{user_id}</p>
                    <p style="font-size: 11px; color: #B8B8AC; margin: 0;">Keep this User ID safe. You can use this ID or registered email + password to log in.</p>
                </div>

                {f'<a href="{verify_url}" style="display: inline-block; background: linear-gradient(135deg, #FFD89B 0%, #FECB6E 100%); color: #141620; font-weight: 800; text-decoration: none; padding: 12px 28px; border-radius: 8px; font-size: 12px; text-transform: uppercase; margin-top: 10px;">Verify Email Address</a>' if verification_token else ''}
                
                <p style="font-size: 10px; color: #666666; margin-top: 30px;">If you did not register for PayPulse, please ignore this message.</p>
            </div>
        </body>
        </html>
        """
        return self._send_email(recipient_email, subject, html)

    def send_email_verification(self, recipient_email: str, full_name: str, verification_token: str) -> bool:
        subject = "PayPulse - Verify Your Email Address"
        frontend_url = getattr(settings, "FRONTEND_URL", "http://localhost:3000")
        verify_url = f"{frontend_url}/verify-email?token={verification_token}"
        
        html = f"""
        <!DOCTYPE html>
        <html>
        <body style="font-family: Arial, sans-serif; background-color: #141620; color: #FFFFFF; padding: 30px;">
            <div style="max-width: 500px; margin: 0 auto; background: #2A2D3E; border: 1px solid rgba(254,203,110,0.3); border-radius: 16px; padding: 25px; text-align: center;">
                <h1 style="color: #FECB6E; margin-bottom: 5px;">PayPulse</h1>
                <h3 style="color: #FFFFFF;">Email Verification Required</h3>
                <p style="font-size: 13px; color: #B8B8AC;">Hi {full_name}, please verify your email address to complete setup.</p>
                <a href="{verify_url}" style="display: inline-block; background: #FECB6E; color: #000; font-weight: bold; text-decoration: none; padding: 12px 25px; border-radius: 8px; font-size: 13px; margin: 20px 0;">Verify Email Now</a>
                <p style="font-size: 11px; color: #888888;">This link expires in 24 hours.</p>
            </div>
        </body>
        </html>
        """
        return self._send_email(recipient_email, subject, html)

    def send_password_reset_email(self, recipient_email: str, user_id: str, reset_token: str) -> bool:
        subject = "PayPulse - Password Reset Request"
        frontend_url = getattr(settings, "FRONTEND_URL", "http://localhost:3000")
        reset_url = f"{frontend_url}/forgot-password?token={reset_token}"
        
        html = f"""
        <!DOCTYPE html>
        <html>
        <body style="font-family: Arial, sans-serif; background-color: #141620; color: #FFFFFF; padding: 30px;">
            <div style="max-width: 500px; margin: 0 auto; background: #2A2D3E; border: 1px solid rgba(254,203,110,0.3); border-radius: 16px; padding: 25px; text-align: center;">
                <h1 style="color: #FECB6E; margin-bottom: 5px;">PayPulse Security</h1>
                <h3 style="color: #FFFFFF;">Reset Your Password</h3>
                <p style="font-size: 13px; color: #B8B8AC;">Request received for PayPulse User ID <strong>{user_id}</strong>.</p>
                <a href="{reset_url}" style="display: inline-block; background: #FECB6E; color: #000; font-weight: bold; text-decoration: none; padding: 12px 25px; border-radius: 8px; font-size: 13px; margin: 20px 0;">Reset Password</a>
                <p style="font-size: 11px; color: #888888;">If you did not request a password reset, please ignore this email.</p>
            </div>
        </body>
        </html>
        """
        return self._send_email(recipient_email, subject, html)

    def send_password_change_confirmation(self, recipient_email: str, user_id: str) -> bool:
        subject = "PayPulse Security Alert - Password Changed"
        
        html = f"""
        <!DOCTYPE html>
        <html>
        <body style="font-family: Arial, sans-serif; background-color: #141620; color: #FFFFFF; padding: 30px;">
            <div style="max-width: 500px; margin: 0 auto; background: #2A2D3E; border: 1px solid rgba(254,203,110,0.3); border-radius: 16px; padding: 25px; text-align: center;">
                <h1 style="color: #FECB6E; margin-bottom: 5px;">PayPulse</h1>
                <h3 style="color: #FFFFFF;">Password Updated</h3>
                <p style="font-size: 13px; color: #B8B8AC;">The password for PayPulse User ID <strong>{user_id}</strong> was updated successfully.</p>
            </div>
        </body>
        </html>
        """
        return self._send_email(recipient_email, subject, html)

email_service = EmailService()