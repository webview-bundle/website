import { SOURCE_FILES, WEBVIEW_HOSTS } from '../data';
import { ChevronRightIcon } from './icons';
import { Logo } from './Logo';

function ColumnLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-3 font-mono text-[10.5px] tracking-widest text-zinc-500 uppercase">
      {children}
    </div>
  );
}

export function ArchitectureDiagram() {
  return (
    <div className="rounded-xl border border-zinc-200 bg-zinc-50/60 p-6 sm:p-8 dark:border-zinc-900 dark:bg-[#0e0e0f]">
      <div className="mb-6 flex items-center justify-between">
        <span className="font-mono text-[11px] tracking-widest text-zinc-500 uppercase">
          Architecture
        </span>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Your source */}
        <div>
          <ColumnLabel>your source</ColumnLabel>
          <div className="space-y-2">
            {SOURCE_FILES.map(file => (
              <div
                key={file}
                className="flex items-center gap-2 rounded border border-zinc-200 bg-white px-3 py-1.5 font-mono text-[11.5px] text-zinc-700 dark:border-zinc-800 dark:bg-[#141414] dark:text-zinc-300"
              >
                <span className="size-1.5 rounded-sm bg-zinc-400" />
                {file}
              </div>
            ))}
          </div>
        </div>

        {/* The bundle */}
        <div className="relative">
          <ColumnLabel>bundle</ColumnLabel>
          <div className="flex aspect-[4/3] items-center justify-center rounded-lg border-2 border-dashed border-zinc-300 bg-white dark:border-zinc-800 dark:bg-[#141414]">
            <div className="text-center">
              <Logo width={48} height={48} className="mx-auto mb-3" />
              <div className="font-mono text-[12px] font-medium">app.wvb</div>
              <div className="font-mono text-[10.5px] text-zinc-500">2.1 MB · ed25519</div>
            </div>
          </div>
          <ChevronRightIcon className="absolute top-1/2 -left-5 hidden size-5 -translate-y-1/2 text-zinc-400 md:block" />
          <ChevronRightIcon className="absolute top-1/2 -right-5 hidden size-5 -translate-y-1/2 text-zinc-400 md:block" />
        </div>

        {/* Webview host */}
        <div>
          <ColumnLabel>webview host</ColumnLabel>
          <div className="space-y-2">
            {WEBVIEW_HOSTS.map(({ platform, runtime }) => (
              <div
                key={platform}
                className="flex items-center justify-between rounded border border-zinc-200 bg-white px-3 py-1.5 font-mono text-[11.5px] dark:border-zinc-800 dark:bg-[#141414]"
              >
                <span className="text-zinc-700 dark:text-zinc-300">{platform}</span>
                <span className="text-zinc-500">{runtime}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 border-t border-zinc-200 pt-4 text-center font-mono text-[10.5px] tracking-widest text-zinc-500 uppercase dark:border-zinc-900">
        versioned · signed · offline
      </div>
    </div>
  );
}
