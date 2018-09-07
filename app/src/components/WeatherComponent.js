import React, {Component} from 'react';
import {
    View,
    Text
} from 'react-native';
import PropTypes from "prop-types";
import PPRefreshLayout from "../widget/PPRefreshLayout";
import WeatherHeaderComponent from "./WeatherHeaderComponent";
import HourWeatherComponent from "./HourWeatherComponent";
import DailyWeatherComponent from "./DailyWeatherComponent";
import AirQualityComponent from "./AirQualityComponent";
import LifeIndexComponent from "./LifeIndexComponent";
import SunriseAndSunsetComponent from "./SunriseAndSunsetComponent";
import ToastUtils from "../utils/ToastUtils";
import WeatherDataUtils from "../utils/WeatherDataUtils";
import Utils from "../utils/Utils";
import CityListManager from "../manager/CityListManager";
import WeatherHeaderWidget from "../widget/WeatherHeaderWidget";

// 天气头部
const ITEM_TYPE_HEADER = 0;
// 小时天气
const ITEM_TYPE_HOUR_WEATHER = 1;
// 每日天气
const ITEM_TYPE_DAILY_WEATHER = 2;
// 空气质量
const ITEM_TYPE_AIR_QUALITY = 3;
// 生活指数
const ITEM_TYPE_LIFE_INDEX = 4;
// 日出和日落
const ITEM_TYPE_SUNRISE_AND_SUNSET = 5;
const ITEM_COUNT = 6;

const APP_BAR_HEIGHT = Utils.getAppBarHeight();
// let weatherDataBean;

export default class WeatherComponent extends Component {
    static propTypes = {
        cityItem: PropTypes.object,
        refreshMainPage: PropTypes.func
    };

    constructor(props) {
        super(props);
        this.state = {
            weatherHeaderInfo: {
                currentTemp: -1,
                weatherDesc: null,
                updateTime: null
            }
        };
    }

    render() {
        return (
            <View style={{
                flex: 1
            }}>
                <PPRefreshLayout
                    style={{marginTop: APP_BAR_HEIGHT}}
                    nestedScrollEnabled={true}
                    overScrollMode={'never'}
                    ref={(ref) => this.refreshLayout = ref}
                    renderItem={({item}) => {
                        return this.convert(item, this.props.navigation);
                    }}
                    onScroll={(e) => {
                        // alert(e.nativeEvent.contentOffset.y);
                        this.headerWidget.runAnimation(e);
                    }}
                    onScrollEndDrag={(e) => this.onScrollEnd(e)}
                    needDivide={false}
                    loadMoreEnable={false}
                    dataRequest={() => this.getWeatherData()}/>
                <WeatherHeaderWidget
                    ref={(ref) => this.headerWidget = ref}
                    cityItem={this.props.cityItem}
                    weatherHeaderInfo={this.state.weatherHeaderInfo}
                    otherStyle={{position: 'absolute'}}
                    onCityClick={(weatherHeaderInfo) => {
                        if (weatherHeaderInfo && weatherHeaderInfo.currentTemp !== -1) {
                            const navigation = this.props.navigation;
                            navigation.navigate('CityManager', {
                                callBack: (haveDelete, cityList) => {
                                    if (haveDelete) {
                                        this.props.refreshMainPage && this.props.refreshMainPage(cityList);
                                    }
                                }
                            });
                        }
                    }}/>
            </View>
        );
    }

    onScrollEnd = (e) => {
        const scrollY = e.nativeEvent.contentOffset.y;
        if (scrollY > 0 && scrollY <= this.headerWidget.getBottomScrollDistance()) {
            this.refreshLayout.scrollToTop();
        }
    };

    scrollToTop = () => {
        this.refreshLayout && this.refreshLayout.scrollToTop(false);
    };

    convert = (item, navigation) => {
        const weatherData = item.weatherData;
        if (!weatherData) return null;
        switch (item.itemType) {
            case ITEM_TYPE_HEADER:
            default:
                return (
                    <WeatherHeaderComponent
                        forecast15={weatherData.forecast15}
                        observe={weatherData.observe}/>
                );
            case ITEM_TYPE_HOUR_WEATHER:
                return (
                    <HourWeatherComponent
                        hourfc={weatherData.hourfc}
                        hourMaxTemp={weatherData.hourMaxTemp}
                        hourMinTemp={weatherData.hourMinTemp}/>
                );
            case ITEM_TYPE_DAILY_WEATHER:
                return (
                    <DailyWeatherComponent
                        forecast15={weatherData.forecast15}
                        dailyDayMaxTemp={weatherData.dailyDayMaxTemp}
                        dailyDayMinTemp={weatherData.dailyDayMinTemp}
                        dailyNightMaxTemp={weatherData.dailyNightMaxTemp}
                        dailyNightMinTemp={weatherData.dailyNightMinTemp}/>
                );
            case ITEM_TYPE_AIR_QUALITY:
                return (
                    <AirQualityComponent
                        evnBean={weatherData.evnBean}/>
                );
            case ITEM_TYPE_LIFE_INDEX:
                return (
                    <LifeIndexComponent
                        indexes={weatherData.indexes}
                        normalIndexes={weatherData.normalIndexes}/>
                );
            case ITEM_TYPE_SUNRISE_AND_SUNSET:
                return (
                    <SunriseAndSunsetComponent
                        currentDateBean={weatherData.currentDateBean}/>
                );
        }
    };

    componentDidMount() {
        this.getWeatherData();
    }

    getWeatherData = () => {
        const url = 'http://zhwnlapi.etouch.cn/Ecalender/api/v2/weather?' +
            'date=20170817&app_key=99817749&citykey=' + this.props.cityItem.cityId;
        fetch(url).then((response) => {
            if (response.ok) {
                return response.json();
            }
        }).then((weatherData) => {
            this.onSuccess(weatherData);
        }).catch((error) => {
            this.onFailure(error);
        });
    };

    onSuccess = (weatherData) => {
        // weatherDataBean = weatherData;
        const forecast15 = weatherData.forecast15;
        const observe = weatherData.observe;
        CityListManager.updateCity(this.props.cityItem.cityId, this.props.cityItem.cityName,
            this.props.cityItem.district, this.props.cityItem.province, observe.temp,
            forecast15[1].high, forecast15[1].low, observe.wthr, observe.type, false);
        this.setState({
            weatherHeaderInfo: {
                currentTemp: observe.temp,
                weatherDesc: observe.wthr,
                updateTime: observe.up_time
            }
        });
        let dataList = [];
        for (let i = 0; i < ITEM_COUNT; i++) {
            dataList.push({
                itemType: i,
                weatherData: WeatherDataUtils.getWeatherData(i, weatherData),
            });
        }
        this.refreshLayout.refreshComplete(dataList);
    };

    onFailure = (error) => {

    };
}
