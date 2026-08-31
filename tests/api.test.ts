import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { createApp } from '../server';

const app = createApp();

describe('PulseBoard API', () => {
  it('exposes a health check without authentication', async () => {
    const response = await request(app).get('/health');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: 'ok' });
  });

  it('returns the active demo persona in development', async () => {
    const response = await request(app).get('/api/session').set('x-pulseboard-role', 'Viewer');

    expect(response.status).toBe(200);
    expect(response.body.user.role).toBe('Viewer');
  });

  it('enforces RBAC for user creation', async () => {
    const response = await request(app)
      .post('/api/users')
      .set('x-pulseboard-role', 'Viewer')
      .send({ name: 'Unauthorised User', email: 'unauthorised@example.com' });

    expect(response.status).toBe(403);
  });

  it('rejects malformed user payloads', async () => {
    const response = await request(app)
      .post('/api/users')
      .set('x-pulseboard-role', 'Admin')
      .send({ name: '', email: 'not-an-email', unexpected: true });

    expect(response.status).toBe(400);
  });

  it('prevents admins from changing roles', async () => {
    const response = await request(app)
      .patch('/api/users/usr-003/role')
      .set('x-pulseboard-role', 'Admin')
      .send({ role: 'Admin' });

    expect(response.status).toBe(403);
  });

  it('bounds audit-log pagination', async () => {
    const response = await request(app).get('/api/activities?limit=1000');

    expect(response.status).toBe(400);
  });
});
