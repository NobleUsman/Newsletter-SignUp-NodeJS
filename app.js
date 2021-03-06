
const express = require("express")
const app = express()
const bodyparser = require("body-parser")
const https = require("https")

app.use(bodyparser.urlencoded({ extended : true }))

const path = require("path")
//app.use("/", express.static(path.join(__dirname, "public")))
app.use(express.static("public"))


app.get("/", function(req, res) {
  res.sendfile(`${__dirname}/signup.html`)
})

app.post("/", function(req, res) {
  const { firstname, lastname, email } = req.body
  console.log(`Post Request Received: ${firstname} ${lastname} ${email}`);

  //=========start
  var data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME : firstname,
          LNAME : lastname
        }
    }
  ]
  }

  var jsonData = JSON.stringify(data)

  const url = "https://us5.api.mailchimp.com/3.0/lists/{listID}"

  const options = {
    method: "POST",
    auth: "Usman1:TOKEN"
  }

  const request = https.request(url, options, function(response) {
    response.on("data", function(data) {
      console.log(JSON.parse(data))

      if (response.statusCode === 200) {
        res.sendfile(`${__dirname}/success.html`)
      } else {
        res.sendfile(`${__dirname}/failure.html`)
      }
    })
  })

  request.write(jsonData)
  request.end()
  //=========end
})



app.post("/failure", function(req, res) {
  res.redirect("/") //specify path
})

const port = process.env.PORT || 3000
app.listen(port, function() {
  console.log(`Server started at port: ${port}`)
})


//API Key: TOKEN
//Audience ID/ List ID: ListID
