const express = require('express');
const axios = require('axios');
const app = express();
const cors = require('cors')
require('dotenv').config();

app.use(cors())
app.use(express.json());

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

app.post('/api/logflare-roomiApp-proxy', async (req, res) => {
  const { body } = req;
  const url = `https://api.logflare.app/logs/json?source=${process.env.LOGFLARE_SOURCE_TOKEN}`;
  try {
    console.log(body)
    const response = await axios.post(url, req.body, {
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': process.env.LOGFLARE_API_KEY
      }
    });

    res.status(response.status).json(response.data);
  } catch (error) {
    console.error('Error in proxy server:', error);
    res.status(error.response ? error.response.status : 500).json({
      message: 'Error forwarding request to Logflare',
      error: error.message
    });
  }
})


const port = 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
