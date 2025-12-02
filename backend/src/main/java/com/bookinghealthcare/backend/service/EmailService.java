package com.bookinghealthcare.backend.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;
    

    public void sendBookingEmail(
            String toEmail,
            String patientName,
            String gender,
            String birthyear,
            String phone,
            String doctorName,
            String date,
            String time,
            String clinicName,
            String address
    ) {

        // Xưng hô
        String title = (gender != null && gender.equalsIgnoreCase("Nam"))
                ? "Ông"
                : "Bà";

        // Tên + giới tính (gộp một dòng)
        String fullNameFormatted = title + " " + patientName;

        String subject = " Xác nhận đặt lịch khám";

        // HTML TEMPLATE
        String html = """
            <div style="font-family: Arial, sans-serif; width: 400px; 
                    background: #ffffff; border-radius: 10px; padding: 35px 45px;font-size:16px;
                    border: 1px solid #e0e6ed;">

                <!-- Header -->
                <div style="text-align: center; margin-bottom: 10px;">
                    <span style="font-size: 24px; font-weight: 700; color: #00C8D2;">
                        HealthCare Service
                    </span>
                </div>

                <h2 style="text-align:center; margin-top: 5px; color:#333;">
                    PHIẾU THÔNG TIN KHÁM BỆNH
                </h2>

                <table style="width:100%%; border-collapse: collapse; font-size: 15px; margin-top: 25px;">
                    <tr>
                        <td style="padding:10px 0; color:#555;">Họ tên:</td>
                        <td style="padding:10px 0; font-weight:bold; text-align:right;">%s</td>
                    </tr>
                    <tr>
                        <td style="padding:10px 0; color:#555;">Năm sinh:</td>
                        <td style="padding:10px 0; font-weight:bold; text-align:right;">%s</td>
                    </tr>
                    <tr>
                        <td style="padding:10px 0; color:#555;">Số điện thoại:</td>
                        <td style="padding:10px 0; font-weight:bold; text-align:right;">%s</td>
                    </tr>
                    <tr>
                        <td style="padding:10px 0; color:#555;">Ngày khám:</td>
                        <td style="padding:10px 0; font-weight:bold; text-align:right;">%s</td>
                    </tr>
                    <tr>
                        <td style="padding:10px 0; color:#555;">Giờ khám:</td>
                        <td style="padding:10px 0; font-weight:bold; text-align:right;">%s</td>
                    </tr>
                    <tr>
                        <td style="padding:10px 0; color:#555;">Bác sĩ:</td>
                        <td style="padding:10px 0; font-weight:bold; text-align:right;">%s</td>
                        </tr>
                    <tr>
                        <td style="padding:10px 0; color:#555;">Nơi khám:</td>
                        <td style="padding:10px 0; font-weight:bold; text-align:right;">%s</td>
                    </tr>

                    <tr>
                        <td style="padding:10px 0; color:#555;">Địa chỉ:</td>
                        <td style="padding:10px 0; font-weight:bold; text-align:right;">%s</td>
                    </tr>
                </table>

                <hr style="margin: 20px 0; border: none; border-top: 1px solid #ddd;">

                <div style="margin-top: 10px; font-size:14px;">
                    <strong>Lưu ý:</strong>
                    <ul style="margin-top: 8px; color:#444;">
                        <li>Vui lòng đến quầy tiếp nhận trước hẹn 15 phút.</li>
                        <li>Xuất trình phiếu này cho nhân viên để làm thủ tục.</li>
                        <li>Đảm bảo thông tin chính xác trước khi khám.</li>
                    </ul>
                </div>

                <p style="text-align:center; margin-top: 25px; color:#6c757d;">
                    Cảm ơn bạn đã sử dụng dịch vụ của <strong>BookingHealthcare</strong>.
                </p>

            </div>
            """;

        // Chèn dữ liệu vào HTML
        html = String.format(
                html, 
                fullNameFormatted, 
                birthyear,
                phone,
                date,
                time,
                doctorName,
                clinicName,
                address 
        );

        sendHtmlEmail(toEmail, subject, html);
    }

    private void sendHtmlEmail(String to, String subject, String html) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper =
                    new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(to);
            helper.setSubject(subject);
            helper.setFrom("HealthCare Booking <vma33169@gmail.com>");
            helper.setText(html, true);

            mailSender.send(message);

        } catch (MessagingException e) {
            throw new RuntimeException("Failed to send email", e);
        }
    }
}
