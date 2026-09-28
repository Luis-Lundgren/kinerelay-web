import { describe, it, before, after } from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import crypto from 'node:crypto';

// Setup environment variables (preferring KINERELAY_*)
delete process.env.EMBODEX_API_TOKEN;
delete process.env.EMBODEX_WS_TICKET_SECRET;
delete process.env.NEXT_PUBLIC_EMBODEX_TELEOP_WS_URL;

process.env.KINERELAY_API_TOKEN = 'test-server-api-token-987';
process.env.KINERELAY_WS_TICKET_SECRET = 'test-ws-ticket-secret-654321';
process.env.NEXT_PUBLIC_KINERELAY_TELEOP_WS_URL = 'ws://localhost:8500/ws';

import {
    createWsTicket,
    proxyTeleopRequest,
    getTeleopHttpUrl,
    getTeleopWsUrl,
    getApiToken,
    getWsTicketSecret,
} from '../lib/teleop-service';

describe('Teleop Service Layer Unit Tests', () => {
    let mockBackendServer: http.Server;
    let mockBackendPort: number;
    let lastRequest: {
        method?: string;
        url?: string;
        headers?: http.IncomingHttpHeaders;
        body?: string;
    } = {};

    before(async () => {
        mockBackendServer = http.createServer((req, res) => {
            let body = '';
            req.on('data', chunk => { body += chunk; });
            req.on('end', () => {
                lastRequest = {
                    method: req.method,
                    url: req.url,
                    headers: req.headers,
                    body,
                };

                if (req.url === '/api/robot') {
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: true, action: 'connect' }));
                } else {
                    res.writeHead(404, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Not found' }));
                }
            });
        });

        await new Promise<void>(resolve => {
            mockBackendServer.listen(0, '127.0.0.1', () => {
                const addr = mockBackendServer.address() as any;
                mockBackendPort = addr.port;
                process.env.KINERELAY_TELEOP_HTTP_URL = `http://127.0.0.1:${mockBackendPort}`;
                resolve();
            });
        });
    });

    after(async () => {
        await new Promise<void>(resolve => mockBackendServer.close(() => resolve()));
    });

    it('createWsTicket generates a valid 3-part compact JWT', () => {
        const ticket = createWsTicket({ id: 'user_123', roles: ['teleoperator'] }, 60);
        const parts = ticket.split('.');
        assert.equal(parts.length, 3, 'Ticket must have 3 parts: header.payload.signature');

        const [hB64, pB64, sig] = parts;
        const header = JSON.parse(Buffer.from(hB64, 'base64url').toString('utf-8'));
        const payload = JSON.parse(Buffer.from(pB64, 'base64url').toString('utf-8'));

        assert.equal(header.alg, 'HS256');
        assert.equal(header.typ, 'JWT');
        assert.equal(payload.sub, 'user_123');
        assert.equal(payload.role, 'teleoperator');
        assert.equal(payload.scope, 'teleop');
        assert.ok(payload.exp > Math.floor(Date.now() / 1000));
        assert.ok(payload.jti);

        // Verify HMAC signature
        const expectedSig = crypto
            .createHmac('sha256', process.env.KINERELAY_WS_TICKET_SECRET!)
            .update(`${hB64}.${pB64}`)
            .digest('base64url');
        assert.equal(sig, expectedSig);
    });

    it('createWsTicket maps admin role correctly', () => {
        const ticket = createWsTicket({ id: 'admin_1', roles: ['admin'] }, 60);
        const payload = JSON.parse(Buffer.from(ticket.split('.')[1], 'base64url').toString('utf-8'));
        assert.equal(payload.role, 'admin');
    });

    it('createWsTicket throws when roles is empty (fail closed)', () => {
        assert.throws(
            () => createWsTicket({ id: 'user_empty', roles: [] }),
            /User is not authorized for teleoperation/
        );
    });

    it('createWsTicket throws when roles is lab-only (fail closed)', () => {
        assert.throws(
            () => createWsTicket({ id: 'user_lab', roles: ['lab'] }),
            /User is not authorized for teleoperation/
        );
    });

    it('createWsTicket throws when roles contains unknown role (fail closed)', () => {
        assert.throws(
            () => createWsTicket({ id: 'user_guest', roles: ['guest'] }),
            /User is not authorized for teleoperation/
        );
    });

    it('proxyTeleopRequest attaches Authorization Bearer token server-side', async () => {
        const res = await proxyTeleopRequest('/api/robot', {
            method: 'POST',
            body: { action: 'connect' },
        });

        assert.equal(res.status, 200);
        assert.equal(res.data.success, true);
        assert.equal(
            lastRequest.headers?.['authorization'],
            `Bearer ${process.env.KINERELAY_API_TOKEN}`
        );

        // Verify secret token is NOT leaked in res.data
        const serialized = JSON.stringify(res.data);
        assert.ok(!serialized.includes(process.env.KINERELAY_API_TOKEN!));
    });

    it('proxyTeleopRequest handles backend offline gracefully', async () => {
        const originalUrl = process.env.KINERELAY_TELEOP_HTTP_URL;
        process.env.KINERELAY_TELEOP_HTTP_URL = 'http://127.0.0.1:1';

        const res = await proxyTeleopRequest('/api/robot', { method: 'GET' });
        assert.equal(res.status, 502);
        assert.equal(res.data.error, 'Teleop backend unreachable');

        process.env.KINERELAY_TELEOP_HTTP_URL = originalUrl;
    });

    it('getTeleopWsUrl returns public WebSocket URL', () => {
        assert.equal(getTeleopWsUrl(), 'ws://localhost:8500/ws');
    });

    it('supports EMBODEX_* as deprecated compatibility fallback', () => {
        const savedKine = process.env.KINERELAY_API_TOKEN;
        const savedSecret = process.env.KINERELAY_WS_TICKET_SECRET;

        delete process.env.KINERELAY_API_TOKEN;
        delete process.env.KINERELAY_WS_TICKET_SECRET;

        process.env.EMBODEX_API_TOKEN = 'fallback-embodex-token';
        process.env.EMBODEX_WS_TICKET_SECRET = 'fallback-embodex-secret';

        assert.equal(getApiToken(), 'fallback-embodex-token');
        assert.equal(getWsTicketSecret(), 'fallback-embodex-secret');

        // Clean up
        delete process.env.EMBODEX_API_TOKEN;
        delete process.env.EMBODEX_WS_TICKET_SECRET;
        process.env.KINERELAY_API_TOKEN = savedKine;
        process.env.KINERELAY_WS_TICKET_SECRET = savedSecret;
    });
});
