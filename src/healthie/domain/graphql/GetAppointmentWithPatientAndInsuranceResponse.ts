export interface GetAppointmentWithPatientAndInsuranceResponse {
  data: {
    appointment: {
      id: string;
      date: string;
      contact_type: string;
      location: string;
      user: {
        id: string;
        full_name: string;
        first_name: string;
        last_name: string;
        email: string;
        phone_number: string;
        dob: string;
        gender: string;
        location: {
          id: string;
          line1: string;
          line2: string;
          city: string;
          state: string;
          zip: string;
          country: string;
        };
        policies: {
          id: string;
          priority_type: string;
          num: string;
          group_num: string;
          holder_relationship: string;
          insurance_plan: {
            id: string;
            payer_id: string;
            payer_name: string;
          };
        }[];
      };
    };
  };
}
