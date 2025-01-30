export type AiName = 'MACHINA' | 'SAKURA';

export interface AiInstructions {
  personality: string;
  examples?: string;
}

export interface aiInfo {
  id: string;
  name: AiName;
  description: string;
}
