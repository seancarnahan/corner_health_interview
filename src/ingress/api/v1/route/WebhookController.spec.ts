import { Test, TestingModule } from '@nestjs/testing';
import { WebhookController } from './WebhookController';
import { WebhookProcessorService } from '../../../service/WebhookProcessorService';
import { WebhookRequest } from '../request/WebhookRequest';

const mockResourceId = 'appointment-123';
const mockResourceIdType = 'Appointment';
const mockEventType = 'appointment.created';

const validWebhookRequest: WebhookRequest = {
  resourceId: mockResourceId,
  resourceIdType: mockResourceIdType,
  eventType: mockEventType,
};

describe(WebhookController.name, () => {
  let controller: WebhookController;
  let webhookProcessorService: jest.Mocked<WebhookProcessorService>;

  beforeEach(async () => {
    const mockWebhookProcessorService = {
      process: jest.fn().mockResolvedValue(undefined),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [WebhookController],
      providers: [
        {
          provide: WebhookProcessorService,
          useValue: mockWebhookProcessorService,
        },
      ],
    }).compile();

    controller = module.get<WebhookController>(WebhookController);
    webhookProcessorService = module.get(WebhookProcessorService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe(WebhookController.prototype.handleWebhook.name, () => {
    it('should process valid webhook request and return void', () => {
      const result = controller.handleWebhook(validWebhookRequest);
      const processSpy = webhookProcessorService.process;

      expect(result).toBeUndefined();
      expect(processSpy).toHaveBeenCalledTimes(1);
      expect(processSpy).toHaveBeenCalledWith({
        resourceId: mockResourceId,
        resourceIdType: mockResourceIdType,
        eventType: mockEventType,
      });
    });

    it('should handle processor errors without throwing', async () => {
      const error = new Error('Processing failed');
      const processSpy = webhookProcessorService.process;
      processSpy.mockRejectedValueOnce(error);

      const loggerSpy = jest
        .spyOn(controller['logger'], 'error')
        .mockImplementation();

      expect(() => controller.handleWebhook(validWebhookRequest)).not.toThrow();

      await new Promise((resolve) => setTimeout(resolve, 10));

      expect(loggerSpy).toHaveBeenCalledWith(
        expect.stringContaining('Failed to process webhook'),
      );

      loggerSpy.mockRestore();
    });
  });
});
