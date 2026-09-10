import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

const PLACEHOLDER_PATTERN = /^(your_|replace_|placeholder|changeme|example)/i;

const isPlaceholder = (value) => {
    return !value || PLACEHOLDER_PATTERN.test(value.trim());
};

const validateSupabaseUrl = (value) => {
    if (isPlaceholder(value)) {
        return 'SUPABASE_URL is not configured';
    }

    try {
        const parsedUrl = new URL(value);

        if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
            return 'SUPABASE_URL must use http or https';
        }

        return null;
    } catch {
        return 'SUPABASE_URL is invalid';
    }
};

const validServiceRoleKey = !isPlaceholder(supabaseServiceRoleKey)
    ? supabaseServiceRoleKey
    : null;
const validAnonKey = !isPlaceholder(supabaseAnonKey) ? supabaseAnonKey : null;
const supabaseKey = validServiceRoleKey || validAnonKey;
const urlIssue = validateSupabaseUrl(supabaseUrl);
const keyIssue = supabaseKey
    ? null
    : 'SUPABASE_SERVICE_ROLE_KEY or SUPABASE_ANON_KEY is not configured';

let activeSupabaseClient = null;
let unavailableReason = urlIssue || keyIssue;

if (!unavailableReason) {
    try {
        activeSupabaseClient = createClient(supabaseUrl, supabaseKey, {
            auth: {
                persistSession: false,
                autoRefreshToken: false,
            },
        });
    } catch {
        unavailableReason = 'Supabase client could not be created';
    }
}

if (activeSupabaseClient && !validServiceRoleKey) {
    console.warn(
        'SUPABASE_SERVICE_ROLE_KEY not set; falling back to anon key. Backend writes may fail under RLS.'
    );
}

if (!activeSupabaseClient) {
    console.warn(
        `Supabase disabled: ${unavailableReason}. DB-backed routes will return 503 until configured.`
    );
}

export const supabaseConfig = Object.freeze({
    isAvailable: Boolean(activeSupabaseClient),
    hasServiceRoleKey: Boolean(validServiceRoleKey),
    reason: unavailableReason,
});

export const isSupabaseAvailable = supabaseConfig.isAvailable;

export const createSupabaseUnavailableError = () => {
    const err = new Error(
        `Database unavailable: ${supabaseConfig.reason}. Configure valid Supabase credentials in backend/.env.`
    );
    err.status = 503;
    return err;
};

export const requireSupabase = () => {
    if (!activeSupabaseClient) {
        throw createSupabaseUnavailableError();
    }

    return activeSupabaseClient;
};

const unavailableSupabase = new Proxy(
    {},
    {
        get() {
            throw createSupabaseUnavailableError();
        },
    }
);

export const supabase = activeSupabaseClient || unavailableSupabase;
