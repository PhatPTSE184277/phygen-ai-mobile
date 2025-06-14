import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';



const Footer = ({ activeTab = 'Home', onTabPress }) => {
    const navigation = useNavigation();
    return (
        <View className="flex-row items-center bg-white rounded-3xl px-6 py-4  shadow absolute bottom-0 left-0 right-0">

            <TouchableOpacity
                activeOpacity={0.7}
                className="items-center mr-16"
                onPress={() => { onTabPress?.('Home'), navigation.navigate('Home') }}
            >
                <Ionicons
                    name="home"
                    size={24}
                    color={activeTab === 'Home' ? '#4461F2' : '#DFDFDF'}
                />
                <Text
                    className={`text-xs ${activeTab === 'Home' ? 'text-indigo-600 font-semibold' : 'text-gray-400'
                        }`}
                >
                    Home
                </Text>
            </TouchableOpacity>


            <TouchableOpacity
                activeOpacity={0.7}
                className="items-center mr-28"
                onPress={() => { onTabPress?.('Explore'), navigation.navigate('Explore') }}
            >
                <Ionicons
                    name="map"
                    size={24}
                    color={activeTab === 'Explore' ? '#4461F2' : '#DFDFDF'}
                />
                <Text
                    className={`text-xs ${activeTab === 'Explore' ? 'text-indigo-600 font-semibold' : 'text-gray-400'
                        }`}
                >
                    Explore
                </Text>
            </TouchableOpacity>


            <View className="absolute -top-6  bg-white rounded-full p-3 " style={{ left: '50%', transform: [{ translateX: -20 }] }}>
                <TouchableOpacity
                    activeOpacity={0.7}
                    className={`rounded-full p-4 ${activeTab === 'Plus' ? 'bg-indigo-600 font-semibold' : 'bg-indigo-100'
                        }`}

                    onPress={() => onTabPress?.('Plus')}
                >
                    <Ionicons
                        name="add"
                        size={24}
                        color={activeTab === 'Plus' ? '#DFDFDF' : '#4461F2'}
                    />
                </TouchableOpacity>
            </View>

            <TouchableOpacity
                activeOpacity={0.7}
                className="items-center mr-16"
                onPress={() => { onTabPress?.('Notification'); navigation.navigate('Notification') }}
            >
                <Ionicons
                    name="chatbox-ellipses"
                    size={24}
                    color={activeTab === 'Notification' ? '#4461F2' : '#DFDFDF'}
                />
                <Text
                    className={`text-xs ${activeTab === 'Notification' ? 'text-indigo-600 font-semibold' : 'text-gray-400'
                        }`}
                >
                    Notification
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                activeOpacity={0.7}
                className="items-center"
                onPress={() => { onTabPress?.('Account'), navigation.navigate('Account') }}
            >
                <Ionicons
                    name="person"
                    size={24}
                    color={activeTab === 'Account' ? '#4461F2' : '#DFDFDF'}
                />
                <Text
                    className={`text-xs ${activeTab === 'Account' ? 'text-indigo-600 font-semibold' : 'text-gray-400'
                        }`}
                >
                    Account
                </Text>
            </TouchableOpacity>
        </View>
    );
};

export default Footer;
