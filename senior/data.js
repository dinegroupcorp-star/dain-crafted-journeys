/* 이음선배 — 프로토타입 데이터
   멘토 12명 / 수도권 거점 8곳 / 세대 공감 대화 / 직무 사다리 */
window.EUM = window.EUM || {};

EUM.CATEGORIES = ['전체', '인생·진로', '독서·글쓰기', '손재주·공예', '바둑·체스', '역사·외국어'];

EUM.GRADES = {
  junior: { key: 'junior', name: '주니어 멘토', cls: 'gradeJunior', rate: 22000, months: '월 2~4회' },
  pro:    { key: 'pro',    name: '전문 멘토',   cls: 'gradePro',    rate: 28000, months: '월 4~8회' },
  senior: { key: 'senior', name: '수석 멘토',   cls: 'gradeSenior', rate: 35000, months: '월 6~12회' }
};

EUM.MENTORS = [
  {
    id: 'm01', name: '김정호', age: 72, initial: '김',
    career: '전직 초등 교장 · 교직 38년', cat: '인생·진로',
    grade: 'senior', modes: ['화상', '거점'], fee: 35000, inSub: true,
    rating: 4.9, sessions: 214,
    tags: ['진로 이야기', '공부 습관', '옛날 학교 풍경'],
    intro: '38년 동안 아이들을 가르치고 12년은 학교를 이끌었습니다. 요즘 아이들에게 가장 필요한 건 “어른의 이야기를 끝까지 들어 주는 시간”이라고 생각합니다. 성적 이야기보다, 스스로 무엇을 좋아하는지 알아 가는 대화를 하고 싶습니다.',
    slots: [
      { d: '수', t: '16:00', len: '50분' },
      { d: '토', t: '10:00', len: '50분' },
      { d: '토', t: '14:00', len: '50분' }
    ],
    venue: 'v01'
  },
  {
    id: 'm02', name: '최영자', age: 66, initial: '최',
    career: '전직 방송국 아나운서 · 28년', cat: '독서·글쓰기',
    grade: 'pro', modes: ['화상'], fee: 32000, inSub: true,
    rating: 4.8, sessions: 137,
    tags: ['소리 내어 읽기', '발표 자신감', '말하기 습관'],
    intro: '28년간 뉴스와 라디오로 세상의 이야기를 전했습니다. 아이들이 자기 생각을 또렷하게 말하는 연습을 함께합니다. 책 한 권을 소리 내어 읽고, 그다음 내 이야기로 바꿔 보는 시간을 좋아합니다.',
    slots: [
      { d: '화', t: '17:00', len: '45분' },
      { d: '목', t: '17:00', len: '45분' },
      { d: '일', t: '11:00', len: '45분' }
    ]
  },
  {
    id: 'm03', name: '박만수', age: 68, initial: '박',
    career: '한옥 목수 · 35년', cat: '손재주·공예',
    grade: 'pro', modes: ['거점'], fee: 30000, inSub: true,
    rating: 4.9, sessions: 96,
    tags: ['나무 비행기', '못 없는 짜맞춤', '손으로 생각하기'],
    intro: '35년 동안 한옥을 지었습니다. 못 하나 없이 나무를 맞추는 일을 하며 “서두르지 않는 손”을 배웠습니다. 아이들과 나무 비행기와 작은 의자를 만들며, 손으로 생각하는 시간을 나누고 싶습니다.',
    slots: [
      { d: '수', t: '16:00', len: '90분' },
      { d: '토', t: '10:00', len: '90분' },
      { d: '토', t: '13:30', len: '90분' }
    ],
    venue: 'v02'
  },
  {
    id: 'm04', name: '한상철', age: 74, initial: '한',
    career: '서예 사범 · 40년', cat: '손재주·공예',
    grade: 'senior', modes: ['화상', '거점'], fee: 33000, inSub: false,
    rating: 4.9, sessions: 158,
    tags: ['붓글씨', '마음 다스리기', '한자 이야기'],
    intro: '40년 붓을 잡았습니다. 서예는 잘 쓰는 일이 아니라 마음을 고르는 일이라고 아이들에게 말합니다. 한 글자를 천천히 쓰며 그 글자에 담긴 이야기를 함께 나눕니다.',
    slots: [
      { d: '화', t: '15:00', len: '80분' },
      { d: '금', t: '15:00', len: '80분' }
    ],
    venue: 'v04'
  },
  {
    id: 'm05', name: '오규현', age: 70, initial: '오',
    career: '바둑 사범 · 45년', cat: '바둑·체스',
    grade: 'pro', modes: ['화상', '거점'], fee: 28000, inSub: true,
    rating: 4.7, sessions: 183,
    tags: ['바둑 기초', '생각하는 힘', '진 것도 배움'],
    intro: '45년 바둑을 두고 가르쳤습니다. 바둑은 이기는 법보다 기다리는 법을 배우는 놀이입니다. 한 수 한 수 이유를 말하며 두는 습관을 함께 만들어요.',
    slots: [
      { d: '월', t: '16:30', len: '60분' },
      { d: '목', t: '16:30', len: '60분' },
      { d: '토', t: '11:00', len: '60분' }
    ],
    venue: 'v01'
  },
  {
    id: 'm06', name: '정미경', age: 63, initial: '정',
    career: '전직 출판사 편집장 · 30년', cat: '독서·글쓰기',
    grade: 'pro', modes: ['화상'], fee: 30000, inSub: true,
    rating: 4.8, sessions: 112,
    tags: ['독서 기록', '한 편의 글쓰기', '질문 만들기'],
    intro: '30년 동안 책을 만들었습니다. 책을 읽고 “무엇이 궁금했는지”를 적어 보는 것에서 아이들의 생각이 자란다고 믿습니다. 매주 한 편씩, 아이의 문장으로 된 글을 함께 완성합니다.',
    slots: [
      { d: '화', t: '18:00', len: '45분' },
      { d: '토', t: '09:30', len: '45분' },
      { d: '일', t: '14:00', len: '45분' }
    ]
  },
  {
    id: 'm07', name: '장세훈', age: 69, initial: '장',
    career: '전직 IT 엔지니어 · 32년', cat: '인생·진로',
    grade: 'junior', modes: ['화상'], fee: 25000, inSub: true,
    rating: 4.6, sessions: 41,
    tags: ['컴퓨터 첫걸음', '만드는 재미', '실패해도 괜찮아'],
    intro: '32년 시스템을 만들었습니다. 아이들이 컴퓨터로 직접 무언가를 만들어 보는 시간을 좋아합니다. 잘 만드는 것보다, 틀려도 다시 해 보는 마음을 가르쳐 드립니다.',
    slots: [
      { d: '수', t: '17:00', len: '45분' },
      { d: '일', t: '10:00', len: '45분' }
    ]
  },
  {
    id: 'm08', name: '김성한', age: 76, initial: '김',
    career: '전직 통역사·외교관 · 35년', cat: '역사·외국어',
    grade: 'senior', modes: ['화상'], fee: 38000, inSub: false,
    rating: 4.9, sessions: 201,
    tags: ['영어 회화', '세계의 이웃', '역사 속 이야기'],
    intro: '35년 동안 외국에서 우리를 설명하는 일을 했습니다. 영어는 시험 과목이 아니라 사람에게 말을 거는 방법이라고 말해 줍니다. 세계 여러 나라의 사진 한 장으로 대화를 시작합니다.',
    slots: [
      { d: '월', t: '19:00', len: '45분' },
      { d: '수', t: '19:00', len: '45분' },
      { d: '토', t: '10:30', len: '45분' }
    ]
  },
  {
    id: 'm09', name: '이순옥', age: 64, initial: '이',
    career: '퇴직 약사 · 약국 31년', cat: '인생·진로',
    grade: 'junior', modes: ['화상', '거점'], fee: 24000, inSub: true,
    rating: 4.7, sessions: 58,
    tags: ['몸 돌보기', '약 이야기', '꾸준함의 힘'],
    intro: '31년 약국을 지켰습니다. 아이들에게 무엇보다 “오늘 몸을 잘 돌보는 법”을 알려 주고 싶습니다. 손 씻기부터 밤에 잠드는 습관까지, 가까운 이야기로 시작합니다.',
    slots: [
      { d: '화', t: '16:00', len: '40분' },
      { d: '금', t: '16:00', len: '40분' }
    ],
    venue: 'v05'
  },
  {
    id: 'm10', name: '박순자', age: 67, initial: '박',
    career: '전직 보육교사 · 35년', cat: '인생·진로',
    grade: 'junior', modes: ['거점'], fee: 22000, inSub: true,
    rating: 4.8, sessions: 73,
    tags: ['마음 나누기', '친구 사귀기', '옛날 놀이'],
    intro: '35년 동안 어린 아이들을 돌봤습니다. 요즘 아이들의 가장 큰 고민은 “친구”라고 생각합니다. 술래잡기와 실뜨기 같은 옛 놀이를 하며 마음을 여는 시간을 만듭니다.',
    slots: [
      { d: '수', t: '15:30', len: '70분' },
      { d: '토', t: '11:00', len: '70분' }
    ],
    venue: 'v01'
  },
  {
    id: 'm11', name: '윤태식', age: 71, initial: '윤',
    career: '조경·텃밭지기 · 30년', cat: '손재주·공예',
    grade: 'junior', modes: ['거점'], fee: 23000, inSub: true,
    rating: 4.7, sessions: 39,
    tags: ['텃밭 가꾸기', '계절 관찰', '흙 만지기'],
    intro: '30년 동안 나무와 풀을 가꿨습니다. 상추 한 포기 키우면서 아이들은 기다림을 배웁니다. 거점 옥상 텃밭에서 씨앗을 심고, 자라는 것을 함께 기록합니다.',
    slots: [
      { d: '화', t: '10:00', len: '80분' },
      { d: '일', t: '10:00', len: '80분' }
    ],
    venue: 'v06'
  },
  {
    id: 'm12', name: '서강일', age: 65, initial: '서',
    career: '전직 중학교 수학교사 · 체스 지도 12년', cat: '바둑·체스',
    grade: 'junior', modes: ['화상'], fee: 24000, inSub: true,
    rating: 4.6, sessions: 46,
    tags: ['체스 첫 수', '차근차근 생각', '수학이 쉬워지는'],
    intro: '32년 수학을 가르쳤고, 은퇴 후 12년째 아이들에게 체스를 가르칩니다. 체스는 “한 번 더 생각하기”를 몸에 익히는 놀이입니다. 게임 한 판으로 수학의 자신감까지 함께 키웁니다.',
    slots: [
      { d: '수', t: '18:30', len: '45분' },
      { d: '일', t: '16:00', len: '45분' }
    ]
  }
];

