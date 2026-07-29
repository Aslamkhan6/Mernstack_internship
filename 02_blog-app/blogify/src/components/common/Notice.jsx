function Notice({ message }) {
  if (!message) return null;

  return (
    <div className="fixed bottom-24 left-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white shadow-2xl lg:bottom-6">
      {message}
    </div>
  );
}

export default Notice;
