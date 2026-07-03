import { SignedIn, SignedOut, SignIn } from "@clerk/clerk-react";

export default function AuthGate({ children }) {
  return (
    <>
      <SignedOut>
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 60 }}>
          <SignIn routing='hash' />
        </div>
      </SignedOut>

      <SignedIn>{children}</SignedIn>
    </>
  );
}











