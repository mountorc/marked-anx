import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 模拟数据集
const mockDataset = [
  { "sku": "商品A","price":98 },
  { "sku": "商品B","price":58 },
  { "sku": "商品C","price":38 },
  { "sku": "商品D","price":65 },
  { "sku": "商品E","price":107 }
];

// 处理函数
export function handleDatasetDemo(req, res) {
  try {
    // 返回数据集，格式为 {"data":[]}
    res.json({ data: mockDataset });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
}

// 导出数据集供其他模块使用
export default mockDataset;