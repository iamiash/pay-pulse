export interface User {
  id: number;
  user_id: string; // e.g., PP-7K4M9X2Q (Immutable)
  full_name: string;
  email: string;
  role?: 'USER' | 'ADMIN' | 'SUPER_ADMIN' | string;
  account_status?: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'BANNED' | 'PENDING' | 'DEACTIVATED' | string;
  email_verified?: boolean;
  contact_no?: string;
  address?: string;
  dob?: string;
  country?: string;
  preferred_currency?: string;
  avatar_url?: string;
  created_at?: string;
  last_seen_at?: string;
}

export interface ChangeEmailReq {
  current_password: string;
  new_email: string;
  confirm_new_email: string;
}

export interface ChangePasswordReq {
  current_password: string;
  new_password: string;
}

export interface VerifyCredentialsReq {
  email?: string;
  user_id?: string;
  password: string;
}

export interface UserUpdate {
  full_name?: string;
  email?: string;
  contact_no?: string;
  address?: string;
  country?: string;
  preferred_currency?: string;
  current_password?: string;
}

export interface WalletBank {
  id: number;
  user_id?: number;
  bank_name: string;
  masked_account_number: string;
  branch_name: string;
  routing_number: string;
  is_primary?: boolean;
  created_at?: string;
}

export interface WalletCard {
  id: number;
  user_id?: number;
  card_title: string;
  card_type: string;
  card_category: string;
  masked_card_number: string;
  expiry_date: string;
  is_default?: boolean;
  is_primary?: boolean;
  created_at?: string;
}

export interface WalletMobile {
  id: number;
  user_id?: number;
  provider: string;
  mobile_number: string;
  is_primary?: boolean;
  created_at?: string;
}

export interface Subscription {
  id: number;
  user_id?: number;
  name: string;
  provider?: string;
  logo_url?: string;
  website?: string;
  category: string;
  account_type?: string;
  associated_email?: string;
  username?: string;
  associated_contact?: string;
  account_reference?: string;
  notes?: string;
  plan_type: string;
  cost: number;
  currency?: string;
  billing_cycle: string;
  purchased_date?: string;
  next_billing_date: string;
  trial_period?: boolean;
  auto_renewal: boolean;
  reminder_enabled?: boolean;
  reminder_days?: number;
  status: 'Active' | 'Expired' | 'Paused' | 'Cancelled' | 'Idle' | string;
  payment_type: 'card' | 'bank' | 'mfs' | 'mobile_banking' | string;
  card_id?: number | null;
  bank_id?: number | null;
  mobile_id?: number | null;
  created_at?: string;
  tenure_months?: number;
  card?: WalletCard | null;
  bank?: WalletBank | null;
  mobile?: WalletMobile | null;
}

export interface SubscriptionCreate {
  name: string;
  provider?: string;
  logo_url?: string;
  website?: string;
  category: string;
  account_type?: string;
  associated_email: string;
  username?: string;
  associated_contact: string;
  account_reference?: string;
  notes?: string;
  plan_type: string;
  cost: number;
  currency?: string;
  billing_cycle: string;
  purchased_date: string;
  next_billing_date: string;
  trial_period?: boolean;
  auto_renewal: boolean;
  reminder_enabled?: boolean;
  reminder_days?: number;
  status?: string;
  payment_type: string;
  bank_id?: number | null;
  card_id?: number | null;
  mobile_id?: number | null;
}

export interface SubscriptionUpdate extends Partial<SubscriptionCreate> {}

export type SubscriptionCreatePayload = SubscriptionCreate;
export type SubscriptionUpdatePayload = SubscriptionUpdate;

export type NotificationCategory = 'Renewal' | 'Payment' | 'Account' | 'Security' | 'System';

export interface NotificationItem {
  id: number;
  user_id?: number;
  subscription_id?: number | null;
  title: string;
  message: string;
  category: NotificationCategory;
  is_read: boolean;
  created_at: string;
}

export interface AppSearchResult {
  id?: string | number;
  name?: string;
  title?: string;
  type?: string;
  category?: string;
  path: string;
  subtext?: string;
  subscription?: Subscription;
}

export interface RecentActivity {
  id: number | string;
  title?: string;
  message?: string;
  description?: string;
  timestamp: string;
  type?: string;
  amount?: number;
  currency?: string;
  status?: string;
}

export interface AnalyticsMetrics {
  total_spending: number;
  average_monthly_spending: number;
  highest_subscription: {
    name: string;
    cost: number;
    category: string;
  };
  active_subscriptions_count: number;
  potential_savings: number;
}

export interface SmartSavingsData {
  similar_subscriptions: {
    category: string;
    items: string[];
  };
  high_cost_subscriptions: {
    top_count: number;
    percentage_of_total: number;
    top_names: string[];
  };
  annual_billing_opportunity: {
    estimated_annual_savings: number;
  };
  upcoming_spending_30_days: number;
}

