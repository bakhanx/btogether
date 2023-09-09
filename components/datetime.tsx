type DateTimeProps = {
  time?: boolean;
  timeAgo?: boolean;
  date?: Date;
}

export default function DateTime({ date, time, timeAgo }: DateTimeProps) {
  
  const dateTime = new Date(date ? date : "");
  const nowTime = new Date(Date.now());

  const year = dateTime.getFullYear();
  const month = `${dateTime.getMonth() + 1 < 10 ? 0 : ""}${
    dateTime.getMonth() + 1
  }`;
  const day = `${dateTime.getDate() + 1 < 10 ? 0 : ""}${
    dateTime.getDate()
  }`;
  const hours = `${dateTime.getHours() + 1 < 10 ? 0 : ""}${
    dateTime.getHours()
  }`;
  const minutes = `${dateTime.getMinutes() + 1 < 10 ? 0 : ""}${
    dateTime.getMinutes()
  }`;
  const seconds = `${dateTime.getSeconds() + 1 < 10 ? 0 : ""}${
    dateTime.getSeconds()
  }`;

  // 시간:분
  if (time) {
    return (
      <>
        {dateTime && (
          <>
            {hours}:{minutes}
          </>
        )}
      </>
    );
  }

  // 경과시간
  if (timeAgo) {
    const diff = (Number(nowTime) - Number(dateTime)) / 1000;
    const times = [
      { name: "년", ms: 60 * 60 * 24 * 365 },
      { name: "개월", ms: 60 * 60 * 24 * 30 },
      { name: "일", ms: 60 * 60 * 24 },
      { name: "시간", ms: 60 * 60 },
      { name: "분", ms: 60 },
    ];

    for (const val of times) {
      const betweenTime = Math.floor(diff / val.ms);

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

  // 년월일시분초
  return (
    <>
      {dateTime && (
        <>
          {year}년 {month}월 {day}일 {hours}:{minutes}:{seconds}
        </>
      )}
    </>
  );
}
