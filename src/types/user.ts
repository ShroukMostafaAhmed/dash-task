export interface Address {
  street: string;
  suite: string;
  city: string;
  zipcode: string;
  geo: {
    lat: string;
    lng: string;
  };
}

export interface Company {
  name: string;
  catchPhrase: string;
  bs: string;
}

export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  address: Address;
  phone: string;
  website: string;
  company: Company;
}

export interface CreateUserPayload {
  name: string;
  username: string;
  email: string;
  phone?: string;
  website?: string;
  company?: string;
}

export type UpdateUserPayload = Partial<CreateUserPayload>;
