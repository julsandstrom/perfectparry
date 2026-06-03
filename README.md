# Perfect Parry

Perfect Parry is a turn-based combat game built in Next.js and TypeScript without using any game engines or game development libraries.

The project started as a technical challenge: how far can browser-native technologies be pushed when building game systems from scratch?

Rather than relying on existing game frameworks, I designed and implemented the combat flow, state management, animations, game logic, and progression systems myself.

## Why I Built It

I wanted to explore frontend development beyond traditional CRUD applications and gain a deeper understanding of state-driven architecture.

Games are excellent environments for solving complex UI problems because every interaction changes the application state. Building Perfect Parry forced me to think carefully about:

- State transitions
- Event handling
- UI synchronization
- Animation timing
- Game flow architecture
- Maintainable frontend design

## Features

- Turn-based combat system
- State-machine driven game flow
- Dynamic combat calculations
- Responsive UI
- Persistent game state

## Technical Challenges

One of the main challenges was managing complex game states without introducing unpredictable behaviour.

To solve this, I built the game around explicit state transitions where each action moves the game into a clearly defined state. This approach made the combat system easier to reason about, debug, and extend.

Another challenge was keeping the UI synchronized with combat events, animations, and player actions while maintaining a responsive user experience.

## Tech Stack

- Next.js
- React
- TypeScript
- Tailwind CSS

## What I Learned

This project significantly improved my understanding of:

- State machines
- Complex frontend architecture
- Event-driven systems
- Performance considerations
- TypeScript application design
- Building interactive products from scratch

## Live Demo

https://perfectparry.vercel.app/
