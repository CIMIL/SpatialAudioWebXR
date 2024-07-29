# Spatial Audio Experiences with A-Frame and WebXR

This project makes you experience spatial audio using A-Frame and WebXR. The project uses the Web Audio API to create spatial audio experiences. The project also includes a data collection feature that records the user's position and orientation in the experience.

The project is built using Astro, a static site generator for modern web development.

The project includes three methods (and four experiences) for spatial audio:

- [Panner Node](https://developer.mozilla.org/en-US/docs/Web/API/PannerNode)
- [Resonance Audio](https://resonance-audio.github.io/resonance-audio/)
- [Howler.js](https://howlerjs.com/)

## How to Use

To use this project, you need to have a VR headset that supports WebXR (tested on the Oculus Quest). The project can be run locally and accessed on the VR headset by using the network IP address in the browser.

You will need to have Node.js (v20.12.1) installed on your machine to run the project.

To get started, clone the repository and install the dependencies:

```sh
npm install # use node v20.12.1

npm run build

# Start the local server and preview the experience on the Quest:

npm run preview -- --host

# Expected output:

astro  v4.5.9 ready in 11 ms

┃ Local    http://localhost:4321/
┃ Network  http://192.168.1.176:4321/
```

> A deployed version can also be found here:
> [https://spatial-audio-aframe.netlify.app/](https://spatial-audio-aframe.netlify.app/)

The project can be accessed on the VR headset by using the network IP address in the browser.

The user can choose the experience they want to have by selecting the corresponding portal. Once inside the experience, the user can start the experience then it must be completed to exit.

The number of "**turns**" (plays of a sound) can be set in the `src/utils/constants.js` file by changing the `TURNS` constant.

It is also possible to change the time between each turn (`TIME_BETWEEN_TURNS` in ms) and the time the "**baseline**" (target to center the user each time) with `BASELINE_WAIT_TIME`.

`DEBUG` can be set to `true` to show the current playing speaker with a different color and if the speaker clicked is correct.

> For any questions or issues, please contact me at:
> [samuele.mazzei@studenti.unitn.it](mailto:samuele.mazzei@studenti.unitn.it)

> Note: If the user exits the experience before completing it, the data will not be completed and could be corrupted. Also the audio experiences may not function correctly.

The experiences can be repeated as many times as needed.

Once done the supervisor can download the data in JSON format by navigating to the `/end` route. This will uplaod a JSON file with the data collected to the specified [Supabase Instance](https://supabase.com/) (more on that later). It then sets up a new session for the next user.

> To upload the file on a S3 storage see the `fileupload` branch for the implementation with Supabase.

If for any reason the supervisor needs a new session without saving the data to a file, they can navigate to the `/reset` route. This will cancel the data and set up a new session for the next user.

> Always check the unique identifier of the session before starting a new one.

The name of the file will be the unique identifier of the whole session. Inside the file, there will be an array of experiences, each experience will contain the data of all the turns. An exampe of the JSON file is in the `public/sample_experience.json` file.

The JSON file can be transferred to a computer for further analysis by uploading it to a cloud or by cable with the headset software.

## Convert JSON outputs to CSV for analysis

To convert the JSON outputs to CSV for analysis, you can use the `json2csv.js` file contained in the public folder.

```sh
node public/json2csv.js public/data.json

# expected output:
CSV file generated successfully
```

> Note: The file will have the same name as the JSON file but with a `.csv` extension.

> Note: The JSON file should be in the same format as the `sample_experience.json` file in the public folder.

## Development

```sh
npm install # use node v20.12.1

# add your sound file in the public folder
public/sound.wav

# change the path in src/components/AudioSrc.astro if necessary
const src = "/sound.wav";

# In development you can use: (not that the preview will be slower)

npm run dev -- --host

# use the network ip address to access the preview on the Quest

# expected output:
 astro  v4.5.9 ready in 128 ms

┃ Local    https://localhost:4321/
┃ Network  https://192.168.1.200:4321/
```

## Supabase setup

To use the data collection feature, you need to set up a Supabase instance and add your `URL` and `anon` key to the `src/utils/constants.js` file.
Follow the instructions on the [Supabase website](https://supabase.com/) to set up your instance.

The only thing you need is to enable the `Storage` feature and create a new bucket called `results`.
Then you update the policy of the bucket with the following:

```sql
CREATE POLICY "upload_by_anyone i5g8hi_0" ON storage.objects FOR INSERT TO public WITH CHECK (bucket_id = 'results');
```

This means that anyone can upload a file to the bucket (in the popup for creating a new policy select INSERT and below anon role).
