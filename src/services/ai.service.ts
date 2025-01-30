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
    try {
      const baseInstructions = `${BASE_CONTEXT}`;
      console.log('Generating prompt for AI:', aiName);

      switch (aiName) {
        case 'MACHINA':
          return `${baseInstructions}\n${DEUS_EX_MACHINA.personality}\n${DEUS_EX_MACHINA.examples}`;
        case 'SAKURA':
          console.log('SAKURA instructions:', SAKURA_INSTRUCTIONS);
          return `${baseInstructions}\n${SAKURA_INSTRUCTIONS.personality}\n${SAKURA_INSTRUCTIONS.examples}`;
        default:
          throw new Error(`Unknown AI assistant: ${aiName}`);
      }
    } catch (error) {
      console.error('Error in getSystemPrompt:', {
        error,
        aiName,
        message: error instanceof Error ? error.message : 'Unknown error',
      });
      throw error;
    }
  }

  static getAvailableAis(): aiInfo[] {
    return AVAILABLE_AIS;
  }

  static getAiByName(name: AiName): aiInfo | null {
    return AVAILABLE_AIS.find((ai) => ai.name === name) || null;
  }
}
