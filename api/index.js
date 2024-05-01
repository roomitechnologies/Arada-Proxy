const express = require('express');
const axios = require('axios');
const app = express();
const cors = require('cors')
require('dotenv').config();

app.use(express.json());
app.use(cors())

app.post('/api/proxy', async (req, res) => {
  try {
    const { body } = req;
    const url = 'https://api-test.arada.com/arada-integration/services/v2/roomi-fs/data';

    const apiResponse = await axios({
      method: 'post',
      url: url,
      data: {
        ReqType: body.ReqType || "UnitDetails",
        ActionType: body.ActionType || "Get",
        UnitId: body.UnitId, 
        Params: body.Params || {}
      },
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ARADA_KEY, // Securely use environment variable
        'appname': 'roomi',
        'channelcode': 'RoomiBox'
      }
    });

    res.status(apiResponse.status).send(apiResponse.data);
  } catch (error) {
    console.log(error)
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      res.status(error.response.status).send(error.response.data);
    } else if (error.request) {
      // The request was made but no response was received
      res.status(500).json({ message: "No response received from API" });
    } else {
      // Something happened in setting up the request that triggered an Error
      res.status(500).json({ message: error.message });
    }
  }
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
