export interface CreateNoteResponse {
  data: {
    createNote: {
      note: {
        id: string;
        content: string;
        user_id: string;
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
