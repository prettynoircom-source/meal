import React, { useState } from 'react';
import { 
  User, 
  Settings, 
  Bell, 
  ShieldAlert, 
  HelpCircle, 
  FileText, 
  LogOut, 
  ChevronRight, 
  PenTool, 
  Plus, 
  X,
  Sparkles,
  Heart
} from 'lucide-react';
import { UserProfile } from '../types';

interface ProfileScreenProps {
  profile: UserProfile;
  userAllergies: string[];
  onToggleAllergy: (allergen: string) => void;
  onClearAllergies: () => void;
  onUpdateProfile: (updated: UserProfile) => void;
}

export default function ProfileScreen({ 
  profile, 
  userAllergies, 
  onToggleAllergy, 
  onClearAllergies,
  onUpdateProfile 
}: ProfileScreenProps) {
  const [isAddingAllergy, setIsAddingAllergy] = useState(false);
  const [newAllergentInput, setNewAllergentInput] = useState('');
  
  // 프로필 편집 모드 상태관리
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editingName, setEditingName] = useState(profile.name);
  const [editingGrade, setEditingGrade] = useState(profile.grade);
  const [editingClassNum, setEditingClassNum] = useState(profile.classNum);
  const [editingStudentNum, setEditingStudentNum] = useState(profile.studentNum);

  // 알레르기 경고 알림 및 일일 식단 알림 로컬 토글 상태
  const [allergyNotification, setAllergyNotification] = useState(profile.allergyNotification);
  const [dailyNotification, setDailyNotification] = useState(profile.dailyNotification);

  // 상용 알레르기 유발 유발 물질 리스트
  const commonAllergenOptions = [
    '우유', '땅콩', '대두', '밀', '쇠고기', '돼지고기', '닭고기', '난류', '메밀', '고등어', '게', '새우', '아황산류', '호두', '조개류'
  ];

  const handleAllergyToggleLocal = (allergen: string) => {
    onToggleAllergy(allergen);
  };

  const handleCustomAllergyAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanTag = newAllergentInput.trim();
    if (cleanTag && !userAllergies.includes(cleanTag)) {
      onToggleAllergy(cleanTag);
      setNewAllergentInput('');
    }
  };

  const handleSaveProfile = () => {
    onUpdateProfile({
      ...profile,
      name: editingName,
      grade: Number(editingGrade),
      classNum: Number(editingClassNum),
      studentNum: Number(editingStudentNum),
      allergyNotification,
      dailyNotification
    });
    setIsEditingProfile(false);
  };

  const handleLogoutSimulate = () => {
    const confirmReset = window.confirm('정말 로그아웃 하시겠습니까? 설정을 초기화하고 첫 상태로 돌아갑니다.');
    if (confirmReset) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="flex flex-col gap-5 pb-16 animate-fade-in animate-duration-150">
      {/* Profile Card */}
      {!isEditingProfile ? (
        <section className="bg-gradient-to-br from-white to-[#dde8b2]/40 rounded-[24px] p-5 shadow-[0_8px_24px_rgba(79,111,0,0.04)] flex items-center justify-between border border-[#e5e2db]/30 hover:scale-[0.98] transition-all duration-200">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full overflow-hidden bg-[#e5e2db] shadow-inner flex-shrink-0 border-2 border-[#3c5500]/20">
              <img 
                alt="Student Profile Avatar" 
                className="w-full h-full object-cover" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBdDqEWJkfTN9JEmO2B2W2tlfz6Jct8ettZ5oIdjYL4YOa7QPlFouWA6L8kuwab5FB-_bACqCQFQqSPlNNmw2jlENPfML8p2Icq277T0g8jpp91-Au7gN-R_-KAJk8iO-gj--AnuCESMS_H3ACG1M2OwBu0O9ICmZ34OkNT1z_MJ2OsnIsuDRcQFlMgohl7DQoCf6P8uzV8TcocvKNFi_mN-bW_0l-ORdP1lcnsY8CmtFl5Apia1euu2MwxHbK3JYE_NQCKI4dbLwGU"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold text-[#1c1c17]">{profile.name}</span>
              <span className="text-xs text-[#747967] mt-1 font-semibold">{profile.grade}학년 {profile.classNum}반 {profile.studentNum}번</span>
            </div>
          </div>
          
          <button 
            onClick={() => setIsEditingProfile(true)}
            className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#3c5500] shadow-sm hover:bg-[#f1eee6] transition-colors cursor-pointer border border-[#e5e2db]/50"
            id="profile-edit-btn"
          >
            <PenTool className="w-4.5 h-4.5" />
          </button>
        </section>
      ) : (
        <section className="bg-white rounded-[24px] p-5 shadow-[0_8px_24px_rgba(79,111,0,0.06)] border border-[#3c5500]/20 flex flex-col gap-4">
          <h3 className="text-sm font-bold text-[#3c5500] border-b border-[#f1eee6] pb-2">학생 정보 수정</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-[#747967] mb-1">이름</label>
              <input 
                type="text" 
                value={editingName} 
                onChange={(e) => setEditingName(e.target.value)}
                className="w-full bg-[#f6f3eb] border border-[#c4c9b4] text-xs font-semibold rounded-lg p-2.5 outline-none focus:border-[#3c5500]"
              />
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-xs font-bold text-[#747967] mb-1">학년</label>
                <input 
                  type="number" 
                  value={editingGrade} 
                  onChange={(e) => setEditingGrade(Number(e.target.value))}
                  className="w-full bg-[#f6f3eb] border border-[#c4c9b4] text-xs font-semibold rounded-lg p-2.5 outline-none focus:border-[#3c5500]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#747967] mb-1">반</label>
                <input 
                  type="number" 
                  value={editingClassNum} 
                  onChange={(e) => setEditingClassNum(Number(e.target.value))}
                  className="w-full bg-[#f6f3eb] border border-[#c4c9b4] text-xs font-semibold rounded-lg p-2.5 outline-none focus:border-[#3c5500]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#747967] mb-1">번호</label>
                <input 
                  type="number" 
                  value={editingStudentNum} 
                  onChange={(e) => setEditingStudentNum(Number(e.target.value))}
                  className="w-full bg-[#f6f3eb] border border-[#c4c9b4] text-xs font-semibold rounded-lg p-2.5 outline-none focus:border-[#3c5500]"
                />
              </div>
            </div>
          </div>
          
          <div className="flex gap-2 justify-end pt-2">
            <button 
              onClick={() => setIsEditingProfile(false)}
              className="px-4 py-2 bg-[#f1eee6] text-[#444939] text-xs font-semibold rounded-lg cursor-pointer"
            >
              취소
            </button>
            <button 
              onClick={handleSaveProfile}
              className="px-4 py-2 bg-[#3c5500] text-white text-xs font-bold rounded-lg cursor-pointer"
            >
              저장
            </button>
          </div>
        </section>
      )}

      {/* Settings Section 1: Notifications & Preferences */}
      <div className="flex flex-col gap-3">
        <h2 className="text-xs font-bold text-[#3c5500] tracking-wide uppercase px-1">알림 및 맞춤형 설정</h2>
        
        {/* Allergy Settings Card */}
        <div className="bg-white rounded-[24px] p-5 shadow-[0_4px_20px_rgba(79,111,0,0.03)] border border-[#e5e2db]/30 flex flex-col gap-4">
          <div className="flex justify-between items-start">
            <div className="flex flex-col pr-4">
              <span className="text-[15px] font-bold text-[#1c1c17] mb-1">알레르기 실시간 경고</span>
              <span className="text-xs text-[#747967] font-medium leading-relaxed">식단표 및 급식 화면에 해당 물질 함유 시 빨간 경고 뱃지를 자동으로 표시합니다.</span>
            </div>
            
            {/* Toggle Switch */}
            <button 
              onClick={() => {
                const updated = !allergyNotification;
                setAllergyNotification(updated);
                onUpdateProfile({ ...profile, allergyNotification: updated });
              }}
              className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out outline-none focus:ring-2 focus:ring-[#3c5500] ${
                allergyNotification ? 'bg-[#3c5500]' : 'bg-[#e5e2db]'
              }`}
              id="allergy-warn-switch"
            >
              <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                allergyNotification ? 'translate-x-5' : 'translate-x-0'
              }`}></span>
            </button>
          </div>

          {/* 알레르기 태그 리스트 */}
          {allergyNotification && (
            <div className="flex flex-wrap gap-1.5 mt-1 border-t border-[#f1eee6]/50 pt-3">
              {userAllergies.map((allergen, idx) => (
                <span 
                  key={idx} 
                  className="bg-[#ffdad6] text-[#ba1a1a] px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1 border border-[#ba1a1a]/15"
                >
                  <ShieldAlert className="w-3.5 h-3.5 flex-shrink-0 text-[#ba1a1a]" />
                  <span>{allergen}</span>
                  <button 
                    onClick={() => handleAllergyToggleLocal(allergen)}
                    className="ml-1 text-[#ba1a1a] hover:opacity-80 cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}

              <button 
                onClick={() => setIsAddingAllergy(true)}
                className="bg-[#f1eee6] text-[#444939] border border-[#c4c9b4] border-dashed px-3 py-1.5 rounded-full text-xs font-bold hover:bg-[#e5e2db] transition-colors flex items-center gap-1 cursor-pointer"
                id="profile-add-allergy-btn"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ 추가</span>
              </button>
            </div>
          )}
        </div>

        {/* Daily Meal Alert Card */}
        <div className="bg-white rounded-[24px] p-5 shadow-[0_4px_20px_rgba(79,111,0,0.03)] border border-[#e5e2db]/30 flex justify-between items-center">
          <div className="flex flex-col pr-4">
            <span className="text-[15px] font-bold text-[#1c1c17] mb-1">일일 급식 푸시 알림</span>
            <span className="text-xs text-[#747967] font-medium leading-relaxed">매일 아침 8시에 오늘의 식단을 카카오톡 알림으로 전송받습니다.</span>
          </div>

          {/* Toggle ON/OFF */}
          <button 
            onClick={() => {
              const updated = !dailyNotification;
              setDailyNotification(updated);
              onUpdateProfile({ ...profile, dailyNotification: updated });
            }}
            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out outline-none focus:ring-2 focus:ring-[#3c5500] ${
              dailyNotification ? 'bg-[#3c5500]' : 'bg-[#e5e2db]'
            }`}
            id="daily-alert-switch"
          >
            <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
              dailyNotification ? 'translate-x-5' : 'translate-x-0'
            }`}></span>
          </button>
        </div>
      </div>

      {/* Settings Section 2: Account & Support */}
      <div className="flex flex-col gap-3">
        <h2 className="text-xs font-bold text-[#3c5500] tracking-wide px-1">지원 및 서비스 안내</h2>
        <div className="bg-white rounded-[24px] p-5 shadow-[0_4px_24px_rgba(79,111,0,0.03)] border border-[#e5e2db]/30 flex flex-col">
          <button className="flex items-center justify-between py-3.5 border-b border-[#f1eee6] text-left hover:opacity-75 transition-opacity cursor-pointer">
            <span className="text-sm font-bold text-[#1c1c17] flex items-center gap-2">
              <HelpCircle className="w-4.5 h-4.5 text-[#747967]" />
              고객센터 / 영양사 상담 문의하기
            </span>
            <ChevronRight className="w-4.5 h-4.5 text-[#c4c9b4]" />
          </button>
          <button className="flex items-center justify-between py-3.5 border-b border-[#f1eee6] text-left hover:opacity-75 transition-opacity cursor-pointer">
            <span className="text-sm font-bold text-[#1c1c17] flex items-center gap-2">
              <FileText className="w-4.5 h-4.5 text-[#747967]" />
              개인정보 처리 위탁 및 이용약관
            </span>
            <ChevronRight className="w-4.5 h-4.5 text-[#c4c9b4]" />
          </button>
          <button 
            onClick={handleLogoutSimulate}
            className="flex items-center justify-between py-3.5 pt-4 text-left hover:opacity-75 transition-opacity cursor-pointer text-[#ba1a1a]"
            id="profile-logout-btn"
          >
            <span className="text-sm font-bold flex items-center gap-2">
              <LogOut className="w-4.5 h-4.5" />
              로그아웃 및 데이터 초기화
            </span>
            <ChevronRight className="w-4.5 h-4.5 opacity-60" />
          </button>
        </div>
      </div>

      {/* Allergy Addition Selector Sheet Modal (오버레이 알레르기 선택 패널) */}
      {isAddingAllergy && (
        <div className="fixed inset-0 z-50 bg-[#1c1c17]/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-[340px] shadow-2xl border border-[#e5e2db] animate-zoom-in animate-duration-150">
            <div className="flex justify-between items-center mb-4 border-b border-[#f1eee6] pb-2">
              <h3 className="text-sm font-bold text-[#3c5500] flex items-center gap-1.5">
                <ShieldAlert className="w-4.5 h-4.5" />
                알레르기 등록 및 제거
              </h3>
              <button 
                onClick={() => setIsAddingAllergy(false)}
                className="text-[#747967] p-1 rounded-full hover:bg-[#f1eee6]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 원클릭 선택 영역 */}
            <p className="text-[11px] text-[#747967] mb-3.5 font-medium leading-normal">
              식품위생법 표시 권장 19종 중 알레르기를 유발하는 주요 급식 원재료를 선택하세요.
            </p>

            <div className="grid grid-cols-3 gap-1.5 max-h-52 overflow-y-auto pr-1">
              {commonAllergenOptions.map((allergen, idx) => {
                const isActive = userAllergies.includes(allergen);
                return (
                  <button
                    key={idx}
                    onClick={() => handleAllergyToggleLocal(allergen)}
                    className={`py-2 px-1 rounded-xl text-center text-xs font-bold transition-all border block ${
                      isActive 
                        ? 'bg-[#ffdad6] text-[#ba1a1a] border-[#ba1a1a]/30 shadow-sm' 
                        : 'bg-[#f6f3eb] text-[#444939] border-[#e5e2db] hover:bg-[#e5e2db]'
                    }`}
                  >
                    {allergen}
                  </button>
                );
              })}
            </div>

            {/* 수동 커스텀 입력 양식 */}
            <form onSubmit={handleCustomAllergyAdd} className="mt-4 flex gap-2">
              <input 
                type="text" 
                placeholder="기타 유발 물질 직접 기입" 
                value={newAllergentInput}
                onChange={(e) => setNewAllergentInput(e.target.value)}
                className="flex-1 bg-[#f6f3eb] border border-[#c4c9b4] text-xs font-semibold rounded-xl px-3 py-2 outline-none focus:border-[#3c5500]"
              />
              <button 
                type="submit"
                className="bg-[#3c5500] text-white px-3 py-2 rounded-xl text-xs font-bold hover:bg-[#536500]"
              >
                추가
              </button>
            </form>

            <button
              onClick={() => setIsAddingAllergy(false)}
              className="w-full mt-4 bg-[#f1eee6] text-[#1c1c17] py-3 rounded-xl text-xs font-bold hover:bg-[#e5e2db] transition-all cursor-pointer"
            >
              선택 완료 완료
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="mt-6 mb-4 text-center flex flex-col gap-1 select-none">
        <span className="text-xs text-[#747967] font-semibold">© 2026 씨마스고등학교 급식</span>
        <span className="text-[11px] text-[#c4c9b4] font-medium leading-relaxed">식품위생 안전 관리 및 행복하고 건강한 학교 식단을 제공합니다.</span>
      </footer>
    </div>
  );
}
