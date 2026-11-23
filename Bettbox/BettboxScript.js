// =========================================================================
// Bettbox Mihomo 进阶流媒体与策略分流配置脚本 
// =========================================================================

const Compatible_With_Bettbox = { ruleOptionsEnable: true };

const iconBaseUrl = 'https://fastly.jsdelivr.net/gh/MeituanRider001/Mihomo@main/Icons/svg/';
const ruleSetBaseUrl = 'https://cdn.jsdmirror.com/gh/appshubcc/bett-rules@meta/geo/';

/**
 * 策略组与图标定义表
 */
const serviceConfigs = [
  // 基础策略组
  { name: 'Manual', icon: `${iconBaseUrl}Proxy.svg`, isBase: true },
  { name: 'SelectGroup', icon: `${iconBaseUrl}Static.svg`, isBase: true },
  { name: 'AutoGroup', icon: `${iconBaseUrl}Auto.svg`, isBase: true },
  { name: 'LoadBalance', icon: `${iconBaseUrl}Round_Robin.svg`, isBase: true },

  // 专属服务策略组
  { name: 'AdBlock', icon: `${iconBaseUrl}AdBlock.svg`, reject: true },
  { name: 'FCM', icon: `${iconBaseUrl}Fcm.svg`, direct: true },
  { name: 'Microsoft', icon: `${iconBaseUrl}Microsoft.svg`, direct: true },
  { name: 'Apple', icon: `${iconBaseUrl}Apple.svg`, direct: true },
  { name: 'GitHub', icon: `${iconBaseUrl}GitHub.svg`, direct: true },
  { name: 'Steam', icon: `${iconBaseUrl}Steam.svg`, direct: true },
  { name: 'PikPak', icon: `${iconBaseUrl}PikPak.svg`, direct: true },
  { name: 'Meta', icon: `${iconBaseUrl}Meta.svg` },
  { name: 'Line', icon: `${iconBaseUrl}Line.svg` },
  { name: 'Speedtest', icon: `${iconBaseUrl}Speedtest.svg`, direct: true },
  { name: 'AI', icon: `${iconBaseUrl}ChatGPT.svg`, proxies: ['Manual', 'US', 'JP', 'SG', 'TW', 'HK', 'Other'] },
  { name: 'Telegram', icon: `${iconBaseUrl}Telegram.svg` },
  { name: 'Google', icon: `${iconBaseUrl}Google.svg` },
  { name: 'YouTube', icon: `${iconBaseUrl}YouTube.svg` },
  { name: 'Spotify', icon: `${iconBaseUrl}Spotify.svg` },
  { name: 'Emby', icon: `${iconBaseUrl}Emby.svg` },
  { name: 'TikTok', icon: `${iconBaseUrl}TikTok.svg` },
  { name: 'Twitter', icon: `${iconBaseUrl}Twitter.svg` },
  { name: 'Instagram', icon: `${iconBaseUrl}Instagram.svg` },

  // 细分流媒体组
  { name: 'Bilibili', icon: `${iconBaseUrl}bilibili.svg`, proxies: ['DIRECT', 'HK', 'TW'] },
  { name: 'Bahamut', icon: `${iconBaseUrl}Bahamut.svg`, proxies: ['TW', 'HK', 'Manual'] },
  { name: 'Netflix', icon: `${iconBaseUrl}Netflix.svg` },
  { name: 'Disney', icon: `${iconBaseUrl}Disney.svg` },
  { name: 'PrimeVideo', icon: `${iconBaseUrl}Prime_Video.svg` },
  { name: 'HBO', icon: `${iconBaseUrl}HBO.svg` },

  { name: 'Final', icon: `${iconBaseUrl}Final.svg` }
];

/**
 * 用户自定义配置开关
 */
var ruleOptionsEnable = {
  // 基础策略组
  'Manual': true,
  'SelectGroup': true,
  'AutoGroup': true,
  'LoadBalance': true,

  // 分流服务
  FCM: true,
  Microsoft: true,
  Apple: true,
  GitHub: true,
  Steam: true,
  Meta: true,
  Line: true,
  PikPak: true,
  AdBlock: true,
  Speedtest: true,
  AI: true,
  Spotify: true,
  YouTube: true,
  Google: true,
  Telegram: true,
  Twitter: true,
  Instagram: true,
  Emby: true,
  TikTok: true,

  // 细分流媒体
  Bilibili: true,
  Bahamut: true,
  Netflix: true,
  Disney: true,
  PrimeVideo: true,
  HBO: true,

  // ================= 其他设置 =================

  // 分流模式
  极简分流模式: false, // 开启后仅保留极简分流，减少策略组数量

  // 策略组生成
  生成地区自动选择组: false,
  隐藏地区手动选择组: false,
  生成低倍率组: false,
  生成高倍率组: false,

  // 节点过滤
  过滤非地区节点: true,
  过滤低倍率节点: false,
  过滤高倍率节点: false,
  分流组添加所有节点: false,

  // 节点整理
  自动补国旗: true,
  节点序号规整化: true,
  去除节点广告前缀后缀: true,

  // 网络策略
  屏蔽国外QUIC: true, // 精准拦截境外 QUIC，防止境外流媒体 UDP 断流
  代理IPV4优先: true,
  代理IPV6优先: false,
  特定域名阻断IPv6: true,

  // DNS
  DNS防泄漏强化: true,
  DNSFallback容灾: true,

  // 节点裂变
  节点裂变UDP: false,

  // 自动测速间隔
  自动测试间隔_10分钟: false,
  自动测试间隔_30分钟: true,
  自动测试间隔_60分钟: false,

  // 自动测速容差
  自动测试容差_10ms: false,
  自动测试容差_20ms: true,
  自动测试容差_50ms: false
};

/**
 * 策略组备选池定义
 */
Compatible_With_Bettbox.policyGroupOptions = [
  'Manual', 'SelectGroup', 'AutoGroup', 'LoadBalance',
  'HK', 'SG', 'JP', 'US', 'TW', 'Other',
  'HKAuto', 'SGAuto', 'JPAuto', 'USAuto', 'TWAuto',
  'LowGroup', 'HighGroup',
  'FCM', 'Microsoft', 'Apple', 'GitHub', 'Steam', 'Meta', 'Line', 'PikPak', 'AdBlock',
  'Speedtest', 'AI', 'Telegram', 'Google', 'YouTube',
  'Spotify', 'Emby', 'TikTok', 'Twitter', 'Instagram',
  'Bilibili', 'Bahamut', 'Netflix', 'Disney', 'PrimeVideo', 'HBO', 'Final'
];

// ==========================================
// 0. 上游键名兼容映射
//    上游逻辑读取的键在此统一解析，保证你的开关表保持原样
// ==========================================
const OPT = {
  ...ruleOptionsEnable,

  // 名称差异映射
  极简国内外分流模式: ruleOptionsEnable.极简分流模式 === true,
  生成高低倍率组:
    ruleOptionsEnable.生成低倍率组 === true || ruleOptionsEnable.生成高倍率组 === true,
  屏蔽代理QUIC流量: ruleOptionsEnable.屏蔽国外QUIC === true,
  手动选择: ruleOptionsEnable.Manual !== false,
  自动选择: ruleOptionsEnable.AutoGroup !== false,
  负载均衡: ruleOptionsEnable.LoadBalance !== false,

  // 你的表中不存在的上游开关，统一关闭
  链式代理: false,
  生成家宽节点组: false,
};

