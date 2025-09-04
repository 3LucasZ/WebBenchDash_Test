# WebBench Dashboard

### Backend

<!-- fastapi dev backend/main.py -->

### Frontend

<!-- npm run dev -->

React simple maps with React 19
https://github.com/zcreativelabs/react-simple-maps/issues/367
Convert b/w country codes
https://gist.github.com/maephisto/9228207?permalink_comment_id=1963107#gistcomment-1963107
Count animation
https://www.shadcn.io/text/counting-number

### Justification

- http protocol
  - HTTP/3 is the most secure
  - Uses QUIC; requires encryption by default
- is https
  - HTTPS is more secure than HTTP
- security protocol
  - Only works if over https
  - TLS 1.3 is the most secure.
  - Stronger cipher suites, enhanced forward secrecy, removal of weak algorithms
- is ipv6
  - A mandatory component of IPv6, Internet Protocol Security (IPsec) provides security for IP by authenticating and encrypting each IP packet of a session.
  - Difficult for attackers to scan entire network blocks to find vulnerable web servers
- 3rd party cookies
  - ability to track users across the internet is invasion of user privacy and security

### Credits

#### Web lists

- Government websites per country: https://dl.acm.org/doi/10.1145/3646547.3688447
- Top websites per country: Google CrUX

```
SELECT distinct country_code, origin, experimental.popularity.rank
    FROM `chrome-ux-report.experimental.country`
    WHERE yyyymm = 202506 AND experimental.popularity.rank <= 1000
    GROUP BY country_code, origin, experimental.popularity.rank
    ORDER BY country_code, experimental.popularity.rank;
```

- Blocklist: https://raw.githubusercontent.com/mozilla/heatmap/master/pornfilter/domain_blocklist.txt

#### Datasets

- Internet usage 2024: https://data.un.org/_Docs/SYB/CSV/SYB67_314_202411_Internet%20Usage.csv
- HDI 2023: https://hdr.undp.org/sites/default/files/2025_HDR/HDR25_Statistical_Annex_HDI_Table.xlsx

#### Misc

- Anycast prefixes: https://github.com/bgptools/anycast-prefixes/blob/master/anycatch-v4-prefixes.txt
