const sheetID = "1L6O7A-rR7YHHFtuELLaV3vqhrxkGbc5l_-ckEST6nWc";

const sheets = [
"クラス",
"内容",
"出席番号",
"公開するしない"
];

let allRows = [];

function parse(text){

const json = JSON.parse(text.substring(47).slice(0,-2));

return json.table.rows.map(r=>{
if(!r.c || !r.c[0]) return "";
return r.c[0].v || r.c[0].f || "";
});

}

async function getSheet(name){

const url =
`https://docs.google.com/spreadsheets/d/${sheetID}/gviz/tq?sheet=${encodeURIComponent(name)}&tqx=out:json`;

const res = await fetch(url);
const txt = await res.text();

return parse(txt);

}

async function load(){

const [cls,content,num,pub] =
await Promise.all(sheets.map(getSheet));

const max = Math.max(cls.length,content.length,num.length,pub.length);

let rows=[];

for(let i=1;i<max;i++){

rows.push({
class:cls[i]||"",
content:content[i]||"",
number:num[i]||"",
public:pub[i]||""
});

}

allRows = rows;

render(rows);

}

function classColor(c){

if(String(c).includes("1")) return "class1";
if(String(c).includes("2")) return "class2";
if(String(c).includes("3")) return "class3";
if(String(c).includes("4")) return "class4";

return "";

}

function render(rows){

let html="<table>";

html+=`
<tr>
<th>クラス</th>
<th>内容</th>
<th>出席番号</th>
<th>公開</th>
</tr>
`;

rows.forEach(r=>{

const color = classColor(r.class);

const privateFlag =
String(r.public).includes("公開しない") ? "private" : "";

html+=`
<tr class="${color} ${privateFlag}">
<td>${r.class}</td>
<td>${r.content}</td>
<td>${r.number}</td>
<td>${r.public}</td>
</tr>
`;

});

html+="</table>";

document.getElementById("table").innerHTML=html;

}

document.getElementById("search").addEventListener("input",e=>{

const q = e.target.value.toLowerCase();

const filtered = allRows.filter(r=>

String(r.class).toLowerCase().includes(q) ||
String(r.content).toLowerCase().includes(q) ||
String(r.number).toLowerCase().includes(q)

);

render(filtered);

});

load();