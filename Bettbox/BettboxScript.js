// =========================================================================
// Bettbox Mihomo 进阶流媒体与策略分流配置脚本
// =========================================================================

// Bettbox GUI 可视化控制开关支持：允许客户端通过图形界面动态覆盖配置
const Compatible_With_Bettbox = { ruleOptionsEnable: true };

// 基础图标与规则集远程 CDN 仓库基准地址
const iconBaseUrl = 'https://cdn.jsdmirror.com/gh/AIsouler/MyClash@main/Icons/svg/';
const ruleSetBaseUrl = 'https://cdn.jsdmirror.com/gh/appshubcc/bett-rules@meta/geo/';

/**
 * 策略组与图标定义表（Bettbox 策略组渲染基础列表）
 * 定义每个策略组的名称、图标、默认候选节点或特殊属性 (reject/direct/isBase)
 */
const serviceConfigs = [
  // --- 基础调度策略组 ---
  { name: 'Manual', icon: `${iconBaseUrl}Proxy.svg`, isBase: true },          // 主手动调度总入口
  { name: 'SelectGroup', icon: `${iconBaseUrl}Static.svg`, isBase: true },    // 全单节点手动汇总池
  { name: 'AutoGroup', icon: `${iconBaseUrl}Auto.svg`, isBase: true },        // 全节点延迟自动优选
  { name: 'LoadBalance', icon: `${iconBaseUrl}RoundRobin.svg`, isBase: true },// 全节点一致性哈希负载均衡

  // --- 基础平台与日常应用 ---
  { name: 'AdBlock', icon: `${iconBaseUrl}AdBlock.svg`, reject: true },       // 广告与恶意域名拦截 (REJECT)
  { name: 'FCM', icon: `${iconBaseUrl}Fcm.svg`, direct: true },               // Google FCM 消息推送通道
  { name: 'Microsoft', icon: `${iconBaseUrl}Microsoft.svg`, direct: true },   // 微软全家桶及 Windows Update
  { name: 'Apple', icon: `${iconBaseUrl}Apple.svg`, direct: true },           // 苹果官方服务及 CDN
  { name: 'GitHub', icon: 'https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/GitHub.png', direct: true }, // GitHub 代码托管
  { name: 'Steam', icon: `${iconBaseUrl}Steam.svg`, direct: true },           // Steam 平台与商店分流
  { name: 'PikPak', icon: `${iconBaseUrl}PikPak.svg`, direct: true },         // PikPak 私密云盘
  { name: 'Meta', icon: `${iconBaseUrl}Meta.svg` },                           // Meta / Facebook 全系应用
  { name: 'Line', icon: `${iconBaseUrl}Line.svg` },                           // Line 社交通讯
  { name: 'Speedtest', icon: 'https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Speedtest.png', direct: true }, // 测速流量分流
  { name: 'AI', icon: `${iconBaseUrl}OpenAI.svg`, proxies: ['Manual', 'US', 'JP', 'SG', 'TW', 'HK', 'Other'] }, // AI 平台 (ChatGPT/Claude/Gemini)
  { name: 'Telegram', icon: `${iconBaseUrl}Telegram.svg` },                   // 电报海外通讯节点
  { name: 'Google', icon: `${iconBaseUrl}Google.svg` },                       // 谷歌海外搜索与服务
  { name: 'YouTube', icon: `${iconBaseUrl}YouTube.svg` },                     // YouTube 独立视频流量
  { name: 'Spotify', icon: `${iconBaseUrl}Spotify.svg` },                     // Spotify 音乐流媒体
  { name: 'Emby', icon: `${iconBaseUrl}Emby.svg` },                           // 私有/公用 Emby 媒体服务器
  { name: 'TikTok', icon: `${iconBaseUrl}TikTok.svg` },                       // TikTok 国际短视频
  { name: 'Twitter', icon: `${iconBaseUrl}Twitter.svg` },                     // X (原 Twitter) 社交网络
  { name: 'Instagram', icon: 'https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Instagram.png' }, // Instagram 图片社交

  // --- 细分流媒体与特定服务 ---
  { name: 'Bilibili', icon: 'https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Bilibili.png', proxies: ['DIRECT', 'HK', 'TW'] }, // B站港澳台限定番剧调度
  { name: 'Bahamut', icon: 'https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Bahamut.png', proxies: ['TW', 'HK', 'Manual'] },  // 巴哈姆特动画疯 (严审台湾IP)
  { name: 'Netflix', icon: 'https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Netflix.png' },     // 网飞专属分流
  { name: 'Disney', icon: 'https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Disney.png' },       // 迪士尼流媒体
  { name: 'PrimeVideo', icon: 'https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Prime_Video.png' }, // 亚马逊 Prime 视频
  { name: 'HBO', icon: 'https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/HBO.png' },             // HBO Max / Max 视频

  // --- 全局兜底策略 ---
  { name: 'Final', icon: 'https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Final.png' }           // 未匹配规则的最终兜底
];

