import { cn } from '@/lib/utils';

export const Avatar = ({
  src,
  alt,
  fallback,
  className,
}: {
  src?: string | null;
  alt?: string;
  fallback?: string;
  className?: string;
}) => {
  if (src) {
    return (
      <img
        src={src}
        alt={alt || fallback || 'Avatar'}
        className={cn('h-10 w-10 rounded-full object-cover', className)}
      />
    );
  }

  return (
    <div
      className={cn(
        'flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-sm font-semibold text-indigo-700',
        className
      )}
    >
      {fallback ? fallback.slice(0, 2).toUpperCase() : '?'}
    </div>
  );
};
