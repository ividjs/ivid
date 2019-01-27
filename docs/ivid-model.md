# IVID video-map model

A working example of a model can be found in the [IVID sandbox](../sandbox/index.js).
There you can see a step-by-step video-map modeling and customize the best fit for your case-use.

## Basic setup example

```js
let model = {
  'video_A': {
    uid: 'video_A',
    src: '//url-to-video-a',
    options: {
      fallback: ['video_B'],
      choices: {
        'video_B': '[Choice B caption]',
        'video_C': '[Choice C caption]',
      }
    }
  },

  'video_B': {
    uid: 'video_B',
    src: '//url-to-video-b',
    options: {
      choices: {
        'video_A': '[Choice A caption]',
        'video_C': '[Choice C caption]',
      }
    }
  },

  'video_C': {
    uid: 'video_C',
    src: '//url-to-video-c',
  }
}
```