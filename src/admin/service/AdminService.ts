import { Injectable, Logger, Inject } from '@nestjs/common';
import { AxiosInstance } from 'axios';
import { ConversationDetails } from '../domain/models/ConversationDetails';
import { GetConversationQuery } from '../domain/graphql/GetConversationQuery';
import { GetConversationResponse } from '../domain/graphql/GetConversationResponse';
import { HEALTHIE_API_CLIENT } from '../../healthie/const/injection-tokens';

@Injectable()
export class AdminService {
  private readonly logger = new Logger(AdminService.name);

  constructor(
    @Inject(HEALTHIE_API_CLIENT) private readonly apiClient: AxiosInstance,
  ) {}

  async getConversation(conversationId: string): Promise<ConversationDetails> {
    try {
      const response = await this.apiClient.post<GetConversationResponse>('', {
        query: GetConversationQuery,
        variables: { id: conversationId },
      });

      const result = ConversationDetails.toModel(response.data.data);

      this.logger.log(
        `Successfully fetched conversation details for ID: ${conversationId}`,
      );
      return result;
    } catch (error) {
      this.logger.error(
        `Failed to fetch conversation details for ID: ${conversationId}`,
        error,
      );
      throw new Error(`Failed to fetch conversation details`);
    }
  }
}
