import React, {Component} from 'react';
import {
    ActivityIndicator, StyleSheet, Text,
    FlatList, RefreshControl, View
} from 'react-native';
import Config from "../config/Constants";
import PropTypes from "prop-types";

export default class PPRefreshLayout extends Component {
    static propTypes = {
        renderItem: PropTypes.func.isRequired,
        ItemSeparatorComponent: PropTypes.func,
        needDivide: PropTypes.bool,
        keyExtractor: PropTypes.func,
        ListFooterComponent: PropTypes.func,
        ListHeaderComponent: PropTypes.func,
        dataRequest: PropTypes.func,
        extraData: PropTypes.any,
        showsVerticalScrollIndicator: PropTypes.bool,
        removeClippedSubviews: PropTypes.bool,
        autoLoadMore: PropTypes.bool,
        refreshEnable: PropTypes.bool,
        loadMoreEnable: PropTypes.bool,
        refreshOffset: PropTypes.number
    };

    static defaultProps = {
        showsVerticalScrollIndicator: false,
        removeClippedSubviews: false,
        refreshEnable: true,
        loadMoreEnable: true,
        needDivide: true,
        extraData: null,
        refreshOffset: 0
    };

    constructor(props) {
        super(props);
        this.state = {
            dataList: [],
            refreshing: false,
            loadMoreFlag: Config.load_more_flag.LOADING_COMPLETE
        };
    }

    render() {
        if (this.state.dataList.length <= 0) {
            return (
                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                    <ActivityIndicator size='large' color='#fff'/>
                </View>
            );
        }
        let {
            ListFooterComponent, keyExtractor, ItemSeparatorComponent, needDivide,
            refreshEnable, loadMoreEnable, refreshOffset, ...refreshLayoutProps
        } = this.props;
        let onLoadMore = null;
        if (loadMoreEnable) {
            onLoadMore = this.onLoadMore;
            if (!ListFooterComponent) {
                ListFooterComponent = this._renderFooter;
            }
        }
        if (!keyExtractor) {
            keyExtractor = this.keyExtractor;
        }
        if (needDivide && !ItemSeparatorComponent) {
            ItemSeparatorComponent = this.Separator;
        }
        const onRefresh = refreshEnable ? this.onRefresh : null;
        return (
            <FlatList
                ref={(ref) => this._flatList = ref}
                {...refreshLayoutProps}
                showsVerticalScrollIndicator={this.props.showsVerticalScrollIndicator}
                removeClippedSubviews={this.props.removeClippedSubviews}
                ListHeaderComponent={this.props.ListHeaderComponent}
                data={this.state.dataList}
                extraData={[this.props.extraData, this.state.loadMoreFlag]}
                renderItem={this.props.renderItem}
                ListFooterComponent={ListFooterComponent}
                keyExtractor={keyExtractor}
                ItemSeparatorComponent={ItemSeparatorComponent}
                onEndReached={onLoadMore}
                refreshControl={
                    <RefreshControl
                        progressViewOffset={refreshOffset}
                        enabled={this.props.refreshEnable}
                        tintColor={'#e53935'}
                        colors={['#e53935']}
                        refreshing={this.state.refreshing}
                        onRefresh={onRefresh}/>
                }
                onEndReachedThreshold={1}/>
        );
    }

    keyExtractor = (item, index) => index.toString();

    Separator = () => {
        return <View style={{height: 1, backgroundColor: '#eeeeee'}}/>;
    };

    _renderFooter = () => {
        const loadMoreFlag = this.state.loadMoreFlag;
        switch (loadMoreFlag) {
            case Config.load_more_flag.LOADING:
                return (
                    <View style={styles.footerContainer}>
                        <ActivityIndicator size='small' color='#e53935'/>
                        <Text style={{color: '#333', fontSize: 14, marginLeft: 8}}>
                            正在加载...
                        </Text>
                    </View>
                );
            case Config.load_more_flag.LOADING_COMPLETE:
                return null;
            case Config.load_more_flag.LOADING_COMPLETE_NO_DATA:
                return (
                    <View style={styles.footerContainer}>
                        <Text style={{color: '#333', fontSize: 14}}>
                            没有更多数据
                        </Text>
                    </View>
                );
            case Config.load_more_flag.LOADING_FAIL:
                return (
                    <TouchableOpacity activeOpacity={0.8}>
                        <View style={styles.footerContainer}>
                            <Text style={{color: '#333', fontSize: 14}}>
                                加载失败，点击重试
                            </Text>
                        </View>
                    </TouchableOpacity>
                );
        }
    };

    onRefresh = () => {
        this.setState({
            refreshing: true,
            loadMoreFlag: Config.load_more_flag.LOADING_COMPLETE
        });
        this.props.dataRequest && this.props.dataRequest(true);
    };

    onLoadMore = () => {
        const loadMoreFlag = this.state.loadMoreFlag;
        if (loadMoreFlag === Config.load_more_flag.LOADING ||
            loadMoreFlag === Config.load_more_flag.LOADING_FAIL ||
            loadMoreFlag === Config.load_more_flag.LOADING_COMPLETE_NO_DATA) {
            return;
        }
        this.setState({loadMoreFlag: Config.load_more_flag.LOADING});
        this.props.dataRequest && this.props.dataRequest(false);
    };

    getFlatList = () => {
        return this._flatList;
    };

    scrollToTop = (animated = true) => {
        this.getFlatList() && this.getFlatList().scrollToIndex({
            viewPosition: 0, index: 0, animated: animated
        });
    };

    getDataList = () => {
        return this.state.dataList;
    };

    /**
     * 是否正在上拉加载
     */
    isLoadMore() {
        return this.state.loadMoreFlag === Config.load_more_flag.LOADING
    }

    /**
     * 结束下拉刷新
     */
    refreshComplete(dataList, complete) {
        this.setState({
            dataList: dataList,
            refreshing: false
        }, () => {
            complete && complete(this.state.dataList);
        });
    }

    /**
     * 结束上拉加载
     */
    loadMoreComplete(loadDataList) {
        if (loadDataList && loadDataList.length > 0) {
            let dataList = this.state.dataList;
            dataList = dataList.concat(loadDataList);
            this.setState({
                dataList: dataList,
                loadMoreFlag: Config.load_more_flag.LOADING_COMPLETE
            });
            // 表示有数据加载完成
            return true;
        } else {
            this.setState({
                loadMoreFlag: Config.load_more_flag.LOADING_COMPLETE_NO_DATA
            });
        }
        return false;
    }
}

const styles = StyleSheet.create({
    footerContainer: {
        backgroundColor: '#fefefe',
        flexDirection: 'row',
        width: Config.common_param.SCREEN_WIDTH,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center'
    }
});
