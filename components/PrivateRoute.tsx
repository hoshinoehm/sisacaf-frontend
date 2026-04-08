"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function PrivateRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    setChecked(true);
  }, []);

  useEffect(() => {
    if (!checked) return;

    if (!isAuthenticated) {
      router.replace("/login");
    }
  }, [checked, isAuthenticated, router]);

  if (!checked) return null;

  if (!isAuthenticated) return null;

  return <>{children}</>;
}
