import express from "express" ;


const server = express() ;

const PORT = process.env.PORT || 4000 ;

server.listen(PORT , () => {
console.log(`Server is up and running at port : ${PORT}`) ;
})