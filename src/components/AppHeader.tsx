import { Bell, Utensils } from 'lucide-react';

interface AppHeaderProps {
  onNotificationClick?: () => void;
  title?: string;
}

export default function AppHeader({ onNotificationClick, title = "씨마스고등학교 급식" }: AppHeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-[20px] h-16 max-w-[420px] mx-auto bg-[#fcf9f1]/80 backdrop-blur-md border-b border-[#e5e2db]/30">
      <div className="flex items-center gap-3 text-[#3c5500]">
        <div className="w-8 h-8 rounded-full bg-[#c9f07c]/40 flex items-center justify-center">
          <Utensils className="w-[18px] h-[18px]" strokeWidth={2.5} />
        </div>
        <h1 className="text-xl font-bold text-[#3c5500] tracking-tight">{title}</h1>
      </div>
      <button 
        onClick={onNotificationClick}
        className="text-[#3c5500] p-1.5 rounded-full hover:bg-[#ebe8e0]/50 transition-colors"
        id="header-notification-btn"
      >
        <Bell className="w-5 h-5" />
      </button>
    </header>
  );
}
