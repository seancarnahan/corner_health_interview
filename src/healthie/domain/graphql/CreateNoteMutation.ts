export const CreateNoteMutation = `
  mutation CreateNote($userId: String, $content: String, $conversationId: String) {
    createNote(input: {
      user_id: $userId,
      content: $content,
      conversation_id: $conversationId
    }) {
      note {
        id
        content
        user_id
      }
      messages {
        field
        message
      }
    }
  }
`;
