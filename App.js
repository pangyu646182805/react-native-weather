/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';
import Geolocation from 'Geolocation';

const instructions = Platform.select({
    ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
    android:
        'Double tap R on your keyboard to reload,\n' +
        'Shake or press menu button for dev menu',
});

type Props = {};
export default class App extends Component<Props> {
    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.welcome}>Welcome to React Native!</Text>
                <Text style={styles.instructions}>To get started, edit App.js</Text>
                <Text style={styles.instructions}>{instructions}</Text>
            </View>
        );
    }

    componentDidMount() {
        // alert(navigator.geolocation);
        // navigator.geolocation.watchPosition(
        //     (position) => {
        //
        //         let longitude = JSON.stringify(position.coords.longitude);//精度
        //         let latitude = JSON.stringify(position.coords.latitude);//纬度
        //         alert(longitude + latitude);
        //     },
        //     (error) => {
        //         alert(error);
        //     },
        //     {enableHighAccuracy: true, timeout: 5000, maximumAge: 1000}
        // );

        Geolocation.getCurrentPosition(
            location => {
                // https://apis.map.qq.com/ws/geocoder/v1/?location=30.280837,120.09132&key=E4DBZ-MKZW3-QSC3L-YNQNK-IQI3K-ERBDW
                //可以获取到的数据
                let result = "速度：" + location.coords.speed +
                    "\n经度：" + location.coords.longitude +
                    "\n纬度：" + location.coords.latitude +
                    "\n准确度：" + location.coords.accuracy +
                    "\n行进方向：" + location.coords.heading +
                    "\n海拔：" + location.coords.altitude +
                    "\n海拔准确度：" + location.coords.altitudeAccuracy +
                    "\n时间戳：" + location.timestamp;

                // ToastAndroid.show("UTIl" + location.coords.longitude, ToastAndroid.SHORT);
                alert(result);
                // alert([location.coords.longitude, location.coords.latitude]);
            },
            error => {
                // Alert.alert("获取位置失败：" + error, "")
                alert(error);
            }
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
});
