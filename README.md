# Render Page
Render page เป็น Source code สำหรับ Render หน้าเว็บไซต์ที่เป็นรูปแบบ Static website โดยเฉพาะ เหมาะสำหรับคนที่ต้องการที่จะทำ SEO หรือ Render full page. 

ซึ่งโดยตัว Code นี้ได้แรงบัลดาลใจจากโปรเจ็ค [Prerender.io](https://prerender.io) ซีงผมนำโครงสร้าง (เกือบทั้งหมด) มาดัดแปลงให้สามารถทำ Cache ได้ง่าย และใช้เป็น JS เพื่อนำไปศึกษาได้ง่าย


## 👀 ตัวอย่างการใช้งาน
![Example Render Page](./images/example.gif)

## 💻 Requirements
- [Node.js 12+](https://nodejs.org/en/)

## ✨ วิธีการติดตั้ง
```sh
# รันคำสั่งติดตั้ง Dependencies
yarn
# จากนั้น Config ไฟล์ และทำการเปลี่ยนชื่อจาก config.example.json เป็น config.json
# สุดท้ายทำการ Run script
node app.js
```

## 📚 คำอธิบายของ config.json
```js
{
    "server": {
        "port": 8000 // พอร์ตที่จะใช้งาน (Default: 8000)
    },
    "puppeteer": {
        "headless": true, // ต้องการให้หน้าจออยู่แบบ Headless หรือไม่ (Default: true)
        "useragent": "EXAMPLEAGENT / 1.0 (https://example.com)", // กำหนด User-Agent
        "domain": [ // โดเมนที่สามารถให้ Cache page ได้
            "https://example.com"
        ],
        "page": { 
            "waitUntil": "networkidle2", // ตรวจสอบว่าหาก Network ที่ถูก fetch มานั้นไม่เกิน 2 ครั้งเป็นเวลา 500ms
            "timeout": 30000, // หมดเวลาการเชื่อมต่อ
            "maxFailures": 3 // จำนวนสูงสุุดในการดึงเว็บผิดพลาด
        }
    },
    "cache": {
        "path": "./cache", // Path ที่จะเก็บ Cache ของเว็บไซต์
        "maxAge": 259200 // ระยะเวลาสูงสุดในการเก็บ Cache ของเว็บไซต์ (Default: 3 วัน)
    }
}
```

## Enjoy!
![IDK](./images/idk.gif)