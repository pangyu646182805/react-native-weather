import React, {Component} from 'react';
import {
    View,
    Text,
    TouchableOpacity
} from 'react-native';
import Constants from "../config/Constants";
import Utils from "../utils/Utils";
import PropTypes from "prop-types";
import moment from 'moment';

const SCREEN_WIDTH = Constants.common_param.SCREEN_WIDTH;
const APP_BAR_HEIGHT = Utils.getAppBarHeight();

export default class WeatherHeaderWidget extends Component {
    static propTypes = {
        otherStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.number]),
        cityItem: PropTypes.object,
        onCityClick: PropTypes.func,
        weatherHeaderInfo: PropTypes.object
    };

    constructor(props) {
        super(props);
        this.state = {
            paddingBottom: 0,
            opacity: 1
        };
    }

    render() {
        const cityItem = this.props.cityItem;
        let cityName = cityItem ?
            (cityItem.district ? cityItem.district : cityItem.cityName) : '-';
        if (!cityName) cityName = '-';
        const weatherHeaderInfo = this.props.weatherHeaderInfo;
        let temp, weatherDesc, desc;
        if (weatherHeaderInfo.currentTemp !== -1 && weatherHeaderInfo.weatherDesc) {
            temp = weatherHeaderInfo.currentTemp + '°';
            weatherDesc = weatherHeaderInfo.weatherDesc;
        }
        desc = weatherHeaderInfo.updateTime ?
            '已更新 ' + moment().format('M/D') + ' ' + weatherHeaderInfo.updateTime : '正在加载';
        return (
            <View
                style={[{
                    flex: 1,
                    width: SCREEN_WIDTH,
                    // backgroundColor: 'rgba(255, 0, 0, 0.3)',
                    alignItems: 'center'
                }, this.props.otherStyle]}>
                <View style={{
                    flex: 1,
                    height: APP_BAR_HEIGHT,
                    justifyContent: 'flex-end',
                    paddingBottom: this.state.paddingBottom
                }}>
                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => this.props.onCityClick(weatherHeaderInfo)}>
                        <View style={{
                            flexDirection: 'row'
                        }} onLayout={(e) => {
                            this.headerPaddingBottom = (APP_BAR_HEIGHT -
                                e.nativeEvent.layout.height) * 0.5;
                        }}>
                            <Text style={{
                                color: 'white',
                                fontSize: 17,
                                opacity: 0
                            }}>{cityName}</Text>
                            {temp ? <View style={{
                                flexDirection: 'row',
                                alignItems: 'flex-end',
                                opacity: 1 - this.state.opacity
                            }} onLayout={(e) => {
                                this.weatherDescWidth = e.nativeEvent.layout.width;
                            }}>
                                <Text style={{
                                    color: 'white',
                                    fontSize: 17,
                                    marginStart: 8
                                }}>{temp}</Text>
                                <Text style={{
                                    color: 'white',
                                    fontSize: 17,
                                    marginStart: 8
                                }}>{weatherDesc}</Text>
                            </View> : null}
                            <View style={{
                                position: 'absolute',
                                top: 0, left: 0, bottom: 0, right: 0,
                                justifyContent: 'flex-end',
                                alignItems: 'center',
                            }}>
                                <View onLayout={(e) => {
                                    if (!this.cityNameTextWidth) {
                                        this.cityNameTextWidth = e.nativeEvent.layout.width
                                    }
                                }} ref={(ref) => {
                                    this.cityNameText = ref
                                }}>
                                    <Text style={{
                                        color: 'white',
                                        fontSize: 17
                                    }}>{cityName}</Text>
                                </View>
                            </View>
                        </View>
                    </TouchableOpacity>
                </View>
                <Text style={{
                    padding: 4,
                    fontSize: 15,
                    color: 'rgba(255, 255, 255, 0.8)',
                    opacity: this.state.opacity
                }} onLayout={(e) => {
                    this.bottomScrollDistance = e.nativeEvent.layout.height;
                }}>{desc}</Text>
            </View>
        );
    }

    getBottomScrollDistance = () => {
        return this.bottomScrollDistance;
    };

    runAnimation = (event) => {
        const scrollY = event.nativeEvent.contentOffset.y;
        const opacity = this.state.opacity;
        if (scrollY < this.getBottomScrollDistance() || (opacity >= 0 && opacity <= 1)) {
            let percent = scrollY * 1.0 / this.getBottomScrollDistance();
            if (percent > 1)
                percent = 1;
            if (percent < 0)
                percent = 0;
            this.cityNameText.setNativeProps({
                style: {width: this.cityNameTextWidth + this.weatherDescWidth * percent}
            });
            this.setState({
                paddingBottom: this.headerPaddingBottom * percent,
                opacity: 1 - percent
            });
        }
    };
}
