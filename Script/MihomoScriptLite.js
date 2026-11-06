// =========================================================================
// Mihomo 配置覆写脚本
// =========================================================================

// ==========================================
// 1. 地区与国旗正则定义（严格边界防跨国误判）
// ==========================================
const hkPattern = '(🇭🇰|香港|(?<![A-Za-z])HKG?(?![A-Za-z])|hong\\s*kong)';
const jpPattern = '(🇯🇵|日本|东京|大阪|京都|(?<![A-Za-z])JPN?(?![A-Za-z])|japan)';
const usPattern = '(🇺🇸|美国|纽约|洛杉矶|旧金山|芝加哥|休斯顿|迈阿密|西雅图|波士顿|华盛顿|拉斯维加斯|圣何塞|(?<![A-Za-z])USA?(?![A-Za-z])|america|united\\s*states)';
const sgPattern = '(🇸🇬|新加坡|狮城|(?<![A-Za-z])SGP?(?![A-Za-z])|singapore)';
const twPattern = '(🇹🇼|台湾|台北|高雄|(?<![A-Za-z])TWN?(?![A-Za-z])|taiwan)';

// 节点清洗正则：剔除机场通知、官网、剩余流量等非节点行
const globalExclude = '(?i)(群|返利|循环|官网|客服|网站|网址|获取|订阅|流量|到期|机场|下次|版本|官址|过期|已用|联系|邮箱|工单|贩卖|通知|倒卖|防止|国内|地址|电报|频道|无法|说明|提示|访问|支持|教程|关注|更新|作者|加入|超时|收藏|优惠|福利|邀请|好友|失联|选择|剩余|公益|发布|DIZTNA|通路|登录|定时|渠道|牢记|永久|余额|阁下|本站|刷新|导航|建议|重置|以下|过滤|⚠️|@|t\\.me\\/\\+|\\bexpire\\b|\\bhttps?:\\/\\/|\\.com|\\btraffic\\b)';
const globalExcludeRegex = new RegExp(globalExclude.replace('(?i)', ''), 'i');

const hkFilter = `(?i)${hkPattern}`;
const jpFilter = `(?i)${jpPattern}`;
const usFilter = `(?i)${usPattern}`;
const sgFilter = `(?i)${sgPattern}`;
const twFilter = `(?i)${twPattern}`;

// 标准 Unicode 旗帜 Emoji 检测（含连续两个区域指示符）
const flagEmojiRegex = /[\u{1F1E6}-\u{1F1FF}]{2}/u;

/**
 * 自动识别并补充对应国旗 Emoji（已有国旗的节点直接返回原名称，杜绝双国旗）
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
// 2. 私有 DNS 与 hosts 节点域名自动改写核心机制
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
 * 命中回环/本地监听 DNS 时，自动将节点域名映射为其在 hosts 中的真实 IP，彻底根治 Timeout
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
 * 智能构建 DNS 与 hosts 映射
 */
