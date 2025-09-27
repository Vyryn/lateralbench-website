export type RawModelResult = {
  name: string;
  raw_accuracy?: number;
  accuracy: number;
  stderr: number;
  input_tokens?: number;
  output_tokens?: number;
  nominal_price?: number; // dollars
  nominal_cost?: number; // cents
  input_rate?: number;
  output_rate?: number;
  errors?: number;
};

export type ModelResult = RawModelResult & {
  nominalCost: number | null; // cents
};

export type IntegrityInfo = {
  generatedAt?: string;
  files: Record<string, string>;
};