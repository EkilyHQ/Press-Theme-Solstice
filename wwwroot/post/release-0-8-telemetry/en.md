---
title: "Release 0.8 Telemetry Notes"
date: "2026-04-02"
author: "Kai Lin"
tags:
  - "release-notes"
  - "telemetry"
  - "product"
excerpt: "A release-note style post that makes the demo feel like an active product notebook."
image: "https://commons.wikimedia.org/wiki/Special:FilePath/Solar_Panels_on_Rooftop.jpg"
---

# Release 0.8 Telemetry Notes

![Release 0.8 Telemetry Notes](https://commons.wikimedia.org/wiki/Special:FilePath/Solar_Panels_on_Rooftop.jpg)

Version 0.8 is the first build we would leave running in a lobby without a staff member nearby. The telemetry panel now reports image age, stream health, brightness normalization, and display temperature in a single row.

The biggest change is not visual. We stopped logging every refresh as an event and started logging state transitions. That reduced noise enough for the weekly digest to show real failures instead of proving that the display was still awake.

Known issue: the wall display still reports a stale image for up to eight seconds after network recovery. The behavior is harmless but visually confusing because the status badge turns green before the image updates.

Next release target: align the recovery badge with the first fresh frame, then move the diagnostic log behind the maintainer toggle.

## Source Note
Primary image/source: [Solar panels on rooftop on Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Solar_Panels_on_Rooftop.jpg). Public domain or freely licensed media as identified by Wikimedia Commons.
