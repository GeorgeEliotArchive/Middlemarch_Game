# Middlemarch: The Paths Not Taken
## An Interactive Decision Game for Students and Scholars

**Created by:** Dr. Beverley Park Rilett & Claude (Anthropic)  
**For:** George Eliot Archive, Auburn University  
**License:** CC BY-NC-SA 4.0

---

## About This Game

This interactive web game allows students and readers to explore the cascading decisions that shaped the lives of three main characters in George Eliot's *Middlemarch*:

1. **Dorothea Brooke** - From idealistic youth through disastrous marriage to redemption through love
2. **Tertius Lydgate** - An ambitious doctor's tragic fall through pride and circumstance  
3. **Fred Vincy** - A young man's redemption through honest work and character growth

### Two Play Modes:

**📝 Quiz Mode**
- Test your knowledge of the novel's canonical path
- Earn points for choosing what actually happened
- Perfect for classroom assessment

**🎭 Exploration Mode**
- Create alternative narratives  
- See what might have been if characters made different choices
- Includes "Reveal What Actually Happened" feature
- Educational reflections on why certain paths succeed or fail

---

## Educational Framework

The game is built on scholarly insights about Eliot's psychological realism and moral philosophy:

### Key Themes Explored:

1. **Marriage Requires Three Elements:** Desire + Respect + Friendship
   - Missing any one leads to unhappiness
   - Examples: Dorothea/Casaubon, Lydgate/Rosamond, Dorothea/Will

2. **The Power of True Friendship:**
   - Camden Farebrother's moral goodness
   - Caleb Garth's forgiveness and mentorship
   - Dorothea and Lydgate's profound bond (the pairing readers want but can't have)
   - Rosamond's redemptive moment of female friendship

3. **Cascading Errors and Their Consequences:**
   - How good people make mistakes that compound
   - The difference between redemption (Dorothea, Fred) and ruin (Lydgate)

4. **The Path Not Taken:**
   - Why didn't Dorothea and Lydgate marry after Casaubon's death?
   - Eliot's answer: Friendship + Respect - Desire = Not Enough

---

## Decision Point Structure

Each storyline contains **binary (Yes/No) decisions** phrased as:

**"Will [Character] [make this choice]?"**

This honors the dramatic irony - students often know the characters are making mistakes, which is part of Eliot's genius.

### Example Decision:

**Chapter 27 - Lydgate's Entrapment**
> "When Rosamond begins to cry and manipulates his sympathy, will Lydgate comfort her?"
> 
> - **Yes** (Canonical): He comforts her and finds himself suddenly engaged. His actions betray his intentions. The trap closes.
> - **No** (Alternative): He resists and leaves before doing something rash.

---

## Technical Details

### Files Included:

1. **index.html** - The game interface (single-file React application)
2. **game-data.json** - All 44 decision points with context and themes
3. **README.md** - This file
4. **LICENSE.txt** - CC BY-NC-SA 4.0 license

### Requirements:

- Modern web browser (Chrome, Firefox, Safari, Edge)
- No server required for local testing
- Can be hosted on any static web host

### Technologies Used:

- React 18 (loaded via CDN)
- Vanilla CSS with custom properties
- Victorian-inspired typography (Cormorant Garamond, EB Garamond)
- No build process required

---

## Installation & Deployment

### Option 1: Local Testing

Simply open `index.html` in your web browser. That's it!

### Option 2: GitHub Pages (Recommended)

1. Create repository: `GeorgeEliotArchive/middlemarch-game`
2. Upload all files
3. Go to Settings → Pages
4. Select "Deploy from main branch"
5. Game will be live at: `https://georgeeliotarchive.github.io/middlemarch-game/`

### Option 3: Embed in Omeka

Add this iframe to your Omeka page:

```html
<iframe 
  src="https://georgeeliotarchive.github.io/middlemarch-game/" 
  width="100%" 
  height="900px" 
  frameborder="0"
  style="border: none; max-width: 1400px; margin: 0 auto; display: block;">
</iframe>
```

---

## Customization Guide

### Changing Colors:

Edit the CSS variables in `index.html` (lines 10-17):

```css
:root {
  --parchment: #f4ebe1;  /* Background */
  --ink: #2c1810;         /* Text color */
  --sepia: #8b7355;       /* Borders */
  --gold: #c9a961;        /* Accents */
  --burgundy: #6d2932;    /* Headers */
  --sage: #7a8b72;        /* Canonical choices */
}
```

