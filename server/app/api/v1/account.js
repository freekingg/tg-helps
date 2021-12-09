import { LinRouter, NotFound, disableLoading } from 'lin-mizar';
import { groupRequired } from '../../middleware/jwt';
import {
  AccountSearchValidator,
  CreateOrUpdateAccountValidator
} from '../../validator/account';
import { PositiveIdValidator } from '../../validator/common';

import PuppeteerTelegram from '../../lib/tg'

import { getSafeParamId } from '../../lib/util';
import { AccountDao } from '../../dao/account';

const accountApi = new LinRouter({
  prefix: '/v1/account',
  module: '帐号'
});

const AccountDto = new AccountDao();

accountApi.get('/:id', async ctx => {
  const v = await new PositiveIdValidator().validate(ctx);
  const id = v.get('path.id');
  const item = await AccountDto.getAccount(id);
  if (!item) {
    throw new NotFound({
      code: 10022
    });
  }
  ctx.json(item);
});

accountApi.get('/', async ctx => {
  const items = await AccountDto.getAccounts();
  // if (!books || books.length < 1) {
  //   throw new NotFound({
  //     message: '没有找到相关书籍'
  //   });
  // }
  ctx.json(items);
});

accountApi.get('/auth/login', async ctx => {
  const v = await new AccountSearchValidator().validate(ctx);
  let account = v.get('query.phone')
  const items = await PuppeteerTelegram.signin(account);
  ctx.json(items);
});

accountApi.get('/search/one', async ctx => {
  const v = await new AccountSearchValidator().validate(ctx);
  const item = await AccountDto.getAccountByKeyword(v.get('query.q'));
  if (!item) {
    throw new NotFound();
  }
  ctx.json(item);
});

accountApi.post('/', async ctx => {
  const v = await new CreateOrUpdateAccountValidator().validate(ctx);
  await AccountDto.createAccount(v);
  ctx.success({
    code: 12
  });
});

accountApi.put('/:id', async ctx => {
  const v = await new CreateOrUpdateAccountValidator().validate(ctx);
  const id = getSafeParamId(ctx);
  await AccountDto.updateAccount(v, id);
  ctx.success({
    code: 13
  });
});

accountApi.linDelete(
  'deleteAccount',
  '/:id',
  accountApi.permission('删除帐号'),
  groupRequired,
  async ctx => {
    const v = await new PositiveIdValidator().validate(ctx);
    const id = v.get('path.id');
    await AccountDto.deleteAccount(id);
    ctx.success({
      code: 14
    });
  }
);

module.exports = { accountApi, [disableLoading]: false };
