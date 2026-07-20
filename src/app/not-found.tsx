import Link from "next/link";
import Button from "@/components/ui/Button";
import { Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-neutral-50 dark:bg-neutral-900 px-4">
      <p className="text-8xl font-bold text-primary-500">404</p>
      <h1 className="text-2xl font-bold text-neutral-800 dark:text-neutral-100 mt-4">Page Not Found</h1>
      <p className="text-neutral-500 dark:text-neutral-400 mt-2 text-center max-w-md">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link href="/" className="mt-8">
        <Button size="lg"><Home className="h-4 w-4 mr-1.5" /> Go Back Home</Button>
      </Link>
    </div>
  );
}