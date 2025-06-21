import { Test, TestingModule } from '@nestjs/testing';
import { AdminService } from './AdminService';
import { HEALTHIE_API_CLIENT } from '../../healthie/const/injection-tokens';
import { ConversationDetails } from '../domain/models/ConversationDetails';
import { AxiosInstance } from 'axios';

describe(AdminService.name, () => {
  let service: AdminService;
  let mockApiClient: Partial<AxiosInstance>;

  const mockConversationResponse = {
    data: {
      data: {
        conversation: {
          id: 'conv-123',
          name: 'Test Conversation',
          conversation_memberships_count: 2,
          owner: {
            id: 'owner-123',
            full_name: 'Dr. Smith',
          },
          notes: [
            {
              id: 'note-1',
              content: 'Initial message',
              created_at: '2023-01-01T00:00:00Z',
              creator: {
                id: 'creator-1',
                full_name: 'Patient Name',
              },
            },
          ],
        },
      },
    },
  };

  beforeEach(async () => {
    mockApiClient = {
      post: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdminService,
        {
          provide: HEALTHIE_API_CLIENT,
          useValue: mockApiClient,
        },
      ],
    }).compile();

    service = module.get<AdminService>(AdminService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe(AdminService.prototype.getConversation.name, () => {
    it('should fetch and transform conversation details successfully', async () => {
      const conversationId = 'conv-123';
      (mockApiClient.post as jest.Mock).mockResolvedValue(
        mockConversationResponse,
      );

      const result = await service.getConversation(conversationId);

      expect(result).toBeInstanceOf(ConversationDetails);
      expect(result.id).toBe('conv-123');
      expect(result.name).toBe('Test Conversation');
      expect(result.conversationMembershipsCount).toBe(2);
      expect(result.owner.id).toBe('owner-123');
      expect(result.owner.fullName).toBe('Dr. Smith');
      expect(result.notes).toHaveLength(1);
      expect(result.notes[0].content).toBe('Initial message');

      expect(mockApiClient.post).toHaveBeenCalledWith('', {
        query: expect.any(String),
        variables: { id: conversationId },
      });
    });

    it('should handle API errors gracefully', async () => {
      const conversationId = 'invalid-id';
      const apiError = new Error('API request failed');
      (mockApiClient.post as jest.Mock).mockRejectedValue(apiError);

      await expect(service.getConversation(conversationId)).rejects.toThrow(
        'Failed to fetch conversation details',
      );

      expect(mockApiClient.post).toHaveBeenCalledWith('', {
        query: expect.any(String),
        variables: { id: conversationId },
      });
    });

    it('should handle empty notes array', async () => {
      const conversationId = 'conv-empty';
      const responseWithEmptyNotes = {
        data: {
          data: {
            conversation: {
              ...mockConversationResponse.data.data.conversation,
              notes: [],
            },
          },
        },
      };
      (mockApiClient.post as jest.Mock).mockResolvedValue(
        responseWithEmptyNotes,
      );

      const result = await service.getConversation(conversationId);

      expect(result.notes).toEqual([]);
    });
  });
});
