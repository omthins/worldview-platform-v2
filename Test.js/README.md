# 测试脚本说明

本文件夹包含用于世界观平台项目的各种测试和实用脚本。

## 脚本列表

### 数据库操作脚本

- `add-worldview-number-column.js` - 为世界观表添加编号列
- `add-worldview-number-column-v2.js` - 为世界观表添加编号列的第二个版本
- `update-worldview-numbers.js` - 更新世界观的编号

### 数据检查脚本

- `check-database-data.js` - 检查数据库中的数据
- `check-worldview-numbers.js` - 检查世界观编号

### 数据迁移脚本

- `migrate-ids.js` - 迁移ID的脚本
- `migrate-ids-v2.js` - 迁移ID的脚本第二版
- `migrate-ids-v3.js` - 迁移ID的脚本第三版

### 测试数据脚本

- `create-test-data.js` - 创建测试数据

## 使用方法

要运行这些脚本，请在项目根目录下使用以下命令格式：

```bash
node Test.js/脚本名称.js
```

例如：
```bash
node Test.js/check-database-data.js
```

## 注意事项

- 运行这些脚本前，请确保数据库连接正常
- 某些脚本可能会修改数据库数据，请在运行前备份重要数据
- 脚本主要用于开发和测试环境，不建议在生产环境中使用

---

# Test Scripts Description

This folder contains various test and utility scripts for the WorldView Platform project.

## Script List

### Database Operation Scripts

- `add-worldview-number-column.js` - Add number column to worldview table
- `add-worldview-number-column-v2.js` - Second version of script to add number column to worldview table
- `update-worldview-numbers.js` - Update worldview numbers

### Data Check Scripts

- `check-database-data.js` - Check data in the database
- `check-worldview-numbers.js` - Check worldview numbers

### Data Migration Scripts

- `migrate-ids.js` - Script for migrating IDs
- `migrate-ids-v2.js` - Second version of script for migrating IDs
- `migrate-ids-v3.js` - Third version of script for migrating IDs

### Test Data Scripts

- `create-test-data.js` - Create test data

## Usage

To run these scripts, use the following command format from the project root directory:

```bash
node Test.js/script-name.js
```

For example:
```bash
node Test.js/check-database-data.js
```

## Notes

- Ensure the database connection is working before running these scripts
- Some scripts may modify database data, please backup important data before running
- Scripts are primarily for development and testing environments, not recommended for production use