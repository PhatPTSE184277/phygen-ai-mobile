import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Dimensions,
    StatusBar,
    Image,
    ScrollView,
    TextInput
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import bg1 from '../../assets/images/bg1.png';
import { KeyboardAvoidingView, Platform } from 'react-native';
import { useRef } from 'react';
import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';


const { width, height } = Dimensions.get('window');

const ProfileScreen = () => {
    const navigation = useNavigation();
    const [avatarInfo, setAvatarInfo] = useState(null);
    const emailRef = useRef();
    const addressRef = useRef();
    const passwordRef = useRef();

    const [form, setForm] = useState({
        name: 'Jessica Jung',
        email: 'Jessica Jung',
        address: 'Jessica Jung',
        password: '********',
    });
    const handleBack = () => {
        navigation.goBack();
    };

    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            alert('Permission to access media library is required!');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled) {
            const picked = result.assets[0];
            setAvatarInfo(picked);
        }
    };

    const handleSave = () => {
        console.log('Thông tin form:', form);

        if (avatarInfo) {
            console.log('Ảnh đã chọn:');
            console.log('Tên file:', avatarInfo.fileName);
            console.log('URI:', avatarInfo.uri);
            console.log('Kích thước:', avatarInfo.width + 'x' + avatarInfo.height);
            console.log('Loại:', avatarInfo.type);
        } else {
            console.log('Chưa chọn ảnh.');
        }

        alert('Profile saved successfully!');
    };


    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'height' : 'height'}
            style={{ flex: 1 }}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
        >
            <ScrollView
                contentContainerStyle={{ flexGrow: 1 }}
                keyboardShouldPersistTaps="handled"
            >
                <View className='flex-1 bg-gray-100 relative'>
                    <StatusBar backgroundColor='#F3F4F6' barStyle='dark-content' />

                    {/* Background Image */}
                    <View
                        className='absolute bottom-0 left-0 right-0'
                        style={{ zIndex: 0 }}
                    >
                        <Image
                            source={bg1}
                            style={{
                                width: width,
                                height: height * 0.8,
                                transform: [{ translateY: -height * 0 }]
                            }}
                            resizeMode='cover'
                        />
                    </View>


                    <View
                        className='flex-row items-center mt-6 px-4 pt-12 pb-8 bg-transparent'
                        style={{ zIndex: 1 }}
                    >
                        <TouchableOpacity
                            onPress={handleBack}
                            className='flex-row items-center p-3'
                        >
                            <Ionicons
                                name='chevron-back-outline'
                                size={28}
                                color='#3B82F6'
                                style={{ marginRight: 4 }}
                            />
                        </TouchableOpacity>
                        <Text className='text-2xl font-bold text-gray-900'>
                            My Profile
                        </Text>
                    </View>





                    <View className='absolute top-0 left-0 right-0 z-0'>


                        <LinearGradient
                            colors={['#58C1CA88', '#4371DECC', '#7330DE99']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={{ width: '100%', height: 200, }}
                        />



                    </View >
                    <View className='flex-1 relative z-10'>
                        <View className="flex-1 px-6 " >
                            {/* Avatar */}
                            <View className="items-center mb-8">
                                <View className="w-36 h-36 rounded-full bg-white justify-center items-center shadow-md relative">
                                    <Image
                                        source={{ uri: avatarInfo?.uri || 'https://img-s-msn-com.akamaized.net/tenant/amp/entityid/BB1msOP5?w=0&h=0&q=60&m=6&f=jpg&u=t' }}
                                        className="w-32 h-32 rounded-full"
                                        resizeMode="cover"
                                    />

                                    <TouchableOpacity onPress={pickImage} className="absolute bottom-0 right-2 bg-white p-1 rounded-full">
                                        <Ionicons name="camera" size={20} color="#7C4DFF" />
                                    </TouchableOpacity>

                                </View>
                            </View>

                            {/* Form */}
                            <View className="bg-white rounded-2xl p-4 mb-10 shadow-md border border-gray-200">
                                <Text className="text-sm text-gray-500 mb-1">Personal ID</Text>
                                <TextInput value="12345abcd" editable={false} className="bg-gray-100 px-4 py-2 rounded-md mb-4 text-gray-400" />

                                <TextInput
                                    value={form.name}
                                    onChangeText={(text) => setForm({ ...form, name: text })}
                                    placeholder="Name"
                                    returnKeyType="next"
                                    onSubmitEditing={() => emailRef.current.focus()}
                                    blurOnSubmit={false}
                                    className="bg-gray-100 px-4 py-2 rounded-md mb-4"
                                />

                                <TextInput
                                    ref={emailRef}
                                    value={form.email}
                                    onChangeText={(text) => setForm({ ...form, email: text })}
                                    placeholder="Email"
                                    returnKeyType="next"
                                    onSubmitEditing={() => addressRef.current.focus()}
                                    blurOnSubmit={false}
                                    className="bg-gray-100 px-4 py-2 rounded-md mb-4"
                                />

                                <TextInput
                                    ref={addressRef}
                                    value={form.address}
                                    onChangeText={(text) => setForm({ ...form, address: text })}
                                    placeholder="Address"
                                    returnKeyType="next"
                                    onSubmitEditing={() => passwordRef.current.focus()}
                                    blurOnSubmit={false}
                                    className="bg-gray-100 px-4 py-2 rounded-md mb-4"
                                />

                                <TextInput
                                    ref={passwordRef}
                                    value={form.password}
                                    onChangeText={(text) => setForm({ ...form, password: text })}
                                    placeholder="Password"
                                    secureTextEntry
                                    returnKeyType="done"
                                    onSubmitEditing={handleSave}
                                    className="bg-gray-100 px-4 py-2 rounded-md mb-6"
                                />

                                <TouchableOpacity className="bg-[#4461F2] rounded-xl py-3" onPress={handleSave}>
                                    <Text className="text-center text-white font-bold tracking-wide text-base">
                                        SAVE
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>

                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default ProfileScreen;
