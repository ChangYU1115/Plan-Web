import React, { useRef, useState } from "react";
import ReactDOM from "react-dom";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import "./style/style.css";
import html2canvas from "html2canvas";
import "font-awesome/css/font-awesome.min.css";

function MyCalendar() {
  const divRef = useRef(null);
  // 呼叫 FullCalendar 元素
  const calendarRef = useRef(null);
  // 取得輸入的日期 元素
  const dateInputRef = useRef(null);
  // 取得計畫標題 元素
  const titleInputRef = useRef(null);
  // 取得 List 標題 元素
  const ListTitleInputRef = useRef(null);
  // 取得 List 內容 元素
  const ListInputRef = useRef(null);
  // 取得 計畫日期中 h1標籤
  const targetDivRef = useRef(null);

  // 呼叫組件
  const [events, setEvents] = useState([]);
  // 輸入的日期
  const [selectedDate, setSelectedDate] = useState("");
  // 7個日期
  const [result, setResult] = useState([]);
  // List 內容
  const [result2, setResult2] = useState([]);
  // 大標題
  const [title, setTitle] = useState("英文單字計畫表");
  // 取得 list 內容
  const [inputValues, setInputValues] = useState([]);

  const [allNewEvents, setAllNewEvents] = useState([]);

  // 取得使用者所使用的時間 (JS中的Date)
  const parsedDate = new Date(selectedDate);
  //取得年份
  const dayOfYear = parsedDate.getFullYear();
  // 取得月份(從0開始，因此+1)
  const dayOfMonth = parsedDate.getUTCMonth() + 1;
  // 取得日期
  const dayOfDate = parsedDate.getDate();

  // 建立一個 array，取得7個記憶日期，分別是第0、1、4、6、13、20、27 天
  const TotalDay = [
    [dayOfYear, dayOfMonth, dayOfDate],
    [dayOfYear, dayOfMonth, dayOfDate + 1],
    [dayOfYear, dayOfMonth, dayOfDate + 5],
    [dayOfYear, dayOfMonth, dayOfDate + 7],
    [dayOfYear, dayOfMonth, dayOfDate + 14],
    [dayOfYear, dayOfMonth, dayOfDate + 21],
    [dayOfYear, dayOfMonth, dayOfDate + 28],
  ];

  // 因每個月天數不同，因此建立一個Day變數用來取得每個月共有幾天，如月份為4、6、9、11當月則為30天。如月份為1、3、5、7、8、10、12當月則為31天。如月份為2，則當月有28天。
  let Day;
  if ([4, 6, 9, 11].includes(dayOfMonth)) {
    Day = 30;
  } else if ([1, 3, 5, 7, 8, 10, 12].includes(dayOfMonth)) {
    Day = 31;
  } else {
    Day = 28;
  }

  // 按下輸入鈕後執行下列函式
  const handleGoToDate = (e) => {
    // 避免重整
    e.preventDefault();
    // 裝7個日期內容(顯示在頁面List上的)
    const newResult = [];
    // 裝符合 fullcalendar 的格式日期 "2023-11-15" ()
    const OverDay = [];
    // 裝符合 fullcalendar 的格式日期 "2023-11-15" ()
    const unOverDay = [];

    // 此迴圈用來將TotalDay中7個日期轉換成裝符合 fullcalendar 的格式日期
    for (let i = 0; i < TotalDay.length; i++) {
      let text = "";
      // 如日期大於該月份的日期，因像是如選擇2023-11-15，dayOfDate + 28 會使得 日期變成2023-11-43
      if (TotalDay[i][2] > Day) {
        // NextMonth ，如 2023-11-15，因前面將11月設為30，因此Day值為30，計算則為43-30=13。
        const NextMonth = TotalDay[i][2] - Day;
        // 因 fullcalendar 需要是兩位數，如遇到像 2023-11-3則會無法辨識，因此加入0，轉換為 2023-11-03。
        // padStart(共要幾字元, 補充的值)。如 "1".padStart(5, "0") -> 00001。從左邊開始補值。用於補充字串。
        const convertDay = String(NextMonth).padStart(2, "0");
        // 因日期超出代表會到下個月，因此月份(dayOfMonth)會加1。並且一樣如遇到個位數月份則補 0。
        let converMonth = String(dayOfMonth + 1).padStart(2, "0");
        // 如果月份大於12，會將月份轉為 01 月，再輸出 List 文字以及將符合 fullcalendar 的格式日期存入CCC中，如小於12月則直接輸出文字與格式日期。
        if (converMonth > 12) {
          converMonth = "01";
          text = `${dayOfYear + 1}-${converMonth}-${convertDay}`;
          OverDay.push(text);
        } else {
          text = `${dayOfYear}-${converMonth}-${convertDay}`;
          OverDay.push(text);
        }
        // 如日期小於該月份的日期
      } else {
        // 小於的話則不會有超出月份日期的問題，因此直接將日期存入變數 ThisMonth 中
        const ThisMonth = TotalDay[i][2];
        // 因 fullcalendar 需要是兩位數，如遇到像 2023-11-3則會無法辨識，因此加入0，轉換為 2023-11-03。
        const convertDay = String(ThisMonth).padStart(2, "0");
        // 因 fullcalendar 需要是兩位數，如遇到像 2023-1-15則會無法辨識，因此加入0，轉換為 2023-01-15。
        let converMonth = String(dayOfMonth).padStart(2, "0");
        // 如果月份大於12，會將月份轉為 01 月，再輸出 List 文字以及將符合 fullcalendar 的格式日期存入DDD中，如小於12月則直接輸出文字與格式日期。
        if (converMonth > 12) {
          converMonth = "01";
          text = `${dayOfYear + 1}-${converMonth}-${convertDay}`;
          unOverDay.push(text);
        } else {
          text = `${dayOfYear}-${converMonth}-${convertDay}`;
          unOverDay.push(text);
        }
      }
      // newResult 陣列放入7個包在<p>的值
      // 在前六個日期前加上 、
      if (i < 6) {
        text = text + "、";
        newResult.push(<p key={i}>{text}</p>);
      } else {
        text = text + "。";
        newResult.push(<p key={i}>{text}</p>);
      }
    }

    // 將兩個合併
    const combinedArray = unOverDay.concat(OverDay);

    // ***************

    setResult(newResult);

    // 變數 selectedTitle 裝入 List 標題輸入框的值。ListTitleInputRef.current 表示提取出該元素，並用元素中的value屬性來獲得值。
    const selectedTitle = ListTitleInputRef.current.value;
    // 清空 ListTitleInputRef 輸入框內容 (讓畫面好看一些)
    ListTitleInputRef.current.value = "";
    // 變數 allValues 裝入 inputValues (List內容) 的所有值。
    const allValues = [...inputValues];

    const newResult2 = [];

    if (allValues.length == 0) {
      let text = "";
      text = "無輸入內容";
      newResult2.push(<p key={0}>{text}</p>);
    }

    for (let i = 0; i < allValues.length; i++) {
      let text = "";
      text = `${allValues[i]}`;
      // 將含有 text 的 <p> 值 放入 newResult2 陣列中
      newResult2.push(<p key={i}>{text}</p>);
    }

    setResult2(newResult2);

    // 7個計劃日期的物件，每個事件都含有List標題(title: selectedTitle)、日期(start: combinedArray[k])、List內容(text: allValues)、讓事件變成按鈕(clickable: true)。放入一個 array中
    const newEventsArray = [];
    // 取得 fullcalendar 的 API，做連動。
    const calendarApi = calendarRef.current.getApi();

    // 建立 7個事件
    for (let k = 0; k < combinedArray.length; k++) {
      const newEvent = {
        title: selectedTitle,
        start: combinedArray[k],
        text: allValues,
        clickable: true,
      };

      // 將事件存入變數 newEventsArray
      newEventsArray.push(newEvent);
      // 取得 fullcalendar 的 API 同時更新
      calendarApi.addEvent(newEvent);
    }

    // 跳到該日期，選擇combinedArray[0]，是因為combinedArray陣列中的第一個為用戶輸入之日期
    calendarApi.gotoDate(combinedArray[0]);

    // ...為把陣列的值展開，如[1,2,3] -> 1,2,3。下列為將allNewEvents和newEventsArray兩個陣列都展開，newEventsArray串接在allNewEvents後
    setAllNewEvents([...allNewEvents, newEventsArray]);

    // 變數aaa為計畫的標題
    const aaa = titleInputRef.current.value;
    // ***********
    setTitle(aaa);

    // 清空 inputValues (List內容)
    setInputValues([]);
  };

  // 按下 List事件本身時觸發
  const handleEventClick = (eventInfo) => {
    if (targetDivRef.current) {
      targetDivRef.current.scrollIntoView({ behavior: "smooth" });
    }

    // 取得事件的標題
    const clickedEventTitle = eventInfo.event.title;

    // allNewEvents 為所有的事件
    // 找出所有事件中 List 名稱和點選事件名稱相同的事件
    // some() : 只要該陣列中有符合的就會返回ture。
    // find(): 取第一個滿足函式需求的值。
    const matchingNewEventsArray = allNewEvents.find((eventsArray) =>
      eventsArray.some((event) => event.title === clickedEventTitle)
    );

    const newResult1 = [];

    // 在前六個日期前加上 、
    for (let i = 0; i < matchingNewEventsArray.length; i++) {
      let text = "";
      if (i != 6) {
        text = matchingNewEventsArray[i].start + "、";
      } else {
        text = matchingNewEventsArray[i].start + "。";
      }
      newResult1.push(<p key={i}>{text}</p>);
    }

    setResult(newResult1);

    // 建立 newResult2 來存放事件中list 內容
    const newResult2 = [];
    // 因是同一個事件，選擇 matchingNewEventsArray中每個text裝的內容都一樣，因此選第一個即可。
    // 如果未輸入 list 內容則顯示 無輸入內容
    if (matchingNewEventsArray[0].text.length == 0) {
      let text = "";
      text = "無輸入內容";
      newResult2.push(<p key={0}>{text}</p>);
    }
    // 如果有輸入 list 內容則顯示輸入之內容
    for (let i = 0; i < matchingNewEventsArray[0].text.length; i++) {
      let text = "";
      text = `${matchingNewEventsArray[0].text[i]}`;

      // 將含有 text 的 <p> 值 放入 newResult2 陣列中
      newResult2.push(<p key={i}>{text}</p>);
    }

    // ***********
    setResult2(newResult2);
  };

  // 點選新增到列表按鈕後觸發
  const handleAddValue = () => {
    // 取得 List 內容的值
    const inputValue = ListInputRef.current.value;
    // 如果不是空值就將該值傳入 inputValues 陣列中
    // trim() : 去掉頭尾的空白字元
    if (inputValue.trim() !== "") {
      setInputValues([...inputValues, inputValue]);
      // 傳入後淨空值
      ListInputRef.current.value = "";
    }
  };

  // 點選 List 內容中的刪除按鈕時觸發
  const handleRemoveValue = (index, e) => {
    e.preventDefault();
    // 存放 List 內容的陣列
    const updatedValues = [...inputValues];
    // ****************
    updatedValues.splice(index, 1);
    //****************
    setInputValues(updatedValues);
  };

  const handleSaveCalendarAsImage = (e) => {
    e.preventDefault();
    // 选择FullCalendar的DOM元素
    const calendarElement = document.querySelector(".three");

    if (calendarElement) {
      // 使用html2canvas渲染DOM元素为图像
      html2canvas(calendarElement).then((canvas) => {
        // 转换为图像数据URL
        const imgData = canvas.toDataURL("image/png");

        // 创建一个链接元素用于下载
        const a = document.createElement("a");
        a.href = imgData;
        a.download = "calendar_image.png";

        // 触发下载
        a.click();
      });
    } else {
      console.error("FullCalendar element not found.");
    }
  };

  return (
    <div>
      <div className="nav">
        <h1 className="headTitle">
          間隔重複學習日期規劃網
          <img className="img" src="../plan-svgrepo-com.svg" alt="" />
        </h1>

        <div className="headText">
          {" "}
          <p>
            過往研究指出，間隔重複(Spaced
            repetition)是對於人們長期記憶有幫助的。
          </p>
          <p>
            本網頁的是幫助使用者能夠輸入學習當天的日期，並自動規劃出後面學習的日期
          </p>
          <p>(學習後的第2、4、8、14、21、28天複習)。</p>
          <p>並且您可透過儲存按鈕，將該月的規劃存成圖片ㄛ!!</p>
        </div>
      </div>

      <div className="Contents">
        <div className="">
          <form onSubmit={handleGoToDate} className="one">
            <div className="first">
              <h1 id="step">
                第一步
                <img
                  className="img"
                  src="../one-finger-svgrepo-com.svg"
                  alt=""
                />
              </h1>
              <h1>請選擇開始日期</h1>
              <input
                type="date"
                id="dateInput"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                ref={dateInputRef}
                required
                className="Date"
              />
              <br />
              <br />
              <h1>請填寫計畫標題</h1>
              <input
                className="Input"
                type="text"
                ref={titleInputRef}
                placeholder="英文單字計畫表"
              />
              <br></br>
              <br />
              <h1>請填寫List標題</h1>
              <input
                className="Input"
                type="text"
                ref={ListTitleInputRef}
                placeholder="Lesson 1"
                required
              />
            </div>
            <div className="second">
              <div>
                <h1 id="step">
                  第二步{" "}
                  <img
                    className="img"
                    src="../two-fingers-svgrepo-com.svg"
                    alt=""
                  />
                </h1>
              </div>
              <div
                className="twotwo
                "
              >
                <div>
                  <h1>請填寫List內容</h1>
                  <br />
                  <input
                    className="Input1"
                    type="text"
                    ref={ListInputRef}
                    placeholder="Happy"
                  />
                  <br /> <br />
                  <button id="add" onClick={handleAddValue} type="button">
                    新增到列表{" "}
                    <img
                      className="img"
                      src="../add-to-queue-svgrepo-com.svg"
                      alt=""
                    />
                  </button>
                </div>
                <div className="ListConects">
                  <h1>當前的List內容</h1>
                  {inputValues.map((value, index) => (
                    <div className="addList" key={index}>
                      <span>{value}</span>
                      <a
                        href="#"
                        onClick={(e) => handleRemoveValue(index, e)}
                        type="button"
                      >
                        <img src="../delete-svgrepo-com.svg" alt="" />
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="third">
              <h1 id="step">
                第三步{" "}
                <img
                  className="img"
                  src="../three-fingers-svgrepo-com.svg"
                  alt=""
                />
              </h1>
              <br /> <br />
              <button id="build" type="submit">
                建立
                <img className="img" src="../ok-svgrepo-com.svg" alt="" />
              </button>
              <br /> <br />
              <button
                onClick={handleSaveCalendarAsImage}
                type="submit"
                id="save"
              >
                儲存圖片
                <img className="img" src="../save-alt-svgrepo-com.svg" alt="" />
              </button>
            </div>
          </form>
        </div>
        <div className="two">
          {" "}
          <div className="ListDay">
            <h1 ref={targetDivRef} className="ListDayH1">
              該List的所有天數
            </h1>
            <div id="result">{result}</div>
          </div>
          <div className="addLsiContects">
            {" "}
            <h1>該List內容</h1>
            <div id="result2">{result2}</div>
          </div>
        </div>
      </div>

      <br></br>

      <div className="three">
        <div className="title" id="title">
          <h1>{title}</h1>
        </div>
        <FullCalendar
          contentHeight="auto"
          ref={calendarRef}
          plugins={[dayGridPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: "prevYear,prev,next,nextYear today",
            center: "title",
            right: "dayGridMonth,dayGridWeek,dayGridDay",
          }}
          events={events}
          locale="zh-Hant"
          eventClick={handleEventClick}
        />
      </div>
    </div>
  );
}

export default MyCalendar;
