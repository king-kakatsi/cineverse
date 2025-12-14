export const Textarea = ({placeholder}) => {
  return (
    <textarea
      className="flex min-h-[60px] w-full rounded-md border px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm bg-black/50 border-gray-700 text-white mb-4"
      rows="4"
      placeholder={placeholder}
    ></textarea>
  );
};
