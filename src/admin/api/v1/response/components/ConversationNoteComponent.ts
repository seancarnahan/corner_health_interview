import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { ConversationCreatorComponent } from './ConversationCreatorComponent';

export class ConversationNoteComponent {
  @ApiProperty()
  @Expose()
  id: string;

  @ApiProperty()
  @Expose()
  content: string;

  @ApiProperty()
  @Expose()
  createdAt: string;

  @ApiProperty({ type: ConversationCreatorComponent })
  @Expose()
  @Type(() => ConversationCreatorComponent)
  creator: ConversationCreatorComponent;
}
