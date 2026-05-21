import React, { useState, useEffect } from 'react';
import { Heart, Sun, Moon, Flame, Info, AlertTriangle } from 'lucide-react';
import { MealData } from '../types';
import { formatKoreanDate } from '../utils/dateUtils';

interface HomeScreenProps {
  today: Date;
  meals: MealData[];
  userAllergies: string[];
  onNavigateToTab: (tab: 'menu' | 'nutrition' | 'profile') => void;
}

export default function HomeScreen({ today, meals, userAllergies, onNavigateToTab }: HomeScreenProps) {
  const [isFavorite, setIsFavorite] = useState(() => {
    return localStorage.getItem('isCheeseTonkatsuFavorite') === 'true';
  });

  const isWeekend = today.getDay() === 0 || today.getDay() === 6;

  // 오늘 날짜 문자열 키 구하기
  const todayYear = today.getFullYear();
  const todayMonth = String(today.getMonth() + 1).padStart(2, '0');
  const todayDay = String(today.getDate()).padStart(2, '0');
  const todayDateKey = `${todayYear}${todayMonth}${todayDay}`;

  // 날짜에 맞는 급식 찾기
  let todayLunch = meals.find(m => m.dateKey === todayDateKey && m.mealType === '중식');
  let todayDinner = meals.find(m => m.dateKey === todayDateKey && m.mealType === '석식');

  const [displayInfoStr, setDisplayInfoStr] = useState('');
  const [isNextMeal, setIsNextMeal] = useState(false);

  // 주말 처리 (방식 B: 가장 가까운 월요일 식단을 보여주고 '다음 급식일' 배지 표시)
  if (isWeekend || !todayLunch) {
    // 가장 먼저 나오는 식단(일반적으로 월요일)을 대신 가져옵니다
    const firstAvailableLunch = meals.find(m => m.mealType === '중식');
    const firstAvailableDinner = meals.find(m => m.mealType === '석식');
    if (firstAvailableLunch && firstAvailableDinner) {
      todayLunch = firstAvailableLunch;
      todayDinner = firstAvailableDinner;
    }
  }

  useEffect(() => {
    if (isWeekend) {
      setIsNextMeal(true);
      if (todayLunch) {
        setDisplayInfoStr(`다음 급식일 (${todayLunch.dayOfWeek}요일) 식단`);
      } else {
        setDisplayInfoStr('다음 급식일 식단');
      }
    } else {
      setIsNextMeal(false);
      setDisplayInfoStr(formatKoreanDate(today));
    }
  }, [isWeekend, today, todayLunch]);

  const handleFavoriteToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextFavState = !isFavorite;
    setIsFavorite(nextFavState);
    localStorage.setItem('isCheeseTonkatsuFavorite', String(nextFavState));
  };

  // 알레르기 점검 함수
  const getMatchingAllergens = (itemAllergens: string[]) => {
    return itemAllergens.filter(allergen => userAllergies.includes(allergen));
  };

  return (
    <div className="flex flex-col gap-5">
      {/* 주말 알림 안내 배너 */}
      {isWeekend && (
        <div className="bg-[#dde8b2] text-[#485229] px-4 py-3 rounded-xl text-xs font-semibold flex items-center gap-2.5 shadow-sm border border-[#c1cc98]/40 animate-fade-in animate-duration-150">
          <Info className="w-4.5 h-4.5 flex-shrink-0 text-[#3c5500]" />
          <span>오늘은 주말이므로 <strong>다음 급식일(월요일)</strong>의 식단을 미리 확인하세요.</span>
        </div>
      )}

      {/* 대표 맛있는 급식 히어로 카드 */}
      {todayLunch && (
        <section className="bg-white rounded-[24px] overflow-hidden shadow-[0_4px_20px_rgba(79,111,0,0.04)] relative group border border-[#e5e2db]/30 transition-all duration-300">
          <div className="h-52 w-full bg-[#e5e2db] relative overflow-hidden">
            <img 
              alt={todayLunch.title} 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCk0MiOka8WFPZ70VS-Ft1WplOavA2OJnCC9XI6MIetlnBSw81Dn5F0N8BFJnw63OSlQFOZVAyovkEa2Bw6GylcCmYuZox6Q8gok4lRE-O4xqCe_jrDuj7vbPs_uiwdKGU_kgsmRBQLvgkYL5HnIY3xlSwEKIz9Sxy4FS97Oe1EttQBswzsuuSTD0k4ZxYW6DAXjON90PssXJhEuTVcpFlI3kJEg8FmNVuIyoLrPH_Y57zg_xGa2SodERoypij9D5vB5ch8GNOpt9Jq"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1c1c17]/60 via-[#1c1c17]/10 to-transparent"></div>
            
            {/* 상단 뱃지 */}
            <div className="absolute top-4 left-4 flex gap-1.5 items-center z-10">
              <span className="bg-[#3c5500] text-white px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                오늘의 추천 급식
              </span>
              {isNextMeal && (
                <span className="bg-[#ba1a1a] text-white px-2.5 py-1 rounded-full text-xs font-bold shadow-sm flex items-center gap-1">
                  다음 급식일
                </span>
              )}
            </div>

            {/* Favorite 찜하기 버튼 */}
            <button 
              onClick={handleFavoriteToggle}
              className="absolute top-4 right-4 bg-black/20 backdrop-blur-md p-2 rounded-full cursor-pointer hover:bg-black/40 transition-all z-10"
              id="hero-meal-favorite-btn"
            >
              <Heart 
                className={`w-5 h-5 transition-colors ${isFavorite ? 'text-[#ba1a1a] fill-[#ba1a1a]' : 'text-white'}`} 
              />
            </button>
          </div>
          
          <div className="p-5">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs text-[#747967] font-semibold tracking-wider mb-1">{displayInfoStr}</p>
                <h2 className="text-xl font-bold text-[#1c1c17] leading-tight group-hover:text-[#3c5500] transition-colors">
                  {todayLunch.title}
                </h2>
              </div>
              <div className="bg-[#d2ea7a] text-[#576a00] px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 flex-shrink-0">
                <Flame className="w-4.5 h-4.5 text-[#3c5500]" />
                <span>{todayLunch.totalCalories} kcal</span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 중식 및 석식 상세 카드 */}
      <div className="flex flex-col gap-4">
        {/* 중식 카드 */}
        {todayLunch && (
          <section 
            onClick={() => onNavigateToTab('nutrition')}
            className="bg-white rounded-[24px] p-5 shadow-[0_4px_16px_rgba(79,111,0,0.04)] hover:scale-[0.99] border border-[#e5e2db]/30 cursor-pointer transition-all duration-200"
          >
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#dde8b2] flex items-center justify-center text-[#171e00]">
                  <Sun className="w-4.5 h-4.5 text-[#3c5500]" />
                </div>
                <h3 className="text-lg font-bold text-[#1c1c17]">중식</h3>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-semibold text-[#747967]">{todayLunch.totalCalories} kcal</span>
                {isNextMeal && (
                  <span className="text-[10px] bg-[#ba1a1a]/10 text-[#ba1a1a] px-1.5 py-0.5 rounded font-bold">다음</span>
                )}
              </div>
            </div>
            
            <p className="text-[#444939] text-[15px] leading-relaxed mb-4 font-medium">
              {todayLunch.dishes.join(', ')}
            </p>

            {/* 알레르기 점검 태그 */}
            <div className="flex flex-wrap gap-1.5">
              {todayLunch.allergens.map((allergen, idx) => {
                const isWarning = userAllergies.includes(allergen);
                return (
                  <span 
                    key={idx} 
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 ${
                      isWarning 
                        ? 'bg-[#ffdad6] text-[#ba1a1a] border border-[#ba1a1a]/20 animate-pulse' 
                        : 'bg-[#ffe7dd] text-[#2a241a]'
                    }`}
                  >
                    {isWarning && <AlertTriangle className="w-3.5 h-3.5 text-[#ba1a1a] flex-shrink-0" />}
                    {allergen}
                  </span>
                );
              })}
            </div>
          </section>
        )}

        {/* 석식 카드 */}
        {todayDinner && (
          <section 
            onClick={() => onNavigateToTab('menu')}
            className="bg-white rounded-[24px] p-5 shadow-[0_4px_16px_rgba(79,111,0,0.04)] hover:scale-[0.99] border border-[#e5e2db]/30 cursor-pointer transition-all duration-200"
          >
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#e5e2db] flex items-center justify-center text-[#444939]">
                  <Moon className="w-4.5 h-4.5 text-[#444939]" />
                </div>
                <h3 className="text-lg font-bold text-[#1c1c17]">석식</h3>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-semibold text-[#747967]">{todayDinner.totalCalories} kcal</span>
                {isNextMeal && (
                  <span className="text-[10px] bg-[#ba1a1a]/10 text-[#ba1a1a] px-1.5 py-0.5 rounded font-bold">다음</span>
                )}
              </div>
            </div>

            <p className="text-[#444939] text-[15px] leading-relaxed mb-4 font-medium">
              {todayDinner.dishes.join(', ')}
            </p>

            {/* 알레르기 태그 */}
            <div className="flex flex-wrap gap-1.5">
              {todayDinner.allergens.map((allergen, idx) => {
                const isWarning = userAllergies.includes(allergen);
                return (
                  <span 
                    key={idx} 
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 ${
                      isWarning 
                        ? 'bg-[#ffdad6] text-[#ba1a1a] border border-[#ba1a1a]/20 animate-pulse' 
                        : 'bg-[#ffe7dd] text-[#2a241a]'
                    }`}
                  >
                    {isWarning && <AlertTriangle className="w-3.5 h-3.5 text-[#ba1a1a] flex-shrink-0" />}
                    {allergen}
                  </span>
                );
              })}
              {todayDinner.allergens.length === 0 && (
                <span className="text-xs text-[#747967] italic">알레르기 유발 유발 정보가 없습니다.</span>
              )}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
