# Atlantica Online — Craft EXP Calculator

SPA คำนวณจำนวนครั้งที่ต้องคราฟไอเทมเพื่อเลเวลสกิลคราฟ สำหรับ Atlantica Online

## Tech stack

- React 19 + Vite 6
- Tailwind CSS 4

## เริ่มใช้งาน

```bash
cd Projects/atlantica-craft-calculator
npm install
npm run dev
```

## สูตรคำนวณ

1. `EXP ที่ขาด = EXP สะสมที่เลเวลเป้าหมาย − (EXP สะสมที่เลเวลปัจจุบัน + EXP ในเลเวลปัจจุบัน)`
2. `จำนวนครั้ง = ceil(EXP ที่ขาด / EXP ต่อครั้งของไอเทม)`

ตาราง EXP สะสม: [experience-table](https://craftcalculator.jana4u.net/experience-table) (เก็บใน `src/data/expTable.js`)

## ข้อมูลคราฟ

โหลดอัตโนมัติจาก [items.yml](https://github.com/jana4u/atlantica_online_craft_calculator/blob/master/data/items.yml) (repo เดียวกับ [craftcalculator.jana4u.net](https://craftcalculator.jana4u.net/)) ครอบคลุมทุกสายสกิลและไอเทมคราฟได้ พร้อมวัตถุดิบ · แคชใน LocalStorage

สูตร EXP ต่อชิ้น (ตามต้นฉบับ): `floor(workload / 50) / batch_size`

## โครงสร้าง

- `src/data/expTable.js` — ตาราง EXP สกิล Lv.1–180
- `src/data/loadCraftCatalog.js` — โหลด/แปลง items.yml
- `src/data/parseItemsYaml.js` — ตัวแปลง YAML แบบเบา
- `src/utils/calculate.js` — Logic + validation
- `src/components/` — UI แยกส่วน
- `src/App.jsx` — State, LocalStorage, ประสานผลลัพธ์

### สร้าง JSON ออฟไลน์ (ถ้าต้องการ)

```bash
# ดาวน์โหลด items.yml ไว้ที่ scripts/cache/items.yml ก่อน
node scripts/generate-catalog.mjs
```
