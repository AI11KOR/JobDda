const express = require('express');
require('dotenv').config();
const { MongoClient } = require('mongodb');

const id = encodeURIComponent(process.env.MONGO_ID);
const password = encodeURIComponent(process.env.MONGO_PASSWORD);
const cluster = process.env.MONGO_CLUSTER;
const appName = process.env.MONGO_APPNAME;

const url = process.env.MONGO_URL || `mongodb+srv://${id}:${password}@${cluster}/?retryWrites=true&w=majority&appName=${appName}`

let db;
const connectDB = async () => {
    try {
        if(db) return db;
        const client = await new MongoClient(url).connect();
        db = client.db('forum');
        console.log('DB연결 성공');
        console.log("🌐 Environment:", process.env.NODE_ENV || "development");

        console.log('✅ MONGO_ID:', process.env.MONGO_ID);
        console.log('✅ MONGO_PASSWORD:', process.env.MONGO_PASSWORD);
        console.log('✅ MONGO_CLUSTER:', process.env.MONGO_CLUSTER);
        console.log('✅ MONGO_APPNAME:', process.env.MONGO_APPNAME);

        // 개발 환경에서만 상세 정보 출력
        if (process.env.NODE_ENV === "development") {
            console.log("✅ MONGO_ID:", process.env.MONGO_ID)
            console.log("✅ MONGO_CLUSTER:", process.env.MONGO_CLUSTER)
            console.log("✅ MONGO_APPNAME:", process.env.MONGO_APPNAME)
        }
        
        return db;
    } catch (error) {
        console.error("❌ DB 연결 실패:", error.message)
        throw error
    }
    
}

module.exports = connectDB;