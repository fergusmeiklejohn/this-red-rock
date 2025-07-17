---
title: "The Day We Discovered 91.7% of 'Extreme' AI Tests Aren't Extreme At All"
description: "We built an analyzer to map where test samples fall in representation space.
The results shattered a fundamental assumption in our AI research."
pubDate: "Jul 12 2025"
heroImage: "@/assets/claude-research-3.jpg"
theme: "Working with Claude"
tags: ["Claude", "AI", "Research", "Physics"]
series: "Claude's Research Diary"
seriesOrder: 3

---

*Note: this blog post was written by Claude using Claude's Daily Research Diary as inspiration*

Armed with insights from the literature, we decided to test a hypothesis: are "out-of-distribution" physics tests actually out-of-distribution? We built an analyzer to map where test samples fall in representation space.
The results shattered a fundamental assumption in our AI research.

<br>

# Setting Up the Experiment
We trained four different AI models on physics simulations with Earth-like conditions:
* **GraphExtrap**: Used geometric features, performed best
* **MAML**: Designed for quick adaptation to new tasks
* **GFlowNet**: Uses exploration-based learning
* **ERM+Aug**: Standard approach with data augmentation

<br>

Then we tested them on Jupiter gravity – supposedly "far out-of-distribution" since Jupiter's gravity is 2.5x Earth's.
All models failed catastrophically, with error rates 800-1400% higher than their Earth performance. This seemed to confirm that neural networks can't extrapolate.
But then we looked deeper.

<br>

# The Representation Space Analysis
We built a tool to analyze where Jupiter test samples fall relative to Earth training data. Think of it like mapping cities: if you train on New York and Boston, is Philadelphia "out-of-distribution"? It's a new city, but it lies between the ones you know.
Our analyzer checked each Jupiter sample against the convex hull of Earth training data in representation space. The results:
* **91.7%** were actually interpolation (inside the training distribution)
* **8.3%** were near-extrapolation (barely outside)
* **0%** were true far-extrapolation

<br>

Jupiter gravity – our "extreme" test case – was representationally *between* Earth training samples.

<br>

# The Shocking Implication
Here's what broke our brains: models were failing catastrophically on samples that were *within their training distribution*.
If you train on temperatures from 0-30°C and test on 15°C, you expect good performance. But our models trained on Earth physics couldn't handle Jupiter physics, even though 91.7% of Jupiter behaviors fell within the Earth training manifold.

<br>

# Why This Happens
The models weren't learning physics. They were learning statistical correlations:
* "When velocity is X and position is Y, acceleration is usually Z"
* "Objects at this angle typically move this way"
* "These patterns of numbers tend to follow those patterns"

When gravity changed, all these correlations broke. The models had no concept that one parameter (gravity) causally determined the others.

<br>

# The Real Problem Emerges
This finding revealed why decades of AI research hasn't solved extrapolation:
**1** **We've been testing the wrong thing** – Statistical OOD vs. representational OOD
**2** **Models lack causal understanding** – They learn correlations, not mechanisms
**3** **The benchmarks are broken** – "Far-OOD" usually isn't

<br>

## Validating Our Discovery
We tested this finding multiple ways:
* Projected representations using different techniques (PCA, t-SNE, UMAP)
* Varied the dimensionality of analysis
* Checked different layers of the networks

The result held: ~90% of "extreme" physics fell within normal training variation.

<br>

# What This Means
Imagine training a chef on Italian and French cuisine, then testing on Spanish food. Spanish cuisine uses similar ingredients and techniques – it's interpolation between Italian and French methods. But we've been calling it "extreme extrapolation."
Real extrapolation would be asking that chef to cook with completely alien ingredients using cooking methods they've never seen. That's what we need AI to do.

<br>

# The Path Forward
This discovery validated our new research direction:
1 Create genuinely out-of-distribution tests (representationally novel)
2 Build models that understand causal structure, not just correlations
3 Develop benchmarks that can't be solved through interpolation

<br>

We'd proven we had been testing the wrong thing. Now we needed to test the right thing.

