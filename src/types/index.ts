import { Icons } from '@/components/shared/Icons';
import { UserRole } from '@prisma/client';

export interface INavLink {
  imgURL: string;
  route: string;
  label: string;
}

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

export type IUser = {
  id: string;
  firstname: string;
  lastname?: string | null;
  username?: string | null;
  email?: string | null;
  imageUrl?: string | null;
  bio?: string | null;
  role?: UserRole;
};

export type INewUser = {
  name: string;
  email: string;
  username: string;
  password: string;
};

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
export type SignInResponse = {
  error?: string;
  message?: string;
  token?: string;
  status: number;
  limit?: boolean;
};

export type SignUpResponse = {
  error?: string;
  message?: string;
  token?: string;
  status: number;
  limit?: boolean;
};

export type checkTokenResponse = {
  error?: string;
  success?: string;
  existingToken?: {
    id: string;
    email: string;
    token: string;
    code: string;
    tokenType: string;
    expires: Date;
    expiresCode: Date;
  };
  status: number;
  limit?: boolean;
};

export type verificationCodeProcessResponse = {
  error?: string;
  success?: string;
  token?: {
    id: string;
    email: string;
    token: string;
    expires: Date;
  };
  redirect?: string;
  status: number;
  limit?: boolean;
};

export type verificationCodeResendResponse = {
  error?: string;
  message?: string;
  verification?: {
    id: string;
    email: string;
    token: string;
    code: string;
    expires: Date;
    expiresCode: Date;
  };
  status: number;
  limit?: boolean;
};
