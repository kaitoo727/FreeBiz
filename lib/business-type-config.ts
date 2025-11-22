import { BusinessType } from '@/types';

// 事業タイプ別の表示設定
export interface BusinessTypeConfig {
  showInventory: boolean; // 在庫管理を表示するか
  showProjects: boolean; // 案件管理を表示するか
  revenueFields: {
    showPlatform: boolean; // プラットフォーム選択を表示するか
    showItemId: boolean; // 商品IDを表示するか
    showProjectId: boolean; // 案件IDを表示するか
  };
  defaultCategories: string[]; // デフォルトのカテゴリ
}

export const businessTypeConfigs: Record<BusinessType, BusinessTypeConfig> = {
  retail: {
    showInventory: true,
    showProjects: false,
    revenueFields: {
      showPlatform: true,
      showItemId: true,
      showProjectId: false,
    },
    defaultCategories: ['商品販売', '手数料収入', 'その他'],
  },
  service: {
    showInventory: false,
    showProjects: true,
    revenueFields: {
      showPlatform: false,
      showItemId: false,
      showProjectId: true,
    },
    defaultCategories: ['サービス提供', 'コンサルティング', 'その他'],
  },
  creative: {
    showInventory: false,
    showProjects: true,
    revenueFields: {
      showPlatform: false,
      showItemId: false,
      showProjectId: true,
    },
    defaultCategories: ['デザイン', '動画編集', 'Web制作', 'その他'],
  },
  consulting: {
    showInventory: false,
    showProjects: true,
    revenueFields: {
      showPlatform: false,
      showItemId: false,
      showProjectId: true,
    },
    defaultCategories: ['コンサルティング', 'コーチング', 'その他'],
  },
  custom: {
    showInventory: false,
    showProjects: false,
    revenueFields: {
      showPlatform: false,
      showItemId: false,
      showProjectId: false,
    },
    defaultCategories: ['売上', 'その他'],
  },
};

