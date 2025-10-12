# 测试脚本说明

本文件夹包含用于世界观平台项目的各种测试和实用脚本。

## 脚本列表

### 用户管理脚本

- `create-user.js` - 交互式创建单个用户

### 世界观管理脚本

- `create-worldview-with-user.js` - 使用指定用户发表世界观
- `manage-worldview.js` - 管理现有世界观（查看、编辑、删除）

## 使用方法

要运行这些脚本，请在项目根目录下使用以下命令格式：

```bash
node Test.js/脚本名称.js
```

例如：
```bash
node Test.js/create-user.js
```

## 注意事项

- 运行这些脚本前，请确保数据库连接正常
- 某些脚本可能会修改数据库数据，请在运行前备份重要数据
- 脚本主要用于开发和测试环境，不建议在生产环境中使用

---

# Test Scripts Description

This folder contains various test and utility scripts for the WorldView Platform project.

## Script List

### User Management Scripts

- `create-user.js` - Create a single user interactively

### Worldview Management Scripts

- `create-worldview-with-user.js` - Publish worldviews using specified user
- `manage-worldview.js` - Manage existing worldviews (view, edit, delete)

## Usage

To run these scripts, use the following command format from the project root directory:

```bash
node Test.js/script-name.js
```

For example:
```bash
node Test.js/create-user.js
```

## Notes

- Ensure the database connection is working before running these scripts
- Some scripts may modify database data, please backup important data before running
- Scripts are primarily for development and testing environments, not recommended for production use