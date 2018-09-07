import React, {Component} from 'react';
import {
    View,
    Image,
    Text
} from 'react-native';
import PropTypes from "prop-types";
import WeatherIconUtils from "../utils/WeatherIconUtils";
import ToastUtils from "../utils/ToastUtils";

export default class WeatherHeaderComponent extends Component {
    static propTypes = {
        forecast15: PropTypes.array,
        observe: PropTypes.object
    };

    render() {
        const forecast15 = this.props.forecast15;
        const observe = this.props.observe;
        return (
            <View style={{
                flex: 1, alignItems: 'center',
                paddingTop: 72, paddingBottom: 72,
                borderBottomWidth: 0.5,
                borderBottomColor: 'rgba(255, 255, 255, 0.3)'
            }}>
                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center'
                }}>
                    <Image source={WeatherIconUtils.getWeatherIconByType(observe.type, false)} style={{
                        width: 58, height: 58, resizeMode: 'cover'
                    }}/>
                    <View style={{
                        flexDirection: 'row', marginLeft: 8
                    }}>
                        <Text style={{
                            fontSize: 78, fontFamily: 'Roboto',
                            color: 'white'
                        }} includeFontPadding={false}>{observe.temp}</Text>
                        <Text style={{
                            fontSize: 38, fontFamily: 'Roboto',
                            color: 'white', marginTop: 8
                        }}>°</Text>
                    </View>
                </View>
                <Text style={{
                    color: 'rgba(255, 255, 255, 0.9)',
                    fontSize: 16, marginTop: -8
                }}>{forecast15[1].high + '°/' + forecast15[1].low + '°  体感温度 ' + observe.tigan + '°'}</Text>
            </View>
        );
    }
}
