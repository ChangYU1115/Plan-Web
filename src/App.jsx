import React, { useState } from "react";

function App() {
  const [selectedDate, setSelectedDate] = useState("");
  const [result, setResult] = useState([]);
  const parsedDate = new Date(selectedDate);
  const dayOfYear = parsedDate.getFullYear();
  const dayOfDate = parsedDate.getDate();
  const dayOfDay = parsedDate.getDay();
  const dayOfMonth = parsedDate.getUTCMonth() + 1;

  const TotalDay = [
    [dayOfMonth, dayOfDate],
    [dayOfMonth, dayOfDate + 1],
    [dayOfMonth, dayOfDate + 5],
    [dayOfMonth, dayOfDate + 7],
    [dayOfMonth, dayOfDate + 14],
    [dayOfMonth, dayOfDate + 21],
    [dayOfMonth, dayOfDate + 28],
  ];

  let Day;
  if ([4, 6, 9, 11].includes(dayOfMonth)) {
    Day = 30;
  } else if ([1, 3, 5, 7, 8, 10, 12].includes(dayOfMonth)) {
    Day = 31;
  } else {
    Day = 28;
  }
  console.log(Day);

  const MonthAndDay = [];

  const handleGetDayClick = (e) => {
    e.preventDefault();
    const newResult = [];
    for (let i = 0; i < TotalDay.length; i++) {
      let text = "";
      if (TotalDay[i][1] > Day) {
        const NextMonth = TotalDay[i][1] - Day;
        MonthAndDay.push([dayOfMonth + 1, NextMonth]);
        text = `您選擇的是${dayOfMonth + 1}月${NextMonth}日`;
      } else {
        const ThisMonth = TotalDay[i][1];
        MonthAndDay.push([dayOfMonth, ThisMonth]);
        text = `您選擇的是${dayOfMonth}月${ThisMonth}日`;
      }
      newResult.push(<p key={i}>{text}</p>);
    }

    setResult(newResult);
  };

  return (
    <div>
      <input
        type="date"
        id="dateInput"
        value={selectedDate}
        onChange={(e) => setSelectedDate(e.target.value)}
      />
      <button id="getDayButton" onClick={handleGetDayClick}>
        获取日期的日
      </button>
      <div id="result">{result}</div>
    </div>
  );
}

export default App;
