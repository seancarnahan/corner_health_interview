import { Expose } from 'class-transformer';

export class Provider {
  @Expose()
  id: string;

  @Expose()
  fullName: string;

  @Expose()
  email: string;

  @Expose()
  phoneNumber: string;

  static toModel(data: any): Provider {
    const provider = new Provider();
    provider.id = data.id;
    provider.fullName = data.full_name;
    provider.email = data.email;
    provider.phoneNumber = data.phone_number;
    return provider;
  }
}
