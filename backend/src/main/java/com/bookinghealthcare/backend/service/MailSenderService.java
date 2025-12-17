package com.bookinghealthcare.backend.service;

import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class MailSenderService {

    private final JavaMailSender mailSender;

    /**
     * Gửi email HTML
     */
    public void sendHtmlEmail(String to, String subject, String html) {
        try {
            System.out.println("📧 [MailSender] Sending email to: " + to);

            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper =
                    new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(to);
            helper.setSubject(subject);
            helper.setFrom("HealthCare Booking <vma33169@gmail.com>");
            helper.setText(html, true);

            mailSender.send(message);

            System.out.println("✅ [MailSender] Email sent successfully to: " + to);

        } catch (Exception e) {
            System.out.println("❌ [MailSender] Failed to send email to " + to);
            e.printStackTrace();
        }
    }

    /**
     * Gửi email TEXT (nếu cần)
     */
    public void sendTextEmail(String to, String subject, String text) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper =
                    new MimeMessageHelper(message, false, "UTF-8");

            helper.setTo(to);
            helper.setSubject(subject);
            helper.setFrom("HealthCare Booking <vma33169@gmail.com>");
            helper.setText(text, false);

            mailSender.send(message);

            System.out.println("✅ [MailSender] Text email sent to: " + to);

        } catch (Exception e) {
            System.out.println("❌ [MailSender] Failed to send text email to " + to);
            e.printStackTrace();
        }
    }
}
