import { Icons } from '@/components/shared/Icons';

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
};
export type UserRole = {
  role?: 'STUDENT' | 'ADMIN';
};
export type IUserPassword = IId & {
  password: string;
};

export type NavItem = {
  title: string;
  href: string;
  icon?: keyof typeof Icons;
  buttonAction?: () => void;
  disabled?: boolean;
};

export type MainNavItem = NavItem;

type ExternalItem = SidebarNavItem;

export type SidebarNavItem = {
  title: string;
  i?: ExternalItem[];
  query?: string;
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
export type SidebarNavItemAdmin = {
  title: string;
  disabled?: boolean;
  i?: SidebarNavItem[];
  href?: string;

  external?: boolean;
  icon?: keyof typeof Icons;
};

export type SidebarNavItemInstructor = {
  title: string;
  disabled?: boolean;
  i?: SidebarNavItem[];
  href?: string;
  external?: boolean;
  icon?: keyof typeof Icons;
};
export type SidebarNavItemDean = {
  title: string;
  disabled?: boolean;
  i?: SidebarNavItem[];
  href?: string;
  external?: boolean;
  icon?: keyof typeof Icons;
};

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
  mainNavInstructor: MainNavItem[];
  mainNavDean: MainNavItem[];
  sidebarNav: SidebarNavItem[];
  sidebarInstructor: SidebarNavItemInstructor[];
  sidebarDean: SidebarNavItemDean[];

  mainNavAdmin: MainNavItem[];
  sidebarAdmin: SidebarNavItemAdmin[];
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
  role?: string;
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
  role?: string;
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
export type getSingleProfileResponse = {
  profile?: any;
} & IResponse;
export type updateStudentProfilePhotoResponse = IResponse;
export type testResponseaa = IResponse;

type ICourse = {
  _id: any;
  courseCode: string;
  name: string;
  imageUrl?: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
};
export type getCourseResponse = {
  courses?: ICourse[];
} & IResponse;

/**
 * this getEnrollment should be called if we query whose session id is login
 */
export type IEnrollment = {
  id?: any;
  _id: any;
  userId?: any;
  profileId?: any;
  courseId?: any;
  blockTypeId?: any;
  studentYear: string;
  studentSemester?: string;
  onProcess: Boolean;
  step?: any;
  psaUrl?: string;
  goodMoralUrl?: string;
  reportCardUrl?: string;
  photoUrl?: string;
  pdfUrl?: string;
  schoolYear: string;
  enrollStatus?: string;
  studentStatus?: string;
  studentType?: string;
  scholarType?: string;
  studentSubjects: any;
  createdAt: Date;
  updatedAt: Date;
};

export type getEnrollmentResponse = {
  enrollment?: IEnrollment[];
} & IResponse;

export type IBlockType = {
  id?: any;
  _id: any;
  courseId: any;
  semester: string;
  year: string;
  section: string;
  blockSubjects: any[];
  createdAt: Date;
  updatedAt: Date;
};
export type getBlockCourseResponse = {
  blockTypes?: IBlockType[];
} & IResponse;

export interface ISubject {
  id?: any;
  _id: any;
  category: string;
  fixedRateAmount: string;
  preReq: string;
  subjectCode: string;
  name: string;
  lec?: string;
  lab?: string;
  unit?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IStudentProfile {
  _id: string;
  id: string;
  userId: any;
  firstname?: string;
  middlename?: string;
  lastname: string;
  extensionName?: string;
  numberStreet?: string;
  barangay?: string;
  district?: string;
  cityMunicipality?: string;
  province?: string;
  region?: string;
  emailFbAcc?: string;
  contact?: string;
  nationality?: string;
  sex?: string;
  civilStatus?: string;
  employmentStatus?: string;
  birthday?: Date;
  age?: Number;
  birthPlaceCity?: string;
  birthPlaceProvince?: string;
  birthPlaceRegion?: string;
  educationAttainment?: string;
  learnerOrTraineeOrStudentClassification?: string;
  studentYear?: string;
  semester?: string;
  enrollStatus?: 'Pending' | 'Continue' | 'Completed';
  studentType?: 'Regular' | 'Non-Regular';
  scholarType: string;
  imageUrl?: string;
  isVerified: boolean;
  lastLogin?: Date;
  lastLogout?: Date;
}
export type getAllStudentProfileResponse = {
  students?: IStudentProfile[];
  role?: string;
} & IResponse;

export interface ITeacherProfile {
  _id: string;
  id: string;
  userId: any;
  firstname?: string;
  middlename?: string;
  lastname: string;
  extensionName?: string;
  emailFbAcc?: string;
  contact?: string;
  sex?: string;
  civilStatus?: string;
  birthday?: Date;
  age?: Number;
  imageUrl?: string;
  isVerified: boolean;
  lastLogin?: Date;
  lastLogout?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export type getAllTeacherProfileResponse = {
  teachers?: ITeacherProfile[];
  role?: string;
} & IResponse;

export type getTeacherProfileResponse = {
  teacher?: ITeacherProfile;
  role?: string;
} & IResponse;

export interface IAdminProfile {
  _id: string;
  id: string;
  userId: any;
  firstname?: string;
  middlename?: string;
  lastname: string;
  extensionName?: string;
  emailFbAcc?: string;
  contact?: string;
  sex?: string;
  civilStatus?: string;
  birthday?: Date;
  age?: Number;
  imageUrl?: string;
  isVerified: boolean;
  lastLogin?: Date;
  lastLogout?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export type getAllAdminProfileResponse = {
  admins?: IAdminProfile[];
  role?: string;
} & IResponse;

export type getAdminProfileResponse = {
  admin?: IAdminProfile;
  role?: string;
} & IResponse;

export interface IDeanProfile {
  _id: string;
  id: string;
  userId: any;
  courseId: any;
  firstname?: string;
  middlename?: string;
  lastname: string;
  extensionName?: string;
  emailFbAcc?: string;
  contact?: string;
  sex?: string;
  civilStatus?: string;
  birthday?: Date;
  age?: Number;
  imageUrl?: string;
  isVerified: boolean;
  lastLogin?: Date;
  lastLogout?: Date;
  createdAt: Date;
  updatedAt: Date;
}
export type getAllDeanProfileResponse = {
  deans?: IDeanProfile[];
  role?: string;
} & IResponse;

export interface IRoom {
  _id: string;
  id: string;
  educationLevel: string;
  roomName: string;
  roomType: string;
  floorLocation: string;
  isRoomAvailable: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type ISchoolYear = {
  id?: any;
  _id: any;
  schoolYear: any;
  isEnable: boolean;
  createdAt: Date;
  updatedAt: Date;
};
export type getAllSchoolYearResponse = {
  sy?: ISchoolYear[];
} & IResponse;

export type ICurriculum = {
  id?: any;
  _id: any;
  courseId: any;
  curriculum: any;
  createdAt: Date;
  updatedAt: Date;
};
export type getAllCurriculumsResponse = {
  curriculums?: ICurriculum[];
} & IResponse;
export type getCurriculumsResponse = {
  curriculum?: ICurriculum;
} & IResponse;

export type IStudentCurriculum = {
  id?: any;
  _id: any;
  studentId: any;
  courseId: any;
  curriculum: any;
  createdAt: Date;
  updatedAt: Date;
};
export type getAllStudentCurriculumsResponse = {
  curriculums?: IStudentCurriculum[];
} & IResponse;
export type getStudentCurriculumsResponse = {
  curriculum?: IStudentCurriculum;
} & IResponse;
export type ITeacherSchedule = {
  id?: any;
  _id: any;
  category: any;
  courseId: any;
  profileId: any;
  blockTypeId: any;
  subjectId: any;
  roomId: any;
  days: any;
  startTime: any;
  endTime: any;
  createdAt: Date;
  updatedAt: Date;
};
