import React, {Component} from 'react';
import {
    Image,
    StatusBar,
    Text,
    TouchableNativeFeedback, TouchableOpacity,
    View, Alert, BackHandler
} from 'react-native';
import Utils from "../../utils/Utils";
import Constants from "../../config/Constants";
import LinearGradient from "react-native-linear-gradient";
import {HeaderBackButton} from "react-navigation";
import PPRefreshLayout from "../../widget/PPRefreshLayout";
import CityListManager from "../../manager/CityListManager";
import WeatherIconUtils from "../../utils/WeatherIconUtils";
import CheckBox from 'react-native-check-box'
import ToastUtils from "../../utils/ToastUtils";

const STATUS_BAR_HEIGHT = Utils.isAndroid() ? StatusBar.currentHeight : Utils.getIphoneStatusBarHeight();
const APP_BAR_HEIGHT = Utils.getAppBarHeight();
const SCREEN_WIDTH = Constants.common_param.SCREEN_WIDTH;

// 城市管理
export default class CityManagerPage extends Component {
    static navigationOptions = ({navigation, screenProps}) => ({
        headerTitle: navigation.state.params ? navigation.state.params.headerTitle : null,
        headerStyle: {
            height: APP_BAR_HEIGHT,
            backgroundColor: 'rgba(0, 0, 0, 0)',
            borderBottomWidth: 0.5,
            borderBottomColor: 'rgba(255, 255, 255, 0.1)',
            marginTop: Utils.isAndroid() ? STATUS_BAR_HEIGHT : 0
        },
        headerTitleStyle: {
            marginStart: 0,
            fontSize: 18
        },
        headerLeft: navigation.state.params ? navigation.state.params.headerLeft : HeaderBackButton,
        headerRight: navigation.state.params ? navigation.state.params.headerRight : null,
        headerTintColor: 'white',
        headerPressColorAndroid: 'rgba(255, 255, 255, 0.4)',
        headerTransparent: true
    });

