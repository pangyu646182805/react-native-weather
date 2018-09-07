import {
    PermissionsAndroid
} from 'react-native';

export default class PermissionsUtils {
    /**
     * 检查权限
     * @param permission 需要检查的权限
     * @param success 有该权限产生的回调
     * @param error 没有该权限产生的回调
     */
    static checkPermission(permission, success, error) {
        try {
            PermissionsAndroid.check(permission)
                .then((granted) => {
                    if (granted) {
                        success();
                    } else {
                        error();
                    }
                })
                .catch((error) => {
                    error();
                });
        } catch (error) {
            error();
        }
    }

    /**
     * 请求某一个权限
     * @param permission 需要请求的权限
     * @param success 请求成功之后产生的回调
     * @param error 请求失败产生的回调
     * @param successInfo 产生回调的信息
     * @param errorInfo 产生回调的信息
     */
    static requestPermission(permission, success, error, successInfo, errorInfo) {
        try {
            PermissionsAndroid.request(permission)
                .then((granted) => {
                    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                        // this.show("你已获取了读写权限")
                        success(successInfo);
                    } else {
                        // this.show("获取读写权限失败")
                        error(errorInfo);
                    }
                });
        } catch (error) {
            error(error.toString());
        }
    }
}
