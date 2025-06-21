import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { instanceToPlain } from 'class-transformer';
import { EligibilityCheckRequest } from '../request/EligibilityCheckRequest';
import { EligibilityCheckResponse } from '../response/EligibilityCheckResponse';

@Injectable()
export class EligibilityClient {
  private readonly apiClient: AxiosInstance;

  constructor() {
    this.apiClient = axios.create({
      baseURL: process.env.ELIGIBILITY_API_URL || 'http://localhost:3000',
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 5000,
    });
  }

  async checkEligibility(
    payerId: string,
    memberId: string,
    dateOfBirth: string,
  ): Promise<boolean | 'N/A'> {
    const request = new EligibilityCheckRequest();
    request.payer_id = payerId;
    request.member_id = memberId;
    request.date_of_birth = dateOfBirth;

    const requestBody = instanceToPlain(request);

    const response = await this.apiClient.post<EligibilityCheckResponse>(
      '/check',
      requestBody,
    );

    return response.data.eligible;
  }
}
