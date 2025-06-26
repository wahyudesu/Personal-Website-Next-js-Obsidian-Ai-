export interface Project {
  name: string
  description: string
  role: string
  technologies: string[]
  tag: string[]
  image: string
  content: string
  url?: string
  code?: string
  paper?: string
}

const projects: Project[] = [
  {
    name: "RAG Chatbot Multilingual",
    description: "Transforming global communication: a multilingual AI chatbot that breaks language barriers and delivers instant answers from any document.",
    role: "AI Engineer",
    technologies: ["Streamlit", "Llamaindex", "Python"],
    tag: ["AI", "Chatbot", "RAG"],
    image: "/projects/jbcocoa.png",
    content: `
## Client Background
An international coffee export-import company with a diverse workforce and global clientele faced challenges in efficiently sharing internal knowledge and providing timely customer support across multiple languages. The company manages a large repository of documents and resources in various formats, making it difficult for employees and customers to quickly find relevant information. Their operations span several countries, requiring seamless communication and information retrieval in English, Indonesian, French, and Malay.

## Project Overview
The project aimed to develop an intelligent chatbot capable of understanding and responding in multiple languages, while integrating with the company's existing document management system (OneDrive). The chatbot needed to support various file types for knowledge ingestion and provide accurate, context-aware answers to both employees and customers. The solution would streamline internal processes, enhance customer engagement, and ensure that information was accessible regardless of language barriers.

## Solution
- Built a multilingual RAG (Retrieval-Augmented Generation) chatbot using Streamlit and Llamaindex.
- Supported multiple file types for knowledge ingestion.
- Integrated with OneDrive for seamless document retrieval.
- Focused on accurate language detection and context-aware responses.

## Result
The chatbot improved internal efficiency and customer engagement by providing instant, language-specific answers based on the company's knowledge base.
    `
  },
  {
    name: "Dashboard Monitoring Agriculture Indonesia",
    description: "Empowering Indonesia’s agriculture: an AI-powered dashboard that predicts crop yields and turns raw data into actionable insights.",
    role: "Data Management",
    technologies: ["Tableau", "Deep Learning", "Python"],
    tag: ["Forecasting", "Data Mining"],
    image: "/projects/dasbor-analitik.png",
    content: `
## Client Background
Agricultural stakeholders in Indonesia, including government agencies, farmers, and agribusinesses, often struggle with fragmented data sources and limited access to real-time insights. The country's vast and diverse agricultural landscape makes it challenging to monitor crop conditions, predict yields, and respond proactively to emerging trends. Stakeholders needed a centralized platform to aggregate, analyze, and visualize agricultural data, enabling them to make data-driven decisions for improving productivity and sustainability.

## Project Overview
This project focused on developing a comprehensive dashboard system to monitor Indonesia's agricultural conditions and forecast crop yields using advanced AI and data analytics. The dashboard would integrate data from multiple sources, apply deep learning models for predictive analysis, and present actionable insights through interactive visualizations. The goal was to empower stakeholders with timely information to optimize resource allocation, plan interventions, and support national food security initiatives.

## Solution
- Built interactive dashboards using Tableau.
- Integrated deep learning models for crop yield prediction.
- Automated data pipelines for real-time updates.

## Result
Enabled stakeholders to make informed decisions, improving productivity and resource allocation in the agricultural sector.
    `
  },
  {
    name: "Project Gastronomi P2V",
    description: "Discover culinary heritage with an AI-powered platform that brings food culture to your fingertips.",
    role: "ML Engineer",
    technologies: ["Django", "Flutter", "Websocket", "Gitlab", "Text to SQL"],
    tag: ["Culinary", "Culture", "AI Chatbot"],
    url: "",
    image: "/projects/lombokeats.png",
    content: `
## Client Background
A cultural initiative aimed to promote and explore gastronomic diversity through technology.

## Project Overview
Created an AI-powered platform to explore food culture, featuring a chatbot and mobile support.

## Solution
- Developed backend with Django and real-time features using Websockets.
- Built a mobile app with Flutter.
- Implemented AI chatbot for interactive culinary exploration.
- Used Text-to-SQL for dynamic data queries.

## Result
Enhanced user engagement and cultural awareness through an accessible, interactive platform.
    `
  },
  {
    name: "Personal Website",
    description: "Not just a portfolio—an interactive AI-powered hub where visitors can explore my work and get answers in real time.",
    role: "Fullstack Developer",
    technologies: ["Next js", "Typescript", "Llama", "Tailwind", "PostgreSQL"],
    tag: ["SEO Website", "Blog Website", "AI Chatbot"],
    image: "/projects/personal-website.png",
    url: "https://www.wahyuikbal.web.id",
    code: "https://github.com/wahyudesu/Personal-Website-Next-js-Obsidian-Ai-",
    content: `
## Project Overview
A personal portfolio and blog site featuring an AI chatbot that answers questions based on my content.

## Solution
- Built with Next.js, Typescript, and Tailwind CSS.
- Integrated Llama for retrieval-based chatbot.
- Used MDX for flexible blog content.

## Result
Showcases my work and enables visitors to interactively explore my portfolio and blog.
    `
  },
  {
    name: "Database Report Automation",
    description: "Automate your database reporting: a web app that streamlines report generation and saves hours of manual work.",
    role: "Automation Engineer",
    technologies: ["Streamlit", "Python", "SQL", "Neon Tech"],
    tag: ["Automation", "Database", "Reporting"],
    image: "/projects/db-automation.png",
    url: "https://db-report-automation.streamlit.app",
    code: "https://github.com/wahyudesu/db-report-automation",
    content: `
## Project Overview
Developed a web application to automate the generation of database reports, reducing manual effort and minimizing errors.

## Solution
- Built with Streamlit for a user-friendly interface.
- Automated SQL query execution and report formatting.
- Integrated with Neon Tech for scalable cloud database access.

## Result
Significantly reduced report preparation time and improved data accuracy for business users.
    `
  },
  {
    name: "Monitoring Stunting Webapp",
    description: "Revolutionizing child health: a generative AI webapp that empowers parents and professionals to prevent stunting in babies.",
    role: "AI Engineer",
    technologies: ["Streamlit", "Generative AI", "Neon tech"],
    tag: ["Generative AI App"],
    image: "",
    url: "https://stuntron.streamlit.app",
    code: "https://github.com/wahyudesu/healthkathon-ai",
    content: `
## Client Background
Health professionals and parents needed a tool to monitor and prevent stunting in infants.

## Project Overview
Developed a web application using generative AI to provide guidance and monitoring for stunting prevention.

## Solution
- Built with Streamlit and Neon tech.
- Used generative AI for personalized recommendations.

## Result
Improved awareness and prevention strategies for stunting, supporting better child health outcomes.
    `
  },
  {
    name: "Malware Prediction Project",
    description: "Stay ahead of cyber threats: machine learning models that predict and classify malware with cutting-edge ensemble techniques.",
    role: "ML Engineer",
    technologies: ["Machine learning", "Ensemble", "Python"],
    tag: [],
    image: "",
    code: "https://github.com/wahyudesu/malware-detection",
    content: `
## Project Overview
A machine learning project to classify malware and predict potential threats.

## Solution
- Applied ensemble learning models to malware datasets.
- Evaluated model performance for threat detection.

## Result
Enhanced malware detection accuracy, contributing to improved cybersecurity.
    `
  },
  {
    name: "Guess The Word Game",
    description: "Challenge your mind: an AI-powered word guessing game that makes learning language fun and interactive.",
    role: "NLP Engineer",
    technologies: ["Streamlit", "Vector Embeddings", "Text Similarity", "Python", "Glove ID"],
    tag: [],
    image: "",
    code: "https://github.com/Community-of-Playground/Gemastik-Pengembangan-Aplikasi-Permainan",
    content: `
## Project Overview
A fun word guessing game powered by NLP and Indonesian GloVe vectors.

## Solution
- Used vector embeddings and cosine similarity for word matching.
- Built with Streamlit for interactive gameplay.

## Result
Engaged users in learning and playing with language using AI techniques.
    `
  },
  {
    name: "CNN Rock Scissor Paper",
    description: "Experience AI in action: a computer vision model that predicts your next move in Rock-Scissor-Paper.",
    role: "Student",
    technologies: ["Python", "Tensorflow", "Computer Vision"],
    tag: [],
    image: "",
    code: "https://github.com/wahyudesu/Dicoding-rock-scissor-paper",
    content: `
## Project Overview
Developed an image-based Rock-Scissor-Paper prediction system using CNN.

## Solution
- Built and trained a CNN model with TensorFlow.
- Processed and classified game images.

## Result
Achieved accurate predictions, demonstrating computer vision capabilities.
    `
  },
  {
    name: "Bambubot: Chatbot Kelurahan Keputih",
    description: "Redefining public service: a smart chatbot that streamlines document management for local communities.",
    tag: [],
    role: "AI Engineer",
    technologies: ["Python", "LLM", "Telegram", "Langchain"],
    image: "/projects/bambubot.png",
    content: `
## Client Background
Keputih urban village needed a solution to streamline document management and community communication.

## Project Overview
Developed a chatbot to assist with document requests and information dissemination.

## Solution
- Built with Langchain and Telegram API.
- Automated responses for common document-related queries.

## Result
Improved efficiency and accessibility for community services.
    `
  },
  {
    name: "Life Expectancy Analysis",
    description: "Unlocking the secrets of longevity: data-driven insights into life expectancy trends across the globe.",
    role: "Data Analyst",
    technologies: ["Python", "streamlit"],
    tag: [],
    image: "",
    code: "https://github.com/wahyudesu/Life-expectancy-analysis",
    paper: "https://github.com/wahyudesu/Life-expectancy-analysis/blob/main/Document/3323600056_Wahyu%20Ikbal%20Maulana_Regresi%20Linier%20Berganda.pdf",
    content: `
## Project Overview
Analyzed life expectancy trends across countries using linear regression.

## Solution
- Collected and cleaned global life expectancy data.
- Built regression models to identify key factors.

## Result
Provided actionable insights for health policy and research.
    `
  },
  {
    name: "Anime Recommendation Web App",
    description: "Find your next favorite anime: a smart recommendation engine that learns your taste and delivers personalized picks.",
    role: "ML Engineer",
    technologies: ["Next js", "Machine learning"],
    tag: [],
    image: "",
    code: "https://github.com/mozaldy/wamonime",
    content: `
## Project Overview
A web-based anime recommendation engine using machine learning.

## Solution
- Implemented similarity-based recommendation algorithms.
- Built with Next.js for a responsive user experience.

## Result
Helped users discover new anime based on their preferences.
    `
  },
  {
    name: "Forecasting Indonesia Renewable Energy",
    description: "Powering the future: AI-driven forecasts for Indonesia’s renewable energy growth and sustainability.",
    role: "Data Scientist",
    technologies: ["Python", "Machine learning", "ARIMA"],
    tag: [],
    image: "",
    code: "https://github.com/wahyudesu/ARIMA-Analysis-in-Energy-SDGs-7-Indonesia",
    paper: "https://github.com/wahyudesu/ARIMA-Analysis-in-Energy-SDGs-7-Indonesia/blob/main/Makalah%20Journal%20ARIMA%20Forecasting.docx",
    content: `
## Project Overview
Forecasted renewable energy growth in Indonesia as part of SDGs research.

## Solution
- Used ARIMA time series models for energy data forecasting.
- Analyzed trends and provided future projections.

## Result
Supported policy and investment decisions in renewable energy.
    `
  },
  {
    name: "Data Engineering Dashboard System",
    description: "Visualize, manage, and optimize your data pipelines with a dashboard that brings ETL workflows to life.",
    role: "Data Engineer",
    technologies: ["Flask", "Airflow", "Docker"],
    tag: [],
    image: "",
    code: "https://github.com/AfifH07/LastProjectProgramming",
    content: `
## Project Overview
Integrated data pipelines and monitoring system for ETL workflows.

## Solution
- Developed dashboard with Flask.
- Managed and visualized ETL jobs using Airflow and Docker.

## Result
Streamlined data engineering processes and improved workflow transparency.
    `
  },
  {
    name: "Dashboard d3js",
    description: "See your business at a glance: interactive dashboards with stunning charts and real-time insights.",
    role: "Frontend Developer",
    technologies: ["Vite", "React", "d3js", "Magic UI", "shdcn ui"],
    tag: ["Chart Dashboard"],
    image: "",
    code: "https://3323600056-wahyuikbalmaulana-dashboard-d3js.vercel.app",
    content: `
## Project Overview
A sales dashboard visualizing key business metrics with interactive charts and maps.

## Solution
- Built with React, d3.js, and modern UI libraries.
- Implemented multiple chart types for comprehensive insights.

## Result
Enabled data-driven decision making through clear and interactive visualizations.
    `
  },
  // Penyesuaian: Menghapus project duplikat dan memperbaiki deskripsi project berikut
  {
    name: "Talenalink AI Recruitment",
    description: "Revolutionize hiring: an AI-powered recruitment platform that finds the perfect match between talent and opportunity.",
    role: "Frontend Developer",
    technologies: ["Next js", "Tailwind", "Postgresql", "Magic UI", "shdcn ui"],
    tag: ["Recruitment", "AI"],
    image: "",
    code: "https://github.com/talenaink/ai-recruitment",
    content: `
## Project Overview
A recruitment platform leveraging AI for candidate screening and job matching.

## Solution
- Built with Next.js and Tailwind CSS for modern UI.
- Integrated AI modules for resume parsing and candidate-job fit scoring.
- Used PostgreSQL for scalable data storage.

## Result
Streamlined recruitment process and improved candidate-job matching accuracy.
    `
  },
  {
    name: "HIMIT PENS Website",
    description: "Connecting students and community: the official HIMIT PENS website with a modern, engaging digital experience.",
    role: "UI/UX Designer",
    technologies: ["Next js", "Tailwind", "Postgresql", "Magic UI", "shdcn ui"],
    tag: ["Organization Website"],
    image: "/projects/himit.png",
    code: "https://github.com/himitpens/website",
    content: `
## Objective
Provide an official digital platform for HIMIT PENS to facilitate information dissemination, organization management, and increase engagement among members and the public.

## Solution
- Redesigned the old website using modern technologies (Next.js, Tailwind CSS).
- Implemented content management for news, events, and member data.
- Delivered a modern, responsive UI/UX for a better user experience.

## Team
- UI/UX Designer
- Frontend Developer
- Backend Developer
- Project Manager

## Shot
The new HIMIT PENS website is now more informative, accessible, and enhances engagement for both members and the public.
    `
  },
]

export default projects
