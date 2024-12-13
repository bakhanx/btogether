import { useEffect, useState } from "react";

// 기기 편차 - 보정값
const D = 300;

export const usePagination = (totalPages: number) => {
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const handleScroll = () => {
    const scrollHeight = document.documentElement.scrollHeight;
    const scrollTop = document.documentElement.scrollTop;
    const clientHeight = window.innerHeight;
    if (
      scrollTop + clientHeight >= scrollHeight &&
      !isLoading &&
      page < totalPages
    ) {
      setIsLoading(true);
    }
  };

  useEffect(() => {
    if (isLoading && page < totalPages) {
      setTimeout(() => {
        setPage((prev) => prev + 1);
        setIsLoading(false);
      }, 300);
    }
  }, [isLoading, page, totalPages]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("touchMove", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("touchMove", handleScroll);
    };
  }, []);

  return page;
};
