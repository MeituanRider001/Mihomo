# Mihomo

基于 [mihomo](https://github.com/MetaCubeX/mihomo)（Clash.Meta）内核的**覆写脚本与配置文件**，在 [AIsouler/MyClash](https://github.com/AIsouler/MyClash) 基础上二次修改，仅适用于支持脚本覆写的 mihomo 客户端。

> [!IMPORTANT]
>
> 使用本仓库的脚本或配置时，**请关闭代理软件自带的 DNS 覆写功能**，否则客户端的 DNS 设置会覆盖本项目的分流设计，导致节点域名解析异常或分流失效。

---

## 覆写脚本（推荐）

覆写脚本不改动机场订阅正文，客户端启动时动态注入策略组、清洗节点名称、补全国旗。机场换节点后无需手动调整配置，始终与节点列表保持同步。

> [!NOTE]
>
> 脚本仅用于覆写**机场提供的订阅配置**，不要用于覆写本仓库的静态 YAML，二者会互相冲突。

### 全量版

[Script/MihomoScript.js](/Script/MihomoScript.js)，复制下方链接使用 👇

```text
https://raw.githubusercontent.com/MeituanRider001/Mihomo/main/Script/MihomoScript.js
```

### 精简版

[Script/MihomoScriptLite.js](/Script/MihomoScriptLite.js)，复制下方链接使用 👇

```text
https://raw.githubusercontent.com/MeituanRider001/Mihomo/main/Script/MihomoScriptLite.js
```

### Bettbox 版

[Bettbox/BettboxScript.js](/Bettbox/BettboxScript.js)，策略组可在图形界面开关，图标采用 SVG 👇

```text
https://raw.githubusercontent.com/MeituanRider001/Mihomo/main/Bettbox/BettboxScript.js
```

与前两个版本的差异：**40 余项功能均可在 Bettbox 界面直接开关**，无需修改代码。

- **策略组**：地区手动 / 自动选择、高倍率 / 低倍率组、负载均衡，以及 AI、YouTube、Google、Telegram、Steam、Netflix、Spotify、Bilibili、Bahamut 等分流组
- **节点处理**：自动补国旗、序号规整化、去除广告前后缀；按倍率过滤高 / 低倍率节点与非地区节点
- **网络策略**：屏蔽国外 QUIC、指定域名阻断 IPv6、代理 IPv4 / IPv6 优先
- **DNS**：防泄漏强化与 Fallback 容灾
- **图标**：38 个自托管 SVG 图标

---

## 配置文件

静态 YAML 的优势是不依赖客户端脚本支持，任何 mihomo 内核客户端都能直接导入；代价是**无法像脚本那样动态处理**，因此存在三点固有限制：

- 无法根据实际节点动态生成地区组，某个地区没有匹配到节点时，该策略组为空
- 使用机场私有 DNS 或 hosts 映射节点域名的场景，需要手动写入 `hosts` 段
- 端口、地区正则、订阅链接等自定义项均需手工编辑

### 全量版

[Config/MihomoConfig.yaml](/Config/MihomoConfig.yaml) 👇

```text
https://raw.githubusercontent.com/MeituanRider001/Mihomo/main/Config/MihomoConfig.yaml
```

### 精简版

[Config/MihomoConfigLite.yaml](/Config/MihomoConfigLite.yaml) 👇

```text
https://raw.githubusercontent.com/MeituanRider001/Mihomo/main/Config/MihomoConfigLite.yaml
```

### 代理链版

[Config/MihomoConfigRelay.yaml](/Config/MihomoConfigRelay.yaml) 👇

```text
https://raw.githubusercontent.com/MeituanRider001/Mihomo/main/Config/MihomoConfigRelay.yaml
```

适用于「中转入口 + 落地出口」双订阅。两条订阅分别填写：

```yaml
proxy-providers:
  Subscribe-In:                      # 第一跳：中转入口
    url: http://your-entry-provider
    <<: *p
  Subscribe-Out:                     # 第二跳：最终落地
    url: http://your-exit-provider
    <<: *p
    override:
      dialer-proxy: Entry-Group      # 关键：出口节点自动借道入口组
```

`Entry-Group` 绑定 `Subscribe-In` 选择中转节点，`Exit-Group` 绑定 `Subscribe-Out` 选择落地节点，流量路径为 `本机 → Entry-Group → Exit-Group → 目标站点`。

---

## 致谢

本项目在以下开源工作的基础上修改与整合：

- [AIsouler/MyClash](https://github.com/AIsouler/MyClash) —— 本项目的基础来源，脚本与配置结构均源自该项目
- [Repcz/Tool](https://github.com/Repcz/Tool) —— 主要规则集来源
- [blackmatrix7/ios_rule_script](https://github.com/blackmatrix7/ios_rule_script) —— 补充规则与图标
- [appshubcc/bett-rules](https://github.com/appshubcc/bett-rules) —— Bettbox 规则
- [Koolson/Qure](https://github.com/Koolson/Qure) —— 策略组图标
- [Zephyruso/zashboard](https://github.com/Zephyruso/zashboard) —— 在线面板
- [jsdmirror/JSDMirror](https://github.com/jsdmirror/JSDMirror) —— CDN 加速

## 免责声明

本项目仅供网络技术学习与交流使用。配置文件与脚本本身不包含任何代理节点，不提供任何网络服务。使用者应自行确保使用方法符合所在地法律法规，因使用本项目产生的一切后果由使用者自行承担。
