import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class ConversationOwnerComponent {
  @ApiProperty()
  @Expose()
  id: string;

  @ApiProperty()
  @Expose()
  fullName: string;
}
