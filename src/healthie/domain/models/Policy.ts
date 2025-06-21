import { Expose } from 'class-transformer';
import { InsurancePlan } from './InsurancePlan';

export class Policy {
  @Expose()
  id: string;

  @Expose()
  priorityType: string;

  @Expose()
  num: string;

  @Expose()
  groupNum: string;

  @Expose()
  holderRelationship: string;

  @Expose()
  insurancePlan: InsurancePlan;

  static toModel(data: any): Policy {
    const policy = new Policy();
    policy.id = data.id;
    policy.priorityType = data.priority_type;
    policy.num = data.num;
    policy.groupNum = data.group_num;
    policy.holderRelationship = data.holder_relationship;
    policy.insurancePlan = InsurancePlan.toModel(data.insurance_plan);
    return policy;
  }
}
