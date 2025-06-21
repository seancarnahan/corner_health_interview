import { Expose } from 'class-transformer';
import { Location } from './Location';

export class Patient {
  @Expose()
  id: string;

  @Expose()
  fullName: string;

  @Expose()
  firstName: string;

  @Expose()
  lastName: string;

  @Expose()
  email: string;

  @Expose()
  phoneNumber: string;

  @Expose()
  dob: string;

  @Expose()
  gender: string;

  @Expose()
  location: Location | null;

  static toModel(data: any): Patient {
    const patient = new Patient();
    patient.id = data.id;
    patient.fullName = data.full_name;
    patient.firstName = data.first_name;
    patient.lastName = data.last_name;
    patient.email = data.email;
    patient.phoneNumber = data.phone_number;
    patient.dob = data.dob;
    patient.gender = data.gender;
    patient.location = data.location ? Location.toModel(data.location) : null;
    return patient;
  }
}
