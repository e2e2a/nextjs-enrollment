import { Icons } from '@/components/shared/Icons';

//
export type IVerificationToken = {
  id: string;
  userId: any;
  token: string;
  code: string;
  tokenType: string;
  expires: Date;
  expiresCode: Date;
  createdAt: Date;
  updatedAt: Date;
};

export type IResetPasswordToken = {
  id: string;
  email: string;
  token: string;
  expires: Date;
  createdAt: Date;
  updatedAt: Date;
};
//
export type IUpdateUser = {
  userId: string;
  name: string;
  bio: string;
  imageId: string;
  imageUrl: URL | string;
  file: File[];
};

export type INewPost = {
  userId: string;
  caption: string;
  file: File[];
  location?: string;
  tags?: string;
};

export type IUpdatePost = {
  postId: string;
  caption: string;
  imageId: string;
  imageUrl: URL;
  file: File[];
  location?: string;
  tags?: string;
};
/**
 * @type models
 */
export type IId = {
  id: string;
}
export type UserRole = {
  role?: "USER" | "ADMIN"
}
export type IUserPassword = IId & {
  password: string;
}
/**
 * @todo 
 * create type User Profile
 */
export type IUserData = {
  firstname?: string;
  lastname?: string;
  username?: string;
  email?: string;
  imageUrl?: string | null;
};

export type IUser = IId & {
  firstname?: string;
  lastname?: string;
  username?: string;
  email?: string;
  imageUrl?: string | null;
} & UserRole;

export type INewUser = {
  name: string;
  email: string;
  username: string;
  password: string;
};

export interface INavLink {
  imgURL: string;
  route: string;
  label: string;
}

export type NavItem = {
  title: string;
  href: string;
  buttonAction?: () => void;
  disabled?: boolean;
};

export type MainNavItem = NavItem;

export type SidebarNavItem = {
  title: string;
  disabled?: boolean;
  external?: boolean;
  icon?: keyof typeof Icons;
} & (
  | {
      href: string;
      buttonAction?: never;
      items?: never;
    }
  | {
      href?: never;
      items?: never;
    }
);

export type SiteConfig = {
  name: string;
  description: string;
  url: string;
  ogImage: string;
  links: {
    twitter: string;
    github: string;
  };
};

export type DocsConfig = {
  mainNav: MainNavItem[];
  sidebarNav: SidebarNavItem[];
};

export type MarketingConfig = {
  mainNav: MainNavItem[];
};

export type DashboardConfig = {
  mainNav: MainNavItem[];
  sidebarNav: SidebarNavItem[];
};

export type SubscriptionPlan = {
  name: string;
  description: string;
  stripePriceId: string;
};

/**
 * @type responses
 */
export type IResponse = {
  error?: string;
  message?: string;
  status: number;
  limit?: boolean;
};

export type SignInResponse = {
  token?: string;
} & IResponse;

export type SignUpResponse = {
  token?: string;
} & IResponse;

export type checkTokenResponse = {
  token?: IVerificationToken;
} & IResponse;

export type verificationCodeProcessResponse = {
  token?: IResetPasswordToken;
  redirect?: string;
} & IResponse;

export type verificationCodeResendResponse = {
  verification?: IVerificationToken;
} & IResponse;

export type resetPasswordTokenResponse = {
  token?: IResetPasswordToken;
} & IResponse;

export type recoveryResponse = {
  token?: string;
} & IResponse;

export type resetPasswordResponse = {
  token?: string;
} & IResponse;

export type updateStudentProfileResponse = {
  profile?: any;
} & IResponse;