const path = require("path");
const multer = require("multer")

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

const upload = multer({ 
    storage: storage,
    fileFilter:(req,file,cb)=>{
        const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
        if(allowedTypes.includes(file.mimetype)){
            cb(null,true);

        }
        else{
            cb(new Error("Only .pdf and .docx files are allowed!"),false);
        }
    } 

});

module.exports =upload;

// const storage= multer.diskStorage({
//     destination:(_req,file,cb)=>cb(null,'uploads/'),
//     filename:(_req,file,cb)=>cb(null,Date.now()+'-'+file.originalname),
// });

// const uploads = multer({
//     storage:storage,
//     fileFilter:(_req,file,cb)=>{
//         const allowedTypes= ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
//         if(allowedTypes.includes(file.mimetype)){
//             cb(null,true);
//         }
//         else{
//             cb(new Error("not allowed type"),false);
//         }
//     }
// })