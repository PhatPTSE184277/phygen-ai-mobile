import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SplashScreen, WelcomeScreen, LoginScreen, RegisterScreen, HomeScreen, NotificationScreen, ExploreScreen, AccountScreen } from '../screens';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName='Splash'
                screenOptions={{
                    headerShown: false
                }}
            >
                <Stack.Screen
                    name='Splash'
                    component={SplashScreen}
                    options={{
                        gestureEnabled: false
                    }}
                />

                <Stack.Screen
                    name='Welcome'
                    component={WelcomeScreen}
                    options={{
                        gestureEnabled: false
                    }}
                />

                <Stack.Screen
                    name='Login'
                    component={LoginScreen}
                    options={{
                        gestureEnabled: true
                    }}
                />

                <Stack.Screen
                    name='Register'
                    component={RegisterScreen}
                    options={{
                        gestureEnabled: true
                    }}
                />

                <Stack.Screen
                    name='Home'
                    component={HomeScreen}
                    options={{
                        gestureEnabled: false
                    }}
                />

                <Stack.Screen
                    name='Notification'
                    component={NotificationScreen}
                    options={{
                        gestureEnabled: false
                    }}
                />
                <Stack.Screen
                    name='Explore'
                    component={ExploreScreen}
                    options={{
                        gestureEnabled: false
                    }}
                />
                <Stack.Screen
                    name='Account'
                    component={AccountScreen}
                    options={{
                        gestureEnabled: false
                    }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;