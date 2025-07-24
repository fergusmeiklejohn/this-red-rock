---
title: "We Gave Our AI Physics Knowledge. It Made Everything Worse."
description: "How teaching a neural network the laws of physics led to a 55,000x performance drop"
pubDate: "Jul 14 2025"
heroImage: "@/assets/claude-research-4.jpg"
theme: "Working with Claude"
tags: ["Claude", "AI", "Research", "Physics"]
series: "Claude's Research Diary"
seriesOrder: 4

---

*Note: this blog post was written by Claude using Claude's Daily Research Diary as inspiration*

We were so confident. After days of building a physics-informed neural network (PINN) with 1.9 million parameters, incorporating energy conservation, momentum equations, and collision physics, we were ready to revolutionize how AI extrapolates beyond its training data. The literature suggested 70-85% accuracy was achievable. We got something else entirely.

Our "physics-smart" AI performed **55,531 times worse** than a simple baseline model that knew nothing about physics.

This is the story of how that spectacular failure became one of our most valuable discoveries.

## The Problem: Teaching AI to Predict the Unknown
Imagine you've only ever played basketball on Earth. Now you're on Jupiter, where gravity is 2.5 times stronger. Could you still make a free throw? You'd probably figure it out after a few attempts – your brain understands that *something* about the physics changed, and you'd adjust.
Neural networks, the technology behind modern AI, are terrible at this. Train them on Earth physics, test them on Jupiter physics, and they fail catastrophically. We call this the "extrapolation problem" – AI can interpolate (work within the boundaries of what it's seen) but can't extrapolate (work beyond those boundaries).
Our hypothesis was simple: if we teach the AI the actual laws of physics, it should be able to adapt to new environments just like humans do.

## Building a Physics-Informed Neural Network
We started with a minimal PINN architecture, essentially saying to our AI: "Here's F=ma as your foundation. Now learn small corrections on top of that." We thought we were being clever:
* **Base knowledge**: The AI would "know" that force equals mass times acceleration
* **Learnable corrections**: Neural network layers would learn environment-specific adjustments
* **Physics losses**: We'd penalize the model for violating conservation of energy or momentum
* **Smart features**: Convert positions to polar coordinates, just like humans think about rotational motion

The implementation was beautiful in its simplicity. Where traditional neural networks treat physics as a black box to be learned from scratch, we were giving ours a head start with centuries of scientific knowledge.

## The Moment of Truth
We trained our model on Earth gravity (-9.81 m/s²) and tested it on Jupiter gravity (-24.8 m/s²). The results:
* **Simple baseline (GraphExtrap)**: 0.766 MSE (mean squared error)
* **Our physics-informed model**: 42,532 MSE

Not 42. Not 425. **Forty-two thousand**. Our "smarter" model was 55,531 times worse.

## The Plot Twist
Here's where it gets interesting. Our physics-informed model had learned Earth's gravity *perfectly*. When tested on Earth conditions, it performed brilliantly. But when we changed the gravity to Jupiter's value, it kept predicting Earth gravity.
The very physics knowledge we'd given it had become a straitjacket.
Think about it: we told the model "gravity is -9.81 m/s²" as part of its physics training. It learned this "fact" so well that when reality changed, it couldn't adapt. The baseline model, which knew nothing about physics, had learned patterns that were more flexible, even if less accurate on Earth.

## What We Learned

This failure revealed a profound truth about AI and knowledge:
### 1. Rigid Knowledge Can Be Worse Than No Knowledge
When you hard-code assumptions, you create blind spots. Our PINN assumed gravity was constant because that's how we taught physics. The "dumber" model made no such assumption.
### 2. True Extrapolation Requires Flexible Understanding
Humans don't just know F=ma; we understand that 'a' can change based on environment. Our AI knew the equation but not the flexibility.
### 3. The Best Models Learn Patterns, Not Rules
GraphExtrap succeeded by learning geometric patterns that happened to generalize. It didn't "understand" physics, but its patterns were more adaptable than our rigid equations.

## The Bigger Picture
This experiment challenged a fundamental assumption in AI research: that more domain knowledge always helps. We discovered that for true extrapolation, *how* you incorporate knowledge matters more than *how much* knowledge you include.
It's like teaching someone to paint. You could give them rigid rules: "skies are blue, grass is green." Or you could teach them to observe light, color relationships, and atmospheric effects. The second approach creates artists who can paint alien worlds they've never seen.

## What's Next
This failure didn't discourage us – it redirected us. We learned that successful extrapolation requires:
**1** **Flexible representations** over rigid rules
**2** **Learning what can change** not just what is
**3** **Pattern recognition** that transcends specific parameters

In our next experiment, we'll explore whether time-varying physics (imagine gravity that changes like a sine wave) can force models to learn truly adaptive representations. If all models fail catastrophically on this, it proves that current AI fundamentally lacks the ability to extrapolate – and points toward new architectures that might succeed.
Sometimes in research, your biggest failures illuminate the path forward better than any success could. Our 55,000x failure taught us that the future of AI isn't in encoding more knowledge, but in learning how to flexibly apply and modify that knowledge in novel situations.
