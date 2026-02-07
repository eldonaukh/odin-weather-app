class Weather {
  constructor() {
    this.apiKey = process.env.API_KEY;
    this.endpoint =
      "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/";
  }

  async getWeather(location, unit = "metric") {
    try {
      const res = await fetch(
        `${this.endpoint}${location}?key=${this.apiKey}&unitGroup=${unit}`,
      );
      if (!res.ok) {
        throw new Error("Network response error");
      }
      return await res.json();
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
}

export { Weather };
