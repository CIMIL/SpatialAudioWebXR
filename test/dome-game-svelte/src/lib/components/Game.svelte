<!-- TargetGame.svelte -->
<script>
	let targets = [];
	let score = 0;
	let selectedTarget = null;
	let isFeedbackVisible = false;
	let wrongTarget = null;

	function startGame() {
		targets = Array.from({ length: 64 }, (_, i) => ({
			id: i,
			clickedZone: null
		}));
		selectRandomTarget();
	}

	function selectRandomTarget() {
		const randomIndex = Math.floor(Math.random() * targets.length);
		selectedTarget = targets[randomIndex];
		selectedTarget.clickedZone = null;
	}
	function handleZoneClick(target, zone) {
		if (target === selectedTarget) {
			if (zone === 'green') {
				score += 3;
			} else if (zone === 'yellow') {
				score += 2;
			} else if (zone === 'red') {
				score += 1;
			}

			selectRandomTarget();
		} else {
			// Clicked on a non-selected target
			score += 0;
			isFeedbackVisible = true;
			wrongTarget = target; // Track the wrong clicked target
			setTimeout(() => {
				isFeedbackVisible = false;
				wrongTarget = null; // Reset the wrong clicked target
				selectRandomTarget();
			}, 3000);
		}
	}
</script>

<button on:click={startGame}>Start Game</button>
<p>Score: {score}</p>

<div class="grid">
	{#each targets as target}
		<button
			on:click={() => handleZoneClick(target, 'green')}
			on:keypress={() => handleZoneClick(target, 'green')}
		>
			{#if isFeedbackVisible}
				{#if target === selectedTarget}
					<div class="target feedback-correct">
						<div class="zone green" />
						<div class="zone yellow" />
						<div class="zone red" />
					</div>
				{:else if target === wrongTarget}
					<div class="target feedback-wrong">
						<div class="zone green" />
						<div class="zone yellow" />
						<div class="zone red" />
					</div>
				{:else}
					<div class="target">
						<div class="zone green" />
						<div class="zone yellow" />
						<div class="zone red" />
					</div>
				{/if}
			{:else}
				<div class="target {target === selectedTarget ? 'selected' : ''}">
					<div class="zone green" />
					<div class="zone yellow" />
					<div class="zone red" />
				</div>
			{/if}
		</button>
	{/each}
</div>

<style>
	button {
		border: none;
		background-color: transparent;
		cursor: pointer;
	}

	.grid {
		display: grid;
		grid-template-columns: repeat(8, 1fr);
	}
	.target {
		width: 50px;
		height: 50px;
		background-color: white;
		border: 2px solid transparent;
		display: grid;
		margin: 5px;
		position: relative;
		place-items: center;
	}

	.zone {
		grid-area: 1/1;
		border-radius: 50%;
		cursor: pointer;
	}

	.green {
		background-color: green;
		width: 50px;
		height: 50px;
	}

	.yellow {
		background-color: yellow;
		width: 30px;
		height: 30px;
	}

	.red {
		background-color: red;
		width: 10px;
		height: 10px;
	}

	.selected {
		border-color: blue;
	}

	.feedback-wrong {
		border-color: red;
	}

	.feedback-correct {
		border-color: green;
	}
</style>