/**
 * 用户自定义配置开关（对应 Bettbox GUI 界面中可直接切换的选项）
 * true: 开启该功能/策略组 | false: 关闭该功能/策略组
 */
var ruleOptionsEnable = {
  // --- 1. 基础调度策略组开关 ---
  'Manual': true,              // 是否保留手动调度聚合组 (Manual)
  'SelectGroup': true,         // 是否生成全部单节点手动组 (SelectGroup)
  'AutoGroup': true,           // 是否生成全局自动优选组 (AutoGroup)
  'LoadBalance': true,         // 是否生成全局负载均衡组 (LoadBalance)

  // --- 2. 专属分流服务策略开关 ---
  FCM: true,                  // 启用 Google FCM 推送通道分流
  Microsoft: true,            // 启用微软全家桶分流
  Apple: true,                // 启用苹果官方服务分流
  GitHub: true,               // 启用 GitHub 分流
  Steam: true,                // 启用 Steam 平台分流
  Meta: true,                 // 启用 Meta / Facebook 分流
  Line: true,                 // 启用 Line 分流
  PikPak: true,               // 启用 PikPak 网盘分流
  AdBlock: true,              // 启用广告与追踪域名拦截
  Speedtest: true,            // 启用网络测速分流
  AI: true,                   // 启用 AI 服务分流
  Spotify: true,              // 启用 Spotify 分流
  YouTube: true,              // 启用 YouTube 分流
  Google: true,               // 启用 Google 服务分流
  Telegram: true,             // 启用 Telegram 分流
  Twitter: true,              // 启用 Twitter (X) 分流
  Instagram: true,            // 启用 Instagram 分流
  Emby: true,                 // 启用 Emby 媒体服分流
  TikTok: true,               // 启用 TikTok 分流

  // --- 3. 独立流媒体与B站策略组开关 ---
  Bilibili: true,             // 启用哔哩哔哩港澳台专属调度
  Bahamut: true,              // 启用巴哈姆特动画疯专属调度 (优先台湾节点)
  Netflix: true,              // 启用 Netflix 独立分流策略组
  Disney: true,               // 启用 Disney+ 独立分流策略组
  PrimeVideo: true,           // 启用 Prime Video 独立分流策略组
  HBO: true,                  // 启用 HBO Max 独立分流策略组

  // --- 4. 节点处理与增强特性 ---
  自动补国旗: true,            // 根据节点名称自动补齐对应旗帜 Emoji（防重复叠加）
  去除节点广告前缀后缀: true,   // 清理【专线】、[特惠]、官网网址及尾部流量时间等广告修饰
  节点序号规整化: true,        // 节点末尾单数字规范化补零（例如：香港 1 -> 香港 01）
  节点裂变UDP: false,          // 自动克隆生成 [UDP] 专属衍生节点，便于独立调用
  极简模式: false,             // 极简模式开关（开启后隐藏全部细化分流，仅保留主代理与兜底）
  生成地区自动选择组: false,   // 是否额外生成各地区独立的 url-test 自动优选组 (如 HKAuto 等)
  隐藏地区手动选择组: false,   // 是否在界面中隐藏各地区手动选择组
  生成低倍率组: false,         // 是否生成 0.1x~0.5x 低倍率/免费节点组
  生成高倍率组: false,         // 是否生成 2x 以上高倍率节点组
  分流组添加所有节点: false,   // 是否在各业务策略组候选中直接平铺所有底层单节点
  过滤低倍率节点: false,       // 是否直接从订阅中剔除低倍率节点
  过滤高倍率节点: false,       // 是否直接从订阅中剔除高倍率节点
  过滤非地区节点: true,        // 过滤官网、到期、流量信息等非代理行
  屏蔽国外QUIC: true,          // 拦截境外 UDP 443 端口，强制回退至稳定的 TCP/TLS
  代理IPV4优先: true,          // 节点出站连接优先使用 IPv4
  代理IPV6优先: false,         // 节点出站连接优先使用 IPv6

  // --- 5. DNS 与高级网络微调 ---
  DNS防泄漏强化: true,        // 开启 respect-rules，严格杜绝未加密 DNS 越级解析
  DNSFallback容灾: true,      // 主 DoH 出现异常时自动启用备用公共 DNS 容灾
  特定域名阻断IPv6: true,      // 强制 Netflix 等特定流媒体仅走 IPv4，避免 IPv6 跨区风控
  地区自动测试间隔: 1800,      // 地区自动优选组测速间隔 (秒)
  地区自动测试容差: 20         // 地区自动优选组容差切换阈值 (ms)
};

