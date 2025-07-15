export interface User {
  id: string;
  email: string;
  name: string;
  roleId: string;
}

export type UserPayload = Omit<User, 'id'> & { password?: string };

export interface LoginPayload {
  email: string;
  password: string;
}

export interface Session {
  access_token: string;
  token_type: string;
  expires_in: number;
  user: User;
}

export interface Role {
  id: string;
  name: string;
  permissions: {
    [key: string]: string[];
  };
}

export interface Client {
  id: string;
  name: string;
  email: string;
  cnpj: string;
  address: string;
  services?: { id: string; name: string }[];
}

export interface Service {
  id: string;
  name: string;
  description: string;
}

export interface Status {
  id: string;
  name: string;
  triggersEmail?: boolean;
  isPickupStatus?: boolean;
  isFinal?: boolean;
}

export interface ServiceOrder {
  id: string;
  order_number: string;
  clientId: string;
  client_snapshot: { name: string; email: string };
  collaborator: {
    name: string;
  };
  equipment: {
    type: string;
    brand: string;
    model: string;
    serialNumber: string;
  };
  reportedProblem: string;
  analyst: string;
  contractedServices: {
    serviceId: string;
    name: string;
    description: string;
  }[];
  observation?: string;
  statusId: string;
  createdAt: string;
  status: {
    name: string;
  };
  statusHistory: {
    fromStatus: { name: string };
    toStatus: { name: string };
    createdAt: string;
    user: { name: string };
    note?: string;
  }[];
  editHistory: {
    field: string;
    oldValue: string;
    newValue: string;
    createdAt: string;
    user: { name: string };
  }[];
}

export interface Settings {
  email: {
    host: string;
    port: number;
    user: string;
    pass: string;
  };
}
