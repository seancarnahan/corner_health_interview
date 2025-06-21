import { Expose } from 'class-transformer';
import { Provider } from './Provider';

export class Appointment {
  @Expose()
  id: string;

  @Expose()
  date: string;

  @Expose()
  contactType: string;

  @Expose()
  location: string;

  @Expose()
  provider: Provider;

  static toModel(data: any): Appointment {
    const appointment = new Appointment();
    appointment.id = data.id;
    appointment.date = data.date;
    appointment.contactType = data.contact_type;
    appointment.location = data.location;
    appointment.provider = Provider.toModel(data.provider);
    return appointment;
  }
}
