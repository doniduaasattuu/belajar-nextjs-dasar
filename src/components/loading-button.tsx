import { Button, ButtonProps } from "@/components/ui/button";
import { Loader } from "lucide-react";

interface LoadingButtonProps extends ButtonProps {
  loading?: boolean;
}

export function LoadingButton({
  loading,
  children,
  ...props
}: LoadingButtonProps) {
  return (
    <Button disabled={loading || props.disabled} {...props}>
      {loading ? <Loader className="animate-spin" /> : children}
    </Button>
  );
}
