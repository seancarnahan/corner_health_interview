import { Test, TestingModule } from '@nestjs/testing';
import { HealthieService } from './HealthieService';
import { HealthieAppointmentDetails } from '../domain/models/HealthieAppointmentDetails';
import { HEALTHIE_API_CLIENT } from '../const/injection-tokens';
import { AxiosInstance } from 'axios';

describe(HealthieService.name, () => {
  let service: HealthieService;
  let mockAxiosInstance: jest.Mocked<AxiosInstance>;

  const mockAppointmentId = 'appointment-123';
  const mockGraphQLResponse = {
    data: {
      data: {
        appointment: {
          id: 'appointment-123',
          date: '2024-01-15T10:00:00Z',
          contact_type: 'in_person',
          location: 'Main Clinic',
          provider: {
            id: 'provider-456',
            full_name: 'Dr. Jane Smith',
            email: 'jane.smith@clinic.com',
            phone_number: '+1234567890',
          },
          user: {
            id: 'user-789',
            full_name: 'John Doe',
            first_name: 'John',
            last_name: 'Doe',
            email: 'john.doe@email.com',
            phone_number: '+0987654321',
            dob: '1990-01-01',
            gender: 'male',
            location: {
              id: 'location-001',
              line1: '123 Main St',
              line2: 'Apt 4B',
              city: 'New York',
              state: 'NY',
              zip: '10001',
              country: 'USA',
            },
            policies: [
              {
                id: 'policy-111',
                priority_type: 'primary',
                num: 'POL123456',
                group_num: 'GRP789',
                holder_relationship: 'self',
                insurance_plan: {
                  id: 'plan-222',
                  payer_id: 'BCBS',
                  payer_name: 'Blue Cross Blue Shield',
                },
              },
              {
                id: 'policy-333',
                priority_type: 'secondary',
                num: 'POL789012',
                group_num: 'GRP456',
                holder_relationship: 'spouse',
                insurance_plan: {
                  id: 'plan-444',
                  payer_id: 'AETNA',
                  payer_name: 'Aetna',
                },
              },
            ],
          },
        },
      },
    },
  };

  beforeEach(async () => {
    mockAxiosInstance = {
      post: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HealthieService,
        {
          provide: HEALTHIE_API_CLIENT,
          useValue: mockAxiosInstance,
        },
      ],
    }).compile();

    service = module.get<HealthieService>(HealthieService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe(
    HealthieService.prototype.getAppointmentWithPatientAndInsurance.name,
    () => {
      it('should successfully fetch and map appointment details', async () => {
        mockAxiosInstance.post.mockResolvedValueOnce(mockGraphQLResponse);

        const result =
          await service.getAppointmentWithPatientAndInsurance(
            mockAppointmentId,
          );

        expect(result).toBeInstanceOf(HealthieAppointmentDetails);
        expect(result.appointment).toBeDefined();
        expect(result.appointment.id).toBe('appointment-123');
        expect(result.appointment.date).toBe('2024-01-15T10:00:00Z');
        expect(result.appointment.contactType).toBe('in_person');
        expect(result.appointment.location).toBe('Main Clinic');
        expect(result.appointment.provider).toBeDefined();
        expect(result.appointment.provider.id).toBe('provider-456');
        expect(result.appointment.provider.fullName).toBe('Dr. Jane Smith');
        expect(result.appointment.provider.email).toBe('jane.smith@clinic.com');
        expect(result.appointment.provider.phoneNumber).toBe('+1234567890');
        expect(result.patient).toBeDefined();
        expect(result.patient.id).toBe('user-789');
        expect(result.patient.fullName).toBe('John Doe');
        expect(result.patient.firstName).toBe('John');
        expect(result.patient.lastName).toBe('Doe');
        expect(result.patient.email).toBe('john.doe@email.com');
        expect(result.patient.phoneNumber).toBe('+0987654321');
        expect(result.patient.dob).toBe('1990-01-01');
        expect(result.patient.gender).toBe('male');
        expect(result.patient.location).toBeDefined();
        expect(result.insurance).toBeDefined();
        expect(result.insurance.policies).toHaveLength(2);
        const firstPolicy = result.insurance.policies[0];
        expect(firstPolicy.id).toBe('policy-111');
        expect(firstPolicy.priorityType).toBe('primary');
        expect(firstPolicy.num).toBe('POL123456');
        expect(firstPolicy.groupNum).toBe('GRP789');
        expect(firstPolicy.holderRelationship).toBe('self');
        expect(firstPolicy.insurancePlan.id).toBe('plan-222');
        expect(firstPolicy.insurancePlan.payerId).toBe('BCBS');
        expect(firstPolicy.insurancePlan.payerName).toBe(
          'Blue Cross Blue Shield',
        );
        const secondPolicy = result.insurance.policies[1];
        expect(secondPolicy.id).toBe('policy-333');
        expect(secondPolicy.priorityType).toBe('secondary');
        expect(secondPolicy.num).toBe('POL789012');
        expect(secondPolicy.groupNum).toBe('GRP456');
        expect(secondPolicy.holderRelationship).toBe('spouse');
        expect(secondPolicy.insurancePlan.id).toBe('plan-444');
        expect(secondPolicy.insurancePlan.payerId).toBe('AETNA');
        expect(secondPolicy.insurancePlan.payerName).toBe('Aetna');
      });

      it('should call axios with correct GraphQL query and variables', async () => {
        mockAxiosInstance.post.mockResolvedValueOnce(mockGraphQLResponse);

        await service.getAppointmentWithPatientAndInsurance(mockAppointmentId);

        expect(mockAxiosInstance.post).toHaveBeenCalledTimes(1);
        expect(mockAxiosInstance.post).toHaveBeenCalledWith(
          '',
          expect.objectContaining({
            variables: { appointmentId: mockAppointmentId },
          }),
        );
      });

      it('should handle appointment with no insurance policies', async () => {
        const responseWithNoPolicies = {
          data: {
            data: {
              appointment: {
                ...mockGraphQLResponse.data.data.appointment,
                user: {
                  ...mockGraphQLResponse.data.data.appointment.user,
                  policies: [],
                },
              },
            },
          },
        };

        mockAxiosInstance.post.mockResolvedValueOnce(responseWithNoPolicies);

        const result =
          await service.getAppointmentWithPatientAndInsurance(
            mockAppointmentId,
          );

        expect(result.insurance.policies).toEqual([]);
      });

      it('should handle null or missing optional fields gracefully', async () => {
        const responseWithNulls = {
          data: {
            data: {
              appointment: {
                ...mockGraphQLResponse.data.data.appointment,
                location: null,
                user: {
                  ...mockGraphQLResponse.data.data.appointment.user,
                  phone_number: null,
                  location: null,
                },
              },
            },
          },
        };

        mockAxiosInstance.post.mockResolvedValueOnce(responseWithNulls);

        const result =
          await service.getAppointmentWithPatientAndInsurance(
            mockAppointmentId,
          );

        expect(result.appointment.location).toBeNull();
        expect(result.patient.phoneNumber).toBeNull();
        expect(result.patient.location).toBeNull();
      });

      it('should throw error when axios request fails', async () => {
        const axiosError = new Error('Network error');
        mockAxiosInstance.post.mockRejectedValueOnce(axiosError);

        await expect(
          service.getAppointmentWithPatientAndInsurance(mockAppointmentId),
        ).rejects.toThrow('Failed to fetch appointment details');
      });

      it('should throw error when GraphQL returns error response', async () => {
        const errorResponse = {
          data: {
            errors: [
              {
                message: 'Appointment not found',
                extensions: { code: 'NOT_FOUND' },
              },
            ],
          },
        };

        mockAxiosInstance.post.mockResolvedValueOnce(errorResponse);

        await expect(
          service.getAppointmentWithPatientAndInsurance(mockAppointmentId),
        ).rejects.toThrow();
      });
    },
  );
});
