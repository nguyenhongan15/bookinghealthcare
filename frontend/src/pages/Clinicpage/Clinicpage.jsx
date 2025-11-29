import ClinicGrid from '../../components/ClinicGrid/ClinicGrid'
import './ClinicPage.css'

function ClinicPage() {
  return (
    <div className="clinic-page">
      <h1 className="clinic-title">Các cơ sở y tế</h1>
      <ClinicGrid />
    </div>
  )
}

export default ClinicPage