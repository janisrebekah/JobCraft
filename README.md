# AI-Powered Skill Gap Analyzer & Learning Roadmap

An intelligent web application that analyzes user skills, identifies gaps, and generates personalized project briefs and learning roadmaps using Generative AI.

---

## Overview

This project leverages Generative AI to help users:

- Identify skill gaps based on their current knowledge  
- Generate tailored project ideas to bridge those gaps  
- Build structured learning roadmaps  
- Export learning plans as PDFs  

Designed for learners, developers, and career switchers who want a data-driven, AI-guided growth plan.

---

## Features

### Skill Gap Analysis
- Evaluates user input skills  
- Identifies missing competencies  
- Suggests improvement areas  

### Personalized Project Briefs
- AI-generated project ideas  
- Tailored to user skill level and goals  
- Helps build real-world portfolio  

### Learning Roadmap
- Step-by-step structured learning path  
- Covers concepts, tools, and milestones  

### Persistence
- Uses `localStorage` to save user data  
- No backend required for basic usage  

### Export Functionality
- Generates downloadable PDFs using `jsPDF`  

---

## Tech Stack

| Layer        | Technology |
|-------------|-----------|
| Frontend    | React 19 |
| Language    | TypeScript |
| AI Engine   | Google Gemini API |
| Storage     | localStorage |
| Export Tool | jsPDF |

---
Installation
- npm install

---
Environment Setup
- Create a .env.local file in the root directory:
- GEMINI_API_KEY=your_api_key_here

---

Run the App
- npm run dev
