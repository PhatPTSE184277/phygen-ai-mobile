import React, { useState, useRef, useCallback } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Dimensions,
    StatusBar,
    Image,
    ScrollView,
    TextInput,
    KeyboardAvoidingView,
    Platform,
    Alert,
    ActivityIndicator
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import Toast from 'react-native-toast-message';
import axiosClient from '../apis/axiosClient';
import axios from 'axios';
import { useAuthLogic } from '../utils/authLogic';
import AsyncStorage from '@react-native-async-storage/async-storage';

const defaultAvatar = require('../../assets/images/defaultAvatar.png');
const bg1 = require('../../assets/images/bg1.png');

const { width, height } = Dimensions.get('window');

const ProfileScreen = () => {
    const navigation = useNavigation();
    const emailRef = useRef();
    const passwordRef = useRef();
    const [isPasswordShow, setIsPasswordShow] = useState(false);
    const [avatarInfo, setAvatarInfo] = useState(null);
    const [loading, setLoading] = useState(false);
    const [loadingUpdate, setLoadingUpdate] = useState(false);
    const [form, setForm] = useState({
        id: '',
        username: '',
        email: '',
        membership: '',
        password: '******',
    });
    const { handleLogout } = useAuthLogic();

    const handleBack = () => navigation.goBack();

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
            setAvatarInfo(result.assets[0]);
        }
    };

    const handleSave = async () => {
        try {
            setLoadingUpdate(true);

            // Upload avatar if selected
            if (avatarInfo) {
                try {
                    const formData = new FormData();
                    formData.append('File', {
                        uri: Platform.OS === 'android' ? avatarInfo.uri : avatarInfo.uri.replace('file://', ''),
                        name: avatarInfo.fileName,
                        type: avatarInfo.mimeType,
                    });
                    let accessToken
                    try {
                        accessToken = await AsyncStorage.getItem('Auth_Data');
                        if (accessToken) {
                            const authData = JSON.parse(accessToken);
                            if (authData && authData.token) {
                                accessToken = authData.token;
                            }
                        }

                    } catch (e) { }
                    const avatarResponse = await axios.put(
                        'https://backend-phygen.onrender.com/api/AccountUser/update-avatar',
                        formData,
                        {
                            headers: {
                                ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
                                Accept: 'application/json',
                                'Content-Type': 'multipart/form-data',
                            },
                        }
                    );


                    if (avatarResponse.data !== null) {
                        Toast.show({
                            type: 'success',
                            text1: 'Avatar Updated',
                            text2: 'Your avatar has been updated successfully.',
                            position: 'top',
                        });
                        setAvatarInfo(null);
                        setForm({
                            ...form,
                            avatar: avatarResponse.data.avatarUrl,
                        });
                    } else {
                        Toast.show({
                            type: 'error',
                            text1: 'Error',
                            text2: 'Failed to update avatar. Try again later.',
                            position: 'top',
                        });
                        setLoadingUpdate(false);
                        return;
                    }
                } catch (avatarError) {

                    Toast.show({
                        type: 'error',
                        text1: 'Error',
                        text2: 'Failed to upload avatar. Try again later.',
                        position: 'top',
                    });
                    setLoadingUpdate(false);
                    return;
                }
            }

            // Update profile information
            const updateForm = {
                school: form.school,
                address: form.address,
                username: form.username,
                email: form.email,
                password: form.password !== '******' ? form.password : "",
            };

            const response = await axiosClient.put('/api/AccountUser/me', updateForm);
            if (response.data?.success) {
                Toast.show({
                    type: 'success',
                    text1: 'Profile Updated',
                    text2: 'Your profile has been updated successfully.',
                    position: 'top',
                });

                setForm({
                    ...form,
                    password: '******',
                });
                setAvatarInfo(null);
            } else {
                Toast.show({
                    type: 'error',
                    text1: 'Error',
                    text2: 'Failed to update profile. Try again later.',
                    position: 'top',
                });
            }
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Something went wrong. Try again later.',
                position: 'top',
            });
        } finally {

            setLoadingUpdate(false);
        }
    };


    const loadData = async () => {
        try {
            setLoading(true);
            const response = await axiosClient.get('/api/AccountUser/me');

            if (response.data?.success) {
                const data = response.data.data;
                setForm({
                    id: data.id || '',
                    username: data.username || '',
                    email: data.email || '',
                    membership: data.accountType || '',
                    password: '******',
                    avatar: data.avatarUrl || '',
                    school: data.school || "",
                    address: data.address || "",
                });
            } else {
                Toast.show({
                    type: 'error',
                    text1: 'Error',
                    text2: 'Failed to get user data. Try again later.',
                    position: 'top',
                });
            }
        } catch (error) {

            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Something went wrong. Try again later.',
                position: 'top',
            });
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            loadData();
        }, [])
    );

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'height' : 'height'}
            style={{ flex: 1 }}
            keyboardVerticalOffset={0}
        >
            <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
                <View className="flex-1 bg-gray-100 relative">
                    <StatusBar backgroundColor="#F3F4F6" barStyle="dark-content" />

                    {/* Background Image */}
                    <View className="absolute bottom-0 left-0 right-0 z-0">
                        <Image
                            source={bg1}
                            style={{ width, height: height * 0.8 }}
                            resizeMode="cover"
                        />
                    </View>

                    {/* Header */}
                    <View className="flex-row items-center mt-6 px-4 pt-12 pb-8 bg-transparent z-10">
                        <TouchableOpacity onPress={handleBack} className="p-3">
                            <Ionicons name="chevron-back-outline" size={28} color="#3B82F6" />
                        </TouchableOpacity>
                        <Text className="text-2xl font-bold text-gray-900 ml-2">My Profile</Text>
                    </View>

                    {/* Gradient Header */}
                    <View className="absolute top-0 left-0 right-0 z-0">
                        <LinearGradient
                            colors={['#58C1CA88', '#4371DECC', '#7330DE99']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={{
                                width: '100%',
                                height: 400,
                                borderBottomLeftRadius: 32,
                                borderBottomRightRadius: 32,
                            }}
                        />
                    </View>

                    {/* Body */}
                    <View className="flex-1 relative z-10 px-6">
                        {/* Avatar */}
                        <View className="items-center mb-8">
                            <View className="w-36 h-36 rounded-full bg-white justify-center items-center shadow-md relative">
                                <Image
                                    source={avatarInfo ? { uri: avatarInfo.uri } : (form.avatar ? { uri: form.avatar } : defaultAvatar)}
                                    className="w-32 h-32 rounded-full"
                                    resizeMode="cover"
                                />
                                <TouchableOpacity onPress={pickImage} className="absolute bottom-0 right-2 bg-white p-1 rounded-full">
                                    <Ionicons name="camera" size={20} color="#7C4DFF" />
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Form */}
                        <View className="bg-white rounded-2xl p-8 mb-10 shadow-md border border-gray-200">
                            {loading ? (<ActivityIndicator size="large" color="#7C4DFF" className="mb-4 h-[50vh]" />) : (
                                <>
                                    <Text className="text-sm text-gray-500 mb-2">Personal ID</Text>
                                    <TextInput
                                        value={form.id?.toString()}
                                        editable={false}
                                        className="bg-gray-100 px-4 py-2 rounded-md mb-6 text-gray-400"
                                    />

                                    <Text className="text-sm text-gray-500 mb-2">User Name</Text>
                                    <TextInput
                                        value={form.username}
                                        onChangeText={(text) => setForm({ ...form, username: text })}
                                        placeholder="User Name"
                                        returnKeyType="next"
                                        onSubmitEditing={() => passwordRef.current.focus()}
                                        blurOnSubmit={false}
                                        className="bg-gray-100 px-4 py-2 rounded-md mb-6"
                                    />

                                    <Text className="text-sm text-gray-500 mb-2">Email Address</Text>
                                    <TextInput
                                        value={form.email}
                                        editable={false}
                                        className="bg-gray-100 px-4 py-2 rounded-md mb-6 text-gray-400"
                                    />

                                    <Text className="text-sm text-gray-500 mb-2">Membership</Text>
                                    <TextInput
                                        value={form.membership}
                                        editable={false}
                                        className="bg-gray-100 px-4 py-2 rounded-md mb-6 text-gray-400"
                                    />

                                    <Text className="text-sm text-gray-500 mb-2">Password</Text>
                                    <View className='relative mb-8'>
                                        <TextInput
                                            ref={passwordRef}
                                            value={form.password}
                                            onChangeText={(text) => setForm({ ...form, password: text })}
                                            placeholder="Password"
                                            secureTextEntry={!isPasswordShow}
                                            returnKeyType="done"
                                            onSubmitEditing={handleSave}
                                            className="bg-gray-100 px-4 py-2 rounded-md pr-10"
                                        />

                                        {form.password !== '******' && (
                                            <TouchableOpacity
                                                style={{
                                                    position: 'absolute',
                                                    right: 12,
                                                    top: '50%',
                                                    transform: [{ translateY: -12 }],
                                                    zIndex: 10,
                                                }}
                                                onPress={() => setIsPasswordShow(!isPasswordShow)}
                                                disabled={loading}
                                            >
                                                <Feather
                                                    name={isPasswordShow ? 'eye-off' : 'eye'}
                                                    size={20}
                                                    color="#9CA3AF"
                                                />
                                            </TouchableOpacity>
                                        )}
                                    </View>

                                    <TouchableOpacity
                                        onPress={handleSave}
                                        disabled={loadingUpdate}
                                        activeOpacity={0.7}
                                        className={`rounded-xl py-3 ${loadingUpdate ? 'bg-[#4461F280]' : 'bg-[#4461F2]'}`}
                                    >
                                        {loadingUpdate ? (
                                            <View className="flex-row justify-center items-center space-x-2">
                                                <ActivityIndicator size="small" color="#ffffff" className='mr-4' />
                                                <Text className="text-white font-bold tracking-wide text-base">
                                                    SAVING
                                                </Text>
                                            </View>
                                        ) : (
                                            <Text className="text-center text-white font-bold tracking-wide text-base">
                                                SAVE
                                            </Text>
                                        )}
                                    </TouchableOpacity>


                                </>)}
                        </View>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default ProfileScreen;
