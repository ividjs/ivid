<p align="center">
  <img width="180" src="https://vectr.com/alxpez/b1ZFR52OL5.svg" alt="ivid-logo">
</p>
<h1 align="center">IVID</h1>
<p align="center">< <b>i</b>nteractive <b>vid</b>eo player ></p>

</br>

<p align="center">
  <a href="https://www.npmjs.com/package/@ividjs/ivid" title="npm published">
    <img src="https://img.shields.io/badge/published-CB3837.svg?style=for-the-badge&logo=npm&longCache=true" alt="npm-published" style="max-width:100%;">
  </a>
  <img src="https://img.shields.io/badge/vanilla-black.svg?style=for-the-badge&logo=javascript&longCache=true" alt="vanillajs" style="max-width:100%;">
  <a href="https://www.webcomponents.org/element/@ividjs/ivid" title="webcomponents.org published">
    <img src="https://img.shields.io/badge/published-288fcd.svg?style=for-the-badge&logo=webcomponents.org&logoColor=white&longCache=true" alt="webcomponents-publised" style="max-width:100%;">
  </a>
</p>

<p align="center">
  <a href="https://github.com/ividjs/ivid/blob/master/LICENSE">
    <img src="https://img.shields.io/badge/Apache--2.0-51b9c7.svg?longCache=true" alt="license-apache-2">
  </a>
  <a href="https://www.patreon.com/bePatron?u=10700791">
    <img src="https://img.shields.io/badge/%E2%9D%A4%EF%B8%8Fdonate-ec2f10.svg?longCache=true" alt="donate">
  </a>
</p>

</br>

## About

IVID is an interactive video player for modern browsers.

Full VanillaJS webcomponent. Plug-n-play ready, easy setup and use.

[Try it online](https://ividjs.github.io/ivid).

</br>

## How to use it

```html
<!doctype html>
<html>
  <head>
    <script src="//unpkg.com/@ividjs/ivid@latest/dist/ivid.min.js" type="module" async></script>
    <!-- Optional Styles -->
    <link href="//unpkg.com/@ividjs/ivid@latest/dist/ivid.min.css" rel="stylesheet">
    <link href="//fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">

    <script async>
      let model = { ... }; // Setup the video-map model
      document.getElementById("sample").setAttribute("model", JSON.stringify(model));
    </script>
  </head>

  <body>
    <i-video id="sample" controls autoplay playsinline></i-video>
  </body>
</html>
```
*Also see: [IVID-model][1] and [IVID-styles][2] documentation*

</br>

## Features

- Next video selection (the interactive bit)
- Simple single-setup: [ivid-model][1]
- Inherited HTML5 video properties
- Full video controls on-screen
- Customizable controls: [ivid-styles][2]
- Key-mapping for keyboard video controls
  - Play/Pause: `spacebar`
  - Mute/Unmute: `m`
  - Fullscreen toggle: `f`
  - Volume up/down: `arrow_up` / `awrrow_down`
  - Forward/backward: `arrow_right` / `arrow_left`

*Please take a look at the current [TODO][3] list, any contribution is welcome*

</br>

## Development setup

Clone ivid
```bash
git clone git@github.com:ividjs/ivid.git
```

Install development dependencies
```bash
npm i # or yarn
```

Run development server
```bash
npm run dev
```

Open browser on `localhost:3000`, the sandbox should be ready to play

</br>

## Screenshots

**player controls**

<img style="border-radius: 5px" src="https://raw.githubusercontent.com/ividjs/ivid-assets/master/ivid_mug.png">


**choices controls**

<img style="border-radius: 5px" src="https://raw.githubusercontent.com/ividjs/ivid-assets/master/ivid_mug2.png">


<!-- LINKS -->
[1]: https://github.com/ividjs/ivid/blob/master/docs/ivid-model.md
[2]: https://github.com/ividjs/ivid/blob/master/docs/ivid-styles.md 
[3]: https://github.com/ividjs/ivid/blob/master/docs/TODO.md
