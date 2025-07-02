import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
    SplashScreen,
    WelcomeScreen,
    LoginScreen,
    RegisterScreen,
    PremiumScreen,
    GenerateScreen,
    SummaryScreen
} from '../screens';
import HomeTabs from './BottomTabs';
import HistoryScreen from '../screens/HistoryScreen';
import ProfileScreen from '../screens/ProfileScreen';
import DashboardScreen from '../screens/DashboardScreen';
import { useAuthLogic } from '../utils/authLogic';
import OTPVerify from '~/screens/OTPVerify';
import ForgotPassScreen from '~/screens/ForgotPassScreen';
import ResetPass from '~/screens/ResetPass';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
    const { authData, isAppLoading, isTokenValid, isFirstTimeUse } =
        useAuthLogic();

    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                {isAppLoading ? (
                    <Stack.Screen name='Splash' component={SplashScreen} />
                ) : !authData.token || !isTokenValid ? (
                    <>
                        {isFirstTimeUse && !authData.token && (
                            <Stack.Screen
                                name='Welcome'
                                component={WelcomeScreen}
                                options={{ gestureEnabled: false }}
                            />
                        )}

                        <Stack.Screen
                            name='Login'
                            component={LoginScreen}
                            options={{ gestureEnabled: true }}
                        />
                        <Stack.Screen
                            name='Register'
                            component={RegisterScreen}
                            options={{ gestureEnabled: true }}
                        />
                        <Stack.Screen
                            name='OTPVerify'
                            component={OTPVerify}
                            options={{ gestureEnabled: true }}
                        />
                        <Stack.Screen
                            name='ForgotPass'
                            component={ForgotPassScreen}
                            options={{ gestureEnabled: true }}
                        />
                        <Stack.Screen
                            name='ResetPass'
                            component={ResetPass}
                            options={{ gestureEnabled: true }}
                        />
                    </>
                ) : (
                    <>
                        <Stack.Screen name='HomeTabs' component={HomeTabs} />
                        <Stack.Screen
                            name='Premium'
                            component={PremiumScreen}
                            options={{ gestureEnabled: true }}
                        />
                        <Stack.Screen
                            name='Generate'
                            component={GenerateScreen}
                            options={{ gestureEnabled: true }}
                        />
                        <Stack.Screen
                            name='Summary'
                            component={SummaryScreen}
                            options={{ gestureEnabled: true }}
                        />
                        <Stack.Screen
                            name='Profile'
                            component={ProfileScreen}
                            options={{ gestureEnabled: true }}
                        />
                        <Stack.Screen
                            name='History'
                            component={HistoryScreen}
                            options={{ gestureEnabled: true }}
                        />
                        <Stack.Screen
                            name='Dashboard'
                            component={DashboardScreen}
                            options={{ gestureEnabled: true }}
                        />
                    </>
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;
