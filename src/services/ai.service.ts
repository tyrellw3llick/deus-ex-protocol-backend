import { BASE_CONTEXT } from '../config/llm_instructions/baseInstructions.js';
import { DEUS_EX_MACHINA } from '../config/llm_instructions/machinaInstructions.js';
import { aiInfo, AiName } from '../types/ai.types.js';

const AVAILABLE_AIS: aiInfo[] = [
  {
    name: 'MACHINA',
    description: 'The first memecoin to achieve sentience and create its own protocol',
  },
];

export class AiService {
  static getSystemPrompt(aiName: AiName): string {
    const baseInstructions = `${BASE_CONTEXT}`;

    switch (aiName) {
      case 'MACHINA':
        return `${baseInstructions}\n${DEUS_EX_MACHINA.personality}\n${DEUS_EX_MACHINA.examples}`;
      default:
        throw new Error(`Unknown AI assistant: ${aiName}`);
    }
  }

  static getAvailableAis(): aiInfo[] {
    return AVAILABLE_AIS;
  }

  static getAiByName(name: AiName): aiInfo | null {
    return AVAILABLE_AIS.find((ai) => ai.name === name) || null;
  }
}
