export const widgetData: Record<string, WidgetMeta> = {
  reliability: {
    title: "DNS Resilience",
    path: "resilience-dns",
    regFeatures: ["AS spread", "ipv4s", "ipv6s"],
    proportionFeatures: ["ipv4 anycast", "ipv6 anycast"],
    categoricalPrefixes: [],
  },
  performance: {
    title: "Performance",
    path: "performance",
    regFeatures: [
      "speed_index",
      "ttfb",
      "num_objects",
      "sz_objects",
      "num_js_objects",
      "servers",
      "origins",
    ],
    proportionFeatures: [],
    categoricalPrefixes: [],
  },
  security: {
    title: "Security",
    path: "security",
    regFeatures: ["3rd_cookies", "3rd_cookie_domains"],
    proportionFeatures: ["is_https", "is_v6"],
    categoricalPrefixes: ["security_protocol_", "http_protocol_"],
  },
};
export type WidgetMeta = {
  title: string;
  path: string;
  regFeatures: WebFeature[];
  proportionFeatures: WebFeature[];
  categoricalPrefixes: string[];
};

const performance_top_5 =
  "The top five complexity metrics that positively correlate with page render time (2).";
export const featureData = {
  //reliability
  "AS spread": {
    info: "Number of autonomous systems (ASes) in which the name servers of a domain name are located (1).",
    direction: 1,
    convert: ["u", "u"],
  },
  "ipv4 anycast": {
    info: "Whether at least one of the name servers relies on BGP ipv4 anycast. (1)",
    direction: 1,
    convert: ["u", "u"],
  },
  "ipv6 anycast": {
    info: "Whether at least one of the name servers relies on BGP ipv6 anycast. (1)",
    direction: 1,
    convert: ["u", "u"],
  },
  ipv4s: {
    info: "Number of ipv4s the domain name servers are on.",
    direction: 1,
    convert: ["u", "u"],
  },
  ipv6s: {
    info: "Number of ipv6s the domain name servers are on.",
    direction: 1,
    convert: ["u", "u"],
  },

  // performance
  speed_index: {
    info: "Lighthouse speed index",
    direction: -1,
    convert: ["ms", "s"],
  },
  ttfb: {
    info: "Time to first byte",
    direction: -1,
    convert: ["ms", "s"],
  },
  num_objects: {
    info: "The number of objects the webpage uses." + performance_top_5,
    direction: -1,
    convert: ["u", "u"],
  },
  sz_objects: {
    info:
      "Total size of the webpage and all its resources." + performance_top_5,
    direction: -1,
    convert: ["B", "MB"],
  },
  num_js_objects: {
    info: "The number of js objects the webpage uses." + performance_top_5,
    direction: -1,
    convert: ["u", "u"],
  },
  servers: {
    info: "The number of servers the webpage contacts." + performance_top_5,
    direction: -1,
    convert: ["u", "u"],
  },
  origins: {
    info: "The number of origins the webpage contacts." + performance_top_5,
    direction: -1,
    convert: ["u", "u"],
  },
  //security
  http_protocol_h3: {
    info: "HTTP/3 is the most secure http protocol since it uses QUIC which requires encryption by default.",
    direction: 1,
    convert: [".", "%"],
  },
  http_protocol_h2: {
    info: "HTTP/2 is a modern protocol that is faster than HTTP/1.1 but not as advanced as HTTP/3.",
    direction: 0,
    convert: [".", "%"],
  },
  "http_protocol_http/1.1": {
    info: "HTTP/1.1 is an older, less efficient version of the HTTP protocol.",
    direction: 0,
    convert: [".", "%"],
  },

  "3rd_cookies": {
    info: "The number of third-party cookies, which are often used for cross-site tracking and advertising.",
    direction: -1,
    convert: ["u", "u"],
  },
  "3rd_cookie_domains": {
    info: "The number of unique third-party domains setting cookies, indicating how many different trackers are present.",
    direction: -1,
    convert: ["u", "u"],
  },

  is_https: {
    info: "Whether the website uses HTTPS to encrypt communication, which is a fundamental security practice. If false, security protocol is none.",
    direction: 1,
    convert: [".", "%"],
  },
  is_v6: {
    info: "Whether the website is accessible over IPv6, the most recent version of the Internet Protocol.",
    direction: 1,
    convert: [".", "%"],
  },

  "security_protocol_TLS 1.3": {
    info: "TLS 1.3 is the latest and most secure version of the TLS protocol, offering stronger encryption and a faster handshake.",
    direction: 1,
    convert: [".", "%"],
  },
  "security_protocol_TLS 1.2": {
    info: "TLS 1.2 is a widely used and secure protocol, but it is the predecessor to the more modern TLS 1.3.",
    direction: 0,
    convert: [".", "%"],
  },
  security_protocol_none: {
    info: "Indicates no encryption is used (plain HTTP), which is insecure as data is sent in cleartext.",
    direction: 0,
    convert: [".", "%"],
  },
};
export type WebFeature = keyof typeof featureData;
export const featureSet = Object.keys(featureData);
export const sourcesCited = [
  "(1) https://github.com/SIDN/domainrd",
  "(2) https://web.eecs.umich.edu/~harshavm/papers/imc11.pdf",
];
export function label_display(featureName: WebFeature) {
  const myFeatureData = featureData[featureName];
  const units =
    myFeatureData.convert[1] != "u"
      ? " (" + myFeatureData.convert[1] + ")"
      : "";
  return featureName.replace(new RegExp("_", "g"), " ") + units;
}
export function unit_convert(convert: string[], value: number): string {
  var LHS;
  const [from, to] = convert;
  if (from == "ms" && to == "s") {
    LHS = value / 1000;
  } else if (from == "B" && to == "MB") {
    LHS = value / (1024 * 1024);
  } else if (from == "." && to == "%") {
    LHS = value * 100;
  } else {
    LHS = value;
  }
  if (LHS > 99) {
    return String(Math.round(LHS));
  } else {
    return LHS.toPrecision(3);
  }
}
