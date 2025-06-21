import { Injectable, Inject, Logger } from '@nestjs/common';
import { AxiosInstance } from 'axios';
import { HEALTHIE_API_CLIENT } from '../const/injection-tokens';
import { CreateConversationMutation } from '../domain/graphql/CreateConversationMutation';
import { CreateConversationResponse } from '../domain/graphql/CreateConversationResponse';
import { CreateNoteMutation } from '../domain/graphql/CreateNoteMutation';
import { CreateNoteResponse } from '../domain/graphql/CreateNoteResponse';

@Injectable()
export class HealthieChatService {
  private readonly logger = new Logger(HealthieChatService.name);

  constructor(
    @Inject(HEALTHIE_API_CLIENT) private readonly apiClient: AxiosInstance,
  ) {}

  async sendMessageToProvider(
    providerId: string,
    message: string,
  ): Promise<void> {
    try {
      const conversationId = await this.createConversation(providerId);

      this.logger.log(`Created conversation with id ${conversationId}`);

      await this.sendMessage(conversationId, message);

      this.logger.log(`Message sent to provider ${providerId}`);
    } catch (error) {
      this.logger.error(`Failed to send message to provider`, error);
      throw new Error('Failed to send message to provider');
    }
  }

  protected async createConversation(providerId: string): Promise<string> {
    const response = await this.apiClient.post<CreateConversationResponse>('', {
      query: CreateConversationMutation,
      variables: {
        ownerId: providerId,
        name: 'Insurance Eligibility Update',
      },
    });

    if (response.data.errors) {
      throw new Error(
        `Failed to create conversation: ${JSON.stringify(response.data.errors)}`,
      );
    }

    return response.data.data.createConversation.conversation.id;
  }

  protected async sendMessage(
    conversationId: string,
    content: string,
  ): Promise<void> {
    const response = await this.apiClient.post<CreateNoteResponse>('', {
      query: CreateNoteMutation,
      variables: {
        userId: null,
        content,
        conversationId,
      },
    });

    if (response.data.errors) {
      throw new Error(
        `Failed to send message: ${JSON.stringify(response.data.errors)}`,
      );
    }
  }
}
