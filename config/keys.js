// module.exports = {
//     MONGOURI: "mongodb+srv://devco:JJKcbdu1OuZiEMAh@cluster0.kx6nq.mongodb.net/test?retryWrites=true&w=majority",
//     JWT_SECRET:"fskjnkjn4bnj43hb"
// }


//https://cloudinary.com/:  !NcvyvkMPD5FSi_



if(process.env.NODE_ENV==='production'){
    module.exports = require('./prod')
}else{
    module.exports = require('./dev')
}