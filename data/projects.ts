export interface Project {
  name: string
  description: string
  role: string
  technologies: string[]
  image: string
  content: string
  url?: string
  code?: string
  paper?: string
}

const projects: Project[] = [
  {
    name: "Dashboard monitoring agriculture Indonesia",
    description: "Monitor Indonesia's agricultural conditions and predict crop yields through AI-based data analysis.",
    role: "data management",
    technologies: ["Tableau", "Deep Learning", "Forecasting", "Data Mining"],
    image: "/projects/dasbor-analitik.png",
    content: `
## Overview
This project analyzes agricultural data in Indonesia and applies deep learning models to predict future trends.

- Built dashboards with Tableau
- Integrated deep learning models for prediction
    `
  },
  {
    name: "Project Gastronomi",
    description: "AI project focusing on food culture.",
    role: "developer",
    technologies: ["Django", "Flutter", "Website", "Chatbot"],
    image: "/projects/lombokeats.png",
    content: `
## Overview
Building an AI-powered platform for exploring gastronomic culture with chatbot integration and mobile support.
    `
  },
  {
    name: "Personal website",
    description: "Portfolio website with retrieval-based chatbot and blog using MDX.",
    role: "solo developer",
    technologies: ["Next js", "Typescript", "Llama", "Tailwind", "PostgreSQL"],
    image: "/projects/personal-website.png",
    url: "https://www.wahyuikbal.web.id",
    code: "https://github.com/wahyudesu/Personal-Website-Next-js-Obsidian-Ai-",
    content: `
## Overview
A full-featured personal portfolio and blog with AI chatbot for answering questions based on my content.
    `
  },
  {
    name: "Document summarization",
    description: "LLM-powered document summarization using Next.js and Llama.",
    role: "project leader",
    technologies: ["Next js", "Tailwind CSS", "Llama 3", "LLM"],
    image: "",
    code: "https://github.com/wahyudesu/Next-js-PDF-Summarization/",
    content: `
## Overview
Summarizes uploaded documents using large language models. Final project for Text Mining.
    `
  },
  {
    name: "Monitoring Stunting Webapp",
    description: "Generative AI to prevent and monitor stunting in babies.",
    role: "team leader",
    technologies: ["Streamlit", "Generative AI", "Neon tech"],
    image: "",
    url: "https://stuntron.streamlit.app",
    code: "https://github.com/wahyudesu/healthkathon-ai",
    content: `
## Overview
Developed during Healthkathon AI 2024. Used AI to assist parents and health workers in stunting prevention.
    `
  },
  {
    name: "Malware prediction project",
    description: "Classifying malware using ensemble learning techniques.",
    role: "ml engineer",
    technologies: ["Machine learning", "Ensemble", "Python"],
    image: "",
    code: "https://github.com/wahyudesu/malware-detection",
    content: `
## Overview
Applied ensemble models to malware datasets to predict potential threats.
    `
  },
  {
    name: "Guess The Word game",
    description: "Word guessing game using NLP and cosine similarity.",
    role: "nlp engineer",
    technologies: ["Streamlit", "Vector Embeddings", "Text Similarity", "Python", "Glove ID"],
    image: "",
    code: "https://github.com/Community-of-Playground/Gemastik-Pengembangan-Aplikasi-Permainan",
    content: `
## Overview
Developed for Gemastik. Fun game powered by NLP and Indonesian GloVe vectors.
    `
  },
  {
    name: "CNN Rock Scissor Paper",
    description: "Image classification project for game prediction using CNN.",
    role: "student",
    technologies: ["Python", "Tensorflow", "Computer Vision"],
    image: "",
    code: "https://github.com/wahyudesu/Dicoding-rock-scissor-paper",
    content: `
## Overview
Image-based Rock-Scissor-Paper prediction using TensorFlow CNN model.
    `
  },
  {
    name: "Bambubot: Chatbot Kelurahan Keputih",
    description: "Chatbot for document management in Keputih urban village.",
    role: "AI Engineer",
    technologies: ["Python", "LLM", "Telegram", "Langchain"],
    image: "/projects/bambubot.png",
    content: `
## Overview
Built with Langchain and Telegram API. Helped community services to improve communication.
    `
  },
  {
    name: "Life expectancy analysis",
    description: "Linear regression analysis on life expectancy data.",
    role: "data analyst",
    technologies: ["Python", "streamlit"],
    image: "",
    code: "https://github.com/wahyudesu/Life-expectancy-analysis",
    paper: "https://github.com/wahyudesu/Life-expectancy-analysis/blob/main/Document/3323600056_Wahyu%20Ikbal%20Maulana_Regresi%20Linier%20Berganda.pdf",
    content: `
## Overview
Final project using linear regression to understand life expectancy trends across countries.
    `
  },
  {
    name: "Anime recommendation web app",
    description: "Anime recommendation system with machine learning.",
    role: "ml engineer",
    technologies: ["Next js", "Machine learning"],
    image: "",
    code: "https://github.com/mozaldy/wamonime",
    content: `
## Overview
Web-based anime recommendation engine using ML-based similarity matching.
    `
  },
  {
    name: "Forecasting Indonesia renewable energy",
    description: "Forecast renewable energy growth in Indonesia using ARIMA.",
    role: "data scientist",
    technologies: ["Python", "Machine learning", "ARIMA"],
    image: "",
    code: "https://github.com/wahyudesu/ARIMA-Analysis-in-Energy-SDGs-7-Indonesia",
    paper: "https://github.com/wahyudesu/ARIMA-Analysis-in-Energy-SDGs-7-Indonesia/blob/main/Makalah%20Journal%20ARIMA%20Forecasting.docx",
    content: `
## Overview
Final statistics project focused on SDGs and forecasting with time series ARIMA model.
    `
  },
  {
    name: "Data Engineering dashboard System",
    description: "Visualize and manage ETL workflows using Flask and Airflow.",
    role: "data engineer",
    technologies: ["Flask", "Airflow", "Docker"],
    image: "",
    code: "https://github.com/AfifH07/LastProjectProgramming",
    content: `
## Overview
A project that integrates data pipelines and monitoring system using Airflow.
    `
  },
  {
    name: "Dashboard d3js",
    description: "Sales dashboard with multiple charts and insights.",
    role: "frontend developer",
    technologies: ["Vite", "React", "d3js", "Magic UI", "shdcn ui"],
    image: "",
    code: "https://3323600056-wahyuikbalmaulana-dashboard-d3js.vercel.app",
    content: `
## Overview
Visualizes key business metrics using interactive charts and maps built with d3.js.
    `
  },
]

export default projects