// ==========================================
// 1. 正则与文本清洗
// ==========================================
const hkPattern = '(🇭🇰|香港|(?<![A-Za-z])HKG?(?![A-Za-z])|hong\\s*kong)';
const jpPattern = '(🇯🇵|日本|东京|大阪|京都|(?<![A-Za-z])JPN?(?![A-Za-z])|japan)';
const usPattern = '(🇺🇸|美国|纽约|洛杉矶|旧金山|芝加哥|休斯顿|迈阿密|西雅图|波士顿|华盛顿|拉斯维加斯|圣何塞|(?<![A-Za-z])USA?(?![A-Za-z])|america|united\\s*states)';
const sgPattern = '(🇸🇬|新加坡|狮城|(?<![A-Za-z])SGP?(?![A-Za-z])|singapore)';
const twPattern = '(🇹🇼|台湾|台北|高雄|(?<![A-Za-z])TWN?(?![A-Za-z])|taiwan)';

const globalPattern = '(群|返利|循环|官网|客服|网站|网址|获取|订阅|流量|到期|机场|下次|版本|官址|过期|已用|联系|邮箱|工单|贩卖|通知|倒卖|防止|国内|地址|电报|频道|无法|说明|提示|访问|支持|教程|关注|更新|作者|加入|超时|收藏|优惠|福利|邀请|好友|失联|选择|剩余|公益|发布|DIZTNA|通路|登录|定时|渠道|牢记|永久|余额|阁下|本站|刷新|导航|建议|重置|以下|过滤|⚠️|@|t\\.me\\/\\+|\\bexpire\\b|\\bhttps?:\\/\\/|\\.com|\\btraffic\\b)';

const excludeMainlandPattern = `(${hkPattern}|${jpPattern}|${usPattern}|${sgPattern}|${twPattern})`;
const globalExclude = `(?i)${globalPattern}`;
const hkFilter = `(?i)${hkPattern}`;
const jpFilter = `(?i)${jpPattern}`;
const usFilter = `(?i)${usPattern}`;
const sgFilter = `(?i)${sgPattern}`;
const twFilter = `(?i)${twPattern}`;
// 仅匹配港 / 日 / 美 / 新 / 台五大地区（用于负载均衡组收窄节点范围）
const fiveRegionFilter = `(?i)${excludeMainlandPattern}`;
const otherExclude = `(?i)(${excludeMainlandPattern}|${globalPattern})`;

const globalExcludeRegex = new RegExp(globalPattern, 'i');
const lowRateFilter = /(?:(?<![\d.])0(\.[0-5]|[*×✕✖⨯⨉x倍]))|(?:[*×✕✖⨯⨉x]0)|低倍|免费|(?<![A-Za-z])free(?![A-Za-z])/i;
const highRateFilter = /(?:[*×✕✖⨯⨉x](?:[2-9]\d*|[1-9]\d+)(?:\.\d+)?)|(?:(?<![\d.])(?:[2-9]\d*|[1-9]\d+)(?:\.\d+)?(?:倍|[*×✕✖⨯⨉x]))/i;

const flagEmojiRegex = /[\u{1F1E6}-\u{1F1FF}]{2}/u;

function cleanNodeName(name) {
  if (!name) return '';
  let cleaned = name;
  cleaned = cleaned.replace(/^[\[【(（][^\]】)）]*(专线|特惠|游戏|BGP|中继|IPLC|IEPL|中转|直连|高速|优质|推荐)[^\]】)）]*[\]】)）]\s*/i, '');
  cleaned = cleaned.replace(/^(官网|网址|地址|域名|官址)\s*[:：]\s*\S+\s*[-—|]?\s*/i, '');
  cleaned = cleaned.replace(/\s*[-—|]\s*(剩余流量|到期时间|已用|倍率|官网|备用)\s*[:：]?\s*.*$/i, '');
  return cleaned.trim() || name;
}

function autoAppendFlag(name) {
  if (!name) return '';
  if (flagEmojiRegex.test(name)) return name;
  if (new RegExp(hkPattern, 'i').test(name)) return `🇭🇰 ${name}`;
  if (new RegExp(jpPattern, 'i').test(name)) return `🇯🇵 ${name}`;
  if (new RegExp(usPattern, 'i').test(name)) return `🇺🇸 ${name}`;
  if (new RegExp(sgPattern, 'i').test(name)) return `🇸🇬 ${name}`;
  if (new RegExp(twPattern, 'i').test(name)) return `🇹🇼 ${name}`;
  return name;
}

function formatNodeIndex(name) {
  if (!name) return '';
  let formatted = name.replace(/\s+/g, ' ').trim();
  formatted = formatted.replace(/(?<=[^\d])([1-9])(?=[^\d]*$)/, '0$1');
  return formatted;
}

// ==========================================
// 2. 地区与倍率定义（沿用本脚本正则）
// ==========================================
const regionDefinitions = [
  { name: '香港', flag: '🇭🇰', regex: new RegExp(hkPattern, 'i') },
  { name: '日本', flag: '🇯🇵', regex: new RegExp(jpPattern, 'i') },
  { name: '美国', flag: '🇺🇸', regex: new RegExp(usPattern, 'i') },
  { name: '新加坡', flag: '🇸🇬', regex: new RegExp(sgPattern, 'i') },
  { name: '台湾', flag: '🇹🇼', regex: new RegExp(twPattern, 'i') },
];

const lowRateRegionName = '低倍率';
const highRateRegionName = '高倍率';
const rateRegionDefinitions = [
  { name: lowRateRegionName, regex: lowRateFilter },
  { name: highRateRegionName, regex: highRateFilter },
];

// 家宽节点组未启用
const homeRegionDefinitions = [];

const allRegionDefinitions = [...regionDefinitions, ...rateRegionDefinitions, ...homeRegionDefinitions];

// 垃圾节点判定（沿用本脚本的全局排除正则）
const excludeFilter = globalExcludeRegex;


// ==========================================
// 3. 上游：节点识别、过滤与 DNS/hosts
// ==========================================

// ---节点过滤、重命名及验证---

/**
 * 零宽/不可见字符：部分机场会在节点名中逐字符插入这类字符（如 H\u200BK），会打断地区、倍率等正则匹配。
 *
 * 刻意排除三类「有语义」的字符，避免误伤：
 * - U+200C / U+200D（ZWNJ / ZWJ）：参与连字与 emoji 组合，删掉会改变字形；
 * - U+FE00–U+FE0F 及 U+E0100–U+E01EF（变体选择符）：控制 emoji 呈现方式。
 * 其余零宽/不可见字符不含任何语义，只用于干扰匹配，可安全忽略。
 */
const invisibleCharsRegex = /[\u00AD\u180E\u200B\u200E\u200F\u202A-\u202E\u2060-\u206F\uFEFF\u115F\u1160\u3164\uFFA0]/g;

/**
 * 取节点名「可用于匹配」的形式：剥离零宽/不可见字符
 */
function toMatchableName(name) {
  return typeof name === 'string' ? name.replace(invisibleCharsRegex, '') : name;
}

/**
 * 节点匹配缓存，避免重复执行正则
 */
const regionMatchCache = new Map();
function getMatchedRegions(proxyName) {
  if (regionMatchCache.has(proxyName)) {
    return regionMatchCache.get(proxyName);
  }

  const matchableName = toMatchableName(proxyName);
  const regions = allRegionDefinitions.filter((region) => region.regex.test(matchableName));
  regionMatchCache.set(proxyName, regions);

  return regions;
}

/**
 * 标准化节点名称：补全地区国旗、折叠多余空格，并预缓存匹配结果
 */
