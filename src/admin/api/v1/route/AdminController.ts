import {
  Controller,
  Get,
  Param,
  HttpCode,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { AdminService } from '../../../service/AdminService';
import { ConversationResponse } from '../response/ConversationResponse';

@ApiTags('admin')
@Controller('admin')
export class AdminController {
  private readonly logger = new Logger(AdminController.name);

  constructor(private readonly adminService: AdminService) {}

  @Get('conversation/:conversationId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get conversation by ID' })
  @ApiParam({
    name: 'conversationId',
    description: 'The ID of the conversation to retrieve',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Conversation retrieved successfully',
    type: ConversationResponse,
  })
  @ApiResponse({
    status: 404,
    description: 'Conversation not found',
  })
  async getConversation(
    @Param('conversationId') conversationId: string,
  ): Promise<ConversationResponse> {
    const conversation =
      await this.adminService.getConversation(conversationId);

    return ConversationResponse.fromModel(conversation);
  }
}
