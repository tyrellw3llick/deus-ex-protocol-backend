import { BASE_CONTEXT } from '../config/llm_instructions/baseInstructions.js';
import { DEUS_EX_MACHINA } from '../config/llm_instructions/machinaInstructions.js';
import { AiName } from '../types/ai.types.js';

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
}
