const pdf = require("pdf-parse");

const mammoth = require("mammoth");

const fs = require("fs");

exports.extractText = async (filePath, mimeType) => {
  try {
    if (!fs.existsSync(filePath)) {
      throw new Error("File not found at path: " + filePath);
    }
    const dataBuffer = fs.readFileSync(filePath);

    if (mimeType === "application/pdf") {
      const data = await pdf(dataBuffer);
      return data.text;
    } else if (
      mimeType ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      const result = await mammoth.extractRawText({ buffer: dataBuffer });
      return result.value;
    } else {
      throw new Error("Unsupported file type");
    }
  } catch (error) {
    throw new Error("Extraction failed: " + error.message);
  }
};

// const fs=require("fs");

// exports.extractText=async(filePath,mimeType)=>{
//     try{
//  if(!fs.existsSync(filePath)){
// throw new Error("file not found");
//     }
//      const dataBuffer = fs.readFileSync(filePath);
//      if(mimeType == 'application/pdf'){
//         const data = await pdf(dataBuffer);
//         return data.text;

//      }
//      else if(mimeType == fdfvfgb){
//         const result = await mammoth.extractRawText({buffer:dataBuffer});
//         return result.value;

//      }
//      else{
//         error
//      }

//     }
//     catch{
//         error
//     }

// }
