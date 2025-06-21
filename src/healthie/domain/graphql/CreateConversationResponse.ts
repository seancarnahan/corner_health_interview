export interface CreateConversationResponse {
  data: {
    createConversation: {
      conversation: {
        id: string;
      };
      messages: Array<{
        field: string;
        message: string;
      }>;
    };
  };
  errors?: Array<{
    message: string;
  }>;
}
