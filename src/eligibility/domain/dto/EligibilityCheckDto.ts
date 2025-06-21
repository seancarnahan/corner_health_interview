import { Expose } from 'class-transformer';

export class EligibilityCheckDto {
  @Expose()
  payerId: string;

  @Expose()
  memberId: string;

  @Expose()
  dateOfBirth: string;
}
