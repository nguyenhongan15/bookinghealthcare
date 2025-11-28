import { Link } from "react-router-dom";
import './Specialgrid.css'

// IMPORT IMAGE ICONS (đổi lại tên theo thư viện ảnh của bạn)
import OrthoImg from '../../assets/specialties/ortho.png'
import NeuroImg from '../../assets/specialties/neuro.png'
import DigestImg from '../../assets/specialties/digest.png'
import HeartImg from '../../assets/specialties/heart.png'
import ENTImg from '../../assets/specialties/ent.png'
import SpineImg from '../../assets/specialties/spine.png'

const SPECIALTIES = [
  { name: 'Cơ Xương Khớp', slug: 'co-xuong-khop', image: OrthoImg },
  { name: 'Thần kinh', slug: 'than-kinh', image: NeuroImg },
  { name: 'Tiêu hóa', slug: 'tieu-hoa', image: DigestImg },
  { name: 'Tim mạch', slug: 'tim-mach', image: HeartImg },
  { name: 'Tai Mũi Họng', slug: 'tai-mui-hong', image: ENTImg },
  { name: 'Cột sống', slug: 'cot-song', image: SpineImg },

  // Các chuyên khoa còn lại dùng ảnh mặc định
  { name: 'Y học Cổ truyền', slug: 'y-hoc-co-truyen', image: OrthoImg },
  { name: 'Châm cứu', slug: 'cham-cuu', image: OrthoImg },
  { name: 'Sản Phụ khoa', slug: 'san-phu-khoa', image: OrthoImg },
  { name: 'Siêu âm thai', slug: 'sieu-am-thai', image: OrthoImg },
  { name: 'Nhi khoa', slug: 'nhi-khoa', image: OrthoImg },
  { name: 'Da liễu', slug: 'da-lieu', image: OrthoImg },
  { name: 'Bệnh Viêm gan', slug: 'viem-gan', image: OrthoImg },
  { name: 'Sức khỏe tâm thần', slug: 'tam-than', image: OrthoImg },
  { name: 'Dị ứng miễn dịch', slug: 'di-ung', image: OrthoImg },
  { name: 'Hô hấp - Phổi', slug: 'pho-i', image: OrthoImg },
  { name: 'Ngoại thần kinh', slug: 'ngoai-than-kinh', image: OrthoImg },
  { name: 'Nam học', slug: 'nam-hoc', image: OrthoImg },
  { name: 'Chuyên khoa Mắt', slug: 'mat', image: OrthoImg },
  { name: 'Thận - Tiết niệu', slug: 'than-tiet-nieu', image: OrthoImg },
]


function SpecialtyGrid({ limit }) {
  const data = limit ? SPECIALTIES.slice(0, limit) : SPECIALTIES

  return (
    <div className="specialty-grid">
      {data.map((item) => (
       <Link 
       to={`/bac-si/${item.slug}`}
       className="specialty-card" 
       key={item.slug}
     >
       <img src={item.image} alt={item.name} className="specialty-img" />
       <div className="specialty-name">{item.name}</div>
     </Link>
      ))}
    </div>
  );
}

export default SpecialtyGrid
