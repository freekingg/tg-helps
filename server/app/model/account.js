import { InfoCrudMixin } from 'lin-mizar';
import { merge } from 'lodash';
import { Sequelize, Model } from 'sequelize';
import sequelize from '../lib/db';

class Account extends Model {
  toJSON () {
    const origin = {
      id: this.id,
      phone: this.phone,
      authData: this.authData,
      status: this.status,
      summary: this.summary,
      extra: this.extra
    };
    return origin;
  }
}

Account.init(
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    phone: {
      type: Sequelize.STRING(30),
      allowNull: true
    },
    authData: {
      type: Sequelize.STRING(1000),
      allowNull: true
    },
    status: {
      type: Sequelize.INTEGER(2),
      defaultValue: 1,
      comment: '状态 1：未登录 2：已登录 3：任务中'
    },
    extra: {
      type: Sequelize.STRING(1000),
      allowNull: true
    },
    summary: {
      type: Sequelize.STRING(1000),
      allowNull: true
    }
  },
  merge(
    {
      sequelize,
      tableName: 'account',
      modelName: 'account'
    },
    InfoCrudMixin.options
  )
);

export { Account };
