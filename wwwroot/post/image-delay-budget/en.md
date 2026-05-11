---
title: "Image Delay Budget"
date: "2025-12-02"
author: "Kai Lin"
tags:
  - "latency"
  - "systems"
  - "operations"
excerpt: "A technical product note on deciding how much delay a public image can tolerate."
image: "https://commons.wikimedia.org/wiki/Special:FilePath/Solar_observatory_control_room.jpg"
---

# Image Delay Budget

![Image Delay Budget](https://commons.wikimedia.org/wiki/Special:FilePath/Solar_observatory_control_room.jpg)

The display can tolerate delay if it tells the truth about delay. What it cannot tolerate is a fresh-looking stale image.

We set the public badge to fresh under four minutes, delayed under fifteen, and paused after that. The maintainer panel keeps exact seconds, but the wall display uses human categories.

This post gives the demo a more technical middle without requiring code samples to carry the whole article.

## Source Note
Primary image/source: [Solar observatory control room on Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Solar_observatory_control_room.jpg). Public domain or freely licensed media as identified by Wikimedia Commons.
