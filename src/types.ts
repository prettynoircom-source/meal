export type MealType = '중식' | '석식';

export interface MealNutrition {
  kcal: number;
  protein: number; // in grams
  carb: number;    // in grams
  fat: number;     // in grams
}

export interface MealData {
  id: string;
  schoolName: string;
  date: Date;
  dateKey: string;      // YYYYMMDD
  dayOfWeek: string;    // 월, 화, 수, 목, 금
  mealType: MealType;
  title: string;        // 대표 메뉴 이름 (예: 치즈돈까스 정식)
  dishes: string[];     // 전체 반찬 상세 리스트
  totalCalories: number;
  nutrition: MealNutrition;
  allergens: string[];
  proteinTargetRate: number; // 단백질 권장량 달성률 (%)
}

// Interactive item for the nutrition calculator screen
export interface SelectableDishItem {
  id: string;
  name: string;
  kcal: number;
  category: '밥류' | '국/찌개' | '반찬' | '디저트';
  details?: string; // 추가 영양 정보 (예: 탄수화물 60g, 식이섬유 3g 등)
  allergenTag?: string; // (예: 돼지고기 함유, 고등어 등)
  nutrition: {
    protein: number;
    carb: number;
    fat: number;
  };
}

export interface UserAllergy {
  name: string;
  isWarned: boolean;
}

export interface UserProfile {
  name: string;
  grade: number;
  classNum: number;
  studentNum: number;
  allergies: string[];
  allergyNotification: boolean;
  dailyNotification: boolean;
}

export type ActiveTab = 'home' | 'menu' | 'nutrition' | 'profile';
