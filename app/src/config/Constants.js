import {Dimensions} from "react-native";

export default {
    common_param: {
        PAGE_SIZE: 20,
        SCREEN_WIDTH: Dimensions.get('window').width,
        SCREEN_HEIGHT: Dimensions.get('window').height
    },

    permission_tips: {
        REQUEST_PERMISSION_SUCCESS: '权限申请成功',
        REQUEST_PERMISSION_FAILURE: '权限申请失败'
    },

    load_more_flag: {
        /*正在加载*/
        LOADING: 0,
        /*加载完成*/
        LOADING_COMPLETE: 1,
        /*加载完成没有更多数据*/
        LOADING_COMPLETE_NO_DATA: 2,
        LOADING_FAIL: 3
    },

    city_list: 'city_list',
    max_weather_city_number: 10,
    add_city_error: '您不能添加一个城市多次',
    add_city_fill: '您最多只能添加10个城市',

    tencent_location_api: {
        APP_KEY: 'E4DBZ-MKZW3-QSC3L-YNQNK-IQI3K-ERBDW'
    }
}
