import { useEffect, useState } from "react";
import JobMatching, { GarbledData } from "../components/JobMatching";
import init, { WasmCommitmentKey } from "../laconic/laconic_ot.js";

export default function JobMatchingPage() {
  const [garblerText, setGarblerText] = useState<GarbledData>();
  const [commitment, setCommitment] = useState<Uint8Array>();
  const [commitmentKey, setCommitmentKey] = useState<WasmCommitmentKey>();

  useEffect(() => {
    init().then(() => {
      setCommitmentKey(WasmCommitmentKey.setup(30));
    });
  }, []);

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {commitmentKey ? (
          <>
            <JobMatching
              role="Evaluator"
              garbledData={garblerText}
              onCommitmentChange={setCommitment}
              commitmentKey={commitmentKey}
            />
            <JobMatching
              role="Garbler"
              onGarbledDataChange={setGarblerText}
              commitment={commitment}
              commitmentKey={commitmentKey}
            />
          </>
        ) : (
          <h2 className="p-8 text-xl font-bold mb-4">Loading...</h2>
        )}
      </div>
    </div>
  );
}
