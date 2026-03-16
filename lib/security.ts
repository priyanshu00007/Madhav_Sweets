import { executeQuery } from "./db";

export async function logSecurityAlert(title: string, message: string, userId: number | null = null) {
  try {
    await executeQuery(
      "INSERT INTO notifications (user_id, type, title, message) VALUES (?, 'security', ?, ?)",
      [userId, title, message]
    );
    console.log(`[SECURITY ALERT] ${title}: ${message}`);
  } catch (error) {
    console.error("Failed to log security alert:", error);
  }
}

export async function trackAuthAttempt(email: string, success: boolean, ip: string) {
  if (!success) {
    // In a real app, we'd check how many failed attempts in the last 10 mins
    // and trigger an alert if > 5. For now, we simulate an alert on any failure
    // that looks like a brute force (e.g., placeholder logic).
    await logSecurityAlert(
      "AUTHENTICATION FAILURE",
      `Failed login attempt for ${email} from IP: ${ip}`
    );
  }
}
