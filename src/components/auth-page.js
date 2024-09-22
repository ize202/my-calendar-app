"use client"

import { LogIn } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"

export function AuthPageJs() {
  const handleGoogleSignIn = () => {
    // Handle Google Sign In here
    console.log("Signing in with Google")
  }

  return (
    (<div className="flex min-h-screen bg-black text-white">
      {/* Left Panel */}
      <div className="flex-1 flex flex-col justify-between p-8">
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
      <div className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold">Welcome</h2>
            <p className="text-gray-400 mt-2">
              Sign in to start converting your Excel schedules
            </p>
          </div>
          <Button
            onClick={handleGoogleSignIn}
            className="w-full bg-white text-black hover:bg-gray-200 flex items-center justify-center">
            <LogIn className="mr-2 h-4 w-4" />
            Sign in with Google
          </Button>
          <p className="text-center text-sm text-gray-400">
            By signing in, you agree to our{" "}
            <Link href="/terms" className="underline hover:text-white">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="underline hover:text-white">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </div>)
  );
}