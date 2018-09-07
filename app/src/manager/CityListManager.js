import {AsyncStorage} from "react-native"
import Constants from "../config/Constants";
import ToastUtils from "../utils/ToastUtils";

export default class CityListManager {
    /**
     * 添加该城市到缓存中去
     */
    static addCity(cityId, cityName, district, province, temp,
                   max, min, weatherDesc, weatherType, isLocation, complete) {
        const cityItem = this.generateCityItem(cityId, cityName, district, province, temp,
            max, min, weatherDesc, weatherType, isLocation);
        this.findCity(cityId, (hasCity, cityList) => {
            if (cityList && cityList.length >= Constants.max_weather_city_number) {
                // 已经满10个城市
                ToastUtils.show(Constants.add_city_fill);
                return;
            }
            if (hasCity) {
                // 有这个城市
                ToastUtils.show(Constants.add_city_error);
            } else {
                // 没有这个城市
                if (!cityList) cityList = [];
                cityList.push(cityItem);
                AsyncStorage.setItem(Constants.city_list, JSON.stringify(cityList), () => complete(cityList));
            }
        });
    }

    /**
     * 更新城市列表
     */
    static updateCity(cityId, cityName, district, province, temp,
                      max, min, weatherDesc, weatherType, isLocation) {
        let updateCity = this.generateCityItem(cityId, cityName, district, province, temp,
            max, min, weatherDesc, weatherType, isLocation);
        this.getCityList((cityList) => {
            if (cityList && cityList.length > 0) {
                let index = -1;
                for (let i = 0; i < cityList.length; i++) {
                    const cityItem = cityList[i];
                    if (cityId === cityItem.cityId) {
                        index = i;
                        break;
                    }
                }
                if (index !== -1) {
                    cityList[index] = updateCity;
                    AsyncStorage.setItem(Constants.city_list, JSON.stringify(cityList));
                }
            }
        });
    }

    /**
     * 获取所有缓存的cityList
     * @param callBack cityList的回调
     */
    static getCityList(callBack) {
        AsyncStorage.getItem(Constants.city_list, (error, result) => {
            let cityList = [];
            if (result) {
                cityList = JSON.parse(result);
            }
            callBack(cityList);
        });
    }

    /**
     * 根据cityId查询缓存cityList是否有该城市
     */
    static findCity(cityId, callBack) {
        this.getCityList((cityList) => {
            let hasCity = false;
            if (cityList && cityList.length > 0) {
                for (let i = 0; i < cityList.length; i++) {
                    const cityItem = cityList[i];
                    if (cityId === cityItem.cityId) {
                        hasCity = true;
                        break;
                    }
                }
            }
            if (hasCity) {
                callBack(true, cityList);
            } else {
                callBack(false, cityList);
            }
        });
    }

    static deleteCityList(deleteCityList = [], complete) {
        this.getCityList((cityList) => {
            if (cityList && cityList.length > 0) {
                let dataList = [];
                cityList.map((cityItem) => {
                    let needDelete = false;
                    for (let i = 0; i < deleteCityList.length; i++) {
                        const deleteCity = deleteCityList[i];
                        if (cityItem.cityId === deleteCity.cityId) {
                            // 如果需要删除
                            needDelete = true;
                            break;
                        }
                    }
                    if (!needDelete) dataList.push(cityItem);
                });
                AsyncStorage.setItem(Constants.city_list, JSON.stringify(dataList), () => complete(dataList));
            }
        });
    }

    /**
     * 生成一个城市item
     * @param cityId 城市id
     * @param cityName 城市名称
     * @param district 城市区域
     * @param province 城市所属省份
     * @param temp 当前温度
     * @param max 城市天气最高温度
     * @param min 城市天气最低温度
     * @param weatherDesc 天气描述(多云)
     * @param weatherType type图标
     * @param isLocation 是否是定位地址
     * @returns {{cityId: *, cityName: *, district: *, province: *, max: *, min: *, isLocation: *}}
     */
    static generateCityItem(cityId, cityName, district, province, temp,
                            max, min, weatherDesc, weatherType, isLocation) {
        return {
            cityId: cityId,
            cityName: cityName,
            district: district,
            province: province,
            temp: temp,
            max: max,
            min: min,
            weatherDesc: weatherDesc,
            weatherType: weatherType,
            isLocation: isLocation
        };
    }
}