/**
 * 策略组备选池定义（供面板引用与验证）
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
// 1. 地区特征与正则规范
// ==========================================
// 各国家/地区严格匹配正则
const hkPattern = '(🇭🇰|香港|(?<![A-Za-z])HKG?(?![A-Za-z])|hong\\s*kong)';
const jpPattern = '(🇯🇵|日本|东京|大阪|京都|(?<![A-Za-z])JPN?(?![A-Za-z])|japan)';
const usPattern = '(🇺🇸|美国|纽约|洛杉矶|旧金山|芝加哥|休斯顿|迈阿密|西雅图|波士顿|华盛顿|拉斯维加斯|圣何塞|(?<![A-Za-z])USA?(?![A-Za-z])|america|united\\s*states)';
const sgPattern = '(🇸🇬|新加坡|狮城|(?<![A-Za-z])SGP?(?![A-Za-z])|singapore)';
const twPattern = '(🇹🇼|台湾|台北|高雄|(?<![A-Za-z])TWN?(?![A-Za-z])|taiwan)';

// 机场通知、广告与垃圾非节点行特征过滤库
const globalPattern = '(群|返利|循环|官网|客服|网站|网址|获取|订阅|流量|到期|机场|下次|版本|官址|过期|已用|联系|邮箱|工单|贩卖|通知|倒卖|防止|国内|地址|电报|频道|无法|说明|提示|访问|支持|教程|关注|更新|作者|加入|超时|收藏|优惠|福利|邀请|好友|失联|选择|剩余|公益|发布|DIZTNA|通路|登录|定时|渠道|牢记|永久|余额|阁下|本站|刷新|导航|建议|重置|以下|过滤|⚠️|@|t\\.me\\/\\+|\\bexpire\\b|\\bhttps?:\\/\\/|\\.com|\\btraffic\\b)';

// Other 策略组排除规则：剔除上述五大常规地区及垃圾节点
const excludeMainlandPattern = `(${hkPattern}|${jpPattern}|${usPattern}|${sgPattern}|${twPattern})`;
const globalExclude = `(?i)${globalPattern}`;
const hkFilter = `(?i)${hkPattern}`;
const jpFilter = `(?i)${jpPattern}`;
const usFilter = `(?i)${usPattern}`;
const sgFilter = `(?i)${sgPattern}`;
const twFilter = `(?i)${twPattern}`;
const otherExclude = `(?i)(${excludeMainlandPattern}|${globalPattern})`;

const globalExcludeRegex = new RegExp(globalPattern, 'i');
const lowRateFilter = /(?:(?<![\d.])0(\.[0-5]|[*×✕✖⨯⨉x倍]))|(?:[*×✕✖⨯⨉x]0)|低倍|免费|(?<![A-Za-z])free(?![A-Za-z])/i;
const highRateFilter = /(?:[*×✕✖⨯⨉x](?:[2-9]\d*|[1-9]\d+)(?:\.\d+)?)|(?:(?<![\d.])(?:[2-9]\d*|[1-9]\d+)(?:\.\d+)?(?:倍|[*×✕✖⨯⨉x]))/i;

// 严格使用 Unicode 区域指示码匹配旗帜 Emoji（\u{1F1E6}-\u{1F1FF}）
const flagEmojiRegex = /[\u{1F1E6}-\u{1F1FF}]{2}/u;

/**
 * 纯净节点命名：剔除机场在节点前后附加的营销与广告修饰词
 */