/* 거점 8곳 — 수도권 */
EUM.VENUES = [
  {
    id: 'v01', name: '비산 이음카페', area: '안양 비산동', short: '안양',
    lat: 37.4046, lng: 126.9311,
    addr: '경기 안양시 동안구 비산동 1103 · 관악대로 000',
    note: '초등학교 옆 1층 · 계단 없음 · 화장실 넓음',
    programs: [
      { day: '수', time: '16:00', title: '35년 목수 선배와 나무 비행기 만들기', mentor: '박만수', mentorId: 'm03', len: '90분', cap: 8, left: 3 },
      { day: '토', time: '11:00', title: '전직 교장 선배의 “나의 열두 살” 이야기', mentor: '김정호', mentorId: 'm01', len: '60분', cap: 10, left: 4 },
      { day: '토', time: '11:00', title: '보육교사 선배와 옛날 놀이 한마당', mentor: '박순자', mentorId: 'm10', len: '70분', cap: 10, left: 6 }
    ]
  },
  {
    id: 'v02', name: '성수 소셜라운지', area: '서울 성동구 성수동', short: '성수',
    lat: 37.5445, lng: 127.0557,
    addr: '서울 성동구 성수동2가 000 · 연무장길',
    note: '주차 가능 · 큰 테이블 작업실 있음',
    programs: [
      { day: '수', time: '16:00', title: '35년 목수 선배와 나무 비행기 만들기', mentor: '박만수', mentorId: 'm03', len: '90분', cap: 8, left: 2 },
      { day: '토', time: '13:30', title: '못 없는 짜맞춤 · 작은 의자 만들기', mentor: '박만수', mentorId: 'm03', len: '90분', cap: 6, left: 1 }
    ]
  },
  {
    id: 'v03', name: '판교 세대도서관', area: '성남 판교', short: '판교',
    lat: 37.3947, lng: 127.1112,
    addr: '경기 성남시 분당구 판교동 000 · 판교도서관 2층',
    note: '도서관 안 조용한 세미나실 · 엘리베이터 있음',
    programs: [
      { day: '화', time: '18:00', title: '편집장 선배와 한 편의 글쓰기', mentor: '정미경', mentorId: 'm06', len: '45분', cap: 8, left: 5 },
      { day: '토', time: '10:30', title: '통역사 선배와 영어로 자기소개', mentor: '김성한', mentorId: 'm08', len: '45분', cap: 8, left: 3 }
    ]
  },
  {
    id: 'v04', name: '종로 세대공감센터', area: '서울 종로', short: '종로',
    lat: 37.5720, lng: 126.9870,
    addr: '서울 종로구 관철동 000 · 세대공감센터 3층',
    note: '서예실 별도 · 붓과 화선지 제공',
    programs: [
      { day: '화', time: '15:00', title: '서예 사범 선배와 마음 고르는 붓글씨', mentor: '한상철', mentorId: 'm04', len: '80분', cap: 10, left: 7 },
      { day: '금', time: '15:00', title: '한 글자에 담긴 이야기 · 한자와 친해지기', mentor: '한상철', mentorId: 'm04', len: '80분', cap: 10, left: 9 }
    ]
  },
  {
    id: 'v05', name: '광명 이음방', area: '광명 소하동', short: '광명',
    lat: 37.4775, lng: 126.8640,
    addr: '경기 광명시 소하동 000 · 주민센터 옆 1층',
    note: '주민센터 바로 옆 · 유아 동반 가능',
    programs: [
      { day: '화', time: '16:00', title: '퇴직 약사 선배와 몸 돌보기 수업', mentor: '이순옥', mentorId: 'm09', len: '40분', cap: 8, left: 4 },
      { day: '금', time: '16:00', title: '잠 잘 자는 법 · 생활 습관 함께 만들기', mentor: '이순옥', mentorId: 'm09', len: '40분', cap: 8, left: 5 }
    ]
  },
  {
    id: 'v06', name: '수원 행궁 공방거리', area: '수원 행궁동', short: '수원',
    lat: 37.2655, lng: 127.0110,
    addr: '경기 수원시 팔달구 행궁동 000 · 공방 2층 옥상텃밭',
    note: '옥상 텃밭 · 흙 묻어도 되는 옷으로 오세요',
    programs: [
      { day: '화', time: '10:00', title: '텃밭지기 선배와 상추 키우기', mentor: '윤태식', mentorId: 'm11', len: '80분', cap: 10, left: 6 },
      { day: '일', time: '10:00', title: '가을 씨앗 심기 · 자라는 것 기록하기', mentor: '윤태식', mentorId: 'm11', len: '80분', cap: 10, left: 8 }
    ]
  },
  {
    id: 'v07', name: '부평 문화거리 라운지', area: '인천 부평', short: '부평',
    lat: 37.4895, lng: 126.7240,
    addr: '인천 부평구 부평동 000 · 문화의거리 안',
    note: '지하철역 3분 · 바둑판·체스판 상비',
    programs: [
      { day: '월', time: '16:30', title: '바둑 사범 선배와 한 수씩 두기', mentor: '오규현', mentorId: 'm05', len: '60분', cap: 6, left: 2 },
      { day: '목', time: '16:30', title: '이기는 법보다 기다리는 법 · 바둑교실', mentor: '오규현', mentorId: 'm05', len: '60분', cap: 6, left: 4 }
    ]
  },
  {
    id: 'v08', name: '일산 세대라운지', area: '고양 일산', short: '일산',
    lat: 37.6600, lng: 126.7690,
    addr: '경기 고양시 일산동구 장항동 000 · 라페스타 2층',
    note: '넓은 좌석 · 보호자 대기 공간 있음',
    programs: [
      { day: '화', time: '17:00', title: '아나운서 선배와 소리 내어 읽기', mentor: '최영자', mentorId: 'm02', len: '45분', cap: 8, left: 3 },
      { day: '일', time: '11:00', title: '내 생각을 또렷하게 말하기', mentor: '최영자', mentorId: 'm02', len: '45분', cap: 8, left: 5 }
    ]
  }
];

