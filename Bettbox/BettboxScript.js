// =========================================================================
// Bettbox Mihomo 进阶流媒体与策略分流配置脚本 
// =========================================================================

const Compatible_With_Bettbox = { ruleOptionsEnable: true };

const iconBaseUrl = 'https://cdn.jsdmirror.com/gh/AIsouler/MyClash@main/Icons/svg/';
// 自托管 SVG 图标库（MeituanRider001/Qure_Style_SVG）：flag/ 为地区旗帜，common/ 为通用图标
const svgRepoBase = 'https://cdn.jsdmirror.com/gh/MeituanRider001/Qure_Style_SVG@main/icon/svg/';
const ruleSetBaseUrl = 'https://cdn.jsdmirror.com/gh/appshubcc/bett-rules@meta/geo/';

/**
 * 策略组与图标定义表
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
  { name: 'GitHub', icon: `${svgRepoBase}common/GitHub.svg`, direct: true },
  { name: 'Steam', icon: `${iconBaseUrl}Steam.svg`, direct: true },
  { name: 'PikPak', icon: `${iconBaseUrl}PikPak.svg`, direct: true },
  { name: 'Meta', icon: `${iconBaseUrl}Meta.svg` },
  { name: 'Line', icon: `${iconBaseUrl}Line.svg` },
  { name: 'Speedtest', icon: `${svgRepoBase}common/Speedtest.svg`, direct: true },
  { name: 'AI', icon: `${iconBaseUrl}OpenAI.svg`, proxies: ['Manual', 'US', 'JP', 'SG', 'TW', 'HK', 'Other'] },
  { name: 'Telegram', icon: `${iconBaseUrl}Telegram.svg` },
  { name: 'Google', icon: `${iconBaseUrl}Google.svg` },
  { name: 'YouTube', icon: `${iconBaseUrl}YouTube.svg` },
  { name: 'Spotify', icon: `${iconBaseUrl}Spotify.svg` },
  { name: 'Emby', icon: `${iconBaseUrl}Emby.svg` },
  { name: 'TikTok', icon: `${iconBaseUrl}TikTok.svg` },
  { name: 'Twitter', icon: `${iconBaseUrl}Twitter.svg` },
  { name: 'Instagram', icon: `${svgRepoBase}common/Instagram.svg` },

  // 细分流媒体组
  { name: 'Bilibili', icon: `${svgRepoBase}common/bilibili.svg`, proxies: ['DIRECT', 'HK', 'TW'] },
  { name: 'Bahamut', icon: `${svgRepoBase}common/Bahamut.svg`, proxies: ['TW', 'HK', 'Manual'] },
  { name: 'Netflix', icon: `${svgRepoBase}common/Netflix.svg` },
  { name: 'Disney', icon: `${svgRepoBase}common/Disney.svg` },
  { name: 'PrimeVideo', icon: `${svgRepoBase}common/Prime_Video.svg` },
  { name: 'HBO', icon: `${svgRepoBase}common/HBO.svg` },

  { name: 'Final', icon: `${svgRepoBase}common/Final.svg` }
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

  // 增强功能
  自动补国旗: true,
  去除节点广告前缀后缀: true,
  节点序号规整化: true,
  节点裂变UDP: false,
  极简模式: false,
  生成地区自动选择组: false,
  隐藏地区手动选择组: false,
  生成低倍率组: false,
  生成高倍率组: false,
  分流组添加所有节点: false,
  过滤低倍率节点: false,
  过滤高倍率节点: false,
  过滤非地区节点: true,
  屏蔽国外QUIC: true,         // 精准拦截境外 QUIC，防止境外流媒体 UDP 断流
  代理IPV4优先: true,
  代理IPV6优先: false,

  DNS防泄漏强化: true,
  DNSFallback容灾: true,
  特定域名阻断IPv6: true,

  // 地区自动测试预设档位开关
  自动测试间隔_10分钟: false,
  自动测试间隔_30分钟: true,
  自动测试间隔_60分钟: false,

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
// 2. DNS 处理与 hosts 节点改写
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

function buildDnsAndHostsConfig(config, filteredProxies) {
  const minimalModeEnabled = ruleOptionsEnable.极简模式;
  const originalDnsConfig = config.dns || {};

  const proxyServerNameservers = originalDnsConfig['proxy-server-nameserver'] || [];
  const listenValue = originalDnsConfig['listen'];

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

  if (ruleOptionsEnable.DNS防泄漏强化) {
    dns['respect-rules'] = true;
  }

  if (ruleOptionsEnable.DNSFallback容灾) {
    dns['fallback'] = fallbackDNS;
    dns['fallback-filter'] = {
      geoip: true,
      geoip_code: 'CN',
      geosite: ['gfw'],
      ipcidr: ['240.0.0.0/4']
    };
  }

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
// 3. 主函数 main
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

  config['geodata-mode'] = true;
  config['geo-auto-update'] = true;
  config['geo-update-interval'] = 24;
  config['geox-url'] = {
    geoip: "https://mirror.ghproxy.com/https://raw.githubusercontent.com/Loyalsoldier/geoip/release/geoip.dat",
    geosite: "https://mirror.ghproxy.com/https://github.com/MetaCubeX/meta-rules-dat/releases/download/latest/geosite.dat",
    mmdb: "https://mirror.ghproxy.com/https://raw.githubusercontent.com/Loyalsoldier/geoip/release/Country.mmdb",
    asn: "https://mirror.ghproxy.com/https://raw.githubusercontent.com/Loyalsoldier/geoip/release/GeoLite2-ASN.mmdb"
  };

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

    if (ruleOptionsEnable.去除节点广告前缀后缀) {
      name = cleanNodeName(name);
    }
    if (ruleOptionsEnable.节点序号规整化) {
      name = formatNodeIndex(name);
    }
    if (ruleOptionsEnable.自动补国旗) {
      name = autoAppendFlag(name);
    }
    proxy.name = name;

    if (ipPref) {
      proxy['ip-version'] = ipPref;
    }
    processedProxies.push(proxy);

    if (ruleOptionsEnable.节点裂变UDP && proxy.udp !== false) {
      const clonedProxy = JSON.parse(JSON.stringify(proxy));
      clonedProxy.name = `[UDP] ${proxy.name}`;
      clonedProxy.udp = true;
      fisionProxies.push(clonedProxy);
    }
  }

  if (fisionProxies.length > 0) {
    processedProxies.push(...fisionProxies);
  }

  const { dns, hosts, mappedProxies } = buildDnsAndHostsConfig(config, processedProxies);
  config['dns'] = dns;
  config['hosts'] = hosts;
  config['proxies'] = mappedProxies;

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
  if (!ruleOptionsEnable.极简模式) {
    baseRegionList.push('HK', 'SG', 'JP', 'US', 'TW', 'Other');
    if (ruleOptionsEnable.生成地区自动选择组) {
      baseRegionList.push('HKAuto', 'SGAuto', 'JPAuto', 'USAuto', 'TWAuto');
    }
  }

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

  // ④ LoadBalance
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

  // ⑤ 专属分流
  if (ruleOptionsEnable.极简模式) {
    const finalCandidates = ['Manual', ...basicFunctionGroups, 'DIRECT'];
    groups.push({
      name: 'Final',
      type: 'select',
      proxies: [...new Set(finalCandidates)],
      icon: `${svgRepoBase}common/Final.svg`
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
  if (!ruleOptionsEnable.极简模式) {
    const hideManual = ruleOptionsEnable.隐藏地区手动选择组 === true;
    const regionSelectConfigs = [
      { name: 'HK', filter: hkFilter, icon: `${svgRepoBase}flag/Hong_Kong.svg` },
      { name: 'SG', filter: sgFilter, icon: `${svgRepoBase}flag/Singapore.svg` },
      { name: 'JP', filter: jpFilter, icon: `${svgRepoBase}flag/Japan.svg` },
      { name: 'US', filter: usFilter, icon: `${svgRepoBase}flag/United_States.svg` },
      { name: 'TW', filter: twFilter, icon: `${svgRepoBase}flag/China_Taiwan.svg` },
      { name: 'Other', 'exclude-filter': otherExclude, icon: `${svgRepoBase}common/Global.svg` }
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
        { name: 'HKAuto', filter: hkFilter, icon: `${svgRepoBase}flag/Hong_Kong.svg` },
        { name: 'SGAuto', filter: sgFilter, icon: `${svgRepoBase}flag/Singapore.svg` },
        { name: 'JPAuto', filter: jpFilter, icon: `${svgRepoBase}flag/Japan.svg` },
        { name: 'USAuto', filter: usFilter, icon: `${svgRepoBase}flag/United_States.svg` },
        { name: 'TWAuto', filter: twFilter, icon: `${svgRepoBase}flag/China_Taiwan.svg` }
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

  // 【优化】排布位置后移至常规直连白名单之后，且改用 geolocation-!cn 精准匹配境外 UDP 443
  if (ruleOptionsEnable.屏蔽国外QUIC) {
    rules.push('AND,((NETWORK,UDP),(DST-PORT,443),(RULE-SET,geolocation-!cn)),REJECT');
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

  const nanoTarget = ruleOptionsEnable.极简模式 ? 'Manual' : 'SG';

  rules.push(
    `DOMAIN-SUFFIX,nano.cr18.eu.org,${nanoTarget}`,
    'GEOIP,cn,DIRECT',
    'MATCH,Final'
  );

  config['rules'] = rules;

  return config;
}
