package com.bookinghealthcare.backend.service;

import com.bookinghealthcare.backend.dto.DoctorReviewRequest;
import com.bookinghealthcare.backend.entity.Booking;
import com.bookinghealthcare.backend.entity.DoctorReview;
import com.bookinghealthcare.backend.entity.ScheduleSlot;
import com.bookinghealthcare.backend.repository.BookingRepository;
import com.bookinghealthcare.backend.repository.DoctorReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DoctorReviewService {

    private final BookingRepository bookingRepo;
    private final DoctorReviewRepository reviewRepo;

    public DoctorReview createReview(DoctorReviewRequest req) {

        Booking booking = bookingRepo.findById(req.getBookingId())
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        // 1) Chặn đánh giá lại
        if (reviewRepo.existsByBookingId(booking.getId()) || booking.isReviewed()) {
            throw new RuntimeException("Booking already reviewed");
        }

        // 2) Chặn đánh giá trước giờ kết thúc slot (CHỈ DỰA VÀO THỜI GIAN)
        ScheduleSlot slot = booking.getScheduleSlot();

        // slot.getSlot() = "09:00 - 10:00"
        String slotStr = slot.getSlot();
        String endTimeStr = slotStr.split(" - ")[1]; // "10:00"

        LocalDateTime slotEndTime = LocalDateTime.parse(
            booking.getDate() + "T" + endTimeStr
        );



        if (LocalDateTime.now().isBefore(slotEndTime)) {
            throw new RuntimeException("Chưa đến thời gian đánh giá");
        }

        // 3) Validate rating
        if (req.getRating() < 1 || req.getRating() > 5) {
            throw new RuntimeException("Rating phải từ 1 đến 5");
        }

        DoctorReview review = new DoctorReview();
        review.setDoctor(booking.getDoctor());
        review.setBooking(booking);
        review.setRating(req.getRating());
        review.setComment(req.getComment());

        DoctorReview saved = reviewRepo.save(review);

        // 4) Đánh dấu booking đã review
        booking.setReviewed(true);
        bookingRepo.save(booking);

        return saved;
    }

    public List<DoctorReview> getReviewsByDoctor(Long doctorId) {
        return reviewRepo.findByDoctorId(doctorId);
    }
}
