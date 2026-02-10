{\rtf1\ansi\ansicpg1252\cocoartf2822
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fswiss\fcharset0 Helvetica;}
{\colortbl;\red255\green255\blue255;}
{\*\expandedcolortbl;;}
\paperw11900\paperh16840\margl1440\margr1440\vieww11520\viewh8400\viewkind0
\pard\tx720\tx1440\tx2160\tx2880\tx3600\tx4320\tx5040\tx5760\tx6480\tx7200\tx7920\tx8640\pardirnatural\partightenfactor0

\f0\fs24 \cf0 require('dotenv').config();\
const ftp = require('basic-ftp');\
const path = require('path');\
const fs = require('fs');\
\
async function uploadDir(client, localDir, remoteDir) \{\
    const files = fs.readdirSync(localDir);\
\
    for (const file of files) \{\
        const fullLocalPath = path.join(localDir, file);\
        const fullRemotePath = path.posix.join(remoteDir, file);\
\
        if (fs.lstatSync(fullLocalPath).isDirectory()) \{\
            await client.ensureDir(fullRemotePath);\
            await uploadDir(client, fullLocalPath, fullRemotePath);\
            await client.cdup();\
        \} else \{\
            await client.uploadFrom(fullLocalPath, fullRemotePath);\
            console.log(`Uploaded: $\{fullRemotePath\}`);\
        \}\
    \}\
\}\
\
async function main() \{\
    const client = new ftp.Client();\
    client.ftp.verbose = true;\
\
    try \{\
        await client.access(\{\
            host: process.env.FTP_HOST,\
            user: process.env.FTP_USER,\
            password: process.env.FTP_PASSWORD,\
            secure: false,\
        \});\
\
        console.log("Connected to FTP. Uploading files...");\
        await client.ensureDir(process.env.FTP_REMOTE_PATH);\
        await uploadDir(client, process.env.LOCAL_DIST_PATH, process.env.FTP_REMOTE_PATH);\
\
        console.log("\uc0\u9989  Deployment completed successfully!");\
    \} catch (err) \{\
        console.error("\uc0\u10060  Deployment failed:", err);\
    \}\
\
    client.close();\
\}\
\
main();\
}