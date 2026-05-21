import { useState, useEffect } from 'react';
import { 
  Calculator, 
  CheckCircle, 
  Circle, 
  Sparkles, 
  Award,
  AlertTriangle 
} from 'lucide-react';
import { MealData, SelectableDishItem } from '../types';
import { getSelectableDishItemsForMeal } from '../data/mockMeals';

interface NutritionScreenProps {
  today: Date;
  meals: MealData[];
  userAllergies: string[];
}

export default function NutritionScreen({ today, meals, userAllergies }: NutritionScreenProps) {
  // 오늘 날짜 구하기 (주말이면 월요일 식단으로 유도)
  const isWeekend = today.getDay() === 0 || today.getDay() === 6;
  const todayYear = today.getFullYear();
  const todayMonth = String(today.getMonth() + 1).padStart(2, '0');
  const todayDay = String(today.getDate()).padStart(2, '0');
  const todayDateKey = `${todayYear}${todayMonth}${todayDay}`;

  let targetMeal = meals.find(m => m.dateKey === todayDateKey && m.mealType === '중식');
  if (isWeekend || !targetMeal) {
    targetMeal = meals.find(m => m.mealType === '중식');
  }

  // 선택지 리스트 빌드
  const [selectableItems, setSelectableItems] = useState<SelectableDishItem[]>([]);
  const [checkedIds, setCheckedIds] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('전체');
  const [saveSuccessMessage, setSaveSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (targetMeal) {
      const items = getSelectableDishItemsForMeal(targetMeal);
      setSelectableItems(items);
      // 첫 진입 시 기본값으로 '밥'과 '반찬/국' 메이저 항목들 자동 선택 설정
      setCheckedIds(items.map(i => i.id));
    }
  }, [targetMeal]);

  const handleToggleItem = (id: string) => {
    setCheckedIds(prev => 
      prev.includes(id) 
        ? prev.filter(itemId => itemId !== id) 
        : [...prev, id]
    );
  };

  // 선택된 총 영양성분 값 산출
  const selectedItems = selectableItems.filter(item => checkedIds.includes(item.id));
  
  const totalKcal = selectedItems.reduce((sum, item) => sum + item.kcal, 0);
  const totalProtein = selectedItems.reduce((sum, item) => sum + item.nutrition.protein, 0);
  const totalCarb = selectedItems.reduce((sum, item) => sum + item.nutrition.carb, 0);
  const totalFat = selectedItems.reduce((sum, item) => sum + item.nutrition.fat, 0);

  // 권장 섭취 기준 타겟 설정 (식사당: 탄수화물 130g, 단백질 30g, 지방 25g 가이드라인)
  const targetCarb = 130;
  const targetProtein = 35;
  const targetFat = 25;

  const carbPercent = Math.min(100, Math.round((totalCarb / targetCarb) * 100));
  const proteinPercent = Math.min(100, Math.round((totalProtein / targetProtein) * 100));
  const fatPercent = Math.min(100, Math.round((totalFat / targetFat) * 100));

  // 카테고리별 필터링
  const filteredItems = activeCategory === '전체' 
    ? selectableItems 
    : selectableItems.filter(item => item.category === activeCategory);

  const handleSaveResult = () => {
    setSaveSuccessMessage(`📝 총 ${totalKcal}kcal의 식단 영양 성분이 '나의 피드'에 안전하게 저장되었습니다!`);
    setTimeout(() => {
      setSaveSuccessMessage(null);
    }, 3500);
  };

  return (
    <div className="flex flex-col gap-5 pb-16 animate-fade-in animate-duration-150">
      {/* Toast 저장 성공 모달 */}
      {saveSuccessMessage && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 bg-[#3c5500] text-white px-5 py-3 rounded-2xl text-xs font-bold shadow-xl flex items-center gap-2 max-w-[340px] text-center border border-[#c9f07c]/30 animate-bounce">
          <Sparkles className="w-4 h-4 text-[#c9f07c] flex-shrink-0 animate-spin" />
          <span>{saveSuccessMessage}</span>
        </div>
      )}

      {/* Nutrition Summary Card (선택 영양 요약 판넬) */}
      <section className="bg-white rounded-[24px] p-5 shadow-[0_4px_24px_rgba(79,111,0,0.04)] border border-[#e5e2db]/30">
        <div className="mb-4">
          <h2 className="text-xl font-bold text-[#1c1c17] tracking-tight">오늘의 선택 영양</h2>
          <p className="text-xs text-[#747967] mt-1 font-medium">선택된 식자재들의 동적 실시간 영양성분입니다.</p>
        </div>

        <div className="flex items-baseline mb-5 bg-[#f6f3eb]/50 p-4 rounded-2xl border border-[#e5e2db]/20">
          <span className="text-4xl font-extrabold text-[#3c5500] mr-1.5 transition-all duration-300">
            {totalKcal}
          </span>
          <span className="text-sm font-bold text-[#3c5500]">kcal</span>
          <span className="ml-[12%] text-[11px] text-[#747967] flex items-center gap-1 font-semibold">
            <Award className="w-3.5 h-3.5 text-[#536500]" />
            성장기 청소년 1식 최적 영양 설계
          </span>
        </div>

        <div className="space-y-4">
          {/* 단백질 */}
          <div>
            <div className="flex justify-between items-end mb-1 px-0.5">
              <span className="text-xs font-bold text-[#1c1c17]">단백질 (권장 {targetProtein}g)</span>
              <span className="text-xs font-semibold text-[#444939]">{totalProtein}g</span>
            </div>
            <div className="h-2 w-full bg-[#dde8b2] rounded-full overflow-hidden">
              <div 
                className="h-full bg-[#3c5500] rounded-full transition-all duration-300" 
                style={{ width: `${proteinPercent}%` }}
              ></div>
            </div>
          </div>

          {/* 탄수화물 */}
          <div>
            <div className="flex justify-between items-end mb-1 px-0.5">
              <span className="text-xs font-bold text-[#1c1c17]">탄수화물 (권장 {targetCarb}g)</span>
              <span className="text-xs font-semibold text-[#444939]">{totalCarb}g</span>
            </div>
            <div className="h-2 w-full bg-[#dde8b2] rounded-full overflow-hidden">
              <div 
                className="h-full bg-[#3c5500] rounded-full transition-all duration-300" 
                style={{ width: `${carbPercent}%` }}
              ></div>
            </div>
          </div>

          {/* 지방 */}
          <div>
            <div className="flex justify-between items-end mb-1 px-0.5">
              <span className="text-xs font-bold text-[#1c1c17]">지방 (권장 {targetFat}g)</span>
              <span className="text-xs font-semibold text-[#444939]">{totalFat}g</span>
            </div>
            <div className="h-2 w-full bg-[#dde8b2] rounded-full overflow-hidden">
              <div 
                className="h-full bg-[#3c5500] rounded-full transition-all duration-300" 
                style={{ width: `${fatPercent}%` }}
              ></div>
            </div>
          </div>
        </div>
      </section>

      {/* Menu Filter Chips */}
      <div className="flex overflow-x-auto gap-2 no-scrollbar py-1">
        {['전체', '밥류', '국/찌개', '반찬', '디저트'].map((cat, idx) => {
          const isSelected = activeCategory === cat;
          return (
            <button
              key={idx}
              onClick={() => setActiveCategory(cat)}
              className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-bold shadow-sm cursor-pointer transition-all duration-150 ${
                isSelected 
                  ? 'bg-[#3c5500] text-white' 
                  : 'bg-[#f1eee6] text-[#444939] hover:bg-[#ebe8e0]'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Selectable Menu List */}
      <div className="space-y-3">
        {filteredItems.map((item) => {
          const isChecked = checkedIds.includes(item.id);
          const rawAllergen = item.allergenTag?.replace(' 함유', '') || '';
          const hasAllergyWarning = rawAllergen && userAllergies.includes(rawAllergen);

          return (
            <div
              key={item.id}
              onClick={() => handleToggleItem(item.id)}
              className={`rounded-2xl p-4 cursor-pointer relative shadow-sm transition-all duration-150 border-2 select-none ${
                isChecked
                  ? 'bg-white border-[#3c5500]'
                  : 'bg-white border-[#e5e2db] hover:bg-[#f6f3eb]/40'
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1 pr-6">
                  <h3 className={`text-[15px] font-bold ${isChecked ? 'text-[#3c5500]' : 'text-[#1c1c17]'}`}>
                    {item.name}
                  </h3>
                  <div className="flex items-center space-x-2 mt-1 px-0.5">
                    <span className="text-xs font-bold text-[#536500]">{item.kcal} kcal</span>
                    <span className="w-1 h-1 rounded-full bg-[#c4c9b4]"></span>
                    <span className="text-xs text-[#747967] font-semibold">{item.details}</span>
                    
                    {/* 실시간 알레르기 수식어 매칭 뱃지 */}
                    {item.allergenTag && (
                      <>
                        <span className="w-1 h-1 rounded-full bg-[#c4c9b4]"></span>
                        <span 
                          className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold flex items-center gap-0.5 ${
                            hasAllergyWarning 
                              ? 'bg-[#ffdad6] text-[#ba1a1a] animate-pulse' 
                              : 'bg-[#ffe7dd] text-[#2a241a]'
                          }`}
                        >
                          {hasAllergyWarning && <AlertTriangle className="w-2.5 h-2.5 text-[#ba1a1a]" />}
                          {item.allergenTag}
                        </span>
                      </>
                    )}
                  </div>
                </div>
                
                <div className="flex-shrink-0 mt-0.5">
                  {isChecked ? (
                    <CheckCircle className="w-5.5 h-5.5 text-[#3c5500] fill-none stroke-[2.5px]" />
                  ) : (
                    <Circle className="w-5.5 h-5.5 text-[#c4c9b4] stroke-[2px]" />
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {filteredItems.length === 0 && (
          <div className="bg-white rounded-2xl p-8 text-center border border-dashed border-[#c4c9b4] text-[#747967]">
            '{activeCategory}' 카테고리에 속하는 반찬이 이번 식단에는 구성되어 있지 않습니다.
          </div>
        )}
      </div>

      {/* 계산 결과 저장하기 버튼 영역 */}
      <div className="mt-4 pb-12">
        <button
          onClick={handleSaveResult}
          disabled={checkedIds.length === 0}
          className={`w-full py-4 rounded-xl text-sm font-bold shadow-md cursor-pointer transition-all active:scale-95 text-center ${
            checkedIds.length === 0 
              ? 'bg-[#e5e2db] text-[#747967] cursor-not-allowed'
              : 'bg-[#3c5500] text-white shadow-[0_4px_12px_rgba(79,111,0,0.15)] hover:bg-[#536500]'
          }`}
        >
          계산 결과 저장하기
        </button>
      </div>
    </div>
  );
}
