/** @format */

import {AppRegistry} from 'react-native';
// import App from './App';
import MainPage from './app/src/screens/main/MainPage';
import {name as appName} from './app.json';

import {
    createStackNavigator
} from 'react-navigation';
import SelectCityPage from "./app/src/screens/city/SelectCityPage";
import CityManagerPage from "./app/src/screens/city/CityManagerPage";
import Utils from "./app/src/utils/Utils";

const App = createStackNavigator({
    Main: {
        screen: MainPage
    },
    SelectCity: {
        screen: SelectCityPage
    },
    CityManager: {
        screen: CityManagerPage
    }
}, {
    headerTintColor: 'white',
    headerPressColorAndroid: 'rgba(255, 255, 255, 0.4)',
    headerMode: Utils.isAndroid() ? 'screen' : 'float',
    mode: 'card'
});

AppRegistry.registerComponent(appName, () => App);
