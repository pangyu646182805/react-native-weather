import React, {Component} from 'react';
import {
    View,
    Text,
    ART
} from 'react-native';
import PropTypes from "prop-types";

const {Surface, Shape, Path, Group} = ART;

const CIRCLE = Math.PI * 2;
/**
 * 空气污染指数取值范围0-500
 */
const AIR_QUALITY_INDEX = 500;
const AIR_QUALITY_LEVEL = [
    '#58bc14',
    '#d0ba09',
    '#fd7e01',
    '#f70001',
    '#98004c',
    '#7d0023'
];

export default class AirQualityWidget extends Component {
    static propTypes = {
        evnBean: PropTypes.object,
        widthAndHeight: PropTypes.number,
        trackWidth: PropTypes.number,
        trackColor: PropTypes.string
    };

    static defaultProps = {
        widthAndHeight: 180,
        trackWidth: 12,
        trackColor: 'rgba(255, 255, 255, 0.3)'
    };

    render() {
        const evnBean = this.props.evnBean;
        if (!evnBean) return null;

        let airQuality = evnBean.aqi;
        let airQualityLevelAndColor;
        let airQualityDesc;
        if (airQuality >= 0 && airQuality <= 50) {
            airQualityLevelAndColor = 0;
            airQualityDesc = "优";
        } else if (airQuality > 50 && airQuality <= 100) {
            airQualityLevelAndColor = 1;
            airQualityDesc = "良";
        } else if (airQuality > 100 && airQuality <= 150) {
            airQualityLevelAndColor = 2;
            airQualityDesc = "轻度污染";
        } else if (airQuality > 150 && airQuality <= 200) {
            airQualityLevelAndColor = 3;
            airQualityDesc = "中度污染";
        } else if (airQuality > 200 && airQuality <= 300) {
            airQualityLevelAndColor = 4;
            airQualityDesc = "重度污染";
        } else {
            airQualityLevelAndColor = 5;
            airQualityDesc = "严重污染";
        }
        const progressColor = AIR_QUALITY_LEVEL[airQualityLevelAndColor];
        const percent = parseFloat(airQuality / AIR_QUALITY_INDEX);
        const endAngle = -CIRCLE * 0.375 + CIRCLE * 0.375 * 2 * percent;

        const {widthAndHeight, trackWidth, trackColor} = this.props;
        const radius = widthAndHeight * 0.5;
        const trackPath = this.makeArcPath(trackWidth * 0.5, trackWidth * 0.5,
            -CIRCLE * 0.375, CIRCLE * 0.375, radius - trackWidth * 0.5, 'clockwise');
        const circleProgressPath = this.makeArcPath(trackWidth * 0.5, trackWidth * 0.5,
            -CIRCLE * 0.375, endAngle, radius - trackWidth * 0.5, 'clockwise');

        return (
            <View style={{
                width: widthAndHeight,
                height: widthAndHeight
            }}>
                <Surface
                    width={widthAndHeight}
                    height={widthAndHeight}>
                    <Group>
                        <Shape d={trackPath} stroke={trackColor} strokeWidth={trackWidth}/>
                        <Shape d={circleProgressPath} stroke={progressColor} strokeWidth={trackWidth}/>
                    </Group>
                </Surface>
                <View style={{
                    position: 'absolute',
                    justifyContent: 'center',
                    alignItems: 'center',
                    top: 0, left: 0, bottom: 0, right: 0
                }}>
                    <Text style={{
                        color: 'white',
                        fontSize: 30
                    }}>{airQuality}</Text>
                    <Text style={{
                        color: 'white',
                        fontSize: 14
                    }}>{airQualityDesc}</Text>
                </View>
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
    }
}
