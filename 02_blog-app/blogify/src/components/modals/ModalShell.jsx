import React from "react";
import { FiX } from "react-icons/fi";

export function ModalShell({ title, children, onClose }) {
  return (
    <div className="fixed inset-0 z-40 grid place-items-center bg-slate-950/65 px-4 py-6 backdrop-blur-md">
      <div className="max-h-[92vh] w-full max-w-md overflow-y-auto rounded-[2rem] glass-panel p-5 shadow-2xl relative border border-white/10 z-50">
        <div className="mb-5 flex items-center justify-between gap-4">
          <h2 className="text-xl font-black text-white">{title}</h2>
          <button
            onClick={onClose}
            className="grid h-9 w-9 place-items-center rounded-xl bg-white/5 border border-white/10 text-violet-300 hover:bg-white/10"
            title="Close"
          >
            <FiX />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export default ModalShell;
