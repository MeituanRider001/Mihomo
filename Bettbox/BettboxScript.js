// =========================================================================
// Bettbox Mihomo 进阶流媒体与策略分流配置脚本
// 功能特性：
// 1. 节点智能清洗（过滤官网/广告/流量/过期等垃圾提示节点）
// 2. 自动精准补齐国家/地区旗帜 Emoji（避免重复生成）
// 3. 机场私有 DNS 与节点域名 hosts 自动处理（防回环死锁与超时）
// 4. 精细化分流策略组及多地区自动优选/负载均衡支持
// =========================================================================

// Bettbox GUI 可视化控制开关支持
const Compatible_With_Bettbox = { ruleOptionsEnable: true };

const iconBaseUrl = 'https://cdn.jsdmirror.com/gh/AIsouler/MyClash@main/Icons/svg/';
const ruleSetBaseUrl = 'https://cdn.jsdmirror.com/gh/appshubcc/bett-rules@meta/geo/';

/**
 * 策略组与图标定义表（Bettbox 策略组渲染基础列表）
 */
const serviceConfigs = [
  // 基础策略组
  { name: 'Manual', icon: `${iconBaseUrl}Proxy.svg`, isBase: true },
  { name: 'SelectGroup', icon: `${iconBaseUrl}Static.svg`, isBase: true },
  { name: 'AutoGroup', icon: `${iconBaseUrl}Auto.svg`, isBase: true },
  { name: 'LoadBalance', icon: `${iconBaseUrl}RoundRobin.svg`, isBase: true },

  // 专属服务策略组
  { name: 'AdBlock', icon: `${iconBaseUrl}AdBlock.svg`, reject: true },
  { name: 'FCM', icon: `${iconBaseUrl}Fcm.svg`, direct: true },
  { name: 'Microsoft', icon: `${iconBaseUrl}Microsoft.svg`, direct: true },
  { name: 'Apple', icon: `${iconBaseUrl}Apple.svg`, direct: true },
  { name: 'GitHub', icon: 'https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/GitHub.png', direct: true },
  { name: 'Steam', icon: `${iconBaseUrl}Steam.svg`, direct: true },
  { name: 'PikPak', icon: `${iconBaseUrl}PikPak.svg`, direct: true },
  { name: 'Meta', icon: `${iconBaseUrl}Meta.svg` },
  { name: 'Line', icon: `${iconBaseUrl}Line.svg` },
  { name: 'Speedtest', icon: 'https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Speedtest.png', direct: true },
  { name: 'AI', icon: `${iconBaseUrl}OpenAI.svg`, proxies: ['Manual', 'US', 'JP', 'SG', 'TW', 'HK', 'Other'] },
  { name: 'Telegram', icon: `${iconBaseUrl}Telegram.svg` },
  { name: 'Google', icon: `${iconBaseUrl}Google.svg` },
  { name: 'Streaming', icon: 'https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/icon/qure/color/ForeignMedia.png' },
  { name: 'YouTube', icon: `${iconBaseUrl}YouTube.svg` },
  { name: 'Spotify', icon: `${iconBaseUrl}Spotify.svg` },
  { name: 'Emby', icon: `${iconBaseUrl}Emby.svg` },
  { name: 'TikTok', icon: `${iconBaseUrl}TikTok.svg` },
  { name: 'Twitter', icon: `${iconBaseUrl}Twitter.svg` },
  { name: 'Instagram', icon: 'https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Instagram.png' },
  { name: 'Final', icon: 'https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Final.png' }
];

/**
 * 用户自定义配置开关（Bettbox GUI 面板可动态联动覆盖）
 * true: 开启该功能/策略组 | false: 关闭
 */
