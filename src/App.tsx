import { useState, useEffect } from 'react';
import { ActiveTab, UserProfile } from './types';
import { getTodayKST, getDefaultSelectedDate } from './utils/dateUtils';
import { generateMealsForWeek } from './data/mockMeals';

import AppHeader from './components/AppHeader';
import BottomNavBar from './components/BottomNavBar';
import HomeScreen from './components/HomeScreen';
import MenuScreen from './components/MenuScreen';
import NutritionScreen from './components/NutritionScreen';
import ProfileScreen from './components/ProfileScreen';

export default function App() {
  // 1. 오늘 날짜 KST 자동 계산
  const [today] = useState(() => getTodayKST());
  
  // 2. 오늘 날짜가 주말이면 다음 월요일을 주간 식단 기본 선택일로 계산
  const [defaultSelectedDate] = useState(() => getDefaultSelectedDate(today));

  // 3. 실행 시점 주간 식단 자동 생성 (한 번 생성 후 고정 유지)
  const [meals] = useState(() => generateMealsForWeek(today));

  // 4. 활성화된 탭 상태관리 (초기값: 'home')
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');

  // 5. 학생 프로필 및 알레르기 글로벌 상태관리 (기본값 설정 및 LocalStorage 유지)
  const [profile, setProfile] = useState<UserProfile>(() => {
    const cached = localStorage.getItem('cmassStudentProfile');
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch (e) {
        // 복구 대체 기본값
      }
    }
    return {
      name: '김학생',
      grade: 2,
      classNum: 3,
      studentNum: 15,
      allergies: ['우유', '땅콩'], // 기본 경고 알레르기 유발 물질
      allergyNotification: true,
      dailyNotification: true
    };
  });

  // 프로필 상태 쉐도잉 저장
  useEffect(() => {
    localStorage.setItem('cmassStudentProfile', JSON.stringify(profile));
  }, [profile]);

  // 알레르기 원클릭 추가 및 제거 핸들러
  const handleToggleAllergy = (allergen: string) => {
    setProfile(prev => {
      const nextAllergies = prev.allergies.includes(allergen)
        ? prev.allergies.filter(a => a !== allergen)
        : [...prev.allergies, allergen];
      return {
        ...prev,
        allergies: nextAllergies
      };
    });
  };

  // 알레르기 대량 일괄 초기화 핸들러
  const handleClearAllergies = () => {
    setProfile(prev => ({
      ...prev,
      allergies: []
    }));
  };

  // 학생 프로필 수정 후 상태 전파 저수준 핸들러
  const handleUpdateProfile = (updatedProfile: UserProfile) => {
    setProfile(updatedProfile);
  };

  // 탭 변경 시 스크롤 최상단 이동 공통 처리
  const handleTabChange = (tab: ActiveTab) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  // 현재 탭 별 화면 렌더링 매핑
  const renderActiveScreen = () => {
    switch (activeTab) {
      case 'home':
        return (
          <HomeScreen
            today={today}
            meals={meals}
            userAllergies={profile.allergies}
            onNavigateToTab={handleTabChange}
          />
        );
      case 'menu':
        return (
          <MenuScreen
            today={today}
            meals={meals}
            defaultSelectedDate={defaultSelectedDate}
            userAllergies={profile.allergies}
          />
        );
      case 'nutrition':
        return (
          <NutritionScreen
            today={today}
            meals={meals}
            userAllergies={profile.allergies}
          />
        );
      case 'profile':
        return (
          <ProfileScreen
            profile={profile}
            userAllergies={profile.allergies}
            onToggleAllergy={handleToggleAllergy}
            onClearAllergies={handleClearAllergies}
            onUpdateProfile={handleUpdateProfile}
          />
        );
      default:
        return (
          <HomeScreen
            today={today}
            meals={meals}
            userAllergies={profile.allergies}
            onNavigateToTab={handleTabChange}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#fcf9f1] text-[#1c1c17] flex flex-col items-center select-none antialiased">
      {/* 고정 앱 상단 바 */}
      <AppHeader 
        title="씨마스고등학교 급식" 
        onNotificationClick={() => handleTabChange('profile')} 
      />

      {/* 내부 기기 뷰포트 규격 제한 컨테이너 */}
      <main className="w-full max-w-[420px] bg-[#fcf9f1] min-h-screen relative pb-24 pt-20 px-[20px] shadow-[0_4px_32px_rgba(79,111,0,0.03)] border-x border-[#ebe8e0]/60">
        
        {/* 실시간 탭 전환 애니메이션 및 화면 출력 */}
        <div className="w-full transition-opacity duration-200">
          {renderActiveScreen()}
        </div>

        {/* 고정 하단 탭 내비게이션 바 */}
        <BottomNavBar 
          activeTab={activeTab} 
          onChangeTab={handleTabChange} 
        />
        
      </main>
    </div>
  );
}
