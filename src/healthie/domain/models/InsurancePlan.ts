import { Expose } from 'class-transformer';

export class InsurancePlan {
  @Expose()
  id: string;

  @Expose()
  payerId: string;

  @Expose()
  payerName: string;

  static toModel(data: any): InsurancePlan {
    const plan = new InsurancePlan();
    plan.id = data.id;
    plan.payerId = data.payer_id;
    plan.payerName = data.payer_name;
    return plan;
  }
}
