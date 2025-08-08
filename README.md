## Run Locally

Clone the project

```bash
git clone https://dredsoft-labs-admin@bitbucket.org/dredsoft-labs/ecommerce.git
```

Go to the project directory

```bash
cd ecommerce
```

Install dependencies

```bash
npm install
```

### Start the React frontend

```bash
npm start
```

The React app should now be running at [http://localhost:3000](http://localhost:3000).

---

## AI Smart Search Setup

To use the AI Smart Search feature, you need to run a backend proxy for OpenAI API:

1. Go to the root of your project (outside the `ecommerce` folder).
2. Create a file named `backend-proxy.js` with the provided code.
3. Install backend dependencies:

```bash
npm install express cors node-fetch@2
```

4. Start the backend proxy server:

```bash
node backend-proxy.js
```

The proxy will run at [http://localhost:5001](http://localhost:5001).

---

## Using the App

- Open [http://localhost:3000](http://localhost:3000) in your browser.
- Use the product catalog, category filters, price filter, and the Smart Search bar for AI-powered product search.
- Ensure the backend proxy is running for Smart Search to work.

---

**NOTE !!!**  
You must provide your own OpenAI API key with available quota in `backend-proxy.js` for Smart Search to function.

- **Smart Product Search (NLP):**  
  The app uses OpenAI's GPT model to enable natural language product search. Users can type queries like "Show me clothing under $100" and the AI will return relevant products from the catalog.

**TOOLS USED**
- **Backend Proxy:**  
  - Node.js  
  - Express  
  - cors  
  - node-fetch
- **AI:**  
  - OpenAI GPT-3.5-turbo API (via backend proxy)

## Notable Assumptions

- The product catalog is static and stored in the frontend as a JSON array.
- The OpenAI API key is kept secret in the backend proxy and **never exposed to the frontend**.
- The AI Smart Search feature assumes the OpenAI API key used has sufficient quota and access to the GPT-3.5-turbo model.
- The backend proxy only exposes a single `/openai` POST endpoint for forwarding requests to OpenAI.

## REATE backend file (backend-proxy.js) to use with your open API key##

const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");
const app = express();
app.use(cors());
app.use(express.json());

app.post("/openai", async (req, res) => {
  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer ADD_YOUR_KEY_HERE"
      },
      body: JSON.stringify(req.body),
    });
    const data = await response.json();
    console.log("OpenAI response:", data); 
    if (!response.ok) {
      return res.status(response.status).json(data);
    }
    res.json(data);
  } catch (err) {
    console.error("Proxy error:", err); 
    res.status(500).json({ error: err.message });
  }
});

app.listen(5001, () => console.log("Proxy running on port 5001"));

## Run commands bellow##
npm install express cors node-fetch@2
node backend-proxy.js (it should run in localhost 5001 or any other that is awailable on your local mashine)
