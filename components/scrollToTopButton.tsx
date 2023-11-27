export default function ScrollToTopButton() {
  const scrollToTop = () => {
    window.scrollTo(0, 0);
  };
  return (
    <div className="relative bottom-24 right-0 flex max-w-screen-xl  border-none">
      <div
        onClick={scrollToTop}
        className="flex h-10 w-10  cursor-pointer items-center justify-center rounded-full border-0 bg-blue-500"
      >
        ⬆
      </div>
    </div>
  );
}
