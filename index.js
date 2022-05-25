const path = require('path');
const fs = require('fs');
const util = require('util');
const os = require('os');

const openFile = util.promisify(fs.open);
const writeFile = util.promisify(fs.write);
const closeFile = util.promisify(fs.close);

let pathToJson;
let interfacePath = path.join(__dirname, 'interface.ts');

if (process.argv.length <= 2) {
  pathToJson = path.join(__dirname, 'test.json');
} else {
  console.log(process.argv[0]);
  console.log(process.argv[1]);
  console.log(process.argv[2]);
  console.log(process.argv[3]);
}

function getJson(path) {
  let jsonObj;
  
  try {
    const json = fs.readFileSync(pathToJson, 'utf-8');
    jsonObj = JSON.parse(json);
  } catch (e) {
    console.log('Error reading JSON file');
    process.exit();
  }
  
  return jsonObj;
}

function isObject(a) {
  return (!!a) && (a.constructor === Object);
}

function isEmptyObject(obj) {
  return Object.keys(obj).length === 0;
}

function createInterfaceLine(data, indent) {

}

function createInterface(data) {
  if (!isObject(data) || isEmptyObject(data)) {
    console.log('Object is not valid!');
    process.exit();
  }
  
  console.log(data);
  let interface = 'export interface TextField {' + os.EOL;
  
  for (const [key, value] of Object.entries(data)) {
    
    // console.log('--------------');
    // console.log(key);
    // console.log(value);
    // console.log('is value object: ', isObject(value));
  }
  
  interface += '}' + os.EOL;
  
  return interface;
}

async function start() {
  console.log('=============================');
  
  const jsonObj = getJson(pathToJson);
  const interface = createInterface(jsonObj);
  
  console.log('=============================');
  console.log(interface);
}

start();




