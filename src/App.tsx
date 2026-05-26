import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Plane, BookOpen, Film, Heart, Compass, Search, Calendar, ChevronRight, 
  ArrowLeft, Plus, Edit, Trash2, ShieldCheck, X, Upload, Check, Lock, 
  LogIn, LogOut, Menu, Share2, Copy, Image as ImageIcon, Sparkles, 
  Filter, Info, ChevronDown, ListFilter 
} from 'lucide-react';

// ==========================================
// TYPE DEFINITIONS
// ==========================================
interface BlogPost {
  id: string;          // Unique identifier
  title: string;       // Article title
  excerpt: string;     // Short excerpt/summary
  thumbnail: string;   // Image URL or Canvas-compressed Base64 string
  category: string;    // Main category (e.g. 韓國旅遊, 韓國文化)
  subCategory?: string; // Subcategory (e.g. 首爾自由行, 傳統節慶)
  date: string;        // Published date YYYY-MM-DD
  content: string;     // Markdown content
}

interface DynamicTaxonomy {
  [category: string]: {
    total: number;
    subCategories: { [sub: string]: number };
  };
}

const LOCAL_STORAGE_KEY = 'korea_explorer_blogs';
const ADMIN_STATUS_KEY = 'korea_explorer_admin_logged';

// ==========================================
// SEED DEFAULT ARTICLES
// ==========================================
const DEFAULT_POSTS: BlogPost[] = [
  {
    id: '1',
    title: '首爾必玩5天4夜自由行攻略：景點、美拍與韓服體驗一網打盡',
    excerpt: '首次造訪首爾不可錯過的五天四夜行程規劃！從古典端莊的景福宮韓服體驗，到充滿文青氣息的聖水洞逛街、漢江公園邊品嚐現煮拉麵，帶你跟著最新潮流輕鬆玩透首爾！',
    category: '韓國旅遊',
    subCategory: '首爾自由行',
    date: '2026-05-18',
    thumbnail: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=1200&q=80',
    content: `# 漫步首爾：現代與傳統交融的魔幻王國

首爾，這座充滿活力的首都，是許多人造訪韓國的第一站。它有著傲視全球的流行K-Pop文化、極具前衛設計感的精品商圈，卻也同時安靜保存了數百年歷史的王室宮殿與傳統韓屋。

本篇攻略專為**初訪首爾**的自由行旅客量身打造，精選最具代表性、最好拍、最道地的五天四夜行程。

---

## 🎒 行前超實用大補帖
在出發前，請務必先準備好這兩樣首爾旅遊神器：
- **氣候卡 (Climate Card) / T-money卡**：首爾的大眾運輸系統極度發達，使用交通卡可以享有轉乘優惠，省錢又方便。
- **地圖 App**：在韓國，使用 Google Maps 導航可能不夠精準。強烈建議下載 **Naver Map** 或 **Kakao Map**，輸入中文或韓文即可享有超精細的步行與電車轉乘導引！

---

## 🗓️ 經典行程亮點大公開

### Day 1：感受首爾的繁華起點 — 明洞與南山首爾塔
- **路線規劃**：抵達首爾 → 明洞飯店 Check-in → 明洞步行街品嚐小吃 → 搭乘纜車登上南山首爾塔看璀璨夜景。
- **美食推薦**：明洞餃子（米其林推薦的刀切麵與極致香辣的泡菜！）、路邊攤的「雞蛋糕」與「烤起司串」。

### Day 2：穿越時空之旅 — 景福宮、北村韓屋村與三清洞
- **景福宮韓服體驗**：穿著精美的傳統或改良韓服，可以**免費進入景福宮**參觀喔！在古色古香的勤政殿與慶會樓前留下經典照片。
- **北村韓屋村**：這裡是高官貴族曾居住的歷史宅邸區，至今仍有居民居住。請保持安靜，細細品味青瓦白牆下的歲月靜好。
- **三清洞**：沿街有許多充滿藝術氣氛的畫廊與獨立工坊，非常適合漫步。

> ⚠️ **韓服小叮嚀**：建議選擇上午 9:00~10:00 租借，避開正午烈日，拍照光線最柔和，衣服選擇也最齊全！

### Day 3：文青與潮流的天堂 — 聖水洞與首爾林
- **聖水洞**：舊工業區轉型而成的最潮文化聚落，被譽為「首爾的布魯克林」。各大知名品牌（如 DIOR 概念店）與無數獨立設計選物店、潮流買手店皆聚集於此。
- **首爾林**：都市中的廣闊綠洲，春秋兩季分別有櫻花與銀杏，非常適合買杯咖啡在草地上野餐。

### Day 4：悠閒午後與首爾日常 — 漢江公園與弘大商圈
- **汝矣島漢江公園**：學韓國人租一張野餐墊，使用神奇的「自動煮拉麵機」煮一碗熱騰騰的泡麵。加顆起司與雞蛋，搭配炸雞，看著江面微風欣賞日落，這就是最道地的首爾小確幸。
- **弘大商圈**：晚上可以到弘大觀看充滿活力的街頭藝人熱舞、唱歌表演，這裡也有全首爾最齊全的平價彩妝與服飾。

---

## 💡 總結
首爾是一個隨時都在變化的城市，不論去幾次總能發現新驚喜。趕快訂好機票，開啟你的首爾探險吧！`
  },
  {
    id: '2',
    title: '釜山蔚藍假期：海雲台膠囊小火車、機張雪蟹與廣安大橋夜景全收錄',
    excerpt: '熱情迷人的海洋城市釜山，是散心的最佳選擇！前往海雲台搭乘全韓最紅的彩虹膠囊火車，在機張大快朵頤巨無霸皇帝蟹，傍晚看著廣安大橋的夢幻點燈，體驗與首爾截然不同的海港休閒風情！',
    category: '韓國旅遊',
    subCategory: '釜山旅遊',
    date: '2026-05-20',
    thumbnail: 'https://images.unsplash.com/photo-1596701062351-df1f8d368903?auto=format&fit=crop&w=1200&q=80',
    content: `# 自在釜山：乘著海風在蔚藍海岸度假

蔚藍的天空、金黃的沙灘、加上無比新鮮的澎湃海鮮 —— 這就是釜山的魅力之處！比起氣候相對乾燥、生活步調緊湊的首爾，海港城市釜山透露出一股爽朗、熱情的「釜山男子漢」氛圍，讓人一踏上這塊土地就徹底放鬆。

本文帶你聚焦釜山最經典的「海天一線」美景，規劃一趟視覺與味覺的雙重極致之旅。

---

## 📸 釜山三大必去美拍與美食打卡點

### 1. 海雲台藍線公園 (Haeundae Blue Line Park) 彩虹天空膠囊火車
行駛在舊鐵道遺址上的 **天空艙小火車 (Sky capsule)**，色彩繽紛的外觀極為可愛！一輛車最多可搭乘四人，在離地數十公尺的高空軌道上慢速前行，腳下就是清澈見底的東海。
- **拍照秘訣**：建議買**尾浦站往青沙浦站**的方向，小火車行駛在靠近海的那一側，拍照完全不受遮擋！
- **周邊景點**：抵達青沙浦站後，記得去拍攝宛如《灌籃高手》場景的「鐵道海景平交道」，還有紅白雙子燈塔！

### 2. 機張市場 (Gijang Market) 的極致大雪蟹
來到釜山一定要吃一次海鮮！機張市場是全韓知名的螃蟹批發集散地。在這裡，你可以親自挑選活蹦亂跳、肉質飽滿的雪蟹或帝王蟹，現選、現殺、現蒸，保留最鮮甜的原汁原味。
- **美味伴隨**：店家會貼心地幫忙處理好蟹殼，吃起來毫不費力。最後一定要追加一碗由蟹膏、海苔跟麻油拌炒的「蟹膏炒飯」，裝在蟹殼裡端上來，香氣簡真令人銷魂！

### 3. 廣安里海灘 (Gwangalli Beach) 與廣安大橋夜景
廣安里是釜山年輕人最愛的聚會勝地，這裡最著名的就是橫跨海面的巨大**廣安大橋**。
- **華麗無比的夜晚**：每到晚間，廣安大橋會亮起繽紛的 LED 燈光秀。週末更會上演氣勢磅礡的「無人機燈光秀」，數百架無人機在夜空中排列成各種細緻圖案，令人編織夢想。
- **美景小貼士**：找一家沿海的露天咖啡廳或餐酒館，邊品嚐粉紅氣泡酒，邊看著海浪拍打沙灘，這才是真正的度假生活！`
  },
  {
    id: '3',
    title: '追劇指南：熱門韓劇取景地盤點！經典劇迷熱議打卡秘境',
    excerpt: '《淚之女王》、《鬼怪》到《愛的迫降》，這些經典韓劇名場面都是在哪裡拍的？為您詳細整理三大最夢幻的拍攝景點與最佳拍攝姿勢，教您如何規劃一趟夢幻的韓劇朝聖特輯！',
    category: '影視娛樂',
    subCategory: '韓劇推薦',
    date: '2026-05-21',
    thumbnail: 'https://images.unsplash.com/photo-1518156677180-95a2893f3e9f?auto=format&fit=crop&w=1200&q=80',
    content: `# 朝聖名場面：跟著熱門韓劇去旅行

韓國影視近年在全球掀起巨大浪潮，劇中精緻的運鏡、唯美的自然風光與精緻的建築，常讓觀眾在螢幕前一邊感動流淚，一邊驚嘆：「這到底是在哪裡拍的？好想去！」

今天就為大家精選三個熱門神劇的經典取景地，不只告訴你交通指南，更附上「主角同款拍照姿勢」，讓你的朝聖打卡照驚艷朋友圈。

---

## 🎬 嚴選韓劇拍攝聖地大剖析

### 📍 《淚之女王》金智媛的大花園 — 坡州碧草池文化樹木園
金秀賢與金智媛在劇中多個浪漫、談心與爭吵的背景，就是位於京畿道坡州的**碧草池文化樹木園**。這裡融合了優雅的法式庭園設計與韓國在地的天然森林景觀。
- **亮點名勝**：充滿古希臘神殿風格的「奧林匹斯庭園」，白色的雕像、壯麗的噴泉，搭配四季綻放的鮮花，無比奢華。
- **朝聖拍照指南**：穿上一身白裙，坐在歐洲噴泉廣場旁的長椅上，目光微望遠方，就是完美的女主角視角！

### 📍 《孤單又燦爛的神－鬼怪》吹熄蠟燭的海灘 — 江陵注文津防波堤
雖然這部史詩級神劇已經播畢多年，但江原道江陵市的**注文津防波堤**依舊是海內外遊客心中最經典的朝聖地！這裡是男女主角金信與池恩倬首次相遇、遞上蕎麥花束的地方。
- **現場經典情景**：由於朝聖遊客極多，防波堤旁甚至有當地商家租借「紅色圍巾」與「蕎麥花束」做為拍照道具！
- **安全提示**：防波堤兩側並無欄杆，風浪大時海浪可能直接拍打上來，拍照時一定要密切注意安全，避免滑倒。

### 📍 《愛的迫降》溫馨夜景漫步步道 — 忠州彈琴湖彩虹路
劇中多個溫馨的夜景與重要對話情節，劇組選在風景優美的**忠州彈琴湖彩虹路**。
- **夢幻無比的彩虹步道**：每當夜幕低垂，這條長長的環湖木棧道會亮起柔和漸變的彩虹光芒，倒映在波光粼粼的湖面上，顯得無比靜謐與浪漫。
- **交通小貼士**：從首爾出發可搭乘快速巴士前往忠州，非常適合做為大首爾近郊一日遊的悠閒行程。`
  },
  {
    id: '4',
    title: '韓食禮儀必修課：教你如何像道地韓國人一樣享受美食與餐桌社交',
    excerpt: '韓國飲食不只美味，背後更充滿有趣的餐桌規矩與社交文化！扁筷子是怎麼來的？吃烤肉要怎麼包才一口入魂？為什麼不能端起碗吃東西？本篇社交美食指南帶你一次搞懂！',
    category: '生活指南',
    subCategory: '韓式美食',
    date: '2026-05-22',
    thumbnail: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=1200&q=80',
    content: `# 韓食好滋味：從扁筷、泡菜到包飯，餐桌上的飲食美學

許多人愛上韓國是從舌尖開始的——金黃香脆的韓式炸雞、滋滋作響的韓式烤肉、暖心滋補的蔘雞湯。
不過，當你跟韓國朋友聚餐、或是身處當地的傳統餐館時，你是否曾因為拿著**沈甸甸的扁不鏽鋼筷**感到手酸？或者疑惑為什麼他們吃飯「手不能抬碗」？

其實，韓國的餐桌上大有學問。遵守這些精巧的禮儀，不只能讓你用餐更盡興，也能展現對於在地文化的尊重！

---

## 🥢 韓國社交餐桌的四大奇妙規矩

### 1. 扁筷與鋼碗：戰亂與衛生的歷史刻記
韓國人吃飯使用的餐具幾乎全是「不鏽鋼」材質。為什麼筷子是扁的呢？
- **防傾斜摔落**：早期韓國人有用餐時將餐盤端上低矮「炕桌」的習慣。扁筷子在擺放時不易隨便滾落掉到地上。
- **公共衛生**：不鏽鋼等金屬材質最早是宮廷用來檢測食物中是否有毒，後來因為耐用、便於高溫消毒，普及成了大家的餐勺。

### 2. 「端起碗吃飯」在韓國是沒禮貌的行為？
在許多亞洲國家，端起飯碗、以口就碗是標準的吃飯動作。但在韓國恰恰相反！
- **不端碗更端莊**：韓國人認為端著碗吃飯是不夠端莊、或者是乞丐的吃法。筷子與飯碗必須安放在床炕桌上，吃飯是用金屬長湯匙一口一口舀起湯跟飯送入口中。
- **口訣**：**湯匙用來吃飯與喝湯，筷子用來夾配菜**。兩者不可同時握在同一隻手！

### 3. 韓式烤肉包飯：完美「一口塞」的黃金公式
吃烤肉時，韓國人會拿一片清脆的生菜（如果是芝麻葉更好，香氣更足），在葉片上刷上一點韓式特調大醬 (Ssamjang)，放上剛烤好、油脂閃爍的五花肉片，加上烤大蒜、泡菜與蔥絲。
- **終極重點**：將生菜包成一個精緻的小球，**必須整粒一口送入嘴裡**！
- **包福吃法**：分成多口咬會導致生菜裡面的肉汁與大醬溢出，在餐桌上顯得有些狼狽。而且「包飯 (Ssam)」在韓文裡有「包福」的意思，完整吞下去代表把福氣全吃進去！

### 4. 敬酒文化：手肘撐托的長幼禮儀
長輩或主管為你倒酒時，必須雙手迎接，右手拿杯，左手輕托右手手肘或置於胸前示敬；喝的時候，身體朝向側面、背對長輩，並用左手稍微遮擋酒杯，一口飲盡。這代表對長輩的崇高敬意。

---

## 🍗 結語
韓國美食的精髓不只在於調味本身，更在於人與人圍繞餐桌，分享熱騰騰的鍋物、大嚼烤肉時的歡樂與溫度。下一次前往韓國時，試著把碗放在桌上用湯匙、將烤肉包成完美的福氣一口塞，你也會大呼道地！`
  }
];

