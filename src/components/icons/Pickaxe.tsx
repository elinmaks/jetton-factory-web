
import React from 'react';
import { LucideProps } from 'lucide-react';

export const Pickaxe = (props: LucideProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M14 10L4.5 20.5" />
      <path d="M14 10l2-2" />
      <path d="M11 13l-1.5 1.5" />
      <path d="M16 8l2.5-2.5c1-1 2.7-1 3.5 0 .8 1 .7 2.7 0 3.5L19.5 11 8 22.5 2 16.5 13.5 5z" />
    </svg>
  );
};

export default Pickaxe;
