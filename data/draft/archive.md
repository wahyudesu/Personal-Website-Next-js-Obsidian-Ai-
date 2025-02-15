Akhir-akhir ini, AI agent lagi booming, sedang naik daun di kalangan developer dan engineer. Buat kamu yang belum tahu, AI Agen adalah implementasi dari proses LLM, di mana LLM dilengkapi tools, memory, dan kemampuan untuk mengambil keputusan. Anggap saja sebagai assistent yang bisa mengerjakan tugas, ndak hanya sekedar memberi output berupa teks.

Konsep AI agent ini sangat powerful, terutama ketika beberapa agent berkolaborasi dalam sebuah sistem. Proses interaksi dan koordinasi antar-agent ini disebut **workflows**. Nah, dalam artikel ini, kita tidak akan fokus pada teori AI agent secara mendalam, melainkan lebih ke sisi engineering dan praktiknya. Jadi, pastikan kamu sudah memiliki pemahaman dasar terkait RAG (Retrieval-Augmented Generation) dan LLM sebelum melanjutkan.

## Building effective agents workflow

Di bagian ini, kita akan menjelajahi pola-pola umum yang sering digunakan dalam sistem agentik yang sudah diterapkan di produksi. Kita akan mulai dari blok dasar—**augmented LLM**—lalu secara bertahap meningkatkan kompleksitasnya, mulai dari workflow sederhana hingga agent yang bisa bekerja secara otonom.

Nah, kali ini kita akan mempraktikkannya menggunakan Vercel AI SDK dan Langgraph. Sebagai tambahan, saya akan menjelaskan sedikit tentang LangGraph dan AI SDK. Jika kamu sudah familiar dengan framework ini, kamu bisa langsung melompat ke bagian implementasi kode.

## Why LangGraph?

LangGraph adalah library yg dibangun di atas LangChain, didesain untuk aplikasi berbasis LLM, Make Langgraph jadi sat set buat sistem agent yang kompleks. yang menarik dari Langgraph adalah karena langgraph itu LangGraph is an advanced library built on top of LangChain, designed to enhance your Large Language Model (LLM) applications by introducing cyclic computational capabilities. While LangChain allows the creation of Directed Acyclic Graphs (DAGs) for linear workflows, LangGraph takes this a step further by enabling the addition of cycles, which are essential for developing complex, agent-like behaviors. These behaviors allow LLMs to continuously loop through a process, dynamically deciding what action to take next based on evolving conditions.

At the heart of LangGraph is the concept of a **stateful graph**:

- **State**: Represents the context or memory that is maintained and updated as the computation progresses. It ensures that each step in the graph can access relevant information from previous steps, allowing for dynamic decision-making based on accumulated data throughout the process.

- **Nodes**: Serve as the building blocks of the graph, representing individual computation steps or functions. Each node performs a specific task, such as processing inputs, making decisions, or interacting with external systems. Nodes can be customized to execute a wide range of operations within the workflow.

- **Edges**: Connect nodes within the graph, defining the flow of computation from one step to the next. They support conditional logic, allowing the path of execution to change based on the current state and facilitate the movement of data and control between nodes, enabling complex, multi-step workflows.
    

## Why Vercel ai sdk

Vercel AI SDK adalah Typescript libraryyang dirancang untuk pengembangan aplikasi dan berbasis artificial intelligence. TypeScript library for building AI applications. Library ini sangat cocok dalam pengembangan aplikasi react framework seperti React, Next.js, Svelte, dan Vue.

AI SDK Core has various functions designed for text generation, structured data generation, and tool usage. These functions take a standardized approach to setting up prompts and settings, making it easier to work with different models.

- `streamText`: Stream text and tool calls. Kamu bisa make function ini di beberapa kasus seperti chat bots dan content streaming.
    
- `streamObject`: Stream a structured object that matches a Zod schema. Function untuk generate UIs berbasis object, kurang lebih seperti json.
    

Vercel ai sdk juga menyediakan AI SDK UI yang mempermudah pembuatan interface berbasis LLM. Oleh karena itu, ini adalah library favorit saya ketika mengembangkan aplikasi ai di next js

