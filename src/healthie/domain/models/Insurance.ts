import { Expose } from 'class-transformer';
import { Policy } from './Policy';

export class Insurance {
  @Expose()
  policies: Policy[];

  static toModel(data: any): Insurance {
    const insurance = new Insurance();
    insurance.policies = data.map((policyData: any) =>
      Policy.toModel(policyData),
    );
    return insurance;
  }
}
