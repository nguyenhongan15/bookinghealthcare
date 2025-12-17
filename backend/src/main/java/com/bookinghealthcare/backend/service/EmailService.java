package com.bookinghealthcare.backend.service;


import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.scheduling.annotation.Async;


@Service
@RequiredArgsConstructor

public class EmailService {
    private final JavaMailSender mailSender;

    @Async
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
        try{
        String title = (gender != null && gender.equalsIgnoreCase("Nam"))
                ? "Ông"
                : "Bà";

        String fullNameFormatted = title + " " + patientName;

        String subject = " Xác nhận đặt lịch khám";

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
    } catch (Exception e) {
        System.out.println("⚠ Không gửi được phiếu khám: " + e.getMessage());
    }}
    
    private void sendHtmlEmail(String to, String subject, String html) {
        try {
            System.out.println("📧 Sending email to: " + to);
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper =
                    new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(to);
            helper.setSubject(subject);
            helper.setFrom("HealthCare Booking <vma33169@gmail.com>");
            helper.setText(html, true);

            mailSender.send(message);
            System.out.println("✅ Email sent successfully to: " + to);

        } catch (Exception e) {
            System.out.println("❌ Email failed to " + to + " | " + e.getMessage());
        }
    }

    @Async
    public void sendUserAccountEmail(String toEmail, String fullName, String username, String password) {
        try{
        String subject = "Thông báo tạo tài khoản BookingHealthcare";

        String html = """
            <div style="font-family: Arial, sans-serif; width: 450px; background: #ffffff; 
                        border-radius: 10px; padding: 30px; border: 1px solid #e0e6ed;">

                <h2 style="text-align:center; color:#00C8D2;">TÀI KHOẢN ĐƯỢC TẠO THÀNH CÔNG</h2>

                <p>Xin chào <strong>%s</strong>,</p>

                <p>Bạn đã được tạo tài khoản trên hệ thống <strong>BookingHealthcare</strong>.</p>

                <p>Thông tin tài khoản:</p>
                <ul>
                    <li><strong>Tên đăng nhập:</strong> %s</li>
                    <li><strong>Mật khẩu:</strong> %s</li>
                </ul>

                <p>Vui lòng đăng nhập và đổi mật khẩu để bảo mật.</p>

                <p style="text-align:center; margin-top:10px; color:#6c757d;">
                    Cảm ơn bạn đã sử dụng hệ thống.
                </p>
            </div>
            """;

        html = String.format(html, fullName, username, password);
        sendHtmlEmail(toEmail, subject, html);
    }catch (Exception e) {
        System.out.println("⚠ Không gửi được email tài khoản: " + e.getMessage());
    }}

    public void sendDoctorAccountEmail(String toEmail, String fullName, String username, String password) {

        String subject = "Thông báo tài khoản dành cho Bác sĩ - BookingHealthcare";

        String html = """
            <div style="font-family: Arial, sans-serif; width: 450px; background: #ffffff; 
                        border-radius: 10px; padding: 30px; border: 1px solid #e0e6ed;">

                <h2 style="text-align:center; color:#00C8D2;">TÀI KHOẢN BÁC SĨ</h2>

                <p>Xin chào BS <strong>%s</strong>,</p>

                <p>Hệ thống đã tạo tài khoản dành cho bác sĩ để quản lý lịch khám và trò chuyện với bệnh nhân.</p>

                <p>Thông tin tài khoản:</p>
                <ul>
                    <li><strong>Tên đăng nhập:</strong> %s</li>
                    <li><strong>Mật khẩu:</strong> %s</li>
                    </ul>

                <p>Vui lòng đăng nhập và đổi mật khẩu để bảo mật.</p>

                <p style="text-align:center; margin-top:10px; color:#6c757d;">
                    Trân trọng,<br>BookingHealthcare
                </p>
            </div>
            """;

        html = String.format(html, fullName, username, password);
            sendHtmlEmail(toEmail, subject, html);
    }

    public void sendReminderEmail(
        String toEmail,
        String patientName,
        String doctorName,
        String appointmentTime,
        String clinicName
    ) {

        try {
            
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(toEmail);
            helper.setSubject("⏰ Nhắc lịch khám sắp tới");
            helper.setFrom("HealthCare Booking <vma33169@gmail.com>");


            String content = """
                <h3>Xin chào %s,</h3>
                <p>Bạn có lịch khám sắp tới:</p>
                <ul>
                    <li><b>Bác sĩ:</b> %s</li>
                    <li><b>Thời gian:</b> %s</li>
                    <li><b>Phòng khám:</b> %s</li>
                </ul>
                <p>Vui lòng đến đúng giờ. Xin cảm ơn!</p>
            """.formatted(patientName, doctorName, appointmentTime, clinicName);

            helper.setText(content, true);
            mailSender.send(message);

        } catch (Exception e) {
            throw new RuntimeException("Không gửi được email nhắc lịch");
        }
    }
}


