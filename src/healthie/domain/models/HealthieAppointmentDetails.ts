import { Expose } from 'class-transformer';
import { Appointment } from './Appointment';
import { Patient } from './Patient';
import { Insurance } from './Insurance';

export class HealthieAppointmentDetails {
  @Expose()
  appointment: Appointment;

  @Expose()
  patient: Patient;

  @Expose()
  insurance: Insurance;

  static toModel(data: any): HealthieAppointmentDetails {
    const result = new HealthieAppointmentDetails();
    result.appointment = Appointment.toModel(data.appointment);
    result.patient = Patient.toModel(data.appointment.user);
    result.insurance = Insurance.toModel(data.appointment.user.policies);
    return result;
  }
}
