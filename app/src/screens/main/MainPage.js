import React, {Component} from 'react';
import {
    View,
    StatusBar,
    TouchableOpacity,
    Image,
    ActivityIndicator,
    PermissionsAndroid,
    TouchableNativeFeedback
} from 'react-native';
import PermissionsUtils from "../../utils/PermissionsUtils";
import ToastUtils from "../../utils/ToastUtils";
import Constants from "../../config/Constants";
// import Geolocation from 'Geolocation';
import LinearGradient from 'react-native-linear-gradient';
import Utils from "../../utils/Utils";
import CityListManager from "../../manager/CityListManager";
import ScrollableTabView from "react-native-scrollable-tab-view";
import WeatherComponent from "../../components/WeatherComponent";
import WeatherLineWidget from "../../widget/WeatherLineWidget";

const STATUS_BAR_HEIGHT = Utils.isAndroid() ? StatusBar.currentHeight : Utils.getIphoneStatusBarHeight();
const APP_BAR_HEIGHT = Utils.getAppBarHeight();
const TOP_HEIGHT = 96;

let currentTabIndex = 0;
let weatherComponentsArr;

/**
 * 天气预报主界面
 */
export default class MainPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // 正在定位中
            requestLocation: true,
            cityList: []
        };
    }

    static navigationOptions = ({navigation, screenProps}) => ({
        headerStyle: {
            height: APP_BAR_HEIGHT,
            backgroundColor: 'rgba(0, 0, 0, 0)',
            borderBottomWidth: 0,
            marginTop: Utils.isAndroid() ? STATUS_BAR_HEIGHT : 0
        },
        headerTransparent: true,
        headerRight: navigation.state.params ? navigation.state.params.headerRight : null,
        headerLeft: navigation.state.params ? navigation.state.params.headerLeft : null
    });

    /**
     * 右边分享按钮
     */
    _renderHeaderRight = () => {
        if (Utils.isAndroid()) {
            const Ripple = TouchableNativeFeedback.Ripple('rgba(255, 255, 255, 0.4)', true);
            return (
                <TouchableNativeFeedback
                    background={Ripple}
                    onPress={() => this._shareWeather()}>
                    <View style={{padding: 4, marginEnd: 12}}>
                        <Image source={require('../../../images/ic_share.png')} style={{
                            width: 24, height: 24, resizeMode: 'cover', tintColor: 'rgba(255, 255, 255, 0.9)'
                        }}/>
                    </View>
                </TouchableNativeFeedback>
            );
        }
        return (
            <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => this._shareWeather()}>
                <View style={{padding: 4, marginEnd: 12}}>
                    <Image source={require('../../../images/ic_share.png')} style={{
                        width: 24, height: 24, resizeMode: 'cover', tintColor: 'rgba(255, 255, 255, 0.9)'
                    }}/>
                </View>
            </TouchableOpacity>
        );
    };

    /**
     * 左边添加城市加号按钮
     */
    _renderHeaderLeft = () => {
        if (Utils.isAndroid()) {
            const Ripple = TouchableNativeFeedback.Ripple('rgba(255, 255, 255, 0.4)', true);
            return (
                <TouchableNativeFeedback
                    background={Ripple}
                    onPress={() => this._addCity()}>
                    <View style={{padding: 4, marginStart: 12}}>
                        <Image source={require('../../../images/ic_add.png')} style={{
                            width: 24, height: 24, resizeMode: 'cover', tintColor: 'rgba(255, 255, 255, 0.9)'
                        }}/>
                    </View>
                </TouchableNativeFeedback>
            );
        }
        return (
            <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => this._addCity()}>
                <View style={{padding: 4, marginStart: 12}}>
                    <Image source={require('../../../images/ic_add.png')} style={{
                        width: 24, height: 24, resizeMode: 'cover', tintColor: 'rgba(255, 255, 255, 0.9)'
                    }}/>
                </View>
            </TouchableOpacity>
        );
    };

    _addCity = () => {
        this.props.navigation.navigate('SelectCity', {
            callBack: (success, cityList) => {
                // success表示是否成功添加城市
                // cityList表示添加城市之后的缓存列表
                if (success) {
                    this.refreshThisPage(cityList);
                    // 跳转到刚刚添加的城市天气预报界面
                    this.tabView.goToPage(cityList.length - 1);
                }
            }
        });
    };

    _shareWeather = () => {
        ToastUtils.show('分享功能待开发');
    };

    // colors={['#464e96', '#547ea9', '#409aaf']}
    // colors={['rgb(27, 129, 167)', 'rgb(47, 166, 186)', 'rgb(109, 193, 193)']}
    render() {
        return (
            <LinearGradient colors={['#464e96', '#547ea9', '#409aaf']} style={{
                flex: 1
            }}>
                <StatusBar
                    barStyle={'light-content'}
                    translucent={true}
                    backgroundColor={'rgba(0, 0, 0, 0)'}/>
                <View style={{
                    flex: 1
                }}>
                    {this.state.requestLocation ?
                        <View style={{
                            flex: 1, justifyContent: 'center', alignItems: 'center',
                            marginTop: STATUS_BAR_HEIGHT + APP_BAR_HEIGHT
                        }}>
                            <ActivityIndicator size='large' color='#fff'/>
                        </View> :
                        <View style={{
                            flex: 1,
                            marginTop: STATUS_BAR_HEIGHT
                            // marginTop: STATUS_BAR_HEIGHT + APP_BAR_HEIGHT
                        }}>
                            {this._renderMainComponent()}
                        </View>}
                    {/*<View style={{*/}
                    {/*position: 'absolute', top: 0, left: 0, right: 0,*/}
                    {/*height: APP_BAR_HEIGHT,*/}
                    {/*marginTop: STATUS_BAR_HEIGHT,*/}
                    {/*backgroundColor: 'rgba(255, 255, 255, 0.6)'*/}
                    {/*// height: TOP_HEIGHT + STATUS_BAR_HEIGHT*/}
                    {/*}}>*/}
                    {/*</View>*/}
                </View>
            </LinearGradient>
        )
    }

    /**
     * 渲染主界面
     */
    _renderMainComponent = () => {
        const cityList = this.state.cityList;
        if (cityList && cityList.length > 0) {
            let weatherComponents = [];
            weatherComponentsArr = [];
            for (let i = 0; i < cityList.length; i++) {
                const cityItem = cityList[i];
                weatherComponentsArr.push(null);
                weatherComponents.push(this._renderWeatherComponent(cityItem, i));
            }
            return (
                <ScrollableTabView
                    ref={(ref) => this.tabView = ref}
                    tabBarBackgroundColor={'#ff0'}
                    renderTabBar={false}
                    onChangeTab={(obj) => {
                        const index = obj.i;
                        if (weatherComponentsArr) {
                            const weatherComponent = weatherComponentsArr[currentTabIndex];
                            weatherComponent && weatherComponent.scrollToTop();
                        }
                        currentTabIndex = index;
                    }}>
                    {weatherComponents}
                </ScrollableTabView>
            );
        }
        return null;
    };

    /**
     * 渲染天气界面
     */
    _renderWeatherComponent = (cityItem, index) => {
        return (
            <WeatherComponent
                ref={(ref) => {
                    weatherComponentsArr[index] = ref
                }}
                key={cityItem.cityId}
                cityItem={cityItem}
                navigation={this.props.navigation}
                refreshMainPage={(cityList) => this.refreshThisPage(cityList)}/>
        );
    };

    componentDidMount() {
        this.props.navigation.setParams({
            headerRight: this._renderHeaderRight(),
            headerLeft: this._renderHeaderLeft()
        });
        // 检查是否有定位权限
        if (Utils.isAndroid()) {
            PermissionsUtils.checkPermission(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                () => {
                    this.locationPermissionRequestSuccess();
                }, () => {
                    this.requestLocationPermission();
                });
        } else {
            this.locationPermissionRequestSuccess();
        }
    }

    /**
     * 请求定位权限
     */
    requestLocationPermission = () => {
        PermissionsUtils.requestPermission(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            (successInfo) => {
                ToastUtils.show(successInfo);
                this.locationPermissionRequestSuccess();
            }, (errorInfo) => {
                ToastUtils.show(errorInfo);
            }, Constants.permission_tips.REQUEST_PERMISSION_SUCCESS, Constants.permission_tips.REQUEST_PERMISSION_FAILURE);
    };

    /**
     * 成功获取定位权限
     */
    locationPermissionRequestSuccess = () => {
        CityListManager.getCityList((cityList) => {
            if (cityList && cityList.length > 0) {
                currentTabIndex = 0;
                this.setState({
                    requestLocation: false,
                    cityList: cityList
                });
            } else {
                // 如果没有一个城市列表缓存则去定位
                this.tencentLocationRequest('30.280837', '120.09132');
                navigator.geolocation.getCurrentPosition(
                    location => {
                        // 纬度
                        const latitude = location.coords.latitude;
                        // 经度
                        const longitude = location.coords.longitude;
                        this.tencentLocationRequest('30.280837', '120.09132');
                    },
                    error => {
                        ToastUtils.show(error);
                    }
                );
            }
        });
    };

    refreshThisPage = (cityList) => {
        if (cityList && cityList.length > 0) {
            currentTabIndex = 0;
            this.setState({
                requestLocation: false,
                cityList: cityList
            });
        }
    };

    /**
     * 使用腾讯定位api定位
     * @param latitude 纬度
     * @param longitude 经度
     */
    tencentLocationRequest = (latitude, longitude) => {
        const url = 'https://apis.map.qq.com/ws/geocoder/v1/?location='
            + latitude + ',' + longitude + '&key=' + Constants.tencent_location_api.APP_KEY;
        fetch(url).then((response) => {
            if (response.ok) {
                return response.json();
            }
        }).then((jsonData) => {
            this.locationRequestSuccess(jsonData);
        }).catch((error) => {
            ToastUtils.show(error.toString());
        })
    };

    locationRequestSuccess = (jsonData) => {
        if (jsonData) {
            const address = jsonData.result.address_component;
            let locationCity = address.city;
            let locationProvince = address.province;
            let locationDistrict = address.district;
            const searchCityUrl = 'http://zhwnlapi.etouch.cn/Ecalender/api/city?lon=&app_ts=1502957830998&app_key=99817749&foreign=true&device_id=29c82fbe10331817eb2ba134d575d541&ver_name=6.9.6&ver_code=716&uid=&keyword=' +
                address.district + '&channel=own&auth_token=eyJhY2N0ayI6IiIsInVwIjoiQU5EUk9JRCIsImRldmljZSI6IlNNLUc5NTUwMzUyNTYyMDc3MjY0MzM0In0%3D&lat=&type=search&devid=a47cc0669be48a6b49aba18d1c42e200&os_version=70';
            fetch(searchCityUrl).then((response) => {
                if (response.ok) {
                    return response.json();
                }
            }).then((result) => {
                const results = result.data;
                if (results && results.length > 0) {
                    for (let i = 0; i < results.length; i++) {
                        const resultBean = results[i];
                        if (resultBean.prov.indexOf(locationProvince) !== -1
                            || locationProvince.indexOf(resultBean.prov) !== -1) {
                            // 省份校验通过
                            if (resultBean.upper.indexOf(locationCity) !== -1
                                || locationCity.indexOf(resultBean.upper) !== -1) {
                                // 城市校验通过
                                if (resultBean.name.indexOf(locationDistrict) !== -1
                                    || locationDistrict.indexOf(resultBean.name) !== -1) {
                                    // 区域校验通过
                                    CityListManager.addCity(resultBean.cityid, resultBean.upper,
                                        resultBean.name, resultBean.prov, -1, -1, -1, null, -1, true, (cityList) => {
                                            this.refreshThisPage(cityList);
                                        });
                                    break;
                                }
                            }
                        }
                    }
                }
                this.setState({requestLocation: false})
            }).catch((error) => {
                ToastUtils.show(error.toString());
            });
        }
    };
}
