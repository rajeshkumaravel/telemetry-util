# Telemetry

### Requirements
- jQuery

### Usage
- Include devconTelemetry.js in html
- Calling telemetry send event (In JS)

```console
new CustomEvent('devcon:telemetry:send', {
  detail: {
    data: { 'a': 'b' },
    method: 'PUT'
  }
});
```