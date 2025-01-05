export interface IConversation {
  userId: string;
  title?: string;
  aiName: string;
  lastMessageAt: Date;
  createdAt: Date;
  generateTitle: (firstMessage: string) => string;
}
