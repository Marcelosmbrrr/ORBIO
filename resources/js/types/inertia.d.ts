import type { Page } from "@inertiajs/core";

interface AuthenticatedUser {
  id: string;
  name: string;
  role: string;
  authorization: {
    managers: { read: boolean, write: boolean },
    users: { read: boolean, write: boolean },
    flightplans: { read: boolean, write: boolean },
    serviceorders: { read: boolean, create: boolean, edit: boolean },
    equipments: { read: boolean, write: boolean },
  };
}

declare module '@inertiajs/core' {
  interface PageProps extends Page<PageProps> {
    auth: {
      user: AuthenticatedUser;
    }
    route: {
      name: string
    }
  }
}