    constructor(props) {
        super(props);
        this.state = {
            isEditMode: false
        };
        this.selectedItems = [];
        // 默认没有删除过，如果删除过返回的时候会发生回调
        this.haveDelete = false;
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
                    <PPRefreshLayout
                        // extraData={this.state.isEditMode}
                        ref={(ref) => this.refreshLayout = ref}
                        renderItem={({item, index}) => {
                            return this.convert(item, index);
                        }}
                        ItemSeparatorComponent={this.Separator}
                        refreshEnable={false}
                        loadMoreEnable={false}/>
                </View>
            </LinearGradient>
        );
    }

    Separator = () => {
        return <View style={{
            height: 0.5, backgroundColor: 'rgba(255, 255, 255, 0.1)'
        }}/>;
    };

    convert = (item, index) => {
        const cityItem = item.cityItem;
        const selected = item.selected;
        const cityName = cityItem.district ? cityItem.district : cityItem.cityName;
        const isEditMode = this.state.isEditMode;
        const onPressItem = () => this.onPressItem(isEditMode, item, index);
        const child = (
            <View style={{
                flexDirection: 'row',
                paddingLeft: isEditMode ? 0 : 24,
                paddingRight: 24,
                paddingTop: 8,
                paddingBottom: 8,
            }}>
                {isEditMode ? <CheckBox
                    style={{paddingStart: 16, paddingEnd: 16, alignSelf: 'center'}}
                    checkBoxColor={'white'}
                    onClick={onPressItem}
                    isChecked={selected}/> : null}
                <View style={{
                    flex: 1,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}>
                    <View style={{}}>
                        <Text style={{
                            color: 'white',
                            fontSize: 16
                        }}>{cityName}</Text>
                        <Text style={{
                            color: 'rgba(255, 255, 255, 0.8)',
                            fontSize: 14, marginTop: 4
                        }}>{cityItem.province + ' ' + cityName}</Text>
                    </View>
                    <View>
                        <View style={{
                            flexDirection: 'row',
                            alignItems: 'center'
                        }}>
                            <Image source={WeatherIconUtils.getWeatherIconByType(cityItem.weatherType, false)} style={{
                                width: 24, height: 24, resizeMode: 'cover'
                            }}/>
                            <Text style={{
                                fontSize: 22, fontFamily: 'Roboto',
                                color: 'rgba(255, 255, 255, 0.95)',
                                marginLeft: 8
                            }}>{cityItem.temp}°</Text>
                        </View>
                        <Text style={{
                            color: 'rgba(255, 255, 255, 0.8)',
                            alignSelf: 'center',
                            fontSize: 14
                        }}>{cityItem.max + '°/' + cityItem.min + '°'}</Text>
                    </View>
                </View>
            </View>
        );
        if (Utils.isAndroid()) {
            const Ripple = TouchableNativeFeedback.Ripple('rgba(255, 255, 255, 0.3)', false);
            return (
                <TouchableNativeFeedback
                    background={Ripple}
                    onPress={onPressItem}
                    onLongPress={() => this.changeState(true)}>
                    {child}
                </TouchableNativeFeedback>
            );
        }
        return (
            <TouchableOpacity
                activeOpacity={0.8}
                onPress={onPressItem}
                onLongPress={() => this.changeState(true)}>
                {child}
            </TouchableOpacity>
        );
    };

    onPressItem = (isEditMode, item, index) => {
        if (!isEditMode) return;
        const selected = item.selected;
        if (selected) {
            const deleteIndex = this.selectedItems.indexOf(item.cityItem);
            if (deleteIndex !== -1) this.selectedItems.splice(deleteIndex, 1);
        } else {
            this.selectedItems.push(item.cityItem);
        }
        this.refreshHeaderTitle();
        this.refreshHeaderRight();
        item.selected = !selected;
        const dataList = this.refreshLayout.getDataList();
        dataList[index] = item;
        this.refreshLayout.refreshComplete(dataList);
    };

    /**
     * 渲染编辑模式下的headerLeft
     */
    _renderEditModeHeaderLeft = () => {
        const child = (
            <View style={{padding: 4, marginStart: 12}}>
                <Image source={require('../../../images/ic_close.png')} style={{
                    width: 24, height: 24, resizeMode: 'cover', tintColor: 'rgba(255, 255, 255, 0.9)'
                }}/>
            </View>
        );
        if (Utils.isAndroid()) {
            const Ripple = TouchableNativeFeedback.Ripple('rgba(255, 255, 255, 0.4)', true);
            return (
                <TouchableNativeFeedback
                    background={Ripple}
                    onPress={() => this.changeState(false)}>
                    {child}
                </TouchableNativeFeedback>
            );
        }
        return (
            <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => this.changeState(false)}>
                {child}
            </TouchableOpacity>
        );
    };

    _renderEditModeHeaderRight = () => {
        const selectedItems = this.selectedItems;
        const dataList = this.refreshLayout.getDataList();
        // 是否已经全选
        const hasAllSelected = selectedItems.length === dataList.length;
        // 是否有一个勾选
        const hasSelected = selectedItems.length > 0;
        const child0 = (
            <View style={{padding: 4, marginEnd: 12}}>
                <Text style={{
                    color: 'white',
                    fontSize: 14
                }}>{hasAllSelected ? '取消全选' : '全选'}</Text>
            </View>
        );
        const child1 = (
            <View style={{padding: 4, marginEnd: 12}}>
                <Text style={{
                    color: hasSelected ? 'white' : 'rgba(255, 255, 255, 0.3)',
                    fontSize: 14
                }}>删除</Text>
            </View>
        );
        const onChild0Press = () => {
            if (hasAllSelected) {
                // 取消全选
                this.clearSelected(true);
            } else {
                // 全选
                this.selectAll();
            }
        };
        const onChild1Press = () => {
            const selectedItems = this.selectedItems;
            Alert.alert(
                '提示',
                '移除所选城市',
                [
                    {text: '取消', style: 'cancel'},
                    {
                        text: '确定', onPress: () => {
                            CityListManager.deleteCityList(selectedItems, (cityList) => {
                                // 删除完成之后的回调
                                ToastUtils.show('删除成功');
                                this.haveDelete = true;
                                this.refreshLayout.refreshComplete(
                                    this.wrapCityList(cityList), () => {
                                        this.changeState(false);
                                    });
                            });
                        }
                    }
                ],
                {cancelable: false}
            );
        };
        if (Utils.isAndroid()) {
            const Ripple = TouchableNativeFeedback.Ripple('rgba(255, 255, 255, 0.4)', true);
            return (
                <View style={{flexDirection: 'row'}}>
                    <TouchableNativeFeedback
                        background={Ripple}
                        onPress={onChild0Press}>
                        {child0}
                    </TouchableNativeFeedback>
                    {hasSelected ? <TouchableNativeFeedback
                        background={Ripple}
                        onPress={onChild1Press}>
                        {child1}
                    </TouchableNativeFeedback> : child1}
                </View>
            );
        }
        return (
            <View style={{flexDirection: 'row'}}>
                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={onChild0Press}>
                    {child0}
                </TouchableOpacity>
                {hasSelected ? <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={onChild1Press}>
                    {child1}
                </TouchableOpacity> : child1}
            </View>
        );
    };

    _renderHeaderRight = () => {
        const child = (
            <View style={{padding: 4, marginEnd: 12}}>
                <Text style={{
                    color: 'white',
                    fontSize: 14
                }}>编辑</Text>
            </View>
        );
        if (Utils.isAndroid()) {
            const Ripple = TouchableNativeFeedback.Ripple('rgba(255, 255, 255, 0.4)', true);
            return (
                <TouchableNativeFeedback
                    background={Ripple}
                    onPress={() => this.changeState(true)}>
                    {child}
                </TouchableNativeFeedback>
            );
        }
        return (
            <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => this.changeState(true)}>
                {child}
            </TouchableOpacity>
        );
    };

    changeState = (isEditMode) => {
        const currentMode = this.state.isEditMode;
        if (currentMode === isEditMode) return;
        this.setState({isEditMode: isEditMode});
        if (isEditMode) {
            this.props.navigation.setParams({
                headerTitle: '请选择',
                headerLeft: this._renderEditModeHeaderLeft(),
                headerRight: this._renderEditModeHeaderRight()
            });
        } else {
            this.clearSelected();
            this.props.navigation.setParams({
                headerTitle: '城市管理',
                headerLeft: this.getDefaultHeaderLeft(),
                headerRight: this._renderHeaderRight()
            });
        }
    };

    refreshHeaderTitle = () => {
        const selectedItems = this.selectedItems;
        this.props.navigation.setParams({
            headerTitle: selectedItems.length === 0 ? '请选择' : '已选择' + selectedItems.length
        });
    };

    refreshHeaderRight = () => {
        this.props.navigation.setParams({
            headerRight: this._renderEditModeHeaderRight()
        });
    };

    /**
     * 全选
     */
    selectAll = () => {
        const dataList = this.refreshLayout.getDataList();
        this.selectedItems = [];
        dataList.map((item) => {
            if (!item.selected) item.selected = true;
            this.selectedItems.push(item.cityItem);
        });
        this.refreshLayout.refreshComplete(dataList);
        this.refreshHeaderRight();
    };

    /**
     * 取消全选
     */
    clearSelected = (needRefresh = false) => {
        this.selectedItems = [];
        const dataList = this.refreshLayout.getDataList();
        dataList.map((item) => {
            if (item.selected) item.selected = false;
        });
        if (needRefresh) {
            this.refreshLayout.refreshComplete(dataList);
            this.refreshHeaderRight();
        }
    };

    getDefaultHeaderLeft = () => {
        return (
            <HeaderBackButton
                onPress={() => this.handleBackPress()}
                pressColorAndroid={'rgba(255, 255, 255, 0.4)'}
                tintColor={'white'}/>
        );
    };

    componentDidMount() {
        this.props.navigation.setParams({
            headerTitle: '城市管理',
            headerLeft: this.getDefaultHeaderLeft(),
            headerRight: this._renderHeaderRight()
        });
        CityListManager.getCityList((cityList) => {
            this.refreshLayout.refreshComplete(this.wrapCityList(cityList));
        });
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
    }

    handleBackPress = () => {
        const isEditMode = this.state.isEditMode;
        if (isEditMode) {
            this.changeState(false);
            return true;
        }
        this.judgeGoBackNeedRefresh();
        this.props.navigation.goBack();
        return true;
    };

    judgeGoBackNeedRefresh = () => {
        const {state} = this.props.navigation;
        if (this.haveDelete) {
            const dataList = this.refreshLayout.getDataList();
            let cityList = [];
            dataList.map((item) => cityList.push(item.cityItem));
            state.params.callBack(this.haveDelete, cityList);
        }
    };

    componentWillUnmount() {
        this.backHandler.remove();
        this.judgeGoBackNeedRefresh();
    }

    /**
     * 包装一下cityList
     */
    wrapCityList = (cityList) => {
        if (cityList && cityList.length > 0) {
            let dataList = [];
            for (let i = 0; i < cityList.length; i++) {
                dataList.push({
                    selected: false,
                    cityItem: cityList[i]
                });
            }
            return dataList;
        }
        return [];
    }
}
