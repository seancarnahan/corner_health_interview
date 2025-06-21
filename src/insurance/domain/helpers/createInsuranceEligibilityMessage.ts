import { Patient } from '../../../healthie/domain/models/Patient';
import { Provider } from '../../../healthie/domain/models/Provider';
import { Policy } from '../../../healthie/domain/models/Policy';
import { Appointment } from '../../../healthie/domain/models/Appointment';

export interface InsuranceEligibilityMessageContext {
  eligibilityStatus: boolean | 'N/A';
  patient: Patient;
  provider: Provider;
  appointment: Appointment;
  policy?: Policy;
}

interface StatusConfig {
  icon: string;
  title: string;
  action: string;
}

interface MessageComponents {
  greeting: string;
  header: string;
  statusLine: string;
  details: string[];
  action: string;
  signature: string;
}

export function createInsuranceEligibilityMessage(
  context: InsuranceEligibilityMessageContext,
): string {
  const statusConfig = getStatusConfig(context.eligibilityStatus);
  const components = buildMessageComponents(context, statusConfig);

  return formatMessage(components);
}

function getStatusConfig(eligibilityStatus: boolean | 'N/A'): StatusConfig {
  switch (eligibilityStatus) {
    case 'N/A':
      return {
        icon: '❌',
        title: 'No insurance information on file',
        action:
          'Please verify insurance details with the patient before the appointment.',
      };
    case true:
      return {
        icon: '✅',
        title: 'Insurance verified and active',
        action: 'Coverage is confirmed for the scheduled appointment.',
      };
    case false:
      return {
        icon: '⚠️',
        title: 'Insurance verification failed',
        action:
          'Please contact the patient to verify coverage or discuss payment options.',
      };
  }
}

function buildMessageComponents(
  context: InsuranceEligibilityMessageContext,
  statusConfig: StatusConfig,
): MessageComponents {
  const { patient, provider, appointment, policy } = context;

  return {
    greeting: createGreeting(provider),
    header: createHeader(patient, appointment),
    statusLine: createStatusLine(statusConfig),
    details: createDetailsList(
      patient,
      appointment,
      policy,
      context.eligibilityStatus,
    ),
    action: statusConfig.action,
    signature: createSignature(),
  };
}

function createGreeting(provider: Provider): string {
  const lastName = provider.fullName.split(' ').pop();
  return `Hi Dr. ${lastName},`;
}

function createHeader(patient: Patient, appointment: Appointment): string {
  const patientName = patient.firstName || patient.fullName;
  const appointmentDate = formatAppointmentDate(appointment.date);
  return `Insurance eligibility update for ${patientName}'s ${appointmentDate} appointment:`;
}

function createStatusLine(statusConfig: StatusConfig): string {
  return `${statusConfig.icon} ${statusConfig.title}`;
}

function createDetailsList(
  patient: Patient,
  appointment: Appointment,
  policy: Policy | undefined,
  eligibilityStatus: boolean | 'N/A',
): string[] {
  const details = [`• Patient: ${patient.fullName}`];

  if (eligibilityStatus !== 'N/A') {
    details.push(createInsuranceDetail(policy));
  }

  details.push(createAppointmentDetail(appointment));

  return details;
}

function createInsuranceDetail(policy: Policy | undefined): string {
  const insuranceCompany =
    policy?.insurancePlan?.payerName || 'Insurance Provider';
  const policyNumber = policy?.num ? ` ending in ${policy.num.slice(-4)}` : '';
  return `• Insurance: ${insuranceCompany}${policyNumber}`;
}

function createAppointmentDetail(appointment: Appointment): string {
  const appointmentDate = formatAppointmentDate(appointment.date);
  return `• Appointment: ${appointmentDate} (${appointment.contactType})`;
}

function createSignature(): string {
  return `Best regards,
Insurance Verification Team`;
}

function formatMessage(components: MessageComponents): string {
  return [
    components.greeting,
    '',
    components.header,
    '',
    components.statusLine,
    ...components.details,
    '',
    components.action,
    '',
    components.signature,
  ].join('\n');
}

function formatAppointmentDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return dateString;
  }
}
