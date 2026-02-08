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
    this.degree = "";
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
      this.clearResult();
      const loading = document.createTextNode("Loading...");
      this.result.appendChild(loading);
      const weatherData = await this.api.getWeatherData(encodedLocation, unit);
      loading.remove();
      this.showResult(weatherData, unit);
      console.log(weatherData);
    });
  }
  clearResult() {
    const address = document.getElementById("address");
    if (address) {
      this.result.removeChild(address);
      this.current.replaceChildren();
      this.future.replaceChildren();
    }
  }
  showResult(data, unit) {
    if (unit === "us") {
      this.degree = "°F";
    } else {
      this.degree = "°C";
    }
    const { address, description, icon, temp, conditions, days } = data;
    const resAddress = el("h2", "address", toTitleCase(address));
    this.result.insertBefore(resAddress, this.current);

    const currData = { description, icon, temp, conditions };
    this.showCurrent(currData);
    this.showDays(days);
  }
  async showCurrent(data) {
    const { description, icon, temp, conditions } = data;
    const currConditions = el("h3", "current-conditions", conditions);
    const currTemp = el(
      "h3",
      "current-temp",
      `Current temperature: ${temp} ${this.degree}`,
    );
    const currDesc = el("h3", "current-desc", description);
    const currIcon = el("img", "current-icon");
    currIcon.src = await loadImg(icon);
    currIcon.style.width = "100px";
    this.current.appendChild(currIcon);
    this.current.appendChild(currConditions);
    this.current.appendChild(currTemp);
    this.current.appendChild(currDesc);
  }
  showDays(daysData) {
    const daysFrag = document.createDocumentFragment();
    daysData.forEach(async (day) => {
      const dayNode = this.showDay(day);
      daysFrag.appendChild(dayNode);
    });
    this.future.appendChild(daysFrag);
  }
  showDay(dayData) {
    const { datetime, icon, conditions, description, temp, tempmax, tempmin } =
      dayData;
    const dayDatetime = el("h4", "", datetime);
    const dayIcon = el("img");
    loadImg(icon).then((data) => (dayIcon.src = data));
    dayIcon.style.width = "75px";
    const dayConditions = el("h5", "", conditions);
    const dayDescription = el("h5", "", description);
    const dayTemp = el("h6", "", `Avg Temp: ${temp} ${this.degree}`);
    const dayTempMax = el("h6", "", `Highest Temp: ${tempmax} ${this.degree}`);
    const dayTempMin = el("h6", "", `Lowest Temp: ${tempmin} ${this.degree}`);
    const nodes = [
      dayDatetime,
      dayIcon,
      dayConditions,
      dayDescription,
      dayTemp,
      dayTempMax,
      dayTempMin,
    ];
    const dayFrag = document.createDocumentFragment();
    nodes.forEach((element) => {
      dayFrag.appendChild(element);
    });
    const dayNode = el("div");
    dayNode.className = "day-div";
    dayNode.appendChild(dayFrag);
    return dayNode;
  }
}
function el(tag, id = "", string = "") {
  const node = document.createElement(tag);
  if (id.length > 0) {
    node.id = id;
  }
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
async function loadImg(name) {
  const img = await import(`./assests/icons/${name}.svg`);
  return img.default;
}
export { weatherApi, weatherForm };
