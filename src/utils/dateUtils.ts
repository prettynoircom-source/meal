/**
 * 날짜 처리 방식 - Asia/Seoul 기준 KST 유틸리티
 */

/**
 * 한국 시간(KST) 기준의 오늘 Date 객체를 반환합니다.
 */
export function getTodayKST(): Date {
  const now = new Date();
  try {
    const seoulString = now.toLocaleString("en-US", { timeZone: "Asia/Seoul" });
    return new Date(seoulString);
  } catch (e) {
    // 대체용 수동 timezone offset 조정 (toLocaleString 오동작 대비)
    const tzOffset = 9 * 60; // Korea is UTC+9
    const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
    return new Date(utc + (tzOffset * 60000));
  }
}

/**
 * "M월 D일 요일" 형식으로 변환합니다 (예: "5월 15일 금요일")
 */
export function formatKoreanDate(date: Date): string {
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const weekDays = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
  const dayOfWeek = weekDays[date.getDay()];
  return `${month}월 ${day}일 ${dayOfWeek}`;
}

/**
 * NEIS API 연동 및 데이터 키 매핑용 "YYYYMMDD" 형식 문자열을 반환합니다.
 */
export function formatDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}${month}${day}`;
}

/**
 * 매개변수로 전달받은 날짜가 속한 주의 월요일부터 금요일까지 5일의 Date 객체 배열을 구합니다.
 */
export function getWeekDates(date: Date): Date[] {
  const currentDay = date.getDay(); // 0 is Sunday, 1..5, 6 is Saturday
  // 월요일과의 차이 계산 (일요일의 경우 지난 주 월요일 혹은 이번 주 월요일 처리를 위해 오프셋 조정)
  // 일반적인 주간 식단표는 수요일 일요일 구분 처리를 안전하게 하기 위함
  const dayOffset = currentDay === 0 ? -6 : 1 - currentDay;
  const monday = new Date(date);
  monday.setDate(date.getDate() + dayOffset);
  
  const dates: Date[] = [];
  for (let i = 0; i < 5; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    dates.push(d);
  }
  return dates;
}

/**
 * 해당 날짜를 포함하는 월의 주차를 계산해 "M월 N주차" 문자열을 반환합니다.
 */
export function getWeekOfMonth(date: Date): string {
  // ISO 주차 방식 대신 직관적인 해당 월의 실제 N번째 주차 계산 방식을 취합니다
  const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
  const firstDayOfWeek = firstDay.getDay(); // 0: 일, 1: 월 ...
  
  // 월요일을 주의 첫날로 정렬 조정
  const firstDayAdjusted = firstDayOfWeek === 0 ? 7 : firstDayOfWeek;
  const dateNum = date.getDate();
  
  // 해당 날짜가 첫째주(1주)부터 몇 주차인지 올림 계산
  const weekNum = Math.ceil((dateNum + firstDayAdjusted - 2) / 7) || 1;
  
  const month = date.getMonth() + 1;
  return `${month}월 ${weekNum}주차`;
}

/**
 * 오늘 날짜 기준 기본 선택 날짜를 구합니다.
 * 평일(월~금)이면 오늘, 토요일이나 일요일(주말)이면 다음 월요일 또는 직전 금요일(여기서는 다가올 새 식단인 다음 월요일을 권장 우선시함)을 반환합니다.
 */
export function getDefaultSelectedDate(today: Date): Date {
  const day = today.getDay();
  if (day >= 1 && day <= 5) {
    return today;
  }
  
  // 주말 처리: 토/일요일일 때 다가오는 월요일을 보여주어 끊김이 없고 알찬 정보를 제공
  const result = new Date(today);
  if (day === 6) {
    // 토요일 -> 2일 더해 월요일
    result.setDate(today.getDate() + 2);
  } else if (day === 0) {
    // 일요일 -> 1일 더해 월요일
    result.setDate(today.getDate() + 1);
  }
  return result;
}

/**
 * 한글 요일 한 글자를 반환합니다 (예: "월", "화" 등)
 */
export function getKoreanDayOfWeek(date: Date): string {
  const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
  return weekdays[date.getDay()];
}
