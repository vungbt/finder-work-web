import Image from 'next/image';
import React from 'react';
import { Button } from '../buttons';

interface TemplateCardProps {
  image: string;
  name: string;
  className?: string;
  handlePreview: () => void;
  loading?: boolean;
}

export function TemplateCard({ name, image, handlePreview }: TemplateCardProps) {
  return (
    <div className="max-w-sm rounded overflow-hidden shadow-lg">
      <div className="px-6 py-4 flex flex-col items-center">
        <div className="font-bold text-xl mb-2">{name}</div>
        <Image src={image} alt={name} width={100} height={200} />
        <Button label="preview" styleType="info" className="mt-4" onClick={handlePreview} />
      </div>
    </div>
  );
}

export default TemplateCard;
