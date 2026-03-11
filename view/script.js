const sheetID = "1L6O7A-rR7YHHFtuELLaV3vqhrxkGbc5l_-ckEST6nWc";

const sheets = [
  "内容",
  "クラス",
  "公開するしない",
  "出席番号"
];

function createTabs(){

  const tabs = document.getElementById("tabs");

  sheets.forEach(name => {

    const btn = document.createElement("button");
    btn.textContent = name;

    btn.onclick = () => loadSheet(name);

    tabs.appendChild(btn);

  });

}

async function loadSheet(sheetName){

  document.getElementById("table").innerHTML = "Loading...";

  const url =
  `https://docs.google.com/spreadsheets/d/${sheetID}/gviz/tq?tqx=out:json&sheet=${encodeURIComponent(sheetName)}`;

  const res = await fetch(url);
  const text = await res.text();

  const json = JSON.parse(text.substring(47).slice(0,-2));

  const rows = json.table.rows;

  render(rows);

}

function render(rows){

  let html = "<table>";

  rows.forEach((row,i)=>{

    html += "<tr>";

    row.c.forEach(cell=>{

      const value = cell ? cell.v : "";

      if(i===0){
        html += `<th>${value}</th>`;
      }else{
        html += `<td>${value}</td>`;
      }

    });

    html += "</tr>";

  });

  html += "</table>";

  document.getElementById("table").innerHTML = html;

}

createTabs();
loadSheet("内容");