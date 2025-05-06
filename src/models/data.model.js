const { Sequelize, DataTypes } = require('sequelize');
const config = require('../config');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: config.database.storage,
    pool: {
        max: 10,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});

const Data = sequelize.define('Data', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false
    },
    url: {
        type: DataTypes.STRING,
        allowNull: false
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    }
}, {
    tableName: 'data',
    timestamps: false,
    indexes: [
        {
            unique: true,
            fields: ['id']
        }
    ]
});

(async () => {
    try {
        // Kiểm tra xem bảng data có tồn tại không
        const tableExists = await sequelize.query("SELECT name FROM sqlite_master WHERE type='table' AND name='data'");
        if (!tableExists[0].length) {
            await sequelize.sync({ force: true });
            console.log('Đã tạo mới bảng data');
        } else {
            await sequelize.sync({ alter: false }); // Không sửa đổi nếu bảng đã tồn tại
            console.log('Bảng data đã sẵn sàng');
        }
    } catch (error) {
        console.error('Lỗi khi đồng bộ cơ sở dữ liệu:', error.message);
        if (error.name === 'SequelizeDatabaseError') {
            console.error('Chi tiết lỗi SQLite:', error.parent);
        }
    }
})();

module.exports = { sequelize, Data };