const flagRegex = /[\u{1F1E6}-\u{1F1FF}]{2}/u;
function normalizeProxyName(proxy) {
  let originalName = proxy.name;
  if (OPT.去除节点广告前缀后缀) originalName = cleanNodeName(originalName);
  if (OPT.节点序号规整化) originalName = formatNodeIndex(originalName);

  const flag = originalName.match(flagRegex)?.[0];

  const nameWithoutFlag = (flag ? originalName.replace(flag, '') : originalName).replace(/\s+/g, ' ').trim();

  const matchedRegions = getMatchedRegions(originalName);

  const regionFlag = flag || matchedRegions.find((region) => region.flag)?.flag;

  const normalizedName =
    OPT.自动补国旗 !== false && regionFlag
      ? `${regionFlag} ${nameWithoutFlag}`
      : nameWithoutFlag;

  if (normalizedName !== originalName) {
    regionMatchCache.set(normalizedName, matchedRegions);
  }

  return normalizedName === originalName ? proxy : { ...proxy, name: normalizedName };
}

/**
 * 修复 dialer-proxy 引用：目标被重命名则更新，被移除或不存在则删除引用
 */
function fixDialerProxy(proxy, renameMap, normalizedProxyNames) {
  const target = proxy['dialer-proxy'];
  if (!target) return proxy;

  if (renameMap.has(target)) {
    return { ...proxy, 'dialer-proxy': renameMap.get(target) };
  }

  if (normalizedProxyNames.has(target)) {
    return proxy;
  }

  const copy = { ...proxy };
  delete copy['dialer-proxy'];
  return copy;
}

/**
 * 读取代理 IP 版本偏好：仅其中一个开关开启时返回对应偏好，
 * 同时开启或同时关闭时返回 null（不应用任何偏好，节点保持原样）
 */
function getIpVersionPreference() {
  const ipv4PreferEnabled = OPT.代理IPV4优先;
  const ipv6PreferEnabled = OPT.代理IPV6优先;

  if (ipv4PreferEnabled && !ipv6PreferEnabled) return 'ipv4-prefer';
  if (ipv6PreferEnabled && !ipv4PreferEnabled) return 'ipv6-prefer';
  return null;
}

/**
 * 过滤并标准化节点：剔除内置/信息节点、按配置过滤、去重、修复 dialer-proxy 引用，空列表时抛错
 */
function filterAndNormalizeProxies(config) {
  regionMatchCache.clear();

  const filterLowRateProxiesEnabled = OPT.过滤低倍率节点;
  const filterHighRateProxiesEnabled = OPT.过滤高倍率节点;
  const filterNonRegionProxiesEnabled = OPT.过滤非地区节点;

  const lowRateRegex = filterLowRateProxiesEnabled
    ? rateRegionDefinitions.find((r) => r.name === lowRateRegionName)?.regex
    : null;
  const highRateRegex = filterHighRateProxiesEnabled
    ? rateRegionDefinitions.find((r) => r.name === highRateRegionName)?.regex
    : null;

  const originalProxies = config.proxies || [];

  const filteredRawProxies = originalProxies.filter((proxy) => {
    const type = String(proxy.type ?? '').toLowerCase();
    if (type === 'direct' || type === 'reject' || type === 'rematch') return false;

    const matchableName = toMatchableName(proxy.name);

    if (lowRateRegex?.test(matchableName) || highRateRegex?.test(matchableName)) return false;

    if (!filterNonRegionProxiesEnabled) return true;

    const isRegionProxy = getMatchedRegions(proxy.name).some((region) => regionDefinitions.includes(region));

    return isRegionProxy || !excludeFilter.test(matchableName);
  });

  const renameMap = new Map();
  const normalizedProxies = [];
  const uniqueNames = new Set();

  for (const rawProxy of filteredRawProxies) {
    const normalized = normalizeProxyName(rawProxy);
    if (normalized.name !== rawProxy.name) {
      renameMap.set(rawProxy.name, normalized.name);
    }
    if (!uniqueNames.has(normalized.name)) {
      uniqueNames.add(normalized.name);
      normalizedProxies.push(normalized);
    }
  }

  const normalizedProxyNames = new Set(normalizedProxies.map((p) => p.name));

  const filteredProxies = normalizedProxies.map((proxy) => fixDialerProxy(proxy, renameMap, normalizedProxyNames));

  if (!filteredProxies.length) {
    throw new Error('配置文件中未找到任何代理节点，请使用机场提供的配置文件进行覆写');
  }

  const ipVersionPreference = getIpVersionPreference();
  if (ipVersionPreference) {
    return filteredProxies.map((proxy) =>
      proxy['ip-version'] === ipVersionPreference ? proxy : { ...proxy, 'ip-version': ipVersionPreference },
    );
  }

  return filteredProxies;
}

// ---dns和hosts相关处理---

// 常见的公共 DNS，用于过滤订阅中的公共 DNS
const commonDnsList = [
  // ==================== 国内 ====================

  // 阿里 AliDNS（阿里云）
  '223.5.5.5',
  '223.6.6.6',
  '2400:3200::1',
  '2400:3200:baba::1',
  'alidns',

  // 腾讯 DNSPod（腾讯云）
  '119.29.29.29',
  '119.28.28.28',
  '182.254.116.116',
  '182.254.118.118',
  '1.12.12.12',
  '120.53.53.53',
  '2402:4e00::',
  'doh.pub',
  'dot.pub',
  'dns.pub',
  'dnspod',

  // 114DNS（南京信风）
  '114.114.114.114',
  '114.114.115.115',
  '114.114.114.119',
  '114.114.115.119',
  '114.114.114.110',
  '114.114.115.110',

  // 百度 BaiduDNS
  '180.76.76.76',
  '2400:da00::6666',
  'dns.baidu',

  // CNNIC SDNS（中国互联网络信息中心）
  '1.2.4.8',
  '210.2.4.8',
  '2001:dc7:1000::1',
  'cnnic',

  // 360 安全 DNS
  '101.226.4.6',
  '218.30.118.6',
  '123.125.81.6',
  '140.207.198.6',
  '2400:8800:1::6',
  '2400:8800:2::6',
  'doh.360',
  'dot.360',
  'dns.360',

  // 火山引擎（字节跳动）
  '180.184.1.1',
  '180.184.2.2',

  // OneDNS（微步在线，拦截版/纯净版/家庭版）
  '117.50.11.11',
  '117.50.22.22',
  '52.80.66.66',
  '117.50.10.10',
  '52.80.52.52',
  '117.50.60.30',
  '52.80.60.30',
  'onedns.net',

  // 清华大学 TUNA
  '101.6.6.6',
  '2001:da8::666',

  // 下一代互联网国家工程中心（IPv6 公共 DNS）
  '240c::6666',
  '240c::6644',

  // 中国科学技术大学（教育网防污染）
  '202.141.162.123',
  '202.141.178.13',

  // ==================== 国外 ====================

  // Cloudflare
  '1.1.1.1',
  '1.0.0.1',
  '1.1.1.2',
  '1.0.0.2',
  '1.1.1.3',
  '1.0.0.3',
  '2606:4700:4700::1111',
  '2606:4700:4700::1001',
  '2606:4700:4700::1112',
  '2606:4700:4700::1002',
  '2606:4700:4700::1113',
  '2606:4700:4700::1003',
  'dns.cloudflare',
  'cloudflare-dns',
  'one.one.one.one',

  // Google Public DNS
  '8.8.8.8',
  '8.8.4.4',
  '2001:4860:4860::8888',
  '2001:4860:4860::8844',
  'dns.google',

  // Quad9
  '9.9.9.9',
  '9.9.9.10',
  '9.9.9.11',
  '149.112.112.112',
  '149.112.112.10',
  '149.112.112.11',
  '2620:fe::fe',
  '2620:fe::9',
  'quad9',

  // Cisco OpenDNS（含 FamilyShield）
  '208.67.222.222',
  '208.67.220.220',
  '208.67.222.123',
  '208.67.220.123',
  '2620:119:35::35',
  '2620:119:53::53',
  '2620:119:35::123',
  '2620:119:53::123',
  'opendns',

  // AdGuard DNS（含家庭版）
  '94.140.14.14',
  '94.140.15.15',
  '94.140.14.15',
  '94.140.15.16',
  '2a10:50c0::ad1:ff',
  '2a10:50c0::ad2:ff',
  '2a10:50c0::bad1:ff',
  '2a10:50c0::bad2:ff',
  'adguard',

  // Control D
  '76.76.2.0',
  '76.76.10.0',
  '76.76.19.19',
  '76.223.122.150',

  // CleanBrowsing（含安全/家庭版）
  '185.228.168.9',
  '185.228.169.9',
  '185.228.168.10',
  '185.228.169.11',
  '185.228.168.168',
  '185.228.169.168',
  '2a0d:2a00:1::2',
  '2a0d:2a00:2::2',

  // Yandex DNS
  '77.88.8.8',
  '77.88.8.1',
  '2a02:6b8::feed:0ff',
  '2a02:6b8:0:1::feed:0ff',

  // Neustar UltraDNS
  '156.154.70.1',
  '156.154.71.1',
  '156.154.70.2',
  '156.154.71.2',
  '2610:a1:1018::1',
  '2610:a1:1019::1',

  // Mullvad DNS
  '194.242.2.2',
  '2a07:e340::2',

  // Hurricane Electric
  '74.82.42.42',
  '2001:470:20::2',

  // NextDNS
  'nextdns',

  // Apple
  'dns.apple',
];

