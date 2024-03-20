## Development

```sh
npm i

# add your sound files to the public folder
public/cow.wav
# change the path in the html
audio src="/cow.wav"

npm run build

Preview:

npm run preview -- --host

Test:

npm run dev -- --host

# use the network ip address to access the preview on the Quest

# expected output:
 VITE v4.5.0  ready in 224 ms

  ➜  Local:   https://localhost:5173/
  ➜  Network: https://192.168.1.114:5173/
```

A deployed version can be found here:
[https://pannernode-aframe.netlify.app/](https://pannernode-aframe.netlify.app/)
