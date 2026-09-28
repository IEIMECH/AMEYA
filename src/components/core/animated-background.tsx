'use client';

import {
  Children,
  cloneElement,
  ReactElement,
  useEffect,
  useState,
  useId,
} from 'react';
import { AnimatePresence, Transition, motion } from 'framer-motion';

export type AnimatedBackgroundProps = {
  children: ReactElement[] | ReactElement;
  defaultValue?: string;
  onValueChange?: (newActiveId: string | null) => void;
  className?: string;
  transition?: Transition;
  enableHover?: boolean;
};

export function AnimatedBackground({
  children,
  defaultValue,
  onValueChange,
  className,
  transition = {
    type: 'spring',
    bounce: 0.2,
    duration: 0.3,
  },
  enableHover = false,
}: AnimatedBackgroundProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const uniqueId = useId();

  const handleSetActiveId = (id: string | null) => {
    setActiveId(id);
    if (onValueChange) {
      onValueChange(id);
    }
  };

  useEffect(() => {
    if (defaultValue !== undefined) {
      setActiveId(defaultValue);
    }
  }, [defaultValue]);

  return (
    <>
      {Children.map(children, (child: any, index) => {
        if (!child) return null;
        const id = child.props['data-id'] ?? child.props.id ?? child.key ?? `${uniqueId}-${index}`;
        const isActive = activeId === id;

        const interactionProps = enableHover
          ? {
              onMouseEnter: (e: React.MouseEvent) => {
                handleSetActiveId(id);
                child.props.onMouseEnter?.(e);
              },
              onMouseLeave: (e: React.MouseEvent) => {
                if (defaultValue !== undefined) {
                  handleSetActiveId(defaultValue);
                } else {
                  handleSetActiveId(null);
                }
                child.props.onMouseLeave?.(e);
              },
            }
          : {
              onClick: (e: React.MouseEvent) => {
                handleSetActiveId(id);
                child.props.onClick?.(e);
              },
            };

        return cloneElement(
          child,
          {
            key: id,
            className: `${child.props.className ?? ''}`,
            'data-checked': isActive ? 'true' : 'false',
            ...interactionProps,
          },
          <>
            <AnimatePresence initial={false}>
              {isActive && (
                <motion.div
                  layoutId={`background-${uniqueId}`}
                  className={className}
                  transition={transition}
                  initial={{ opacity: defaultValue ? 1 : 0 }}
                  animate={{
                    opacity: 1,
                    transition: {
                      type: 'spring',
                      bounce: 0.2,
                      duration: 0.3,
                      ...transition,
                    },
                  }}
                  exit={{
                    opacity: 0,
                    transition: {
                      type: 'spring',
                      bounce: 0.2,
                      duration: 0.3,
                      ...transition,
                    },
                  }}
                />
              )}
            </AnimatePresence>
            <span style={{ position: 'relative', zIndex: 1 }}>{child.props.children}</span>
          </>
        );
      })}
    </>
  );
}
