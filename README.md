## Project Title

GBDA302 Week 9 Side Quest: JSON Maze Escape (Debug & Game States)

---

## Authors

Fiona Luo

---

## Description

This sketch builds upon the previous grid-based maze game by introducing a complete game state machine (Start, Play, Game Over, Win) and a dynamic floating Developer Debug Menu. It also features procedural obstacle generation, adding a 20% chance for new walls to spawn in empty spaces, ensuring every playthrough across the 5 stages is unique.

---

## Learning Goals


- Implementing a state machine (`gameState` variable) to manage different UI screens (Start, Playing, Game Over, Win) 
  and control player interaction.
- Creating a toggleable HUD (Heads-Up Display) for developer debugging using `push()` and `pop()` for isolated styling.
- Binding specific developer tools (No-Clip, Force State Change) to keyboard inputs while in debug mode.
- Dynamically modifying data fetched from a JSON file by iterating through 2D arrays and using `random()` to generate procedural 
  obstacles on the fly.
- Maintaining the "lerp()" smooth movement and particle systems from previous iterations while adding new layers of game logic.

Important Concepts:

- levels.json acts as the "blueprint" storing the map design, while sketch.js acts as the "engine" that processes that data. 
- This separation allows us to create new levels just by editing a text file, without touching the game code.

---

## Assets

N/A

---

## GenAI

1. I used GenAI to structure the `gameState` logic to seamlessly transition between the Start, Play, Game Over, and Win screens.
2. I used GenAI to design and implement the floating Developer Debug Menu, including the logic for the No-Clip mode and the Forced 
   Game Over state.
3. I used GenAI to write the logic for the random obstacle generator, separating the static JSON blueprint from the active, randomized grid.
4. I used GenAI to map out the 5 progressively difficult level layouts in the `levels.json` file to fulfill the Bonus Challenge.

---
