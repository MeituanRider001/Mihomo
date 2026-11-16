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
// 2. DNS 与 hosts 处理（移植自 AIsouler/MyClash）
// ==========================================
const ruleSetBaseUrl = 'https://cdn.jsdmirror.com/gh/appshubcc/bett-rules@meta/geo/';

// 与全量版保持一致的开关；精简版不提供界面开关，此处固定为默认值
const ruleOptionsEnable = {
  极简国内外分流模式: false,
  FCM: true
};

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
  const minimalModeEnabled = ruleOptionsEnable.极简国内外分流模式;

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
      ...(minimalModeEnabled ? [] : ruleOptionsEnable['FCM'] ? ['rule-set:googlefcm'] : []),
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
    Speedtest: { ...cProvider, url: 'https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Surge/Speedtest/Speedtest.list' },

    // DNS 段引用（mrs 格式，来自 bett-rules）
    private: { type: 'http', behavior: 'domain', format: 'mrs', interval: 86400, url: `${ruleSetBaseUrl}geosite/private.mrs` },
    fakeip_filter: { type: 'http', behavior: 'domain', format: 'mrs', interval: 86400, url: `${ruleSetBaseUrl}geosite/fakeip-filter.mrs` },
    cn: { type: 'http', behavior: 'domain', format: 'mrs', interval: 86400, url: `${ruleSetBaseUrl}geosite/cn.mrs` },
    douyin: { type: 'http', behavior: 'domain', format: 'mrs', interval: 86400, url: `${ruleSetBaseUrl}geosite/douyin.mrs` },
    googlefcm: { type: 'http', behavior: 'domain', format: 'mrs', interval: 86400, url: `${ruleSetBaseUrl}geosite/googlefcm.mrs` }
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
