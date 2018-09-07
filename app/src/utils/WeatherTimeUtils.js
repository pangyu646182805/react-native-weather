import moment from 'moment';

export default class WeatherTimeUtils {
    /**
     * 201708251500->15:00
     */
    static getWeatherTime(time) {
        return moment(time, "YYYYMMDDHHmm").format('HH:mm');
    }

    /**
     * 20170825->0825
     */
    static getWeatherDate(time) {
        return moment(time, "YYYYMMDD").format('MM-DD');
    }
}
