import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";

import { cn } from "../../../lib/utils";

const Tabs = TabsPrimitive.Root;
const TabsList = TabsPrimitive.List;
const TabsTrigger = TabsPrimitive.Trigger;
const TabsContent = TabsPrimitive.Content;

const tabsVariants = {
  default: "h-10 w-full flex-1 items-center justify-center rounded-md border border-transparent bg-muted px-4 text-sm font-medium text-muted-foreground hover:bg-muted/80 data-[state=active]:bg-background data-[state=active]:text-muted-foreground data-[state=active]:border-b-2 data-[state=active]:border-primary",
};

interface TabsListProps extends React.ComponentProps<typeof TabsList> {
  className?: string;
}

const TabsListComponent = React.forwardRef<
  HTMLDivElement,
  TabsListProps
>(({ className, ...props }, ref) => (
  <TabsList
    ref={ref}
    className={cn(
      "flex h-10 w-full items-center justify-center rounded-md border bg-background p-1",
      className
    )}
    {...props}
  />
));
TabsListComponent.displayName = TabsPrimitive.List.displayName;

interface TabsTriggerProps extends React.ComponentProps<typeof TabsTrigger> {
  className?: string;
}

const TabsTriggerComponent = React.forwardRef<
  HTMLButtonElement,
  TabsTriggerProps
>(({ className, ...props }, ref) => (
  <TabsTrigger
    ref={ref}
    className={cn(tabsVariants.default, className)}
    {...props}
  />
));
TabsTriggerComponent.displayName = TabsPrimitive.Trigger.displayName;

interface TabsContentProps extends React.ComponentProps<typeof TabsContent> {
  className?: string;
}

const TabsContentComponent = React.forwardRef<
  HTMLDivElement,
  TabsContentProps
>(({ className, ...props }, ref) => (
  <TabsContent
    ref={ref}
    className={cn("mt-2 ring-offset-background focus-visible:outline-none", className)}
    {...props}
  />
));
TabsContentComponent.displayName = TabsPrimitive.Content.displayName;

export {
  Tabs,
  TabsListComponent as TabsList,
  TabsTriggerComponent as TabsTrigger,
  TabsContentComponent as TabsContent,
};