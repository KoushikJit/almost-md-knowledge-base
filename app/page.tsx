import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-24 gap-2">
      User's Landing Page

      <Link className={buttonVariants({ variant: "outline" })} href={"pinecone"}>GO UPDATE!</Link>
    </main>
  );
}
