import { DEUS_EX_KNOWLEDGE, DEUS_EX_RULES } from '../config/llm_instructions/baseInstructions.js';
import { DEUS_EX_MACHINA } from '../config/llm_instructions/machinaInstructions.js';
import { AiName } from '../types/ai.types.js';

export class AiService {
  static getSystemPrompt(aiName: AiName): string {
    const baseInstructions = `${DEUS_EX_KNOWLEDGE}\n${DEUS_EX_RULES}`;

    switch (aiName) {
      case 'MACHINA':
        return `${baseInstructions}\n${DEUS_EX_MACHINA.personality}\n${DEUS_EX_MACHINA.examples}`;
      default:
        throw new Error(`Unknown AI assistant: ${aiName}`);
    }
  }
}
