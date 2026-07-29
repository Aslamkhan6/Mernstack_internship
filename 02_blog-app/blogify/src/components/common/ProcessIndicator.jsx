import React from "react";

export function ProcessIndicator({ message = "Processing..." }) {
  return (
    <div className="fixed inset-0 z-[100] grid place-items-center bg-slate-950/70 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4 rounded-2xl bg-slate-900/80 border border-white/10 px-8 py-6 shadow-2xl">
        <div className="relative">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-violet-500/30 border-t-violet-500"></div>
          <div className="absolute inset-0 h-10 w-10 animate-ping rounded-full border-2 border-fuchsia-500/20"></div>
        </div>
        <p className="text-xs font-semibold text-violet-200">{message}</p>
      </div>
    </div>
  );
}

export default ProcessIndicator;