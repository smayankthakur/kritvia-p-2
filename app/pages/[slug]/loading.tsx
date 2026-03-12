export default function PageLoading() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center py-12">
      <div className="animate-pulse bg-neutral-800/50 rounded-xl w-full max-w-4xl p-6">
        <h2 className="text-2xl font-bold mb-4 text-white">Loading page...</h2>
        <div className="space-y-4">
          <div className="h-4 bg-neutral-700/50 rounded w-1/2"></div>
          <div className="h-4 bg-neutral-700/50 rounded w-3/4"></div>
          <div className="h-4 bg-neutral-700/50 rounded w-full"></div>
          <div className="h-4 bg-neutral-700/50 rounded w-1/3"></div>
        </div>
      </div>
    </div>
  );
}