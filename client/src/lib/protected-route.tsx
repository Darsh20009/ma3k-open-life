import { Route, RouteProps } from "wouter";
import { useAuth } from "@/hooks/use-auth";

export function ProtectedRoute(props: RouteProps) {
  return <Route {...props} />;
}