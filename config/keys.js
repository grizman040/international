// module.exports = {
//     MONGOURI: "mongodb+srv://devco:JJKcbdu1OuZiEMAh@cluster0.kx6nq.mongodb.net/test?retryWrites=true&w=majority",
//     JWT_SECRET:"fskjnkjn4bnj43hb"
// }

//https://cloudinary.com/:  !NcvyvkMPD5FSi_


// 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

if(process.env.NODE_ENV==='production'){
    module.exports = require('./prod')
}else{
    module.exports = require('./dev')
}