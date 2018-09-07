export default class WeatherIconUtils {
    static getWeatherIconByType(type, isNight) {
        let weatherIconRes = require('../../images/fifteen_weather_no.png');
        if (!isNight) {  // 白天天气图标
            switch (type) {
                case 1:  // 晴天
                    weatherIconRes = require('../../images/fifteen_weather_sunny.png');
                    break;
                case 2:  // 多云
                    weatherIconRes = require('../../images/fifteen_weather_mostlycloudy.png');
                    break;
                case 3:  // 阵雨
                    weatherIconRes = require('../../images/fifteen_weather_chancerain.png');
                    break;
                case 4:  // 雷阵雨
                    weatherIconRes = require('../../images/fifteen_weather_chancestorm.png');
                    break;
            }
        } else {
            switch (type) {
                case 1:  // 晴天
                    weatherIconRes = require('../../images/fifteen_weather_sunny_n.png');
                    break;
                case 2:  // 多云
                    weatherIconRes = require('../../images/fifteen_weather_mostlycloudy_n.png');
                    break;
                case 3:  // 阵雨
                    weatherIconRes = require('../../images/fifteen_weather_chancerain_n.png');
                    break;
                case 4:  // 雷阵雨
                    weatherIconRes = require('../../images/fifteen_weather_chancestorm_n.png');
                    break;
            }
        }
        switch (type) {
            case 8:  // 小雨
            case 9:  // 小到中雨
                weatherIconRes = require('../../images/fifteen_weather_lightrain.png');
                break;
            case 10:  // 中雨
            case 11:  // 大雨
            case 13:  // 大暴雨
                weatherIconRes = require('../../images/fifteen_weather_rain.png');
                break;
            case 34:  // 阴
                weatherIconRes = require('../../images/fifteen_weather_cloudy.png');
                break;
        }
        return weatherIconRes;
    }
}
