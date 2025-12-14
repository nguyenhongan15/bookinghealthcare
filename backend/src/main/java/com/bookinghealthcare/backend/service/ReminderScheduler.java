package com.bookinghealthcare.backend.service;

import com.bookinghealthcare.backend.entity.Booking;
import com.bookinghealthcare.backend.repository.BookingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReminderScheduler {

    private final BookingRepository bookingRepository;
    private final EmailService emailService;

    @Scheduled(fixedRate = 60_000)
    public void sendReminderEmails() {

        ZoneId zone = ZoneId.of("Asia/Ho_Chi_Minh");
        LocalDateTime now = LocalDateTime.now(zone);

        // LocalDateTime from = now.plusHours(1); // test mai mới test được
        // LocalDateTime to   = now.plusHours(2);

        LocalDateTime from = now.minusMinutes(1);
        LocalDateTime to   = now.plusMinutes(5);


        List<Booking> list = bookingRepository.findNeedReminder(from, to);

        DateTimeFormatter fmt = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");

        for (Booking booking : list) {

            if (booking.getEmail() == null || booking.getEmail().isBlank()) {
                continue;
            }

            try {
                String timeFormatted = booking
                        .getAppointmentAt()
                        .format(fmt);

                emailService.sendReminderEmail(
                    booking.getEmail(),
                    booking.getPatientName(),
                    booking.getDoctor().getName(),
                    timeFormatted,
                    booking.getDoctor().getClinic().getName()
                );

                booking.setReminderSent(true);
                booking.setReminderSentAt(now);
                bookingRepository.save(booking);

            } catch (Exception e) {
                System.out.println("❌ Lỗi gửi reminder: " + e.getMessage());
            }
        }
    }
}
