import React, {Component} from 'react';
import {
    Text,
    Image,
    View,
    TouchableOpacity
} from 'react-native';
import PropTypes from "prop-types";

export default class LifeIndexComponent extends Component {
    static propTypes = {
        indexes: PropTypes.array,
        normalIndexes: PropTypes.array
    };

    constructor(props) {
        super(props);
        this.state = {
            // 生活指数是否展开
            isExpand: false
        };
    }

    render() {
        const indexes = this.props.indexes;
        const normalIndexes = this.props.normalIndexes;
        if (!indexes || !normalIndexes) return null;
        const isExpand = this.state.isExpand;
        const dataList = isExpand ? indexes : normalIndexes;
        let lifeIndexItems = [];
        for (let i = 0; i < dataList.length; i++) {
            const indexItem = dataList[i];
            lifeIndexItems.push(this._renderLifeIndexItem(i, indexItem.name, indexItem.desc));
        }
        return (
            <View style={{
                flex: 1,
                alignItems: 'center',
                borderBottomWidth: 0.5,
                borderBottomColor: 'rgba(255, 255, 255, 0.3)'
            }}>
                <Text style={{
                    color: 'white',
                    textAlign: 'center',
                    fontSize: 14,
                    paddingTop: 12,
                    paddingBottom: 12
                }}>生活指数</Text>
                {lifeIndexItems}
                <TouchableOpacity activeOpacity={0.8} onPress={() => {
                    const bool = this.state.isExpand;
                    this.setState({isExpand: !bool});
                }}>
                    <Text style={{
                        color: 'white',
                        fontSize: 14,
                        flex: 1,
                        padding: 8
                    }}>{isExpand ? '收起' : '展开'}</Text>
                </TouchableOpacity>
            </View>
        );
    }

    _renderLifeIndexItem = (index, title, desc) => {
        return (
            <View style={{
                flex: 1,
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 12
            }} key={title}>
                <Image source={this.getIconRes(index)} style={{
                    width: 36, height: 36, resizeMode: 'cover',
                    marginStart: 16, marginEnd: 16
                }}/>
                <View style={{
                    flex: 1,
                    paddingEnd: 16
                }}>
                    <Text style={{
                        color: 'white',
                        fontSize: 14
                    }}>{title}</Text>
                    <Text style={{
                        color: 'rgba(255, 255, 255, 0.8)',
                        fontSize: 12,
                        lineHeight: 17,
                        marginTop: 4
                    }} numberOfLines={2} ellipsizeMode={'tail'}>{desc}</Text>
                </View>
            </View>
        );
    };

    getIconRes = (index) => {
        let iconRes;
        switch (index) {
            case 0:
            default:
                iconRes = require('../../images/ic_chenlian.png');
                break;
            case 1:
                iconRes = require('../../images/ic_chuanyi.png');
                break;
            case 2:
                iconRes = require('../../images/ic_shushidu.png');
                break;
            case 3:
                iconRes = require('../../images/ic_ganmao.png');
                break;
            case 4:
                iconRes = require('../../images/ic_ziwaixian.png');
                break;
            case 5:
                iconRes = require('../../images/ic_lvyou.png');
                break;
            case 6:
                iconRes = require('../../images/ic_xiche.png');
                break;
            case 7:
                iconRes = require('../../images/ic_liangshai.png');
                break;
            case 8:
                iconRes = require('../../images/ic_diaoyu.png');
                break;
            case 9:
                iconRes = require('../../images/ic_huazhuang.png');
                break;
            case 10:
                iconRes = require('../../images/ic_yundong.png');
                break;
            case 11:
                iconRes = require('../../images/ic_yusan.png');
                break;
            case 12:
                iconRes = require('../../images/ic_yuehui.png');
                break;
        }
        return iconRes;
    };
}