// ==========================================
// HIGH-QUALITY CUSTOM MARKDOWN RENDERER
// ==========================================
function MarkdownRenderer({ content }: { content: string }) {
  const parseInline = (text: string): React.ReactNode[] => {
    // Parser for **bold**, [text](url), and plain text inline elements
    const regex = /(\*\*.*?\*\*|\[.*?\]\(.*?\))/g;
    const parts = text.split(regex);
    
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={index} className="font-bold text-slate-900 border-b border-rose-100 pb-0.5">
            {part.slice(2, -2)}
          </strong>
        );
      }
      const linkMatch = part.match(/\[(.*?)\]\((.*?)\)/);
      if (linkMatch) {
         return (
           <a 
             key={index} 
             href={linkMatch[2]} 
             className="text-rose-600 hover:text-rose-700 underline font-medium transition-colors" 
             target="_blank" 
             rel="noreferrer"
           >
             {linkMatch[1]}
           </a>
         );
      }
      return part;
    });
  };

  const lines = content.split('\n');
  const renderedElements: React.ReactNode[] = [];
  let currentList: React.ReactNode[] = [];
  let isInsideList = false;

  const pushCurrentList = () => {
    if (currentList.length > 0) {
      renderedElements.push(
        <ul key={`list-${renderedElements.length}`} className="list-disc pl-6 my-4 space-y-2 text-slate-700">
          {currentList}
        </ul>
      );
      currentList = [];
      isInsideList = false;
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmedLine = line.trim();

    // Bullet lists starting with '-' or '*'
    if (trimmedLine.startsWith('- ') || trimmedLine.startsWith('* ')) {
      isInsideList = true;
      const bulletText = trimmedLine.substring(2);
      currentList.push(
        <li key={`li-${i}`} className="text-slate-700 tracking-normal text-base md:text-md leading-relaxed">
          {parseInline(bulletText)}
        </li>
      );
      continue;
    } else if (isInsideList && trimmedLine === '') {
      pushCurrentList();
    } else if (isInsideList && !trimmedLine.startsWith('- ') && !trimmedLine.startsWith('* ')) {
      pushCurrentList();
    }

    if (trimmedLine.startsWith('# ')) {
      renderedElements.push(
        <h2 key={i} className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 mt-8 mb-4 pt-4 border-t border-slate-100 first:border-0 first:mt-0 first:pt-0 font-sans">
          {parseInline(trimmedLine.substring(2))}
        </h2>
      );
    } else if (trimmedLine.startsWith('## ')) {
      renderedElements.push(
        <h3 key={i} className="text-xl md:text-2xl font-bold tracking-tight text-slate-900 mt-6 mb-3 font-sans">
          {parseInline(trimmedLine.substring(3))}
        </h3>
      );
    } else if (trimmedLine.startsWith('### ')) {
      renderedElements.push(
        <h4 key={i} className="text-lg md:text-xl font-semibold text-slate-800 mt-5 mb-2 font-sans">
          {parseInline(trimmedLine.substring(4))}
        </h4>
      );
    } else if (trimmedLine.startsWith('> ')) {
      renderedElements.push(
        <blockquote key={i} className="border-l-4 border-rose-500 bg-rose-50/40 pl-4 py-3 pr-2 my-5 rounded-r italic text-slate-700 font-sans">
          {parseInline(trimmedLine.substring(2))}
        </blockquote>
      );
    } else if (trimmedLine.startsWith('---')) {
      renderedElements.push(
        <hr key={i} className="my-6 border-slate-100" />
      );
    } else if (trimmedLine === '') {
      // Empty line skips
    } else {
      // Normal paragraph
      renderedElements.push(
        <p key={i} className="text-slate-700 leading-relaxed mb-4 text-base antialiased">
          {parseInline(line)}
        </p>
      );
    }
  }

  pushCurrentList();

  return <div className="prose max-w-none text-slate-800 font-sans">{renderedElements}</div>;
}

// ==========================================
// IMAGE COMPRESSOR (LIMIT 800PX, 0.7 QUALITY CLASS)
// ==========================================
const compressImage = (file: File): Promise<{ base64: string; originalSize: number; compressedSize: number }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        const maxDim = 800;

        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error("無法建立 2D 畫布內容"));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        // Compressed JPEG content with 0.7 quality
        const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
        const approxSize = Math.round(dataUrl.length * 0.75);
        resolve({
          base64: dataUrl,
          originalSize: file.size,
          compressedSize: approxSize
        });
      };
      img.onerror = () => reject(new Error("圖片載入失敗"));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error("檔案讀取失敗"));
    reader.readAsDataURL(file);
  });
};

