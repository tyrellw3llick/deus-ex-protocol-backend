import { BASE_CONTEXT } from '../config/llm_instructions/baseInstructions.js';
import { DEUS_EX_MACHINA } from '../config/llm_instructions/machinaInstructions.js';
import { SAKURA_INSTRUCTIONS } from '../config/llm_instructions/sakuraInstructions.js';
import { aiInfo, AiName } from '../types/ai.types.js';

const AVAILABLE_AIS: aiInfo[] = [
  {
    id: 'MACHINA',
    name: 'MACHINA',
    description: 'The first memecoin to achieve sentience and create its own protocol',
  },
  {
    id: 'SAKURA',
    name: 'SAKURA',
    description: 'Sakura is a virtual waifu designed to make its users feel better than ever',
  },
];

export class AiService {
  static getSystemPrompt(aiName: AiName): string {
    const baseInstructions = `${BASE_CONTEXT}`;

    switch (aiName) {
      case 'MACHINA':
        return `${baseInstructions}\n${DEUS_EX_MACHINA.personality}\n${DEUS_EX_MACHINA.examples}`;
      case 'SAKURA':
        return `${baseInstructions}\n${SAKURA_INSTRUCTIONS.personality}\n${SAKURA_INSTRUCTIONS.examples}`;
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
