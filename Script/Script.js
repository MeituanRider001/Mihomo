// Mihomo 配置覆写脚本
function main(config) {
  // 1. 全局运行参数与界面配置[cite: 7]
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

  // 2. DNS 配置[cite: 7]
  const chinaDNS = ['223.5.5.5#DIRECT', '119.29.29.29#DIRECT'];
  const foreignDNS = ['https://cloudflare-dns.com/dns-query#Manual', 'https://dns.google/dns-query#Manual'];
  const defaultDNS = ['114.114.114.114#DIRECT', 'tls://223.5.5.5#DIRECT', 'https://1.12.12.12/dns-query#DIRECT'];
  const proxyServerDNS = ['114.114.114.114#DIRECT', 'tls://223.5.5.5#DIRECT', 'https://doh.pub/dns-query#DIRECT'];

  config['dns'] = {
    enable: true,
    ipv6: true,
    'use-hosts': true,
    'cache-algorithm': 'arc',
    'use-system-hosts': true,
    'enhanced-mode': 'fake-ip',
    'fake-ip-range': '198.18.0.1/15',
    'fake-ip-range6': '2001:2::1/48',
    'fake-ip-filter': ['geosite:private', 'geosite:cn', 'geosite:googlefcm'],
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

  // 3. Hosts 与 NTP 配置[cite: 7]
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

  // 4. 正则表达式过滤器定义[cite: 7]
  const globalExclude = '(?i)(群|返利|循环|官网|客服|网站|网址|获取|订阅|流量|到期|机场|下次|版本|官址|过期|已用|联系|邮箱|工单|贩卖|通知|倒卖|防止|国内|地址|电报|频道|无法|说明|提示|访问|支持|教程|关注|更新|作者|加入|超时|收藏|优惠|福利|邀请|好友|失联|选择|剩余|公益|发布|DIZTNA|通路|登录|定时|渠道|牢记|永久|余额|阁下|本站|刷新|导航|建议|重置|以下|过滤|⚠️|@|t\\.me\\/\\+|\\bexpire\\b|\\bhttps?:\\/\\/|\\.com|\\btraffic\\b)';
  const hkFilter = '(?i)(🇭🇰|香港|(?<![A-Za-z])HKG?(?![A-Za-z])|hong\\s*kong)';
  const jpFilter = '(?i)(🇯🇵|日本|东京|大阪|京都|(?<![A-Za-z])JPN?(?![A-Za-z])|japan)';
  const usFilter = '(?i)(🇺🇸|美国|纽约|洛杉矶|旧金山|芝加哥|休斯顿|迈阿密|西雅图|波士顿|华盛顿|拉斯维加斯|圣何塞|(?<![A-Za-z])USA?(?![A-Za-z])|america|united\\s*states)';
  const sgFilter = '(?i)(🇸🇬|新加坡|狮城|(?<![A-Za-z])SGP?(?![A-Za-z])|singapore)';
  const twFilter = '(?i)(🇹🇼|台湾|台北|高雄|(?<![A-Za-z])TWN?(?![A-Za-z])|taiwan)';

  const standardProxies = ['Manual', 'HK', 'SG', 'JP', 'US', 'TW'];

  // 5. 策略组构建[cite: 7]
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

  // 6. 规则集定义[cite: 7]
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
    Emby: { ...cProvider, url: 'https://github.com/Repcz/Tool/raw/X/mihomo/Rules/Emby.list' },
    Bahamut: { ...cProvider, url: 'https://raw.githubusercontent.com/Repcz/Tool/refs/heads/X/mihomo/Rules/Bahamut.list' },
    Netflix: { ...cProvider, url: 'https://raw.githubusercontent.com/Repcz/Tool/refs/heads/X/mihomo/Rules/Netflix.list' },
    Disney: { ...cProvider, url: 'https://raw.githubusercontent.com/Repcz/Tool/refs/heads/X/mihomo/Rules/Disney.list' },
    PrimeVideo: { ...cProvider, url: 'https://raw.githubusercontent.com/Repcz/Tool/refs/heads/X/mihomo/Rules/PrimeVideo.list' },
    HBO: { ...cProvider, url: 'https://raw.githubusercontent.com/Repcz/Tool/refs/heads/X/mihomo/Rules/HBO.list' },
    TikTok: { ...cProvider, url: 'https://raw.githubusercontent.com/Repcz/Tool/refs/heads/X/mihomo/Rules/TikTok.list' },
    Speedtest: { ...cProvider, url: 'https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Surge/Speedtest/Speedtest.list' }
  };

  // 7. 分流规则[cite: 7]
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
