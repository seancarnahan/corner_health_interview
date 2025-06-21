import { Test, TestingModule } from '@nestjs/testing';
import { AdminController } from './AdminController';
import { AdminService } from '../../../service/AdminService';
import { ConversationDetails } from '../../../domain/models/ConversationDetails';
import { ConversationResponse } from '../response/ConversationResponse';
import { ConversationOwner } from '../../../domain/models/ConversationOwner';
import { ConversationNote } from '../../../domain/models/ConversationNote';
import { ConversationCreator } from '../../../domain/models/ConversationCreator';

describe(AdminController.name, () => {
  let controller: AdminController;
  let adminService: AdminService;

  const mockAdminService = {
    getConversation: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminController],
      providers: [
        {
          provide: AdminService,
          useValue: mockAdminService,
        },
      ],
    }).compile();

    controller = module.get<AdminController>(AdminController);
    adminService = module.get<AdminService>(AdminService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe(AdminController.prototype.getConversation.name, () => {
    it('should return conversation response for valid conversationId', async () => {
      const conversationId = 'conv-123';

      const mockConversationDetails = new ConversationDetails();
      mockConversationDetails.id = conversationId;
      mockConversationDetails.name = 'Test Conversation';
      mockConversationDetails.conversationMembershipsCount = 2;

      const mockOwner = new ConversationOwner();
      mockOwner.id = 'owner-123';
      mockOwner.fullName = 'Dr. Smith';
      mockConversationDetails.owner = mockOwner;

      const mockNote = new ConversationNote();
      mockNote.id = 'note-1';
      mockNote.content = 'Test message';
      mockNote.createdAt = '2023-01-01T00:00:00Z';

      const mockCreator = new ConversationCreator();
      mockCreator.id = 'creator-1';
      mockCreator.fullName = 'Patient Name';
      mockNote.creator = mockCreator;

      mockConversationDetails.notes = [mockNote];

      mockAdminService.getConversation.mockResolvedValue(
        mockConversationDetails,
      );

      const result = await controller.getConversation(conversationId);

      expect(result).toBeInstanceOf(ConversationResponse);
      expect(result.id).toBe(conversationId);
      expect(result.name).toBe('Test Conversation');
      expect(result.conversationMembershipsCount).toBe(2);
      expect(result.owner.id).toBe('owner-123');
      expect(result.owner.fullName).toBe('Dr. Smith');
      expect(result.notes).toHaveLength(1);
      expect(result.notes[0].content).toBe('Test message');
      expect(adminService.getConversation).toHaveBeenCalledWith(conversationId);
      expect(adminService.getConversation).toHaveBeenCalledTimes(1);
    });
  });
});
