import React, {Component} from 'react';
import {
    Text,
    View
} from 'react-native';
import ToastUtils from "../utils/ToastUtils";
import PropTypes from "prop-types";
import AirQualityWidget from "../widget/AirQualityWidget";
import Constants from "../config/Constants";

const SCREEN_WIDTH = Constants.common_param.SCREEN_WIDTH;

export default class AirQualityComponent extends Component {
    static propTypes = {
        evnBean: PropTypes.object
    };

    render() {
        const evnBean = this.props.evnBean;
        if (!evnBean) return null;
        return (
            <View style={{
                flex: 1,
                alignItems: 'center',
                borderBottomWidth: 0.5,
                borderBottomColor: 'rgba(255, 255, 255, 0.3)'
            }}>
                <Text style={{
                    color: 'white',
                    textAlign: 'center',
                    fontSize: 14,
                    paddingTop: 12,
                    paddingBottom: 24
                }}>空气质量</Text>
                <AirQualityWidget
                    evnBean={evnBean}/>
                <View style={{
                    width: SCREEN_WIDTH,
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    paddingBottom: 16
                }}>
                    {this._renderAirQualityItem('PM2.5', '细颗粒物', evnBean.pm25)}
                    {this._renderAirQualityItem('PM10', '可吸入颗粒物', evnBean.pm10)}
                    {this._renderAirQualityItem('O3', '臭氧', evnBean.o3)}
                    {this._renderAirQualityItem('SO2', '二氧化硫', evnBean.so2)}
                    {this._renderAirQualityItem('NO2', '二氧化氮', evnBean.no2)}
                    {this._renderAirQualityItem('CO', '一氧化碳', evnBean.co)}
                </View>
            </View>
        );
    }

    _renderAirQualityItem = (title, desc, value) => {
        return (
            <View style={{
                width: SCREEN_WIDTH * 0.5,
                flexDirection: 'row',
                marginTop: 12
            }}>
                <View style={{
                    flex: 1,
                    marginStart: 16
                }}>
                    <Text style={{
                        color: 'rgba(255, 255, 255, 0.8)',
                        fontSize: 13
                    }}>{title}</Text>
                    <Text style={{
                        color: 'rgba(255, 255, 255, 0.8)',
                        fontSize: 14, marginTop: 4
                    }}>{desc}</Text>
                </View>
                <Text style={{
                    color: 'white',
                    fontSize: 26,
                    marginEnd: 16
                }}>{value}</Text>
            </View>
        );
    };
}
