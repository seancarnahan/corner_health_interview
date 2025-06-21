import { Test, TestingModule } from '@nestjs/testing';
import { EligibilityController } from './EligibilityController';
import { EligibilityService } from '../../../service/EligibilityService';
import { EligibilityCheckRequest } from '../request/EligibilityCheckRequest';
import { EligibilityCheckResponse } from '../response/EligibilityCheckResponse';

describe(EligibilityController.name, () => {
  let controller: EligibilityController;
  let eligibilityService: jest.Mocked<EligibilityService>;

  beforeEach(async () => {
    const mockEligibilityService = {
      checkEligibility: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [EligibilityController],
      providers: [
        {
          provide: EligibilityService,
          useValue: mockEligibilityService,
        },
      ],
    }).compile();

    controller = module.get<EligibilityController>(EligibilityController);
    eligibilityService = module.get(EligibilityService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe(EligibilityController.prototype.checkEligibility.name, () => {
    it('should return eligible true for valid request', () => {
      const request: EligibilityCheckRequest = {
        payer_id: 'BCBS',
        member_id: 'ABC12345',
        date_of_birth: '1990-01-01',
      } as EligibilityCheckRequest;

      eligibilityService.checkEligibility.mockReturnValue(true);

      const result = controller.checkEligibility(request);

      expect(result).toBeInstanceOf(EligibilityCheckResponse);
      expect(result.eligible).toBe(true);
      expect(eligibilityService.checkEligibility).toHaveBeenCalledTimes(1);
      expect(eligibilityService.checkEligibility).toHaveBeenCalledWith({
        payerId: 'BCBS',
        memberId: 'ABC12345',
        dateOfBirth: '1990-01-01',
      });
    });
  });
});
