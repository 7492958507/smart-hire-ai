import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.89.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface NotificationRequest {
  type: "application_received" | "shortlisted" | "interview_scheduled" | "status_update";
  recipientEmail: string;
  recipientUserId?: string;
  data: {
    candidateName?: string;
    jobTitle?: string;
    companyName?: string;
    interviewDate?: string;
    status?: string;
    message?: string;
  };
}

const getEmailContent = (type: string, data: NotificationRequest["data"]) => {
  switch (type) {
    case "application_received":
      return {
        subject: `New Application: ${data.candidateName} for ${data.jobTitle}`,
        html: `
          <h1>New Application Received</h1>
          <p><strong>${data.candidateName}</strong> has applied for the <strong>${data.jobTitle}</strong> position.</p>
          <p>Log in to HireSense AI to review their application and resume.</p>
          <p>Best regards,<br/>HireSense AI Team</p>
        `,
      };
    case "shortlisted":
      return {
        subject: `Great news! You've been shortlisted for ${data.jobTitle}`,
        html: `
          <h1>Congratulations!</h1>
          <p>You've been shortlisted for the <strong>${data.jobTitle}</strong> position at <strong>${data.companyName}</strong>.</p>
          <p>The hiring team will reach out to you soon with next steps.</p>
          <p>Best of luck!<br/>HireSense AI Team</p>
        `,
      };
    case "interview_scheduled":
      return {
        subject: `Interview Scheduled: ${data.jobTitle} at ${data.companyName}`,
        html: `
          <h1>Interview Scheduled</h1>
          <p>Your interview for <strong>${data.jobTitle}</strong> at <strong>${data.companyName}</strong> has been scheduled.</p>
          <p><strong>Date & Time:</strong> ${data.interviewDate}</p>
          <p>Please ensure you're prepared and join on time.</p>
          <p>Good luck!<br/>HireSense AI Team</p>
        `,
      };
    case "status_update":
      return {
        subject: `Application Update: ${data.jobTitle}`,
        html: `
          <h1>Application Status Update</h1>
          <p>Your application for <strong>${data.jobTitle}</strong> at <strong>${data.companyName}</strong> has been updated.</p>
          <p><strong>New Status:</strong> ${data.status}</p>
          ${data.message ? `<p><strong>Message:</strong> ${data.message}</p>` : ""}
          <p>Best regards,<br/>HireSense AI Team</p>
        `,
      };
    default:
      return {
        subject: "Notification from HireSense AI",
        html: `<p>${data.message || "You have a new notification."}</p>`,
      };
  }
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    if (!RESEND_API_KEY) {
      console.error("RESEND_API_KEY is not configured");
      throw new Error("Email service is not configured");
    }

    const { type, recipientEmail, recipientUserId, data } = await req.json() as NotificationRequest;

    console.log(`Sending ${type} notification to ${recipientEmail}`);

    const emailContent = getEmailContent(type, data);

    // Send the email using Resend API directly
    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "HireSense AI <onboarding@resend.dev>",
        to: [recipientEmail],
        subject: emailContent.subject,
        html: emailContent.html,
      }),
    });

    if (!emailResponse.ok) {
      const errorText = await emailResponse.text();
      console.error("Resend API error:", emailResponse.status, errorText);
      throw new Error(`Failed to send email: ${emailResponse.status}`);
    }

    const emailResult = await emailResponse.json();
    console.log("Email sent successfully:", emailResult);

    // Log to database
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    await supabase.from("email_notifications").insert({
      recipient_email: recipientEmail,
      recipient_user_id: recipientUserId,
      notification_type: type,
      subject: emailContent.subject,
      content: emailContent.html,
      status: "sent",
      sent_at: new Date().toISOString(),
    });

    return new Response(
      JSON.stringify({ success: true, id: emailResult.id }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("send-notification error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Failed to send notification" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
