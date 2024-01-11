import { useEffect, useState } from "react";

export const usePagination = () => {
  const [isloading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const handleScroll = () => {
    const scrollHeight = document.documentElement.scrollHeight;
    const scrollTop = document.documentElement.scrollTop;
    const clientHeight = window.innerHeight;
    if (scrollTop + clientHeight >= scrollHeight) {
      setPage((prev) => prev + 1);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("touchMove", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("touchMove", handleScroll);
    };
  }, [page]);

  return page;
};