export interface AnalyticsResponse {
  period: string;
  metrics: AnalyticsMetrics;
  charts: {
    spending_over_time: { month: string; amount: number }[];
    spending_by_category: { category: string; amount: number; percentage: number }[];
    billing_cycle_distribution: { cycle: string; count: number }[];
    payment_source_distribution: { source: string; count: number }[];
  };
  smart_savings: SmartSavingsData;
}

export interface PdfReportFilterPayload {
  report_type: string;
  date_range?: string;
  subscription_id?: number;
  category?: string;
  status?: string;
  payment_source?: string;
  currency?: string;
  selected_month?: string;
  start_date?: string;
  end_date?: string;
}

export interface AdminDashboardMetrics {
  total_users: number;
  active_users: number;
  inactive_users: number;
  suspended_users: number;
  banned_users: number;
  new_users: number;
  active_subscriptions: number;
  security_alerts: number;
  failed_logins?: number;
  password_resets?: number;
  email_changes?: number;
  suspicious_activity?: number;
  locked_accounts?: number;
}

export interface AdminSecurityMetrics {
  failed_logins: number;
  password_resets: number;
  email_changes: number;
  suspicious_activity: number;
  locked_accounts: number;
  recent_events: number;
}

export interface UserGrowthPoint {
  label: string;
  value: number;
}

export interface UserGrowthData {
  daily: UserGrowthPoint[];
  weekly: UserGrowthPoint[];
  monthly: UserGrowthPoint[];
}

export interface ActiveUsersPoint {
  period: string;
  dau: number;
  wau: number;
  mau: number;
}

export interface ActiveUsersData {
  dau: number;
  wau: number;
  mau: number;
  history: ActiveUsersPoint[];
}

export interface AccountStatusItem {
  status: string;
  count: number;
  color: string;
}

export interface SubscriptionGrowthItem {
  period: string;
  subscriptions: number;
  revenue: number;
}

export interface AdminDashboardCharts {
  user_growth: UserGrowthData;
  active_users_trend: ActiveUsersData;
  account_status_distribution: AccountStatusItem[];
  subscription_growth: SubscriptionGrowthItem[];
}

export interface AdminUserListItem {
  id: number;
  user_id: string;
  full_name: string;
  email: string;
  role: string;
  account_status: string;
  email_verified?: boolean;
  contact_no?: string;
  created_at: string;
  last_login_at?: string;
  last_seen_at?: string;
  subscriptions_count?: number;
}

export interface AdminAuditLogItem {
  id: number;
  user_id?: number;
  user_email?: string;
  action: string;
  ip_address?: string;
  user_agent?: string;
  timestamp: string;
  details?: string;
}

export interface AdminSecurityEventItem {
  id: number;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' | string;
  event_type: string;
  description: string;
  user_email?: string;
  ip_address?: string;
  timestamp: string;
  resolved: boolean;
}

export interface AdminSystemSettings {
  allow_user_registration: boolean;
  require_email_verification: boolean;
  maintenance_mode: boolean;
  max_failed_login_attempts: number;
  session_timeout_minutes: number;
}

export interface AdminUserOverview {
  user_id: string;
  full_name: string;
  masked_email: string;
  masked_contact: string;
  account_status: string;
  role: string;
  created_at: string;
  last_login: string;
  last_active: string;
  email_verified: boolean;
}

export interface AdminSubscriptionDetail {
  id: number;
  name: string;
  category: string;
  plan_type: string;
  cost: number;
  currency: string;
  billing_cycle: string;
  status: string;
  next_billing_date: string;
}

export interface AdminWalletBank {
  id: number;
  bank_name: string;
  masked_account: string;
}

export interface AdminWalletCard {
  id: number;
  card_title: string;
  masked_card: string;
  type: string;
}

export interface AdminWalletMobile {
  id: number;
  provider: string;
  mobile_number: string;
}

export interface AdminWalletDetail {
  banks: AdminWalletBank[];
  cards: AdminWalletCard[];
  mobiles: AdminWalletMobile[];
}

export interface AdminActivityItem {
  event: string;
  timestamp: string;
  ip: string;
}

export interface AdminSecurityItem {
  id: number;
  event_type: string;
  severity: string;
  description: string;
  timestamp: string;
}

export interface AdminAuditItem {
  id: number;
  action: string;
  resource_type: string;
  timestamp: string;
  status: string;
}

export interface AdminUserDetailResponse {
  overview: AdminUserOverview;
  subscriptions: AdminSubscriptionDetail[];
  wallet: AdminWalletDetail;
  activity: AdminActivityItem[];
  security: AdminSecurityItem[];
  audit: AdminAuditItem[];
}

export interface AdminGlobalSubscriptionItem {
  id: number;
  user_id: string;
  user_name: string;
  service: string;
  plan: string;
  amount: number;
  currency: string;
  next_billing_date: string;
  status: string;
  payment_type: string;
  category: string;
  billing_cycle: string;
  created_at: string;
}

export interface AdminSubscriptionFilterParams {
  user?: string;
  service?: string;
  status?: string;
  category?: string;
  billing_cycle?: string;
}