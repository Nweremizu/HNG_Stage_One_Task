const express = require("express");
const axios = require("axios");
const app = express();
app.set("trust proxy", true);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port = 3000;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/api/hello", async (req, res) => {
  const { visitor_name } = req.query;
  // Get the IP address of the client
  let ip_address = "";
  let temperature = 0;
  let location = "";
  try {
    const ipResponse = await axios.get(`https://ipapi.co/${ip_address}/json/`);
    location = ipResponse.data?.city;

    const weatherResponse = await axios.get(
      `https://api.weatherapi.com/v1/current.json?key=f4823e6d9b3844d0b73112846240107&q=${location}&aqi=no`
    );
    temperature = weatherResponse.data?.current.temp_c;
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Error fetching data" });
    return;
  }

  res.json({
    client_ip: ip_address,
    location: location,
    greeting: `Hello, ${visitor_name}! The temperature is ${temperature} degrees Celsius in ${location}.`,
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
