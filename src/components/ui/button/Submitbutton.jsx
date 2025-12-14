export const SubmitButton = ( {label} ) => {
  return (
    <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 shadow h-9 py-2 bg-[#e50914] hover:bg-[#b20710] text-white px-8">
      {label}
    </button>
  );
};
