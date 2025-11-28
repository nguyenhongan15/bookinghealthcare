import './Search.css'

const specialties = ['Tổng quát', 'Tại nhà', 'Ung thư', 'NIPT', 'Sốt xuất huyết']
const hospitals = [
  'Bệnh viện Hữu nghị Việt Đức',
  'Bệnh viện Chợ Rẫy',
  'Doctor Check - Tầm Soát Bệnh Để Sống Thọ Hơn',
  'Phòng khám Bệnh viện Đại học Y Dược 1',
  'Bệnh viện Ung bướu Hưng Việt',
]

const doctors = [
  'BSCKII Nguyễn Tuấn Minh - Sản phụ khoa',
  'GS.TS Hà Văn Quyết - Tiêu hóa - Viêm gan',
  'Khám theo yêu cầu tại BV Lão khoa TW',
  'PGS.TS Nguyễn Thị Hoài An - Tai Mũi Họng',
  'TS.BS Vũ Thái Hà - Da liễu thẩm mỹ',
]

const generalPackages = [
  'Gói khám Tổng quát cơ bản cho Nam',
  'Gói khám Tổng quát VIP dành cho Nam (DC3M)',
  'Gói khám Tổng quát VIP dành cho Nữ (DC3F)',
  'Gói khám Sống Thọ dành cho Nam (DC4M)',
  'Gói khám Sống Thọ dành cho Nữ (DC4F)',
]

const tests = [
  'Dịch vụ xét nghiệm tại nhà Diag Laboratories',
  'Dịch vụ xét nghiệm tại hệ thống y tế Medlatec',
  'Sàng lọc trước sinh không xâm lấn (NIPT 7)',
  'Xét nghiệm PCR Covid - Diag Laboratories',
  'Lấy mẫu xét nghiệm tại nhà Medlatec',
]

function Search() {
  return (
    <div className="search-page">
      <div className="search-inner">
        <div className="search-banner">
          <input
            className="search-big-input"
            placeholder="Tìm tất cả"
            type="text"
          />
          <button className="search-big-btn">Tất cả ⌄</button>
        </div>

        {/* Chuyên khoa */}
        <section className="search-section">
          <h3>Chuyên khoa</h3>
          <ul>
            {specialties.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        {/* Cơ sở y tế */}
        <section className="search-section">
          <h3>Cơ sở y tế</h3>
          <ul>
            {hospitals.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        {/* Bác sĩ */}
        <section className="search-section">
          <h3>Bác sĩ</h3>
          <ul>
            {doctors.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        {/* Gói khám tổng quát */}
        <section className="search-section">
          <h3>Gói khám tổng quát / chụp / nội soi</h3>
          <ul>
            {generalPackages.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        {/* Xét nghiệm */}
        <section className="search-section">
          <h3>Xét nghiệm</h3>
          <ul>
            {tests.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  )
}

export default Search
