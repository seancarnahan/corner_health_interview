import { Expose } from 'class-transformer';

export class Location {
  @Expose()
  id: string;

  @Expose()
  line1: string;

  @Expose()
  line2: string;

  @Expose()
  city: string;

  @Expose()
  state: string;

  @Expose()
  zip: string;

  @Expose()
  country: string;

  static toModel(data: any): Location {
    const location = new Location();
    location.id = data.id;
    location.line1 = data.line1;
    location.line2 = data.line2;
    location.city = data.city;
    location.state = data.state;
    location.zip = data.zip;
    location.country = data.country;
    return location;
  }
}
