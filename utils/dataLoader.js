const fs = require("fs");
const path = require("path");

// Load JSON data from the `data` directory
function loadDataFromFile(filename) {
  const filePath = path.join(__dirname, "../data", filename);
  if (fs.existsSync(filePath)) {
    const data = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(data);
  } else {
    throw new Error(`File not found: ${filename}`);
  }
}

function getSheetData(sheetNames) {
  const filenames = {
    'Database': 'database.json',
    'streamlit_emissions': 'streamlit_emissions.json'
  };
  
  const data = {};
  sheetNames.forEach(name => {
    const filename = filenames[name];
    if (filename) {
      data[name] = loadDataFromFile(filename);
    }
  });
  
  return data;
}

module.exports = { getSheetData };
