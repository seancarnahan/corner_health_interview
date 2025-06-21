import { Expose } from 'class-transformer';
import { ConversationOwner } from './ConversationOwner';
import { ConversationNote } from './ConversationNote';

export class ConversationDetails {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  conversationMembershipsCount: number;

  @Expose()
  owner: ConversationOwner;

  @Expose()
  notes: ConversationNote[];

  static toModel(data: any): ConversationDetails {
    const model = new ConversationDetails();
    model.id = data.conversation.id;
    model.name = data.conversation.name;
    model.conversationMembershipsCount =
      data.conversation.conversation_memberships_count;
    model.owner = ConversationOwner.toModel(data.conversation.owner);
    model.notes = data.conversation.notes.map((note: any) =>
      ConversationNote.toModel(note),
    );
    return model;
  }
}
