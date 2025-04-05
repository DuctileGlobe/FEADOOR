const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Internship = sequelize.define('Internship', {
    position: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: { msg: 'O cargo é obrigatório' },
            notEmpty: { msg: 'O cargo não pode estar vazio' }
        }
    },
    company_name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: { msg: 'O nome da empresa é obrigatório' },
            notEmpty: { msg: 'O nome da empresa não pode estar vazio' }
        }
    },
    company_domain: {
        type: DataTypes.STRING,
        allowNull: true
    },
    salary: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
            notNull: { msg: 'O salário é obrigatório' },
            min: {
                args: [0],
                msg: 'O salário deve ser maior que zero'
            }
        }
    },
    workload: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
            notNull: { msg: 'A carga horária é obrigatória' },
            isNumeric: {
                msg: 'A carga horária deve ser um número'
            },
            min: {
                args: [0],
                msg: 'A carga horária deve ser maior que zero'
            },
            max: {
                args: [60],
                msg: 'A carga horária deve ser menor que 60 horas'
            }
        }
    },
    benefits: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    work_environment: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    reconciliation_difficulty: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notNull: { msg: 'A dificuldade de conciliação é obrigatória' },
            min: {
                args: [1],
                msg: 'A dificuldade de conciliação deve ser entre 1 e 5'
            },
            max: {
                args: [5],
                msg: 'A dificuldade de conciliação deve ser entre 1 e 5'
            }
        }
    },
    process_difficulty: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notNull: { msg: 'A dificuldade do processo é obrigatória' },
            min: {
                args: [1],
                msg: 'A dificuldade do processo deve ser entre 1 e 5'
            },
            max: {
                args: [5],
                msg: 'A dificuldade do processo deve ser entre 1 e 5'
            }
        }
    }
});

module.exports = Internship; 