function cleanNodeName(name) {
  if (!name) return '';
  let cleaned = name;
  // 去除前缀：【专线】、[特惠]、(BGP) 等
  cleaned = cleaned.replace(/^[\[【(（][^\]】)）]*(专线|特惠|游戏|BGP|中继|IPLC|IEPL|中转|直连|高速|优质|推荐)[^\]】)）]*[\]】)）]\s*/i, '');
  // 去除推广前缀：官网、网址、域名等
  cleaned = cleaned.replace(/^(官网|网址|地址|域名|官址)\s*[:：]\s*\S+\s*[-—|]?\s*/i, '');
  // 去除后缀：| 剩余流量: xxx、- 到期时间: xxx 等
  cleaned = cleaned.replace(/\s*[-—|]\s*(剩余流量|到期时间|已用|倍率|官网|备用)\s*[:：]?\s*.*$/i, '');
  return cleaned.trim() || name;
}

/**
 * 自动识别并补齐国旗 Emoji（已有国旗的节点直接原样返回，杜绝重复添加）
 */
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

/**
 * 节点序号规整化与补零：将末尾孤立数字规整为两位数（如 香港 1 -> 香港 01）
 */
function formatNodeIndex(name) {
  if (!name) return '';
  let formatted = name.replace(/\s+/g, ' ').trim();
  formatted = formatted.replace(/(?<=[^\d])([1-9])(?=[^\d]*$)/, '0$1');
  return formatted;
}

// ==========================================
// 2. DNS 处理与 hosts 节点改写机制
// ==========================================
const commonDnsRegex = /(?:223\.5\.5\.5|223\.6\.6\.6|119\.29\.29\.29|114\.114\.114\.114|180\.184\.1\.1|180\.184\.2\.2|1\.1\.1\.1|1\.0\.0\.1|8\.8\.8\.8|8\.8\.4\.4|9\.9\.9\.9|alidns|doh\.pub|cloudflare|google|quad9)/i;

function isIpAddress(str) {
  if (typeof str !== 'string') return false;
  const ipv4Pattern = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  const ipv6Pattern = /^(?:[a-fA-F0-9]{1,4}:){7}[a-fA-F0-9]{1,4}$|^::(?:[a-fA-F0-9]{1,4}:){0,6}[a-fA-F0-9]{1,4}$|^(?:[a-fA-F0-9]{1,4}:){1,7}:$/;
  return ipv4Pattern.test(str) || ipv6Pattern.test(str.replace(/^\[|\]$/g, ''));
}

