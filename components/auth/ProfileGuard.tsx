'use client';

import React from "react"

import { useProfileAuth } from '@/hooks/useProfileAuth';
import { Card } from '@/components/ui/card';
import { Loader } from 'lucide-react';

interface ProfileGuardProps {
  children: React.ReactNode;
  requireProfile?: boolean;
}

export function ProfileGuard({ children, requireProfile = true }: ProfileGuardProps) {
  const { isLoading, isProfileComplete } = useProfileAuth();

  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-background">
        <Card className="p-8 space-y-4 text-center">
          <Loader className="w-8 h-8 animate-spin mx-auto text-primary" />
          <p className="text-foreground font-medium">Loading your profile...</p>
          <p className="text-sm text-muted-foreground">Please wait a moment</p>
        </Card>
      </div>
    );
  }

  // If profile is required but not complete, show message (hook will redirect)
  if (requireProfile && !isProfileComplete) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-background">
        <Card className="p-8 space-y-4 text-center max-w-md">
          <h2 className="text-2xl font-bold text-foreground">Welcome!</h2>
          <p className="text-muted-foreground">
            Please create your profile to get started
          </p>
          <p className="text-sm text-muted-foreground">Redirecting...</p>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}
