## Development

```sh
npm i

# add your sound files in the public folder
public/sound.wav
# change the path in src/components/AudioSrc.astro
const src = "/sound.wav";

npm run build
npm run preview -- --host

# use the network ip address to access the preview on the Quest

# expected output:
 astro  v4.5.9 ready in 128 ms

┃ Local    https://localhost:4321/
┃ Network  https://192.168.1.200:4321/
```

A deployed version can be found here:
[https://spatial-audio-aframe.netlify.app/](https://spatial-audio-aframe.netlify.app/)
