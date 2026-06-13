import { Card } from "@/components/ui/card";

function Rules() {
  return (
    <div className="mb-6">
      <Card className="max-w-4xl w-full p-6 shadow-md">
        <h1 className="text-2xl font-bold text-center mb-6">
          📜 Rules & How to Play
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-700 text-sm text-left">
          {/* HOW TO USE */}
          <div className="space-y-2">
            <h2 className="font-semibold text-base">🟢 How to Use</h2>
            <ul className="list-disc ml-5 space-y-1">
              <li>Login to your account</li>
              <li>Go to the Matches page</li>
              <li>Select a match you want to predict</li>
              <li>Choose between the two available teams</li>
              <li>Submit your prediction</li>
              <li>Confirm before submitting</li>
            </ul>
          </div>

          {/* IMPORTANT RULES */}
          <div className="space-y-2">
            <h2 className="font-semibold text-base">⚠️ Important Rules</h2>
            <ul className="list-disc ml-5 space-y-1">
              <li>Once submitted, predictions cannot be changed</li>
              <li>You can only choose one team per match</li>
              <li>Each match has only two possible teams</li>
              <li>All predictions are final</li>
            </ul>
          </div>

          {/* RESULTS SYSTEM */}
          <div className="space-y-2">
            <h2 className="font-semibold text-base">📊 Results System</h2>
            <ul className="list-disc ml-5 space-y-1">
              <li>Correct prediction = win</li>
              <li>Wrong prediction = loss</li>
              <li>Draw match = counted as wrong prediction</li>
            </ul>
          </div>

          {/* WHERE TO CHECK */}
          <div className="space-y-2">
            <h2 className="font-semibold text-base">📌 Where to Check</h2>
            <ul className="list-disc ml-5 space-y-1">
              <li>My Predictions page for your results</li>
              <li>Predictions page for all users</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default Rules;
