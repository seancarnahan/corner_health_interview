import { createInsuranceEligibilityMessage } from './createInsuranceEligibilityMessage';
import { Patient } from '../../../healthie/domain/models/Patient';
import { Provider } from '../../../healthie/domain/models/Provider';
import { Appointment } from '../../../healthie/domain/models/Appointment';
import { Policy } from '../../../healthie/domain/models/Policy';
import { InsurancePlan } from '../../../healthie/domain/models/InsurancePlan';

describe('createInsuranceEligibilityMessage', () => {
  let mockPatient: Patient;
  let mockProvider: Provider;
  let mockAppointment: Appointment;
  let mockPolicy: Policy;

  beforeEach(() => {
    mockPatient = new Patient();
    mockPatient.id = 'patient-123';
    mockPatient.fullName = 'John Doe';
    mockPatient.firstName = 'John';
    mockPatient.lastName = 'Doe';
    mockPatient.email = 'john.doe@example.com';
    mockPatient.dob = '1990-01-01';

    mockProvider = new Provider();
    mockProvider.id = 'provider-123';
    mockProvider.fullName = 'Dr. Sarah Smith';
    mockProvider.email = 'dr.smith@clinic.com';

    mockAppointment = new Appointment();
    mockAppointment.id = 'appointment-123';
    mockAppointment.date = '2024-03-15T10:00:00Z';
    mockAppointment.contactType = 'office_visit';
    mockAppointment.provider = mockProvider;

    const mockInsurancePlan = new InsurancePlan();
    mockInsurancePlan.id = 'plan-123';
    mockInsurancePlan.payerId = 'payer-123';
    mockInsurancePlan.payerName = 'Blue Cross Blue Shield';

    mockPolicy = new Policy();
    mockPolicy.id = 'policy-123';
    mockPolicy.num = '1234567890';
    mockPolicy.insurancePlan = mockInsurancePlan;
  });

  describe('when eligibility status is N/A', () => {
    it('should create a message for no insurance', () => {
      const result = createInsuranceEligibilityMessage({
        eligibilityStatus: 'N/A',
        patient: mockPatient,
        provider: mockProvider,
        appointment: mockAppointment,
      });

      expect(result).toContain('Hi Dr. Smith');
      expect(result).toContain('❌ No insurance information on file');
      expect(result).toContain('Patient: John Doe');
      expect(result).toContain("John's");
      expect(result).toContain('office_visit');
      expect(result).toContain('Please verify insurance details');
      expect(result).toContain('Insurance Verification Team');
    });

    it('should handle provider name with multiple words', () => {
      mockProvider.fullName = 'Dr. Mary Jane Watson-Smith';

      const result = createInsuranceEligibilityMessage({
        eligibilityStatus: 'N/A',
        patient: mockPatient,
        provider: mockProvider,
        appointment: mockAppointment,
      });

      expect(result).toContain('Hi Dr. Watson-Smith');
    });

    it('should fallback to full name if firstName is not available', () => {
      mockPatient.firstName = '';

      const result = createInsuranceEligibilityMessage({
        eligibilityStatus: 'N/A',
        patient: mockPatient,
        provider: mockProvider,
        appointment: mockAppointment,
      });

      expect(result).toContain("John Doe's");
    });
  });

  describe('when eligibility status is true', () => {
    it('should create a message for verified insurance', () => {
      const result = createInsuranceEligibilityMessage({
        eligibilityStatus: true,
        patient: mockPatient,
        provider: mockProvider,
        appointment: mockAppointment,
        policy: mockPolicy,
      });

      expect(result).toContain('Hi Dr. Smith');
      expect(result).toContain('✅ Insurance verified and active');
      expect(result).toContain('Patient: John Doe');
      expect(result).toContain(
        'Insurance: Blue Cross Blue Shield ending in 7890',
      );
      expect(result).toContain('Coverage is confirmed');
      expect(result).toContain('Insurance Verification Team');
    });

    it('should handle missing policy information', () => {
      const result = createInsuranceEligibilityMessage({
        eligibilityStatus: true,
        patient: mockPatient,
        provider: mockProvider,
        appointment: mockAppointment,
      });

      expect(result).toContain('✅ Insurance verified and active');
      expect(result).toContain('Insurance: Insurance Provider');
      expect(result).not.toContain('ending in');
    });
  });

  describe('when eligibility status is false', () => {
    it('should create a message for failed verification', () => {
      const result = createInsuranceEligibilityMessage({
        eligibilityStatus: false,
        patient: mockPatient,
        provider: mockProvider,
        appointment: mockAppointment,
        policy: mockPolicy,
      });

      expect(result).toContain('Hi Dr. Smith');
      expect(result).toContain('⚠️ Insurance verification failed');
      expect(result).toContain('Patient: John Doe');
      expect(result).toContain(
        'Insurance: Blue Cross Blue Shield ending in 7890',
      );
      expect(result).toContain('Please contact the patient to verify coverage');
      expect(result).toContain('Insurance Verification Team');
    });
  });

  describe('date formatting', () => {
    it('should format appointment date properly', () => {
      mockAppointment.date = '2024-12-25T14:30:00Z';

      const result = createInsuranceEligibilityMessage({
        eligibilityStatus: true,
        patient: mockPatient,
        provider: mockProvider,
        appointment: mockAppointment,
        policy: mockPolicy,
      });

      expect(result).toContain('Dec 25, 2024');
    });

    it('should handle invalid date gracefully', () => {
      mockAppointment.date = 'invalid-date';

      const result = createInsuranceEligibilityMessage({
        eligibilityStatus: true,
        patient: mockPatient,
        provider: mockProvider,
        appointment: mockAppointment,
        policy: mockPolicy,
      });

      expect(result).toContain('Invalid Date');
    });
  });

  describe('edge cases', () => {
    it('should handle short policy numbers', () => {
      mockPolicy.num = '123';

      const result = createInsuranceEligibilityMessage({
        eligibilityStatus: true,
        patient: mockPatient,
        provider: mockProvider,
        appointment: mockAppointment,
        policy: mockPolicy,
      });

      expect(result).toContain('ending in 123');
    });

    it('should handle missing payer name', () => {
      mockPolicy.insurancePlan.payerName = '';

      const result = createInsuranceEligibilityMessage({
        eligibilityStatus: true,
        patient: mockPatient,
        provider: mockProvider,
        appointment: mockAppointment,
        policy: mockPolicy,
      });

      expect(result).toContain('Insurance: Insurance Provider');
    });
  });
});
