# Flashcards App Template Documentation

## Excel Template Structure

The flashcards system uses a standardized Excel template with the following columns:

### Required Fields
1. **Question**
   - Contains the flashcard question
   - Required field
   - No length limit

2. **Answer**
   - Contains the flashcard answer
   - Required field
   - No length limit

3. **Set**
   - Unique identifier for the flashcard set
   - Required field
   - Example: "PHA02"

4. **Set order**
   - Determines the order and module grouping
   - Required field
   - Format: "ModuleCode.Number" (e.g., "PH1.2")
   - Used for organizing content:
     - ModuleCode (e.g., "PH") groups sets into modules
     - Number (e.g., "1.2") determines order within module

### Optional Fields
5. **More info**
   - Additional information or context
   - Optional field
   - No length limit

6. **Set Name**
   - Short descriptive name for the set
   - Optional field
   - Maximum 25 characters

7. **Set Description**
   - Detailed description of the set content
   - Optional field
   - Maximum 100 characters

## Usage Guidelines

1. Always maintain the required fields format
2. Follow the set order format strictly: "ModuleCode.Number"
3. Keep set names concise (max 25 characters)
4. Keep set descriptions informative but brief (max 100 characters)
5. Use the More info field for any additional context that might help with learning

## Example Entry

```
Question: What is pharmacokinetics?
Answer: The study of drug movement through the body
Set: PHA02
Set order: PH1.2
More info: See chapter 2
Set Name: Intro to PK
Set Description: Basic concepts of pharmacokinetics and drug absorption
```
