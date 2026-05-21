import { Home, Calendar, Calculator, User } from 'lucide-react';
import { ActiveTab } from '../types';

interface BottomNavBarProps {
  activeTab: ActiveTab;
  onChangeTab: (tab: ActiveTab) => void;
}

export default function BottomNavBar({ activeTab, onChangeTab }: BottomNavBarProps) {
  const navItems = [
    { id: 'home' as ActiveTab, label: '홈', icon: Home },
    { id: 'menu' as ActiveTab, label: '식단표', icon: Calendar },
    { id: 'nutrition' as ActiveTab, label: '영양계산', icon: Calculator },
    { id: 'profile' as ActiveTab, label: '프로필', icon: User }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 w-full z-50 flex justify-around items-center px-4 py-2.5 max-w-[420px] mx-auto bg-[#fcf9f1] border-t border-[#e5e2db] shadow-[0_-4px_12px_rgba(79,111,0,0.06)] rounded-t-2xl">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;

        return (
          <button
            key={item.id}
            onClick={() => onChangeTab(item.id)}
            className={`flex flex-col items-center justify-center py-1 px-4 rounded-xl transition-all duration-150 cursor-pointer ${
              isActive
                ? 'bg-[#3c5500] text-white font-bold shadow-sm scale-[0.98]'
                : 'text-[#747967] hover:bg-[#f1eee6]/50 hover:text-[#1c1c17]'
            }`}
            id={`nav-tab-${item.id}`}
          >
            <Icon className={`w-5 h-5 mb-0.5 ${isActive ? 'stroke-[2.5px]' : 'stroke-[2px]'}`} />
            <span className="text-xs font-medium">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
