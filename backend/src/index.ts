import fastify from 'fastify';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import cookie from '@fastify/cookie';
import { optimizationRoutes } from './routes/optimization';
import { authRoutes } from './routes/auth';

const server = fastify({
  logger: {
    level: 'debug',
    transport: {
      target: 'pino-pretty',
      options: {
        translateTime: 'HH:MM:ss Z',
        ignore: 'pid,hostname',
      },
    },
  },
});

async function bootstrap() {
  try {
    console.log('Starting server initialization...');

    // Register CORS
    console.log('Configuring CORS...');
    await server.register(cors, {
      origin: true,
      credentials: true,
    });
    console.log('CORS configured successfully');

    // Register JWT
    console.log('Configuring JWT...');
    await server.register(jwt, {
      secret: process.env.JWT_SECRET || 'your-super-secret-key-change-in-production',
      sign: {
        expiresIn: '7d',
      },
    });
    console.log('JWT configured successfully');

    // Register cookie parser
    console.log('Configuring cookie parser...');
    await server.register(cookie, {
      secret: process.env.COOKIE_SECRET || 'your-super-secret-cookie-key-change-in-production',
      parseOptions: {},
    });
    console.log('Cookie parser configured successfully');

    // Register routes
    console.log('Registering routes...');
    await server.register(authRoutes, { prefix: '/api/v1' });
    await server.register(optimizationRoutes, { prefix: '/api/v1' });
    console.log('Routes registered successfully');

    // Root endpoint
    server.get('/', async (request, reply) => {
      // Set content type to HTML with charset
      reply.type('text/html; charset=utf-8');
      
      return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Blinn API Documentation</title>
          <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap">
          <style>
            :root {
              --primary: #4f46e5;
              --primary-light: #6366f1;
              --success: #059669;
              --success-light: #10b981;
              --bg: #f8fafc;
              --text: #1e293b;
              --text-light: #64748b;
              --border: #e2e8f0;
            }

            * {
              box-sizing: border-box;
              margin: 0;
              padding: 0;
            }
            
            @keyframes fadeIn {
              from { opacity: 0; transform: translateY(20px); }
              to { opacity: 1; transform: translateY(0); }
            }

            @keyframes slideIn {
              from { transform: translateX(-20px); opacity: 0; }
              to { transform: translateX(0); opacity: 1; }
            }

            @keyframes pulse {
              0% { transform: scale(1); }
              50% { transform: scale(1.05); }
              100% { transform: scale(1); }
            }

            @keyframes gradientBG {
              0% { background-position: 0% 50%; }
              50% { background-position: 100% 50%; }
              100% { background-position: 0% 50%; }
            }
            
            body {
              font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
              line-height: 1.6;
              color: var(--text);
              background: var(--bg);
              padding: 2rem;
              min-height: 100vh;
              background: linear-gradient(135deg, #f6f7ff 0%, #f0f9ff 100%);
              background-size: 400% 400%;
              animation: gradientBG 15s ease infinite;
            }

            .container {
              max-width: 800px;
              margin: 0 auto;
              background: white;
              padding: 2.5rem;
              border-radius: 16px;
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05),
                         0 10px 15px -3px rgba(0, 0, 0, 0.1);
              animation: fadeIn 0.6s ease-out;
              position: relative;
              overflow: hidden;
            }

            .container::before {
              content: '';
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              height: 4px;
              background: linear-gradient(90deg, var(--primary) 0%, var(--primary-light) 100%);
            }

            h1 {
              font-size: 2.5rem;
              font-weight: 600;
              color: var(--text);
              margin-bottom: 1rem;
              display: flex;
              align-items: center;
              gap: 0.75rem;
              animation: slideIn 0.6s ease-out;
            }

            .logo {
              animation: pulse 2s infinite;
            }

            h2 {
              font-size: 1.5rem;
              font-weight: 500;
              color: var(--text);
              margin: 2rem 0 1rem;
              padding-bottom: 0.5rem;
              border-bottom: 2px solid var(--border);
              animation: slideIn 0.6s ease-out;
            }

            .intro {
              font-size: 1.1rem;
              color: var(--text-light);
              margin-bottom: 2rem;
              animation: fadeIn 0.6s ease-out 0.2s backwards;
            }

            .endpoint {
              background: var(--bg);
              padding: 1.5rem;
              border-radius: 12px;
              margin: 1.5rem 0;
              border: 1px solid var(--border);
              transition: transform 0.2s ease, box-shadow 0.2s ease;
              animation: fadeIn 0.6s ease-out 0.4s backwards;
              cursor: pointer;
            }

            .endpoint:hover {
              transform: translateY(-2px);
              box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
            }

            .method {
              display: inline-block;
              padding: 0.25rem 0.75rem;
              border-radius: 6px;
              font-weight: 500;
              font-size: 0.875rem;
              margin-right: 0.75rem;
              text-transform: uppercase;
              transition: transform 0.2s ease;
            }

            .method:hover {
              transform: scale(1.05);
            }

            .get {
              background: #ebf8ff;
              color: #2b6cb0;
              border: 1px solid #bee3f8;
            }

            .post {
              background: #f0fff4;
              color: #2f855a;
              border: 1px solid #c6f6d5;
            }

            .endpoint-path {
              font-family: 'SF Mono', 'Fira Code', Consolas, monospace;
              font-size: 0.9rem;
              color: var(--text);
              padding: 0.25rem 0.5rem;
              background: rgba(0, 0, 0, 0.05);
              border-radius: 4px;
              transition: background-color 0.2s ease;
            }

            .endpoint-path:hover {
              background: rgba(0, 0, 0, 0.1);
            }

            .endpoint-description {
              margin: 0.75rem 0;
              color: var(--text-light);
            }

            pre {
              background: #1a1a1a;
              color: #e2e8f0;
              padding: 1rem;
              border-radius: 8px;
              overflow-x: auto;
              margin: 1rem 0;
              position: relative;
            }

            .copy-button {
              position: absolute;
              top: 0.5rem;
              right: 0.5rem;
              background: rgba(255, 255, 255, 0.1);
              border: none;
              color: #fff;
              padding: 0.25rem 0.5rem;
              border-radius: 4px;
              font-size: 0.75rem;
              cursor: pointer;
              transition: background-color 0.2s ease;
              opacity: 0;
            }

            pre:hover .copy-button {
              opacity: 1;
            }

            .copy-button:hover {
              background: rgba(255, 255, 255, 0.2);
            }

            code {
              font-family: 'SF Mono', 'Fira Code', Consolas, monospace;
              font-size: 0.875rem;
            }

            .try-it {
              margin-top: 2rem;
              padding-top: 1.5rem;
              border-top: 2px solid var(--border);
              animation: fadeIn 0.6s ease-out 0.6s backwards;
            }

            .try-it h2 {
              border-bottom: none;
              margin-top: 0;
            }

            .try-it p {
              margin-bottom: 1rem;
              color: var(--text-light);
            }

            @media (max-width: 640px) {
              body {
                padding: 1rem;
              }
              
              .container {
                padding: 1.5rem;
              }
              
              h1 {
                font-size: 2rem;
              }
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>
              <svg class="logo" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <circle cx="12" cy="12" r="6"></circle>
                <circle cx="12" cy="12" r="2"></circle>
              </svg>
              Blinn API Documentation
            </h1>
            <p class="intro">Welcome to the Blinn credit card rewards optimization API. This service helps users maximize their credit card rewards based on spending patterns.</p>
            
            <h2>Available Endpoints</h2>
            
            <div class="endpoint">
              <span class="method get">GET</span>
              <span class="endpoint-path">/health</span>
              <p class="endpoint-description">Health check endpoint to verify API status.</p>
              <strong>Response:</strong>
              <pre><code>{
  "status": "ok"
}</code><button class="copy-button" onclick="copyToClipboard(this)">Copy</button></pre>
            </div>

            <div class="endpoint">
              <span class="method post">POST</span>
              <span class="endpoint-path">/api/v1/optimize</span>
              <p class="endpoint-description">Optimize credit card rewards based on spending patterns.</p>
              <strong>Request Body:</strong>
              <pre><code>{
  "categories": [
    {
      "name": "Dining",
      "amount": 500,
      "frequency": "monthly"
    },
    {
      "name": "Travel",
      "amount": 5000,
      "frequency": "annual"
    }
  ]
}</code><button class="copy-button" onclick="copyToClipboard(this)">Copy</button></pre>
            </div>

            <div class="try-it">
              <h2>Try it out</h2>
              <p>You can test the optimization endpoint using curl:</p>
              <pre><code>curl -X POST \\
  -H "Content-Type: application/json" \\
  -d '{"categories":[{"name":"Dining","amount":500,"frequency":"monthly"},{"name":"Travel","amount":5000,"frequency":"annual"}]}' \\
  http://localhost:3000/api/v1/optimize</code><button class="copy-button" onclick="copyToClipboard(this)">Copy</button></pre>
            </div>
          </div>

          <script>
            function copyToClipboard(button) {
              const pre = button.parentElement;
              const code = pre.querySelector('code');
              const text = code.textContent;
              
              navigator.clipboard.writeText(text).then(() => {
                button.textContent = 'Copied!';
                setTimeout(() => {
                  button.textContent = 'Copy';
                }, 2000);
              });
            }

            // Add animation on scroll
            const observer = new IntersectionObserver((entries) => {
              entries.forEach(entry => {
                if (entry.isIntersecting) {
                  entry.target.style.opacity = '1';
                  entry.target.style.transform = 'translateY(0)';
                }
              });
            }, { threshold: 0.1 });

            document.querySelectorAll('.endpoint, .try-it').forEach(el => {
              observer.observe(el);
            });
          </script>
        </body>
        </html>
      `;
    });

    // Health check endpoint
    server.get('/health', async () => {
      return { status: 'ok' };
    });

    // Start the server
    console.log('Starting server...');
    const address = await server.listen({
      port: 3000,
      host: '127.0.0.1', // Explicitly bind to localhost
    });
    console.log(`Server is running on ${address}`);
  } catch (err) {
    console.error('Error starting server:', err);
    server.log.error(err);
    process.exit(1);
  }
}

// Start the server
bootstrap(); 