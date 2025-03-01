import { Button, ButtonProps } from "@/components/ui/button";
import { Loader } from "lucide-react";

interface LoadingButtonProps extends ButtonProps {
  loading?: boolean;
  className?: string;
}

export function LoadingButton({
  loading,
  children,
  className,
  ...props
}: LoadingButtonProps) {
  return (
    <Button
      className={className}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? <Loader className="animate-spin" /> : children}
    </Button>
  );
}
