import { useState, useEffect } from 'react';
import { Calendar, AlertTriangle } from 'lucide-react';
import { MealData } from '../types';
import { 
  getWeekDates, 
  getWeekOfMonth, 
  formatDateKey, 
  getKoreanDayOfWeek 
} from '../utils/dateUtils';

interface MenuScreenProps {
  today: Date;
  meals: MealData[];
  defaultSelectedDate: Date;
  userAllergies: string[];
}

export default function MenuScreen({ today, meals, defaultSelectedDate, userAllergies }: MenuScreenProps) {
  // 현재 선택된 주간 식단의 날짜 (초기값: 기본선택 날짜)
  const [selectedDate, setSelectedDate] = useState<Date>(defaultSelectedDate);
  const selectedDateKey = formatDateKey(selectedDate);
  
  // 기준 날짜를 통해 이번주 월~금요일 Date 리스트 구하기
  const weekDates = getWeekDates(today);

  // 선택된 날짜에 매칭되는 중식과 석식 추출
  const selectedLunch = meals.find(m => m.dateKey === selectedDateKey && m.mealType === '중식');
  const selectedDinner = meals.find(m => m.dateKey === selectedDateKey && m.mealType === '석식');

  // 현재 월/주차 정보 계산
  const weekOfMonthStr = getWeekOfMonth(selectedDate);

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  return (
    <div className="flex flex-col gap-5 animate-fade-in animate-duration-150">
      {/* Section Header */}
      <section className="flex flex-col gap-1 px-1">
        <span className="text-sm font-bold text-[#536500] tracking-wide">주간 식단</span>
        <h2 className="text-2xl font-bold text-[#1c1c17] tracking-tight">{weekOfMonthStr}</h2>
      </section>

      {/* WeekDateSelector (월~금 단추) */}
      <nav aria-label="Date selection" className="flex justify-between items-center bg-[#f6f3eb] rounded-2xl p-2.5 shadow-[0_4px_12px_rgba(79,111,0,0.02)] border border-[#e5e2db]/30">
        {weekDates.map((date, idx) => {
          const isSelected = formatDateKey(date) === selectedDateKey;
          const isCurrentToday = formatDateKey(date) === formatDateKey(today);
          const dayName = getKoreanDayOfWeek(date);
          const dayNum = date.getDate();

          return (
            <button
              key={idx}
              onClick={() => handleDateSelect(date)}
              className={`flex flex-col items-center justify-center py-2 px-3 min-w-[56px] rounded-xl transition-all duration-200 cursor-pointer ${
                isSelected
                  ? 'bg-[#3c5500] text-white shadow-md scale-95 font-bold'
                  : 'text-[#444939] hover:bg-[#e5e2db] hover:text-[#1c1c17]'
              }`}
              id={`menu-date-btn-${formatDateKey(date)}`}
            >
              <span className={`text-xs font-semibold mb-1 ${isSelected ? 'text-white/80' : 'text-[#747967]'}`}>{dayName}</span>
              <span className="text-base font-bold">{dayNum}</span>
              {isCurrentToday && !isSelected && (
                <span className="absolute bottom-1 w-1 h-1 rounded-full bg-[#3c5500]"></span>
              )}
            </button>
          );
        })}
      </nav>

      {/* 식단 카드 목록 */}
      <div className="flex flex-col gap-4">
        {/* 중식 카드 */}
        {selectedLunch ? (
          <article className="bg-white rounded-[24px] p-5 shadow-[0_4px_16px_rgba(79,111,0,0.04)] border border-[#e5e2db]/30 transition-all duration-300">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-bold text-[#3c5500]">중식</h3>
              <span className="text-xs font-bold text-[#536500] px-3 py-1 bg-[#d2ea7a]/50 text-[#576a00] rounded-full">
                {selectedLunch.totalCalories} kcal
              </span>
            </div>
            
            <p className="text-[#1c1c17] text-[15px] font-medium leading-relaxed mb-4">
              {selectedLunch.dishes.join(', ')}
            </p>

            {/* 알레르기 태그 분석 */}
            <div className="flex flex-wrap gap-1.5 mb-5">
              {selectedLunch.allergens.map((allergen, idx) => {
                const isWarning = userAllergies.includes(allergen);
                return (
                  <span 
                    key={idx} 
                    className={`px-2 py-0.5 rounded text-xs font-semibold ${
                      isWarning ? 'bg-[#ffdad6] text-[#ba1a1a] flex items-center gap-1 border border-[#ba1a1a]/10' : 'bg-[#ffe7dd] text-[#2a241a]'
                    }`}
                  >
                    {isWarning && <AlertTriangle className="w-3 h-3 text-[#ba1a1a]" />}
                    {allergen}
                  </span>
                );
              })}
            </div>

            {/* 단백질 달성률 게이지 바 */}
            <div className="space-y-2 pt-2 border-t border-[#f1eee6]">
              <div className="flex justify-between items-center">
                <span className="text-xs text-[#747967] font-semibold">단백질 권장량 달성률</span>
                <span className="text-xs text-[#3c5500] font-bold">{selectedLunch.proteinTargetRate}%</span>
              </div>
              <div className="h-2 w-full bg-[#dde8b2] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#3c5500] rounded-full transition-all duration-500" 
                  style={{ width: `${selectedLunch.proteinTargetRate}%` }}
                ></div>
              </div>
            </div>
          </article>
        ) : (
          <div className="bg-white rounded-2xl p-8 text-center border border-dashed border-[#c4c9b4] text-[#747967]">
            해당 일자의 중식 급식 정보가 준비 중입니다.
          </div>
        )}

        {/* 석식 카드 */}
        {selectedDinner ? (
          <article className="bg-white rounded-[24px] p-5 shadow-[0_4px_16px_rgba(79,111,0,0.04)] border border-[#e5e2db]/30 transition-all duration-300">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-bold text-[#3c5500]">석식</h3>
              <span className="text-xs font-bold text-[#536500] px-3 py-1 bg-[#d2ea7a]/50 text-[#576a00] rounded-full">
                {selectedDinner.totalCalories} kcal
              </span>
            </div>
            
            <p className="text-[#1c1c17] text-[15px] font-medium leading-relaxed mb-4">
              {selectedDinner.dishes.join(', ')}
            </p>

            {/* 알레르기 태그 점검 */}
            <div className="flex flex-wrap gap-1.5 mb-5">
              {selectedDinner.allergens.map((allergen, idx) => {
                const isWarning = userAllergies.includes(allergen);
                return (
                  <span 
                    key={idx} 
                    className={`px-2 py-0.5 rounded text-xs font-semibold ${
                      isWarning ? 'bg-[#ffdad6] text-[#ba1a1a] flex items-center gap-1 border border-[#ba1a1a]/10' : 'bg-[#ffe7dd] text-[#2a241a]'
                    }`}
                  >
                    {isWarning && <AlertTriangle className="w-3 h-3 text-[#ba1a1a]" />}
                    {allergen}
                  </span>
                );
              })}
            </div>

            {/* 단백질 달성률 바 */}
            <div className="space-y-2 pt-2 border-t border-[#f1eee6]">
              <div className="flex justify-between items-center">
                <span className="text-xs text-[#747967] font-semibold">단백질 권장량 달성률</span>
                <span className="text-xs text-[#3c5500] font-bold">{selectedDinner.proteinTargetRate}%</span>
              </div>
              <div className="h-2 w-full bg-[#dde8b2] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#3c5500] rounded-full transition-all duration-500" 
                  style={{ width: `${selectedDinner.proteinTargetRate}%` }}
                ></div>
              </div>
            </div>
          </article>
        ) : (
          <div className="bg-white rounded-2xl p-8 text-center border border-dashed border-[#c4c9b4] text-[#747967]">
            해당 일자의 석식 급식 정보가 준비 중입니다.
          </div>
        )}
      </div>
    </div>
  );
}
