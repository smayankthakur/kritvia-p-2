import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";

interface LabelProps
  extends React.LabelHTMLAttributes<HTMLLabelElement> {
  asChild?: boolean;
}

const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, asChild = false, ...props }, ref) => {
    const Comp = asChild ? "label" : "label";
    return (
      <Slot
        className={cn("text-sm font-medium text-gray-900", className)}
        ref={ref as React.Ref<HTMLLabelElement>}
        {...props}
      />
    );
  }
);
Label.displayName = "Label";

export { Label };