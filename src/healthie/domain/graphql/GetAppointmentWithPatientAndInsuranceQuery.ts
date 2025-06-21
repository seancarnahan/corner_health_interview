export const GetAppointmentWithPatientAndInsuranceQuery = `
      query GetAppointmentWithPatientAndInsurance($appointmentId: ID!) {
        appointment(id: $appointmentId) {
          id
          date
          contact_type
          location
          provider {
            id
            full_name
            email
            phone_number
          }
          user {
            id
            full_name
            first_name
            last_name
            email
            phone_number
            dob
            gender
            location {
              id
              line1
              line2
              city
              state
              zip
              country
            }
            policies {
              id
              priority_type
              num
              group_num
              holder_relationship
              insurance_plan {
                id
                payer_id
                payer_name
              }
            }
          }
        }
      }
    `;
