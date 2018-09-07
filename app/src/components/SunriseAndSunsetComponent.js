import React, {Component} from 'react';
import {
    Text,
    View
} from 'react-native';
import PropTypes from "prop-types";
import SunriseAndSunsetWidget from "../widget/SunriseAndSunsetWidget";

export default class SunriseAndSunsetComponent extends Component {
    static propTypes = {
        currentDateBean: PropTypes.object
    };

    render() {
        const currentDateBean = this.props.currentDateBean;
        if (!currentDateBean) return null;
        return (
            <View style={{
                flex: 1
            }}>
                <Text style={{
                    color: 'white',
                    textAlign: 'center',
                    fontSize: 14,
                    paddingTop: 12,
                    paddingBottom: 12
                }}>日出和日落</Text>
                <SunriseAndSunsetWidget
                    sunrise={currentDateBean.sunrise} sunset={currentDateBean.sunset}/>
            </View>
        );
    }
}
