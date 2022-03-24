export enum OrgRole {
  Viewer = 'Viewer',
  Editor = 'Editor',
  Admin = 'Admin',
}

export interface DashboardAclDTO {
  id?: number;
  dashboardId?: number;
  userId?: number;
  userLogin?: string;
  userEmail?: string;
  teamId?: number;
  team?: string;
  permission?: PermissionLevel;
  role?: OrgRole;
  icon?: string;
  inherited?: boolean;
}

export interface DashboardAclUpdateDTO {
  userId: number;
  teamId: number;
  role: OrgRole;
  permission: PermissionLevel;
}

export interface DashboardAcl {
  id?: number;
  dashboardId?: number;
  userId?: number;
  userLogin?: string;
  userEmail?: string;
  teamId?: number;
  team?: string;
  permission?: PermissionLevel;
  role?: OrgRole;
  icon?: string;
  name?: string;
  inherited?: boolean;
  sortRank?: number;
  userAvatarUrl?: string;
  teamAvatarUrl?: string;
}

export interface DashboardPermissionInfo {
  value: PermissionLevel;
  label: string;
  description: string;
}

export interface NewDashboardAclItem {
  teamId: number;
  userId: number;
  role?: OrgRole;
  permission: PermissionLevel;
  type: AclTarget;
}

export enum PermissionLevel {
  View = 1,
  Edit = 2,
  Admin = 4,
}

export enum DataSourcePermissionLevel {
  Query = 1,
  Admin = 2,
}

export enum AclTarget {
  Team = 'Team',
  User = 'User',
  Viewer = 'Viewer',
  Editor = 'Editor',
}

export interface AclTargetInfo {
  value: AclTarget;
  text: string;
}

export const dataSourceAclLevels = [
  { value: DataSourcePermissionLevel.Query, label: '查询', description: '能够查询数据源.' },
];

export const dashboardAclTargets: AclTargetInfo[] = [
  { value: AclTarget.Team, text: '团队' },
  { value: AclTarget.User, text: '用户' },
  { value: AclTarget.Viewer, text: '每个用户都拥有自己的角色' },
  { value: AclTarget.Editor, text: '每个用户都拥有自己的角色' },
];

export const dashboardPermissionLevels: DashboardPermissionInfo[] = [
  { value: PermissionLevel.View, label: 'View', description: '查看仪表板权限.' },
  { value: PermissionLevel.Edit, label: 'Edit', description: '增删改仪表版的权限.' },
  {
    value: PermissionLevel.Admin,
    label: 'Admin',
    description: '拥有 添加/移除权限和添加权限, 编辑和删除仪表板的权限.',
  },
];

export enum TeamPermissionLevel {
  Member = 0,
  Admin = 4,
}

export interface TeamPermissionInfo {
  value: TeamPermissionLevel;
  label: string;
  description: string;
}

export const teamsPermissionLevels: TeamPermissionInfo[] = [
  { value: TeamPermissionLevel.Member, label: '成员', description: '是团队成员' },
  {
    value: TeamPermissionLevel.Admin,
    label: 'Admin',
    description: '可以添加/删除权限，成员和删除团队.',
  },
];
