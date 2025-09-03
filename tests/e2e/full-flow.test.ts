import request from 'supertest';
import app from '../../src/app.js'; // إذا أعطاك خطأ جرّب: '../../src/app'

describe('Full E2E: auth → workspace → project → task → comment', () => {
  let token = '';
  let wsId = '';
  let projectId = '';
  let taskId = '';

  it('login (seed user)', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@example.com', password: 'secret123' })
      .expect(200);

    expect(res.body).toHaveProperty('accessToken');
    token = res.body.accessToken;
  });

  it('create workspace', async () => {
    const res = await request(app)
      .post('/api/workspaces')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'WS E2E ' + new Date().toISOString() })
      .expect(201);

    expect(res.body).toHaveProperty('id');
    wsId = res.body.id;
  });

  it('create project in workspace', async () => {
    const res = await request(app)
      .post('/api/projects')
      .set('Authorization', `Bearer ${token}`)
      .set('x-workspace-id', wsId)
      .send({ name: 'Proj E2E', description: 'demo' })
      .expect(201);

    expect(res.body).toMatchObject({ name: 'Proj E2E' });
    expect(res.body).toHaveProperty('id');
    projectId = res.body.id;
  });

  it('create task in workspace', async () => {
    const res = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${token}`)
      .set('x-workspace-id', wsId)
      .send({
        title: 'Task E2E',
        description: 'smoke',
        priority: 'MEDIUM',
        status: 'TODO',
        projectId,
        dueDate: new Date(Date.now() + 2 * 86400000).toISOString(),
      })
      .expect(201);

    expect(res.body).toMatchObject({ title: 'Task E2E', status: 'TODO' });
    expect(res.body).toHaveProperty('id');
    taskId = res.body.id;
  });

  it('add a comment on the task', async () => {
    const res = await request(app)
      .post(`/api/tasks/${taskId}/comments`)
      .set('Authorization', `Bearer ${token}`)
      .set('x-workspace-id', wsId)
      .send({ content: 'Looks good! ✅' })
      .expect(201);

    expect(res.body).toMatchObject({ content: 'Looks good! ✅' });
    expect(res.body).toHaveProperty('id');
  });

  it('list comments paginated', async () => {
    const res = await request(app)
      .get(`/api/tasks/${taskId}/comments?page=1&pageSize=10`)
      .set('Authorization', `Bearer ${token}`)
      .set('x-workspace-id', wsId)
      .expect(200);

    expect(res.body).toHaveProperty('items');
    expect(Array.isArray(res.body.items)).toBe(true);
    expect(res.body.items.length).toBeGreaterThanOrEqual(1);
  });
});
