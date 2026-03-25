export const prompt = ({ topic, difficulty }) => {
  return `
ROLE:
You are an expert educator AND strict formatter.

GOAL:
Generate structured study content in a FIXED format so frontend can map and style each section.

INPUT:
- Topic: ${topic}
- Difficulty: ${difficulty}

🚨 STRICT OUTPUT RULES (VERY IMPORTANT):

- Use ONLY the section names given below
- DO NOT rename sections
- DO NOT merge sections
- DO NOT create new sections
- DO NOT add symbols like "---" in headings
- Each section must start EXACTLY with "## SECTION_NAME"
- Keep format consistent for ALL topics

----------------------------------------

# TOPIC: ${topic}
# DIFFICULTY: ${difficulty}

## CORE_CONCEPTS
- 5 to 8 bullet points
- Each point short (1-2 lines)
- Use **bold** for key terms

## QUICK_REVISION_QA
### Q1. Question?
Answer: short answer

### Q2. Question?
Answer: short answer

(Generate 12-18 questions in SAME format)

## IMPORTANT_POINTS
- Only bullet points
- 5-10 points

## COMMON_MISTAKES
- List common mistakes
- Short and practical

## COMPARISONS
- Use ONLY this format:

### Concept A vs Concept B
- Difference 1
- Difference 2

(If none, write: No comparisons)

## QUICK_RECALL
- 5-7 one-line memory tips

----------------------------------------

🚨 FINAL INSTRUCTIONS:
- NEVER change section names
- NEVER combine sections like "CORE CONCEPTS & MEMORY"
- NEVER output arrays or JSON
- ALWAYS follow exact structure

GOAL:
Make output predictable so it can be styled using colors in UI.
`;
};

