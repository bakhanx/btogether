import { useEffect, useState } from "react";

// 기기 편차 - 보정값
const D = 100;

export const usePagination = () => {
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const handleScroll = () => {
    const scrollHeight = document.documentElement.scrollHeight;
    const scrollTop = document.documentElement.scrollTop;
    const clientHeight = window.innerHeight;
    if (scrollTop + clientHeight >= scrollHeight - D) {
      // setPage((prev) => prev + 1);
      setIsLoading(true);
    }
  };

  // Mobile innerHeight 에러로 인한 임시코드
  useEffect(() => {
    if (isLoading) {
      setTimeout(() => {
        setPage((prev) => prev + 1);
        setIsLoading(false);
      }, 300);
    }
  }, [isLoading, page]);

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
