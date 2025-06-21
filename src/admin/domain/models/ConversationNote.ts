import { Expose } from 'class-transformer';
import { ConversationCreator } from './ConversationCreator';

export class ConversationNote {
  @Expose()
  id: string;

  @Expose()
  content: string;

  @Expose()
  createdAt: string;

  @Expose()
  creator: ConversationCreator;

  static toModel(data: any): ConversationNote {
    const note = new ConversationNote();
    note.id = data.id;
    note.content = data.content;
    note.createdAt = data.created_at;
    note.creator = ConversationCreator.toModel(data.creator);
    return note;
  }
}
