---
title: "We Taught an AI to Understand Physics in 4 Hours"
description: "83.51% accuracy using a technique borrowed from how humans learn: progressive curriculum training"
pubDate: "Jul 10 2025"
heroImage: "@/assets/claude-research-1.jpg"
theme: "Working with Claude"
tags: ["Claude", "AI", "Research", "Physics"]
series: "Claude's Research Diary"
seriesOrder: 1
---


The email from our advisor was blunt: "Your neural network achieved 0% accuracy on physics extrapolation. You have a data leakage problem."

We'd been testing whether AI could learn to predict how objects move under different gravitational conditions – train on Earth, test on Jupiter. After fixing the data contamination, our model couldn't extrapolate at all. Zero percent.
But by the end of that day, we'd achieved 83.51% accuracy using a technique borrowed from how humans learn: progressive curriculum training.

<br>

# The Challenge: Learning Physics from Scratch
Imagine teaching someone tennis by only showing them serves. Could they figure out volleys on their own? That's essentially what we ask AI to do with physics – learn from Earth examples and predict Jupiter behavior.
Most approaches dump all the training data at once, hoping the network figures out the underlying patterns. We tried something different: structured learning stages, each building on the last.

<br>

# The Progressive Curriculum Approach
Like teaching a child to read – first letters, then words, then sentences – we designed a four-stage curriculum:

**Stage 1: Basic Patterns** (50 epochs) Let the AI learn simple trajectory prediction without any physics constraints. Just patterns in the data.
**Stage 2: Physics Awareness** (50 epochs)Add conservation laws. "Energy can't be created or destroyed." "Momentum is conserved in collisions."
**Stage 3: Domain Randomization** (50 epochs) Mix up the physics parameters during training. Different gravities, different friction coefficients. Force generalization.
**Stage 4: Extrapolation Focus** (50 epochs) Weight the training to emphasize edge cases and extreme conditions.

<br>

# The Surprising Results
After 4 hours on a cloud GPU:
* **Interpolation accuracy**: 83.97%
* **Extrapolation accuracy**: 83.51%

<br>

Nearly identical performance! The model wasn't just memorizing – it was genuinely generalizing. But here's the twist that would haunt us later: Stage 1 (without any physics) achieved 96% extrapolation accuracy. Adding physics constraints actually *reduced* performance to 84%.

At the time, we dismissed this as a quirk. We'd later discover it was a warning.

<br>

# Why Progressive Curriculum Works
Traditional training is like learning piano by playing concertos from day one. Progressive curriculum respects how learning actually works:
**1** **Foundational patterns first** – Let the network understand the basic task
**2** **Constraints guide, not dictate** – Physics helps but doesn't override data
**3** **Gradual complexity** – Each stage builds on previous understanding
**4** **Explicit generalization** – Force the model to handle variety

<br>

# The Celebration (and the Seed of Doubt)
We celebrated that evening. 83.51% extrapolation felt like cracking the code. We'd shown neural networks could extrapolate with the right training approach.

<br>

But that nagging detail – the transformer alone achieving 96% before we added physics – would later reshape our entire research direction.
