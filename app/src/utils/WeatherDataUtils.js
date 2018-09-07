import PropTypes from "prop-types";

export default class WeatherDataUtils {
    static getWeatherData(index, weatherData) {
        switch (index) {
            case 0:
            default:
                return {
                    forecast15: weatherData.forecast15,
                    observe: weatherData.observe
                };
            case 1:
                const hourfc = weatherData.hourfc;
                const hourMaxAndMinTempObj = this.calHourMaxAndMinTemp(hourfc);
                return {
                    hourfc: hourfc,
                    hourMaxTemp: hourMaxAndMinTempObj.hourMaxTemp,
                    hourMinTemp: hourMaxAndMinTempObj.hourMinTemp
                };
            case 2:
                const forecast15 = weatherData.forecast15;
                const dailyMaxAndMinTempObj = this.calDailyMaxAndMinTemp(forecast15);
                return {
                    forecast15: forecast15,
                    dailyDayMaxTemp: dailyMaxAndMinTempObj.dailyDayMaxTemp,
                    dailyDayMinTemp: dailyMaxAndMinTempObj.dailyDayMinTemp,
                    dailyNightMaxTemp: dailyMaxAndMinTempObj.dailyNightMaxTemp,
                    dailyNightMinTemp: dailyMaxAndMinTempObj.dailyNightMinTemp
                };
            case 3:
                return {
                    evnBean: weatherData.evn
                };
            case 4:
                const indexes = weatherData.indexes;
                const normalIndexes = this.getNormalIndexes(indexes);
                return {
                    indexes: indexes,
                    normalIndexes: normalIndexes
                };
            case 5:
                return {
                    currentDateBean: weatherData.forecast15[1]
                };
        }
    }

    static calHourMaxAndMinTemp = (hourfc) => {
        let hourMaxTemp = 0, hourMinTemp = 0;
        if (hourfc) {
            hourMaxTemp = hourfc[0].wthr;
            hourMinTemp = hourMaxTemp;
            const size = hourfc.length;
            let i;
            for (i = 1; i < size; i++) {
                const maxTemp = hourfc[i].wthr;
                const minTemp = hourfc[i].wthr;
                if (maxTemp > hourMaxTemp) {
                    hourMaxTemp = maxTemp;
                }
                if (minTemp < hourMinTemp) {
                    hourMinTemp = minTemp;
                }
            }

        }
        return {
            hourMaxTemp: hourMaxTemp,
            hourMinTemp: hourMinTemp
        };
    };

    static calDailyMaxAndMinTemp = (forecast15) => {
        let dailyDayMaxTemp = 0, dailyDayMinTemp = 0,
            dailyNightMaxTemp = 0, dailyNightMinTemp = 0;

        if (forecast15) {
            dailyDayMaxTemp = forecast15[0].high;
            dailyDayMinTemp = dailyDayMaxTemp;

            dailyNightMaxTemp = forecast15[0].low;
            dailyNightMinTemp = dailyNightMaxTemp;
            const size = forecast15.length;
            let i;
            for (i = 1; i < size; i++) {
                const dayMaxTemp = forecast15[i].high;
                const dayMinTemp = forecast15[i].high;
                if (dayMaxTemp > dailyDayMaxTemp) {
                    dailyDayMaxTemp = dayMaxTemp;
                }
                if (dayMinTemp < dailyDayMinTemp) {
                    dailyDayMinTemp = dayMinTemp;
                }

                const nightMaxTemp = forecast15[i].low;
                const nightMinTemp = forecast15[i].low;
                if (nightMaxTemp > dailyNightMaxTemp) {
                    dailyNightMaxTemp = nightMaxTemp;
                }
                if (nightMinTemp < dailyNightMinTemp) {
                    dailyNightMinTemp = nightMinTemp;
                }
            }
        }
        return {
            dailyDayMaxTemp: dailyDayMaxTemp,
            dailyDayMinTemp: dailyDayMinTemp,
            dailyNightMaxTemp: dailyNightMaxTemp,
            dailyNightMinTemp: dailyNightMinTemp
        };
    };

    static getNormalIndexes = (indexes) => {
        let normalIndexes = [];
        if (indexes) {
            for (let i = 0; i < NORMAL_INDEXES_SIZE; i++) {
                normalIndexes.push(indexes[i]);
            }
        }
        return normalIndexes;
    }
}

const NORMAL_INDEXES_SIZE = 6;
