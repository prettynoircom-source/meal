import { MealData, SelectableDishItem, MealType } from '../types';
import { getWeekDates, formatDateKey, getKoreanDayOfWeek } from '../utils/dateUtils';

/**
 * 특정 식사의 반찬명을 기반으로 개별 선택이 가능한 영양성분 아이템 리스크를 생성합니다 (영양계산용)
 */
export function getSelectableDishItemsForMeal(meal: MealData): SelectableDishItem[] {
  return meal.dishes.map((dish, idx) => {
    let category: '밥류' | '국/찌개' | '반찬' | '디저트' = '반찬';
    let kcal = 120;
    let protein = 5;
    let carb = 15;
    let fat = 2;
    let details = '';
    let allergenTag = '';

    // 식단 구성 분석 및 세부 영양 정보 부여
    if (dish.includes('밥') || dish.includes('덮밥') || dish.includes('비빔밥')) {
      category = '밥류';
      kcal = 300;
      carb = 65;
      protein = 6;
      fat = 1;
      details = '탄수화물 65g';
    } else if (dish.includes('국') || dish.includes('찌개') || dish.includes('스프') || dish.includes('탕')) {
      category = '국/찌개';
      kcal = 150;
      carb = 12;
      protein = 8;
      fat = 4;
      details = '요오드 다량 함유';
      
      if (dish.includes('쇠고기') || dish.includes('소고기')) {
        allergenTag = '쇠고기 함유';
      } else if (dish.includes('돼지고기') || dish.includes('돈육')) {
        allergenTag = '돼지고기 함유';
      }
    } else if (dish.includes('요구르트') || dish.includes('주스') || dish.includes('과일') || dish.includes('오렌지') || dish.includes('바나나') || dish.includes('수박') || dish.includes('짜요짜요') || dish.includes('콘드레싱')) {
      category = '디저트';
      kcal = 80;
      carb = 18;
      protein = 1;
      fat = 0.5;
      details = '비타민C 풍부';
      if (dish.includes('요구르트') || dish.includes('짜요짜요')) {
        allergenTag = '우유 함유';
      }
    } else {
      // 일반 반찬류
      category = '반찬';
      if (dish.includes('김치') || dish.includes('깍두기')) {
        kcal = 25;
        carb = 4;
        protein = 1;
        fat = 0.1;
        details = '식이섬유 2g';
      } else if (dish.includes('돈까스') || dish.includes('강정') || dish.includes('떡갈비') || dish.includes('제육') || dish.includes('닭') || dish.includes('갈비') || dish.includes('스테이크')) {
        kcal = 280;
        carb = 20;
        protein = 18;
        fat = 14;
        
        if (dish.includes('돈') || dish.includes('제육') || dish.includes('갈비') || dish.includes('돼지')) {
          allergenTag = '돼지고기 함유';
        } else if (dish.includes('닭') || dish.includes('치킨')) {
          allergenTag = '닭고기 함유';
        } else if (dish.includes('쇠') || dish.includes('소') || dish.includes('떡갈비') || dish.includes('함박')) {
          allergenTag = '쇠고기 함유';
        }
      } else if (dish.includes('나물') || dish.includes('무침') || dish.includes('샐러드') || dish.includes('겉절이') || dish.includes('무쌈')) {
        kcal = 45;
        carb = 5;
        protein = 2;
        fat = 0.5;
        details = '식이섬유 3g';
      } else if (dish.includes('고등어') || dish.includes('생선') || dish.includes('구이')) {
        kcal = 220;
        carb = 1;
        protein = 16;
        fat = 12;
        allergenTag = '고등어 함유';
      } else if (dish.includes('계란') || dish.includes('후라이')) {
        kcal = 80;
        carb = 1;
        protein = 7;
        fat = 5;
        allergenTag = '난류 함유';
      }
    }

    return {
      id: `${meal.dateKey}_${meal.mealType}_${idx}`,
      name: dish,
      kcal,
      category,
      details: details || `단백질 ${protein}g`,
      allergenTag: allergenTag || undefined,
      nutrition: {
        protein,
        carb,
        fat
      }
    };
  });
}

/**
 * 주어진 기준 날짜(일반적으로 오늘)가 포함된 주의 월~금요일 식단을 생성합니다.
 */
