import { SignUp } from '@clerk/nextjs';

export default function Page() {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="flex items-center justify-center flex-grow">
        <SignUp />
      </div>
      <div className="h-16"></div>
    </div>
  );
}
