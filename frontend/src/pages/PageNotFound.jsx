import { useNavigate } from "react-router-dom";

const styles = `
  @keyframes float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
  }
  @keyframes fade-in {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .nf-wrapper { animation: fade-in 0.5s ease both; }
  .nf-float   { animation: float 4s ease-in-out infinite; }
`;

function NotFound() {
  const navigate = useNavigate();

  return (
    <>
      <style>{styles}</style>

      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="nf-wrapper text-center max-w-sm w-full">
          {/* Illustration */}
          <div className="nf-float mb-8 flex justify-center">
            <svg
              width="120"
              height="100"
              viewBox="0 0 120 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                x="10"
                y="20"
                width="100"
                height="65"
                rx="6"
                fill="white"
                stroke="#e5e7eb"
                strokeWidth="1"
              />
              <rect
                x="10"
                y="20"
                width="100"
                height="16"
                rx="6"
                fill="white"
                stroke="#e5e7eb"
                strokeWidth="1"
              />
              <rect x="10" y="28" width="100" height="8" fill="white" />
              <circle cx="20" cy="28" r="3" fill="#E24B4A" />
              <circle cx="31" cy="28" r="3" fill="#EF9F27" />
              <circle cx="42" cy="28" r="3" fill="#639922" />
              <text
                x="60"
                y="68"
                textAnchor="middle"
                fontSize="28"
                fontWeight="500"
                fill="#111"
                fontFamily="monospace"
              >
                404
              </text>
              <line
                x1="30"
                y1="82"
                x2="90"
                y2="82"
                stroke="#e5e7eb"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <line
                x1="38"
                y1="90"
                x2="82"
                y2="90"
                stroke="#e5e7eb"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </div>

          {/* Text */}
          <h1 className="text-2xl font-medium text-gray-900 mb-2">
            Page not found
          </h1>
          <p className="text-sm text-gray-500 mb-8 leading-relaxed">
            The page you're looking for doesn't exist or has been moved.
          </p>

          {/* Actions */}
          <div className="flex gap-3 justify-center flex-wrap">
            <button
              onClick={() => navigate("/")}
              className="px-5 py-2 text-sm font-medium bg-gray-900 text-white
                         rounded-lg hover:bg-gray-700 transition-colors"
            >
              Go home
            </button>
            <button
              onClick={() => navigate(-1)}
              className="px-5 py-2 text-sm font-medium text-gray-700 border
                         border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Go back
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default NotFound;
