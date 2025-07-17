import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    Dimensions,
    StatusBar,
    Image,
    ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRoute } from '@react-navigation/native';
import bg1 from '../../assets/images/bg1.png';
import fetchClient from '../apis/fetchClient';
import { printToFileAsync } from 'expo-print';
import { marked } from 'marked';

const { width, height } = Dimensions.get('window');

const OverviewScreen = ({ navigation }) => {
    const route = useRoute();
    const examResult = route.params?.examResult;
    const [examsWithPdf, setExamsWithPdf] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [hasFetched, setHasFetched] = useState(false);

    const generatePdfFromHtml = async (htmlContent, fileName) => {
        try {
            const pdf = await printToFileAsync({
                html: htmlContent,
                base64: false,
            });

            return {
                uri: pdf.uri,
                name: `${fileName}.pdf`,
                type: 'application/pdf',
            };
        } catch (error) {
            console.error('Error generating PDF:', error);
            throw error;
        }
    };

    const parseFormattedMarkdown = (raw) => {
        return raw
            .replace(/\\n/g, '\n')
            .replace(/^([A-D])\./gm, '- $1.')
            .replace(/(\*\*Câu \d+\*\*:.*?)\n(?=\S)/g, '$1\n')
            .replace(/^(Khối:.*)$/m, '$1\n\n')
            .replace(/^(Môn:.*)$/m, '$1\n\n')
            .replace(/^(Thời gian làm bài:.*)$/m, '$1\n\n')

    };


    const generatePdfAndUpload = async (exam, examId) => {
        try {
            const sanitizedFileName = exam.examCode.replace(/[^a-zA-Z0-9_.-]/g, '_');

            const markdown = parseFormattedMarkdown(exam.examContentMarkdown);

            const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {
                    font-family: "Times New Roman", serif;
                    margin: 40px;
                    line-height: 1.6;
                    font-size: 16px;
                }
                h1 {
                    font-weight: bold;
                    text-align: center;
                }
                h1 {
                    font-size: 28px;
                    margin-bottom: 0;
                }
               h2 {
                    font-weight: bold;
                    text-align: left;
                    margin-top: 32px;
                    font-size: 20px;
                }
                p {
                    margin: 12px 0;
                }
                .question {
                    margin: 16px 0;
                    font-weight: bold;
                }
                ul {
                    list-style-type: none;
                    padding-left: 12px;
                }
                li {
                    margin-bottom: 4px;
                }
                .footer {
                    text-align: center;
                    margin-top: 60px;
                    font-style: italic;
                    font-size: 14px;
                }
            </style>
        </head>
        <body>
           <div class="exam-content">
                ${marked(markdown)}
            </div>
            <hr>
            <p class="footer">HẾT</p>
        </body>
        </html>`;

            const pdfFile = await generatePdfFromHtml(htmlContent, sanitizedFileName);

            const formData = new FormData();
            formData.append('file', {
                uri: pdfFile.uri,
                name: `${sanitizedFileName}.pdf`,
                type: 'application/pdf',
            });

            formData.append('examVersionJson', JSON.stringify({
                versionCode: exam.examCode,
                nameBucket: 'exam-pdfs',
            }));

            const res = await fetchClient.post(
                `/api/exam-versions/by-exam/${examId}`,
                formData
            );

            if (!res.ok) {
                const errorText = await res.text();
                console.error('API Error:', errorText);
                return { ...exam, pdfUrl: null };
            }

            const responseJson = await res.json();

            return {
                ...exam,
                pdfUrl: responseJson?.data?.pdfUrl || null,
            };
        } catch (error) {
            console.error('Error generating PDF:', error);
            return { ...exam, pdfUrl: null };
        }
    };

    useEffect(() => {
        if (!hasFetched && examResult) {
            const fetchPdfLinks = async () => {
                if (!examResult?.data?.generatedExams) return;
                const examId = examResult.data.examId;
                const exams = examResult.data.generatedExams;

                const results = await Promise.all(
                    exams.map((exam) => generatePdfAndUpload(exam, examId))
                );

                setExamsWithPdf(results);
                setIsLoading(false);
            };
            fetchPdfLinks();
            setHasFetched(true);
        }
    }, [examResult]);

    return (
        <View className='flex-1 bg-gray-100 relative'>
            <StatusBar backgroundColor='#F3F4F6' barStyle='dark-content' />
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
            <View className='flex-row items-center mt-6 px-4 pt-12 pb-8' style={{ zIndex: 1 }}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
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
                    Overview
                </Text>
            </View>
            {isLoading ? (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size="large" color="#3B82F6" className="mt-4 p-10" />
                </View>
            ) : (
                <View className='flex-1 px-6' style={{ zIndex: 1 }}>
                    <ScrollView
                        style={{ flex: 1 }}
                        contentContainerStyle={{ paddingBottom: 100 }}
                        showsVerticalScrollIndicator={false}
                    >
                        <View
                            className='bg-white rounded-3xl mb-6'
                            style={{
                                shadowColor: '#000',
                                shadowOffset: { width: 0, height: 4 },
                                shadowOpacity: 0.1,
                                shadowRadius: 12,
                                elevation: 8,
                                padding: 16,
                                alignSelf: 'flex-start',
                                width: '100%'
                            }}
                        >
                            <Text className='text-lg font-bold text-gray-900 mb-4'>
                                {examResult?.message || 'Exam Overview'}
                            </Text>
                            <View
                                style={{
                                    gap: 16,
                                    width: '100%'
                                }}
                            >
                                {(examsWithPdf || examResult?.data?.generatedExams)?.map((exam, idx) => (
                                    <TouchableOpacity
                                        key={idx}
                                        className='bg-gray-100 rounded-2xl px-4 py-4 flex-row justify-between items-center mb-2'
                                        activeOpacity={0.8}
                                        onPress={() => {
                                            if (!examResult?.data?.examId || !examsWithPdf) {
                                                console.error('Invalid data: examResult or examsWithPdf is null');
                                                return;
                                            }

                                            const examId = examResult.data.examId;
                                            const exam = examsWithPdf[idx] || examResult.data.generatedExams[idx];
                                            if (!exam) {
                                                console.error('Invalid exam data');
                                                return;
                                            }

                                            navigation.navigate('ExamDetail', { exam, examId });
                                        }}
                                        style={{
                                            shadowColor: '#000',
                                            shadowOffset: { width: 0, height: 1 },
                                            shadowOpacity: 0.08,
                                            shadowRadius: 2
                                        }}
                                    >
                                        <View>
                                            <Text className='text-base font-bold text-gray-900 mb-1'>
                                                {exam?.examCode || 'Unknown Code'}
                                            </Text>
                                            <Text className='text-sm text-gray-500'>
                                                Tap to view detail
                                            </Text>
                                        </View>
                                        <Ionicons
                                            name='chevron-forward-outline'
                                            size={22}
                                            color='#3B82F6'
                                        />
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                    </ScrollView>
                    <View
                        style={{
                            position: 'absolute',
                            left: 24,
                            right: 24,
                            bottom: 24
                        }}
                    >
                        <TouchableOpacity
                            className='bg-blue-500 rounded-xl py-4 items-center'
                            activeOpacity={0.8}
                            onPress={() => navigation.navigate('HomeTabs')}
                        >
                            <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>
                                Finish
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}
        </View>
    );
};

export default OverviewScreen;