var ruleOptionsEnable = {
  // --- 基础调度策略组 ---
  'Manual': true,      // 手动汇总策略组（主策略入口）
  'SelectGroup': true, // 手动单节点聚合列表
  'AutoGroup': true,   // 全球全节点延迟自动优选
  'LoadBalance': true, // 全球全节点负载均衡组

  // --- 分流服务策略组开关 ---
  FCM: true,          // Google FCM 推送通道
  Microsoft: true,    // 微软服务分流
  Apple: true,        // 苹果服务分流
  GitHub: true,       // GitHub 平台分流
  Steam: true,        // Steam 平台与商店分流
  Meta: true,         // Meta / Facebook 分流
  Line: true,         // Line 社交通讯
  PikPak: true,       // PikPak 私密云盘
  AdBlock: true,      // 广告及恶意追踪拦截
  Speedtest: true,    // Speedtest 网络测速
  AI: true,           // 人工智能服务（OpenAI/Claude/Gemini 等）
  Spotify: true,      // Spotify 音乐流媒体
  YouTube: true,      // YouTube 视频平台
  Google: true,       // Google 搜索及海外全家桶
  Telegram: true,     // Telegram 电报通讯
  Twitter: true,      // Twitter (X) 社交平台
  Instagram: true,    // Instagram 社交分享
  Emby: true,         // Emby 媒体服务器
  Streaming: true,    // 国际流媒体总组（Netflix/Disney+/HBO等）
  TikTok: true,       // TikTok 短视频

  // --- 节点与策略增强特性 ---
  自动补国旗: true,        // 识别地区名称并自动添加国旗 Emoji（防重复添加）
  极简模式: false,         // 极简模式（开启后隐藏全部细分分流组，仅保留主代理与兜底）
  生成地区自动选择组: false, // 是否额外生成各地区独立的 url-test 自动优选组（如 HKAuto 等）
  隐藏地区手动选择组: false, // 是否在面板中隐藏各地区手动选择组
  生成低倍率组: false,     // 是否生成 0.1x~0.5x 低倍率/免费节点组
  生成高倍率组: false,     // 是否生成 2x 以上高倍率节点组
  分流组添加所有节点: false, // 是否在各业务分流组候选列表里平铺所有单节点
  过滤低倍率节点: false,   // 是否直接剔除低倍率节点
  过滤高倍率节点: false,   // 是否直接剔除高倍率节点
  过滤非地区节点: true,    // 自动过滤机场通知、网站公告、流量信息等非节点行
  屏蔽国外QUIC: true,      // 拦截境外 UDP 443 端口，强制走更稳定的 TCP/TLS
  代理IPV4优先: true,      // 出站连接优先走 IPv4
  代理IPV6优先: false      // 出站连接优先走 IPv6
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
  'Speedtest', 'AI', 'Telegram', 'Google', 'YouTube', 'Streaming', 
  'Spotify', 'Emby', 'TikTok', 'Twitter', 'Instagram', 'Final'
];

// ==========================================
// 1. 地区特征与节点清洗正则表达式
// ==========================================
const hkPattern = '(🇭🇰|香港|(?<![A-Za-z])HKG?(?![A-Za-z])|hong\\s*kong)';
const jpPattern = '(🇯🇵|日本|东京|大阪|京都|(?<![A-Za-z])JPN?(?![A-Za-z])|japan)';
const usPattern = '(🇺🇸|美国|纽约|洛杉矶|旧金山|芝加哥|休斯顿|迈阿密|西雅图|波士顿|华盛顿|拉斯维加斯|圣何塞|(?<![A-Za-z])USA?(?![A-Za-z])|america|united\\s*states)';
const sgPattern = '(🇸🇬|新加坡|狮城|(?<![A-Za-z])SGP?(?![A-Za-z])|singapore)';
const twPattern = '(🇹🇼|台湾|台北|高雄|(?<![A-Za-z])TWN?(?![A-Za-z])|taiwan)';

// 机场垃圾信息/非代理节点特征库
const globalPattern = '(群|返利|循环|官网|客服|网站|网址|获取|订阅|流量|到期|机场|下次|版本|官址|过期|已用|联系|邮箱|工单|贩卖|通知|倒卖|防止|国内|地址|电报|频道|无法|说明|提示|访问|支持|教程|关注|更新|作者|加入|超时|收藏|优惠|福利|邀请|好友|失联|选择|剩余|公益|发布|DIZTNA|通路|登录|定时|渠道|牢记|永久|余额|阁下|本站|刷新|导航|建议|重置|以下|过滤|⚠️|@|t\\.me\\/\\+|\\bexpire\\b|\\bhttps?:\\/\\/|\\.com|\\btraffic\\b)';

