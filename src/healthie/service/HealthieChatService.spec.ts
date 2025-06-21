import { Test, TestingModule } from '@nestjs/testing';
import { HealthieChatService } from './HealthieChatService';
import { HEALTHIE_API_CLIENT } from '../const/injection-tokens';
import { AxiosInstance } from 'axios';
import { CreateConversationResponse } from '../domain/graphql/CreateConversationResponse';
import { CreateNoteResponse } from '../domain/graphql/CreateNoteResponse';

class TestableHealthieChatService extends HealthieChatService {
  public async createConversation(providerId: string): Promise<string> {
    return super.createConversation(providerId);
  }

  public async sendMessage(
    conversationId: string,
    content: string,
  ): Promise<void> {
    return super.sendMessage(conversationId, content);
  }
}

describe(HealthieChatService.name, () => {
  let service: HealthieChatService;
  let testableService: TestableHealthieChatService;
  let apiClient: jest.Mocked<AxiosInstance>;

  beforeEach(async () => {
    const mockApiClient = {
      post: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HealthieChatService,
        TestableHealthieChatService,
        {
          provide: HEALTHIE_API_CLIENT,
          useValue: mockApiClient,
        },
      ],
    }).compile();

    service = module.get<HealthieChatService>(HealthieChatService);
    testableService = module.get<TestableHealthieChatService>(
      TestableHealthieChatService,
    );
    apiClient = module.get(HEALTHIE_API_CLIENT);
  });

  describe(
    TestableHealthieChatService.prototype.sendMessageToProvider.name,
    () => {
      const providerId = 'provider-123';
      const message = 'Test eligibility message';
      const conversationId = 'conversation-456';

      it('should successfully send message to provider', async () => {
        const createConversationResponse: CreateConversationResponse = {
          data: {
            createConversation: {
              conversation: {
                id: conversationId,
              },
              messages: [],
            },
          },
        };

        const createNoteResponse: CreateNoteResponse = {
          data: {
            createNote: {
              note: {
                id: 'note-789',
                content: message,
                user_id: 'user-123',
              },
              messages: [],
            },
          },
        };

        apiClient.post
          .mockResolvedValueOnce({ data: createConversationResponse })
          .mockResolvedValueOnce({ data: createNoteResponse });

        await service.sendMessageToProvider(providerId, message);

        expect(apiClient.post).toHaveBeenCalledTimes(2);
        expect(apiClient.post).toHaveBeenNthCalledWith(1, '', {
          query: expect.stringContaining('mutation CreateConversation'),
          variables: {
            ownerId: providerId,
            name: 'Insurance Eligibility Update',
          },
        });
        expect(apiClient.post).toHaveBeenNthCalledWith(2, '', {
          query: expect.stringContaining('mutation CreateNote'),
          variables: {
            userId: null,
            content: message,
            conversationId,
          },
        });
      });

      it('should throw error when conversation creation fails with errors', async () => {
        const errorResponse: CreateConversationResponse = {
          data: {
            createConversation: {
              conversation: {
                id: '',
              },
              messages: [],
            },
          },
          errors: [
            {
              message: 'Failed to create conversation',
            },
          ],
        };

        apiClient.post.mockResolvedValueOnce({ data: errorResponse });

        await expect(
          service.sendMessageToProvider(providerId, message),
        ).rejects.toThrow('Failed to send message to provider');

        expect(apiClient.post).toHaveBeenCalledTimes(1);
      });

      it('should throw error when message sending request fails', async () => {
        const createConversationResponse: CreateConversationResponse = {
          data: {
            createConversation: {
              conversation: {
                id: conversationId,
              },
              messages: [],
            },
          },
        };

        apiClient.post
          .mockResolvedValueOnce({ data: createConversationResponse })
          .mockRejectedValueOnce(new Error('Network error'));

        await expect(
          service.sendMessageToProvider(providerId, message),
        ).rejects.toThrow('Failed to send message to provider');

        expect(apiClient.post).toHaveBeenCalledTimes(2);
      });
    },
  );

  describe(
    TestableHealthieChatService.prototype.createConversation.name,
    () => {
      const providerId = 'provider-123';
      const conversationId = 'conversation-456';

      it('should successfully create a conversation', async () => {
        const response: CreateConversationResponse = {
          data: {
            createConversation: {
              conversation: {
                id: conversationId,
              },
              messages: [],
            },
          },
        };

        apiClient.post.mockResolvedValueOnce({ data: response });

        const result = await testableService.createConversation(providerId);

        expect(result).toBe(conversationId);
        expect(apiClient.post).toHaveBeenCalledWith('', {
          query: expect.stringContaining('mutation CreateConversation'),
          variables: {
            ownerId: providerId,
            name: 'Insurance Eligibility Update',
          },
        });
      });

      it('should throw error when API returns errors', async () => {
        const response: CreateConversationResponse = {
          data: {
            createConversation: {
              conversation: {
                id: '',
              },
              messages: [],
            },
          },
          errors: [
            {
              message: 'Invalid provider ID',
            },
          ],
        };

        apiClient.post.mockResolvedValueOnce({ data: response });

        await expect(
          testableService.createConversation(providerId),
        ).rejects.toThrow(
          'Failed to create conversation: [{"message":"Invalid provider ID"}]',
        );
      });

      it('should throw error when request fails', async () => {
        apiClient.post.mockRejectedValueOnce(new Error('Network timeout'));

        await expect(
          testableService.createConversation(providerId),
        ).rejects.toThrow('Network timeout');
      });
    },
  );

  describe(TestableHealthieChatService.prototype.sendMessage.name, () => {
    const conversationId = 'conversation-456';
    const message = 'Test message content';

    it('should successfully send a message', async () => {
      const response: CreateNoteResponse = {
        data: {
          createNote: {
            note: {
              id: 'note-789',
              content: message,
              user_id: 'user-123',
            },
            messages: [],
          },
        },
      };

      apiClient.post.mockResolvedValueOnce({ data: response });

      await testableService.sendMessage(conversationId, message);

      expect(apiClient.post).toHaveBeenCalledWith('', {
        query: expect.stringContaining('mutation CreateNote'),
        variables: {
          userId: null,
          content: message,
          conversationId,
        },
      });
    });

    it('should throw error when API returns errors', async () => {
      const response: CreateNoteResponse = {
        data: {
          createNote: {
            note: {
              id: '',
              content: '',
              user_id: '',
            },
            messages: [],
          },
        },
        errors: [
          {
            message: 'Invalid conversation ID',
          },
        ],
      };

      apiClient.post.mockResolvedValueOnce({ data: response });

      await expect(
        testableService.sendMessage(conversationId, message),
      ).rejects.toThrow(
        'Failed to send message: [{"message":"Invalid conversation ID"}]',
      );
    });
  });
});
