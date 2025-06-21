import { Test, TestingModule } from '@nestjs/testing';
import { WebhookProcessorService } from './WebhookProcessorService';
import { WebhookEventDto } from '../domain/dto/WebhookEventDto';
import { WebhookEvent } from '../domain/interface/WebhookEvent';

const mockResourceId = 'appointment-123';
const mockResourceIdType = 'Appointment';
const mockEventType = 'appointment.created';

const createAppointmentDto: WebhookEventDto = {
  resourceId: mockResourceId,
  resourceIdType: mockResourceIdType,
  eventType: mockEventType,
};

const invalidDto: WebhookEventDto = {
  resourceId: 'patient-789',
  resourceIdType: 'Patient',
  eventType: 'patient.created',
};

describe(WebhookProcessorService.name, () => {
  let service: WebhookProcessorService;
  let mockWebhookEvents: WebhookEvent[];

  beforeEach(async () => {
    mockWebhookEvents = [
      {
        eventType: 'appointment.created',
        validate: jest
          .fn()
          .mockImplementation(
            (dto: WebhookEventDto) =>
              dto.eventType === 'appointment.created' &&
              dto.resourceIdType === 'Appointment',
          ),
        process: jest.fn().mockResolvedValue(undefined),
      },
      {
        eventType: 'appointment.updated',
        validate: jest
          .fn()
          .mockImplementation(
            (dto: WebhookEventDto) =>
              dto.eventType === 'appointment.updated' &&
              dto.resourceIdType === 'Appointment',
          ),
        process: jest.fn().mockResolvedValue(undefined),
      },
    ];

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WebhookProcessorService,
        {
          provide: 'WEBHOOK_EVENTS',
          useValue: mockWebhookEvents,
        },
      ],
    }).compile();

    service = module.get<WebhookProcessorService>(WebhookProcessorService);

    service.onModuleInit();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe(WebhookProcessorService.prototype.process.name, () => {
    it('should process valid appointment.created webhook', async () => {
      await service.process(createAppointmentDto);

      expect(mockWebhookEvents[0].validate).toHaveBeenCalledWith(
        createAppointmentDto,
      );
      expect(mockWebhookEvents[0].process).toHaveBeenCalledWith(
        createAppointmentDto,
      );
      expect(mockWebhookEvents[1].validate).not.toHaveBeenCalled();
      expect(mockWebhookEvents[1].process).not.toHaveBeenCalled();
    });

    it('should throw error for unsupported webhook event type', async () => {
      await expect(service.process(invalidDto)).rejects.toThrow(
        'Unsupported webhook event type: patient.created',
      );

      expect(mockWebhookEvents[0].validate).toHaveBeenCalledWith(invalidDto);
      expect(mockWebhookEvents[1].validate).toHaveBeenCalledWith(invalidDto);
      expect(mockWebhookEvents[0].process).not.toHaveBeenCalled();
      expect(mockWebhookEvents[1].process).not.toHaveBeenCalled();
    });

    it('should handle processor errors and propagate them', async () => {
      const processingError = new Error('Processing failed');
      mockWebhookEvents[0].process = jest
        .fn()
        .mockRejectedValue(processingError);

      await expect(service.process(createAppointmentDto)).rejects.toThrow(
        processingError,
      );

      expect(mockWebhookEvents[0].validate).toHaveBeenCalledWith(
        createAppointmentDto,
      );
      expect(mockWebhookEvents[0].process).toHaveBeenCalledWith(
        createAppointmentDto,
      );
    });
  });
});