// 预编译公共 DNS 正则
const commonDnsRegex = new RegExp(
  commonDnsList.map((dns) => dns.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|'),
  'i',
);

// 国内外 DNS 定义
const chinaDNS = ['223.5.5.5#DIRECT', '119.29.29.29#DIRECT'];
const foreignDNS = ['https://cloudflare-dns.com/dns-query#Manual', 'https://dns.google/dns-query#Manual'];
const defaultDNS = ['114.114.114.114#DIRECT', 'tls://223.5.5.5#DIRECT', 'https://1.12.12.12/dns-query#DIRECT'];
const proxyServerDNS = ['114.114.114.114#DIRECT', 'tls://223.5.5.5#DIRECT', 'https://doh.pub/dns-query#DIRECT'];

/**
 * hosts 匹配优先级：精确 > +. > . > *（同级按出现顺序）
 */
function hostSpecificity(pattern) {
  if (pattern.startsWith('+.')) return 2;
  if (pattern.startsWith('.')) return 1;
  if (pattern.includes('*')) return 0;
  return 3;
}

/**
 * 判断域名规则（精确/通配）是否匹配节点域名集合，忽略大小写
 */
function matchDomainPattern(pattern, domains) {
  pattern = pattern.toLowerCase();

  // 精确匹配
  if (!pattern.includes('*') && !pattern.startsWith('+.') && !pattern.startsWith('.')) {
    return typeof domains === 'string'
      ? domains.toLowerCase() === pattern
      : [...domains].some((d) => d.toLowerCase() === pattern);
  }

  const domainList = typeof domains === 'string' ? [domains.toLowerCase()] : [...domains].map((d) => d.toLowerCase());

  // +.example.com
  if (pattern.startsWith('+.')) {
    const suffix = pattern.slice(2);
    return domainList.some((domain) => domain === suffix || domain.endsWith(`.${suffix}`));
  }

  // .example.com
  if (pattern.startsWith('.')) {
    const suffix = pattern.slice(1);
    return domainList.some((domain) => domain !== suffix && domain.endsWith(`.${suffix}`));
  }

  // *.example.com、example.*.com 等
  const patternParts = pattern.split('.');
  return domainList.some((domain) => {
    const domainParts = domain.split('.');
    return (
      patternParts.length === domainParts.length &&
      patternParts.every((part, index) => part === '*' || part === domainParts[index])
    );
  });
}

/**
 * 预编译节点域名集合，返回「规则模式 → 是否命中」的匹配函数。
 * 精确 / `+.` / `.` 三类模式查预建集合；通配模式按「段数 + 通配位之后的固定后缀」分组后逐段比对，
 * 避免每个模式都遍历一遍整个域名集合（节点多时由 O(模式 × 域名) 降为近似 O(模式)）
 */
function createDomainMatcher(domains) {
  const exact = new Set();
  const suffixes = new Set();
  const properSuffixes = new Set();
  const splitDomains = [];

  for (const raw of domains) {
    const domain = raw.toLowerCase();
    if (exact.has(domain)) continue;
    exact.add(domain);
    const parts = domain.split('.');
    splitDomains.push(parts);
    suffixes.add(domain);
    for (let i = 1; i < parts.length; i++) {
      const suffix = parts.slice(i).join('.');
      suffixes.add(suffix);
      properSuffixes.add(suffix);
    }
  }

  let wildcardIndex = null;
  const candidatesOf = (key) => {
    if (!wildcardIndex) {
      wildcardIndex = new Map();
      for (const parts of splitDomains) {
        for (let i = 0; i <= parts.length; i++) {
          const indexKey = `${parts.length}:${parts.slice(i).join('.')}`;
          const list = wildcardIndex.get(indexKey);
          if (list) list.push(parts);
          else wildcardIndex.set(indexKey, [parts]);
        }
      }
    }
    return wildcardIndex.get(key) || [];
  };

  return (rawPattern) => {
    const pattern = String(rawPattern).toLowerCase();
    if (pattern.startsWith('+.')) return suffixes.has(pattern.slice(2));
    if (pattern.startsWith('.')) return properSuffixes.has(pattern.slice(1));
    if (!pattern.includes('*')) return exact.has(pattern);

    const patternParts = pattern.split('.');
    const key = `${patternParts.length}:${patternParts.slice(patternParts.lastIndexOf('*') + 1).join('.')}`;
    return candidatesOf(key).some((parts) =>
      patternParts.every((part, index) => part === '*' || part === parts[index]),
    );
  };
}

/**
 * 预编译 hosts 条目，返回「域名 → 命中条目」的查找函数。
 * 精确 / `+.` / `.` 三类按模式建索引，通配模式保底逐个比对；
 * 同类型命中时取 hosts 中靠前者，与「按优先级排序后线性查找」的结果保持一致。
 * 入参需已按 hostSpecificity 降序排列（同一键只保留最先出现的一条）
 */
function createHostFinder(hostEntries) {
  const exact = new Map();
  const plus = new Map();
  const dot = new Map();
  const wildcards = [];

  hostEntries.forEach((entry, index) => {
    const pattern = entry[0].toLowerCase();
    const level = hostSpecificity(pattern);
    if (level === 0) {
      wildcards.push(entry);
      return;
    }
    const [map, key] =
      level === 3 ? [exact, pattern] : level === 2 ? [plus, pattern.slice(2)] : [dot, pattern.slice(1)];
    if (!map.has(key)) map.set(key, { entry, index });
  });

  const firstOf = (map, keys) => {
    let found = null;
    for (const key of keys) {
      const item = map.get(key);
      if (item && (!found || item.index < found.index)) found = item;
    }
    return found?.entry;
  };

  return (domain) => {
    const exactEntry = exact.get(domain)?.entry;
    if (exactEntry) return exactEntry;

    const parts = domain.split('.');
    const suffixes = parts.map((_, i) => parts.slice(i).join('.'));
    return (
      firstOf(plus, suffixes) ??
      firstOf(dot, suffixes.slice(1)) ??
      wildcards.find(([pattern]) => matchDomainPattern(pattern, domain))
    );
  };
}

/**
 * 根据订阅 hosts 映射改写节点 server，改写后无需再复制 hosts 进新配置。
 * 支持链式映射（如 a: b、b: c 时节点 a 改写为 c）；
 * 回环映射（a: b、b: a）由内核校验拒绝，此处仅以已访问集合防御性终止
 */
function applyHostsToProxies(proxies, hosts) {
  if (!hosts || typeof hosts !== 'object') return proxies;

  const hostEntries = Object.entries(hosts)
    .filter(
      ([, value]) => (typeof value === 'string' && value.length > 0) || (Array.isArray(value) && value.length > 0),
    )
    .sort((a, b) => hostSpecificity(b[0]) - hostSpecificity(a[0]));

  if (hostEntries.length === 0) return proxies;

  const targetOf = (value) => {
    if (Array.isArray(value)) value = value.find((v) => typeof v === 'string' && v.length > 0);
    return typeof value === 'string' && value.length > 0 ? value : null;
  };

  const findHost = createHostFinder(hostEntries);
  const resolveCache = new Map();
  const resolve = (server) => {
    const cached = resolveCache.get(server);
    if (cached !== undefined) return cached;

    const seen = new Set();
    let current = server.toLowerCase();
    let result = server;
    while (!seen.has(current)) {
      seen.add(current);
      const entry = findHost(current);
      const target = entry && targetOf(entry[1]);
      if (!target) break;
      result = target;
      current = target.toLowerCase();
    }
    resolveCache.set(server, result);
    return result;
  };

  return proxies.map((proxy) => {
    if (typeof proxy.server !== 'string') return proxy;
    const server = resolve(proxy.server);
    return server === proxy.server ? proxy : { ...proxy, server };
  });
}

/**
 * 剥离 DNS 地址的 # 策略组后缀；
 * 参数包含 direct 或 直连 时，强制改为 #DIRECT
 */
function stripDnsSuffix(dns) {
  const str = String(dns);
  const hashIndex = str.indexOf('#');
  if (hashIndex === -1) return str;

  const prefix = str.slice(0, hashIndex).trim();

  const suffix = str
    .slice(hashIndex + 1)
    .toLowerCase()
    .trim();

  if (suffix.includes('direct') || suffix.includes('直连')) return prefix + '#DIRECT';

  return prefix;
}

/**
 * 判断节点 server 是否为 IP 地址（IPv4 / IPv6），用于从节点域名集合中排除 IP 类型的 server
 */
function isIpAddress(server) {
  return /^\d{1,3}(\.\d{1,3}){3}$/.test(server) || server.includes(':');
}

/**
 * 简化节点域名策略：将相同 DNS 的节点域名按后缀归类，至少三段的域名可合并为 +. 后缀形式
 */
function simplifyDomainPolicy(policy) {
  const groups = new Map();

  for (const [domain, dns] of Object.entries(policy)) {
    const dnsKey = JSON.stringify(Array.isArray(dns) ? [...dns].sort() : dns);

    if (domain.startsWith('+.') || domain.startsWith('.') || domain.includes('*')) {
      groups.set(`keep:${domain}`, [{ domain, dns, dnsKey }]);
      continue;
    }

    const parts = domain.split('.');

    if (parts.length < 3) {
      groups.set(`keep:${domain}`, [{ domain, dns, dnsKey }]);
      continue;
    }

    const suffix = parts.slice(-2).join('.');

    if (!groups.has(suffix)) {
      groups.set(suffix, []);
    }

    groups.get(suffix).push({ domain, dns, dnsKey });
  }

  const result = {};

  for (const [suffix, domains] of groups) {
    const firstDnsKey = domains[0].dnsKey;
    const sameDns = domains.every(({ dnsKey }) => dnsKey === firstDnsKey);

    if (domains.length >= 2 && sameDns) {
      result[`+.${suffix}`] = domains[0].dns;
    } else {
      for (const { domain, dns } of domains) {
        result[domain] = dns;
      }
    }
  }

  return result;
}

/**
 * 构建 DNS 与 hosts：保留私有 DNS、节点域名 policy/fake-ip-filter，并按 hosts 改写节点 server
 * hosts改写条件（满足任意一个条件即可）：
 * 1. proxy-server-nameserver 不存在或为空
 * 2. proxy-server-nameserver 有且仅有一个 DNS 并且该 DNS 包含非空的 listen 值
 * 3. proxy-server-nameserver 有且仅有一个 DNS 并且该 DNS 包含 127.0.0.1 并且 listen 包含 0.0.0.0
 */
function buildDnsAndHostsConfig(config, filteredProxies) {
  const minimalModeEnabled = OPT.极简国内外分流模式;

  const originalDnsConfig = config.dns || {};
  const listenValue = originalDnsConfig['listen'];
  const rawProxyServerNameservers = originalDnsConfig['proxy-server-nameserver'];

  const proxyServerNameservers = (
    Array.isArray(rawProxyServerNameservers)
      ? rawProxyServerNameservers
      : rawProxyServerNameservers === undefined || rawProxyServerNameservers === null
        ? []
        : [rawProxyServerNameservers]
  ).filter((dns) => String(dns ?? '').trim() !== '');

  const isProxyServerNameserverEmpty = proxyServerNameservers.length === 0;

  const shouldRewriteByListen =
    proxyServerNameservers.length === 1 &&
    typeof listenValue === 'string' &&
    listenValue.length > 0 &&
    (proxyServerNameservers.some((dns) => String(dns).toLowerCase().includes(listenValue.toLowerCase())) ||
      (listenValue.includes('0.0.0.0') &&
        proxyServerNameservers.some((dns) => String(dns).toLowerCase().includes('127.0.0.1'))));

  const shouldRewriteByHosts = isProxyServerNameserverEmpty || shouldRewriteByListen;

  const mappedProxies = shouldRewriteByHosts ? applyHostsToProxies(filteredProxies, config.hosts) : filteredProxies;

  const proxyDomains = new Set(
    mappedProxies
      .filter((proxy) => typeof proxy.server === 'string')
      .map((proxy) => proxy.server.toLowerCase())
      .filter((server) => !isIpAddress(server)),
  );

  const matchProxyDomain = createDomainMatcher(proxyDomains);

  const privateProxyServerNameservers = shouldRewriteByHosts ? [] : proxyServerNameservers;

  const isCommonDns = (dns) => {
    const value = String(dns).trim().toLowerCase();
    if (value === 'system' || value === 'system://') return true;

    return commonDnsRegex.test(value);
  };

  const privateDNS = [
    ...new Set(
      [...(originalDnsConfig['nameserver'] || []), ...privateProxyServerNameservers]
        .map(stripDnsSuffix)
        .filter((dns) => dns.length > 0 && !isCommonDns(dns)),
    ),
  ];

  const matchedProxyPolicy = {};
  for (const [domain, dns] of Object.entries({
    ...originalDnsConfig['nameserver-policy'],
    ...originalDnsConfig['proxy-server-nameserver-policy'],
  })) {
    if (!matchProxyDomain(domain)) continue;

    const stripedDns = Array.isArray(dns) ? dns.map(stripDnsSuffix).filter((d) => d.length > 0) : stripDnsSuffix(dns);
    if (Array.isArray(stripedDns) && stripedDns.length === 0) continue;

    matchedProxyPolicy[domain] = stripedDns;
  }

  if (privateDNS.length > 0 && Object.keys(matchedProxyPolicy).length === 0) {
    for (const domain of proxyDomains) {
      matchedProxyPolicy[domain] = privateDNS;
    }
  }

  const matchedPolicyDomains = Object.keys(matchedProxyPolicy);
  const proxyServerPolicy =
    proxyDomains.size === matchedPolicyDomains.length &&
    matchedPolicyDomains.every((domain) => proxyDomains.has(domain.toLowerCase()))
      ? simplifyDomainPolicy(matchedProxyPolicy)
      : matchedProxyPolicy;

  const originalFakeIpFilter = originalDnsConfig['fake-ip-filter'] || [];
  const proxyFakeIpFilter = originalFakeIpFilter.filter((pattern) => matchProxyDomain(pattern));

  const dns = {
    enable: true,
    ipv6: true,
    'use-hosts': true,
    'cache-algorithm': 'arc',
    'use-system-hosts': true,
    'enhanced-mode': 'fake-ip',
    'fake-ip-range': '198.18.0.1/15',
    'fake-ip-range6': '2001:2::1/48',
    'fake-ip-filter': [
      'rule-set:private',
      'rule-set:fakeip_filter',
      'rule-set:cn',
      ...(minimalModeEnabled ? [] : OPT['FCM'] ? ['rule-set:googlefcm'] : []),
      ...proxyFakeIpFilter,
    ],
    'default-nameserver': defaultDNS,
    'proxy-server-nameserver': proxyServerDNS,
    ...(Object.keys(proxyServerPolicy).length > 0 && {
      'proxy-server-nameserver-policy': proxyServerPolicy,
    }),
    nameserver: foreignDNS,
    'nameserver-policy': {
      'rule-set:private': 'system',
      'rule-set:douyin': ['180.184.1.1#DIRECT', '180.184.2.2#DIRECT'],
      'rule-set:cn': chinaDNS,
    },
    'direct-nameserver': chinaDNS,
    'direct-nameserver-follow-policy': true,
  };

  const hosts = {
    'doh.pub': ['1.12.12.12', '120.53.53.53'],
    'cloudflare-dns.com': ['1.1.1.1', '1.0.0.1'],
    'dns.google': ['8.8.8.8', '8.8.4.4'],

    // 解决谷歌商店无法下载的问题
    'services.googleapis.cn': 'services.googleapis.com',

    // 屏蔽哔哩哔哩PCDN，解决访问视频/直播卡顿问题
    '+.mcdn.bilivideo.com': ['0.0.0.0'],
    '+.mcdn.bilivideo.cn': ['0.0.0.0'],
    '+.edge.mountaintoys.cn': ['0.0.0.0'],
    '+.h2.smtcdns.net': ['0.0.0.0'],
  };

  return { dns, hosts, proxies: mappedProxies };
}

// ==========================================
// 4. 主函数 main
// ==========================================
function main(config) {
  config['mixed-port'] = 7890;
  config['allow-lan'] = true;
  config['ipv6'] = true;
  config['mode'] = 'rule';
  config['log-level'] = 'info';
  config['bind-address'] = '*';
  config['unified-delay'] = true;
  config['tcp-concurrent'] = true;
  config['keep-alive-interval'] = 60;
  config['find-process-mode'] = 'strict';
  config['external-controller'] = '127.0.0.1:9090';
  config['external-ui'] = 'ui';
  config['external-ui-url'] = 'https://github.com/Zephyruso/zashboard/releases/latest/download/dist.zip';

  config['profile'] = {
    'store-selected': true,
    'store-fake-ip': true
  };

  // 节点过滤、改名、去重、dialer-proxy 修复（上游实现）
  const filteredProxies = filterAndNormalizeProxies(config);

  // DNS 与 hosts（上游实现）
  const { dns, hosts, proxies: mappedProxies } = buildDnsAndHostsConfig(config, filteredProxies);
  config['dns'] = dns;
  config['hosts'] = hosts;

  // 节点裂变：为支持 UDP 的节点生成 [UDP] 副本
  if (ruleOptionsEnable.节点裂变UDP) {
    const clones = mappedProxies
      .filter((proxy) => proxy.udp !== false)
      .map((proxy) => ({ ...proxy, name: `[UDP] ${proxy.name}`, udp: true }));
    config['proxies'] = [...mappedProxies, ...clones];
  } else {
    config['proxies'] = mappedProxies;
  }

  config['ntp'] = {
    enable: true,
    'write-to-system': false,
    server: 'ntp.aliyun.com',
    port: 123,
    interval: 60
  };

  config['tun'] = {
    enable: true,
    stack: 'mips',
    'auto-route': true,
    'strict-route': true,
    'auto-redirect': true,
    'auto-detect-interface': true,
    'dns-hijack': ['any:53', 'tcp://any:53']
  };

  const allProxyNames = (config.proxies || []).map(p => p.name);
  
  const basicFunctionGroups = [];
  if (ruleOptionsEnable['SelectGroup'] !== false) basicFunctionGroups.push('SelectGroup');
  if (ruleOptionsEnable['AutoGroup'] !== false) basicFunctionGroups.push('AutoGroup');
  if (ruleOptionsEnable['LoadBalance'] !== false) basicFunctionGroups.push('LoadBalance');

  const baseRegionList = [];
  if (!ruleOptionsEnable.极简分流模式) {
    baseRegionList.push('HK', 'SG', 'JP', 'US', 'TW', 'Other');
    if (ruleOptionsEnable.生成地区自动选择组) {
      baseRegionList.push('HKAuto', 'SGAuto', 'JPAuto', 'USAuto', 'TWAuto');
    }
  }

  const rateGroupsList = [];
  if (!ruleOptionsEnable.极简分流模式) {
    if (ruleOptionsEnable.生成低倍率组) rateGroupsList.push('LowGroup');
    if (ruleOptionsEnable.生成高倍率组) rateGroupsList.push('HighGroup');
  }

  let manualGroupProxies = [
    ...baseRegionList,
    ...basicFunctionGroups,
    ...rateGroupsList
  ];

  if (manualGroupProxies.length === 0) {
    manualGroupProxies = allProxyNames.length > 0 ? allProxyNames : ['DIRECT'];
  }

  const commonProxies = ['Manual', ...basicFunctionGroups, ...baseRegionList, ...rateGroupsList];
  const serviceProxies = ruleOptionsEnable.分流组添加所有节点
    ? [...commonProxies, ...allProxyNames]
    : commonProxies;

  const groups = [];

  // ① Manual
  if (ruleOptionsEnable['Manual'] !== false) {
    groups.push({
      name: 'Manual',
      type: 'select',
      proxies: manualGroupProxies,
      icon: `${iconBaseUrl}Proxy.svg`
    });
  }

  // ② SelectGroup
  if (ruleOptionsEnable['SelectGroup'] !== false) {
    groups.push({
      name: 'SelectGroup',
      type: 'select',
      'include-all': true,
      'exclude-filter': globalExclude,
      icon: `${iconBaseUrl}Static.svg`
    });
  }

  // ③ AutoGroup
  if (ruleOptionsEnable['AutoGroup'] !== false) {
    groups.push({
      name: 'AutoGroup',
      type: 'url-test',
      'include-all': true,
      interval: 300,
      tolerance: 50,
      url: 'http://1.1.1.1/generate_204',
      'exclude-filter': globalExclude,
      icon: `${iconBaseUrl}Auto.svg`
    });
  }

  // ④ LoadBalance（仅收港 / 日 / 美 / 新 / 台节点）
  if (ruleOptionsEnable['LoadBalance'] !== false) {
    groups.push({
      name: 'LoadBalance',
      type: 'load-balance',
      'include-all': true,
      strategy: 'consistent-hashing',
      interval: 300,
      url: 'http://1.1.1.1/generate_204',
      filter: fiveRegionFilter,
      'exclude-filter': globalExclude,
      icon: `${iconBaseUrl}Round_Robin.svg`
    });
  }

  // ⑤ 专属分流
  if (ruleOptionsEnable.极简分流模式) {
    // 上游语义：极简模式生成「默认代理」组，直接平铺全部节点
    const autoSelectEnabled = ruleOptionsEnable['AutoGroup'] !== false;
    groups.push({
      name: '默认代理',
      type: 'select',
      proxies: [...allProxyNames, ...(autoSelectEnabled ? ['AutoGroup'] : [])],
      icon: `${iconBaseUrl}Proxy.svg`
    });
    groups.push({
      name: 'Final',
      type: 'select',
      proxies: ['默认代理', 'DIRECT'],
      icon: `${iconBaseUrl}Final.svg`
    });
  } else {
    serviceConfigs.filter(svc => !svc.isBase).forEach(svc => {
      if (ruleOptionsEnable[svc.name] === false) return;

      let finalProxies = [];
      if (svc.reject) {
        finalProxies = ['REJECT', 'REJECT-DROP', 'PASS'];
      } else if (svc.proxies) {
        finalProxies = [...svc.proxies, ...serviceProxies.filter(p => !svc.proxies.includes(p))];
      } else {
        finalProxies = svc.direct ? [...serviceProxies, 'DIRECT'] : [...serviceProxies];
      }

      groups.push({
        name: svc.name,
        type: 'select',
        interval: 300,
        url: 'http://1.1.1.1/generate_204',
        'max-failed-times': 5,
        proxies: finalProxies,
        icon: svc.icon
      });
    });
  }

  // ⑥ 地区细分策略组
  if (!ruleOptionsEnable.极简分流模式) {
    const hideManual = ruleOptionsEnable.隐藏地区手动选择组 === true;
    const regionSelectConfigs = [
      { name: 'HK', filter: hkFilter, icon: `${iconBaseUrl}Hong_Kong.svg` },
      { name: 'SG', filter: sgFilter, icon: `${iconBaseUrl}Singapore.svg` },
      { name: 'JP', filter: jpFilter, icon: `${iconBaseUrl}Japan.svg` },
      { name: 'US', filter: usFilter, icon: `${iconBaseUrl}United_States.svg` },
      { name: 'TW', filter: twFilter, icon: `${iconBaseUrl}Taiwan.svg` },
      { name: 'Other', 'exclude-filter': otherExclude, icon: `${iconBaseUrl}Global.svg` }
    ];

    regionSelectConfigs.forEach(r => {
      groups.push({
        name: r.name,
        type: 'select',
        'include-all': true,
        ...(r.filter && { filter: r.filter }),
        ...(r['exclude-filter'] && { 'exclude-filter': r['exclude-filter'] }),
        hidden: hideManual,
        icon: r.icon
      });
    });

    if (ruleOptionsEnable.生成地区自动选择组) {
      let dynamicInterval = 1800;
      if (ruleOptionsEnable.自动测试间隔_10分钟) dynamicInterval = 600;
      if (ruleOptionsEnable.自动测试间隔_60分钟) dynamicInterval = 3600;

      let dynamicTolerance = 20;
      if (ruleOptionsEnable.自动测试容差_10ms) dynamicTolerance = 10;
      if (ruleOptionsEnable.自动测试容差_50ms) dynamicTolerance = 50;

      const regionAutoConfigs = [
        { name: 'HKAuto', filter: hkFilter, icon: `${iconBaseUrl}Hong_Kong.svg` },
        { name: 'SGAuto', filter: sgFilter, icon: `${iconBaseUrl}Singapore.svg` },
        { name: 'JPAuto', filter: jpFilter, icon: `${iconBaseUrl}Japan.svg` },
        { name: 'USAuto', filter: usFilter, icon: `${iconBaseUrl}United_States.svg` },
        { name: 'TWAuto', filter: twFilter, icon: `${iconBaseUrl}Taiwan.svg` }
      ];

      regionAutoConfigs.forEach(r => {
        groups.push({
          name: r.name,
          type: 'url-test',
          'include-all': true,
          interval: dynamicInterval,
          tolerance: dynamicTolerance,
          hidden: true,
          url: 'http://1.1.1.1/generate_204',
          filter: r.filter,
          'exclude-filter': globalExclude,
          icon: r.icon
        });
      });
    }

    if (ruleOptionsEnable.生成低倍率组) {
      groups.push({
        name: 'LowGroup',
        type: 'select',
        'include-all': true,
        filter: lowRateFilter.source,
        'exclude-filter': globalExclude,
        icon: `${iconBaseUrl}Available.svg`
      });
    }

    if (ruleOptionsEnable.生成高倍率组) {
      groups.push({
        name: 'HighGroup',
        type: 'select',
        'include-all': true,
        filter: highRateFilter.source,
        'exclude-filter': globalExclude,
        icon: `${iconBaseUrl}Airport.svg`
      });
    }
  }

  config['proxy-groups'] = groups;

  // 7. 规则集提供者定义 (Classical 与 MRS)
  const cProvider = { type: 'http', behavior: 'classical', format: 'text', interval: 86400 };
  const domainMrs = { type: 'http', format: 'mrs', interval: 86400, behavior: 'domain' };
  const ipMrs = { type: 'http', format: 'mrs', interval: 86400, behavior: 'ipcidr' };

  config['rule-providers'] = {
    Direct: { ...cProvider, url: 'https://github.com/Repcz/Tool/raw/X/mihomo/Rules/Direct.list' },
    Lan: { ...cProvider, url: 'https://github.com/Repcz/Tool/raw/X/mihomo/Rules/Lan.list' },
    Reject: { ...cProvider, url: 'https://github.com/Repcz/Tool/raw/X/mihomo/Rules/Reject.list' },
    YouTube: { ...cProvider, url: 'https://raw.githubusercontent.com/Repcz/Tool/refs/heads/X/mihomo/Rules/YouTube.list' },
    Google: { ...cProvider, url: 'https://raw.githubusercontent.com/Repcz/Tool/refs/heads/X/mihomo/Rules/Google.list' },
    Telegram: { ...cProvider, url: 'https://raw.githubusercontent.com/Repcz/Tool/refs/heads/X/mihomo/Rules/Telegram.list' },
    Twitter: { ...cProvider, url: 'https://raw.githubusercontent.com/Repcz/Tool/refs/heads/X/mihomo/Rules/Twitter.list' },
    Instagram: { ...cProvider, url: 'https://raw.githubusercontent.com/Repcz/Tool/refs/heads/X/mihomo/Rules/Instagram.list' },
    AI: { ...cProvider, url: 'https://raw.githubusercontent.com/Repcz/Tool/refs/heads/X/mihomo/Rules/AI.list' },
    Spotify: { ...cProvider, url: 'https://raw.githubusercontent.com/Repcz/Tool/refs/heads/X/mihomo/Rules/Spotify.list' },
    Emby: { ...cProvider, url: 'https://raw.githubusercontent.com/Repcz/Tool/raw/X/mihomo/Rules/Emby.list' },
    Bahamut: { ...cProvider, url: 'https://raw.githubusercontent.com/Repcz/Tool/refs/heads/X/mihomo/Rules/Bahamut.list' },
    Netflix: { ...cProvider, url: 'https://raw.githubusercontent.com/Repcz/Tool/refs/heads/X/mihomo/Rules/Netflix.list' },
    Disney: { ...cProvider, url: 'https://raw.githubusercontent.com/Repcz/Tool/refs/heads/X/mihomo/Rules/Disney.list' },
    PrimeVideo: { ...cProvider, url: 'https://raw.githubusercontent.com/Repcz/Tool/refs/heads/X/mihomo/Rules/PrimeVideo.list' },
    HBO: { ...cProvider, url: 'https://raw.githubusercontent.com/Repcz/Tool/refs/heads/X/mihomo/Rules/HBO.list' },
    TikTok: { ...cProvider, url: 'https://raw.githubusercontent.com/Repcz/Tool/refs/heads/X/mihomo/Rules/TikTok.list' },
    Speedtest: { ...cProvider, url: 'https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Surge/Speedtest/Speedtest.list' },

    BilibiliHMT: { ...cProvider, url: 'https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/BiliBiliHMT/BiliBiliHMT.list' },

    // 【新增】精准非中国资产规则集，专用于境外 QUIC 拦截与精确分流判定
    'geolocation-!cn': { ...domainMrs, url: `${ruleSetBaseUrl}geosite/geolocation-!cn.mrs`, path: './ruleset/geolocation-!cn.mrs' },

    'category-ads': { ...domainMrs, url: `${ruleSetBaseUrl}geosite/category-ads.mrs`, path: './ruleset/category-ads.mrs' },
    googlefcm: { ...domainMrs, url: `${ruleSetBaseUrl}geosite/googlefcm.mrs`, path: './ruleset/googlefcm.mrs' },
    private: { ...domainMrs, url: `${ruleSetBaseUrl}geosite/private.mrs`, path: './ruleset/private.mrs' },
    fakeip_filter: { ...domainMrs, url: `${ruleSetBaseUrl}geosite/fakeip-filter.mrs`, path: './ruleset/fakeip_filter.mrs' },
    cn: { ...domainMrs, url: `${ruleSetBaseUrl}geosite/cn.mrs`, path: './ruleset/cn.mrs' },
    douyin: { ...domainMrs, url: `${ruleSetBaseUrl}geosite/douyin.mrs`, path: './ruleset/douyin.mrs' },
    microsoft: { ...domainMrs, url: `${ruleSetBaseUrl}geosite/microsoft.mrs`, path: './ruleset/microsoft.mrs' },
    microsoft_ip: { ...ipMrs, url: `${ruleSetBaseUrl}geoip/microsoft.mrs`, path: './ruleset/microsoft_ip.mrs' },
    apple: { ...domainMrs, url: `${ruleSetBaseUrl}geosite/apple.mrs`, path: './ruleset/apple.mrs' },
    apple_ip: { ...ipMrs, url: `${ruleSetBaseUrl}geoip/apple.mrs`, path: './ruleset/apple_ip.mrs' },
    github: { ...domainMrs, url: `${ruleSetBaseUrl}geosite/github.mrs`, path: './ruleset/github.mrs' },
    steam: { ...domainMrs, url: `${ruleSetBaseUrl}geosite/steam.mrs`, path: './ruleset/steam.mrs' },
    steam_ip: { ...ipMrs, url: `${ruleSetBaseUrl}geoip/steam.mrs`, path: './ruleset/steam_ip.mrs' },
    meta: { ...domainMrs, url: `${ruleSetBaseUrl}geosite/meta.mrs`, path: './ruleset/meta.mrs' },
    facebook_ip: { ...ipMrs, url: `${ruleSetBaseUrl}geoip/facebook.mrs`, path: './ruleset/facebook_ip.mrs' },
    line: { ...domainMrs, url: `${ruleSetBaseUrl}geosite/line.mrs`, path: './ruleset/line.mrs' },
    pikpak: { ...domainMrs, url: `${ruleSetBaseUrl}geosite/pikpak.mrs`, path: './ruleset/pikpak.mrs' }
  };

  // 8. 规则执行链构建（自上而下匹配执行）
  const rules = [
    // 图标 CDN 直连，避免图标请求经代理造成循环依赖
    'DOMAIN,fastly.jsdelivr.net,DIRECT',
    'RULE-SET,Lan,DIRECT',
    'RULE-SET,Direct,DIRECT',
    'RULE-SET,Reject,REJECT'
  ];

  // 【优化】排布位置后移至常规直连白名单之后，且改用 geolocation-!cn 精准匹配境外 UDP 443
  if (ruleOptionsEnable.屏蔽国外QUIC) {
    rules.push('AND,((NETWORK,UDP),(DST-PORT,443),(RULE-SET,geolocation-!cn)),REJECT');
  }

  if (!ruleOptionsEnable.极简分流模式 && ruleOptionsEnable.AdBlock) {
    rules.push('RULE-SET,category-ads,AdBlock');
  }

  if (!ruleOptionsEnable.极简分流模式) {
    if (ruleOptionsEnable.FCM) rules.push('RULE-SET,googlefcm,FCM');
    if (ruleOptionsEnable.Microsoft) {
      rules.push('RULE-SET,microsoft,Microsoft', 'RULE-SET,microsoft_ip,Microsoft');
    }
    if (ruleOptionsEnable.Apple) {
      rules.push('RULE-SET,apple,Apple', 'RULE-SET,apple_ip,Apple');
    }
    if (ruleOptionsEnable.GitHub) {
      rules.push('RULE-SET,github,GitHub');
    }
    if (ruleOptionsEnable.Steam) {
      rules.push('RULE-SET,steam,Steam', 'RULE-SET,steam_ip,Steam');
    }
    if (ruleOptionsEnable.Meta) {
      rules.push('RULE-SET,meta,Meta', 'RULE-SET,facebook_ip,Meta');
    }
    if (ruleOptionsEnable.Line) rules.push('RULE-SET,line,Line');
    if (ruleOptionsEnable.PikPak) rules.push('RULE-SET,pikpak,PikPak');

    if (ruleOptionsEnable.Speedtest) rules.push('RULE-SET,Speedtest,Speedtest');

    if (ruleOptionsEnable.AI) rules.push('RULE-SET,AI,AI');
    if (ruleOptionsEnable.Spotify) rules.push('RULE-SET,Spotify,Spotify');
    if (ruleOptionsEnable.YouTube) rules.push('RULE-SET,YouTube,YouTube');
    if (ruleOptionsEnable.Google) rules.push('RULE-SET,Google,Google');
    if (ruleOptionsEnable.Telegram) rules.push('RULE-SET,Telegram,Telegram');
    if (ruleOptionsEnable.Twitter) rules.push('RULE-SET,Twitter,Twitter');
    if (ruleOptionsEnable.Instagram) rules.push('RULE-SET,Instagram,Instagram');
    if (ruleOptionsEnable.Emby) rules.push('RULE-SET,Emby,Emby');

    if (ruleOptionsEnable.Bilibili) {
      rules.push('RULE-SET,BilibiliHMT,Bilibili');
    }

    if (ruleOptionsEnable.Bahamut) rules.push('RULE-SET,Bahamut,Bahamut');
    if (ruleOptionsEnable.Netflix) rules.push('RULE-SET,Netflix,Netflix');
    if (ruleOptionsEnable.Disney) rules.push('RULE-SET,Disney,Disney');
    if (ruleOptionsEnable.PrimeVideo) rules.push('RULE-SET,PrimeVideo,PrimeVideo');
    if (ruleOptionsEnable.HBO) rules.push('RULE-SET,HBO,HBO');

    if (ruleOptionsEnable.TikTok) rules.push('RULE-SET,TikTok,TikTok');
  }

  const nanoTarget = ruleOptionsEnable.极简分流模式 ? 'Manual' : 'SG';

  rules.push(
    `DOMAIN-SUFFIX,nano.cr18.eu.org,${nanoTarget}`,
    'GEOIP,cn,DIRECT',
    'MATCH,Final'
  );

  config['rules'] = rules;

  return config;
}
