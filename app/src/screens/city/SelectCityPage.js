import React, {Component} from 'react';
import {
    StatusBar,
    View,
    ScrollView,
    Text,
    TouchableOpacity,
    TextInput, ActivityIndicator
} from 'react-native';
import LinearGradient from "react-native-linear-gradient";
import Constants from "../../config/Constants";
import Utils from "../../utils/Utils";
import ToastUtils from "../../utils/ToastUtils";
import CityListManager from "../../manager/CityListManager";

const STATUS_BAR_HEIGHT = Utils.isAndroid() ? StatusBar.currentHeight : Utils.getIphoneStatusBarHeight();
const APP_BAR_HEIGHT = Utils.getAppBarHeight();
const SCREEN_WIDTH = Constants.common_param.SCREEN_WIDTH;

export default class SelectCityPage extends Component {
    static navigationOptions = ({navigation, screenProps}) => ({
        title: '添加城市',
        headerStyle: {
            height: APP_BAR_HEIGHT,
            backgroundColor: 'rgba(0, 0, 0, 0)',
            borderBottomWidth: 0,
            marginTop: Utils.isAndroid() ? STATUS_BAR_HEIGHT : 0
        },
        headerTitleStyle: {
            marginStart: 0,
            fontSize: 18
        },
        headerTintColor: 'white',
        headerPressColorAndroid: 'rgba(255, 255, 255, 0.4)',
        headerTransparent: true
    });

    constructor(props) {
        super(props);
        this.state = {
            navigation: props.navigation,
            // 是否显示查询城市列表
            showSearchResult: false,
            // 国内热门城市列表
            nationalHotList: [],
            // 国外热门城市列表
            internationalHotList: []
        };
    }

    render() {
        return (
            <LinearGradient colors={['#464e96', '#547ea9', '#409aaf']} style={{
                flex: 1
            }}>
                <View style={{
                    flex: 1,
                    marginTop: STATUS_BAR_HEIGHT + APP_BAR_HEIGHT
                }}>
                    <View style={{
                        width: SCREEN_WIDTH,
                        paddingTop: 8,
                        paddingBottom: 8,
                        paddingLeft: 16,
                        paddingRight: 16
                    }}>
                        <TextInput
                            style={{
                                width: SCREEN_WIDTH - 2 * 16,
                                backgroundColor: 'rgba(0, 0, 0, 0.1)',
                                borderRadius: 8,
                                borderWidth: 0.5,
                                borderColor: 'rgba(255, 255, 255, 0.1)',
                                paddingTop: 0,
                                paddingBottom: 0,
                                paddingLeft: 8,
                                paddingRight: 8,
                                color: 'rgba(255, 255, 255, 0.6)'
                            }}
                            onSubmitEditing={(event) => {
                                const cityName = event.nativeEvent.text;
                            }}
                            titleTextColor={'white'}
                            placeholder={'请输入城市名称'}
                            placeholderTextColor={'rgba(255, 255, 255, 0.3)'}
                            selectionColor={'rgba(255, 255, 255, 0.6)'}
                            underlineColorAndroid={'transparent'}
                            numberOfLines={1}/>
                    </View>
                    {this._renderHotCityList()}
                </View>
            </LinearGradient>
        );
    }

    _renderHotCityList = () => {
        const nationalHotList = this.state.nationalHotList;
        const internationalHotList = this.state.internationalHotList;
        if ((!nationalHotList || nationalHotList.length <= 0) ||
            (!internationalHotList || internationalHotList.length <= 0)) {
            return (
                <View style={{
                    flex: 1, justifyContent: 'center', alignItems: 'center'
                }}>
                    <ActivityIndicator size='large' color='#fff'/>
                </View>
            );
        }
        return (
            <ScrollView
                style={{flex: 1}}
                overScrollMode={'never'}>
                <Text style={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    width: SCREEN_WIDTH,
                    height: 32,
                    lineHeight: 32,
                    textAlign: 'center'
                }}>国内热门城市</Text>
                {this._renderCityList(nationalHotList)}
                <Text style={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    width: SCREEN_WIDTH,
                    height: 32,
                    lineHeight: 32,
                    textAlign: 'center'
                }}>国际热门城市</Text>
                {this._renderCityList(internationalHotList)}
            </ScrollView>
        );
    };

    _renderCityList = (cityList) => {
        let cityItems = [];
        let i;
        const length = cityList.length;
        for (i = 0; i < length; i++) {
            const cityItem = cityList[i];
            cityItems.push((
                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => {
                        CityListManager.addCity(cityItem.cityid, cityItem.upper, cityItem.name,
                            cityItem.prov, -1, -1, -1, null, -1, false, (cityList) => {
                                const {goBack, state} = this.state.navigation;
                                goBack();
                                state.params.callBack(true, cityList);
                                // requestAnimationFrame(() => {
                                // });
                            });
                    }}
                    key={i}>
                    <Text
                        style={{
                            color: 'rgba(255, 255, 255, 0.9)',
                            fontSize: 14,
                            borderRadius: 8,
                            borderWidth: 0.5,
                            borderColor: 'rgba(255, 255, 255, 0.8)',
                            paddingTop: 6,
                            paddingBottom: 6,
                            paddingLeft: 12,
                            paddingRight: 12,
                            margin: 6
                        }}>{cityItem.name}</Text>
                </TouchableOpacity>
            ));
        }
        return (
            <View style={{
                flex: 1, flexDirection: 'row', flexWrap: 'wrap',
                paddingLeft: 8, paddingBottom: 16
            }}>
                {cityItems}
            </View>
        );
    };

    componentDidMount() {
        this.getHotCityList();
    }

    getHotCityList = () => {
        const url = 'http://zhwnlapi.etouch.cn/Ecalender/api/city?lon=&app_ts=1502957577098&app_key=99817749&device_id=29c82fbe10331817eb2ba134d575d541&city_key=101210101&ver_name=6.9.6&uid=&keyword=&ver_code=716&channel=own&auth_token=eyJhY2N0ayI6IiIsInVwIjoiQU5EUk9JRCIsImRldmljZSI6IlNNLUc5NTUwMzUyNTYyMDc3MjY0MzM0In0%3D&lat=&type=hotV2&devid=a47cc0669be48a6b49aba18d1c42e200&os_version=70';
        fetch(url).then((response) => {
            if (response.ok) {
                return response.json();
            }
        }).then((jsonData) => {
            if (jsonData.status === 1000) {
                this.setState({
                    nationalHotList: jsonData.data.hot_national,
                    internationalHotList: jsonData.data.hot_international
                });
            }
        }).catch((error) => {
            ToastUtils.show(error.toString());
        });
    };
}
