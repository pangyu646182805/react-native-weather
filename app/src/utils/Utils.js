import {Platform, Dimensions} from "react-native";

export default class Utils {
    static getAppBarHeight = () => {
        return 44;
        // return Platform.OS === 'ios'
        //     ? isLandscape && !Platform.isPad
        //         ? 32
        //         : 44
        //     : 56;
    };

    static isAndroid() {
        return Platform.OS !== 'ios';
    }

    static isIphoneX() {
        const d = Dimensions.get('window');
        return (
            Platform.OS === 'ios' &&
            !Platform.isPad &&
            !Platform.isTVOS &&
            (d.height === 812 || d.width === 812)
        );
    }

    static getIphoneStatusBarHeight() {
        return this.isIphoneX() ? 50 : 20;
    }
};
