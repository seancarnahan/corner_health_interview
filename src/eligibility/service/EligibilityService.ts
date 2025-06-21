import { Injectable } from '@nestjs/common';
import { EligibilityCheckDto } from '../domain/dto/EligibilityCheckDto';

@Injectable()
export class EligibilityService {
  checkEligibility(dto: EligibilityCheckDto): boolean | 'N/A' {
    if (dto.memberId === '') {
      return 'N/A';
    }

    const firstChar = dto.memberId.charAt(0);

    if (/^[a-zA-Z]/.test(firstChar)) {
      return true;
    }

    if (/^[0-9]/.test(firstChar)) {
      return false;
    }

    const hashResult = this.deterministicHash(dto.memberId);
    return hashResult;
  }

  protected deterministicHash(input: string): boolean {
    let hash = 0;
    for (let i = 0; i < input.length; i++) {
      const char = input.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash;
    }

    return Math.abs(hash) % 2 === 0;
  }
}
