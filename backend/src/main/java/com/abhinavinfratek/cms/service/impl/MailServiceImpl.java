package com.abhinavinfratek.cms.service.impl;

import com.abhinavinfratek.cms.dto.SiteSettingsResponse;
import com.abhinavinfratek.cms.entity.Enquiry;
import com.abhinavinfratek.cms.service.MailService;
import com.abhinavinfratek.cms.service.SiteSettingsService;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import java.time.format.DateTimeFormatter;
import java.util.Locale;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailException;
import org.springframework.mail.MailSendException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.web.util.HtmlUtils;

@Service
@RequiredArgsConstructor
public class MailServiceImpl implements MailService {

    private static final String COMPANY_TAGLINE = "Engineers & Architects";
    private static final String COMPANY_NOTIFICATION_SUBJECT = "New Website Enquiry - Abhinav Infratek";
    private static final String CUSTOMER_ACKNOWLEDGEMENT_SUBJECT = "Thank You for Contacting Abhinav Infratek";
    private static final DateTimeFormatter DATE_TIME_FORMATTER = DateTimeFormatter.ofPattern("dd MMM yyyy, hh:mm a", Locale.ENGLISH);

    private final JavaMailSender javaMailSender;
    private final SiteSettingsService siteSettingsService;

    @Value("${mail.company.email}")
    private String companyEmail;

    @Value("${spring.mail.username:}")
    private String fromEmail;

    @Override
    public void sendCompanyNotification(Enquiry enquiry) {
        sendHtmlEmail(
                companyEmail,
                COMPANY_NOTIFICATION_SUBJECT,
                buildCompanyNotificationHtml(enquiry, getSettingsSafely()),
                enquiry.getEmail()
        );
    }

    @Override
    public void sendCustomerAcknowledgement(Enquiry enquiry) {
        if (enquiry.getEmail() == null || enquiry.getEmail().isBlank()) {
            return;
        }

        sendHtmlEmail(
                enquiry.getEmail(),
                CUSTOMER_ACKNOWLEDGEMENT_SUBJECT,
                buildCustomerAcknowledgementHtml(enquiry, getSettingsSafely()),
                null
        );
    }

    private void sendHtmlEmail(String to, String subject, String html, String replyTo) {
        if (to == null || to.isBlank()) {
            throw new MailSendException("Recipient email address is required");
        }

        try {
            MimeMessage message = javaMailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setTo(to.trim());
            helper.setSubject(subject);
            helper.setText(html, true);

            if (fromEmail != null && !fromEmail.isBlank()) {
                helper.setFrom(fromEmail.trim());
            }

            if (replyTo != null && !replyTo.isBlank()) {
                helper.setReplyTo(replyTo.trim());
            }

            javaMailSender.send(message);
        } catch (MessagingException exception) {
            throw new MailSendException("Failed to prepare HTML email", exception);
        } catch (MailException exception) {
            throw exception;
        }
    }

    private SiteSettingsResponse getSettingsSafely() {
        try {
            return siteSettingsService.getSettings();
        } catch (RuntimeException exception) {
            return null;
        }
    }

    private String buildCompanyNotificationHtml(Enquiry enquiry, SiteSettingsResponse settings) {
        String content = """
                <p style="margin:0 0 18px;color:#374151;font-size:16px;line-height:1.6;">
                  A new enquiry has been submitted through the company website.
                </p>
                %s
                <p style="margin:22px 0 0;color:#374151;font-size:15px;line-height:1.6;">
                  Please respond to the customer as soon as possible.
                </p>
                """.formatted(buildDetailsTable(new String[][]{
                {"Name", enquiry.getName()},
                {"Email", enquiry.getEmail()},
                {"Phone", enquiry.getPhone()},
                {"Project Type", enquiry.getProjectType()},
                {"Message", enquiry.getMessage()},
                {"Submitted Date & Time", formatDate(enquiry)}
        }));

        return buildEmailLayout(
                "ABHINAV INFRATEK",
                COMPANY_TAGLINE,
                content,
                settings
        );
    }

    private String buildCustomerAcknowledgementHtml(Enquiry enquiry, SiteSettingsResponse settings) {
        String content = """
                <p style="margin:0 0 12px;color:#374151;font-size:16px;line-height:1.6;">Dear %s,</p>
                <p style="margin:0 0 18px;color:#374151;font-size:16px;line-height:1.6;">
                  Thank you for contacting Abhinav Infratek Engineers & Architects.
                  We have successfully received your enquiry.
                </p>
                <p style="margin:0 0 22px;color:#374151;font-size:16px;line-height:1.6;">
                  Our team will review your requirements and contact you shortly.
                </p>
                %s
                <p style="margin:22px 0 0;color:#374151;font-size:16px;line-height:1.7;">
                  Regards,<br>
                  <strong style="color:#111827;">Abhinav Infratek</strong><br>
                  Engineers & Architects
                </p>
                """.formatted(escape(enquiry.getName()), buildSummaryCard(enquiry));

        return buildEmailLayout("Thank You!", "We received your enquiry", content, settings);
    }

