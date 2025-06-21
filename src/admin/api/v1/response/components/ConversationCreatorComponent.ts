import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class ConversationCreatorComponent {
  @ApiProperty()
  @Expose()
  id: string;

  @ApiProperty()
  @Expose()
  fullName: string;
}
