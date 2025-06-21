import { Expose } from 'class-transformer';

export class ConversationCreator {
  @Expose()
  id: string;

  @Expose()
  fullName: string;

  static toModel(data: any): ConversationCreator {
    const creator = new ConversationCreator();
    creator.id = data.id;
    creator.fullName = data.full_name;
    return creator;
  }
}