### Adding/Editing Decisions:

Edit `game-data.json`. Each decision follows this structure:

```json
{
  "id": "d01",
  "chapter": 3,
  "storyline": "dorothea",
  "importance": "major",
  "character": "Dorothea Brooke",
  "location": "Tipton",
  "decision": "Will Dorothea encourage Mr. Casaubon's visits?",
  "context": "Full context paragraph...",
  "themes": ["Idealism", "Self-deception"],
  "canonical_answer": "yes",
  "choices": {
    "yes": {
      "text": "Yes - encourage his visits",
      "is_canonical": true,
      "consequence": "Her fascination grows...",
      "leads_to": "d02"
    },
    "no": {
      "text": "No - maintain distance",
      "is_canonical": false,
      "consequence": "Alternative path..."
    }
  }
}
```

---

## Classroom Use

### Suggested Activities:

1. **Pre-Reading:** Use Quiz Mode to introduce key plot points and characters

2. **During Reading:** 
   - Pause at each decision point in the text
   - Discuss in class before seeing the canonical choice
   - Compare predictions to what actually happens

3. **Post-Reading:**
   - Use Exploration Mode to write alternative endings
   - Creative writing: "What if Dorothea had refused Casaubon?"
   - Analytical essays: "Why Eliot's marriage formula matters"

4. **Assessment:**
   - Quiz Mode scores can track textual knowledge
   - Path summaries can be downloaded (future feature)
   - Discussion questions built into reflection pages

### Learning Objectives:

- Understand character psychology and motivation
- Recognize patterns of cause and effect in narrative
- Analyze Eliot's themes about marriage, friendship, and redemption
- Practice close reading and textual evidence
- Engage with "what if" scenarios to deepen understanding

---

## Future Enhancements (Roadmap)

### Phase 2: AI-Powered Alternative Paths
- Integrate Claude API to generate dynamic consequences for non-canonical choices
- Students see unique, contextual responses to their decisions
- Requires API key (provided by instructor)

### Phase 3: Student Features
- **Download Path PDF:** Export student's choices as a formatted document
- **Writing Prompts:** Generate creative writing assignments based on chosen path
- **Comparison Mode:** Side-by-side view of canonical vs. alternative paths

### Phase 4: Analytics & Assessment
- Track which decisions students find most difficult
- Heat map of common mistakes
- Export quiz results for grading
- Discussion forum integration

### Phase 5: Additional Content
- Add minor character decision trees (Bulstrode, Rosamond, Mr. Brooke)
- Timeline visualization showing how decisions interconnect
- Character relationship map that updates based on choices
- Historical context annotations (1830s England, Reform Bill, etc.)

---

## Credits & Acknowledgments

**Scholarly Expertise:**  
Dr. Beverley Park Rilett, George Eliot Archive, Auburn University

**Decision Tree Development:**  
Collaborative work between Dr. Rilett and Claude (Anthropic AI)

**Data Sources:**
- Chapter summaries from George Eliot Archive
- Character data from verified scholarly sources
- Text from Cabinet Edition (1878)

**Special Thanks:**
- Auburn University students who tested early versions
- George Eliot Archive contributors
- The Middlemarch scholarly community

---

## License & Attribution

This work is licensed under **Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International (CC BY-NC-SA 4.0)**

You are free to:
- Share: Copy and redistribute the material
- Adapt: Remix, transform, and build upon the material

Under these terms:
- **Attribution:** Credit the George Eliot Archive and Dr. Beverley Park Rilett
- **NonCommercial:** Not for commercial use
- **ShareAlike:** Distribute derivatives under the same license

Full license: https://creativecommons.org/licenses/by-nc-sa/4.0/

---

## Support & Contact

**Issues or Questions:**  
- GitHub Issues: [Create an issue](https://github.com/GeorgeEliotArchive/middlemarch-game/issues)
- Email: bdr0032@auburn.edu

**Contribute:**
- Submit pull requests for bug fixes
- Suggest new decision points
- Share classroom experiences
- Propose new features

---

## Version History

**v1.0 (February 2026)**
- Initial release
- 44 binary decision points across 3 storylines
- Quiz and Exploration modes
- Victorian-inspired interface
- Mobile-responsive design

---

*"The growing good of the world is partly dependent on unhistoric acts."*  
— George Eliot, *Middlemarch*
