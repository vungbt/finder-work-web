import { Company } from '@/configs/graphql/generated';
import React from 'react';

type CompanyCardProps = {
  item: Company;
};

export function CompanyCard({ item }: CompanyCardProps) {
  return <div>{item.name}</div>;
}
