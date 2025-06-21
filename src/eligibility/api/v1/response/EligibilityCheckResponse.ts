import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class EligibilityCheckResponse {
  @ApiProperty({
    description: 'Eligibility status',
    example: true,
    enum: [true, false, 'N/A'],
  })
  @Expose()
  eligible: boolean | 'N/A';
}
