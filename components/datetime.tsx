import dayjs from "dayjs";

type DateTimeProps = {
  time?: boolean;
  timeAgo?: boolean;
  date?: Date;
};

export default function DateTime({ date, time, timeAgo }: DateTimeProps) {
  const dateTime = dayjs(date);
  const nowTime = dayjs();

  // 경과시간
  if (timeAgo) {
    const diffTime = (Number(nowTime) - Number(dateTime)) / 1000;
    const times = [
      { name: "년", ms: 60 * 60 * 24 * 365 },
      { name: "개월", ms: 60 * 60 * 24 * 30 },
      { name: "일", ms: 60 * 60 * 24 },
      { name: "시간", ms: 60 * 60 },
      { name: "분", ms: 60 },
    ];
    for (const val of times) {
      const betweenTime = Math.floor(diffTime / val.ms);

      if (betweenTime > 0) {
        return (
          <>
            {betweenTime}
            {val.name} 전
          </>
        );
      }
    }
    return <>방금 전</>;
  }

  // 시간:분
  if (time) {
    return <>{dateTime.format("HH:mm")}</>;
  }
  // 년:월:일 시:분:초
  return <>{dateTime.format("YYYY년 MM월 DD일 HH:mm:ss")}</>;
}
