// components/MathView.js
import React from 'react';
import { WebView } from 'react-native-webview';
import { View, ActivityIndicator } from 'react-native';

export default function MathView({ latex }) {
    const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <script src="https://polyfill.io/v3/polyfill.min.js?features=es6"></script>
        <script src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js"></script>
        <style>
          body {
            margin: 0;
            padding: 8px;
            font-size: 18px;
            background-color: transparent;
            color: #111;
          }
        </style>
      </head>
      <body>
        <div id="math">\\[${latex}\\]</div>
      </body>
    </html>
  `;

    return (
        <View style={{ minHeight: 60, marginVertical: 4 }}>
            <WebView
                originWhitelist={['*']}
                source={{ html: htmlContent }}
                style={{ backgroundColor: 'transparent' }}
                scrollEnabled={false}
                startInLoadingState={true}
                renderLoading={() => <ActivityIndicator size="small" color="#3B82F6" />}
            />
        </View>
    );
}
