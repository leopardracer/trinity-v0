export const convertToBinary = (num: number, bits: number): string => {
  let binary = "";
  for (let i = bits - 1; i >= 0; i--) {
    binary += num & (1 << i) ? "1" : "0";
  }
  return binary;
};

export const convertToVector = (
  num: number,
  bits: number,
  isRecruiter: boolean
): string => {
  if (num > bits) {
    throw new Error("Number of ones cannot be greater than the number of bits");
  }

  console.log(num, bits, isRecruiter);

  const vector = Array(bits).fill("0");
  if (!isRecruiter) {
    for (let i = 0; i < num; i++) {
      vector[i] = "1";
    }
  } else {
    for (let i = 0; i < bits - num + 1; i++) {
      vector[bits - 1 - i] = "1";
    }
  }

  return vector.join("");
};

export const generateBinaryInput = (data: {
  isRecruiter: boolean;
  commitment: boolean;
  education: number;
  experience: number;
  interests: boolean[];
  companyStage: boolean[];
  salary: number;
}): string => {
  console.log(data);
  const parts = [
    data.isRecruiter ? "1" : "0", // Position bit (0)
    data.commitment ? "1" : "0", // Commitment bit (1)
    convertToVector(data.education, 4, data.isRecruiter), // Education bits (2-5)
    convertToVector(data.experience, 8, data.isRecruiter), // Experience bits (6-13)
    data.interests.map((i) => (i ? "1" : "0")).join(""), // Interest bits (14-17)
    data.companyStage.map((s) => (s ? "1" : "0")).join(""), // Company stage bits (18-21)
    convertToBinary(Math.min(data.salary, 255), 8), // Salary bits (22-29)
  ];

  console.log(parts);
  console.log(parts.join("").length);

  return parts.join("");
};
