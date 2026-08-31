"""
Email Notification & Alerting System for Tropical Cyclone Platform.
Sends job run summary emails on every Airflow execution and sends urgent R2 Storage warning alerts
containing a One-Click Data Purge link.
"""

import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import Dict, Any, Optional

# SMTP Credentials from Environment
SMTP_SERVER = os.getenv("SMTP_SERVER", "smtp.gmail.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
SMTP_USERNAME = os.getenv("SMTP_USERNAME")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD")
NOTIFICATION_EMAIL_TO = os.getenv("NOTIFICATION_EMAIL_TO", os.getenv("SMTP_USERNAME", "hs7307327@gmail.com"))
BASE_API_URL = os.getenv("BASE_API_URL", "https://mankhm-cyclone-edge.repo-mankhm.workers.dev")


def send_email_alert(subject: str, html_content: str, recipient: Optional[str] = None) -> bool:
    """
    Sends an HTML email alert via SMTP.
    """
    to_email = recipient or NOTIFICATION_EMAIL_TO

    if not SMTP_USERNAME or not SMTP_PASSWORD:
        print(f"[EMAIL NOTIFIER SIMULATION] To: {to_email} | Subject: '{subject}'")
        print("[EMAIL NOTIFIER] Set SMTP_USERNAME & SMTP_PASSWORD in .env to send live emails via Gmail/SendGrid.")
        return False

    try:
        msg = MIMEMultipart("alternative")
        msg["Subject"] = subject
        msg["From"] = f"Cyclone AI Intelligence <{SMTP_USERNAME}>"
        msg["To"] = to_email

        msg.attach(MIMEText(html_content, "html"))

        server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
        server.starttls()
        server.login(SMTP_USERNAME, SMTP_PASSWORD)
        server.sendmail(SMTP_USERNAME, to_email, msg.as_string())
        server.quit()
        print(f"[EMAIL NOTIFIER SUCCESS] Alert email sent to {to_email}")
        return True
    except Exception as err:
        print(f"[EMAIL NOTIFIER WARN] SMTP send failed: {err}")
        return False


def notify_job_execution(prediction_output: Dict[str, Any], gemini_bulletin: Optional[str] = None):
    """
    Sends a Job Run Summary Notification on every Airflow execution.
    """
    storm_id = prediction_output.get("storm_id", "ACTIVE_CYCLONE")
    intensity = prediction_output.get("intensity", {})
    detection = prediction_output.get("detection_obb", {})

    subject = f"⚡ [Airflow ETL Job Complete] Cyclone Alert: {storm_id} ({intensity.get('imd_category', 'Active Storm')})"

    html = f"""
    <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; max-width: 600px; border: 1px solid #e0e0e0; border-radius: 8px;">
        <h2 style="color: #0284c7; margin-top: 0;">🌀 Tropical Cyclone AI Job Run Complete</h2>
        <p>Airflow DAG pipeline successfully processed satellite observations and generated predictions:</p>
        
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <tr style="background-color: #f8fafc;">
                <td style="padding: 10px; font-weight: bold; border: 1px solid #e2e8f0;">Storm Identifier</td>
                <td style="padding: 10px; border: 1px solid #e2e8f0;">{storm_id}</td>
            </tr>
            <tr>
                <td style="padding: 10px; font-weight: bold; border: 1px solid #e2e8f0;">Eye Center Coordinates</td>
                <td style="padding: 10px; border: 1px solid #e2e8f0;">Lat {detection.get('eye_center_lat')}°N, Lon {detection.get('eye_center_lon')}°E</td>
            </tr>
            <tr style="background-color: #f8fafc;">
                <td style="padding: 10px; font-weight: bold; border: 1px solid #e2e8f0;">Wind Speed (MSW)</td>
                <td style="padding: 10px; border: 1px solid #e2e8f0;">{intensity.get('msw_knots')} knots ({intensity.get('msw_kmh')} km/h)</td>
            </tr>
            <tr>
                <td style="padding: 10px; font-weight: bold; border: 1px solid #e2e8f0;">IMD Storm Category</td>
                <td style="padding: 10px; border: 1px solid #e2e8f0; color: #dc2626; font-weight: bold;">{intensity.get('imd_category')}</td>
            </tr>
        </table>

        {f'<div style="background-color: #f0fdf4; padding: 15px; border-left: 4px solid #16a34a; border-radius: 4px; margin-bottom: 20px;"><strong>Gemini AI Forecaster Bulletin:</strong><br>{gemini_bulletin}</div>' if gemini_bulletin else ''}

        <p style="font-size: 12px; color: #64748b;">Automated Airflow Pipeline • Cloudflare R2 Storage Active</p>
    </div>
    """

    send_email_alert(subject, html)


def notify_r2_storage_warning(storage_info: Dict[str, Any]):
    """
    Sends an Urgent R2 Storage Capacity Warning containing a One-Click Data Purge Link.
    """
    used_gb = storage_info.get("used_gb", 0)
    pct_used = storage_info.get("percent_used", 0)

    # One-Click Purge Link
    one_click_url = f"{BASE_API_URL}/api/v1/storage/one-click-cleanup?token=auto_purge_confirm"

    subject = f"⚠️ URGENT ALERT: Cloudflare R2 Storage Exceeding 9.0 GB Cap ({used_gb} GB / 9.0 GB)"

    html = f"""
    <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; max-width: 600px; border: 2px solid #ef4444; border-radius: 8px;">
        <h2 style="color: #dc2626; margin-top: 0;">⚠️ Cloudflare R2 Storage Warning</h2>
        <p>Your Cloudflare R2 Storage bucket usage is approaching the <strong>9.0 GB safety cap</strong> to ensure zero charges on the 10 GB free tier:</p>
        
        <div style="background-color: #fef2f2; padding: 15px; border-radius: 6px; margin-bottom: 20px;">
            <p style="margin: 0; font-size: 18px; font-weight: bold; color: #991b1b;">Current Storage: {used_gb} GB ({pct_used}% of 9.0 GB Cap)</p>
            <p style="margin: 5px 0 0 0; color: #7f1d1d;">Total Archived Objects: {storage_info.get('total_objects', 0)}</p>
        </div>

        <p>Click the button below to execute an immediate <strong>One-Click Cleanup</strong> and purge archived satellite data older than 14 days:</p>

        <div style="text-align: center; margin: 30px 0;">
            <a href="{one_click_url}" style="background-color: #dc2626; color: #ffffff; padding: 14px 28px; text-decoration: none; font-weight: bold; font-size: 16px; border-radius: 6px; display: inline-block;">
                🗑️ ONE-CLICK CLEANUP R2 STORAGE NOW
            </a>
        </div>

        <p style="font-size: 12px; color: #64748b;">Direct Purge Link: <a href="{one_click_url}">{one_click_url}</a></p>
    </div>
    """

    send_email_alert(subject, html)
