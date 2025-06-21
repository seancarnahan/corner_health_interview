import { Injectable, Logger, Inject } from '@nestjs/common';
import { AxiosInstance } from 'axios';
import { HealthieAppointmentDetails } from '../domain/models/HealthieAppointmentDetails';
import { GetAppointmentWithPatientAndInsuranceQuery } from '../domain/graphql/GetAppointmentWithPatientAndInsuranceQuery';
import { GetAppointmentWithPatientAndInsuranceResponse } from '../domain/graphql/GetAppointmentWithPatientAndInsuranceResponse';
import { HEALTHIE_API_CLIENT } from '../const/injection-tokens';

@Injectable()
export class HealthieService {
  private readonly logger = new Logger(HealthieService.name);

  constructor(
    @Inject(HEALTHIE_API_CLIENT) private readonly apiClient: AxiosInstance,
  ) {}

  async getAppointmentWithPatientAndInsurance(
    appointmentId: string,
  ): Promise<HealthieAppointmentDetails> {
    try {
      const response =
        await this.apiClient.post<GetAppointmentWithPatientAndInsuranceResponse>(
          '',
          {
            query: GetAppointmentWithPatientAndInsuranceQuery,
            variables: { appointmentId },
          },
        );

      const result = HealthieAppointmentDetails.toModel(response.data.data);

      this.logger.log(
        `Successfully fetched appointment details for ID: ${appointmentId}`,
      );
      return result;
    } catch (error) {
      this.logger.error(
        `Failed to fetch appointment details for ID: ${appointmentId}`,
        error,
      );
      throw new Error(`Failed to fetch appointment details`);
    }
  }
}
