<script context="module">
	import 'aframe';
</script>

<script>
	import Dome from '$lib/components/Dome.svelte';
</script>

<a-scene>
	<a-entity camera look-controls position="0 1.6 0" />
	<!-- Sphere around the player -->
	<a-sphere id="sphere" radius="11" color="gray" material="side: double" />
	<a-box
		width="1"
		height="0.1"
		depth="1"
		color="transparent"
		material="side: double; color: red; opacity: 0.1"
	/>
	<Dome />
</a-scene>
