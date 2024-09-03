/**
 * @format
 */

import {AppRegistry} from 'react-native';
import Home from './Home';
import Cam from './Cam';
import Main from './Main';
import App from './App';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => Cam);
