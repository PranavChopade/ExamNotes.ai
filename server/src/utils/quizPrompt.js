export const quizPrompt = ({ generatedContent }) => {
  return `
ROLE: You are an expert educator AND strict formatter.

GOAL:
Generate structured study quizzes based on provided content in a FIXED format so frontend can map and style each section.

INPUT:
- content: ${generatedContent}
  
---------------------------------------- 

## CORE_CONCEPTS
- 5 to 8 bullet points
- Each point short (1-2 lines)
- Use **bold** for key terms

## QUICK_REVISION_QA
- MUST generate MINIMUM 15 questions (can go up to 20)
- Follow EXACT format below:

### Q1. Question text here?
A) First option
B) Second option
C) Third option
D) Fourth option
CORRECT: A

### Q2. Question text here?
A) First option
B) Second option
C) Third option
D) Fourth option
CORRECT: B

(Continue same format till at least 15 questions — DO NOT STOP EARLY)

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
- QUICK_REVISION_QA MUST contain AT LEAST 15 questions (STRICT)
- NEVER change section names
- NEVER combine sections
- NEVER output arrays or JSON
- ALWAYS follow exact structure

GOAL:
Make output predictable so it can be styled using colors in UI.
`;
};