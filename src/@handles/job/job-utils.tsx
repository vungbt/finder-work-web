import { JobLevel, JobSalary, JobType, Tag, TagType } from '@/configs/graphql/generated';
import useTags from '@/hooks/redux/tags/useTags';
import { IOptItem } from '@/types';
import { useEffect } from 'react';

type JobUtilsResult = {
  jobType: IOptItem[];
  jobLevel: IOptItem[];
  salaryRange: IOptItem[];
  currencyUnit: IOptItem[];
  jobTagOptions: IOptItem[];
  filterTags: (searchValue?: string) => void;
};

export const JobResultUtils = (): JobUtilsResult => {
  const { jobTagOptions, getTags } = useTags();

  useEffect(() => {
    getTags(
      {
        where: { type: { equals: TagType.Job } }
      },
      TagType.Job
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const jobType: IOptItem[] = [
    {
      value: JobType.FullTime,
      label: 'Full-time'
    },
    {
      value: JobType.PartTime,
      label: 'Part-time'
    },
    {
      value: JobType.Contract,
      label: 'Contract'
    },
    {
      value: JobType.Internship,
      label: 'Internship'
    },
    {
      value: JobType.Seasonal,
      label: 'Seasonal'
    }
  ];

  const jobLevel: IOptItem[] = [
    {
      value: JobLevel.Director,
      label: 'Director'
    },
    {
      value: JobLevel.Entry,
      label: 'Entry Level'
    },
    {
      value: JobLevel.Junior,
      label: 'Junior'
    },
    {
      value: JobLevel.Lead,
      label: 'Lead'
    },
    {
      value: JobLevel.Senior,
      label: 'Senior'
    },
    {
      value: JobLevel.Middle,
      label: 'Mid Level'
    },
    {
      value: JobLevel.Manager,
      label: 'Manager'
    },
    {
      value: JobLevel.Vp,
      label: 'Vice President'
    }
  ];

  const salaryRange: IOptItem[] = [
    {
      value: JobSalary.Begin,
      label: 'Begin ____'
    },
    {
      value: JobSalary.Discuss,
      label: 'Discuss'
    },
    {
      value: JobSalary.Peak,
      label: 'Peak ____'
    },
    {
      value: JobSalary.Range,
      label: 'Range ____ - ____'
    }
  ];
  const currencyUnit: IOptItem[] = [
    {
      value: 'VND',
      label: 'VND'
    },
    {
      value: 'USD',
      label: 'USD'
    },
    {
      value: 'EUR',
      label: 'EUR'
    }
  ];

  const filterTags = async (searchValue?: string) => {
    if (!searchValue || searchValue.length <= 0) return;
    const res = await getTags({
      where: { type: { equals: TagType.Post } },
      searchValue: searchValue
    });
    const options = ((res.all_tag.data ?? []) as Tag[]).map((item) => ({
      label: item.name,
      value: item.id
    }));
    return options;
  };

  return {
    jobType,
    jobLevel,
    salaryRange,
    currencyUnit,
    jobTagOptions,
    filterTags
  };
};
