import { useForm } from "react-hook-form";
import { generateBinaryInput } from "../utils/jobMatchingUtils";

interface JobMatchingFormProps {
  role: "Garbler" | "Evaluator";
  onSubmit: (binaryInput: string) => void;
  disabled?: boolean;
}

export default function JobMatchingForm({
  role,
  onSubmit,
  disabled,
}: JobMatchingFormProps) {
  // Evaluator = Candidate, Garbler = Recruiter
  const { register, handleSubmit } = useForm({
    defaultValues: {
      education: role === "Evaluator" ? 2 : 1,
      experience: role === "Evaluator" ? 5 : 1,
      interestZk: true,
      interestDefi: role === "Evaluator",
      interestConsumer: role === "Evaluator",
      interestInfra: role === "Evaluator",
      salary: role === "Evaluator" ? 10 : 100,
      stageGrant: true,
      stageSeed: role === "Evaluator",
      stageSeriesA: role === "Evaluator",
      stageSeriesB: role === "Evaluator",
      partTime: false,
    },
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmitForm = (data: any) => {
    const binaryInput = generateBinaryInput({
      isRecruiter: role === "Garbler",
      commitment: data.partTime,
      education: parseInt(data.education),
      experience: parseInt(data.experience),
      interests: [
        data.interestZk,
        data.interestDefi,
        data.interestConsumer,
        data.interestInfra,
      ],
      companyStage: [
        data.stageGrant,
        data.stageSeed,
        data.stageSeriesA,
        data.stageSeriesB,
      ],
      salary: data.salary,
    });

    onSubmit(binaryInput);
  };

  return (
    <form onSubmit={handleSubmit(onSubmitForm)} className="p-4">
      <h2 className="text-xl font-bold mb-4">
        {role === "Garbler" ? "Recruiter Form" : "Candidate Form"}
      </h2>

      {/* Education */}
      <div className="mb-4">
        <label className="block mb-2">
          {" "}
          {role === "Evaluator"
            ? "Education level"
            : "Required education level"}
        </label>
        <select
          {...register("education")}
          className="w-full p-2 border rounded"
        >
          <option value="1">High School</option>
          <option value="2">Bachelor Degree</option>
          <option value="3">Master Degree</option>
          <option value="4">PhD</option>
        </select>
      </div>

      {/* Experience */}
      <div className="mb-4">
        <label className="block mb-2">
          {" "}
          {role === "Evaluator"
            ? "Years of experience"
            : "Required years of experience"}
        </label>
        <input
          type="number"
          min="1"
          max="8"
          {...register("experience")}
          className="w-full p-2 border rounded"
        />
      </div>

      {/* Interests or Job Preferences */}
      <div className="mb-4">
        <label className="block mb-2">
          {role === "Evaluator" ? "Sectors of interest" : "Sectors of job"}
        </label>
        <div className="grid grid-cols-2 gap-2">
          <label>
            <input type="checkbox" {...register("interestZk")} /> ZK/MPC
          </label>
          <label>
            <input type="checkbox" {...register("interestDefi")} /> DeFi
          </label>
          <label>
            <input type="checkbox" {...register("interestConsumer")} /> Consumer
          </label>
          <label>
            <input type="checkbox" {...register("interestInfra")} />{" "}
            Infrastructure
          </label>
        </div>
      </div>

      {/* Company Stage */}
      <div className="mb-4">
        <label className="block mb-2">Company Stage</label>
        <div className="grid grid-cols-2 gap-2">
          <label>
            <input type="checkbox" {...register("stageGrant")} /> Grant
          </label>
          <label>
            <input type="checkbox" {...register("stageSeed")} /> Seed
          </label>
          <label>
            <input type="checkbox" {...register("stageSeriesA")} /> Series A
          </label>
          <label>
            <input type="checkbox" {...register("stageSeriesB")} /> Series B+
          </label>
        </div>
      </div>

      {/* Part Time */}
      <div className="mb-4">
        <label>
          <input type="checkbox" {...register("partTime")} />
          {role === "Garbler"
            ? " This is a part-time contract"
            : " Open to part-time roles"}
        </label>
      </div>

      {/* Salary */}
      <div className="mb-4">
        <label className="block mb-2">
          {role === "Garbler"
            ? "Maximum Salary (thousands)"
            : "Minimum Salary (thousands)"}
        </label>
        <input
          type="number"
          min="0"
          max="750"
          {...register("salary")}
          className="w-full p-2 border rounded"
        />
      </div>

      <button
        type="submit"
        className={`px-4 py-2 rounded ${
          disabled
            ? "bg-gray-500 text-gray-300 cursor-not-allowed"
            : "bg-blue-500 text-white hover:bg-blue-600"
        }`}
        disabled={disabled}
      >
        Submit
      </button>
    </form>
  );
}
