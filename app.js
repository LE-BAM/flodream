// ===== Flodream — Shared Utilities =====

const Storage = {
  KEY: 'flodream_stories',

  getAll() {
    try { return JSON.parse(localStorage.getItem(this.KEY) || '[]'); }
    catch { return []; }
  },

  saveAll(stories) {
    localStorage.setItem(this.KEY, JSON.stringify(stories));
  },

  get(id) {
    return this.getAll().find(s => s.id === id) || null;
  },

  save(story) {
    const stories = this.getAll();
    const idx = stories.findIndex(s => s.id === story.id);
    if (idx >= 0) stories[idx] = story;
    else stories.push(story);
    this.saveAll(stories);
    return story;
  },

  delete(id) {
    this.saveAll(this.getAll().filter(s => s.id !== id));
  },

  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
  }
};

function createEmptyStory(title, description, author, genre) {
  const startNodeId = 'node_' + Storage.generateId();
  return {
    id: Storage.generateId(),
    title,
    description: description || '',
    author: author || '익명',
    genre: genre || '기타',
    coverColor: randomColor(),
    published: false,
    createdAt: Date.now(),
    startNodeId,
    nodes: {
      [startNodeId]: {
        id: startNodeId,
        title: '시작 장면',
        content: '',
        isStart: true,
        isEnding: false,
        endingLabel: '',
        choices: []
      }
    }
  };
}

function createEmptyNode(isStart = false) {
  const id = 'node_' + Storage.generateId();
  return {
    id,
    title: isStart ? '시작 장면' : '새 장면',
    content: '',
    isStart,
    isEnding: false,
    endingLabel: '',
    choices: []
  };
}

function createEmptyChoice() {
  return { id: 'c_' + Storage.generateId(), text: '', nextNodeId: '' };
}

function randomColor() {
  const colors = ['#7c3aed', '#2563eb', '#0891b2', '#059669', '#d97706', '#dc2626', '#db2777'];
  return colors[Math.floor(Math.random() * colors.length)];
}

// ===== Sample Data =====
function initSampleData() {
  if (Storage.getAll().length > 0) return;

  const n1 = 'node_start';
  const n2 = 'node_building';
  const n3 = 'node_alley';
  const n4 = 'node_truth';
  const n5 = 'node_reunion';

  Storage.save({
    id: 'sample_seoul2033',
    title: '2033, 서울의 잿더미',
    description: '모든 것이 무너진 서울. 당신은 폐허 속에서 사라진 누군가를 찾고 있다. 선택이 운명을 가른다.',
    author: '관리자',
    genre: 'SF',
    coverColor: '#7c3aed',
    published: true,
    createdAt: Date.now(),
    startNodeId: n1,
    nodes: {
      [n1]: {
        id: n1, title: '잿더미의 아침', isStart: true, isEnding: false, endingLabel: '',
        content: `어둠 속에서 눈을 떴다.\n\n2033년 서울. 한때 화려했던 강남의 마천루는 이제 녹슨 철골과 깨진 유리의 무덤이 되었다. 먼지 섞인 공기가 폐를 파고든다. 멀리서 드론 소리가 들린다—아직도 감시는 계속된다.\n\n당신은 잿더미 속에서 무언가를 찾고 있다. 아니, 누군가를. 3일 전 실종된 동생의 마지막 신호가 이 폐허에서 잡혔다.`,
        choices: [
          { id: 'c1', text: '무너진 건물 안으로 들어간다', nextNodeId: n2 },
          { id: 'c2', text: '어두운 골목 쪽으로 빠진다', nextNodeId: n3 }
        ]
      },
      [n2]: {
        id: n2, title: '건물 내부', isStart: false, isEnding: false, endingLabel: '',
        content: `건물 안으로 들어서자 퀴퀴한 냄새가 코를 찌른다.\n\n쓰러진 가구와 깨진 모니터들 사이로 희미한 빛이 새어 들어온다. 그런데—구석에 낡은 서버 컴퓨터 하나가 아직 깜빡이고 있다. 전원이 살아있다.\n\n누가 최근에 여기 있었던 걸까. 바닥에는 신선한 발자국이 남아있다. 당신 것이 아닌 발자국이.`,
        choices: [
          { id: 'c3', text: '서버 컴퓨터에 접근한다', nextNodeId: n4 },
          { id: 'c4', text: '발자국을 따라 골목으로 나간다', nextNodeId: n3 }
        ]
      },
      [n3]: {
        id: n3, title: '골목의 낯선 사람', isStart: false, isEnding: false, endingLabel: '',
        content: `좁은 골목. 쓰레기 더미 사이에서 누군가가 당신을 기다리고 있었다.\n\n"오래 기다렸어."\n\n낮고 조심스러운 목소리. 후드 깊숙이 가린 얼굴이 천천히 올라간다. 눈이 마주치는 순간, 심장이 멈출 것 같았다.\n\n동생이었다.`,
        choices: [
          { id: 'c5', text: '"어디 있었어? 무슨 일이야?"', nextNodeId: n4 },
          { id: 'c6', text: '말없이 끌어안는다', nextNodeId: n5 }
        ]
      },
      [n4]: {
        id: n4, title: '진실', isStart: false, isEnding: true, endingLabel: '진실 엔딩',
        content: `화면이 켜진다. 아니—동생의 입이 열린다.\n\n"이 도시가 무너진 건 사고가 아니었어."\n\n수천 개의 파일. 이름들. 날짜들. 그리고 당신의 이름. 당신도 모르게 연루된 계획. 새로운 세계를 위해 구세계를 지운 사람들.\n\n"우리가 선택해야 해. 폭로할 건지, 아니면 살아남을 건지."\n\n당신은 이제 돌이킬 수 없는 진실의 무게를 떠안게 되었다.\n\n— 진실을 알았지만, 싸움은 이제 시작이다.`,
        choices: []
      },
      [n5]: {
        id: n5, title: '재회', isStart: false, isEnding: true, endingLabel: '재회 엔딩',
        content: `말이 필요 없었다.\n\n3일 간의 공포, 수십 킬로미터의 폐허, 무너진 도시와 무너진 세상—그 모든 것이 이 한 순간에 녹아내린다.\n\n동생이 떨리는 목소리로 속삭인다. "미안해. 그냥... 살고 싶었어."\n\n당신도 마찬가지였다. 아직 살아있다는 것만으로도 충분한 밤이었다.\n\n— 찾았다. 그것만으로 오늘은 충분하다.`,
        choices: []
      }
    }
  });
}

// ===== Shared toast helper =====
function showToast(msg, type = 'success') {
  const container = document.getElementById('toast-container');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = msg;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.appendChild(document.createTextNode(str || ''));
  return div.innerHTML;
}

function escapeAttr(str) {
  return (str || '').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}
