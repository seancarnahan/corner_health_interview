import { Test, TestingModule } from '@nestjs/testing';
import { EligibilityService } from './EligibilityService';
import { EligibilityCheckDto } from '../domain/dto/EligibilityCheckDto';

describe(EligibilityService.name, () => {
  let service: EligibilityService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EligibilityService],
    }).compile();

    service = module.get<EligibilityService>(EligibilityService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe(EligibilityService.prototype.checkEligibility.name, () => {
    it('should return true for member ID starting with letter', () => {
      const testCases = ['ABC12345', 'Z999999', 'a123456', 'Medical123'];

      testCases.forEach((memberId) => {
        const dto: EligibilityCheckDto = {
          payerId: 'BCBS',
          memberId,
          dateOfBirth: '1990-01-01',
        };

        const result = service.checkEligibility(dto);
        expect(result).toBe(true);
      });
    });

    it('should return false for member ID starting with number', () => {
      const testCases = ['12345678', '999ABC', '0123456', '5Medical'];

      testCases.forEach((memberId) => {
        const dto: EligibilityCheckDto = {
          payerId: 'BCBS',
          memberId,
          dateOfBirth: '1990-01-01',
        };

        const result = service.checkEligibility(dto);
        expect(result).toBe(false);
      });
    });

    it('should return N/A for empty member ID', () => {
      const dto: EligibilityCheckDto = {
        payerId: 'BCBS',
        memberId: '',
        dateOfBirth: '1990-01-01',
      };

      const result = service.checkEligibility(dto);
      expect(result).toBe('N/A');
    });

    it('should use deterministic hash for special character starting member IDs', () => {
      const testCases = ['#123456', '@ABC123', '*Medical', '!999999'];

      testCases.forEach((memberId) => {
        const dto: EligibilityCheckDto = {
          payerId: 'BCBS',
          memberId,
          dateOfBirth: '1990-01-01',
        };

        const result1 = service.checkEligibility(dto);
        const result2 = service.checkEligibility(dto);
        expect(result1).toBe(result2);
        expect(typeof result1).toBe('boolean');
      });
    });
  });
});