// Other（其他地区组）排除规则：排除上述已知五大区域与垃圾节点
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

// 区域指示码旗帜 Emoji 规范匹配（用于检测节点是否已有国旗）
const flagEmojiRegex = /[\u{1F1E6}-\u{1F1FF}]{2}/u;

/**
 * 自动识别并补充对应国旗 Emoji（已有国旗的节点直接返回原名称）
 */
function autoAppendFlag(name) {
  if (!name) return '';
  if (flagEmojiRegex.test(name)) {
    return name;
  }
  if (new RegExp(hkPattern, 'i').test(name)) return `🇭🇰 ${name}`;
  if (new RegExp(jpPattern, 'i').test(name)) return `🇯🇵 ${name}`;
  if (new RegExp(usPattern, 'i').test(name)) return `🇺🇸 ${name}`;
  if (new RegExp(sgPattern, 'i').test(name)) return `🇸🇬 ${name}`;
  if (new RegExp(twPattern, 'i').test(name)) return `🇹🇼 ${name}`;
  return name;
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
 * 当命中回环/本地 DNS 场景时，将节点 server 域名替换为其在 hosts 中的直连 IP，规避死锁
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
 * 构建 DNS 与 Hosts：继承私有 DNS、节点域名 Policy，并在满足条件时改写节点 server
 */
function buildDnsAndHostsConfig(config, filteredProxies) {
  const minimalModeEnabled = ruleOptionsEnable.极简模式;
  const originalDnsConfig = config.dns || {};

  const proxyServerNameservers = originalDnsConfig['proxy-server-nameserver'] || [];
  const listenValue = originalDnsConfig['listen'];

  // 判断是否需要由 hosts 直接改写节点地址（防本地回环 DNS 导致节点握手超时）
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

  // 匹配并保留原配置中针对节点域名的解析策略
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
    'nameserver-policy': {
      'geosite:private': 'system',
      'geosite:category-entertainment-cn,douyin': ['system', '180.184.1.1', '180.184.2.2'],
      'geosite:cn': chinaDNS,
    },
    'direct-nameserver': chinaDNS,
    'direct-nameserver-follow-policy': true,
  };

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
  // 1. 全局核心网络与面板参数
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

  // 数据库自动更新配置
  config['geodata-mode'] = true;
  config['geo-auto-update'] = true;
  config['geo-update-interval'] = 24;
  config['geox-url'] = {
    geoip: "https://mirror.ghproxy.com/https://raw.githubusercontent.com/Loyalsoldier/geoip/release/geoip.dat",
    geosite: "https://mirror.ghproxy.com/https://github.com/MetaCubeX/meta-rules-dat/releases/download/latest/geosite.dat",
    mmdb: "https://mirror.ghproxy.com/https://raw.githubusercontent.com/Loyalsoldier/geoip/release/Country.mmdb",
    asn: "https://mirror.ghproxy.com/https://raw.githubusercontent.com/Loyalsoldier/geoip/release/GeoLite2-ASN.mmdb"
  };

  // 2. 节点预处理：执行清洗、倍率过滤与自动加国旗
  let ipPref = null;
  if (ruleOptionsEnable.代理IPV4优先 && !ruleOptionsEnable.代理IPV6优先) ipPref = 'ipv4-prefer';
  if (ruleOptionsEnable.代理IPV6优先 && !ruleOptionsEnable.代理IPV4优先) ipPref = 'ipv6-prefer';

  const rawProxies = config.proxies || [];
  const processedProxies = [];

  for (const proxy of rawProxies) {
    const type = String(proxy.type || '').toLowerCase();
    if (type === 'direct' || type === 'reject') continue;

    let name = proxy.name || '';
    if (ruleOptionsEnable.过滤非地区节点 && globalExcludeRegex.test(name)) continue;
    if (ruleOptionsEnable.过滤低倍率节点 && lowRateFilter.test(name)) continue;
    if (ruleOptionsEnable.过滤高倍率节点 && highRateFilter.test(name)) continue;

    if (ruleOptionsEnable.自动补国旗) {
      name = autoAppendFlag(name);
      proxy.name = name;
    }

    if (ipPref) {
      proxy['ip-version'] = ipPref;
    }
    processedProxies.push(proxy);
  }

  // 3. 构建 DNS、Hosts 映射并写回节点
  const { dns, hosts, mappedProxies } = buildDnsAndHostsConfig(config, processedProxies);
  config['dns'] = dns;
  config['hosts'] = hosts;
  config['proxies'] = mappedProxies;

  // 时间同步与全局 TUN 设定
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

  // 4. 组装策略组候选项
  const allProxyNames = (config.proxies || []).map(p => p.name);
  
  const basicFunctionGroups = [];
  if (ruleOptionsEnable['SelectGroup'] !== false) basicFunctionGroups.push('SelectGroup');
  if (ruleOptionsEnable['AutoGroup'] !== false) basicFunctionGroups.push('AutoGroup');
  if (ruleOptionsEnable['LoadBalance'] !== false) basicFunctionGroups.push('LoadBalance');

  const baseRegionList = ['HK', 'SG', 'JP', 'US', 'TW', 'Other'];
  if (ruleOptionsEnable.生成地区自动选择组) {
    baseRegionList.push('HKAuto', 'SGAuto', 'JPAuto', 'USAuto', 'TWAuto');
  }

  const rateGroupsList = [];
  if (ruleOptionsEnable.生成低倍率组) {
    rateGroupsList.push('LowGroup');
  }
  if (ruleOptionsEnable.生成高倍率组) {
    rateGroupsList.push('HighGroup');
  }

  const manualGroupProxies = [
    ...baseRegionList,
    ...basicFunctionGroups,
    ...rateGroupsList
  ];

  const commonProxies = ['Manual', ...basicFunctionGroups, ...baseRegionList, ...rateGroupsList];
  const serviceProxies = ruleOptionsEnable.分流组添加所有节点
    ? [...commonProxies, ...allProxyNames]
    : commonProxies;

  // 5. 动态构建策略组列表
  const groups = [];

  // ① 主手动选择组 (Manual)
  if (ruleOptionsEnable['Manual'] !== false) {
    groups.push({
      name: 'Manual',
      type: 'select',
      proxies: manualGroupProxies,
      icon: `${iconBaseUrl}Proxy.svg`
    });
  }

  // ② 全部单节点手动选择组 (SelectGroup)
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

  // ④ 全局一致性哈希负载均衡组 (LoadBalance)
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

  // ⑤ 业务分流策略组
  if (ruleOptionsEnable.极简模式) {
    groups.push({
      name: 'Final',
      type: 'select',
      proxies: ['Manual', ...basicFunctionGroups, 'DIRECT'],
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

  // ⑥ 国家与地区细分策略组
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
          interval: 1800,
          tolerance: 20,
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

  // 6. 规则集提供者定义 (Classical 与 MRS)
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

  // 7. 规则执行链构建（自上而下匹配）
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

    if (ruleOptionsEnable.Streaming) {
      rules.push(
        'RULE-SET,Bahamut,Streaming',
        'RULE-SET,Netflix,Streaming',
        'RULE-SET,Disney,Streaming',
        'RULE-SET,PrimeVideo,Streaming',
        'RULE-SET,HBO,Streaming'
      );
    }

    if (ruleOptionsEnable.TikTok) rules.push('RULE-SET,TikTok,TikTok');
  }

  rules.push(
    'DOMAIN-SUFFIX,nano.cr18.eu.org,SG',
    'GEOIP,cn,DIRECT',
    'MATCH,Final'
  );

  config['rules'] = rules;

  return config;
}
