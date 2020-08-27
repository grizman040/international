// module.exports = {
//     MONGOURI: "mongodb+srv://devco:JJKcbdu1OuZiEMAh@cluster0.kx6nq.mongodb.net/test?retryWrites=true&w=majority",
//     JWT_SECRET:"fskjnkjn4bnj43hb"
// }

//https://cloudinary.com/:  !NcvyvkMPD5FSi_

//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

if(process.env.NODE_ENV==='production'){
    module.exports = require('./prod')
}else{
    module.exports = require('./dev')
}