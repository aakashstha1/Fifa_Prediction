import { useEffect } from "react";

const styles = `
  @keyframes spin { to { transform: rotate(360deg); } }
  @keyframes pulse-text { 0%,100% { opacity: 0.4; } 50% { opacity: 1; } }
  @keyframes float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
  @keyframes ripple {
    0% { transform: scale(0.8); opacity: 0.6; }
    100% { transform: scale(2); opacity: 0; }
  }
`;

function Loader() {
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = styles;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
      <div
        style={{ animation: "float 3s ease-in-out infinite" }}
        className="flex flex-col items-center gap-6"
      >
        {/* Spinner with ripple rings */}
        <div className="relative w-18 h-18" style={{ width: 72, height: 72 }}>
          {[0, 0.9].map((delay, i) => (
            <div
              key={i}
              className="absolute inset-0 rounded-full border border-gray-400"
              style={{ animation: `ripple 1.8s ease-out ${delay}s infinite` }}
            />
          ))}
          <div className="absolute inset-0 rounded-full border-[3.5px] border-gray-200" />
          <div
            className="absolute inset-0 rounded-full border-[3.5px] border-transparent
                          border-t-black border-r-black"
            style={{
              animation: "spin 0.9s cubic-bezier(0.45,0.05,0.55,0.95) infinite",
            }}
          />
        </div>

        {/* Dots + label */}
        <div className="flex flex-col items-center gap-2.5">
          <div className="flex gap-1.5">
            {[0, 0.2, 0.4].map((delay, i) => (
              <div
                key={i}
                className="w-1.5 h-1.5 rounded-full bg-black"
                style={{
                  animation: `pulse-text 1.4s ease-in-out ${delay}s infinite`,
                  opacity: 0.2,
                }}
              />
            ))}
          </div>
          <span
            className="text-xs tracking-[0.18em] uppercase text-gray-400 font-medium"
            style={{ animation: "pulse-text 1.4s ease-in-out infinite" }}
          >
            Loading
          </span>
        </div>
      </div>
    </div>
  );
}

export default Loader;
