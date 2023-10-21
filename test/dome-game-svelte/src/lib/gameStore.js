// gameStore.js
import { writable } from 'svelte/store';

const createGameStore = () => {
	const { subscribe, update } = writable({
		targets: Array(64).fill({ zone: 0, active: false }), // Array to represent the state of each target
		score: 0 // The player's score
	});

	const resetTargets = () => {
		update((state) => {
			// Reset all targets to false (not active) with zone information
			state.targets = Array(64).fill({ zone: 0, active: false });
		});
	};

	const randomizeTarget = () => {
		update((state) => {
			// Randomly select a target to activate (change its color)
			const randomIndex = Math.floor(Math.random() * 64);
			state.targets[randomIndex] = { zone: Math.floor(Math.random() * 3) + 1, active: true };
		});
	};

	const handleTargetClick = (index) => {
		update((state) => {
			// Check if the clicked target is active (true)
			if (state.targets[index].active) {
				const clickedZone = state.targets[index].zone;
				// Assign points based on the clicked zone
				if (clickedZone === 1) {
					state.score += 50; // 50 points for zone 1
				} else if (clickedZone === 2) {
					state.score += 25; // 25 points for zone 2
				} else if (clickedZone === 3) {
					state.score += 10; // 10 points for zone 3
				}

				// Deactivate the clicked target
				state.targets[index].active = false;
			}
		});
	};

	return {
		subscribe,
		resetTargets,
		randomizeTarget,
		handleTargetClick
	};
};

export const gameStore = createGameStore();
