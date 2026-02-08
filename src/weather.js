class weatherApi {
  constructor() {
    this.apiKey = process.env.API_KEY;
    this.endpoint =
      "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/";
  }
  async getWeatherData(location, unit = "metric") {
    try {
      const res = await fetch(
        `${this.endpoint}${location}?key=${this.apiKey}&unitGroup=${unit}`,
      );
      if (!res.ok) {
        throw new Error("Network response error");
      }
      return this.getBasicData(res);
    } catch (e) {
      console.error(e);
    }
  }
  trimData(data) {
    const icon = data.icon;
    const conditions = data.conditions;
    const temp = data.temp;
    const datetime = data.datetime;
    const description = data.description;
    const tempmax = data.tempmax;
    const tempmin = data.tempmin;
    return { icon, conditions, temp, datetime, description, tempmax, tempmin };
  }
  getBasicData(res) {
    return res.json().then((data) => {
      const address = data.address;
      const description = data.description;
      const icon = data.currentConditions.icon;
      const temp = data.currentConditions.temp;
      const conditions = data.currentConditions.conditions;
      const days = data.days.map((day) => {
        return this.trimData(day);
      });
      return { address, description, icon, temp, conditions, days };
    });
  }
}
class weatherForm {
  constructor() {
    this.form = document.getElementById("weather-form");
    this.result = document.getElementById("result");
    this.current = document.getElementById("current");
    this.future = document.getElementById("future");
    this.api = new weatherApi();
  }
  render() {
    this.getWeather();
  }
  getWeather() {
    this.form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const formData = new FormData(this.form);
      const location = formData.get("location");
      const unit = formData.get("unit");
      const encodedLocation = encodeURIComponent(location);
      const loading = document.createTextNode("Loading...");
      this.result.appendChild(loading);
      const weatherData = await this.api.getWeatherData(encodedLocation, unit);
      loading.remove();
    });
  }
}
function el(tag, id, string = "") {
  const node = document.createElement(tag);
  node.id = id;
  if (string.length > 0) {
    const textNode = document.createTextNode(string);
    node.appendChild(textNode);
  }
  return node;
}
function toTitleCase(str) {
  return str.replace(
    /\w\S*/g,
    (text) => text.charAt(0).toUpperCase() + text.substring(1).toLowerCase(),
  );
}
export { weatherApi, weatherForm };
