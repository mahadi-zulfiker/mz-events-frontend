'use client';

import { FiAlertTriangle } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { cn } from '@/lib/utils';

type ConfirmToastOptions = {
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  tone?: 'default' | 'danger';
  onConfirm: () => void | Promise<void>;
};

export const confirmToast = ({
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  tone = 'default',
  onConfirm,
}: ConfirmToastOptions) => {
  toast.custom(
    (t) => (
      <div className="max-w-sm rounded-2xl border border-white/10 bg-slate-950 p-4 text-white shadow-2xl shadow-black/40">
        <div className="flex items-start gap-3">
          <div
            className={cn(
              'mt-1 rounded-full p-2',
              tone === 'danger' ? 'bg-red-500/20 text-red-100' : 'bg-indigo-500/20 text-indigo-100'
            )}
          >
            <FiAlertTriangle className="h-4 w-4" />
          </div>
          <div className="flex-1">
            <p className="font-semibold leading-tight">{title}</p>
            {description && <p className="mt-1 text-sm text-slate-200">{description}</p>}
            <div className="mt-3 flex gap-2">
              <button
                onClick={() => {
                  toast.dismiss(t.id);
                  onConfirm();
                }}
                className={cn(
                  'flex-1 rounded-lg px-3 py-2 text-sm font-semibold transition',
                  tone === 'danger'
                    ? 'bg-red-500 text-white hover:bg-red-400'
                    : 'bg-indigo-500 text-white hover:bg-indigo-400'
                )}
              >
                {confirmText}
              </button>
              <button
                onClick={() => toast.dismiss(t.id)}
                className="flex-1 rounded-lg border border-white/20 px-3 py-2 text-sm font-semibold text-slate-100 transition hover:bg-white/5"
              >
                {cancelText}
              </button>
            </div>
          </div>
        </div>
      </div>
    ),
    { duration: 8000, position: 'top-right' }
  );
};
