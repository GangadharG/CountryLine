import { gql } from "@apollo/client";

export const LOAD_COUNTRIES = gql`
  query {
    countries {
      code
      name
      native
      phone
      capital
      emoji
      currency
      continent {
        name
      }
    }
  }
`;
