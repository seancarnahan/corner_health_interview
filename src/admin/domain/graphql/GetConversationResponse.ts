export interface GetConversationResponse {
  data: {
    conversation: {
      id: string;
      name: string;
      conversation_memberships_count: number;
      owner: {
        id: string;
        full_name: string;
      };
      notes: Array<{
        id: string;
        content: string;
        created_at: string;
        creator: {
          id: string;
          full_name: string;
        };
      }>;
    };
  };
}
