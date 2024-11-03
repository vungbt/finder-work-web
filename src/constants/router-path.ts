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
  PORTAL_RESUMES: '/portal/resumes',
  PORTAL_RESUMES_SKILLS: '/portal/resumes/skills',
  PORTAL_RESUMES_PROJECTS: '/portal/resumes/projects',

  // SYSTEM
  ERROR: '/error'
};

export const RouterOptions = Object.entries(RouterPath).map(([key, value]) => ({
  label: `${key} - "${value}"`,
  value
}));
