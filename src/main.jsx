import React from "react";
import { createRoot } from "react-dom/client";
import FullCalendar from "./FullCalendar"; // 修改为你的 FullCalendar 组件的相对路径
const root = document.getElementById("root");
const reactRoot = createRoot(root);
reactRoot.render(
  <React.StrictMode>
    <FullCalendar />
  </React.StrictMode>
);
