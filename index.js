const ExcelJS = require('exceljs');
const express=require("express");
const cors=require("cors");
const app=express();
app.use(express.json());
app.use(cors());
const XLSX = require('xlsx');

const workbook = XLSX.readFile('data.xlsx');
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];

// Convert to JSON
let data = XLSX.utils.sheet_to_json(worksheet);

const casteMap = {
  "OC BOYS": "__EMPTY_8",
  "OC GIRLS": "__EMPTY_9",
  "BC_A BOYS": "__EMPTY_10",
  "BC_A GIRLS": "__EMPTY_11",
  "BC_B BOYS": "__EMPTY_12",
  "BC_B GIRLS": "__EMPTY_13",
  "BC_C BOYS": "__EMPTY_14",
  "BC_C GIRLS": "__EMPTY_15",
  "BC_D BOYS": "__EMPTY_16",
  "BC_D GIRLS": "__EMPTY_17",
  "BC_E BOYS": "__EMPTY_18",
  "BC_E GIRLS": "__EMPTY_19",
  "SC BOYS": "__EMPTY_20",
  "SC GIRLS": "__EMPTY_21",
  "ST BOYS": "__EMPTY_22",
  "ST GIRLS": "__EMPTY_23",
  "EWS GEN OU": "__EMPTY_24",
  "EWS GIRLS OU": "__EMPTY_25"
};

app.post("/", (req, res) => {
  let result = [];
  const {caste, rank, branch, college} = req.body;

  // console.log(caste);
  // console.log(casteMap[caste]);

  for (let i = 0; i < data.length; i++) {
    const cutOff = data[i][casteMap[caste]];
    const dataBranch = data[i]["__EMPTY_6"];
    const dataCollege = data[i]["__EMPTY"];
    if (cutOff && cutOff !== "NA") {
      const meetsRank = cutOff >= rank-2000;
      const meetsBranch = !branch || dataBranch === branch;
      const meetsCollege = !college || dataCollege === college;
      if (meetsRank && meetsBranch && meetsCollege) {
        result.push({
          cutOff: cutOff,
          collegeName: dataCollege,
          branch: data[i]["__EMPTY_7"],
        });
      }
    }
  }
  result.sort((a, b) => a.cutOff - b.cutOff);

  res.json({ data: result});

});



app.get('/',(req,res)=>{
  res.json({message:"connected"});
})


app.listen(5000);

