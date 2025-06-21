import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { ConversationDetails } from '../../../domain/models/ConversationDetails';
import { ConversationOwnerComponent } from './components/ConversationOwnerComponent';
import { ConversationNoteComponent } from './components/ConversationNoteComponent';
import { ConversationCreatorComponent } from './components/ConversationCreatorComponent';

export class ConversationResponse {
  @ApiProperty()
  @Expose()
  id: string;

  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty()
  @Expose()
  conversationMembershipsCount: number;

  @ApiProperty({ type: ConversationOwnerComponent })
  @Expose()
  @Type(() => ConversationOwnerComponent)
  owner: ConversationOwnerComponent;

  @ApiProperty({ type: [ConversationNoteComponent] })
  @Expose()
  @Type(() => ConversationNoteComponent)
  notes: ConversationNoteComponent[];

  static fromModel(model: ConversationDetails): ConversationResponse {
    const response = new ConversationResponse();
    response.id = model.id;
    response.name = model.name;
    response.conversationMembershipsCount = model.conversationMembershipsCount;

    response.owner = new ConversationOwnerComponent();
    response.owner.id = model.owner.id;
    response.owner.fullName = model.owner.fullName;

    response.notes = model.notes.map((note) => {
      const noteResponse = new ConversationNoteComponent();
      noteResponse.id = note.id;
      noteResponse.content = note.content;
      noteResponse.createdAt = note.createdAt;

      noteResponse.creator = new ConversationCreatorComponent();
      noteResponse.creator.id = note.creator.id;
      noteResponse.creator.fullName = note.creator.fullName;

      return noteResponse;
    });

    return response;
  }
}
