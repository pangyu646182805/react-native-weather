import React, {Component} from 'react';
import {
    View,
    Text,
    ART
} from 'react-native';
import moment from 'moment';
import PropTypes from "prop-types";
import Constants from "../config/Constants";
import WeatherTimeUtils from "../utils/WeatherTimeUtils";

const {Surface, Shape, Path, Group} = ART;

const CIRCLE = Math.PI * 2;
const SCREEN_WIDTH = Constants.common_param.SCREEN_WIDTH;

let percent;

export default class SunriseAndSunsetWidget extends Component {
    static propTypes = {
        // 日出05:33
        sunrise: PropTypes.string.isRequired,
        // 日落18:28
        sunset: PropTypes.string.isRequired
    };

    constructor(props) {
        super(props);
        const {sunrise, sunset} = props;
        const sunriseMillis = this.timeStrToTimeMill(sunrise);
        const sunsetMillis = this.timeStrToTimeMill(sunset);
        percent = parseFloat((moment().get() - sunriseMillis) / (sunsetMillis - sunriseMillis));
        if (percent < 0)
            percent = 0;
        if (percent > 1)
            percent = 1;
    }

    render() {
        const {sunrise, sunset} = this.props;
        if (!sunrise || !sunset) return null;
        const leftAndRightPadding = 16;
        const radius = (SCREEN_WIDTH - 2 * leftAndRightPadding) / 2;
        const height = radius + leftAndRightPadding;

        const path = this.makeArcPath(leftAndRightPadding, leftAndRightPadding,
            -CIRCLE * 0.25, CIRCLE * 0.25, radius, 'clockwise');

        const sunRadius = 10;
        const sunriseAndSunsetWidth = radius * 2;
        const sunCircleX = sunriseAndSunsetWidth * percent + leftAndRightPadding - sunRadius;

        let diffSunCircleXAndSunriseAndSunsetWidth = (sunCircleX - leftAndRightPadding + sunRadius) - 0.5 * sunriseAndSunsetWidth;
        let sunCircleY, circleAngle;
        if (diffSunCircleXAndSunriseAndSunsetWidth !== 0) {
            if (diffSunCircleXAndSunriseAndSunsetWidth > 0) {
                // 太阳圆圈在右边
                circleAngle = Math.acos(diffSunCircleXAndSunriseAndSunsetWidth / (0.5 * sunriseAndSunsetWidth));
                circleAngle = 180 - (180 / Math.PI * circleAngle);
            } else {
                // 太阳圆圈在左边
                circleAngle = Math.acos(-diffSunCircleXAndSunriseAndSunsetWidth / (0.5 * sunriseAndSunsetWidth));
                circleAngle = 180 / Math.PI * circleAngle;
            }
            diffSunCircleXAndSunriseAndSunsetWidth = Math.max(diffSunCircleXAndSunriseAndSunsetWidth);
            sunCircleY = Math.sqrt(Math.pow(0.5 * sunriseAndSunsetWidth, 2) - Math.pow(diffSunCircleXAndSunriseAndSunsetWidth, 2));
            sunCircleY = height - sunCircleY - sunRadius;
        } else {
            sunCircleY = leftAndRightPadding - sunRadius;
        }

        const endAngle = -CIRCLE * 0.25 + CIRCLE * 0.25 * 2 * (circleAngle / 180);
        const swipePath = this.makeArcPath(leftAndRightPadding, leftAndRightPadding,
            -CIRCLE * 0.25, endAngle, radius, 'clockwise');

        const trianglePath = Path();
        trianglePath.moveTo(leftAndRightPadding, height);
        trianglePath.lineTo(sunCircleX + sunRadius, sunCircleY + sunRadius);
        trianglePath.lineTo(sunCircleX + sunRadius, height);
        trianglePath.close();
        return (
            <View style={{
                width: SCREEN_WIDTH,
                height: height
            }}>
                <Surface
                    width={SCREEN_WIDTH}
                    height={height}>
                    <Group>
                        <Shape d={path} stroke={'#fff'} strokeWidth={1}
                               strokeDash={[10, 8]}/>
                        <Shape d={swipePath} strokeWidth={0} fill={'rgba(255, 255, 255, 0.3)'}/>
                        <Shape d={trianglePath} strokeWidth={0} fill={'rgba(255, 255, 255, 0.3)'}/>
                    </Group>
                </Surface>
                <View style={{
                    position: 'absolute',
                    bottom: 0, left: 0, right: 0,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    paddingLeft: leftAndRightPadding + 12,
                    paddingRight: leftAndRightPadding + 12,
                    paddingBottom: 2
                }}>
                    <Text style={{
                        color: 'white',
                        fontSize: 12
                    }}>日出 {sunrise}</Text>
                    <Text style={{
                        color: 'white',
                        fontSize: 12
                    }}>日落 {sunset}</Text>
                </View>
                <View style={{
                    position: 'absolute',
                    borderColor: 'white',
                    borderWidth: 0.5,
                    width: sunRadius * 2,
                    height: sunRadius * 2,
                    borderRadius: sunRadius,
                    left: sunCircleX,
                    top: sunCircleY
                }}/>
            </View>
        );
    }

    makeArcPath = (x, y, startAngleArg, endAngleArg, radius, direction) => {
        let startAngle = startAngleArg;
        let endAngle = endAngleArg;
        if (endAngle - startAngle >= CIRCLE) {
            endAngle = CIRCLE + (endAngle % CIRCLE);
        } else {
            endAngle = endAngle % CIRCLE;
        }
        startAngle = startAngle % CIRCLE;
        const angle =
            startAngle > endAngle
                ? CIRCLE - startAngle + endAngle
                : endAngle - startAngle;

        if (angle >= CIRCLE) {
            return new Path()
                .moveTo(x + radius, y)
                .arc(0, radius * 2, radius, radius)
                .arc(0, radius * -2, radius, radius)
                .close();
        }

        const directionFactor = direction === 'counter-clockwise' ? -1 : 1;
        endAngle *= directionFactor;
        startAngle *= directionFactor;
        const startSine = Math.sin(startAngle);
        const startCosine = Math.cos(startAngle);
        const endSine = Math.sin(endAngle);
        const endCosine = Math.cos(endAngle);

        const arcFlag = angle > Math.PI ? 1 : 0;
        const reverseFlag = direction === 'counter-clockwise' ? 0 : 1;

        return `M${x + radius * (1 + startSine)} ${y + radius - radius * startCosine}
          A${radius} ${radius} 0 ${arcFlag} ${reverseFlag} ${x +
        radius * (1 + endSine)} ${y + radius - radius * endCosine}`;
    };

    /**
     * 返回18:58的时间戳
     * @param timeStr 18:58
     */
    timeStrToTimeMill = (timeStr) => {
        if (timeStr) {
            const wholeTime = moment().format('YYYYMMDD') + ' ' + timeStr;
            return moment(wholeTime, "YYYYMMDD HH:mm").get();
        }
        return -1;
    };
}
