import React from 'react';

import type { ButtonProps } from '@/shared/Button/Button';
import Button from '@/shared/Button/Button';

export interface ButtonPrimaryProps extends ButtonProps {
  href?: any;
  textClassName?: string;
}

const ButtonPrimary: React.FC<ButtonPrimaryProps> = ({
  className = '',
  textClassName = '',
  ...args
}) => {
  return (
    <Button
      className={`disabled:bg-opacity/70 rounded-full bg-black text-white hover:bg-white hover:text-black border border-black ${className}`}
      {...args}
    />
  );
};

export default ButtonPrimary;
