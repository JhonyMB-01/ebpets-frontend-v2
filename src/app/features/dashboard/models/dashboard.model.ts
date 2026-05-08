export interface DashboardMetric {
  label: string;
  value: string;
  icon: string;
  type: 'primary' | 'warn' | 'accent';
}