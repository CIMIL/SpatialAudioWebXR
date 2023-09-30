<script context="module">
	import 'aframe';
	import 'aframe-look-at-component';
</script>

<script>
	import { onMount } from 'svelte';

	let speakers = [];
	// Function to distribute boxes on the sphere
	function distributeSpeakers(radius) {
		const boxes = [];

		let numberOfSpeakers = 64;
		let numberOfLayers = 8;
		//let layer = 0;
		let numberOfBoxes = 0;
		
		for (let layer = 0; layer < numberOfLayers; layer++) {
			switch(layer) {
				case 0: numberOfBoxes = 1; break;
				case 1: numberOfBoxes = 7; break;
				case 2: numberOfBoxes = 11; break;
				case 3: numberOfBoxes = 13; break;
				case 4: numberOfBoxes = 13; break;
				case 5: numberOfBoxes = 11; break;
				case 6: numberOfBoxes = 7; break;
				case 7: numberOfBoxes = 1; break;
			}

			for (let j = 0; j < numberOfBoxes; j++) {
				boxes.push({
					x:
						radius *
						Math.sin((2 * Math.PI * j) / numberOfBoxes) *
						Math.sin((Math.PI * layer) / numberOfLayers),
					y: radius * Math.cos((Math.PI * layer) / numberOfLayers),
					z:
						radius *
						Math.cos((2 * Math.PI * j) / numberOfBoxes) *
						Math.sin((Math.PI * layer) / numberOfLayers)
				});
			}
		}
		
		/*
		for (let i = 0; i < numberOfLayers; i++) {
			if (layer === 0 || layer === numberOfLayers) {
				// place one box on each pole
				boxes.push({
					x: 0,
					y: radius * Math.cos((Math.PI * layer) / numberOfLayers),
					z: 0
				});
			}
			if (layer === 1 || layer === numberOfLayers - 1) {
				// place 7 boxes on the layers

				for (let j = 0; j < 7; j++) {
					boxes.push({
						x:
							radius *
							Math.sin((2 * Math.PI * j) / 7) *
							Math.sin((Math.PI * layer) / numberOfLayers),
						y: radius * Math.cos((Math.PI * layer) / numberOfLayers),
						z:
							radius *
							Math.cos((2 * Math.PI * j) / 7) *
							Math.sin((Math.PI * layer) / numberOfLayers)
					});
				}
			}
			if (layer === 2 || layer === numberOfLayers - 2) {
				// place 11 boxes on the layers

				for (let j = 0; j < 11; j++) {
					boxes.push({
						x:
							radius *
							Math.sin((2 * Math.PI * j) / 11) *
							Math.sin((Math.PI * layer) / numberOfLayers),
						y: radius * Math.cos((Math.PI * layer) / numberOfLayers),
						z:
							radius *
							Math.cos((2 * Math.PI * j) / 11) *
							Math.sin((Math.PI * layer) / numberOfLayers)
					});
				}
			}
			if (layer === 3 || layer === numberOfLayers - 3) {
				// place 13 boxes on the layers

				for (let j = 0; j < 13; j++) {
					boxes.push({
						x:
							radius *
							Math.sin((2 * Math.PI * j) / 13) *
							Math.sin((Math.PI * layer) / numberOfLayers),
						y: radius * Math.cos((Math.PI * layer) / numberOfLayers),
						z:
							radius *
							Math.cos((2 * Math.PI * j) / 13) *
							Math.sin((Math.PI * layer) / numberOfLayers)
					});
				}
			}
			layer++;
		}*/

		return boxes;
	}

	onMount(() => {
		speakers = distributeSpeakers(10);
	});
</script>

{#each speakers as speaker, i}
	<a-box
		class="box"
		color="green"
		position={`${speaker.x} ${speaker.y} ${speaker.z}`}
		look-at
		key={i}
	>
		<a-entity text={`value: ${i}; align: center; color: white; width: 5`} position="0 0 1" />
	</a-box>d
{/each}

<style>
	.box {
		color: green;
	}
</style>