[langgraph and ai sdk](https://app.capacities.io/9d6ce513-5b4e-45a0-bf69-35862eec7bd2/e7706664-128e-4163-8555-1045715395d3)

## Workflow Patterns

Konsep workflow sering kita jumpai di kehidupan sehari-hari. Contohnya di perkuliahan dan kita ngikutiin struktur organisasi, dan seringkali kita bahkan tidak menyadarinya. Nah, kita akan mengimplementasikan dan membahas struktur-struktur tersebut (atau ‘workflows’) sebentar lagi.

Kalau kamu ingin penjelasan lebih detail, kamu bisa baca research dari **Anthropic** di [sini](https://www.anthropic.com/research/building-effective-agents). Research dari Anthropic ini jadi referensi wajib buat banyak developer ai, dan bisa jadi bahan belajar tambahan buatmu juga. Di antaranya

- **Sequential Processing**
    
- **Parallel Processing**
    
- **Evaluation/Feedback Loops**
    
- **Orchestration**
    
- **Routing**
    

### Set up workflow

Sebelum memulai pertama kali kita set up terlebih dahulu framework yang kita gunakan. Kamu bisa pilih salah satu mau yang Typescript atau yang Python. API yang kita pakai disini make groq provider. _Jangan lupa install library nya terlebih dahulu_

Set up Typescriptwith Vercel AI SDK

```typescript
require('dotenv').config();

import { generateObject } from 'ai';
import { z } from 'zod';
import { createGroq } from '@ai-sdk/groq';

const groq = createGroq({
  baseURL: 'https://api.groq.com/openai/v1',
  apiKey: process.env.GROQ_API_KEY || "",
});
```

Set up Python with langgraph

```python
import os
import getpass

from langchain_groq import ChatGroq

def _set_env(var: str):
    if not os.environ.get(var):
        os.environ[var] = getpass.getpass(f"{var}: ")

_set_env("GROQ_API_KEY")

llm = ChatGroq(model="llama-3.3-70b-versatile")
```

### Prompt Chaining / Sequential Processing
![](https://ik.imagekit.io/83ba7d5ua/Chaining.png?updatedAt=1738775302217)

Ini adalah workflow yang paling sederhana, Prompt chaining itu memecah satu task menjadi beberapa langkah, dengan melibatkan beberapa output dari satu prompt sebagai input untuk yang berikutnya. Pola ini ideal untuk task yang urutanya jelas langkah tiap langkah

Contohnya, ketika bikin copywriting untuk sebuah brand. Dimulai dari agent A yang merangkai CTA, agent B menilai aspek emosional, agent C menilai kesesuaian dengan tone brand, dan seterusnya. Setiap proses berjalan secara urut, hasil output dari satu langkah jadi input untuk langkah selanjutnya.

```typescript
async function implementFeature(featureRequest: string) {
  // Orchestrator: Plan the implementation
  const { object: implementationPlan } = await generateObject({
    model: groq('llama-3.3-70b-versatile'),
    schema: z.object({
      files: z.array(
        z.object({
          purpose: z.string(),
          filePath: z.string(),
          changeType: z.enum(['create', 'modify', 'delete']),
        }),
      ),
      estimatedComplexity: z.enum(['low', 'medium', 'high']),
    }),
    system:
      'You are a senior software architect planning feature implementations.',
    prompt: `Analyze this feature request and create an implementation plan:
    ${featureRequest}`,
  });
```

Setelah membuat plan sebagai agent yang bertindak sebagai **senior software architect**, menganalisis input dan dan menghasilkan output sesuai schema. Selanjutnya

```typescript
// Workers: Execute the planned changes
  const fileChanges = await Promise.all(
    implementationPlan.files.map(async (file) => {
      // Each worker is specialized for the type of change
      const workerSystemPrompt = {
        create:
          'You are an expert at implementing new files following best practices and project patterns.',
        modify:
          'You are an expert at modifying existing code while maintaining consistency and avoiding regressions.',
        delete:
          'You are an expert at safely removing code while ensuring no breaking changes.',
      }[file.changeType];

      const { object: change } = await generateObject({
        model: groq('llama-3.3-70b-versatile'),
        schema: z.object({
          explanation: z.string(),
          code: z.string(),
        }),
        system: workerSystemPrompt,
        prompt: `Implement the changes for ${file.filePath} to support:
        ${file.purpose}

        Consider the overall feature context:
        ${featureRequest}`,
      });

      return {
        file,
        implementation: change,
      };
    }),
  );
```

Workflow with Langgraph python

```python
# Define our state schema for tracking the workflow progress
class MarketingState(TypedDict):
    input: str
    initial_copy: str
    quality_metrics: Optional[dict]
    final_copy: str
    messages: list[BaseMessage]

# Define quality metrics schema
class QualityMetrics(BaseModel):
    hasCallToAction: bool
    emotionalAppeal: int
    clarity: int

def generate_initial_copy(state: MarketingState) -> MarketingState:
    """
    Generates the initial marketing copy based on the input.
    """
    response = groq.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{
            "role": "user",
            "content": f"Write persuasive marketing copy for: {state['input']}. Focus on benefits and emotional appeal."
        }]
    )
    
    state["initial_copy"] = response.choices[0].message.content
    state["final_copy"] = state["initial_copy"]  # Initialize final copy
    return state

def evaluate_copy(state: MarketingState) -> MarketingState:
    """
    Evaluates the marketing copy against quality metrics.
    """
    response = groq.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{
            "role": "user",
            "content": f"""Evaluate this marketing copy for:
            1. Presence of call to action (true/false)
            2. Emotional appeal (1-10)
            3. Clarity (1-10)
            
            Copy to evaluate: {state['final_copy']}"""
        }]
    )
    
    # Parse the metrics from the response
    metrics = QualityMetrics(
        hasCallToAction=True,  # You would parse these values from the actual response
        emotionalAppeal=8,
        clarity=8
    )
    
    state["quality_metrics"] = metrics.dict()
    return state

def improve_copy(state: MarketingState) -> MarketingState:
    """
    Improves the marketing copy if it doesn't meet quality standards.
    """
    metrics = state["quality_metrics"]
    
    # Check if improvements are needed
    if (not metrics["hasCallToAction"] or 
        metrics["emotionalAppeal"] < 7 or 
        metrics["clarity"] < 7):
        
        improvement_prompt = f"""Rewrite this marketing copy with:
        {'' if metrics["hasCallToAction"] else '- A clear call to action'}
        {'' if metrics["emotionalAppeal"] >= 7 else '- Stronger emotional appeal'}
        {'' if metrics["clarity"] >= 7 else '- Improved clarity and directness'}
        
        Original copy: {state['final_copy']}"""
        
        response = groq.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": improvement_prompt}]
        )
        
        state["final_copy"] = response.choices[0].message.content
    
    return state

def create_marketing_workflow() -> Graph:
    """
    Creates the marketing copy generation and improvement workflow.
    """
    workflow = StateGraph(MarketingState)
    
    # Add nodes
    workflow.add_node("generate", generate_initial_copy)
    workflow.add_node("evaluate", evaluate_copy)
    workflow.add_node("improve", improve_copy)
    
    # Add edges
    workflow.add_edge("generate", "evaluate")
    workflow.add_edge("evaluate", "improve")
    
    # Set entry and exit points
    workflow.set_entry_point("generate")
    workflow.set_finish_point("improve")
    
    return workflow.compile()

def generate_marketing_copy(input_text: str) -> dict:
    """
    Main function to handle the marketing copy generation process.
    """
    workflow = create_marketing_workflow()
    
    result = workflow.invoke({
        "input": input_text,
        "initial_copy": "",
        "quality_metrics": None,
        "final_copy": "",
        "messages": []
    })
    
    return {
        "initial_copy": result["initial_copy"],
        "final_copy": result["final_copy"],
        "quality_metrics": result["quality_metrics"]
    }
```

Output

### Parallelization
![](https://ik.imagekit.io/83ba7d5ua/Parallelization.png?updatedAt=1738775302215)

LLMs terkadang perlu untuk berjalan secara bersamaan dan menggabungkan outputnya untuk hasil yang lebih akurat. Workflow ini cukup efektif ketika task yang panjang dapat dipecah menjadi beberapa bagian lalu berjalan bersamaan supaya berjalan lebih cepat. Untuk task yang kompleks dan perlu banyak pertimbangan, LLMs biasanya menghasilkan lebih baik daripada lebih fokus ke specific [attention](https://www.datacamp.com/blog/attention-mechanism-in-llms-intuition) dari suatu konteks.

dalam workflow parallelization ini, terbagi menjadi 2 variasi, diantaranya:

- **Sectioning**: Memecah task menjadi beberapa subtask yang berjalan bersamaan
    
- **Voting:** Menjalankan beberapa kali task yang sama untuk menghasilkan output yang berbeda
    

Seperti cara kerja sebuah tim IT yang berfokus di pengembangan aplikasi, ada yang fokus di bagian performa, quality, dan security. Jadi untuk alur prompt generate websitenya dipecah di beberapa bagian aspek supaya hasil yang didapatkan ndak hanya bekerja tapi juga memiliki performa yang stabil dan punya sisi keamanan yang tinggi.

Pertama kita perlu bikin spesialist yang bekerja secara bersamaan dengan pesan yang kurang lebih sama.

```typescript
// Run parallel reviews
  const [securityReview, performanceReview, maintainabilityReview] =
    await Promise.all([
      generateObject({
        model, system:
          'You are an expert in code security. Focus on identifying security vulnerabilities, injection risks, and authentication issues.',
        schema: z.object({
          vulnerabilities: z.array(z.string()),
          riskLevel: z.enum(['low', 'medium', 'high']),
          suggestions: z.array(z.string()),
        }), prompt: `Review this code: ${code}`,
      }),
      generateObject({
        model, system:
          'You are an expert in code performance. Focus on identifying performance bottlenecks, memory leaks, and optimization opportunities.',
        schema: z.object({
          issues: z.array(z.string()),
          impact: z.enum(['low', 'medium', 'high']),
          optimizations: z.array(z.string()),
        }), prompt: `Review this code: ${code}`,
      }),
      generateObject({
        model, system:
          'You are an expert in code quality. Focus on code structure, readability, and adherence to best practices.',
        schema: z.object({
          concerns: z.array(z.string()),
          qualityScore: z.number().min(1).max(10),
          recommendations: z.array(z.string()),
        }), prompt: `Review this code: ${code}`,
      }),
    ]);
```

Selanjutnya kita perlu menggabungkan semua object nya jadi satu. Kita butuh satu agent sebagai Aggregator. Yang perlu review dan meringkas, bila perlu tambahkan juga task koreksi untuk meminimalisir kesalahan.

```typescript
  // Aggregate results using another model instance
  const { text: summary } = await generateText({
    model, system: 'You are a technical lead summarizing multiple code reviews.',
    prompt: `Synthesize these code review results into a concise summary with key actions:
    ${JSON.stringify(reviews, null, 2)}`,
  });
```

And with that code, in a much shorter amount of time, we received all the translations:

Berikut adalah hasil output dari agent yang bekerja secara paralel

/ gambar

### Evaluator
![](https://ik.imagekit.io/83ba7d5ua/Evaluation.png?updatedAt=1738775302256)

Nyuruh chatgpt buat bikin skripsi itu bukan hal yang mudah ya. Kasian chatgpt mikir sendirian. Jadi perlu adanya feedback dari agent tambahan untuk memperbaiki kualitas hasil output dengan terus mengiterasi seiring bertambahnya bagian bagian ya, seperti latar belakang, isi, kesimpulan. Untuk itu perlu adanya evaluator disini untuk memberikan feedback dan respon dari output yang ia terima ​

```typescript
  // Initial article generation
  const { text: article } = await generateText({
    model: groq('llama-3.1-8b-instant'),
    system: 'You are a writer. Your task is to write a concise article in only 6 sentences! You might get additional feedback from your supervisor!',
    prompt: `Write a 6-sentence article on the topic: ${topic}`,
  });
```

```typescript
while (iterations < MAX_ITERATIONS) {
    // Evaluate current article
    const { object: evaluation } = await generateObject({
      model: groq('llama-3.3-70b-versatile'), // use a larger model to evaluate
      schema: z.object({
        qualityScore: z.number().min(1).max(10),
        clearAndConcise: z.boolean(),
        engaging: z.boolean(),
        informative: z.boolean(),
        specificIssues: z.array(z.string()),
        improvementSuggestions: z.array(z.string()),
      }),
      system: "You are a writing supervisor! Your agency specializes in concise articles! Your task is to evaluate the given article and provide feedback for improvements! Repeat until the article meets your requirements!",
      prompt: `Evaluate this article:

      Article: ${currentArticle}

      Consider:
      1. Overall quality
      2. Clarity and conciseness
      3. Engagement level
      4. Informative value`,
    });
```

```typescript
if (
      evaluation.qualityScore >= 8 &&
      evaluation.clearAndConcise &&
      evaluation.engaging &&
      evaluation.informative
    ) {
      break;
    }

    // Generate improved article based on feedback
    const { text: improvedArticle } = await generateText({
      model: groq('llama-3.3-70b-versatile'), // use a larger model
      system: 'You are an expert article writer.',
      prompt: `Improve this article based on the following feedback:
      ${evaluation.specificIssues.join('\n')}
      ${evaluation.improvementSuggestions.join('\n')}

      Current Article: ${currentArticle}`,
    });

    currentArticle = improvedArticle;
    iterations++;
  }

  return {
    finalArticle: currentArticle,
    iterationsRequired: iterations,
  };
}
```

Workflow with Langgraph python

```python
# Node 1: Generate initial article
def generate_initial_article(input_data: Dict[str, Any]) -> Dict[str, Any]:
    model = "llama-3.1-8b-instant"
    system = "You are a writer. Your task is to write a concise article in only 6 sentences! You might get additional feedback from your supervisor!"
    prompt = TextPrompt(f"Write a 6-sentence article on the topic: {input_data['topic']}")
    generate_text_node = GenerateTextNode(model=model, system=system, prompt=prompt)
    result = generate_text_node.execute()
    return {"current_article": result.text, "iterations": 0}

node1 = Node(name="generate_initial_article", function=generate_initial_article)

# Node 2: Evaluate article quality
def evaluate_article_quality(input_data: Dict[str, Any]) -> Dict[str, Any]:
    model = "llama-3.3-70b-versatile"
    schema = ObjectSchema({
        "qualityScore": (int, 1, 10),
        "clearAndConcise": bool,
        "engaging": bool,
        "informative": bool,
        "specificIssues": List[str],
        "improvementSuggestions": List[str]
    })
    system = "You are a writing supervisor! Your agency specializes in concise articles! Your task is to evaluate the given article and provide feedback for improvements! Repeat until the article meets your requirements!"
    prompt = TextPrompt(f"Evaluate this article:\n\nArticle: {input_data['current_article']}\n\nConsider:\n1. Overall quality\n2. Clarity and conciseness\n3. Engagement level\n4. Informative value")
    generate_object_node = GenerateObjectNode(model=model, schema=schema, system=system, prompt=prompt)
    result = generate_object_node.execute()
    return {"evaluation": result.object}

node2 = Node(name="evaluate_article_quality", function=evaluate_article_quality)

# Node 3: Check if quality meets threshold
def check_quality_threshold(input_data: Dict[str, Any]) -> Dict[str, Any]:
    evaluation = input_data["evaluation"]
    if (evaluation["qualityScore"] >= 8 and
        evaluation["clearAndConcise"] and
        evaluation["engaging"] and
        evaluation["informative"]):
        return {"meets_threshold": True}
    else:
        return {"meets_threshold": False}

node3 = Node(name="check_quality_threshold", function=check_quality_threshold)

# Node 4: Generate improved article based on feedback
def improve_article(input_data: Dict[str, Any]) -> Dict[str, Any]:
    model = "llama-3.3-70b-versatile"
    evaluation = input_data["evaluation"]
    system = "You are an expert article writer."
    prompt = TextPrompt(f"Improve this article based on the following feedback:\n{evaluation['specificIssues']}\n{evaluation['improvementSuggestions']}\n\nCurrent Article: {input_data['current_article']}")
    generate_text_node = GenerateTextNode(model=model, system=system, prompt=prompt)
    result = generate_text_node.execute()
    return {"current_article": result.text, "iterations": input_data["iterations"] + 1}

node4 = Node(name="improve_article", function=improve_article)

# Node 5: Final output
def final_output(input_data: Dict[str, Any]) -> Dict[str, Any]:
    print(f"Final Article:\n{input_data['current_article']}")
    print(f"Iterations Required: {input_data['iterations']}")
    return {}

node5 = Node(name="final_output", function=final_output)

# Define edges between nodes
edge1 = Edge(source=node1, target=node2)
edge2 = Edge(source=node2, target=node3)
edge3 = Edge(source=node3, target=node4, condition=lambda x: not x["meets_threshold"])
edge4 = Edge(source=node3, target=node5, condition=lambda x: x["meets_threshold"])
edge5 = Edge(source=node4, target=node2)

# Add nodes and edges to the graph
graph.add_node(node1)
graph.add_node(node2)
graph.add_node(node3)
graph.add_node(node4)
graph.add_node(node5)
graph.add_edge(edge1)
graph.add_edge(edge2)
graph.add_edge(edge3)
graph.add_edge(edge4)
graph.add_edge(edge5)
```

### Routing
![](https://ik.imagekit.io/83ba7d5ua/Routing.png?updatedAt=1738775302273)

Pola ini memungkinkan model untuk menentukan jalur proses yang tepat berdasarkan konteks dan hasil sebelumnya. Pola routing bekerja dengan baik ketika ada beberapa kategori berbeda yang memerlukan penanganan khusus. Pola ini memastikan setiap kasus diproses dengan pendekatan yang paling sesuai. Seperti pada contoh di atas ini, hasil dari LLM pertama akan menentukan jalur mana yang akan diambil untuk langkah selanjutnya, menyesuaikan proses berdasarkan karakteristik input.

Pertama kita buat terlebih dahulu, routing agent nya yang mengklasifikasikan input dengan membaginya berasarkan jenis input, serta kompleksitas dan alasan detailnya.

```typescript
async function handleCustomerQuery(query: string) {
  const model = groq('llama-3.3-70b-versatile');

  // Step 1: Classify the query type
  const { object: classification } = await generateObject({
    model,
    schema: z.object({
      reasoning: z.string(),
      type: z.enum(['general', 'refund', 'technical']),
      complexity: z.enum(['simple', 'complex']),
    }),
    prompt: `Classify this customer query:
    ${query}

    Determine:
    1. Query type (general, refund, or technical)
    2. Complexity (simple or complex)
    3. Brief reasoning for classification`,
  });
```

Selanjutnya kita mendefinisikan alur beberapa agen (ngestuck cok)

```typescript
  // Route based on classification
  // Determine the model and system prompt based on query type and complexity
  const { text: response } = await generateText({
    model:
      classification.complexity === 'simple'
        ? groq('llama3-8b-8192')
        : groq('llama-3.1-8b-instant'),
    system: {
      general:
        'You are an expert customer service agent handling general inquiries.',
      refund:
        'You are a customer service agent specializing in refund requests. Follow company policies and gather necessary information.',
      technical:
        'You are a technical support specialist with in-depth knowledge of the product. Focus on clear, step-by-step troubleshooting.',
    }[classification.type],
    prompt: query,
  });
```

### Orchestrator-Workers
![](https://ik.imagekit.io/83ba7d5ua/Orchestrator.png?updatedAt=1738775302310)

Di orchestrator workers workflow, LLM yang pertama (orchestrator) membedah task dan mendelegasikan ke caranya mirip seperti decomposition dan meringkas hasilnya menjadi satu. Di LLM yang pertama ini berperan penting dalam mengkooridnasi dan mengeksekusi spesialisasi workers. Tiap worker optimal untuk subtask yang spesifik.

Mari berpikir seperti sebuah tim. Pada contoh kali ini . Di tim kali ini ada beberapa bagian ya ada di bagian Business Analyst, Content Strategist, Social Media Manager, Marketing Analyst. Kemudian dari instruksi project manager, dilakukan sebuah pengukuran tingkat kesulitan, jenis penugasan dan delegasi tugas.

```typescript
async function implementTask(taskRequest: string) {
  const { object: taskPlan } = await generateObject({
    model: groq('llama-3.3-70b-versatile'),
    schema: z.object({
      tasks: z.array(
        z.object({
          purpose: z.string(),
          taskName: z.string(),
          changeType: z.enum(['create', 'modify', 'delete']),
        })
      ),
      estimatedEffort: z.enum(['low', 'medium', 'high']),
    }),
    system: 'Anda adalah Project Manager yang merancang strategi pelaksanaan tugas secara efisien.',
    prompt: `Buat rencana kerja untuk tugas berikut:
    ${taskRequest}`,
  });
```

Selanjutnya buat sistem karyawannya

```typescript
      const workerSystemPrompt = {
        create: {
          'Riset audiens': 'Anda adalah seorang Business Analyst. Anda bertanggung jawab untuk melakukan riset mendalam tentang target audiens.',
          'Pembuatan konten': 'Anda adalah seorang Content Strategist. Anda merancang strategi konten yang menarik dan sesuai dengan audiens.',
          'Pengelolaan akun': 'Anda adalah seorang Social Media Manager. Anda mengelola dan mengoptimalkan akun media sosial.',
          'Analisis performa': 'Anda adalah seorang Marketing Analyst. Anda menganalisis data dan mengukur keberhasilan strategi pemasaran.',
        }[task.taskName] || 'Anda adalah seorang profesional yang ahli di bidang ini.',
        modify: {
          'Pengelolaan akun': 'Anda adalah seorang Social Media Manager. Anda mengembangkan strategi pengelolaan akun agar lebih efektif.',
        }[task.taskName] || 'Anda adalah seorang spesialis yang meningkatkan efisiensi tugas.',
        delete: 'Anda adalah seorang Operations Manager. Anda menentukan tugas mana yang tidak diperlukan dan menghapusnya secara efisien.',
      }[task.changeType];
```

Setelah Product manager berhasil mendelegasikan tugas, selanjutnya kita gunakan apa yang ada di pola parallel dan delegasikan ke karyawan

```python
class Task(BaseModel):
    purpose: str
    task_name: str
    change_type: Literal["create", "modify", "delete"]

class TaskPlan(BaseModel):
    tasks: List[Task]
    estimated_effort: Literal["low", "medium", "high"]

def generate_task_plan(task_request: str) -> TaskPlan:
    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {"role": "system", "content": "You are a Project Manager responsible for designing an efficient task execution strategy."},
            {"role": "user", "content": f"Create a work plan for the following task: {task_request}"}
        ],
        response_format="json"
    )
    return TaskPlan(**response["choices"][0]["message"]["content"])

def implement_task_change(task: Task):
    worker_prompts = {
        "create": {
            "Audience research": "You are a Business Analyst responsible for audience research.",
            "Content creation": "You are a Content Strategist designing content strategies.",
            "Account management": "You are a Social Media Manager optimizing accounts.",
            "Performance analysis": "You are a Marketing Analyst measuring strategy success."
        },
        "modify": {
            "Account management": "You are a Social Media Manager improving strategies."
        },
        "delete": "You are an Operations Manager identifying unnecessary tasks."
    }

    system_prompt = worker_prompts.get(task.change_type, {}).get(task.task_name, "You are an expert in this field.")

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": f"Implement changes for the task: {task.task_name}\nPurpose: {task.purpose}\nExplain why and list action items."}
        ],
        response_format="json"
    )
    return response["choices"][0]["message"]["content"]
```

## Kapan menggunakan Typescript dan Python

Vercel AI SDK dan langgraph adalah salah satu framework yang cukup lengkap dan dokumentasi yang rapi. Selain Vercel AI SDK juga ada rekomendasi framework lainnya seperti

[Agentic](https://agentic.so/intro), AI agent standard library that works with any LLM and TS AI SDK.

[Agno](https://www.agno.com), open-source python framework for building agentic systems

[Rivet](https://rivet.ironcladapp.com/), a drag and drop GUI LLM workflow builder; and

[Crew ai](https://www.crewai.com), Python Framework for orchestrating collaborative AI agents

Dengan menggunakan framework membuat kita bisa dengan mudah menggunakan pola standard seperti tools, dan menghubungkan keduanya. Namun

> While Python has traditionally been the dominant language in AI and ML development due to its extensive libraries and frameworks, **TypeScript — a superset of JavaScript — has emerged as a strong contender for building scalable, maintainable, and efficient AI/ML applications**.

Menggunakan Typescript dan Python tergantung kebutuhan, jika butuh cepat untuk pengembangan fullstack aplikasi typescript cukup tanpa menambah stack lagi, jika ingin terpisah dan membangun agent yang lebih kompleks. Python lebih direkomendasikan untuk membangun AI agent karena dukungan library AI/ML yang lengkap dan lebih banyaknya framework, sedangkan TypeScript cocok jika fokus pada integrasi dengan react framework utamanya pada fullstack developer

Baik Python ataupun Typescript, hingga framework lain bisa cek source code disini

www.code.com