import './global.css';
import { Provider } from 'react-redux';
import store from './src/reduxs/store';
import AppNavigator from './src/navigators';

export default function App() {
    return (
        <Provider store={store}>
            <AppNavigator />
        </Provider>
    );
}