import React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";

interface PulsatingButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  pulseColor?: string;
  duration?: string;
  asChild?: boolean;
}

export const PulsatingButton = React.forwardRef<
  HTMLButtonElement,
  PulsatingButtonProps
>(
  (
    {
      className,
      children,
      pulseColor = "#0096ff",
      duration = "1.5s",
      asChild = false,
      ...props
    },
    ref,
  ) => {
    const baseClass = cn(
      "relative flex cursor-pointer items-center justify-center rounded-lg bg-neutral-900 px-4 py-2 text-center text-neutral-50 dark:bg-neutral-50 dark:text-neutral-900",
      className,
    );

    // If asChild is true we must ensure we pass exactly one child to the Radix
    // Slot. When we need additional decorative elements (the pulse overlay)
    // we clone the child and inject those elements inside it so the Slot only
    // ever receives a single element.
    if (asChild) {
      const childArray = React.Children.toArray(children);
      const first = childArray[0];
      if (!React.isValidElement(first)) return null;

      const mergedStyle = {
        ...(first.props.style as React.CSSProperties),
        "--pulse-color": pulseColor,
        "--duration": duration,
      } as React.CSSProperties;

      const mergedClassName = cn(first.props.className, baseClass);

      const newChildren = (
        <>
          {first.props.children}
          <div className="absolute left-1/2 top-1/2 size-full -translate-x-1/2 -translate-y-1/2 animate-pulse rounded-lg bg-inherit" />
        </>
      );

      // `ref` is a special prop and TypeScript's React types don't allow it
      // in the props parameter of cloneElement. Cast to `any` to preserve
      // runtime behavior and keep the types happy for the build.
      return React.cloneElement(first as React.ReactElement<any>, {
        ...(props as any),
        className: mergedClassName,
        style: mergedStyle,
        children: newChildren,
        ref,
      } as any);
    }

    return (
      <button
        ref={ref}
        className={baseClass}
        style={
          {
            "--pulse-color": pulseColor,
            "--duration": duration,
          } as React.CSSProperties
        }
        {...props}
      >
        <div className="relative z-10">{children}</div>
        <div className="absolute left-1/2 top-1/2 size-full -translate-x-1/2 -translate-y-1/2 animate-pulse rounded-lg bg-inherit" />
      </button>
    );
  },
);

PulsatingButton.displayName = "PulsatingButton";
