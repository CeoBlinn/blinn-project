import { FastifyInstance } from 'fastify';

export async function legalRoutes(fastify: FastifyInstance) {
  fastify.get('/privacy-policy', async (request, reply) => {
    reply.type('text/html; charset=utf-8');
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Privacy Policy - Blinn</title>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap">
        <style>
          :root {
            --primary: #4f46e5;
            --text: #1e293b;
            --text-light: #64748b;
            --bg: #f8fafc;
          }

          * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
          }

          body {
            font-family: 'Inter', sans-serif;
            line-height: 1.6;
            color: var(--text);
            background: var(--bg);
            padding: 2rem;
          }

          .container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            padding: 2.5rem;
            border-radius: 16px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
          }

          h1 {
            font-size: 2.5rem;
            font-weight: 600;
            color: var(--primary);
            margin-bottom: 2rem;
          }

          h2 {
            font-size: 1.5rem;
            font-weight: 500;
            color: var(--text);
            margin: 2rem 0 1rem;
          }

          p {
            margin-bottom: 1rem;
            color: var(--text-light);
          }

          ul {
            margin-bottom: 1rem;
            padding-left: 2rem;
            color: var(--text-light);
          }

          .last-updated {
            font-size: 0.875rem;
            color: var(--text-light);
            margin-top: 2rem;
            padding-top: 1rem;
            border-top: 1px solid #e2e8f0;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Privacy Policy</h1>
          
          <p>Welcome to Blinn. We are committed to protecting your privacy and ensuring you have a positive experience on our platform.</p>

          <h2>1. Information We Collect</h2>
          <p>We collect the following types of information:</p>
          <ul>
            <li>Account information (email, name)</li>
            <li>Credit card information (card names, rewards structures)</li>
            <li>Spending patterns and categories</li>
            <li>Usage data and analytics</li>
          </ul>

          <h2>2. How We Use Your Information</h2>
          <p>We use your information to:</p>
          <ul>
            <li>Provide credit card rewards optimization services</li>
            <li>Improve our services and user experience</li>
            <li>Send important updates and notifications</li>
            <li>Ensure platform security</li>
          </ul>

          <h2>3. Data Security</h2>
          <p>We implement industry-standard security measures to protect your data:</p>
          <ul>
            <li>Encryption of sensitive data</li>
            <li>Secure authentication mechanisms</li>
            <li>Regular security audits</li>
            <li>Limited employee access to user data</li>
          </ul>

          <h2>4. Data Sharing</h2>
          <p>We do not sell your personal information. We may share data with:</p>
          <ul>
            <li>Service providers who assist in platform operations</li>
            <li>Law enforcement when required by law</li>
          </ul>

          <h2>5. Your Rights</h2>
          <p>You have the right to:</p>
          <ul>
            <li>Access your personal data</li>
            <li>Request data correction or deletion</li>
            <li>Opt-out of marketing communications</li>
            <li>Export your data</li>
          </ul>

          <h2>6. Contact Us</h2>
          <p>If you have questions about this privacy policy or our practices, please contact us at:</p>
          <p>Email: privacy@blinn.app</p>

          <p class="last-updated">Last Updated: February 2024</p>
        </div>
      </body>
      </html>
    `;
  });
} 