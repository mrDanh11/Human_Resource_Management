// Skeleton loading
export default function ProfileSkeleton() {
  return (
    <div className="animate-pulse flex gap-10">
      <div className="w-[320px] h-112.5 bg-gray-200 rounded-xl"></div>

      <div className="flex-1 flex flex-col gap-8">
        <div className="h-45 bg-gray-200 rounded-xl" />
        <div className="h-45 bg-gray-200 rounded-xl" />
        <div className="h-45 bg-gray-200 rounded-xl" />
      </div>
    </div>
  );
}
