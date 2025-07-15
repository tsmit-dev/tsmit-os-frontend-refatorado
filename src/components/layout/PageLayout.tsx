
import React from 'react';

interface PageLayoutProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

export function PageLayout({ title, description, icon, children }: PageLayoutProps) {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          {icon}
          <div>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{title}</h1>
            <p className="text-muted-foreground">{description}</p>
          </div>
        </div>
      </div>
      {children}
    </div>
  );
}