export function generateMealsForWeek(referenceDate: Date): MealData[] {
  const weekDates = getWeekDates(referenceDate);
  const meals: MealData[] = [];

  // 요일별 고유 메뉴 데이터베이스 구성템플릿
  const menusByDay = [
    // 월요일
    {
      lunch: {
        title: '치킨마요덮밥 정식',
        dishes: ['친환경현미밥', '시원한우동국물', '수제치킨마요덮밥', '야채샐러드', '배추김치', '요구르트'],
        kcal: 820,
        protein: 34, carb: 115, fat: 22,
        allergens: ['대두', '밀', '닭고기', '난류', '우유'],
        proteinRate: 75
      },
      dinner: {
        title: '제육볶음 반상',
        dishes: ['친환경현미밥', '맑은어묵국', '매콤제육볶음', '상추쌈 & 쌈장', '깍두기'],
        kcal: 740,
        protein: 30, carb: 102, fat: 21,
        allergens: ['대두', '밀', '돼지고기'],
        proteinRate: 70
      }
    },
    // 화요일
    {
      lunch: {
        title: '한우수제떡갈비 정식',
        dishes: ['검정쌀밥', '소고기미역국', '한우수제떡갈비', '연두부 & 양념장', '깍두기', '오렌지'],
        kcal: 835,
        protein: 38, carb: 108, fat: 24,
        allergens: ['대두', '밀', '쇠고기', '우유'],
        proteinRate: 85
      },
      dinner: {
        title: '간장계란버터밥',
        dishes: ['계란버터비빔밥', '미니우동', '상큼야채겉절이', '국물떡볶이', '배추김치'],
        kcal: 710,
        protein: 24, carb: 98, fat: 18,
        allergens: ['난류', '우유', '대두', '밀'],
        proteinRate: 60
      }
    },
    // 수요일
    {
      lunch: {
        title: '한방안동찜닭 반상',
        dishes: ['찰보리밥', '맑은소고기무국', '한방안동찜닭', '부추오이무침', '배추김치', '미니메론'],
        kcal: 810,
        protein: 35, carb: 110, fat: 19,
        allergens: ['대두', '밀', '닭고기', '쇠고기'],
        proteinRate: 80
      },
      dinner: {
        title: '매콤치즈불닭 덮밥',
        dishes: ['참치마요간단덮밥', '가쓰오장국', '매콤식욕치즈불닭', '고추된장무침', '배추김치', '아이스망고'],
        kcal: 760,
        protein: 28, carb: 104, fat: 20,
        allergens: ['대두', '밀', '닭고기', '우유'],
        proteinRate: 68
      }
    },
    // 목요일 (목업의 치즈돈까스 일치)
    {
      lunch: {
        title: '치즈돈까스 정식',
        dishes: ['친환경현미밥', '쇠고기미역국', '매콤돈육강정', '숙주미나리무침', '배추김치'],
        kcal: 845,
        protein: 32, carb: 110, fat: 25,
        allergens: ['대두', '밀', '쇠고기', '돼지고기'],
        proteinRate: 85
      },
      dinner: {
        title: '참치마요덮밥과 우동',
        dishes: ['참치마요덮밥', '유부장국', '매콤떡볶이', '깍두기', '요구르트'],
        kcal: 720,
        protein: 26, carb: 92, fat: 17,
        allergens: ['난류', '우유', '대두', '밀'],
        proteinRate: 60
      }
    },
    // 금요일
    {
      lunch: {
        title: '바삭 수제돈까스 반상',
        dishes: ['친환경현미밥', '고소한크림스프', '바삭수제돈까스 & 소스', '양배추코울슬로', '배추김치', '수박'],
        kcal: 860,
        protein: 36, carb: 114, fat: 24,
        allergens: ['대두', '밀', '돼지고기', '우유'],
        proteinRate: 85
      },
      dinner: {
        title: '새우볶음밥 & 짜장 정식',
        dishes: ['새우볶음밥 & 짜장소스', '맑은달걀파국', '군만두 2개', '상큼단무지무침', '요구르트'],
        kcal: 720,
        protein: 25, carb: 100, fat: 20,
        allergens: ['대두', '밀', '난류', '새우', '우유'],
        proteinRate: 65
      }
    }
  ];

  weekDates.forEach((date, i) => {
    const dayMenu = menusByDay[i] || menusByDay[0]; // 안전 장치
    const dateKey = formatDateKey(date);
    const dayOfWeek = getKoreanDayOfWeek(date);

    // 중식 추가
    meals.push({
      id: `${dateKey}_lunch`,
      schoolName: '씨마스고등학교',
      date: new Date(date),
      dateKey,
      dayOfWeek,
      mealType: '중식',
      title: dayMenu.lunch.title,
      dishes: dayMenu.lunch.dishes,
      totalCalories: dayMenu.lunch.kcal,
      nutrition: {
        kcal: dayMenu.lunch.kcal,
        protein: dayMenu.lunch.protein,
        carb: dayMenu.lunch.carb,
        fat: dayMenu.lunch.fat
      },
      allergens: dayMenu.lunch.allergens,
      proteinTargetRate: dayMenu.lunch.proteinRate
    });

    // 석식 추가
    meals.push({
      id: `${dateKey}_dinner`,
      schoolName: '씨마스고등학교',
      date: new Date(date),
      dateKey,
      dayOfWeek,
      mealType: '석식',
      title: dayMenu.dinner.title,
      dishes: dayMenu.dinner.dishes,
      totalCalories: dayMenu.dinner.kcal,
      nutrition: {
        kcal: dayMenu.dinner.kcal,
        protein: dayMenu.dinner.protein,
        carb: dayMenu.dinner.carb,
        fat: dayMenu.dinner.fat
      },
      allergens: dayMenu.dinner.allergens,
      proteinTargetRate: dayMenu.dinner.proteinRate
    });
  });

  return meals;
}
