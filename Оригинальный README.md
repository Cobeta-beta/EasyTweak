# CrossTweak

## About

A lightweight KaiOS tweaker - 10 useful functions packed in one small app that can be used across all KaiOS devices without any rooting or privileged mode.

## Current version

0.0.1

## Current feature list

- `1`: Set a ringtone from arbitrary file (all sources are supported)
- `2`: Set a notification tone from arbitrary file (all sources are supported)
- `3`: Toggle call recording mode (manual/auto/off), works on KaiOS 2.5.2+
- `4`: Attempt to install an application package (OmniSD/GerdaPkg compatible, doesn't work on KaiOS 2.5.3+)
- `5`: Enable developer menu in settings (limited option set is opened by default)
- `6`: Enter the hidden engineering menu (useful on devices where `*#testbox#` code doesn't work)
- `7`: Toggle browser proxy on/off
- `8`: Set browser proxy host and port
- `9`: View or modify any system setting accessible via `MozSettings` interface by entering its name (boolean values are automatically converted)
- `#`: Attempt to run privileged factory reset (on KaiOS 2.5.2.2+, it will most probably run usual reset instead)

## Installation

Use standard WebIDE connection (old Firefox or Pale Moon or current Waterfox Classic) or [gdeploy](https://gitlab.com/suborg/gdeploy) to install the app directly onto your device. No other installation method is currently officially supported as of now.

## Credits

Created and improved by [BananaHackers](https://bananahackers.net) group. Released under public domain.
