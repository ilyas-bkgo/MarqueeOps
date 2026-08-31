import { createClient } from '@supabase/supabase-js';
import { config } from './config';

export const isSupabaseConfigured = Boolean(config.SUPABASE_URL && config.SUPABASE_SERVICE_ROLE_KEY);

export const supabaseAdmin = isSupabaseConfigured
  ? createClient(config.SUPABASE_URL!, config.SUPABASE_SERVICE_ROLE_KEY!, {
      auth: { autoRefreshToken: false, persistSession: false },
    })
  : null;

export async function getSupabaseIdentity(accessToken: string) {
  if (!supabaseAdmin) return null;
  const { data, error } = await supabaseAdmin.auth.getUser(accessToken);
  if (error || !data.user) return null;
  return data.user;
}

export async function inviteMember(email: string, organizationId: string, role: 'owner' | 'manager' | 'member' | 'client') {
  if (!supabaseAdmin) throw new Error('Supabase is not configured');
  const { data, error } = await supabaseAdmin.auth.admin.inviteUserByEmail(email, {
    data: { organization_id: organizationId, workspace_role: role },
  });
  if (error) throw error;
  return data.user;
}
