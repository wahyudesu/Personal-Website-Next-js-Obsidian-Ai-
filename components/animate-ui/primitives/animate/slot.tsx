'use client';

import * as React from 'react';
import { motion, isMotionComponent, type HTMLMotionProps } from 'motion/react';
import { cn } from '@/lib/utils';

type AnyProps = Record<string, unknown>;

type DOMMotionProps<T extends HTMLElement = HTMLElement> = Omit<
  HTMLMotionProps<keyof HTMLElementTagNameMap>,
  'ref'
> & { ref?: React.Ref<T> };

type WithAsChild<Base extends object> =
  | (Base & { asChild: true; children: React.ReactElement })
  | (Base & { asChild?: false | undefined });

type SlotProps<T extends HTMLElement = HTMLElement> = {
  children?: any;
} & DOMMotionProps<T>;

function mergeRefs<T>(
  ...refs: (React.Ref<T> | undefined)[]
): React.RefCallback<T> {
  return (node) => {
    refs.forEach((ref) => {
      if (!ref) return;
      if (typeof ref === 'function') {
        ref(node);
      } else {
        (ref as React.MutableRefObject<T | null>).current = node;
      }
    });
  };
}

function mergeProps<T extends HTMLElement>(
  childProps: AnyProps,
  slotProps: DOMMotionProps<T>,
): AnyProps {
  const merged: AnyProps = { ...childProps, ...slotProps };

  if (childProps.className || slotProps.className) {
    merged.className = cn(
      childProps.className as string,
      slotProps.className as string,
    );
  }

  if (childProps.style || slotProps.style) {
    merged.style = {
      ...(childProps.style as React.CSSProperties),
      ...(slotProps.style as React.CSSProperties),
    };
  }

  return merged;
}

function Slot<T extends HTMLElement = HTMLElement>({
  children,
  ref,
  ...props
}: SlotProps<T>) {
  // Normalize children: React.Children.only will throw during SSR if multiple
  // children are passed. Accept arrays by picking the first element and warn
  // to avoid build-time prerender errors while keeping behavior predictable.
  const childArray = React.Children.toArray(children) as React.ReactNode[];
  let normalizedChild: React.ReactElement | null = null;

  if (childArray.length > 1) {
    console.warn(
      'Slot expected a single React element child but received multiple. Using the first child.'
    );
    const first = childArray[0];
    normalizedChild = React.isValidElement(first) ? (first as React.ReactElement) : null;
  } else if (childArray.length === 1) {
    const first = childArray[0];
    normalizedChild = React.isValidElement(first) ? (first as React.ReactElement) : null;
  }

  // If children is already a single valid element, use it directly
  if (!normalizedChild && React.isValidElement(children)) {
    normalizedChild = children as React.ReactElement;
  }

  const childType = (normalizedChild as any)?.type;

  const isAlreadyMotion =
    typeof childType === 'object' && childType !== null && isMotionComponent(childType);

  // Call hooks unconditionally to satisfy the rules of hooks. If there's no
  // childType we'll still create a default motion.div as Base (it's never
  // rendered because we return early below), but this keeps hook order stable.
  const Base = React.useMemo(() => {
    if (!childType) return motion.div as React.ElementType;
    return isAlreadyMotion ? (childType as React.ElementType) : motion.create(childType as React.ElementType);
  }, [isAlreadyMotion, childType]);

  if (!normalizedChild) return null;

  const { ref: childRef, ...childProps } = normalizedChild.props as AnyProps;

  const mergedProps = mergeProps(childProps, props);

  return (
    <Base {...mergedProps} ref={mergeRefs(childRef as React.Ref<T>, ref)} />
  );
}

export {
  Slot,
  type SlotProps,
  type WithAsChild,
  type DOMMotionProps,
  type AnyProps,
};