function stripDnsSuffix(dns) {
  return String(dns || '').replace(/#.*$/, '').trim();
}

/**
 * 当命中回环/本地 DNS 场景时，将节点 server 域名直接替换为其在 hosts 中的直连 IP，杜绝握手超时
 */
function applyHostsToProxies(proxies, hosts) {
  if (!hosts || typeof hosts !== 'object') return proxies;
  return proxies.map((proxy) => {
    if (!proxy || typeof proxy.server !== 'string') return proxy;
    const serverLower = proxy.server.toLowerCase();
    for (const [hostKey, hostVal] of Object.entries(hosts)) {
      if (hostKey.toLowerCase() === serverLower) {
        const targetIp = Array.isArray(hostVal) ? hostVal[0] : hostVal;
        if (typeof targetIp === 'string' && targetIp.length > 0) {
          return { ...proxy, server: targetIp };
        }
      }
    }
    return proxy;
  });
}

function matchDomainPattern(pattern, domains) {
  const p = String(pattern).toLowerCase().trim().replace(/^\+\.|\*\./, '');
  for (const domain of domains) {
    const d = domain.toLowerCase().trim();
    if (d === p || d.endsWith('.' + p)) return true;
  }
  return false;
}

function simplifyDomainPolicy(matchedProxyPolicy) {
  return matchedProxyPolicy;
}

/**
 * 完整构建 DNS 与 Hosts：继承私有 DNS、节点域名 Policy，并在满足条件时改写节点 server
 */
function buildDnsAndHostsConfig(config, filteredProxies) {
  const minimalModeEnabled = ruleOptionsEnable.极简模式;
  const originalDnsConfig = config.dns || {};

  const proxyServerNameservers = originalDnsConfig['proxy-server-nameserver'] || [];
  const listenValue = originalDnsConfig['listen'];

  // 判断是否需要通过 hosts 改写节点域名（解决本地监听导致节点握手死锁）
  const shouldRewriteByHosts =
    proxyServerNameservers.length === 1 &&
    typeof listenValue === 'string' &&
    listenValue.length > 0 &&
    (proxyServerNameservers.some((dns) => String(dns).toLowerCase().includes(listenValue.toLowerCase())) ||
      (listenValue.includes('0.0.0.0') &&
        proxyServerNameservers.some((dns) => String(dns).toLowerCase().includes('127.0.0.1'))));

  const mappedProxies = shouldRewriteByHosts ? applyHostsToProxies(filteredProxies, config.hosts) : filteredProxies;

  const proxyDomains = new Set(
    mappedProxies
      .filter((proxy) => typeof proxy.server === 'string')
      .map((proxy) => proxy.server.toLowerCase())
      .filter((server) => !isIpAddress(server)),
  );

  const privateProxyServerNameservers = shouldRewriteByHosts ? [] : proxyServerNameservers;

  const isCommonDns = (dns) => {
    const value = String(dns).trim().toLowerCase();
    if (value === 'system' || value === 'system://') return true;
    return commonDnsRegex.test(value);
  };

  // 提取订阅中的非公共私有 DNS
  const privateDNS = [
    ...new Set(
      [...(originalDnsConfig['nameserver'] || []), ...privateProxyServerNameservers]
        .map(stripDnsSuffix)
        .filter((dns) => dns.length > 0 && !isCommonDns(dns)),
    ),
  ];

  // 匹配并保留原订阅针对节点域名的私有解析 policy
  const matchedProxyPolicy = {};
  for (const [domain, dns] of Object.entries({
    ...originalDnsConfig['nameserver-policy'],
    ...originalDnsConfig['proxy-server-nameserver-policy'],
  })) {
    if (!matchDomainPattern(domain, proxyDomains)) continue;

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
  const proxyFakeIpFilter = originalFakeIpFilter.filter((pattern) => {
    const p = String(pattern);
    return matchDomainPattern(p, proxyDomains);
  });

  const chinaDNS = ['223.5.5.5#DIRECT', '119.29.29.29#DIRECT'];
  const foreignDNS = ['https://cloudflare-dns.com/dns-query#Manual', 'https://dns.google/dns-query#Manual'];
  const defaultDNS = ['114.114.114.114#DIRECT', 'tls://223.5.5.5#DIRECT', 'https://1.12.12.12/dns-query#DIRECT'];
  const proxyServerDNS = ['114.114.114.114#DIRECT', 'tls://223.5.5.5#DIRECT', 'https://doh.pub/dns-query#DIRECT'];
  const fallbackDNS = ['https://1.0.0.1/dns-query#Manual', 'https://8.8.4.4/dns-query#Manual'];

  const nameserverPolicy = {
    'geosite:private': 'system',
    'geosite:category-entertainment-cn,douyin': ['system', '180.184.1.1', '180.184.2.2'],
    'geosite:cn': chinaDNS,
  };

  // 特定流媒体阻断 IPv6：锁定 IPv4 解析，阻断 AAAA 记录，避免跨区风控与断流
  if (ruleOptionsEnable.特定域名阻断IPv6) {
    const blockIpv6Domains = [
      '+.netflix.com',
      '+.netflix.net',
      '+.nflximg.net',
      '+.nflxvideo.net',
      '+.nflxext.com',
      '+.disneyplus.com',
      '+.disney-portal.my.onetrust.com',
      '+.hbo.com',
      '+.hbomax.com',
      '+.max.com'
    ];
    blockIpv6Domains.forEach(domain => {
      nameserverPolicy[domain] = ['https://cloudflare-dns.com/dns-query#Manual'];
    });
  }

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
      'geosite:private',
      'geosite:cn',
      ...(minimalModeEnabled ? [] : ruleOptionsEnable['FCM'] ? ['geosite:googlefcm'] : []),
      ...proxyFakeIpFilter,
    ],
    'default-nameserver': defaultDNS,
    'proxy-server-nameserver': proxyServerDNS,
    ...(Object.keys(proxyServerPolicy).length > 0 && {
      'proxy-server-nameserver-policy': proxyServerPolicy,
    }),
    nameserver: foreignDNS,
    'nameserver-policy': nameserverPolicy,
    'direct-nameserver': chinaDNS,
    'direct-nameserver-follow-policy': true,
  };

  // 严格遵守规则链分流 DNS 查询
  if (ruleOptionsEnable.DNS防泄漏强化) {
    dns['respect-rules'] = true;
  }

  // 容灾备份 DNS 解析服务
  if (ruleOptionsEnable.DNSFallback容灾) {
    dns['fallback'] = fallbackDNS;
    dns['fallback-filter'] = {
      geoip: true,
      geoip_code: 'CN',
      geosite: ['gfw'],
      ipcidr: ['240.0.0.0/4']
    };
  }

  // 预解析公共 DoH 域名与屏蔽 P2P 盗流域名
  const hosts = {
    'doh.pub': ['1.12.12.12', '120.53.53.53'],
    'cloudflare-dns.com': ['1.1.1.1', '1.0.0.1'],
    'dns.google': ['8.8.8.8', '8.8.4.4'],
    'services.googleapis.cn': 'services.googleapis.com',
    '+.mcdn.bilivideo.com': ['0.0.0.0'],
    '+.mcdn.bilivideo.cn': ['0.0.0.0'],
    '+.edge.mountaintoys.cn': ['0.0.0.0'],
    '+.h2.smtcdns.net': ['0.0.0.0'],
    ...(config.hosts || {}),
  };

  return { dns, hosts, mappedProxies };
}

