import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform, Image, Dimensions, Keyboard } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useRoute } from '@react-navigation/native';
import bg1 from '../../assets/images/bg1.png';
import Toast from 'react-native-toast-message';
import axiosClient2 from '../apis/axiosClient2';
import MathView from '../components/MathView';
const { width, height } = Dimensions.get('window');
const ChatScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const examId = route.params?.examId;
    const [loading, setLoading] = useState(false);
    const [messages, setMessages] = useState([
        { id: '1', text: 'Chào bạn, mình có thể hỗ trợ bạn môn học nào hôm nay?', sender: 'bot' },
    ]);
    const [input, setInput] = useState('');
    const inputRef = useRef(null);
    const flatListRef = useRef(null);

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();

            setTimeout(() => {
                Keyboard.dismiss();
                inputRef.current.focus();
            }, 100);
        }
    }, []);

    const handleSend = async () => {

        try {
            setLoading(true);
            if (input.trim() === '') return;

            const newUserMessage = {
                id: Date.now().toString(),
                text: input,
                sender: 'user'
            };

            setMessages(prev => [...prev, newUserMessage]);

            const params = new URLSearchParams();
            params.append('text', input);
            setInput('');
            const res = await axiosClient2.post('/api/gemini/chat-bot', params, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });

            if (res.data || res.data?.data) {

                let reply = res.data?.data || '';
                const lines = reply.split('\n');
                if (lines[0].toLowerCase().includes('chào bạn')) {
                    lines.shift();
                }
                const cleanedReply = lines.join('\n').trim();

                const newBotMessage = {
                    id: Date.now().toString(),
                    text: cleanedReply,
                    sender: 'bot'
                };

                setMessages(prev => {
                    const updatedMessages = [...prev, newBotMessage];
                    setTimeout(() => {
                        flatListRef.current?.scrollToEnd({ animated: true });
                    }, 100);
                    return updatedMessages;
                });
            }
        } catch (error) {

            Toast.show({
                type: 'error',
                text1: 'Lỗi',
                text2: 'Không gửi được tin nhắn.',
                position: 'top'
            });
        } finally {
            setLoading(false);
            if (inputRef.current) {
                inputRef.current.clear();
                inputRef.current.focus();
            }
        }
    };

    const renderItem = ({ item }) => {
        const isUser = item.sender === 'user';
        const isLatex = item.text.includes('$');

        return (
            <View style={{
                alignSelf: isUser ? 'flex-end' : 'flex-start',
                backgroundColor: isUser ? '#3B82F6' : '#E5E7EB',
                borderRadius: 16,
                marginVertical: 4,
                padding: 12,
                maxWidth: '75%',
            }}>
                {!isUser && isLatex ? (
                    <MathView latex={item.text.replace(/\$/g, '')} />
                ) : (
                    <Text style={{ color: isUser ? '#fff' : '#111827' }}>
                        {item.text}
                    </Text>
                )}
            </View>
        );
    };

    return (
        <View style={{ flex: 1, backgroundColor: '#F3F4F6' }}>
            <Image
                source={bg1}
                style={{
                    width: width,
                    height: height * 0.8,
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    zIndex: 0
                }}
                resizeMode='cover'
            />
            <View style={{ flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: '#fff', elevation: 2 }}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginRight: 8 }}>
                    <Ionicons name="chevron-back-outline" size={28} color="#3B82F6" />
                </TouchableOpacity>
                <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#111827' }}>Chat</Text>
            </View>
            <FlatList
                ref={flatListRef}
                data={[...messages]}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                contentContainerStyle={{ padding: 16, flexGrow: 1, justifyContent: 'flex-end' }}
                ListFooterComponent={
                    loading ? (
                        <View style={{ marginTop: 8, alignSelf: 'flex-start' }}>
                            <Text style={{ color: '#6B7280', fontSize: 14 }}>Chat bot is thinking...</Text>
                        </View>
                    ) : (
                        <View style={{ height: 8 }} />
                    )
                }
            />

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                keyboardVerticalOffset={80}
            >
                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingHorizontal: 16,
                    paddingVertical: 10,
                    backgroundColor: '#fff',
                    borderTopLeftRadius: 24,
                    borderTopRightRadius: 24,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: -2 },
                    shadowOpacity: 0.06,
                    shadowRadius: 4,
                    elevation: 3,
                }}>
                    <TextInput
                        ref={inputRef}
                        style={{
                            flex: 1,
                            backgroundColor: '#F3F4F6',
                            borderRadius: 24,
                            paddingHorizontal: 18,
                            paddingVertical: 10,
                            fontSize: 16,
                            color: '#1E293B',
                            marginRight: 8,
                        }}
                        placeholder="Type your message..."
                        placeholderTextColor="#B8B8D2"
                        value={input}
                        onChangeText={setInput}
                        onSubmitEditing={handleSend}
                        returnKeyType="send"
                        editable={!loading}
                    />
                    <TouchableOpacity
                        onPress={handleSend}
                        style={{
                            backgroundColor: loading ? '#9CA3AF' : '#3B82F6',
                            borderRadius: 999,
                            padding: 10,
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                        disabled={loading}
                    >
                        <Ionicons name="send" size={22} color="#fff" />
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </View>
    );
};

export default ChatScreen;
