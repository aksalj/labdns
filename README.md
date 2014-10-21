##LabDNS

[![NPM](https://nodei.co/npm/labdns.png?downloads=true&downloadRank=true&stars=true)](https://www.npmjs.org/package/labdns)


Simple DNS Server for the LAN in your lab.

#####Note: This tool was written for demonstration purposes.

### Usage `TODO`
`labDNS -c conf.json`

### Configuration
```javascript
{
    "debug": true,
    "ip": "192.168.0.2",
    "port": "5300",

    "records" : {
        "awesome-server": {
            "A": "192.168.0.5",
            "TTL": 3600
        },
        "www.server.lab": {
            "CNAME":"awesome-server",
            "TTL": 3600
        },
        "*.app.lab": {
            "CNAME": "awesome-server",
            "TTL": 3600
        }
    }
}
```