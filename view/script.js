const sheetID = "1L6O7A-rR7YHHFtuELLaV3vqhrxkGbc5l_-ckEST6nWc";

const sheetNames = [
  "クラス",
  "内容",
  "出席番号",
  "公開するしない"
];

let allRows = [];

function parseGViz(text){

  const json = JSON.parse(text.substring(47).slice(0,-2));

  return json.table.rows.map(row => {

    if(!row.c || !row.c[0]) return "";

    const cell = row.c[0];

    if(cell.f !== undefined) return cell.f;
    if(cell.v !== undefined) return cell.v;

    return "";

  });

}

async function fetchSheet(name){

  const url =
  `https://docs.google.com/spreadsheets/d/${sheetID}/gviz/tq?sheet=${encodeURIComponent(name)}&tqx=out:json`;

  const res = await fetch(url);
  const text = await res.text();

  return parseGViz(text);

}

async function loadAll(){

  document.getElementById("table").innerHTML = "Loading...";

  const [cls,content,num,pub] =
    await Promise.all(sheetNames.map(fetchSheet));

  const max = Math.max(cls.length,content.length,num.length,pub.length);

  const rows = [];

  for(let i=1;i<max;i++){ // タイトル行スキップ

    rows.push({
      クラス:cls[i] || "",
      内容:content[i] || "",
      出席番号:num[i] || "",
      公開:pub[i] || ""
    });

  }

  allRows = rows;

  render(rows);

}

function classToColor(cls){

  if(cls.includes("1")) return "class1";
  if(cls.includes("2")) return "class2";
  if(cls.includes("3")) return "class3";
  if(cls.includes("4")) return "class4";

  return "";

}

function render(rows){

  let html = "<table>";

  html += `
  <tr>
    <th>クラス</th>
    <th>内容</th>
    <th>出席番号</th>
    <th>公開</th>
  </tr>
  `;

  rows.forEach(r=>{

    const color = classToColor(r["クラス"]);

    const isPrivate =
      String(r["公開"]).includes("公開しない");

    const privateClass = isPrivate ? "private" : "";

    html += `
    <tr class="${color} ${privateClass}">
      <td>${r["クラス"]}</td>
      <td>${r["内容"]}</td>
      <td>${r["出席番号"]}</td>
      <td>${r["公開"]}</td>
    </tr>
    `;

  });

  html += "</table>";

  document.getElementById("table").innerHTML = html;

}

document.getElementById("search").addEventListener("input",e=>{

  const q = e.target.value.toLowerCase();

  const filtered = allRows.filter(r =>

    String(r["クラス"]).toLowerCase().includes(q) ||
    String(r["内容"]).toLowerCase().includes(q) ||
    String(r["出席番号"]).toLowerCase().includes(q)

  );

  render(filtered);

});

loadAll();