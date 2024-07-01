const express = require("express");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port = 3000;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/api/hello", async (req, res) => {
  const { visitor_name } = req.query;
  // get the ip address of the client
  let ip_address = "";
  let temperature = 0;
  let location = "";
  await fetch(`https://ipapi.co/json/`)
    .then((response) => response.json())
    .then((data) => {
      ip_address = data?.ip;
      location = data?.city;
    });
  await fetch(
    `https://api.weatherapi.com/v1/current.json?key=f4823e6d9b3844d0b73112846240107&q=${ip_address}&aqi=no`
  )
    .then((response) => response.json())
    .then((data) => {
      temperature = data?.current.temp_c;
    });
  res.json({
    client_ip: `${ip_address}`,
    location: `${location}`,
    greeting: `Hello, ${visitor_name}!, the temperature is ${temperature} degrees Celsius in ${location}.`,
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
