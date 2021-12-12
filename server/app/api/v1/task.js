import { LinRouter, NotFound, disableLoading } from 'lin-mizar';
import { groupRequired } from '../../middleware/jwt';
import {
  TaskSearchValidator,
  CreateOrUpdateTaskValidator
} from '../../validator/task';
import { PositiveIdValidator } from '../../validator/common';

import { getSafeParamId } from '../../lib/util';
import { TaskDao } from '../../dao/task';

const taskApi = new LinRouter({
  prefix: '/v1/task',
  module: '任务'
});

const TaskDto = new TaskDao();

taskApi.get('/:id', async ctx => {
  const v = await new PositiveIdValidator().validate(ctx);
  const id = v.get('path.id');
  const item = await TaskDto.getTask(id);
  if (!item) {
    throw new NotFound({
      code: 10022
    });
  }
  ctx.json(item);
});

taskApi.get('/', async ctx => {
  const v = await new TaskSearchValidator().validate(ctx);
  const items = await TaskDto.getTasks(v);
  // if (!books || books.length < 1) {
  //   throw new NotFound({
  //     message: '没有找到相关书籍'
  //   });
  // }
  ctx.json(items);
});

taskApi.get('/search/one', async ctx => {
  const v = await new TaskSearchValidator().validate(ctx);
  const item = await TaskDto.getTaskByKeyword(v.get('query.q'));
  if (!item) {
    throw new NotFound();
  }
  ctx.json(item);
});

taskApi.post('/', async ctx => {
  const v = await new CreateOrUpdateTaskValidator().validate(ctx);
  await TaskDto.createTask(v);
  ctx.success({
    code: 12
  });
});

taskApi.put('/:id', async ctx => {
  const v = await new CreateOrUpdateTaskValidator().validate(ctx);
  const id = getSafeParamId(ctx);
  await TaskDto.updateTask(v, id);
  ctx.success({
    code: 13
  });
});

taskApi.linDelete(
  'deleteTask',
  '/:id',
  taskApi.permission('删除帐号'),
  groupRequired,
  async ctx => {
    const v = await new PositiveIdValidator().validate(ctx);
    const id = v.get('path.id');
    await TaskDto.deleteTask(id);
    ctx.success({
      code: 14
    });
  }
);

module.exports = { taskApi, [disableLoading]: false };
