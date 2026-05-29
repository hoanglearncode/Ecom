import React from "react";

type Props = {
  children: React.ReactNode;
};

export default function FeatureShell({ children }: Props) {
  return (
    <div className="flex-1 container mx-auto w-full px-4 py-6">
      {children}
    </div>
  );
}
