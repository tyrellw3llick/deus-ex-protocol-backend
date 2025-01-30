export type AiName = 'MACHINA';

export interface AiInstructions {
  personality: string;
  examples?: string;
}

export interface aiInfo {
  name: AiName;
  description: string;
}
