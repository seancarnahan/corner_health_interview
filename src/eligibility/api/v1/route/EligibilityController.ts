import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { EligibilityCheckRequest } from '../request/EligibilityCheckRequest';
import { EligibilityCheckResponse } from '../response/EligibilityCheckResponse';
import { EligibilityService } from '../../../service/EligibilityService';

@ApiTags('eligibility')
@Controller('check')
export class EligibilityController {
  constructor(private readonly eligibilityService: EligibilityService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Check insurance eligibility' })
  @ApiResponse({
    status: 200,
    description: 'Eligibility check completed successfully',
    type: EligibilityCheckResponse,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid request payload',
  })
  checkEligibility(
    @Body() request: EligibilityCheckRequest,
  ): EligibilityCheckResponse {
    const dto = EligibilityCheckRequest.toDto(request);
    const eligibilityResult = this.eligibilityService.checkEligibility(dto);

    const response = new EligibilityCheckResponse();
    response.eligible = eligibilityResult;
    return response;
  }
}