function buildDnsAndHostsConfig(config, filteredProxies) {
  const originalDnsConfig = config.dns || {};

  const proxyServerNameservers = originalDnsConfig['proxy-server-nameserver'] || [];
  const listenValue = originalDnsConfig['listen'];

  // 判断是否需要由 hosts 直接改写节点地址（防止本地回环监听导致解析超时）
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

  // 提取订阅原始配置中的私有 DNS
  const privateDNS = [
    ...new Set(
      [...(originalDnsConfig['nameserver'] || []), ...privateProxyServerNameservers]
        .map(stripDnsSuffix)
        .filter((dns) => dns.length > 0 && !isCommonDns(dns)),
    ),
  ];

  // 匹配并保留针对节点域名的私有解析 policy
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
      'geosite:googlefcm',
      ...proxyFakeIpFilter
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
// 3. 主函数 main
// ==========================================
function main(config) {
  // 1. 全局运行参数与界面配置
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

  // 2. 节点预处理：清洗垃圾节点与自动补充国旗
  const rawProxies = config.proxies || [];
  const processedProxies = [];

  for (const proxy of rawProxies) {
    const type = String(proxy.type || '').toLowerCase();
    if (type === 'direct' || type === 'reject') continue;

    let name = proxy.name || '';
    if (globalExcludeRegex.test(name)) continue;

    // 自动补齐国旗
    name = autoAppendFlag(name);
    proxy.name = name;

    processedProxies.push(proxy);
  }

  // 3. 构建 DNS、Hosts 并按需改写节点 server（规避回环超时）
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

  const standardProxies = ['Manual', 'HK', 'SG', 'JP', 'US', 'TW'];

  // 4. 策略组构建（严格使用经过边界保护的地区 Filter）
  config['proxy-groups'] = [
    {
      name: 'Manual',
      type: 'select',
      'include-all': true,
      interval: 300,
      url: 'http://1.1.1.1/generate_204',
      'max-failed-times': 5,
      proxies: ['HK', 'SG', 'JP', 'US', 'TW'],
      icon: 'https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Proxy.png'
    },
    {
      name: 'Telegram',
      type: 'select',
      interval: 300,
      url: 'http://1.1.1.1/generate_204',
      'max-failed-times': 5,
      proxies: standardProxies,
      icon: 'https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Telegram.png'
    },
    {
      name: 'AI',
      type: 'select',
      interval: 300,
      url: 'http://1.1.1.1/generate_204',
      'max-failed-times': 5,
      proxies: standardProxies,
      icon: 'https://raw.githubusercontent.com/Orz-3/mini/master/Color/OpenAI.png'
    },
    {
      name: 'Google',
      type: 'select',
      interval: 300,
      url: 'http://1.1.1.1/generate_204',
      'max-failed-times': 5,
      proxies: standardProxies,
      icon: 'https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Google_Search.png'
    },
    {
      name: 'Streaming',
      type: 'select',
      interval: 300,
      url: 'http://1.1.1.1/generate_204',
      'max-failed-times': 5,
      proxies: standardProxies,
      icon: 'https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/icon/qure/color/ForeignMedia.png'
    },
    {
      name: 'YouTube',
      type: 'select',
      interval: 300,
      url: 'http://1.1.1.1/generate_204',
      'max-failed-times': 5,
      proxies: standardProxies,
      icon: 'https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/icon/color/youtube.png'
    },
    {
      name: 'Spotify',
      type: 'select',
      interval: 300,
      url: 'http://1.1.1.1/generate_204',
      'max-failed-times': 5,
      proxies: standardProxies,
      icon: 'https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Spotify.png'
    },
    {
      name: 'Emby',
      type: 'select',
      interval: 300,
      url: 'http://1.1.1.1/generate_204',
      'max-failed-times': 5,
      proxies: standardProxies,
      icon: 'https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/icon/color/emby.png'
    },
    {
      name: 'TikTok',
      type: 'select',
      interval: 300,
      url: 'http://1.1.1.1/generate_204',
      'max-failed-times': 5,
      proxies: standardProxies,
      icon: 'https://raw.githubusercontent.com/fmz200/wool_scripts/main/icons/apps/TikTok_01.png'
    },
    {
      name: 'Twitter',
      type: 'select',
      interval: 300,
      url: 'http://1.1.1.1/generate_204',
      'max-failed-times': 5,
      proxies: standardProxies,
      icon: 'https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/icon/color/twitter.png'
    },
    {
      name: 'Instagram',
      type: 'select',
      interval: 300,
      url: 'http://1.1.1.1/generate_204',
      'max-failed-times': 5,
      proxies: standardProxies,
      icon: 'https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Instagram.png'
    },
    {
      name: 'Final',
      type: 'select',
      interval: 300,
      url: 'http://1.1.1.1/generate_204',
      'max-failed-times': 5,
      proxies: standardProxies,
      icon: 'https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Final.png'
    },
    {
      name: 'HK',
      type: 'select',
      'include-all': true,
      interval: 300,
      url: 'http://1.1.1.1/generate_204',
      'max-failed-times': 5,
      filter: hkFilter,
      'exclude-filter': globalExclude,
      icon: 'https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Hong_Kong.png'
    },
    {
      name: 'SG',
      type: 'select',
      'include-all': true,
      interval: 300,
      url: 'http://1.1.1.1/generate_204',
      'max-failed-times': 5,
      filter: sgFilter,
      'exclude-filter': globalExclude,
      icon: 'https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Singapore.png'
    },
    {
      name: 'JP',
      type: 'select',
      'include-all': true,
      interval: 300,
      url: 'http://1.1.1.1/generate_204',
      'max-failed-times': 5,
      filter: jpFilter,
      'exclude-filter': globalExclude,
      icon: 'https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Japan.png'
    },
    {
      name: 'US',
      type: 'select',
      'include-all': true,
      interval: 300,
      url: 'http://1.1.1.1/generate_204',
      'max-failed-times': 5,
      filter: usFilter,
      'exclude-filter': globalExclude,
      icon: 'https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/United_States.png'
    },
    {
      name: 'TW',
      type: 'select',
      'include-all': true,
      interval: 300,
      url: 'http://1.1.1.1/generate_204',
      'max-failed-times': 5,
      filter: twFilter,
      'exclude-filter': globalExclude,
      icon: 'https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/China.png'
    }
  ];

  // 5. 规则集定义
  const cProvider = { type: 'http', behavior: 'classical', format: 'text', interval: 86400 };

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
    Speedtest: { ...cProvider, url: 'https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Surge/Speedtest/Speedtest.list' }
  };

  // 6. 分流规则链
  config['rules'] = [
    'RULE-SET,Lan,DIRECT',
    'RULE-SET,Direct,DIRECT',
    'RULE-SET,Reject,REJECT',
    'RULE-SET,Speedtest,Final',
    'RULE-SET,AI,AI',
    'RULE-SET,Spotify,Spotify',
    'RULE-SET,YouTube,YouTube',
    'RULE-SET,Google,Google',
    'RULE-SET,Telegram,Telegram',
    'RULE-SET,Twitter,Twitter',
    'RULE-SET,Instagram,Instagram',
    'RULE-SET,Emby,Emby',
    'RULE-SET,Bahamut,Streaming',
    'RULE-SET,Netflix,Streaming',
    'RULE-SET,Disney,Streaming',
    'RULE-SET,PrimeVideo,Streaming',
    'RULE-SET,HBO,Streaming',
    'RULE-SET,TikTok,TikTok',
    'DOMAIN-SUFFIX,nano.cr18.eu.org,SG',
    'GEOIP,cn,DIRECT',
    'MATCH,Final'
  ];

  return config;
}
