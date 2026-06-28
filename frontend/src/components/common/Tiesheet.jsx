import tieSheetImg from "../../assets/sheet.jpeg";

function Tiesheet() {
  return (
    <div className="w-full p-2">
      <img
        src={tieSheetImg}
        alt="Tie Sheet"
        className="w-full h-auto object-contain"
      />
    </div>
  );
}

export default Tiesheet;