/* 화상·안전실 — 오늘의 세대 공감 대화 */
EUM.TALK = [
  {
    q: '“선배님은 열두 살 때, 학교 끝나고 무엇을 하며 놀았어요?”',
    hint: '아이들이 먼저 물어보는 질문이에요. 선배님은 그때의 사진 한 장을 함께 보여 주세요.'
  },
  {
    q: '“그때 가장 가지고 싶었던 물건은 무엇이었어요?”',
    hint: '값이 아니라 ‘왜 갖고 싶었는지’를 물어보면 아이의 이야기가 길어집니다. 1970년대 물건 사진을 준비해 두면 좋아요.'
  },
  {
    q: '“어른이 되어 처음 한 일은 무엇이었어요?”',
    hint: '첫 월급으로 무엇을 했는지까지 이어 가면, 아이가 ‘일’과 ‘가족’을 함께 생각하게 됩니다.'
  },
  {
    q: '“지금의 나에게 선배님이 꼭 해 주고 싶은 말은 무엇인가요?”',
    hint: '마지막 질문은 선배님이 아이에게 건네는 한 문장으로 마무리합니다. 이 문장은 주간 리포트에 그대로 담깁니다.'
  }
];

/* 월 예상 활동비 시뮬레이터 기준 */
EUM.SIM = {
  weeks: 4.3,
  b2g: { junior: 180000, pro: 240000, senior: 290000 },
  bonus: { junior: 3000, pro: 5000, senior: 7000 }
};
