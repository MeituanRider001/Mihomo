// =========================================================================
// Bettbox Mihomo 进阶流媒体与策略分流配置脚本
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
 */
var ruleOptionsEnable = {
  // --- 基础调度策略组 ---
  'Manual': true,      // 手动汇总策略组（主策略入口）
  'SelectGroup': true, // 手动单节点聚合列表
  'AutoGroup': true,   // 全球全节点延迟自动优选
  'LoadBalance': true, // 全球全节点负载均衡组

  // --- 分流服务策略组开关 ---
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
  Streaming: true,
  TikTok: true,

  // --- 节点与策略增强特性 ---
  自动补国旗: true,
  极简模式: false,
  生成地区自动选择组: false,
  隐藏地区手动选择组: false,
  生成低倍率组: false,
  生成高倍率组: false,
  分流组添加所有节点: false,
  过滤低倍率节点: false,
  过滤高倍率节点: false,
  过滤非地区节点: true,
  屏蔽国外QUIC: true,
  代理IPV4优先: true,
  代理IPV6优先: false
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

// 区域指示码旗帜 Emoji 规范匹配
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

  // 4. 组装策略组候选项（兼容极简模式）
  const allProxyNames = (config.proxies || []).map(p => p.name);
  
  const basicFunctionGroups = [];
  if (ruleOptionsEnable['SelectGroup'] !== false) basicFunctionGroups.push('SelectGroup');
  if (ruleOptionsEnable['AutoGroup'] !== false) basicFunctionGroups.push('AutoGroup');
  if (ruleOptionsEnable['LoadBalance'] !== false) basicFunctionGroups.push('LoadBalance');

  // 【核心修复】：极简模式下不生成国家组，因此 baseRegionList 必须为空，杜绝 HK not found
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

  // 计算 Manual 组的代理项
  let manualGroupProxies = [
    ...baseRegionList,
    ...basicFunctionGroups,
    ...rateGroupsList
  ];

  // 如果在极简模式下基础组全被关掉了，则直接平铺所有单节点
  if (manualGroupProxies.length === 0) {
    manualGroupProxies = allProxyNames.length > 0 ? allProxyNames : ['DIRECT'];
  }

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

  // ⑥ 国家与地区细分策略组（极简模式下不生成）
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

  // 极简模式下由于没有单独的 SG 策略组，该域名自动改走 Manual
  const nanoTarget = ruleOptionsEnable.极简模式 ? 'Manual' : 'SG';

  rules.push(
    `DOMAIN-SUFFIX,nano.cr18.eu.org,${nanoTarget}`,
    'GEOIP,cn,DIRECT',
    'MATCH,Final'
  );

  config['rules'] = rules;

  return config;
}
