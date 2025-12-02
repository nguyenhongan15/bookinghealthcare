import "./LoadingScreen.css";

function LoadingScreen({ text = "Đang xử lý..." }) {
  return (
    <div className="loading-wrapper">
      <div className="loading-center">
        
        {/* Vòng loading */}
        <div className="loader-circle">
          <div className="loader-inner">
            <span className="loader-icon">📊</span>
          </div>
        </div>

        <h2 className="loading-title">{text}</h2>
        <p className="loading-subtitle">
          Vui lòng chờ giây lát...
        </p>
      </div>
    </div>
  );
}

export default LoadingScreen;
