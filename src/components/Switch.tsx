import clsx from 'clsx';
import { ComponentPropsWithoutRef } from 'react';

interface SwitchProps extends ComponentPropsWithoutRef<'button'> {
  active: boolean;
  label?: string;
}

export const Switch = ({ active, label, className, ...props }: SwitchProps) => {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={active}
      className={clsx(
        'relative inline-flex h-7 w-14 items-center rounded-full border border-white/40 bg-white/20 px-1 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/70',
        active ? 'bg-cyan-500/70 shadow-lg' : 'bg-white/10',
        className
      )}
      {...props}
    >
      <span
        className={clsx(
          'inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-all duration-300',
          active ? 'translate-x-7' : 'translate-x-0'
        )}
      />
      {label ? (
        <span className="sr-only">
          {label}
        </span>
      ) : null}
    </button>
  );
};
