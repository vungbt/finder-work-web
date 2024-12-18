export const RouterPath = {
  Home: '/',
  AboutUs: '/about-us',
  Discoveries: '/discoveries',
  Careers: '/careers',
  ResumeBuilder: '/resume-builder',
  Posts: '/posts',
  Pricing: '/pricing',
  Login: '/auth/sign-in',
  SignUp: '/auth/sign-up',
  VerifyCode: '/auth/verify-code',
  ForgotPassword: '/auth/forgot-password',

  // ADMIN PORTAL
  PORTAL_ADMIN: '/admin',
  ADMIN_LOGIN: '/admin/sign-in',
  ADMIN_SETTING_GENERAL: '/admin/setting/general',
  ADMIN_SETTING_GENERAL_ADD: '/admin/setting/general/add',
  ADMIN_CAREERS: '/admin/careers',
  ADMIN_CAREERS_ADD: '/admin/careers/add',
  ADMIN_CAREERS_EDIT: '/admin/careers/edit',
  ADMIN_CAREERS_READ: '/admin/careers/read',

  // Portal
  PORTAL: '/portal',
  PORTAL_CAREERS: '/portal/careers',
  PORTAL_JOBS: '/portal/jobs',
  PORTAL_COMPANIES: '/portal/companies',
  PORTAL_WORK_PROFILE: '/portal/work-profile',
  PORTAL_WORK_PROFILE_RESUMES: '/portal/work-profile/resumes',
  PORTAL_WORK_PROFILE_EXPERIENCES: '/portal/work-profile/experiences',
  PORTAL_WORK_PROFILE_SKILLS: '/portal/work-profile/skills',
  PORTAL_WORK_PROFILE_PROJECTS: '/portal/work-profile/projects',
  PORTAL_JOB_DETAILS: '/portal/job-portal/',

  // Employer
  PORTAL_COMPANY_PROFILE: '/portal/company/profile',
  PORTAL_COMPANY_JOBS: '/portal/company/jobs',
  COMPANY_PROFILE_DETAIL: '/portal/company/profile/add',
  COMPANY_PROFILES: '/portal/company/profile',

  // Common
  TERM_OF_USE: '/term-of-use',
  PRIVACY_POLICY: '/privacy-policy',

  // SYSTEM
  ERROR: '/error',

  // Job
  JOB_DETAIL: '/job/detail'
};

export const RouterOptions = Object.entries(RouterPath).map(([key, value]) => ({
  label: `${key} - "${value}"`,
  value
}));
