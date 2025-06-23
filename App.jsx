import './global.css';
import { Provider } from 'react-redux';
import store from './src/reduxs/store';
import AppNavigator from './src/navigators';
import Toast from 'react-native-toast-message';

export default function App() {
    return (
        <Provider store={store}>
            <AppNavigator />
            <Toast />
        </Provider>
    );
}