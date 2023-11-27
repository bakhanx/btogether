export default function ScrollToTopButton() {
  const scrollToTop = () => {
    window.scrollTo(0, 0);
  };
  return (
    <div className="relative right-6  bottom-28 border-none">
      <div
        onClick={scrollToTop}
        className="flex h-10 w-10  cursor-pointer items-center justify-center rounded-full border-0 bg-gray-200 font-bold shadow-sm hover:bg-gray-300"
      >
        ↑
      </div>
    </div>
  );
}
