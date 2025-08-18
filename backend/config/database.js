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
        
        const client = await new MongoClient(url, {
            serverSelectionTimeoutMS: 30000,
            connectTimeoutMS: 30000,
            socketTimeoutMS: 30000,
        }).connect();
        
        db = client.db('forum');
        console.log('DB연결 성공');
        console.log("🌐 Environment:", process.env.NODE_ENV || "development");

        console.log('✅ MONGO_ID:', process.env.MONGO_ID);
        console.log('✅ MONGO_PASSWORD:', process.env.MONGO_PASSWORD);
        console.log('✅ MONGO_CLUSTER:', process.env.MONGO_CLUSTER);
        console.log('✅ MONGO_APPNAME:', process.env.MONGO_APPNAME);

        if (process.env.NODE_ENV === "development") {
            console.log("✅ MONGO_ID:", process.env.MONGO_ID)
            console.log("✅ MONGO_CLUSTER:", process.env.MONGO_CLUSTER)
            console.log("✅ MONGO_APPNAME:", process.env.MONGO_APPNAME)
        }
        
        return db;
    } catch (error) {
        console.error("❌ DB 연결 실패:", error.message)
        // <CHANGE> 서버 크래시 방지 - 에러를 throw하지 않고 null 반환
        console.log("⚠️ 데이터베이스 없이 서버 계속 실행")
        return null;
    }
    
}

module.exports = connectDB;