"use client";

import { redirect } from "next/navigation";
import { useUser, SignInButton, SignUpButton, SignOutButton } from "@clerk/nextjs";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";

export default function Home() {
  const { user } = useUser();

  useEffect(() => {
    if (user) {
      redirect("/workspace");
    }
  }, [user]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 flex flex-col">
      {/* Navbar */}
      <header className="w-full flex items-center justify-end px-8 py-6">
        <div className="flex gap-4 items-center">
          <SignInButton mode="modal">
            <Button variant="outline">Login</Button>
          </SignInButton>
          <SignUpButton mode="modal">
            <Button>Sign Up</Button>
          </SignUpButton>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 drop-shadow-lg">
          Instantly Generate Your Own Course with AI
        </h1>
        <p className="max-w-xl text-lg md:text-2xl text-slate-300 mb-10">
          Describe any subject and let our AI create a personalized, interactive course for you—no limits, no waiting.
        </p>
        <div className="flex gap-4 justify-center">
          <SignUpButton mode="modal">
            <Button size="lg">Get Started</Button>
          </SignUpButton>
          <SignInButton mode="modal">
            <Button variant="outline" size="lg">Login</Button>
          </SignInButton>
        </div>
      </section>

      <footer className="w-full text-center py-4 text-slate-400 text-sm">
        &copy; {new Date().getFullYear()} AI Course Genie
      </footer>
    </main>
  );
}
