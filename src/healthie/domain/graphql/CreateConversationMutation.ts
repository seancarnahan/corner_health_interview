export const CreateConversationMutation = `
  mutation CreateConversation($ownerId: ID, $name: String) {
    createConversation(input: {
      owner_id: $ownerId,
      name: $name
    }) {
      conversation {
        id
      }
      messages {
        field
        message
      }
    }
  }
`;
