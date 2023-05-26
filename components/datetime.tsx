interface DateTimeProps {
  time?: boolean;
  timeAgo?: boolean;
  date: Date;
}

export default function DateTime({ date, time, timeAgo }: DateTimeProps) {
  const dateTime = new Date(date);

  if(time){
    return(
        <>
        {dateTime && (
            <>
                {dateTime.getHours()}:{dateTime.getMinutes()}
            </>
        )
        }
        </>
    )
    
  }

  return (
    <> 

       


        {dateTime && ( 
            <> 
                {dateTime.getFullYear()}-
                {dateTime.getMonth() + 1 < 10 ? 0 : ""}{dateTime.getMonth() + 1}-
                {dateTime.getDate()} 
                {" "}
                {dateTime.getHours()}:{dateTime.getMinutes()}:{dateTime.getSeconds()}
            </>
        )}
    </>
  );
}
