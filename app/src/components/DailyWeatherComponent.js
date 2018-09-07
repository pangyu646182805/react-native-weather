import React, {Component} from 'react';
import {
    View,
    Text,
    Image,
    FlatList
} from 'react-native';
import PropTypes from "prop-types";
import Constants from "../config/Constants";
import WeatherTimeUtils from "../utils/WeatherTimeUtils";
import WeatherIconUtils from "../utils/WeatherIconUtils";
import WeatherLineWidget from "../widget/WeatherLineWidget";
import ToastUtils from "../utils/ToastUtils";

const SCREEN_WIDTH = Constants.common_param.SCREEN_WIDTH;

export default class DailyWeatherComponent extends Component {
    static propTypes = {
        forecast15: PropTypes.array,
        dailyDayMaxTemp: PropTypes.number,
        dailyDayMinTemp: PropTypes.number,
        dailyNightMaxTemp: PropTypes.number,
        dailyNightMinTemp: PropTypes.number
    };

    render() {
        const forecast15 = this.props.forecast15;
        if (!forecast15) return null;
        return (
            <View style={{
                flex: 1,
                borderBottomWidth: 0.5,
                borderBottomColor: 'rgba(255, 255, 255, 0.3)'
            }}>
                <Text style={{
                    color: 'white',
                    textAlign: 'center',
                    fontSize: 14,
                    paddingTop: 12,
                    paddingBottom: 12
                }}>每日</Text>
                <FlatList
                    data={forecast15}
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={this.keyExtractor}
                    renderItem={({item, index}) => {
                        return this.convert(item, index);
                    }}
                    horizontal={true}/>
            </View>
        );
    }

    keyExtractor = (item, index) => index.toString();

    convert = (item, index) => {
        const forecast15 = this.props.forecast15;
        let weekText;
        if (index === 0) {
            weekText = "昨天";
        } else if (index === 1) {
            weekText = "今天";
        } else {
            weekText = "周一";
        }

        let wd = item.day.wd;
        if ('无持续风向' === wd)
            wd = "风向不定";

        const {dailyDayMaxTemp, dailyDayMinTemp, dailyNightMaxTemp, dailyNightMinTemp} = this.props;
        const currentDayTemp = item.high;
        const currentNightTemp = item.low;
        let WeatherDayLineBean, WeatherNightLineBean;
        if (index === 0) {
            WeatherDayLineBean = this.generateWeatherLineBean(dailyDayMaxTemp, dailyDayMinTemp,
                currentDayTemp, -1, forecast15[1].high);
            WeatherNightLineBean = this.generateWeatherLineBean(dailyNightMaxTemp, dailyNightMinTemp,
                currentNightTemp, -1, forecast15[1].low);
        } else if (index === forecast15.length - 1) {
            WeatherDayLineBean = this.generateWeatherLineBean(dailyDayMaxTemp, dailyDayMinTemp,
                currentDayTemp, forecast15[forecast15.length - 2].high, -1);
            WeatherNightLineBean = this.generateWeatherLineBean(dailyNightMaxTemp, dailyNightMinTemp,
                currentNightTemp, forecast15[forecast15.length - 2].low, -1);
        } else {
            WeatherDayLineBean = this.generateWeatherLineBean(dailyDayMaxTemp, dailyDayMinTemp,
                currentDayTemp, forecast15[index - 1].high, forecast15[index + 1].high);
            WeatherNightLineBean = this.generateWeatherLineBean(dailyNightMaxTemp, dailyNightMinTemp,
                currentNightTemp, forecast15[index - 1].low, forecast15[index + 1].low);
        }

        return (
            <View style={{
                width: SCREEN_WIDTH / 6,
                paddingBottom: 16,
                alignItems: 'center'
            }}>
                <Text style={{
                    flex: 1,
                    textAlign: 'center',
                    color: 'white',
                    fontSize: 13
                }}>{weekText}</Text>
                <Text style={{
                    flex: 1,
                    textAlign: 'center',
                    color: 'white',
                    fontSize: 11,
                    marginTop: 4
                }}>{WeatherTimeUtils.getWeatherDate(item.date)}</Text>
                <Text style={{
                    flex: 1,
                    textAlign: 'center',
                    color: 'white',
                    fontSize: 11,
                    marginTop: 4
                }}>{item.day.wthr}</Text>
                <Image source={WeatherIconUtils.getWeatherIconByType(item.day.type, false)} style={{
                    width: 24, height: 24, resizeMode: 'cover', marginTop: 4
                }}/>
                <WeatherLineWidget
                    WeatherLineBean={WeatherDayLineBean}/>
                <WeatherLineWidget
                    WeatherLineBean={WeatherNightLineBean}/>
                <Image source={WeatherIconUtils.getWeatherIconByType(item.night.type, true)} style={{
                    width: 24, height: 24, resizeMode: 'cover', marginTop: 4
                }}/>
                <Text style={{
                    flex: 1,
                    textAlign: 'center',
                    color: 'white',
                    fontSize: 11,
                    marginTop: 4
                }}>{item.night.wthr}</Text>
                <Text style={{
                    flex: 1,
                    textAlign: 'center',
                    color: 'white',
                    fontSize: 11,
                    marginTop: 4
                }}>{wd}</Text>
                <Text style={{
                    flex: 1,
                    textAlign: 'center',
                    color: 'white',
                    fontSize: 11,
                    marginTop: 4
                }}>{item.day.wp}</Text>
            </View>
        );
    };

    generateWeatherLineBean = (maxTemp, minTemp, currentTemp, preTemp, nextTemp) => {
        return {
            maxTemp: maxTemp,
            minTemp: minTemp,
            currentTemp: currentTemp,
            preTemp: preTemp,
            nextTemp: nextTemp
        };
    };
}
