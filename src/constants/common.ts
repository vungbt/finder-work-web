import {
  Degree,
  EducationType,
  ProficiencyLevel,
  SocialType,
  UserRole,
  WorkPosition
} from '@/configs/graphql/generated';
import { EReason, ESettingType } from '@/types';
import { StatusCodes as HttpStatusCode } from 'http-status-codes';

export const COUNTRY_CODE_DEFAULT = 'VI';
export const PAGINATION = {
  limit: 10,
  page: 1
};

export const FILE_IMAGE = {
  accepts: ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/gif'],
  size: 5 * 1000000 // 5MB,
};

export const FILE_DOCUMENT = {
  accepts: ['application/pdf'],
  size: 10 * 1000000 // 10MB,
};

export const FILE_VIDEO = {
  accepts: ['video/*'],
  size: 10 * 1000000 // 10MB,
};
export const FallbackImage = {
  avatarUrl:
    'https://res.cloudinary.com/dgxciqlts/image/upload/v1709873667/assets/avatar-1_r0wv7q.webp',
  thumbnail: ''
};

export const SettingKeys = [
  { label: 'admin', value: 'admin' },
  { label: 'employee', value: 'employee' },
  { label: 'employer', value: 'employer' },
  { label: 'landingPage', value: 'landing_page' },
  { label: 'superAdmin', value: 'super_admin' }
];

export const UserRoleOptions = [
  { label: 'admin', value: UserRole.Admin },
  { label: 'employee', value: UserRole.Employee },
  { label: 'employer', value: UserRole.Employer }
];

export const SettingTypes = [
  { label: 'menu.title', value: ESettingType.Menu },
  { label: 'header.title', value: ESettingType.Header },
  { label: 'footer.title', value: ESettingType.Footer }
];

export const PostReportReasons = [
  { label: 'reason.brokenLink', value: EReason.BROKEN_LINK },
  { label: 'reason.clickbait', value: EReason.CLICKBAIT },
  { label: 'reason.lowQualityContent', value: EReason.LOW_QUALITY_CONTENT },
  { label: 'reason.falseOrInaccurateInformation', value: EReason.FALSE_OR_INACCURATE_INFORMATION },
  { label: 'common.other', value: EReason.OTHER }
];

export const WorkingPositionOptions = [
  { label: 'workPosition.staff', value: WorkPosition.Staff },
  { label: 'workPosition.teamLeader', value: WorkPosition.TeamLeader },
  { label: 'workPosition.viceOfDepartment', value: WorkPosition.ViceOfDepartment },
  { label: 'workPosition.headOfDepartment', value: WorkPosition.HeadOfDepartment },
  { label: 'workPosition.viceDirector', value: WorkPosition.ViceDirector },
  { label: 'workPosition.director', value: WorkPosition.Director },
  { label: 'workPosition.generalDirector', value: WorkPosition.GeneralDirector }
];

export const EducationTypeOptions = [
  { label: 'educationType.school', value: EducationType.School },
  { label: 'educationType.institution', value: EducationType.Institution },
  { label: 'educationType.college', value: EducationType.College },
  { label: 'educationType.university', value: EducationType.University },
  { label: 'educationType.other', value: EducationType.Other }
];

export const DegreeOptions = [
  { label: 'degree.highSchoolDiploma', value: Degree.HighSchoolDiploma },
  { label: 'degree.technicalTraining', value: Degree.TechnicalTraining },
  { label: 'degree.vocational', value: Degree.Vocational },
  { label: 'degree.associate', value: Degree.Associate },
  { label: 'degree.bachelor', value: Degree.Bachelor },
  { label: 'degree.master', value: Degree.Master },
  { label: 'degree.doctoral', value: Degree.Doctoral },
  { label: 'degree.other', value: Degree.Other }
];

export const ProficiencyLevelOptions = [
  { label: 'proficiencyLevel.beginner', value: ProficiencyLevel.Beginner },
  { label: 'proficiencyLevel.intermediate', value: ProficiencyLevel.Intermediate },
  { label: 'proficiencyLevel.fluent', value: ProficiencyLevel.Fluent },
  { label: 'proficiencyLevel.professional', value: ProficiencyLevel.Professional },
  { label: 'proficiencyLevel.native', value: ProficiencyLevel.Native }
];

export const SocialTypeOptions = [
  { label: 'socialType.behance', value: SocialType.Behance },
  { label: 'socialType.dribbble', value: SocialType.Dribbble },
  { label: 'socialType.facebook', value: SocialType.Facebook },
  { label: 'socialType.github', value: SocialType.Github },
  { label: 'socialType.gitlab', value: SocialType.Gitlab },
  { label: 'socialType.glosbe', value: SocialType.Glosbe },
  { label: 'socialType.instagram', value: SocialType.Instagram },
  { label: 'socialType.linkedIn', value: SocialType.LinkedIn }
];

export const RouterAction = ['add', 'edit'];

export const StatusCodes = HttpStatusCode;
