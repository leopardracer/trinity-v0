"use client";

import { useState, useEffect } from "react";
import JIGG from "../../jigg/src/jiggClient.js";
import Label from "../../jigg/src/modules/label.js";
import JobMatchingForm from "./JobMatchingForm";
import init, {
  WasmCommitmentKey,
  WasmReceiver,
  WasmSender,
  WasmMessage,
} from "../laconic/laconic_ot.js";

interface JobMatchingProps {
  role: "Garbler" | "Evaluator";
  onGarbledDataChange?: (data: GarbledData) => void;
  onCommitmentChange?: (commitment: Uint8Array) => void;
  garbledData?: GarbledData;
  commitment?: Uint8Array;
  commitmentKey?: WasmCommitmentKey;
}

export interface GarbledData {
  circuit: string;
  garblerInputSize: number;
  evaluatorInputSize: number;
  garblerInputLabels?: Label[];
  inputLabels?: Label[][];
  evaluatorInputLabelEncryption?: WasmMessage[];
  outputLabels?: Label[][];
  R: Label;
}

export default function JobMatching({
  role,
  onGarbledDataChange,
  onCommitmentChange,
  garbledData,
  commitment,
  commitmentKey,
}: JobMatchingProps) {
  const [circuit, setCircuit] = useState<string>("");
  const [result, setResult] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [serializedReceiver, setSerializedReceiver] = useState<Uint8Array>();

  useEffect(() => {
    fetch("/circuits/job_matching.txt")
      .then((res) => res.text())
      .then(setCircuit);
  }, []);

  const handleFormSubmit = async (binaryInput: string) => {
    try {
      if (!commitmentKey) {
        return;
      }

      const agent = new JIGG(role);
      agent.loadCircuit(circuit);

      const binaryArray = binaryInput
        .split("")
        .map(Number)
        .filter((bit) => bit === 0 || bit === 1);

      // sets up the oblivious transfer WASM
      await init();

      if (role === "Evaluator" && !garbledData) {
        // Generate commitment for evaluator's input
        const binaryUint8Array = new Uint8Array(binaryArray);
        const receiver = WasmReceiver.new(commitmentKey, binaryUint8Array);
        const commitment = receiver.commitment();
        setSerializedReceiver(receiver.serialize());

        // Propagate commitment to garbler
        if (onCommitmentChange) {
          onCommitmentChange(commitment);
        }
        setStatus("Generated commitment");
      } else if (role === "Garbler" && commitment) {
        // Garbler generates circuit and encrypts evaluator inputs
        const garbledData = agent.generateGarbling() as GarbledData;

        // Garbler gets his own inputs
        garbledData.garblerInputLabels = garbledData.inputLabels
          ?.slice(0, garbledData.garblerInputSize)
          .map((label, index) => label[binaryArray[index]]);

        // Generate witness encryptions of evaluator inputs
        const sender = WasmSender.new(commitmentKey, commitment);
        const evaluatorInputLabelEncryption = await Promise.all(
          Array.from(
            { length: garbledData.evaluatorInputSize },
            async (_, i) => {
              const index = i + garbledData.garblerInputSize;

              if (
                !garbledData.inputLabels?.[index] ||
                !garbledData.inputLabels[index][0] ||
                !garbledData.inputLabels[index][1]
              ) {
                throw new Error(`Missing input labels for index ${i}`);
              }

              const label0 = garbledData.inputLabels[index][0].bytes;
              const label1 = garbledData.inputLabels[index][1].bytes;

              if (!label0 || !label1) {
                throw new Error(`Missing bytes for input labels at index ${i}`);
              }

              const msg = await sender.send(i, label0, label1);
              return msg;
            }
          )
        );

        // Send evaluator encryptions to evaluator
        garbledData.evaluatorInputLabelEncryption =
          evaluatorInputLabelEncryption;

        if (onGarbledDataChange) {
          onGarbledDataChange(garbledData);
        }
        setStatus("Generated garbled circuit");
        setResult(JSON.stringify(garbledData.outputLabels, null, 2));
      } else if (
        role === "Evaluator" &&
        serializedReceiver &&
        garbledData?.evaluatorInputLabelEncryption &&
        garbledData?.garblerInputLabels
      ) {
        const receiver = WasmReceiver.deserialize(
          serializedReceiver,
          commitmentKey
        );
        const evaluatorInputLabels =
          garbledData.evaluatorInputLabelEncryption.map(
            (msg, i) => new Label(receiver.recv(i, msg))
          );

        const evaluationResult = agent.evaluateCircuit(garbledData.circuit, [
          ...garbledData.garblerInputLabels,
          ...evaluatorInputLabels,
        ]);

        setStatus("Evaluated garbled circuit");
        setResult(JSON.stringify(evaluationResult, null, 2));
      }
    } catch (error) {
      console.error(error);
      setStatus(`Error!`);
    }
  };

  return (
    <div className="p-4">
      <JobMatchingForm
        role={role}
        onSubmit={handleFormSubmit}
        disabled={role === "Garbler" && commitment === undefined}
      />

      {status && (
        <div className="mt-4">
          <h3 className="font-bold">Status:</h3>
          <p>{status}</p>
        </div>
      )}

      {result && (
        <div className="mt-4">
          <h3 className="font-bold">Result:</h3>
          <pre className="bg-gray-100 p-4 rounded">{result}</pre>
        </div>
      )}
    </div>
  );
}
