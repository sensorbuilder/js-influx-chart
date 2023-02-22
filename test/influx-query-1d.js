import { InfluxDB } from "@influxdata/influxdb-client";
import { url, token, org } from "./env.js";
//import fs from "fs";
// import output from "d3node-output";
// import * as d3 from "d3";
// import 
// import d3 from ""
// //const fs = require('fs');
// //const output = require('d3node-output');
// const d3 = require('d3-node')().d3;
// const d3nLine = require('../');

// const parseTime = d3.timeParse('%d-%b-%y');
// const tsvString = fs.readFileSync('data/data.tsv').toString();
// const data = d3.tsvParse(tsvString, d => {
//   return {
//     key: parseTime(d.date),
//     value: +d.close
//   };
// });

// // create output files
// output('./examples/output', d3nLine({ data: data }), { width: 960, height: 550 });


const queryApi = new InfluxDB({ url, token }).getQueryApi(org)
const fluxQuery =
  // 'from(bucket:"my-bucket") |> range(start: -1d) |> filter(fn: (r) => r._measurement == "temperature")'
  `from(bucket: "test/autogen") |> range(start: -1d) |> filter(fn: (r) => r["_measurement"] == "environmentdata") |> filter(fn: (r) => r["_field"] == "temperature") |> filter(fn: (r) => r["site"] == "TTGO_2_BME280")`

function queryInflux() {
  console.log("*** QueryRows ***")
  let data = [];
  queryApi.queryRows(fluxQuery, {
    next: (row, tableMeta) => {
      const o = tableMeta.toObject(row)
      // create an array of object {time, temperature}
      data = [...data, [{ time: o._time, temperature: o._value }] ]
    },
    error: error => {
      console.error(error)
      console.log("\nQueryRows ERROR")
    },
    complete: () => {
      data.forEach(obj => console.log(obj[0]));
      //console.log(data)
      console.log("\nQueryRows SUCCESS")
    }
  })
}
queryInflux()
