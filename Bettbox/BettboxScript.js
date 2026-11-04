// ==========================================
// Bettbox GUI 可视化选项
// ==========================================
const Compatible_With_Bettbox = { ruleOptionsEnable: true };

const iconBaseUrl = 'https://cdn.jsdmirror.com/gh/AIsouler/MyClash@main/Icons/svg/';
const ruleSetBaseUrl = 'https://cdn.jsdmirror.com/gh/appshubcc/bett-rules@meta/geo/';

/**
 * 全量静态策略与图标定义表（Bettbox GUI 核心扫描数组）
 */
const serviceConfigs = [
  // 4个基础策略组
  { name: 'Manual', icon: `${iconBaseUrl}Proxy.svg`, isBase: true },
  { name: 'SelectGroup', icon: `${iconBaseUrl}Static.svg`, isBase: true },
  { name: 'AutoGroup', icon: `${iconBaseUrl}Auto.svg`, isBase: true },
  { name: 'LoadBalance', icon: `${iconBaseUrl}RoundRobin.svg`, isBase: true },

  // 分流业务策略组
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
 * 自定义配置选项（Bettbox GUI 动态注入）
 */
var ruleOptionsEnable = {
  // 基础策略组开关
  'Manual': true,
  'SelectGroup': true,
  'AutoGroup': true,
  'LoadBalance': true,

  // 分流服务策略配置
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

  // 功能增强开关
  自动补国旗: true,
  处理私有DNS: true,

  // 其他设置
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
// 1. 原版精准地区定义与正则
// ==========================================
const hkPattern = '(🇭🇰|香港|(?<![A-Za-z])HKG?(?![A-Za-z])|hong\\s*kong)';
const jpPattern = '(🇯🇵|日本|东京|大阪|京都|(?<![A-Za-z])JPN?(?![A-Za-z])|japan)';
const usPattern = '(🇺🇸|美国|(?<![A-Za-z])USA?(?![A-Za-z])|america|united\\s*states)';
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

// ==========================================
// 2. 自动补国旗
// ==========================================
// 匹配所有标准国旗 Emoji（区域指示符号代理对及旗帜类符号）
const flagEmojiRegex = /(?:\uD83C[\uDDE6-\uDDFF]){2}|[\uD83C\uDFC1\uD83C\uDFF3\uD83C\uDFF4]/;

// 补国旗专用的文字特征库（排除国旗 Emoji 本身，避免自带国旗节点触发自匹配）
const flagMatchRules = [
  { flag: '🇭🇰', reg: /(?:香港|(?<![A-Za-z])HKG?(?![A-Za-z])|hong\s*kong)/i },
  { flag: '🇯🇵', reg: /(?:日本|东京|大阪|京都|(?<![A-Za-z])JPN?(?![A-Za-z])|japan)/i },
  { flag: '🇺🇸', reg: /(?:美国|(?<![A-Za-z])USA?(?![A-Za-z])|america|united\s*states)/i },
  { flag: '🇸🇬', reg: /(?:新加坡|狮城|(?<![A-Za-z])SGP?(?![A-Za-z])|singapore)/i },
  { flag: '🇹🇼', reg: /(?:台湾|台北|高雄|(?<![A-Za-z])TWN?(?![A-Za-z])|taiwan)/i }
];

function autoAppendFlag(name) {
  if (!name) return '';
  // 若节点自带任何国旗 Emoji，直接跳过
  if (flagEmojiRegex.test(name)) {
    return name;
  }
  for (const item of flagMatchRules) {
    if (item.reg.test(name)) {
      return `${item.flag} ${name}`;
    }
  }
  return name;
}

// ==========================================
// 3. 私有 DNS 完整处理函数
// ==========================================
function handlePrivateDnsAndHosts(config) {
  if (!config.dns) config.dns = {};
  config.hosts = config.hosts || {};

  const nameserverPolicy = config.dns['nameserver-policy'] || {};
  let proxyServerDns = config.dns['proxy-server-nameserver'] || [];

  // 提取订阅中的顶层私有 nameserver
  if (Array.isArray(config.nameservers)) {
    config.nameservers.forEach(ns => {
      if (!proxyServerDns.includes(ns)) {
        proxyServerDns.push(ns);
      }
    });
  }

  // 提取所有节点域名（排除纯 IP）
  const rawProxies = config.proxies || [];
  const domainRegex = /^[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+$/;
  const ipRegex = /^(?:\d{1,3}\.){3}\d{1,3}$|^\[?[a-fA-F0-9:]+\]?$/;

  const nodeDomains = new Set();
  rawProxies.forEach(p => {
    if (p.server && !ipRegex.test(p.server) && domainRegex.test(p.server)) {
      nodeDomains.add(p.server);
    }
    if (p.sni && !ipRegex.test(p.sni) && domainRegex.test(p.sni)) {
      nodeDomains.add(p.sni);
    }
    if (p['reality-opts'] && p['reality-opts']['server-name']) {
      const realitySni = p['reality-opts']['server-name'];
      if (!ipRegex.test(realitySni) && domainRegex.test(realitySni)) {
        nodeDomains.add(realitySni);
      }
    }
  });

  // 将节点域名绑定到专用直连解析，防止 Fake-IP 循环握手死锁
  const cleanDns = proxyServerDns.length > 0 ? proxyServerDns : ['223.5.5.5', '119.29.29.29'];
  nodeDomains.forEach(domain => {
    nameserverPolicy[domain] = cleanDns;
  });

  config.dns['proxy-server-nameserver'] = proxyServerDns;
  config.dns['nameserver-policy'] = nameserverPolicy;
}

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

  // 2. DNS 配置
  const chinaDNS = ['223.5.5.5#DIRECT', '119.29.29.29#DIRECT'];
  const foreignDNS = ['https://cloudflare-dns.com/dns-query#Manual', 'https://dns.google/dns-query#Manual'];
  const defaultDNS = ['114.114.114.114#DIRECT', 'tls://223.5.5.5#DIRECT', 'https://1.12.12.12/dns-query#DIRECT'];
  const proxyServerDNS = ['114.114.114.114#DIRECT', 'tls://223.5.5.5#DIRECT', 'https://doh.pub/dns-query#DIRECT'];

  const fakeIpFilters = ['geosite:private', 'geosite:cn'];
  if (ruleOptionsEnable['FCM']) {
    fakeIpFilters.push('geosite:googlefcm');
  }

  config['dns'] = {
    enable: true,
    ipv6: true,
    'use-hosts': true,
    'cache-algorithm': 'arc',
    'use-system-hosts': true,
    'enhanced-mode': 'fake-ip',
    'fake-ip-range': '198.18.0.1/15',
    'fake-ip-range6': '2001:2::1/48',
    'fake-ip-filter': fakeIpFilters,
    'default-nameserver': defaultDNS,
    'proxy-server-nameserver': proxyServerDNS,
    nameserver: foreignDNS,
    'nameserver-policy': {
      'geosite:private': 'system',
      'geosite:category-entertainment-cn,douyin': ['system', '180.184.1.1', '180.184.2.2'],
      'geosite:cn': chinaDNS
    },
    'direct-nameserver': chinaDNS,
    'direct-nameserver-follow-policy': true
  };

  // 3. Hosts 与 NTP 配置
  config['hosts'] = {
    'doh.pub': ['1.12.12.12', '120.53.53.53'],
    'cloudflare-dns.com': ['1.1.1.1', '1.0.0.1'],
    'dns.google': ['8.8.8.8', '8.8.4.4'],
    'services.googleapis.cn': 'services.googleapis.com',
    '+.mcdn.bilivideo.com': ['0.0.0.0'],
    '+.mcdn.bilivideo.cn': ['0.0.0.0'],
    '+.edge.mountaintoys.cn': ['0.0.0.0'],
    '+.h2.smtcdns.net': ['0.0.0.0']
  };

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

  // 4. 节点预处理（补国旗、过滤与 IP 偏好设置）
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

  if (processedProxies.length > 0) {
    config.proxies = processedProxies;
  }

  // 执行私有 DNS 自动接入与节点域名 Policy 挂载
  if (ruleOptionsEnable.处理私有DNS) {
    handlePrivateDnsAndHosts(config);
  }

  // 5. 构造基础组与地区列表
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
  if (ruleOptionsEnable.生成低倍率组) rateGroupsList.push('LowGroup');
  if (ruleOptionsEnable.生成高倍率组) rateGroupsList.push('HighGroup');

  const manualGroupProxies = [
    ...baseRegionList,
    ...basicFunctionGroups,
    ...rateGroupsList
  ];

  const commonProxies = ['Manual', ...basicFunctionGroups, ...baseRegionList, ...rateGroupsList];
  const serviceProxies = ruleOptionsEnable.分流组添加所有节点
    ? [...commonProxies, ...allProxyNames]
    : commonProxies;

  // 6. 策略组构建
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

  // ② 手动 (SelectGroup)
  if (ruleOptionsEnable['SelectGroup'] !== false) {
    groups.push({
      name: 'SelectGroup',
      type: 'select',
      'include-all': true,
      'exclude-filter': globalExclude,
      icon: `${iconBaseUrl}Static.svg`
    });
  }

  // ③ 自动 (AutoGroup)
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

  // ④ 负载均衡 (LoadBalance)
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

  // ⑤ 分流策略组
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

  // ⑥ 国家策略组
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

  // 7. 规则集定义
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
    Emby: { ...cProvider, url: 'https://github.com/Repcz/Tool/raw/X/mihomo/Rules/Emby.list' },
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

  // 8. 分流规则构建
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
