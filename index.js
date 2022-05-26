const path = require('path');
const fs = require('fs');
const os = require('os');

const indent = '  ';
let jsonPath;
let interfacePath;
let interfaceName;

if (process.argv.length < 4) {
  console.log('Example: node index.js test/test.json target/text-field.interface.ts TextField');
  process.exit()
} else {
  jsonPath = path.normalize(process.argv[2]); // first argument path to JSON file
  interfacePath = path.normalize(process.argv[3]); // second argument path to target interface
  interfaceName = process.argv[4] || 'TextField'; // third optional, name for interface
}

function getJson(path) {
  let jsonObj;
  
  try {
    const json = fs.readFileSync(jsonPath, 'utf-8');
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

function createInterfaceLines(data, indent) {
  let interfaceBody = '';
  for (const [key, value] of Object.entries(data)) {
    if (isObject(value)) {
      const newIndent = indent + indent;
      interfaceBody += `${indent}${key}: {${os.EOL}`;
      interfaceBody +=  createInterfaceLines(value, newIndent);
      interfaceBody += `${indent}};${os.EOL}`;
    } else {
      interfaceBody += `${indent}${key}: ${typeof key};${os.EOL}`;
    }
  }
  return interfaceBody;
}

function createInterface(data, name) {
  if (!isObject(data) || isEmptyObject(data)) {
    console.log('Object is not valid!');
    process.exit();
  }
  
  let interfaceBody;
  interfaceBody = `export interface ${name} {${os.EOL}`;
  interfaceBody += createInterfaceLines(data, indent);
  interfaceBody += `}${os.EOL}`;
  
  return interfaceBody;
}

function saveData(data, path) {
  try {
    const file = fs.openSync(path, 'w+');
    fs.writeFileSync(file, data);
    fs.closeSync(file);
  } catch (e) {
    console.log('Error saving interface');
    process.exit();
  }
}

async function start() {
  const jsonObj = getJson(jsonPath);
  const interface = createInterface(jsonObj, interfaceName);
  
  saveData(interface, interfacePath);
  console.log('Interface was created');
}

start();
