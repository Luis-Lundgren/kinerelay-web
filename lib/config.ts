/**
 * KineRelay Teleoperation Service URLs.
 *
 * Preferred environment variables:
 * - NEXT_PUBLIC_KINERELAY_TELEOP_WS_URL
 * - NEXT_PUBLIC_KINERELAY_TELEOP_HTTP_URL
 *
 * Deprecated compatibility aliases (planned for removal in a future release):
 * - NEXT_PUBLIC_EMBODEX_TELEOP_WS_URL
 * - NEXT_PUBLIC_EMBODEX_TELEOP_HTTP_URL
 * - NEXT_PUBLIC_TELEGRIP_WS_URL
 * - NEXT_PUBLIC_TELEGRIP_HTTP_URL
 */

export const KINERELAY_TELEOP_WS_URL = (() => {
    // 1. Preferred modern variable
    if (process.env.NEXT_PUBLIC_KINERELAY_TELEOP_WS_URL) {
        return process.env.NEXT_PUBLIC_KINERELAY_TELEOP_WS_URL;
    }

    // 2. Deprecated compatibility alias: NEXT_PUBLIC_EMBODEX_TELEOP_WS_URL
    // Deprecated compatibility alias from pre-KineRelay branding. Planned removal after migration window.
    if (process.env.NEXT_PUBLIC_EMBODEX_TELEOP_WS_URL) {
        return process.env.NEXT_PUBLIC_EMBODEX_TELEOP_WS_URL;
    }

    // 3. Deprecated legacy fallback: NEXT_PUBLIC_TELEGRIP_WS_URL
    if (process.env.NEXT_PUBLIC_TELEGRIP_WS_URL) {
        return process.env.NEXT_PUBLIC_TELEGRIP_WS_URL;
    }

    // 4. Fallback for local development
    if (typeof window !== 'undefined') {
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const host = window.location.hostname;

        // Unified KineRelay teleop server binds to port 8500 by default
        if (host === 'localhost' || host === '127.0.0.1') {
            return `${protocol}//${host}:8500/ws`;
        }

        return `${protocol}//${host}/ws`;
    }

    return 'ws://localhost:8500/ws';
})();

export const KINERELAY_TELEOP_HTTP_URL = (() => {
    // 1. Preferred modern variable
    if (process.env.NEXT_PUBLIC_KINERELAY_TELEOP_HTTP_URL) {
        return process.env.NEXT_PUBLIC_KINERELAY_TELEOP_HTTP_URL;
    }

    // 2. Deprecated compatibility alias: NEXT_PUBLIC_EMBODEX_TELEOP_HTTP_URL
    // Deprecated compatibility alias from pre-KineRelay branding. Planned removal after migration window.
    if (process.env.NEXT_PUBLIC_EMBODEX_TELEOP_HTTP_URL) {
        return process.env.NEXT_PUBLIC_EMBODEX_TELEOP_HTTP_URL;
    }

    // 3. Deprecated legacy fallback: NEXT_PUBLIC_TELEGRIP_HTTP_URL
    if (process.env.NEXT_PUBLIC_TELEGRIP_HTTP_URL) {
        return process.env.NEXT_PUBLIC_TELEGRIP_HTTP_URL;
    }

    // 4. Fallback logic
    if (typeof window !== 'undefined') {
        const protocol = window.location.protocol;
        const host = window.location.hostname;

        if (host === 'localhost' || host === '127.0.0.1') {
            return `${protocol}//${host}:8500`;
        }

        return `${protocol}//${host}`;
    }

    return 'http://localhost:8500';
})();

/**
 * @deprecated Deprecated compatibility alias from pre-KineRelay branding. Use KINERELAY_TELEOP_WS_URL instead. Planned removal after migration window.
 */
export const EMBODEX_TELEOP_WS_URL = KINERELAY_TELEOP_WS_URL;

/**
 * @deprecated Deprecated compatibility alias from pre-KineRelay branding. Use KINERELAY_TELEOP_HTTP_URL instead. Planned removal after migration window.
 */
export const EMBODEX_TELEOP_HTTP_URL = KINERELAY_TELEOP_HTTP_URL;

/**
 * @deprecated Deprecated legacy alias. Use KINERELAY_TELEOP_WS_URL instead. Planned removal after migration window.
 */
export const TELEGRIP_WS_URL = KINERELAY_TELEOP_WS_URL;

/**
 * @deprecated Deprecated legacy alias. Use KINERELAY_TELEOP_HTTP_URL instead. Planned removal after migration window.
 */
export const TELEGRIP_HTTP_URL = KINERELAY_TELEOP_HTTP_URL;
