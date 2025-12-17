package com.bookinghealthcare.backend.service;

import com.sendgrid.SendGrid;
import com.sendgrid.Request;
import com.sendgrid.Response;
import com.sendgrid.Method;

import com.sendgrid.helpers.mail.Mail;
import com.sendgrid.helpers.mail.objects.Email;
import com.sendgrid.helpers.mail.objects.Content;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class SendGridEmailService {

    @Value("${SENDGRID_API_KEY}")
    private String sendGridApiKey;

    public void sendHtmlEmail(String to, String subject, String html) {
        try {
            Email from = new Email("vma33169@gmail.com", "BookingHealthcare");
            Email toEmail = new Email(to);

            Content content = new Content("text/html", html);
            Mail mail = new Mail(from, subject, toEmail, content);

            SendGrid sg = new SendGrid(sendGridApiKey);
            Request request = new Request();

            request.setMethod(Method.POST);
            request.setEndpoint("mail/send");
            request.setBody(mail.build());

            Response response = sg.api(request);

            System.out.println("✅ SendGrid API status: " + response.getStatusCode());

        } catch (Exception e) {
            System.out.println("❌ SendGrid API failed: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
