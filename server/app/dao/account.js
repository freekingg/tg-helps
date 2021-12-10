import { NotFound, Forbidden } from 'lin-mizar';
import Sequelize, { json } from 'sequelize';
import { Account } from '../model/account';

class AccountDao {
  async getAccount (id) {
    const item = await Account.findOne({
      where: {
        id
      }
    });
    return item;
  }

  async getAccountByKeyword (q) {
    const item = await Account.findOne({
      where: {
        title: {
          [Sequelize.Op.like]: `%${q}%`
        }
      }
    });
    return item;
  }

  async getAccounts () {
    const items = await Account.findAll();
    return items;
  }

  async createAccount (v) {
    const item = await Account.findOne({
      where: {
        phone: v.get('body.phone')
      }
    });
    if (item) {
      throw new Forbidden({
        code: 10240
      });
    }
    const bk = new Account();
    bk.phone = v.get('body.phone');
    bk.authData = v.get('body.authData');
    bk.summary = v.get('body.summary');
    bk.extra = v.get('body.extra');
    await bk.save();
  }

  async updateAccount (v, id) {
    const item = await Account.findByPk(id);
    if (!item) {
      throw new NotFound({
        code: 10022
      });
    }
    item.phone = v.get('body.phone');
    item.authData = v.get('body.authData');
    item.summary = v.get('body.summary');
    item.extra = v.get('body.extra');
    await item.save();
  }

  async updateAccountAuthData ({ authData }, id) {
    console.log('id: ', id);
    const item = await Account.findByPk(id);
    console.log('item: ', item);
    if (!item) {
      throw new NotFound({
        code: 10022
      });
    }
    item.authData = JSON.stringify(authData);
    await item.save();
  }

  async deleteAccount (id) {
    const item = await Account.findOne({
      where: {
        id
      }
    });
    if (!item) {
      throw new NotFound({
        code: 10022
      });
    }
    await item.destroy();
  }
}

export { AccountDao };
