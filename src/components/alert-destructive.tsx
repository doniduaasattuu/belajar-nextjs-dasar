import { AlertCircle } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

type Alert = {
  destructive?: boolean;
  header?: string;
  message?: string;
};

export function AlertDestructive(alert: Alert, ...props: unknown[]) {
  const isDestructive = alert.destructive ?? true;

  return (
    <Alert variant={isDestructive ? "destructive" : "default"} {...props}>
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>{alert.header ?? "Error"}</AlertTitle>
      <AlertDescription>{alert.message ?? "Error occured"}</AlertDescription>
    </Alert>
  );
}