// ==========================================
// 3. 配置生成主入口函数 (main)
// ==========================================
function main(config) {
  // 1. 全局运行参数与面板配置
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

  // GeoIP / GeoSite 规则数据库自动更新配置
  config['geodata-mode'] = true;
  config['geo-auto-update'] = true;
  config['geo-update-interval'] = 24;
  config['geox-url'] = {
    geoip: "https://mirror.ghproxy.com/https://raw.githubusercontent.com/Loyalsoldier/geoip/release/geoip.dat",
    geosite: "https://mirror.ghproxy.com/https://github.com/MetaCubeX/meta-rules-dat/releases/download/latest/geosite.dat",
    mmdb: "https://mirror.ghproxy.com/https://raw.githubusercontent.com/Loyalsoldier/geoip/release/Country.mmdb",
    asn: "https://mirror.ghproxy.com/https://raw.githubusercontent.com/Loyalsoldier/geoip/release/GeoLite2-ASN.mmdb"
  };

  // 2. Sniffer 嗅探器配置（嗅探握手报文，精准还原 Fake-IP 域名）
  config['sniffer'] = {
    enable: true,
    'force-dns-mapping': true,
    'parse-pure-ip': true,
    'override-destination': false,
    sniff: {
      HTTP: { ports: [80, '8080-8880'], 'override-destination': true },
      TLS: { ports: [443, 8443] },
      QUIC: { ports: [443, 8443] }
    },
    'skip-domain': [
      'Mijia Cloud',
      'dlg.io.mi.com',
      '+.apple.com',
      '+.push.apple.com'
    ]
  };

  // 3. 节点预处理：清洗、去广告、规整序号、补国旗、裂变与倍率过滤
  let ipPref = null;
  if (ruleOptionsEnable.代理IPV4优先 && !ruleOptionsEnable.代理IPV6优先) ipPref = 'ipv4-prefer';
  if (ruleOptionsEnable.代理IPV6优先 && !ruleOptionsEnable.代理IPV4优先) ipPref = 'ipv6-prefer';

  const rawProxies = config.proxies || [];
  const processedProxies = [];
  const fisionProxies = [];

  for (const proxy of rawProxies) {
    const type = String(proxy.type || '').toLowerCase();
    if (type === 'direct' || type === 'reject') continue;

    let name = proxy.name || '';
    if (ruleOptionsEnable.过滤非地区节点 && globalExcludeRegex.test(name)) continue;
    if (ruleOptionsEnable.过滤低倍率节点 && lowRateFilter.test(name)) continue;
    if (ruleOptionsEnable.过滤高倍率节点 && highRateFilter.test(name)) continue;

    // 剔除广告与修饰词
    if (ruleOptionsEnable.去除节点广告前缀后缀) {
      name = cleanNodeName(name);
    }

    // 规整末尾序号
    if (ruleOptionsEnable.节点序号规整化) {
      name = formatNodeIndex(name);
    }

    // 自动补齐国旗 Emoji
    if (ruleOptionsEnable.自动补国旗) {
      name = autoAppendFlag(name);
    }
    proxy.name = name;

    if (ipPref) {
      proxy['ip-version'] = ipPref;
    }
    processedProxies.push(proxy);

    // 节点裂变：针对支持 UDP 的节点衍生出 [UDP] 专属节点
    if (ruleOptionsEnable.节点裂变UDP && proxy.udp !== false) {
      const clonedProxy = JSON.parse(JSON.stringify(proxy));
      clonedProxy.name = `[UDP] ${proxy.name}`;
      clonedProxy.udp = true;
      fisionProxies.push(clonedProxy);
    }
  }

  // 合并裂变衍生节点进入总节点池
  if (fisionProxies.length > 0) {
    processedProxies.push(...fisionProxies);
  }

  // 4. 构建 DNS、Hosts 并将处理后的映射写回核心
  const { dns, hosts, mappedProxies } = buildDnsAndHostsConfig(config, processedProxies);
  config['dns'] = dns;
  config['hosts'] = hosts;
  config['proxies'] = mappedProxies;

  // NTP 授时同步与 TUN 虚拟网卡配置
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

  // 5. 组装策略组备选池（自适应极简模式）
  const allProxyNames = (config.proxies || []).map(p => p.name);
  
  const basicFunctionGroups = [];
  if (ruleOptionsEnable['SelectGroup'] !== false) basicFunctionGroups.push('SelectGroup');
  if (ruleOptionsEnable['AutoGroup'] !== false) basicFunctionGroups.push('AutoGroup');
  if (ruleOptionsEnable['LoadBalance'] !== false) basicFunctionGroups.push('LoadBalance');

  // 非极简模式下正常挂载地区组
  const baseRegionList = [];
  if (!ruleOptionsEnable.极简模式) {
    baseRegionList.push('HK', 'SG', 'JP', 'US', 'TW', 'Other');
    if (ruleOptionsEnable.生成地区自动选择组) {
      baseRegionList.push('HKAuto', 'SGAuto', 'JPAuto', 'USAuto', 'TWAuto');
    }
  }

  // 倍率过滤策略组挂载
  const rateGroupsList = [];
  if (!ruleOptionsEnable.极简模式) {
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

  // 6. 动态创建策略组
  const groups = [];

  // ① 主手动调度组 (Manual)
  if (ruleOptionsEnable['Manual'] !== false) {
    groups.push({
      name: 'Manual',
      type: 'select',
      proxies: manualGroupProxies,
      icon: `${iconBaseUrl}Proxy.svg`
    });
  }

  // ② 全单节点手动组 (SelectGroup)
  if (ruleOptionsEnable['SelectGroup'] !== false) {
    groups.push({
      name: 'SelectGroup',
      type: 'select',
      'include-all': true,
      'exclude-filter': globalExclude,
      icon: `${iconBaseUrl}Static.svg`
    });
  }

  // ③ 全局自动延迟优选组 (AutoGroup)
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

  // ④ 全局负载均衡组 (LoadBalance)
  if (ruleOptionsEnable['LoadBalance'] !== false) {
    groups.push({
      name: 'LoadBalance',
      type: 'load-balance',
      'include-all': true,
      strategy: 'consistent-hashing',
      interval: 300,
      url: 'http://1.1.1.1/generate_204',
      'exclude-filter': globalExclude,
      icon: `${iconBaseUrl}RoundRobin.svg`
    });
  }

  // ⑤ 专属分流策略组创建
  if (ruleOptionsEnable.极简模式) {
    const finalCandidates = ['Manual', ...basicFunctionGroups, 'DIRECT'];
    groups.push({
      name: 'Final',
      type: 'select',
      proxies: [...new Set(finalCandidates)],
      icon: 'https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Final.png'
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

  // ⑥ 国家/地区细分策略组与自动优选组（支持微调测试容差与间隔）
  if (!ruleOptionsEnable.极简模式) {
    const hideManual = ruleOptionsEnable.隐藏地区手动选择组 === true;
    const regionSelectConfigs = [
      { name: 'HK', filter: hkFilter, icon: 'https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Hong_Kong.png' },
      { name: 'SG', filter: sgFilter, icon: 'https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Singapore.png' },
      { name: 'JP', filter: jpFilter, icon: 'https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Japan.png' },
      { name: 'US', filter: usFilter, icon: 'https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/United_States.png' },
      { name: 'TW', filter: twFilter, icon: 'https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/China.png' },
      { name: 'Other', 'exclude-filter': otherExclude, icon: 'https://raw.githubusercontent.com/lige47/QuanX-icon-rule/main/icon/05icon/quanqiu(1).png' }
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
      const autoInterval = Number(ruleOptionsEnable.地区自动测试间隔) || 1800;
      const autoTolerance = Number(ruleOptionsEnable.地区自动测试容差) || 20;

      const regionAutoConfigs = [
        { name: 'HKAuto', filter: hkFilter, icon: 'https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Hong_Kong.png' },
        { name: 'SGAuto', filter: sgFilter, icon: 'https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Singapore.png' },
        { name: 'JPAuto', filter: jpFilter, icon: 'https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Japan.png' },
        { name: 'USAuto', filter: usFilter, icon: 'https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/United_States.png' },
        { name: 'TWAuto', filter: twFilter, icon: 'https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/China.png' }
      ];

      regionAutoConfigs.forEach(r => {
        groups.push({
          name: r.name,
          type: 'url-test',
          'include-all': true,
          interval: autoInterval,
          tolerance: autoTolerance,
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
    Emby: { ...cProvider, url: 'https://raw.githubusercontent.com/MeituanRider001/Clash/refs/heads/main/Rules/Emby.list' },
    Bahamut: { ...cProvider, url: 'https://raw.githubusercontent.com/Repcz/Tool/refs/heads/X/mihomo/Rules/Bahamut.list' },
    Netflix: { ...cProvider, url: 'https://raw.githubusercontent.com/Repcz/Tool/refs/heads/X/mihomo/Rules/Netflix.list' },
    Disney: { ...cProvider, url: 'https://raw.githubusercontent.com/Repcz/Tool/refs/heads/X/mihomo/Rules/Disney.list' },
    PrimeVideo: { ...cProvider, url: 'https://raw.githubusercontent.com/Repcz/Tool/refs/heads/X/mihomo/Rules/PrimeVideo.list' },
    HBO: { ...cProvider, url: 'https://raw.githubusercontent.com/Repcz/Tool/refs/heads/X/mihomo/Rules/HBO.list' },
    TikTok: { ...cProvider, url: 'https://raw.githubusercontent.com/Repcz/Tool/refs/heads/X/mihomo/Rules/TikTok.list' },
    Speedtest: { ...cProvider, url: 'https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Surge/Speedtest/Speedtest.list' },

    // B站港澳台分流规则集
    BilibiliHMT: { ...cProvider, url: 'https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/BiliBiliHMT/BiliBiliHMT.list' },

    'category-ads': { ...domainMrs, url: `${ruleSetBaseUrl}geosite/category-ads.mrs`, path: './ruleset/category-ads.mrs' },
    googlefcm: { ...domainMrs, url: `${ruleSetBaseUrl}geosite/googlefcm.mrs`, path: './ruleset/googlefcm.mrs' },
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
    'RULE-SET,Lan,DIRECT',
    'RULE-SET,Direct,DIRECT',
    'RULE-SET,Reject,REJECT'
  ];

  if (ruleOptionsEnable.屏蔽国外QUIC) {
    rules.push('AND,((NETWORK,UDP),(DST-PORT,443),(GEOIP,CN,DIRECT,REVERSE)),REJECT');
  }

  if (!ruleOptionsEnable.极简模式 && ruleOptionsEnable.AdBlock) {
    rules.push('RULE-SET,category-ads,AdBlock');
  }

  if (!ruleOptionsEnable.极简模式) {
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

    // B站港澳台调度
    if (ruleOptionsEnable.Bilibili) {
      rules.push('RULE-SET,BilibiliHMT,Bilibili');
    }

    // 细分流媒体调度
    if (ruleOptionsEnable.Bahamut) rules.push('RULE-SET,Bahamut,Bahamut');
    if (ruleOptionsEnable.Netflix) rules.push('RULE-SET,Netflix,Netflix');
    if (ruleOptionsEnable.Disney) rules.push('RULE-SET,Disney,Disney');
    if (ruleOptionsEnable.PrimeVideo) rules.push('RULE-SET,PrimeVideo,PrimeVideo');
    if (ruleOptionsEnable.HBO) rules.push('RULE-SET,HBO,HBO');

    if (ruleOptionsEnable.TikTok) rules.push('RULE-SET,TikTok,TikTok');
  }

  const nanoTarget = ruleOptionsEnable.极简模式 ? 'Manual' : 'SG';

  rules.push(
    `DOMAIN-SUFFIX,nano.cr18.eu.org,${nanoTarget}`,
    'GEOIP,cn,DIRECT',
    'MATCH,Final'
  );

  config['rules'] = rules;

  return config;
}
