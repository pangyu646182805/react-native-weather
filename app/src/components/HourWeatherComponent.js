import React, {Component} from 'react';
import {
    View,
    Text,
    Image,
    FlatList
} from 'react-native';
import PropTypes from "prop-types";
import WeatherLineWidget from "../widget/WeatherLineWidget";
import Constants from "../config/Constants";
import WeatherTimeUtils from "../utils/WeatherTimeUtils";
import WeatherIconUtils from "../utils/WeatherIconUtils";
import ToastUtils from "../utils/ToastUtils";

const SCREEN_WIDTH = Constants.common_param.SCREEN_WIDTH;

export default class HourWeatherComponent extends Component {
    static propTypes = {
        hourfc: PropTypes.array,
        hourMaxTemp: PropTypes.number,
        hourMinTemp: PropTypes.number
    };

    render() {
        const hourfc = this.props.hourfc;
        if (!hourfc) return null;
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
                }}>每小时</Text>
                <FlatList
                    data={hourfc}
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
        const hourfc = this.props.hourfc;
        const currentTemp = item.wthr;
        let WeatherLineBean;
        if (index === 0) {
            WeatherLineBean = this.generateWeatherLineBean(currentTemp, -1, hourfc[1].wthr);
        } else if (index === hourfc.length - 1) {
            WeatherLineBean = this.generateWeatherLineBean(currentTemp,
                hourfc[hourfc.length - 2].wthr, -1);
        } else {
            WeatherLineBean = this.generateWeatherLineBean(currentTemp,
                hourfc[index - 1].wthr, hourfc[index + 1].wthr);
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
                }}>{WeatherTimeUtils.getWeatherTime(item.time)}</Text>
                <Image source={WeatherIconUtils.getWeatherIconByType(item.type)} style={{
                    width: 24, height: 24, resizeMode: 'cover', marginTop: 4
                }}/>
                <Text style={{
                    flex: 1,
                    textAlign: 'center',
                    color: 'white',
                    fontSize: 12,
                    marginTop: 4
                }}>{item.type_desc}</Text>
                <WeatherLineWidget
                    WeatherLineBean={WeatherLineBean}/>
            </View>
        );
    };

    generateWeatherLineBean = (currentTemp, preTemp, nextTemp) => {
        return {
            maxTemp: this.props.hourMaxTemp,
            minTemp: this.props.hourMinTemp,
            currentTemp: currentTemp,
            preTemp: preTemp,
            nextTemp: nextTemp
        };
    };
}