    private String buildEmailLayout(String title, String subtitle, String content, SiteSettingsResponse settings) {
        String contactFooter = buildContactFooter(settings);
        String logo = settings != null && settings.getLogoUrl() != null && !settings.getLogoUrl().isBlank()
                ? """
                <img src="%s" alt="Abhinav Infratek logo" width="72" style="display:block;margin:0 auto 12px;border-radius:50%%;background:#ffffff;">
                """.formatted(escape(settings.getLogoUrl()))
                : "";

        return """
                <!doctype html>
                <html>
                  <body style="margin:0;padding:0;background:#f3f4f6;font-family:Arial,Helvetica,sans-serif;color:#111827;">
                    <table role="presentation" width="100%%" cellspacing="0" cellpadding="0" style="background:#f3f4f6;padding:24px 12px;">
                      <tr>
                        <td align="center">
                          <table role="presentation" width="100%%" cellspacing="0" cellpadding="0" style="max-width:680px;background:#ffffff;border-radius:18px;overflow:hidden;border:1px solid #e5e7eb;">
                            <tr>
                              <td style="background:#B91C1C;padding:30px 24px;text-align:center;color:#ffffff;">
                                %s
                                <h1 style="margin:0;font-size:28px;line-height:1.2;letter-spacing:.04em;">%s</h1>
                                <p style="margin:8px 0 0;color:#FDE68A;font-size:13px;font-weight:700;letter-spacing:.16em;text-transform:uppercase;">%s</p>
                              </td>
                            </tr>
                            <tr>
                              <td style="padding:28px 24px;">
                                %s
                              </td>
                            </tr>
                            <tr>
                              <td style="background:#111827;padding:22px 24px;text-align:center;color:#d1d5db;font-size:13px;line-height:1.7;">
                                <strong style="display:block;color:#ffffff;font-size:15px;">Abhinav Infratek Engineers & Architects</strong>
                                %s
                                <span style="display:block;margin-top:12px;color:#9ca3af;">This email was automatically generated from the website enquiry form.</span>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </body>
                </html>
                """.formatted(logo, escape(title), escape(subtitle), content, contactFooter);
    }

    private String buildDetailsTable(String[][] rows) {
        StringBuilder builder = new StringBuilder();
        builder.append("<table role=\"presentation\" width=\"100%\" cellspacing=\"0\" cellpadding=\"0\" style=\"border-collapse:collapse;border:1px solid #e5e7eb;border-radius:14px;overflow:hidden;\">");

        for (String[] row : rows) {
            builder.append("""
                    <tr>
                      <td style="width:34%%;background:#f9fafb;border-bottom:1px solid #e5e7eb;padding:13px 14px;color:#6b7280;font-size:13px;font-weight:700;text-transform:uppercase;">%s</td>
                      <td style="border-bottom:1px solid #e5e7eb;padding:13px 14px;color:#111827;font-size:15px;line-height:1.6;">%s</td>
                    </tr>
                    """.formatted(escape(row[0]), formatMultiline(row[1])));
        }

        builder.append("</table>");
        return builder.toString();
    }

    private String buildSummaryCard(Enquiry enquiry) {
        return """
                <div style="border:1px solid #e5e7eb;border-left:4px solid #B91C1C;border-radius:16px;background:#ffffff;padding:18px;">
                  <p style="margin:0 0 10px;color:#6b7280;font-size:12px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;">Enquiry Summary</p>
                  <p style="margin:0 0 8px;color:#111827;font-size:15px;"><strong>Project Type:</strong> %s</p>
                  <p style="margin:0 0 8px;color:#111827;font-size:15px;"><strong>Submitted Date:</strong> %s</p>
                  <p style="margin:0;color:#374151;font-size:15px;line-height:1.7;"><strong>Message:</strong><br>%s</p>
                </div>
                """.formatted(
                escape(enquiry.getProjectType()),
                escape(formatDate(enquiry)),
                formatMultiline(enquiry.getMessage())
        );
    }

    private String buildContactFooter(SiteSettingsResponse settings) {
        if (settings == null) {
            return "";
        }

        StringBuilder builder = new StringBuilder();
        appendFooterLine(builder, settings.getPhone());
        appendFooterLine(builder, settings.getEmail());
        appendFooterLine(builder, settings.getGoogleMapsEmbedUrl());
        return builder.toString();
    }

    private void appendFooterLine(StringBuilder builder, String value) {
        if (value != null && !value.isBlank()) {
            builder.append("<span style=\"display:block;\">")
                    .append(escape(value))
                    .append("</span>");
        }
    }

    private String formatDate(Enquiry enquiry) {
        if (enquiry.getCreatedAt() == null) {
            return "";
        }

        return enquiry.getCreatedAt().format(DATE_TIME_FORMATTER);
    }

    private String formatMultiline(String value) {
        return escape(value).replace("\n", "<br>");
    }

    private String escape(String value) {
        return HtmlUtils.htmlEscape(value == null ? "" : value);
    }
}
