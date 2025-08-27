export interface Painting {
  id: string;
  title: string;
  artist: string;
  filename: string;
  description: string;
  period: string;
}

export const paintings: Painting[] = [
  {
    id: 'mona-lisa',
    title: '蒙娜丽莎',
    artist: '列奥纳多·达·芬奇',
    filename: 'mona_lisa_leonardo_da_vinci_high_quality_painting.jpg',
    description: '世界上最著名的肖像画，以其神秘的微笑而闻名',
    period: '文艺复兴'
  },
  {
    id: 'starry-night',
    title: '星夜',
    artist: '文森特·梵高',
    filename: 'vincent_van_gogh_starry_night_painting_high_resolution.jpg',
    description: '表现主义杰作，展现了梵高独特的旋涡笔触',
    period: '后印象派'
  },
  {
    id: 'girl-pearl-earring',
    title: '戴珍珠耳环的少女',
    artist: '约翰尼斯·维米尔',
    filename: 'girl_with_pearl_earring_johannes_vermeer_painting_high_quality.jpg',
    description: '荷兰黄金时代的珍珠，以其纯净的光影而著称',
    period: '巴洛克'
  },
  {
    id: 'great-wave',
    title: '神奈川冲浪里',
    artist: '葛饰北斋',
    filename: 'the_great_wave_off_kanagawa_hokusai_japanese_art.jpg',
    description: '日本浮世绘的经典之作，展现了大自然的壮美力量',
    period: '江户时代'
  },
  {
    id: 'american-gothic',
    title: '美国哥特式',
    artist: '格兰特·伍德',
    filename: 'american_gothic_grant_wood_painting.jpg',
    description: '美国区域主义的代表作，描绘了中西部农民的坚韧精神',
    period: '现代主义'
  },
  {
    id: 'the-scream',
    title: '呐喊',
    artist: '爱德华·蒙克',
    filename: 'the_scream_edvard_munch_painting_high_quality.jpg',
    description: '表现主义的杰作，表达了现代人的焦虑与绝望',
    period: '表现主义'
  },
  {
    id: 'las-meninas',
    title: '宫娥',
    artist: '迭戈·委拉斯开兹',
    filename: 'las_meninas_diego_velazquez_painting_high_quality.jpg',
    description: '西班牙黄金时代的杰作，以其复杂的构图和透视而闻名',
    period: '巴洛克'
  },
  {
    id: 'birth-of-venus',
    title: '维纳斯的诞生',
    artist: '桑德罗·波提切利',
    filename: 'The_Birth_of_Venus_Sandro_Botticelli_Painting.jpg',
    description: '文艺复兴时期的神话杰作，展现了古典美的理想',
    period: '文艺复兴'
  },
  {
    id: 'persistence-memory',
    title: '记忆的永恒',
    artist: '萨尔瓦多·达利',
    filename: 'the_persistence_of_memory_salvador_dali_painting.jpeg',
    description: '超现实主义的经典之作，以融化的时钟探讨时间概念',
    period: '超现实主义'
  },
  {
    id: 'guernica',
    title: '格尔尼卡',
    artist: '巴勃罗·毕加索',
    filename: 'Guernica_Pablo_Picasso_painting_high_resolution_monochrome.jpg',
    description: '立体主义反战巨作，表达了对战争暴行的强烈谴责',
    period: '立体主义'
  }
];