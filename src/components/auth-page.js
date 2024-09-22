"use client"

import Link from "next/link"
import { useRouter } from 'next/navigation';
import { useAuth } from "@clerk/nextjs";
import { SignIn } from "@clerk/nextjs";
import React, { useEffect } from 'react';

export function AuthPageJs() {
  const router = useRouter();
  const { isSignedIn, isLoaded } = useAuth();

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.push('/converter');
    }
  }, [isLoaded, isSignedIn, router]);

  return (
    <div className="flex min-h-screen">
      {/* Left Panel */}
      <div className="flex-1 flex flex-col justify-between p-8 bg-[#18181b] text-white">
        <div>
          <span className="text-2xl font-semibold">Excel2Calendar</span>
        </div>
        <div className="max-w-md">
          <blockquote className="text-2xl font-light mb-4">
            "This app has saved me countless hours of work and helped me organize my class schedule faster than ever before."
          </blockquote>
          <cite className="text-gray-400">Sofia Davis, Student</cite>
        </div>
      </div>
      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center bg-black text-white">
        <SignIn />
      </div>
    </div>
  );
}