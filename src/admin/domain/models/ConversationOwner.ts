import { Expose } from 'class-transformer';

export class ConversationOwner {
  @Expose()
  id: string;

  @Expose()
  fullName: string;

  static toModel(data: any): ConversationOwner {
    const owner = new ConversationOwner();
    owner.id = data.id;
    owner.fullName = data.full_name;
    return owner;
  }
}
