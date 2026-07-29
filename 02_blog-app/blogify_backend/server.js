

require("dotenv").config()
const app = require("./App")
const dbconnection = require('./utils/db_connection')



const port = process.env.PORT


dbconnection().then(() => {

  app.listen(port, () => {
    console.log(`server is listening on port ${port}  `)
  })

})




