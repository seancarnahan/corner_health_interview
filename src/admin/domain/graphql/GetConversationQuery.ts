export const GetConversationQuery = `
  query GetConversation($id: ID!) {
    conversation(id: $id) {
      id
      name
      conversation_memberships_count
      owner {
        id
        full_name
      }
      notes {
        id
        content
        created_at
        creator {
          id
          full_name
        }
      }
    }
  }
`;
