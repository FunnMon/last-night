'use strict';
// Fictional narrative weights only. Skill axes: awareness, preparation, adaptability, cooperation.
// Risk axes: exposure, shortages, isolation, exhaustion.
const CHAPTERS = [
  { name: '异常预警', time: '18:42', line: '城市还亮着，秩序已经开始松动。' },
  { name: '第一夜', time: '21:10', line: '门外的声音，比新闻更早抵达。' },
  { name: '全面断联', time: '02:15', line: '屏幕暗下去以后，你得自己作决定。' },
  { name: '天亮之前', time: '06:30', line: '撤离广播响起。不是所有人都会出现在车上。' }
];
const SCENARIOS = [
  { title: '群里出现了第一段视频', scene: '晚高峰，你收到一段摇晃的视频：有人在地铁口失控扑向路人。新闻说“情况正在核实”。窗外忽然传来很长的鸣笛。', prompt: '你的第一反应是？', options: [
    { text: '先确认消息来源，同时留意家门外的动静。', skills: [3,2,2,1], risks: [0,0,1,0], event: '你先观察了异常，没有把“尚未证实”当成“不会发生”。', reflect: '你给不确定性留了位置，争取到了最早的反应时间。' },
    { text: '出门看看，亲眼见到才知道是不是夸张。', skills: [1,0,3,1], risks: [4,0,0,1], event: '你走近了混乱，获得第一手信息，也暴露了自己。', reflect: '你不愿被传言牵着走，却习惯用亲身靠近来验证危险。' },
    { text: '马上联系亲近的人，约好一个碰面地点。', skills: [2,1,1,3], risks: [1,0,0,0], event: '你在信号还畅通时，把几个重要的人连在了一起。', reflect: '你最先想到的是关系，而这也替后来的失联留下了一点缓冲。' },
    { text: '先把今天的事做完，网上经常一惊一乍。', skills: [0,1,0,0], risks: [3,2,1,0], event: '你继续原来的生活，错过了一小段仍能自由行动的时间。', reflect: '熟悉的日常让异常显得不够真实，你倾向等更明确的信号。' }
  ] },
  { title: '楼下还有最后一趟车', scene: '小区门口挤满了车。有人说城南已经封路，也有人说现在不走就来不及了。你的住处暂时安全，外面的路况却没有人说得清。', prompt: '你会怎样决定去留？', options: [
    { text: '跟着最多人走的方向，至少不会一个人。', skills: [0,1,1,2], risks: [3,1,0,1], event: '你跟上了人流，也把去向交给了人流。', reflect: '你会用群体的选择缓解不确定，但人多并不总等于信息更准。' },
    { text: '暂时留下，把已知路线和退路先理清。', skills: [3,3,1,1], risks: [0,0,1,0], event: '你留在暂时可控的地方，为下一次移动准备了理由。', reflect: '你能抵住“大家都在走”的压力，为行动保留依据。' },
    { text: '联系一个熟悉附近路况的人，再决定。', skills: [2,2,2,3], risks: [1,0,0,0], event: '你把自己的判断和当地的信息接在了一起。', reflect: '你愿意借助别人，但希望信任有具体的信息支撑。' },
    { text: '拿起钥匙就走，留在原地让我更不安。', skills: [0,0,3,0], risks: [4,2,2,1], event: '你很快离开了家，暂时没有确定下一扇门在哪里。', reflect: '你处理不安的方式是先动起来，有时行动会快过准备。' }
  ] },
  { title: '背包只剩最后一个空位', scene: '日常用品已经装了一些。拉链即将合上时，你发现还容得下一件东西。楼道里有人开始催促，留给你犹豫的时间不多了。', prompt: '你会把什么放进去？', options: [
    { text: '一份额外的饮水和能放久一点的食物。', skills: [1,3,1,1], risks: [0,0,0,1], event: '你为背包增加了重量，也延长了不必外出的时间。', reflect: '你会先把最基础的需求变成确定的储备。' },
    { text: '那台还能收听的旧收音机。', skills: [3,2,2,1], risks: [0,1,0,0], event: '你留下了一个不依赖手机信号的信息入口。', reflect: '你重视信息带来的主动权，愿意为此让出一点物资空间。' },
    { text: '一件保暖外套，今晚可能回不来了。', skills: [2,2,2,1], risks: [0,1,0,0], event: '你为一个还没发生的寒夜预留了余地。', reflect: '你会考虑危机之外的普通消耗：冷、累，以及漫长的等待。' },
    { text: '那件重要的纪念物，我不想把它留在这里。', skills: [1,0,1,2], risks: [0,2,0,0], event: '你带走了一件能提醒自己是谁的东西。', reflect: '你不只在乎继续活着，也在乎活下来的自己还认不认得过去。' }
  ] },
  { title: '有人在门外轻轻敲了三下', scene: '门外的人说自己住在楼上，手机没电了，想进来打个电话。你听不清他的呼吸，也没办法确认他说的名字。敲门声越来越急。', prompt: '你怎么回应？', options: [
    { text: '先隔着门核实情况，想办法提供有限帮助。', skills: [3,2,2,3], risks: [0,0,0,1], event: '你没有立刻开门，也没有让求助消失在沉默里。', reflect: '你试着把同情和边界放在一起，愿意帮助，但不跳过确认。' },
    { text: '让他进来，至少不能把人留在外面。', skills: [0,0,1,3], risks: [4,1,0,1], event: '门打开了，屋内从此多了一份尚未确认的信息。', reflect: '在压力下，你仍然愿意先相信人，这也让边界更容易被推开。' },
    { text: '不回应，任何陌生人都可能是麻烦。', skills: [2,1,1,0], risks: [0,0,3,0], event: '你保住了眼前的安静，也切断了一次可能的连接。', reflect: '你倾向用彻底隔离换确定感，但这样的安全可能有后续成本。' },
    { text: '问他有没有能交换的物资，再谈帮忙。', skills: [1,2,2,0], risks: [1,0,2,0], event: '你先为合作标好了条件。', reflect: '你擅长考虑交换，却可能低估危机里不以交易开始的信任。' }
  ] },
  { title: '熟人发来了一个撤离定位', scene: '群里有人说“这边绝对安全”，附上一张没有时间的照片。你认识转发的人，却不认识消息最初来自谁。下面已经有人回复“出发”。', prompt: '你会怎么处理这条消息？', options: [
    { text: '是熟人发的，我愿意先信这一次。', skills: [0,1,1,2], risks: [3,1,1,0], event: '你信任转发消息的人，没再追问消息本身。', reflect: '你容易把对一个人的信任，延伸成对他收到的信息的信任。' },
    { text: '问清时间与来源，再和其他线索对照。', skills: [3,3,2,2], risks: [0,0,0,1], event: '你没有把转发的确定语气，当成事实的确定程度。', reflect: '你保留了怀疑，也给可信的信息留下了进来的空间。' },
    { text: '先转给所有人，万一能帮到谁呢。', skills: [0,0,1,3], risks: [2,0,2,0], event: '更多人看到了定位，消息也更难追回了。', reflect: '你的分享出于善意，但速度有时会超过核实。' },
    { text: '全都不信，我只按自己的想法行动。', skills: [1,1,3,0], risks: [1,1,3,0], event: '你拒绝了这条消息，也暂时拒绝了其他人的判断。', reflect: '你不愿交出主动权，却可能把信息过滤成了信息断流。' }
  ] },
  { title: '求救声来自你熟悉的那一层', scene: '楼道灯灭了。有人喊着一个你认得的名字，声音停一下，又响起来。你看不见转角后有什么；身边的人都在等你先表态。', prompt: '你会选择哪一种做法？', options: [
    { text: '立刻冲过去，拖一秒就可能来不及。', skills: [0,0,3,2], risks: [4,0,0,2], event: '你朝求救声跑去，把自己放在了队伍最前面。', reflect: '你会本能地承担危险，善意和冲动在这一刻靠得很近。' },
    { text: '和身边人先确认位置，再决定能做什么。', skills: [3,2,2,3], risks: [1,0,0,1], event: '你把一次个人冲动，变成了几个人共同确认的决定。', reflect: '你没有回避求助，也不愿让救援本身制造更多失联。' },
    { text: '叫人回来，眼下先确保我们这一边。', skills: [2,2,1,1], risks: [0,0,1,0], event: '你没有走向转角，守住了眼前仍能看见的人。', reflect: '你习惯先承认能力边界，不轻易承担没有把握的承诺。' },
    { text: '自己悄悄去看看，不让别人跟着冒险。', skills: [1,0,3,0], risks: [3,0,3,2], event: '你独自离开了视线，没有人知道你下一步在哪里。', reflect: '你想独自扛下风险，却也让他人失去了与你配合的机会。' }
  ] },
  { title: '停电以后，大家都看向你', scene: '手机电量越来越少。有人坚持现在就走，有人说天亮再动。几个人争执起来，一句“听我的”之后，房间安静了一瞬。', prompt: '你更可能怎么做？', options: [
    { text: '直接拿主意，现在最需要一个明确的声音。', skills: [1,1,3,1], risks: [1,1,2,1], event: '你让房间恢复了方向，也接住了这个决定的全部重量。', reflect: '你能在犹豫中推进事情，但速度可能压过了别人掌握的信息。' },
    { text: '先各自说出知道什么，再把分歧具体化。', skills: [3,2,2,3], risks: [0,0,0,1], event: '争论逐渐变成了关于路线和条件的讨论。', reflect: '你擅长把情绪里的分歧，重新翻译成可以处理的问题。' },
    { text: '少数服从多数，别再浪费时间了。', skills: [1,1,1,2], risks: [1,1,1,0], event: '你们很快得到了一个多数人愿意接受的答案。', reflect: '你重视共识，但共识未必能自动填补事实上的空白。' },
    { text: '他们决定他们的，我准备自己的路线。', skills: [1,2,3,0], risks: [1,0,3,1], event: '你在共同计划之外，又画出了一条自己的线。', reflect: '你保留了退路，也需要面对与其他人脱节的代价。' }
  ] },
  { title: '食物比预计的少了一半', scene: '清点时发现，几份储备早已不能用。有人主张今晚吃饱，明天再找；也有人悄悄把自己的那份藏了起来。大家都很饿。', prompt: '你更认同哪一种安排？', options: [
    { text: '把现有的量说清楚，约好大家都知道的分配。', skills: [2,3,1,3], risks: [0,0,0,1], event: '每个人都知道剩下多少，明天的打算也更具体了。', reflect: '你相信透明能减少猜疑，也愿意接受眼前没那么舒服的安排。' },
    { text: '先吃饱恢复精神，后面的事后面再想。', skills: [0,0,2,1], risks: [0,4,0,0], event: '这个夜晚好过了一点，储备也更快见了底。', reflect: '你倾向先解决最迫近的不适，长一点的账容易被往后推。' },
    { text: '各管各的，自己的储备不能轻易交出去。', skills: [1,3,1,0], risks: [0,1,3,0], event: '你保留了自己的那一份，房间里的信任却少了一些。', reflect: '你不愿让生存依赖别人的承诺，但独立也会增加长期消耗。' },
    { text: '把我的那份分出去，我可以再撑一会儿。', skills: [0,0,1,3], risks: [0,2,0,4], event: '别人收到了你的那份，你没有告诉他们自己也很饿。', reflect: '你容易先满足别人的需要，把自己的极限说得比实际更远。' }
  ] },
  { title: '队友隐瞒了一次外出', scene: '你发现一个队友去过原本约定避开的区域。他说只是想找东西，怕被反对才没有开口。没有人知道他到底遇到了什么。', prompt: '你怎么处理这次隐瞒？', options: [
    { text: '让他把经历说清楚，一起重新约定边界。', skills: [3,2,2,3], risks: [1,0,0,1], event: '你追问了事实，也给后续合作设下了更明确的条件。', reflect: '你不会因为一句解释就完全放心，也不急着把关系推到绝路。' },
    { text: '相信他是好意，不再追问让他难堪。', skills: [0,0,1,3], risks: [3,1,1,0], event: '这次争执过去了，尚未说明的那部分经历也被留了下来。', reflect: '你想保护关系，有时却会把必要的追问也当成伤害。' },
    { text: '既然隐瞒过，就不能再和我们一起走。', skills: [2,1,2,0], risks: [0,0,3,1], event: '你划清了一条线，队伍也因此缩小了。', reflect: '你重视边界和一致性，但容易把一次失信变成永久的结论。' },
    { text: '我也离开，这个团队已经不值得信任。', skills: [1,1,3,0], risks: [1,2,4,1], event: '你离开了队伍，把接下来的判断重新交回自己。', reflect: '你会用退出结束失望，却也放弃了修复和借力的可能。' }
  ] },
  { title: '广播里出现了两个撤离点', scene: '旧广播断断续续：一个集合点很近，但消息已经重复了两个小时；另一个更远，刚刚发出新讯号。你们无法同时确认两边。', prompt: '你会把希望放在哪一种安排里？', options: [
    { text: '去最近的地方，距离短就是最大的优势。', skills: [1,1,2,1], risks: [2,1,0,0], event: '你优先缩短了路程，接受了消息可能已经过时的风险。', reflect: '你会抓住明确的便利，但有时会低估条件变化的速度。' },
    { text: '对照时间、路线和现有状态，再做取舍。', skills: [3,3,2,2], risks: [0,0,0,1], event: '你没有选看起来最好的那个，而是选眼下能解释得通的那个。', reflect: '你能同时考虑信息与能力，不轻易把希望当作计划。' },
    { text: '去新的讯号那里，新消息比近路更重要。', skills: [2,1,3,1], risks: [1,1,0,2], event: '你们走向了更远但更新的讯号，路上的消耗也随之增加。', reflect: '你愿意为新的可能付出代价，但需要留意自己还剩多少余力。' },
    { text: '都不去，广播也可能靠不住。', skills: [1,2,1,0], risks: [0,2,3,0], event: '你避开了未知的集合点，也暂时离开了公共援助的范围。', reflect: '你用控制风险保护自己，有时也会一起关掉可能的出口。' }
  ] },
  { title: '一条迟到的语音终于发了进来', scene: '是你在乎的人。他让你去一个旧地点等他，但语音没有说明现在是否还在那里。你们的集合时间快到了，绕路意味着可能错过。', prompt: '你会怎么选？', options: [
    { text: '先确认语音是什么时候发的，再想办法联系。', skills: [3,2,2,2], risks: [0,0,0,1], event: '你没有把迟到的声音，当成此刻仍然有效的位置。', reflect: '你会在很想相信的时候，仍努力为感情补上一点事实。' },
    { text: '马上过去，错过他比什么都可怕。', skills: [0,0,3,2], risks: [3,1,1,3], event: '你走向了那个旧地点，把既定的时间表放到了身后。', reflect: '重要的人能让你暂时放下原来的原则，这份牵挂也可能把你推得很远。' },
    { text: '留下清楚的联络约定，先去集合点。', skills: [2,3,1,2], risks: [0,0,1,0], event: '你选择先守住能抵达的位置，同时为重逢留下了线索。', reflect: '你愿意承受暂时不能立刻回应的痛苦，换一个更可持续的机会。' },
    { text: '把计划交给同伴，自己先去找人。', skills: [1,0,2,1], risks: [2,1,3,2], event: '你和队伍分开了，希望之后还能追上彼此。', reflect: '你想兼顾两个方向，但分开以后，每一边都少了一份确定。' }
  ] },
  { title: '天亮了，车门正在合上', scene: '你们终于抵达集合点。第一辆车容量有限，远处还有同行的人没赶到。工作人员说会有下一轮，但谁也无法保证具体时间。', prompt: '这是这一夜的最后一个决定。', options: [
    { text: '先上车。至少我已经站在这个机会面前。', skills: [1,2,3,0], risks: [0,0,2,0], event: '你抓住了第一轮撤离，队伍中有人留在了原地。', reflect: '你能在机会很具体时迅速选择，也接受了与他人不同步的结果。' },
    { text: '和工作人员确认后续安排，再决定留下谁。', skills: [3,3,2,3], risks: [0,0,0,1], event: '你把最后的犹豫变成了一次明确的询问。', reflect: '即使时间紧，你仍会尝试增加信息，而不是只在两个坏选项里硬选。' },
    { text: '在集合点等同伴，我们约好一起走。', skills: [1,1,1,3], risks: [1,1,0,2], event: '你留在约好的位置，等待还没抵达的人。', reflect: '承诺对你有真实的分量，你愿意为不抛下人承担等待。' },
    { text: '把位置让出去，我自己再想办法。', skills: [0,0,2,3], risks: [1,2,2,4], event: '你让出了眼前的位置，给别人留下了一次先走的机会。', reflect: '你很容易成为最后照顾自己的人，也可能把退路留得太少。' }
  ] }
];
const SKILL_NAMES = ['警觉', '筹备', '应变', '协作'];
const RISK_NAMES = ['暴露在混乱里', '储备跟不上消耗', '与可信的人失联', '长期透支自己'];
const SURVIVOR_TYPES = [
  { name: '冷静观察者', line: '别人听见了希望，你先听出了里面的杂音。', strength: '你会在最想相信的时候继续核实。信息混乱时，这让你不容易把情绪当成事实。', blind: '你也可能为了得到更完整的答案，推迟一个只能在有限信息下作出的决定。' },
  { name: '储备规划师', line: '你活下来的秘密，往往在别人嫌重的背包里。', strength: '你会把模糊的“以后再说”变成具体安排。你擅长为下一次失控保留余地。', blind: '当环境改变得太快，原来的储备和计划也可能变成不愿放手的负担。' },
  { name: '夜路独行者', line: '路断了以后，你还能找出另一种走法。', strength: '你不容易被一次失控彻底钉在原地。临场变化对你是压力，也会激发行动。', blind: '你太习惯自己想办法，有时会把可以求助的局面也独自扛过去。' },
  { name: '人群里的锚', line: '你带着的不只是物资，还有几个不想失去的人。', strength: '你会把零散的人组织成互相回应的关系。长期危机里，这能减少很多独自承担的消耗。', blind: '你容易用自己的余力填补所有人的缺口，直到别人以为你永远不需要休息。' },
  { name: '逆行冒险家', line: '你总是最先走向声音，也最晚承认自己害怕。', strength: '你有把犹豫变成行动的力量，愿意为重要的人和事走出可控的范围。', blind: '靠近危险能获得机会，却不一定给你留下退回来的时间。你的勇敢需要一条退路。' },
  { name: '临场赌徒', line: '你相信下一步总会有办法，这一夜却没有一直配合。', strength: '你能忍受未知，也愿意在缺少准备时先迈出一步，不会轻易被想象里的坏结果困住。', blind: '当很多次“先这样吧”叠在一起，运气就会承担原本应该由准备承担的工作。' }
];
const ENDINGS = [
  { name: '最后一次穿过街口', text: '你在下一次移动中，再也没能回到约好的位置。起初让你拿到信息的靠近，后来也让你失去了安全距离。记录停在了一条没有回复的消息上。' },
  { name: '背包比希望先见了底', text: '你没有倒在最混乱的那一夜。真正耗尽你的，是后来每天都要重新面对的消耗。当天的安排总比明天更迫切，直到明天不再给你余地。' },
  { name: '无人回应的约定', text: '你避开过不少不可信的人，也慢慢离开了还能互相回应的关系。最后一次计划改变时，没有人知道你去了哪里，也没有人能把新的消息送到你手里。' },
  { name: '替所有人守夜的人', text: '你一次次说“我还能撑”。大家都渐渐相信了，连你自己也是。危机没有一次把你击倒，却让没有被计算的消耗，在某一天同时找上了你。' }
];
function validateAnswers(answers) {
  if (!Array.isArray(answers) || answers.length !== SCENARIOS.length || !answers.every(n => Number.isInteger(n) && n >= 0 && n < 4)) throw new Error('请先完成全部情境选择。');
}
function evaluatePath(answers) {
  const skills = [0,0,0,0], risks = [0,0,0,0];
  answers.forEach((choice, index) => { const option = SCENARIOS[index].options[choice]; option.skills.forEach((n, i) => skills[i] += n); option.risks.forEach((n, i) => risks[i] += n); });
  const maxima = SKILL_NAMES.map((_, axis) => SCENARIOS.reduce((sum, scene) => sum + Math.max(...scene.options.map(option => option.skills[axis])), 0));
  const dimensions = skills.map((n, i) => Math.round(n / maxima[i] * 100));
  const readiness = dimensions.reduce((a,b) => a+b, 0) / 4;
  const totalRisk = risks.reduce((a,b) => a+b, 0);
  const open = readiness >= 76 && totalRisk <= 35 && Math.min(...dimensions) >= 45;
  const days = open ? 60 : Math.max(2, Math.min(59, Math.round(2 + readiness * .72 - totalRisk * .42)));
  const main = dimensions.indexOf(Math.max(...dimensions));
  const riskAxis = risks.indexOf(Math.max(...risks));
  let type = main;
  if (Math.max(...dimensions) < 49) type = 5;
  else if (risks[0] >= 18 && dimensions[2] >= 50) type = 4;
  return { days, open, dimensions, risks, readiness, main, type, riskAxis };
}
function calculateSurvival(answers) {
  validateAnswers(answers);
  const result = evaluatePath(answers);
  const keyIndex = answers.reduce((best, choice, i) => SCENARIOS[i].options[choice].risks[result.riskAxis] > SCENARIOS[best].options[answers[best]].risks[result.riskAxis] ? i : best, 0);
  const anchorIndex = answers.reduce((best, choice, i) => SCENARIOS[i].options[choice].skills[result.main] > SCENARIOS[best].options[answers[best]].skills[result.main] ? i : best, 0);
  let rewrite = null;
  if (!result.open) answers.forEach((choice, index) => SCENARIOS[index].options.forEach((_, alternative) => {
    if (alternative === choice) return;
    const changed = answers.slice(); changed[index] = alternative;
    const next = evaluatePath(changed);
    if (next.days > result.days && (!rewrite || next.days > rewrite.days)) rewrite = { index, alternative, days: next.days, open: next.open };
  }));
  return { ...result, survivor: SURVIVOR_TYPES[result.type], ending: result.open ? { name: '第六十天，讯号仍在', text: '你把撤离变成了日常，又把几个各自逃生的人连成了能彼此回应的队伍。第六十天，收音机里终于出现了稳定的呼叫。你的故事还没有结束，这份档案暂时停止计时。' } : ENDINGS[result.riskAxis], keyIndex, anchorIndex, rewrite, record: CHAPTERS.map((chapter, i) => ({ ...chapter, event: SCENARIOS[i*3+2].options[answers[i*3+2]].event })) };
}
