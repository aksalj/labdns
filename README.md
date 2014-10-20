##LabDNS

[![NPM](https://nodei.co/npm/labdns.png?downloads=true&downloadRank=true&stars=true)](https://www.npmjs.org/package/labdns)


Simple DNS Server for the LAN in your lab, inspired by [xip.io](http://xip.io/).

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


### Contributing

1. Fork this repo and make changes in your own fork.
2. Commit your changes and push to your fork `git push origin master`
3. Create a new pull request and submit it back to the project.