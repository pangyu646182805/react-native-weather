import React, {Component} from 'react';
import {
    View,
    ART,
    Text
} from 'react-native';

const {Surface, Shape, Path} = ART;
import PropTypes from "prop-types";
import Constants from "../config/Constants";

const SCREEN_WIDTH = Constants.common_param.SCREEN_WIDTH;
// 圆圈到顶部最大间距
const MAX_TOP_GAP = 24;
const CIRCLE_RADIUS = 1.5;

export default class WeatherLineWidget extends Component {
    static propTypes = {
        WeatherLineBean: PropTypes.object,
        width: PropTypes.number,
        height: PropTypes.number,
        lineWidth: PropTypes.number,
        lineColor: PropTypes.string
    };

    static defaultProps = {
        WeatherLineBean: {
            maxTemp: -1,
            minTemp: -1,
            currentTemp: -1,
            preTemp: -1,
            nextTemp: -1
        },
        width: SCREEN_WIDTH / 6,
        height: 60,
        lineWidth: 0.8,
        lineColor: 'rgba(255, 255, 255, 0.5)'
    };

    render() {
        const {width, height, WeatherLineBean, lineWidth, lineColor} = this.props;
        const path = Path();
        const tempYAxis = this.calTempYAxis(WeatherLineBean.currentTemp);
        const preTemp = WeatherLineBean.preTemp;
        if (preTemp !== -1) {
            // 前一天有温度
            const preTempYAxis = this.calTempYAxis(preTemp);
            if (preTempYAxis <= tempYAxis) {
                // 前一天的y值小于当前的y值
                path.moveTo(0, (tempYAxis - preTempYAxis) * 0.5 + preTempYAxis);
            } else {
                path.moveTo(0, preTempYAxis - (preTempYAxis - tempYAxis) * 0.5);
            }
            path.lineTo(width * 0.5, tempYAxis);
        } else {
            // 前一天没有温度
            path.moveTo(width * 0.5, tempYAxis);
        }

        const nextTemp = WeatherLineBean.nextTemp;
        if (nextTemp !== -1) {
            // 下一天有温度
            const nextTempYAxis = this.calTempYAxis(nextTemp);
            if (nextTempYAxis <= tempYAxis) {
                // 下一天的y值小于当前的y值
                path.lineTo(width, (tempYAxis - nextTempYAxis) * 0.5 + nextTempYAxis);
            } else {
                path.lineTo(width, nextTempYAxis - (nextTempYAxis - tempYAxis) * 0.5);
            }
        }
        return (
            <View style={{
                width: width,
                height: height
            }}>
                <Surface
                    width={width}
                    height={height}>
                    <Shape d={path} stroke={lineColor} strokeWidth={lineWidth}/>
                </Surface>
                <View style={{
                    position: 'absolute',
                    width: CIRCLE_RADIUS * 2,
                    height: CIRCLE_RADIUS * 2,
                    borderRadius: CIRCLE_RADIUS,
                    backgroundColor: 'white',
                    top: tempYAxis - CIRCLE_RADIUS,
                    left: width * 0.5 - CIRCLE_RADIUS
                }}/>
                <Text ref={(ref) => {this.tempText = ref}} style={{
                    fontSize: 12,
                    position: 'absolute',
                    color: 'white'
                }} onLayout={(e) => {
                    const txtWidth = e.nativeEvent.layout.width;
                    const txtHeight = e.nativeEvent.layout.height;
                    this.tempText.setNativeProps({
                        style: {
                            top: tempYAxis - txtHeight - CIRCLE_RADIUS,
                            left: width * 0.5 - txtWidth * 0.5 + 2
                        }
                    });
                }}>{WeatherLineBean.currentTemp}°</Text>
            </View>
        );
    }

    calTempYAxis = (temp) => {
        const WeatherLineBean = this.props.WeatherLineBean;
        const diff = WeatherLineBean.maxTemp - temp;
        const diffTemp = WeatherLineBean.maxTemp - WeatherLineBean.minTemp;
        const percent = parseFloat(diff / diffTemp);
        const distance = this.props.height - MAX_TOP_GAP - CIRCLE_RADIUS;
        return MAX_TOP_GAP + distance * percent;
    };
}
