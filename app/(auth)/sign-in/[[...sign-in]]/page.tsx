"use client";

import { SignIn } from "@clerk/nextjs";
import { useTheme } from "next-themes";

export default function SignInPage() {
  const { theme } = useTheme();
  
  return (
    <div className="flex min-h-screen items-center justify-center">
      <SignIn 
        appearance={{
          elements: {
            rootBox: "mx-auto",
            card: "bg-background",
            formButtonPrimary: "bg-primary text-primary-foreground hover:bg-primary/90",
            formFieldInput: "bg-background text-foreground border-input",
            formFieldLabel: "text-foreground",
            headerTitle: "text-foreground",
            headerSubtitle: "text-muted-foreground",
            socialButtonsBlockButton: "text-foreground hover:bg-muted",
            dividerLine: "bg-border",
            dividerText: "text-muted-foreground",
            footerActionLink: "text-primary hover:text-primary/90",
            formFieldAction: "text-primary hover:text-primary/90",
            socialButtonsProviderIcon: "text-foreground",
            socialButtonsBlockButtonText: "text-foreground",
            formFieldInputShowPasswordButton: "text-muted-foreground hover:text-foreground",
            otpCodeFieldInput: "bg-background text-foreground border-input",
            card__background: "bg-background",
            main: "bg-background",
            header: "text-foreground",
            footer: "text-foreground",
          }
        }}
      />
    </div>
  );
}