// ==========================================
// MAIN COMPONENT
// ==========================================
export default function App() {
  // --- Posts & Sync Admin States ---
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isInitializing, setIsInitializing] = useState<boolean>(true);

  // --- Filtering & Search ---
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState<number>(6);

  // --- Router & Nav States ---
  const [activePostId, setActivePostId] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  // --- Custom Modals States ---
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
  const [loginPassword, setLoginPassword] = useState<string>('');
  const [loginError, setLoginError] = useState<string>('');

  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState<boolean>(false);
  const [postToEdit, setPostToEdit] = useState<BlogPost | null>(null);

  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState<boolean>(false);
  const [postToDelete, setPostToDelete] = useState<BlogPost | null>(null);

  // --- CMS Form Fields ---
  const [formTitle, setFormTitle] = useState<string>('');
  const [formCategory, setFormCategory] = useState<string>('');
  const [formSubCategory, setFormSubCategory] = useState<string>('');
  const [formExcerpt, setFormExcerpt] = useState<string>('');
  const [formDate, setFormDate] = useState<string>('');
  const [formContent, setFormContent] = useState<string>('');
  
  // Image Upload Fields
  const [imageTab, setImageTab] = useState<'url' | 'upload'>('url');
  const [formImageUrl, setFormImageUrl] = useState<string>('');
  const [compressedImageBase64, setCompressedImageBase64] = useState<string>('');
  const [compressionMetrics, setCompressionMetrics] = useState<{ original: number; compressed: number } | null>(null);
  const [isCompressing, setIsCompressing] = useState<boolean>(false);

  const contentTextareaRef = useRef<HTMLTextAreaElement>(null);

  // --- Custom Notification Banner (Toast) ---
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // ==========================================
  // INITIALIZATION & DATABASE STORAGE
  // ==========================================
  useEffect(() => {
    const initializeApp = async () => {
      // 1. Check Admin Auth
      try {
        const storedAdmin = localStorage.getItem(ADMIN_STATUS_KEY);
        if (storedAdmin === 'true') {
          setIsAdmin(true);
        }
      } catch (e) {
        console.warn("Storage access restricted for admin state check:", e);
      }

      // 2. Load Blog Database
      try {
        const data = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (data) {
          const parsed = JSON.parse(data);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setPosts(parsed);
            setIsInitializing(false);
            return;
          }
        }
      } catch (e) {
        console.warn("Storage access restricted for blog post loading:", e);
      }

      // If storage is empty, populate with default seed articles
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(DEFAULT_POSTS));
      } catch (e) {
        console.warn("Could not seed data to localStorage:", e);
      }
      setPosts(DEFAULT_POSTS);
      setIsInitializing(false);
    };

    initializeApp();
  }, []);

  // ==========================================
  // ZERO-DEPENDENCY ROUTER & SANDBOX FALLBACK
  // ==========================================
  // Synchronize React state with URL parameters
  useEffect(() => {
    const handleUrlSync = () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const postId = params.get('post');
        const cat = params.get('category');
        const sub = params.get('subcategory');

        if (postId !== activePostId) setActivePostId(postId);
        if (cat !== selectedCategory) setSelectedCategory(cat);
        if (sub !== selectedSubCategory) setSelectedSubCategory(sub);
      } catch (e) {
        console.warn("Cannot access URL params directly (Sandbox Frame restriction). Falling back to state-driven navigation.", e);
      }
    };

    // Initialize once
    handleUrlSync();

    // Listen to history updates
    window.addEventListener('popstate', handleUrlSync);
    return () => {
      window.removeEventListener('popstate', handleUrlSync);
    };
  }, []);

  // Safe Navigation Manager with pushState Protection
  const navigateTo = (changes: { 
    post?: string | null; 
    category?: string | null; 
    subcategory?: string | null; 
    clearAll?: boolean;
  }) => {
    // Determine target fields
    let nextPostId = changes.post !== undefined ? changes.post : activePostId;
    let nextCategory = changes.category !== undefined ? changes.category : selectedCategory;
    let nextSubCategory = changes.subcategory !== undefined ? changes.subcategory : selectedSubCategory;

    if (changes.clearAll) {
      nextPostId = null;
      nextCategory = null;
      nextSubCategory = null;
      setSearchQuery('');
    }

    // Reset pagination on list context shift
    if (changes.category !== undefined || changes.subcategory !== undefined || changes.clearAll) {
      setVisibleCount(6);
      nextPostId = null; // Close reader mode when category filter changes
    }

    // Update internal React states (This guarantees correct behaviour regardless of Sandbox permissions)
    setActivePostId(nextPostId);
    setSelectedCategory(nextCategory);
    setSelectedSubCategory(nextSubCategory);

    // Apply viewport scroll
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Safe Window PushState wrapper
    try {
      const url = new URL(window.location.href);
      
      // Clean up previous query params to avoid cluttering
      url.searchParams.delete('post');
      url.searchParams.delete('category');
      url.searchParams.delete('subcategory');

      if (nextPostId) url.searchParams.set('post', nextPostId);
      if (nextCategory) url.searchParams.set('category', nextCategory);
      if (nextSubCategory) url.searchParams.set('subcategory', nextSubCategory);

      window.history.pushState({}, '', url.toString());
    } catch (err) {
      // Silent intercept if pushState violates sandbox security policies
      console.warn("PushState blocked by sandbox policy. Switched to internal React-driven routing successfully.");
    }
  };

  // ==========================================
  // DYNAMIC TAXONOMY & COUNTING
  // ==========================================
  const taxonomy = useMemo<DynamicTaxonomy>(() => {
    const result: DynamicTaxonomy = {};
    posts.forEach(post => {
      const cat = post.category || '未分類';
      if (!result[cat]) {
        result[cat] = { total: 0, subCategories: {} };
      }
      result[cat].total += 1;

      if (post.subCategory) {
        const sub = post.subCategory;
        result[cat].subCategories[sub] = (result[cat].subCategories[sub] || 0) + 1;
      }
    });
    return result;
  }, [posts]);

  // Extract list of all unique Category and Subcategory strings for form autocompletion autocomplete <datalist>
  const uniqueCategories = useMemo(() => {
    return Array.from(new Set(posts.map(p => p.category).filter(Boolean)));
  }, [posts]);

  const uniqueSubCategories = useMemo(() => {
    return Array.from(new Set(posts.map(p => p.subCategory).filter(Boolean))) as string[];
  }, [posts]);

  // Match icon for categories
  const getCategoryTheme = (category: string) => {
    switch (category) {
      case '韓國旅遊':
        return { icon: Plane, color: 'text-sky-600 bg-sky-50 border-sky-100 hover:bg-sky-100/50' };
      case '韓國文化':
        return { icon: BookOpen, color: 'text-amber-600 bg-amber-50 border-amber-100 hover:bg-amber-100/50' };
      case '影視娛樂':
        return { icon: Film, color: 'text-purple-600 bg-purple-50 border-purple-100 hover:bg-purple-100/50' };
      case '生活指南':
        return { icon: Heart, color: 'text-rose-600 bg-rose-50 border-rose-100 hover:bg-rose-100/50' };
      default:
        return { icon: Compass, color: 'text-slate-600 bg-slate-50 border-slate-100 hover:bg-slate-100/50' };
    }
  };

  // ==========================================
  // SEARCH & FILTERING LOGIC
  // ==========================================
  const filteredPosts = useMemo(() => {
    return posts.filter(post => {
      // 1. Category check
      if (selectedCategory && post.category !== selectedCategory) {
        return false;
      }
      // 2. Subcategory check
      if (selectedSubCategory && post.subCategory !== selectedSubCategory) {
        return false;
      }
      // 3. Search text check (case insensitive check across title, excerpt, content, categories)
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        const mainCat = (post.category || '').toLowerCase();
        const subCat = (post.subCategory || '').toLowerCase();
        const titleText = (post.title || '').toLowerCase();
        const excerptText = (post.excerpt || '').toLowerCase();
        const contentText = (post.content || '').toLowerCase();

        return (
          titleText.includes(query) ||
          excerptText.includes(query) ||
          contentText.includes(query) ||
          mainCat.includes(query) ||
          subCat.includes(query)
        );
      }
      return true;
    }).sort((a, b) => b.date.localeCompare(a.date)); // Sort by date descending (Newest first)
  }, [posts, selectedCategory, selectedSubCategory, searchQuery]);

  const activePost = useMemo(() => {
    if (!activePostId) return null;
    return posts.find(p => p.id === activePostId) || null;
  }, [posts, activePostId]);

  // Related articles in the same category
  const relatedPosts = useMemo(() => {
    if (!activePost) return [];
    return posts
      .filter(p => p.category === activePost.category && p.id !== activePost.id)
      .slice(0, 2);
  }, [posts, activePost]);

  // ==========================================
  // CORE FUNCTIONS: LOGIN & LOGOUT
  // ==========================================
  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginPassword === 'admin123') {
      setIsAdmin(true);
      try {
        localStorage.setItem(ADMIN_STATUS_KEY, 'true');
      } catch (err) {
        console.warn("Storage write restricted for login persistence");
      }
      showToast('管理員登入成功！已開啟文章管理權限。', 'success');
      setLoginPassword('');
      setLoginError('');
      setIsLoginModalOpen(false);
    } else {
      setLoginError('密碼錯誤！請輸入預設密碼 admin123 進行測試。');
    }
  };

  const handleAdminLogout = () => {
    setIsAdmin(false);
    try {
      localStorage.removeItem(ADMIN_STATUS_KEY);
    } catch {
      // ignore
    }
    showToast('已登出管理員角色。', 'info');
  };

  // ==========================================
  // CORE FUNCTIONS: CRUD ACTIONS
  // ==========================================
  // Open create form modal
  const handleOpenAddForm = () => {
    setPostToEdit(null);
    setFormTitle('');
    setFormCategory('韓國旅遊');
    setFormSubCategory('');
    setFormExcerpt('');
    const today = new Date().toISOString().split('T')[0];
    setFormDate(today);
    setFormContent('');
    setImageTab('url');
    setFormImageUrl('https://images.unsplash.com/photo-1517154421773-0529f29ea451?auto=format&fit=crop&w=1200&q=80');
    setCompressedImageBase64('');
    setCompressionMetrics(null);
    setIsAddEditModalOpen(true);
  };

  // Open edit form modal
  const handleOpenEditForm = (post: BlogPost) => {
    setPostToEdit(post);
    setFormTitle(post.title || '');
    setFormCategory(post.category || '');
    setFormSubCategory(post.subCategory || '');
    setFormExcerpt(post.excerpt || '');
    setFormDate(post.date || '');
    setFormContent(post.content || '');
    
    if (post.thumbnail.startsWith('data:image')) {
      setImageTab('upload');
      setCompressedImageBase64(post.thumbnail);
      setFormImageUrl('');
      setCompressionMetrics(null);
    } else {
      setImageTab('url');
      setFormImageUrl(post.thumbnail);
      setCompressedImageBase64('');
      setCompressionMetrics(null);
    }
    setIsAddEditModalOpen(true);
  };

  // Submit add/edit form
  const handleSavePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formCategory.trim() || !formExcerpt.trim() || !formContent.trim()) {
      showToast('請完成所有必填欄位！', 'error');
      return;
    }

    const finalThumbnail = imageTab === 'upload' ? compressedImageBase64 : formImageUrl;
    if (!finalThumbnail) {
      showToast('請提供文章首圖網址或上傳圖片檔案！', 'error');
      return;
    }

    let updatedPostsList: BlogPost[] = [];

    if (postToEdit) {
      // Update action
      updatedPostsList = posts.map(p => {
        if (p.id === postToEdit.id) {
          return {
            ...p,
            title: formTitle,
            category: formCategory,
            subCategory: formSubCategory || undefined,
            excerpt: formExcerpt,
            date: formDate,
            content: formContent,
            thumbnail: finalThumbnail
          };
        }
        return p;
      });
      showToast('文章修改成功！');
    } else {
      // Add action
      const newPost: BlogPost = {
        id: Date.now().toString(),
        title: formTitle,
        category: formCategory,
        subCategory: formSubCategory || undefined,
        excerpt: formExcerpt,
        date: formDate,
        content: formContent,
        thumbnail: finalThumbnail
      };
      updatedPostsList = [newPost, ...posts];
      showToast('新文章釋出成功！');
    }

    // Persist to local database
    setPosts(updatedPostsList);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedPostsList));
    } catch (err) {
      console.warn("Storage limits or permissions blocked savings locally:", err);
    }

    setIsAddEditModalOpen(false);
  };

  // Trigger Delete confirmation dialog
  const triggerDelete = (post: BlogPost) => {
    setPostToDelete(post);
    setIsDeleteConfirmOpen(true);
  };

  // Confirmed Delete operation
  const confirmDeletePost = () => {
    if (!postToDelete) return;
    const remainingPosts = posts.filter(p => p.id !== postToDelete.id);
    setPosts(remainingPosts);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(remainingPosts));
    } catch {
      // ignore
    }

    showToast(`文章《${postToDelete.title}》已成功刪除。`, 'info');
    setIsDeleteConfirmOpen(false);
    setPostToDelete(null);

    // If current viewer is reading the deleted post, redirect to list
    if (activePostId === postToDelete.id) {
      navigateTo({ post: null });
    }
  };

  // ==========================================
  // IMAGE COMPRESSOR HANDLER
  // ==========================================
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('請務必選擇圖片格式檔案！', 'error');
      return;
    }

    setIsCompressing(true);
    try {
      const result = await compressImage(file);
      setCompressedImageBase64(result.base64);
      setCompressionMetrics({
        original: result.originalSize,
        compressed: result.compressedSize
      });
      showToast('圖片載入成功，已由背景 Canvas 特效壓縮最佳化！');
    } catch (err) {
      console.error(err);
      showToast('圖片壓縮失敗，請提供一般圖片 URL 底代替。', 'error');
    } finally {
      setIsCompressing(false);
    }
  };

  // ==========================================
  // MARKDOWN TEXT AREA UTILITY HELPERS
  // ==========================================
  const insertMarkdownTag = (prefix: string, suffix: string = '') => {
    const textarea = contentTextareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const currentVal = formContent;

    const selectedText = currentVal.substring(start, end);
    const textBefore = currentVal.substring(0, start);
    const textAfter = currentVal.substring(end);

    const replacement = textBefore + prefix + (selectedText || '') + suffix + textAfter;
    setFormContent(replacement);

    // Reposition cursor nicely after state sync completes
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + prefix.length + (selectedText ? selectedText.length : 0);
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 10);
  };

  // Copy current full page share url
  const copyShareLink = (postTitle: string) => {
    const link = window.location.href;
    try {
      navigator.clipboard.writeText(link);
      showToast(`《${postTitle.slice(0, 15)}...》的分享連結已複製到剪貼簿！`, 'success');
    } catch (err) {
      showToast('複製鏈接失敗，可以使用瀏覽器頂部網址進行分享。', 'info');
    }
  };

  // ==========================================
  // RENDER SEEPING LOADER
  // ==========================================
  if (isInitializing) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center font-sans">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-rose-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 font-medium tracking-wide">韓國探索網資料庫載入中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans selection:bg-rose-100 selection:text-rose-900 leading-normal antialiased">
      
      {/* ==========================================
          DYNAMIC CUSTOM NOTIFICATION (TOAST BANNER)
          ========================================== */}
      {toast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 animate-bounce">
          <div className={`shadow-xl px-5 py-3 rounded-full flex items-center space-x-3 text-sm font-semibold tracking-wide border ${
            toast.type === 'success' 
              ? 'bg-rose-50 text-rose-800 border-rose-100' 
              : toast.type === 'error' 
                ? 'bg-red-50 text-red-800 border-red-100' 
                : 'bg-blue-50 text-blue-800 border-blue-100'
          }`}>
            {toast.type === 'success' ? (
              <span className="w-5 h-5 bg-rose-500 text-white rounded-full flex items-center justify-center text-xs">✓</span>
            ) : toast.type === 'error' ? (
              <span className="w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs">✕</span>
            ) : (
              <span className="w-5 h-5 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs">i</span>
            )}
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {/* ==========================================
          HEADER LAYER & NAVIGATION
          ========================================== */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-rose-100/40 shadow-sm transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-18">
            
            {/* Logo / Branding */}
            <div className="flex items-center space-x-3 cursor-pointer select-none group" onClick={() => navigateTo({ clearAll: true })}>
              <div className="relative w-10 h-10 bg-rose-500 rounded-xl flex items-center justify-center shadow-md shadow-rose-200 overflow-hidden transform group-hover:scale-105 transition-transform duration-300">
                <div className="absolute top-0 left-0 w-full h-1/2 bg-blue-600"></div>
                <div className="absolute inset-0.5 bg-white rounded-lg flex items-center justify-center">
                  <span className="font-extrabold text-[#3B4CA0] text-sm tracking-tighter">KR</span>
                </div>
                <div className="absolute w-2.5 h-2.5 bg-rose-500 rounded-full animate-ping opacity-75"></div>
              </div>
              <div>
                <span className="block font-bold text-lg text-slate-800 tracking-tight leading-tight">韓國探索網</span>
                <span className="block text-[10px] text-slate-400 font-mono tracking-widest uppercase">Korea Explorer</span>
              </div>
            </div>

            {/* Desktop Dynamic Categories Navbar Tabs */}
            <nav className="hidden md:flex items-center space-x-1">
              <button 
                onClick={() => navigateTo({ category: null, subcategory: null })}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  !selectedCategory 
                    ? 'bg-rose-500 text-white shadow-sm' 
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                首頁全部
              </button>

              {Object.keys(taxonomy).map(catName => {
                const { icon: CatIcon, color: catStyles } = getCategoryTheme(catName);
                const isCatSelected = selectedCategory === catName;
                const catTax = taxonomy[catName];

                return (
                  <div key={catName} className="relative group/menu py-1">
                    <button 
                      onClick={() => navigateTo({ category: catName, subcategory: null })}
                      className={`px-4 py-2 rounded-full text-sm font-medium flex items-center space-x-1.5 transition-all ${
                        isCatSelected 
                          ? 'bg-rose-50 text-rose-600 font-bold border border-rose-200' 
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 border border-transparent'
                      }`}
                    >
                      <CatIcon className="w-4 h-4" />
                      <span>{catName}</span>
                      <ChevronDown className="w-3.5 h-3.5 opacity-60 group-hover/menu:rotate-180 transition-transform duration-200" />
                    </button>

                    {/* Subcategories Hover Dropdown menu with counting badges */}
                    <div className="absolute top-full left-0 mt-1 w-60 bg-white rounded-2xl shadow-xl border border-slate-100 opacity-0 invisible group-hover/menu:opacity-100 group-hover/menu:visible transition-all duration-200 transform translate-y-2 group-hover/menu:translate-y-0 z-50 p-2">
                      <div className="px-3 py-2 text-xs font-semibold text-slate-400 border-b border-slate-50 mb-1 flex items-center justify-between">
                        <span>子分類導覽</span>
                        <span>共 {catTax.total} 篇</span>
                      </div>
                      
                      <button 
                        onClick={() => navigateTo({ category: catName, subcategory: null })}
                        className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold hover:bg-rose-50/50 flex justify-between items-center ${
                          isCatSelected && !selectedSubCategory ? 'bg-rose-50 text-rose-600' : 'text-slate-700'
                        }`}
                      >
                        <span>全部 {catName} 回顧</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>

                      {Object.keys(catTax.subCategories).map(subName => {
                        const isSubSelected = selectedSubCategory === subName;
                        const subCount = catTax.subCategories[subName];
                        return (
                          <button 
                            key={subName}
                            onClick={() => navigateTo({ category: catName, subcategory: subName })}
                            className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium hover:bg-slate-50 transition-colors flex justify-between items-center ${
                              isSubSelected ? 'bg-rose-50/80 text-rose-600 font-semibold' : 'text-slate-600'
                            }`}
                          >
                            <span>{subName}</span>
                            <span className="px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded-full text-[10px] scale-90">{subCount}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </nav>

            {/* Quick Actions Search & Administrative Actions */}
            <div className="hidden md:flex items-center space-x-3">
              {isAdmin && (
                <button 
                  onClick={handleOpenAddForm}
                  className="bg-rose-500 text-white text-xs font-semibold py-2 px-4 rounded-full flex items-center space-x-1.5 shadow-md shadow-rose-200 hover:bg-rose-600 hover:scale-105 transition-all duration-300"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>新增文章</span>
                </button>
              )}

              {isAdmin ? (
                <div className="flex items-center space-x-2 bg-slate-100 hover:bg-slate-200 pl-3 pr-2 py-1.5 rounded-full border border-slate-200/50 transition-colors">
                  <div className="flex items-center space-x-1">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></span>
                    <span className="text-[11px] text-slate-700 font-bold tracking-wide">管理員（已登入）</span>
                  </div>
                  <button 
                    onClick={handleAdminLogout}
                    title="登出管理系統"
                    className="p-1 hover:bg-slate-300 rounded-full text-slate-500 hover:text-slate-700 transition-all"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => setIsLoginModalOpen(true)}
                  className="text-slate-500 hover:text-slate-800 p-2 hover:bg-slate-50 rounded-full transition-colors flex items-center space-x-1"
                >
                  <Lock className="w-4 h-4 text-slate-400" />
                  <span className="text-xs font-medium">後台入口</span>
                </button>
              )}
            </div>

            {/* Hamburger Button for Mobile screens */}
            <div className="md:hidden flex items-center space-x-2">
              {isAdmin && (
                <button 
                  onClick={handleOpenAddForm}
                  className="bg-rose-500 text-white p-2 rounded-full shadow-md shadow-rose-100"
                >
                  <Plus className="w-4 h-4" />
                </button>
              )}
              <button 
                onClick={() => setMobileMenuOpen(true)}
                className="p-2 text-slate-600 hover:bg-slate-100 rounded-xl transition-all"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* ==========================================
          MOBILE NAV OVERLAY DRAWER 
          ========================================== */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          {/* Half opaque black screen mask */}
          <div 
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity duration-300"
            onClick={() => setMobileMenuOpen(false)}
          ></div>

          {/* Drawer sheet sliding context */}
          <div className="relative w-80 max-w-sm bg-white h-full flex flex-col shadow-2xl z-10 p-5 transform transition-transform duration-300 overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-sm text-white bg-rose-500 px-2 py-1 rounded">KR</span>
                <span className="font-bold text-slate-800 text-base">選單與全部分類</span>
              </div>
              <button 
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 bg-slate-100 rounded-full hover:bg-slate-200 text-slate-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex flex-col space-y-5 py-4 flex-1">
              {/* Reset view */}
              <button 
                onClick={() => {
                  navigateTo({ clearAll: true });
                  setMobileMenuOpen(false);
                }}
                className={`w-full py-2.5 px-4 rounded-xl text-left text-sm font-semibold flex items-center space-x-2 ${
                  !selectedCategory ? 'bg-rose-500 text-white shadow-sm' : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Compass className="w-4 h-4" />
                <span>所有精選文章 (全部)</span>
              </button>

              {/* Dynamic Categories lists */}
              <div className="space-y-4">
                <span className="block text-[11px] font-bold text-slate-400 tracking-wider uppercase">主類別與子目錄</span>
                
                {Object.keys(taxonomy).map(catName => {
                  const { icon: CatIcon } = getCategoryTheme(catName);
                  const isCatSelected = selectedCategory === catName;
                  const catData = taxonomy[catName];

                  return (
                    <div key={catName} className="space-y-1.5 bg-slate-50/50 p-2.5 rounded-xl border border-slate-100">
                      <button 
                        onClick={() => {
                          navigateTo({ category: catName, subcategory: null });
                          setMobileMenuOpen(false);
                        }}
                        className={`w-full text-left font-semibold text-sm flex items-center justify-between px-2 py-1 ${
                          isCatSelected ? 'text-rose-600 font-extrabold' : 'text-slate-800'
                        }`}
                      >
                        <span className="flex items-center space-x-2">
                          <CatIcon className="w-4 h-4" />
                          <span>{catName}</span>
                        </span>
                        <span className="bg-slate-200/50 text-slate-600 px-2 py-0.5 rounded-full text-[10px] font-mono">{catData.total}</span>
                      </button>

                      {/* Subcategory sublist in drawer */}
                      {Object.keys(catData.subCategories).length > 0 && (
                        <div className="pl-6 pt-1 space-y-1 border-l-2 border-slate-100 ml-3.5">
                          {Object.keys(catData.subCategories).map(subName => {
                            const isSubSelected = selectedSubCategory === subName;
                            const subCount = catData.subCategories[subName];
                            return (
                              <button
                                key={subName}
                                onClick={() => {
                                  navigateTo({ category: catName, subcategory: subName });
                                  setMobileMenuOpen(false);
                                }}
                                className={`w-full text-left text-xs py-1 px-2 rounded hover:bg-slate-100 flex justify-between items-center ${
                                  isSubSelected ? 'text-rose-600 bg-rose-50/50 font-bold' : 'text-slate-500'
                                }`}
                              >
                                <span>{subName}</span>
                                <span className="text-[10px] text-slate-400 font-mono">({subCount})</span>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Admin Area Inside Mobile menu */}
              <div className="pt-4 border-t border-slate-100">
                {isAdmin ? (
                  <div className="space-y-2">
                    <div className="bg-emerald-50 text-emerald-800 border border-emerald-100 text-xs px-3 py-2 rounded-xl flex items-center justify-between font-medium">
                      <span>✓ 管理員已登入</span>
                      <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></span>
                    </div>
                    <button 
                      onClick={() => {
                        handleAdminLogout();
                        setMobileMenuOpen(false);
                      }}
                      className="w-full bg-slate-100 text-slate-700 py-2.5 px-4 rounded-xl text-center text-xs font-bold hover:bg-slate-200 transition-colors flex items-center justify-center space-x-1"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>安全登出後臺管理</span>
                    </button>
                  </div>
                ) : (
                  <button 
                    onClick={() => {
                      setIsLoginModalOpen(true);
                      setMobileMenuOpen(false);
                    }}
                    className="w-full bg-slate-100 text-slate-700 py-2.5 px-4 rounded-xl text-center text-xs font-bold hover:bg-slate-200 transition-colors flex items-center justify-center space-x-1"
                  >
                    <Lock className="w-3.5 h-3.5 text-slate-400" />
                    <span>登入管理系統後台</span>
                  </button>
                )}
              </div>

            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          MAIN AREA HERO SECTION
          ========================================== */}
      {!activePost && (
        <div className="relative bg-teal-950 text-white py-16 md:py-24 overflow-hidden shadow-inner font-sans">
          {/* Unsplash abstract beautiful background image layer */}
          <div className="absolute inset-0 z-0">
            <img 
              src="https://images.unsplash.com/photo-1548115184-bc6544d06a58?auto=format&fit=crop&w=1600&h=600&q=70" 
              alt="Korea Banner" 
              className="w-full h-full object-cover filter brightness-35 scale-105"
            />
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10 text-center flex flex-col items-center">
            
            <div className="inline-flex items-center space-x-2 bg-rose-500/90 text-white rounded-full px-4 py-1.5 text-xs font-semibold tracking-wider uppercase shadow-md mb-6 animate-pulse">
              <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
              <span>探索大韓魅力 • 文化旅遊生活指南</span>
            </div>

            <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold tracking-tight font-sans text-white mb-4">
              發現你所不知道的韓國
            </h1>
            <p className="max-w-2xl text-sm md:text-lg text-slate-200 font-light leading-relaxed mb-8">
              我們為你推薦最道地的自由行指南、探索影視潮流中的人氣祕境，更帶你解讀深厚的傳統文化，用文字與精彩影像引領你漫步韓風大地。
            </p>

            {/* Instant Web Search Bar */}
            <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-1 md:p-1.5 flex items-center border border-slate-100/50">
              <div className="flex items-center pl-3 pr-2 text-slate-400">
                <Search className="w-5 h-5 text-slate-400 shrink-0" />
              </div>
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="搜尋韓國文章題材、自由行、飲食文化..."
                className="w-full px-2 py-3 bg-transparent text-slate-800 focus:outline-none placeholder-slate-400 text-sm md:text-base font-normal"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="p-2 mr-1 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Micro Tags Quick Picker */}
            <div className="mt-5 flex flex-wrap justify-center gap-1.5 text-xs text-slate-300">
              <span className="text-slate-400 mr-1.5 self-center">推薦關鍵字：</span>
              {['首爾', '釜山', '韓服', '韓劇', '包飯', '地圖App'].map(kw => (
                <button 
                  key={kw} 
                  onClick={() => setSearchQuery(kw)}
                  className="px-2.5 py-1 bg-white/10 hover:bg-white/20 hover:text-white rounded-full transition-colors font-medium border border-white/5"
                >
                  #{kw}
                </button>
              ))}
            </div>

          </div>
        </div>
      )}

      {/* ==========================================
          THE GRID CARD LAYOUT AREA / READER PAGE CONTEX
          ========================================== */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 flex-1 w-full">
        
        {activePost ? (
          // ==========================================
          // ARTICLE FULL READER VIEW
          // ==========================================
          <article className="bg-white rounded-3xl overflow-hidden shadow-md border border-slate-100 max-w-4xl mx-auto">
            
            {/* Header image banner block */}
            <div className="relative h-[25rem] md:h-[30rem] w-full overflow-hidden bg-slate-900 group">
              <img 
                src={activePost.thumbnail} 
                alt={activePost.title} 
                className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-700 picker-image referrer-policy-none"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/35 to-transparent"></div>
              
              {/* Floating control on reader cover */}
              <div className="absolute top-5 left-5 z-10">
                <button 
                  onClick={() => navigateTo({ post: null })}
                  className="inline-flex items-center space-x-2 bg-white/90 hover:bg-white text-slate-800 text-xs font-bold py-2.5 px-4 rounded-full shadow-lg hover:translate-x-[-2px] transition-all"
                >
                  <ArrowLeft className="w-4 h-4 text-slate-800" />
                  <span>返回文章列表</span>
                </button>
              </div>

              {/* Floating taxonomy categories bubbles */}
              <div className="absolute bottom-6 left-6 right-6 z-10 text-white">
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="px-3 py-1 bg-rose-500 text-white text-xs font-bold rounded-full shadow-lg">
                    {activePost.category}
                  </span>
                  {activePost.subCategory && (
                    <span className="px-3 py-1 bg-white/25 backdrop-blur-md text-white text-xs font-medium rounded-full">
                      {activePost.subCategory}
                    </span>
                  )}
                </div>

                <h1 className="text-xl md:text-3xl lg:text-4xl font-extrabold tracking-tight font-sans leading-tight">
                  {activePost.title}
                </h1>
              </div>
            </div>

            {/* Authoring information & Share controls */}
            <div className="px-6 md:px-12 py-6 border-b border-slate-50 flex flex-wrap justify-between items-center gap-4 bg-slate-50/50">
              <div className="flex items-center space-x-3 text-xs md:text-sm text-slate-500 font-medium">
                <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-600 font-mono">
                  KE
                </div>
                <div>
                  <span className="block text-slate-700 font-semibold">Korea Explorer 編輯團隊</span>
                  <span className="block text-[11px] text-slate-400 font-mono flex items-center mt-0.5">
                    <Calendar className="w-3 h-3 mr-1" />
                    發布時間：{activePost.date}
                  </span>
                </div>
              </div>

              {/* Toolbar with action keys */}
              <div className="flex items-center gap-2">
                {isAdmin && (
                  <>
                    <button 
                      onClick={() => handleOpenEditForm(activePost)}
                      className="px-4 py-1.5 bg-slate-200 hover:bg-rose-500/10 text-slate-700 hover:text-rose-600 text-xs font-bold rounded-full transition-all flex items-center gap-1.5"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      <span>編輯文章</span>
                    </button>
                    <button 
                      onClick={() => triggerDelete(activePost)}
                      className="px-4 py-1.5 bg-slate-200 hover:bg-red-500/10 text-slate-700 hover:text-red-600 text-xs font-bold rounded-full transition-all flex items-center gap-1.5"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>移除紀錄</span>
                    </button>
                  </>
                )}

                <button 
                  onClick={() => copyShareLink(activePost.title)}
                  title="分享或存複製連結"
                  className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold rounded-full transition-all flex items-center gap-1.5"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>實用分享</span>
                </button>
              </div>
            </div>

            {/* Breadcrumb navigator banner */}
            <div className="px-6 md:px-12 pt-6">
              <div className="flex items-center space-x-1.5 text-xs text-slate-400 font-medium">
                <span className="hover:text-slate-600 cursor-pointer" onClick={() => navigateTo({ clearAll: true })}>首頁入口</span>
                <ChevronRight className="w-3 h-3" />
                <span className="hover:text-slate-600 cursor-pointer" onClick={() => navigateTo({ category: activePost.category })}>{activePost.category}</span>
                {activePost.subCategory && (
                  <>
                    <ChevronRight className="w-3 h-3" />
                    <span className="text-slate-600 font-bold">{activePost.subCategory}</span>
                  </>
                )}
              </div>
            </div>

            {/* Real parsed text render */}
            <div className="px-6 md:px-12 py-8 prose prose-rose max-w-none border-b border-slate-100">
              <MarkdownRenderer content={activePost.content} />
            </div>

            {/* Suggested articles context */}
            {relatedPosts.length > 0 && (
              <div className="px-6 md:px-12 py-8 bg-slate-50/40">
                <h3 className="text-md md:text-lg font-bold text-slate-800 mb-5 flex items-center space-x-2">
                  <span className="w-1.5 h-5 bg-rose-500 rounded-full"></span>
                  <span>你可能也有興趣的《{activePost.category}》推薦：</span>
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {relatedPosts.map(relPost => (
                    <div 
                      key={relPost.id}
                      onClick={() => navigateTo({ post: relPost.id })}
                      className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-xs hover:shadow-md hover:-translate-y-0.5 cursor-pointer transition-all flex space-x-3 p-3 group"
                    >
                      <div className="w-24 h-20 bg-slate-100 rounded-lg overflow-hidden shrink-0">
                        <img 
                          src={relPost.thumbnail} 
                          alt={relPost.title} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <div className="flex flex-col justify-between overflow-hidden">
                        <h4 className="font-bold text-sm text-slate-800 line-clamp-2 leading-tight group-hover:text-rose-600 transition-colors">
                          {relPost.title}
                        </h4>
                        <span className="text-[10px] text-slate-400 font-mono mt-1 block">{relPost.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Back button row footer */}
            <div className="px-6 md:px-12 py-6 bg-slate-50/20 text-center">
              <button 
                onClick={() => navigateTo({ post: null })}
                className="bg-slate-800 text-white font-semibold text-xs py-2.5 px-6 rounded-full inline-flex items-center space-x-1.5 hover:bg-rose-500 transition-colors"
              >
                <ChevronRight className="w-4 h-4 rotate-180" />
                <span>漫步回首頁文章列表</span>
              </button>
            </div>

          </article>
        ) : (
          // ==========================================
          // ARTICLES DIRECTORY GRID PAGE
          // ==========================================
          <div>
            
            {/* Filter Indicators feedback row info */}
            {(selectedCategory || selectedSubCategory || searchQuery) && (
              <div className="mb-6 bg-rose-50/60 border border-rose-100/30 rounded-2xl p-4 flex flex-wrap justify-between items-center gap-3">
                <div className="flex items-center space-x-2 text-xs md:text-sm text-slate-700">
                  <Filter className="w-4 h-4 text-rose-500" />
                  <span className="text-slate-400">目前篩選條件：</span>
                  <div className="flex flex-wrap gap-1.5 items-center">
                    {selectedCategory && (
                      <span className="bg-white text-slate-700 border border-slate-200 px-2.5 py-0.5 rounded-full font-semibold scale-90">
                        主類別 / {selectedCategory}
                      </span>
                    )}
                    {selectedSubCategory && (
                      <span className="bg-white text-slate-700 border border-slate-200 px-2.5 py-0.5 rounded-full font-semibold scale-90">
                        子目錄 / {selectedSubCategory}
                      </span>
                    )}
                    {searchQuery && (
                      <span className="bg-white text-rose-600 border border-rose-200 px-2.5 py-0.5 rounded-full font-semibold scale-90">
                        搜尋字："{searchQuery}"
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-slate-400 font-medium">({filteredPosts.length} 篇符合)</span>
                </div>

                <button 
                  onClick={() => navigateTo({ clearAll: true })}
                  className="bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold py-1.5 px-3.5 rounded-xl transition-all shadow-xs border border-slate-100 flex items-center space-x-1"
                >
                  <X className="w-3 h-3" />
                  <span>清除全部重置</span>
                </button>
              </div>
            )}

            {/* Grid display layout */}
            {filteredPosts.length > 0 ? (
              <div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredPosts.slice(0, visibleCount).map((post) => {
                    const { icon: CatIcon, color: catStyles } = getCategoryTheme(post.category);
                    return (
                      <article 
                        key={post.id}
                        onClick={() => navigateTo({ post: post.id })}
                        className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1.5 cursor-pointer transition-all duration-300 group flex flex-col"
                      >
                        {/* Post card head photo zoom setup */}
                        <div className="relative h-52 w-full bg-slate-100 overflow-hidden shrink-0">
                          <img 
                            src={post.thumbnail} 
                            alt={post.title} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 referrer-policy-none"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute top-3 left-3 flex gap-1 z-10">
                            <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-xs text-white uppercase tracking-wider flex items-center gap-1">
                              <CatIcon className="w-3 h-3" />
                              <span>{post.category}</span>
                            </span>
                          </div>

                          {post.subCategory && (
                            <div className="absolute bottom-3 left-3 z-10">
                              <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-white/90 text-slate-800 shadow-xs">
                                {post.subCategory}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Card metadata detail */}
                        <div className="p-5 flex-1 flex flex-col justify-between">
                          <div className="space-y-2">
                            <div className="flex items-center text-[11px] text-slate-400 font-mono">
                              <Calendar className="w-3 h-3 mr-1" />
                              <span>{post.date}</span>
                              <span className="mx-2">•</span>
                              <span>由 Korea Explorer 主筆</span>
                            </div>

                            <h3 className="font-bold text-base md:text-lg text-slate-800 line-clamp-2 leading-snug group-hover:text-rose-600 transition-colors">
                              {post.title}
                            </h3>

                            <p className="text-slate-500 text-xs md:text-sm line-clamp-3 leading-relaxed font-light">
                              {post.excerpt}
                            </p>
                          </div>

                          <div className="pt-4 border-t border-slate-50 mt-4 flex items-center justify-between text-xs font-bold text-rose-500 group-hover:text-rose-600 transition-colors">
                            <span>閱讀完整內容</span>
                            <ChevronRight className="w-4 h-4 translate-x-0 group-hover:translate-x-1 transition-transform" />
                          </div>
                        </div>

                      </article>
                    );
                  })}
                </div>

                {/* Load More pagination indicator */}
                {filteredPosts.length > visibleCount && (
                  <div className="mt-12 text-center">
                    <button 
                      onClick={() => setVisibleCount(v => v + 6)}
                      className="bg-slate-800 hover:bg-rose-500 text-white font-bold text-xs py-3 px-8 rounded-full transition-colors shadow-md hover:scale-102"
                    >
                      載入更多文章 (Load More)
                    </button>
                    <span className="block text-slate-400 text-xs mt-2 scale-90">
                      目前顯示：{Math.min(visibleCount, filteredPosts.length)} 篇 / 共 {filteredPosts.length} 篇
                    </span>
                  </div>
                )}
              </div>
            ) : (
              // ==========================================
              // PRECISE EMPTY STATE TEMPLATE
              // ==========================================
              <div className="bg-white rounded-3xl p-10 md:p-16 border border-slate-100 text-center max-w-xl mx-auto shadow-sm">
                <div className="w-16 h-16 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mx-auto mb-4 border border-dashed border-slate-200">
                  <ListFilter className="w-8 h-8 text-slate-300" />
                </div>
                <h3 className="font-extrabold text-lg text-slate-800 mb-2">找不到符合條件的文章</h3>
                <p className="text-slate-500 text-sm leading-relaxed mb-6">
                  很抱歉，在當前篩選器與搜尋關鍵字下，系統找不到任何相應的韓國內容。
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-3">
                  <button 
                    onClick={() => navigateTo({ clearAll: true })}
                    className="bg-rose-500 text-white text-xs font-bold py-2.5 px-6 rounded-full hover:bg-rose-600 transition-colors shadow-sm"
                  >
                    重設搜尋與篩選條件
                  </button>
                  <button 
                    onClick={() => {
                      setSearchQuery('');
                      navigateTo({ category: '韓國旅遊', subcategory: null });
                    }}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold py-2.5 px-6 rounded-full transition-colors"
                  >
                    瀏覽首選旅遊主題
                  </button>
                </div>
              </div>
            )}

          </div>
        )}

      </main>

      {/* ==========================================
          FOOTER LAYER BLOCK
          ========================================== */}
      <footer className="bg-slate-900 text-slate-300 py-12 border-t border-slate-800 font-sans mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8 border-b border-slate-800 pb-10">
          
          {/* Brand footer details */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 select-none">
              <span className="font-black text-sm text-white bg-rose-500 px-2 py-0.5 rounded">KR</span>
              <span className="font-bold text-white text-base">韓國探索網</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed font-light">
              Korea Explorer 是您前往大韓民國自由行、理解韓流與經典民俗最不可或缺的良師益友。期待為大眾帶來最具啟發性、高畫素的優質報導。
            </p>
          </div>

          {/* Quick Sitemap Links */}
          <div>
            <h4 className="text-sm font-bold text-white mb-4 tracking-wide">快捷導覽選項</h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button onClick={() => navigateTo({ clearAll: true })} className="text-left text-slate-400 hover:text-white transition-colors">首頁總覽</button>
              <button onClick={() => navigateTo({ category: '韓國旅遊' })} className="text-left text-slate-400 hover:text-white transition-colors">韓國景點</button>
              <button onClick={() => navigateTo({ category: '韓國文化' })} className="text-left text-slate-400 hover:text-white transition-colors">文化奧秘</button>
              <button onClick={() => navigateTo({ category: '影視娛樂' })} className="text-left text-slate-400 hover:text-white transition-colors">星光追風</button>
              <button onClick={() => navigateTo({ category: '生活指南' })} className="text-left text-slate-400 hover:text-white transition-colors">道地餐桌</button>
            </div>
          </div>

          {/* Developer test guidelines & Hidden access door */}
          <div className="space-y-2">
            <h4 className="text-sm font-bold text-white tracking-wide">測試資源與管理者後台</h4>
            <div className="bg-slate-800 p-3 rounded-xl border border-slate-700 text-[11px] text-slate-400 leading-normal">
              <p className="font-semibold text-rose-400 mb-1 flex items-center">
                <Info className="w-3.5 h-3.5 mr-1" />
                沙箱快顯測試提示：
              </p>
              後台測試密碼為：<span className="font-mono text-white font-bold bg-slate-900 px-1.5 py-0.5 rounded">admin123</span>。登入後可自由新增、修改與刪除旅遊文章紀錄。
            </div>
          </div>

        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-400 gap-4">
          <p>© 2026 Korea Explorer 韓國探索網. All Rights Reserved. Designed by AI Creative Studio.</p>
          
          {/* Subtle login entry trigger point lock */}
          <div className="flex items-center space-x-2">
            <span>後台管理</span>
            {isAdmin ? (
              <button 
                onClick={handleAdminLogout}
                className="text-emerald-500 hover:text-emerald-400 transition-colors flex items-center space-x-1"
                title="點擊安全登出"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-500 animate-pulse" />
                <span className="font-bold">管理權限（點擊登出）</span>
              </button>
            ) : (
              <button 
                onClick={() => setIsLoginModalOpen(true)}
                className="text-slate-500 hover:text-slate-300 hover:underline transition-all flex items-center space-x-1"
                title="管理者登入後台"
              >
                <Lock className="w-3.5 h-3.5 text-slate-600" />
                <span>後台門口入口</span>
              </button>
            )}
          </div>
        </div>
      </footer>

      {/* ==========================================
          MODAL: ADMIN LOGIN DIALOG CODE
          ========================================== */}
      {isLoginModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Mask */}
          <div className="fixed inset-0 bg-slate-900/65 backdrop-blur-xs" onClick={() => setIsLoginModalOpen(false)}></div>
          
          {/* Box */}
          <div className="relative bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 z-10 transform translate-y-0 text-slate-800">
            <div className="text-center space-y-2 mb-6">
              <div className="w-12 h-12 bg-slate-50 text-rose-500 rounded-full flex items-center justify-center mx-auto border border-rose-100">
                <Lock className="w-6 h-6 text-rose-500" />
              </div>
              <h3 className="text-lg font-extrabold text-slate-900 font-sans">CMS 管理系統入口</h3>
              <p className="text-xs text-slate-500">
                請輸入管理密碼，以開啟添加、編輯與管理部落格文章的完整控制能力。
              </p>
            </div>

            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">管理密碼 (測試密碼: admin123)</label>
                <input 
                  type="password" 
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="請輸入密碼..."
                  className="w-full px-3.5 py-2 border border-slate-200 focus:border-rose-300 focus:ring-1 focus:ring-rose-200 rounded-xl focus:outline-none text-sm bg-slate-50/50"
                  autoFocus
                />
              </div>

              {loginError && (
                <div className="text-[11px] text-red-600 bg-red-50 border border-red-100 p-2.5 rounded-lg flex items-center space-x-1">
                  <span className="grow leading-snug">{loginError}</span>
                </div>
              )}

              <div className="flex space-x-2 pt-2">
                <button 
                  type="button"
                  onClick={() => setIsLoginModalOpen(false)}
                  className="w-1/2 py-2 text-xs font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all"
                >
                  取消返回
                </button>
                <button 
                  type="submit"
                  className="w-1/2 py-2 text-xs font-bold text-white bg-rose-500 hover:bg-rose-600 rounded-xl transition-all shadow-sm shadow-rose-100 flex items-center justify-center space-x-1"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>驗證登入</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==========================================
          MODAL: CONFIRM DELETE MODAL
          ========================================== */}
      {isDeleteConfirmOpen && postToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/65 backdrop-blur-xs" onClick={() => {
            setIsDeleteConfirmOpen(false);
            setPostToDelete(null);
          }}></div>
          
          <div className="relative bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 z-10 text-slate-800">
            <div className="text-center space-y-2 mb-6">
              <div className="w-12 h-12 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto border border-red-100">
                <Trash2 className="w-6 h-6 text-red-500" />
              </div>
              <h3 className="text-lg font-extrabold text-slate-900 font-sans">確認刪除旅遊文章？</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                欲刪除的文章為：
                <span className="block font-bold text-slate-800 mt-1.5 px-3 py-1.5 bg-slate-50 rounded-lg max-w-full truncate text-left">
                  《{postToDelete.title}》
                </span>
                該操作為不可逆，資料庫將移除其儲存狀態。
              </p>
            </div>

            <div className="flex space-x-3 pt-2">
              <button 
                type="button"
                onClick={() => {
                  setIsDeleteConfirmOpen(false);
                  setPostToDelete(null);
                }}
                className="w-1/2 py-2 text-xs font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all"
              >
                保留下來
              </button>
              <button 
                type="button"
                onClick={confirmDeletePost}
                className="w-1/2 py-2 text-xs font-bold text-white bg-red-500 hover:bg-red-600 rounded-xl transition-all shadow-sm flex items-center justify-center space-x-1"
              >
                <Check className="w-3.5 h-3.5" />
                <span>確定刪除</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          MODAL: CMS CREATE / EDIT POST DIALOG FORM
          ========================================== */}
      {isAddEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/65 backdrop-blur-xs" onClick={() => setIsAddEditModalOpen(false)}></div>
          
          <div className="relative bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-100 z-10 overflow-hidden text-slate-800">
            
            {/* Header section of creator */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-7 h-7 bg-rose-500 rounded-lg flex items-center justify-center text-white text-xs font-bold font-mono">
                  KE
                </div>
                <h3 className="font-extrabold text-slate-900 text-base font-sans">
                  {postToEdit ? `編輯文章：${postToEdit.title.slice(0, 15)}...` : '釋出全新韓國探索文章'}
                </h3>
              </div>
              <button 
                onClick={() => setIsAddEditModalOpen(false)}
                className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Form parameters */}
            <form onSubmit={handleSavePost} className="flex-1 overflow-y-auto p-6 space-y-4">
              
              {/* Title Section */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">文章標題（必填）</label>
                <input 
                  type="text" 
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="例如：驚人的德壽宮石牆路賞楓之旅五大祕境..."
                  className="w-full px-3.5 py-2 border border-slate-200 focus:border-rose-300 focus:ring-1 focus:ring-rose-200 rounded-xl focus:outline-none text-sm"
                  required
                />
              </div>

              {/* Category Taxonomies with Datalist options */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    主分類名（必填，可選現有或自由手寫）
                  </label>
                  <input 
                    type="text" 
                    list="categories-datalist"
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    placeholder="如：韓國旅遊、影視娛樂、生活指南..."
                    className="w-full px-3.5 py-2 border border-slate-200 focus:border-rose-300 focus:ring-1 focus:ring-rose-200 rounded-xl focus:outline-none text-sm"
                    required
                  />
                  <datalist id="categories-datalist">
                    {uniqueCategories.map(cat => (
                      <option key={cat} value={cat} />
                    ))}
                  </datalist>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    子目錄分類名稱（選填，可選現有或自由手寫）
                  </label>
                  <input 
                    type="text" 
                    list="subcategories-datalist"
                    value={formSubCategory}
                    onChange={(e) => setFormSubCategory(e.target.value)}
                    placeholder="如：首爾自由行、釜山旅遊、韓劇推薦..."
                    className="w-full px-3.5 py-2 border border-slate-200 focus:border-rose-300 focus:ring-1 focus:ring-rose-200 rounded-xl focus:outline-none text-sm"
                  />
                  <datalist id="subcategories-datalist">
                    {uniqueSubCategories.map(subCat => (
                      <option key={subCat} value={subCat} />
                    ))}
                  </datalist>
                </div>
              </div>

              {/* Date Block */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">文章發布日期</label>
                <input 
                  type="date" 
                  value={formDate}
                  onChange={(e) => setFormDate(e.target.value)}
                  className="w-full px-3.5 py-2 border border-slate-200 focus:border-rose-300 focus:ring-1 focus:ring-rose-200 rounded-xl focus:outline-none text-sm"
                  required
                />
              </div>

              {/* Image Input choice + Compressor layout */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                <div className="flex border-b border-slate-200 mb-3 text-xs font-bold">
                  <button 
                    type="button"
                    onClick={() => setImageTab('url')}
                    className={`pb-2 px-3 leading-none transition-colors ${imageTab === 'url' ? 'border-b-2 border-rose-500 text-slate-900' : 'text-slate-400'}`}
                  >
                    1. 填寫外部圖片連結
                  </button>
                  <button 
                    type="button"
                    onClick={() => setImageTab('upload')}
                    className={`pb-2 px-3 leading-none transition-colors ${imageTab === 'upload' ? 'border-b-2 border-rose-500 text-slate-900' : 'text-slate-400'}`}
                  >
                    2. 上傳並極速壓縮圖片
                  </button>
                </div>

                {imageTab === 'url' ? (
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-1">圖片 URL 位址</label>
                    <input 
                      type="url" 
                      value={formImageUrl}
                      onChange={(e) => setFormImageUrl(e.target.value)}
                      placeholder="請輸入 https://..."
                      className="w-full px-3.5 py-2 border border-slate-200 focus:border-rose-300 focus:ring-1 focus:ring-rose-200 rounded-xl focus:outline-none text-sm bg-white"
                    />
                    <p className="text-[10px] text-slate-400 mt-1">
                      提示：建議使用 Unsplash 高畫素韓國風景美食相片
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <label className="flex-1 border-2 border-dashed border-slate-200 hover:border-rose-300 rounded-xl p-4 text-center cursor-pointer bg-white transition-colors">
                        <input 
                          type="file" 
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                          disabled={isCompressing}
                        />
                        <div className="flex flex-col items-center space-y-1">
                          <Upload className="w-5 h-5 text-slate-400" />
                          <span className="text-xs text-slate-600 font-medium">點擊或拖放照片檔案至此處</span>
                          <span className="text-[9px] text-slate-400">系統自動限寬 800px、品質 0.7 壓縮防破表</span>
                        </div>
                      </label>

                      {/* Display Base64 compress preview */}
                      {(compressedImageBase64 || isCompressing) && (
                        <div className="w-20 h-20 bg-slate-100 rounded-xl border overflow-hidden flex items-center justify-center shrink-0">
                          {isCompressing ? (
                            <span className="w-4 h-4 border-2 border-rose-500 border-t-transparent rounded-full animate-spin"></span>
                          ) : (
                            <img src={compressedImageBase64} alt="Compressed preview" className="w-full h-full object-cover" />
                          )}
                        </div>
                      )}
                    </div>

                    {/* Compression metric analysis indicator */}
                    {compressionMetrics && (
                      <div className="text-[10px] bg-sky-50 text-sky-800 p-2.5 rounded-lg border border-sky-100/50 flex justify-between items-center">
                        <span className="font-semibold flex items-center">
                          <Check className="w-3 h-3 text-emerald-500 mr-1 shrink-0" />
                          HTML5 Canvas 壓縮完成！
                        </span>
                        <span>
                          原始大小: <strong className="font-mono">{(compressionMetrics.original / 1024).toFixed(1)} KB</strong> → 
                          極速優化: <strong className="font-mono text-emerald-600">{(compressionMetrics.compressed / 1024).toFixed(1)} KB</strong> 
                          （精簡了 {((1 - compressionMetrics.compressed / compressionMetrics.original) * 100).toFixed(0)}%）
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Excerpt Section */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">文章摘要或速讀簡介（必填）</label>
                <textarea 
                  value={formExcerpt}
                  onChange={(e) => setFormExcerpt(e.target.value)}
                  placeholder="寫一段吸引讀者點擊觀看、限制至 100 字內摘要敘述..."
                  rows={2}
                  className="w-full px-3.5 py-2 border border-slate-200 focus:border-rose-300 focus:ring-1 focus:ring-rose-200 rounded-xl focus:outline-none text-sm resize-none"
                  required
                />
              </div>

              {/* Rich Markdown content text field */}
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center justify-between gap-2.5">
                  <label className="text-xs font-semibold text-slate-700">
                    文章正文：支援經典 Markdown 設計（必填）
                  </label>
                  
                  {/* Micro toolbar helper tag tools */}
                  <div className="flex bg-slate-100/80 p-0.5 rounded-lg border text-[10px] font-bold text-slate-600">
                    <button 
                      type="button" 
                      onClick={() => insertMarkdownTag('## ', '\n')}
                      className="px-2 py-1 hover:bg-white hover:text-slate-900 rounded transition-colors"
                      title="插入大標題 H2"
                    >
                      大標題
                    </button>
                    <button 
                      type="button" 
                      onClick={() => insertMarkdownTag('### ', '\n')}
                      className="px-2 py-1 hover:bg-white hover:text-slate-900 rounded transition-colors"
                      title="插入中標題 H3"
                    >
                      中標題
                    </button>
                    <button 
                      type="button" 
                      onClick={() => insertMarkdownTag('**', '**')}
                      className="px-2 py-1 hover:bg-white hover:text-slate-900 rounded transition-colors"
                      title="文字粗體"
                    >
                      粗體
                    </button>
                    <button 
                      type="button" 
                      onClick={() => insertMarkdownTag('> ', '\n')}
                      className="px-2 py-1 hover:bg-white hover:text-slate-900 rounded transition-colors"
                      title="插入引用段"
                    >
                      引用
                    </button>
                    <button 
                      type="button" 
                      onClick={() => insertMarkdownTag('- ')}
                      className="px-2 py-1 hover:bg-white hover:text-slate-900 rounded transition-colors"
                      title="插入無序清單"
                    >
                      列表
                    </button>
                    <button 
                      type="button" 
                      onClick={() => insertMarkdownTag('[連結文字](', ')') }
                      className="px-2 py-1 hover:bg-white hover:text-slate-900 rounded transition-colors"
                      title="連結 Markdown"
                    >
                      加入連結
                    </button>
                    <button 
                      type="button" 
                      onClick={() => insertMarkdownTag('---\n')}
                      className="px-2 py-1 hover:bg-white hover:text-slate-900 rounded transition-colors"
                      title="分隔線"
                    >
                      分隔線
                    </button>
                  </div>
                </div>

                <textarea 
                  ref={contentTextareaRef}
                  value={formContent}
                  onChange={(e) => setFormContent(e.target.value)}
                  placeholder="# 寫點大旅行篇章吧 (使用大標題)&#10;&#10;在這裡與讀者分享精采的在地探險故事，可以靈活加入 **粗體字標示** 或使用 - 符號來建立多層次旅遊行程。也別忘了利用上面工具列快速插入標籤導引！"
                  rows={10}
                  className="w-full p-4 border border-slate-200 focus:border-rose-300 focus:ring-1 focus:ring-rose-200 rounded-2xl focus:outline-none text-sm font-sans"
                  required
                />
              </div>

            </form>

            {/* Footer row buttons of creator */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[10px] text-slate-400">
                提示：文章將立即保存並即時同步到主頁與頂部動態分類徽章。
              </span>

              <div className="flex space-x-2">
                <button 
                  type="button"
                  onClick={() => setIsAddEditModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-500 bg-white border rounded-xl hover:bg-slate-50 transition-colors"
                >
                  取消
                </button>
                <button 
                  onClick={handleSavePost}
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-rose-500 hover:bg-rose-600 rounded-xl hover:scale-101 transition-all shadow-sm shadow-rose-200 flex items-center space-x-1"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>{postToEdit ? '確認修改保存' : '正式發布文章'}</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
