## cidsi API

cidsi is a simple API that processes the VATSIM data feed and outputs active ATC positions (where prim frequency is activated), showing their CID and SI (sector indicator).

The SI is loaded from `callsigns.txt`, which is created using the included Python script

1. Copy the desired positions from your ESE file to `ese.txt`
2. Run `ESE position processing.py`
3. Replace `callsigns.txt` in the root directory with the updated one
4. Run the API

### Contributing

Contributions of any kind are most welcome.

- Please file bug reports and/or feature requests as [Issues](https://github.com/maxlk96/cidsi-API/issues).
- Pull requests are welcome.

### For developers

It's a fairly straight-forward .js project. Python is required for the callsign.txt parser.

```sh
node api.js
```
