const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true })); 

const port = process.env.PORT || 8080;


app.listen(port);
// console.log('Server started! At http://localhost:' + port);

app.use((err, req, res, next) => {
    if (err) {
        // console.log('Invalid Request data');
        res.status(400);
        res.send({error : "Could not decode request: JSON parsing failed"});
    } else {
        next();
    }
});

app.post('', function(req, res) {
  const filteredPayload = [];
  const payload = req.body.payload;
  let outObj = {};
  payload.forEach(element => {
    if (element.type && element.type.toLowerCase() === "htv" && element.workflow  && element.workflow.toLowerCase() === "completed") {
      if ( element.address.unitNumber) {
        outObj.concataddress = `${element.address.unitNumber} ${element.address.buildingNumber} ${element.address.street} ${element.address.suburb} ${element.address.state} ${element.address.postcode}`;
      } else {
        outObj.concataddress = `${element.address.buildingNumber} ${element.address.street} ${element.address.suburb} ${element.address.state} ${element.address.postcode}`;
      }
      outObj.type = element.type;
      outObj.workflow = element.workflow;
      filteredPayload.push(outObj);
    }
    outObj = {};
    // console.log(JSON.stringify(filteredPayload));
    
  });
  // console.log(JSON.stringify(filteredPayload));
  res.send({response : filteredPayload});
});