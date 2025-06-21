import { ApiProperty } from '@nestjs/swagger';
import { Expose, plainToInstance } from 'class-transformer';
import { IsString, IsNotEmpty, IsDateString } from 'class-validator';
import { EligibilityCheckDto } from '../../../domain/dto/EligibilityCheckDto';

export class EligibilityCheckRequest {
  @ApiProperty()
  @Expose({ name: 'payerId' })
  @IsString()
  @IsNotEmpty()
  payer_id: string;

  @ApiProperty()
  @Expose({ name: 'memberId' })
  @IsString()
  @IsNotEmpty()
  member_id: string;

  @ApiProperty({
    description: 'Date of birth in YYYY-MM-DD format',
    example: '1990-01-01',
  })
  @Expose({ name: 'dateOfBirth' })
  @IsDateString()
  @IsNotEmpty()
  date_of_birth: string;

  static toDto(request: EligibilityCheckRequest): EligibilityCheckDto {
    return plainToInstance(EligibilityCheckDto, {
      payerId: request.payer_id,
      memberId: request.member_id,
      dateOfBirth: request.date_of_birth,
    });
  }
}
