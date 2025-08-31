import type { AIGenerationRequest, AIGenerationResponse } from '@/types';

// OpenRouter configuration (custom endpoint - no API key required)
const OPENROUTER_CONFIG = {
  apiUrl: process.env.OPENROUTER_API_URL || 'https://oi-server.onrender.com/chat/completions',
  customerId: process.env.OPENROUTER_CUSTOMER_ID || 'elon.dd@gmail.com',
  authorization: process.env.OPENROUTER_AUTH || 'Bearer xxx',
  defaultModel: 'openrouter/anthropic/claude-sonnet-4',
};

export class AIServiceError extends Error {
  constructor(message: string, public status: number = 500) {
    super(message);
    this.name = 'AIServiceError';
  }
}

// Scenario generation prompts and templates
const SCENARIO_GENERATION_PROMPTS = {
  system: `You are SimSuite AI, an expert network simulation scenario generator. Your task is to create realistic OPNET/MONET-style network simulation scenarios based on user requirements.

CRITICAL INSTRUCTIONS:
- Always respond with valid JSON only, no additional text or explanations
- Create realistic network topologies with proper positioning
- Include appropriate node types, configurations, and traffic patterns
- Ensure all coordinates are realistic (latitude/longitude for geographic scenarios)
- Add meaningful network configurations (IP addresses, subnets, protocols)
- Create diverse traffic profiles that simulate real-world scenarios

Response Format:
{
  "name": "Scenario Name",
  "description": "Detailed scenario description",
  "nodes": [
    {
      "name": "Node Name",
      "type": "ROUTER|SWITCH|HOST|SERVER|GATEWAY|JAMMER|SENSOR|MOBILE",
      "position": {"x": 0, "y": 0, "z": 0, "lat": 0, "lon": 0, "alt": 0},
      "configuration": {
        "network": {
          "networkId": "net1",
          "ipAddress": "192.168.1.1",
          "subnetMask": "255.255.255.0",
          "protocol": "TCP/IP"
        },
        "radio": {
          "frequency": 2400,
          "power": 1.0,
          "range": 1000
        }
      }
    }
  ],
  "units": [
    {
      "name": "Unit Name",
      "type": "Mobile Unit",
      "position": {"x": 0, "y": 0, "z": 0, "lat": 0, "lon": 0, "alt": 0},
      "nodeCount": 3,
      "radioRange": 2000,
      "configuration": {
        "network": {"networkId": "unit-net1"},
        "movementPattern": "patrol"
      }
    }
  ],
  "networks": [
    {
      "networkId": "net1",
      "name": "Primary Network",
      "subnet": "192.168.1.0/24",
      "protocol": "TCP/IP"
    }
  ],
  "trafficProfiles": [
    {
      "name": "HTTP Traffic",
      "profileType": "HTTP",
      "configuration": {
        "bandwidth": 10,
        "protocol": "HTTP",
        "duration": 3600
      }
    }
  ]
}`,

  examples: [
    {
      user: "Create a military tactical communication scenario with 5 mobile units and a command center",
      assistant: `{
        "name": "Military Tactical Communication Network",
        "description": "A tactical military communication scenario featuring mobile units coordinating with a central command center",
        "nodes": [
          {
            "name": "Command Center",
            "type": "SERVER",
            "position": {"x": 0, "y": 0, "z": 50, "lat": 34.0522, "lon": -118.2437, "alt": 50},
            "configuration": {
              "network": {
                "networkId": "command-net",
                "ipAddress": "10.0.0.1",
                "subnetMask": "255.255.0.0",
                "protocol": "TCP/IP"
              },
              "radio": {
                "frequency": 3000,
                "power": 50.0,
                "range": 10000
              }
            }
          },
          {
            "name": "Relay Station Alpha",
            "type": "GATEWAY",
            "position": {"x": 2000, "y": 1500, "z": 30, "lat": 34.0622, "lon": -118.2337, "alt": 30},
            "configuration": {
              "network": {
                "networkId": "relay-net",
                "ipAddress": "10.0.1.1",
                "subnetMask": "255.255.0.0",
                "protocol": "TCP/IP"
              },
              "radio": {
                "frequency": 3000,
                "power": 25.0,
                "range": 5000
              }
            }
          }
        ],
        "units": [
          {
            "name": "Alpha Squad",
            "type": "Infantry Unit",
            "position": {"x": 3000, "y": 2000, "z": 0, "lat": 34.0722, "lon": -118.2237, "alt": 0},
            "nodeCount": 4,
            "radioRange": 1500,
            "configuration": {
              "network": {"networkId": "tactical-net"},
              "movementPattern": "patrol"
            }
          },
          {
            "name": "Bravo Squad",
            "type": "Armored Unit",
            "position": {"x": -2000, "y": 3000, "z": 0, "lat": 34.0422, "lon": -118.2537, "alt": 0},
            "nodeCount": 6,
            "radioRange": 2500,
            "configuration": {
              "network": {"networkId": "tactical-net"},
              "movementPattern": "advance"
            }
          }
        ],
        "networks": [
          {
            "networkId": "command-net",
            "name": "Command Network",
            "subnet": "10.0.0.0/16",
            "protocol": "TCP/IP"
          },
          {
            "networkId": "tactical-net",
            "name": "Tactical Network",
            "subnet": "10.1.0.0/16",
            "protocol": "TCP/IP"
          }
        ],
        "trafficProfiles": [
          {
            "name": "Command Data",
            "profileType": "DATA",
            "configuration": {
              "bandwidth": 5,
              "protocol": "TCP",
              "duration": 7200
            }
          },
          {
            "name": "Voice Communications",
            "profileType": "VOICE",
            "configuration": {
              "bandwidth": 64,
              "protocol": "UDP",
              "duration": 3600
            }
          }
        ]
      }`
    }
  ]
};

// Generate scenario using AI
export async function generateScenario(request: AIGenerationRequest): Promise<{
  scenario: any;
  confidence: number;
  generationTime: number;
}> {
  const startTime = Date.now();

  try {
    const { prompt, context, options } = request;
    const model = options?.model || OPENROUTER_CONFIG.defaultModel;

    // Build the context-aware prompt
    let contextPrompt = prompt;
    if (context) {
      contextPrompt += `\n\nAdditional Context:`;
      if (context.scenarioType) contextPrompt += `\n- Scenario Type: ${context.scenarioType}`;
      if (context.nodeCount) contextPrompt += `\n- Approximate Node Count: ${context.nodeCount}`;
      if (context.areaSize) contextPrompt += `\n- Area Size: ${context.areaSize}`;
      if (context.requirements?.length) {
        contextPrompt += `\n- Requirements: ${context.requirements.join(', ')}`;
      }
    }

    const response = await fetch(OPENROUTER_CONFIG.apiUrl, {
      method: 'POST',
      headers: {
        'customerId': OPENROUTER_CONFIG.customerId,
        'Content-Type': 'application/json',
        'Authorization': OPENROUTER_CONFIG.authorization,
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: SCENARIO_GENERATION_PROMPTS.system },
          { role: 'user', content: contextPrompt }
        ],
        temperature: options?.temperature || 0.7,
        max_tokens: options?.maxTokens || 4000,
      }),
    });

    if (!response.ok) {
      throw new AIServiceError(
        `AI service request failed: ${response.status} ${response.statusText}`,
        response.status
      );
    }

    const data = await response.json();
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new AIServiceError('Invalid response format from AI service');
    }

    const content = data.choices[0].message.content;
    let scenario;

    try {
      scenario = JSON.parse(content);
    } catch (parseError) {
      throw new AIServiceError('Failed to parse AI response as JSON');
    }

    // Validate the scenario structure
    if (!scenario.name || !scenario.description) {
      throw new AIServiceError('Generated scenario missing required fields');
    }

    const generationTime = Date.now() - startTime;
    const confidence = calculateConfidence(scenario, prompt);

    return {
      scenario,
      confidence,
      generationTime,
    };

  } catch (error) {
    if (error instanceof AIServiceError) {
      throw error;
    }
    throw new AIServiceError(`Scenario generation failed: ${error.message}`);
  }
}

// Calculate confidence score based on scenario completeness
function calculateConfidence(scenario: any, originalPrompt: string): number {
  let score = 0;
  const maxScore = 100;

  // Basic structure (30 points)
  if (scenario.name) score += 10;
  if (scenario.description && scenario.description.length > 20) score += 10;
  if (scenario.nodes && Array.isArray(scenario.nodes)) score += 10;

  // Node quality (25 points)
  if (scenario.nodes && scenario.nodes.length > 0) {
    score += 10;
    const validNodes = scenario.nodes.filter(node => 
      node.name && node.type && node.position && node.configuration
    );
    score += Math.min(15, (validNodes.length / scenario.nodes.length) * 15);
  }

  // Network configuration (20 points)
  if (scenario.networks && Array.isArray(scenario.networks) && scenario.networks.length > 0) {
    score += 20;
  }

  // Traffic profiles (15 points)
  if (scenario.trafficProfiles && Array.isArray(scenario.trafficProfiles) && scenario.trafficProfiles.length > 0) {
    score += 15;
  }

  // Units (10 points)
  if (scenario.units && Array.isArray(scenario.units) && scenario.units.length > 0) {
    score += 10;
  }

  return Math.min(maxScore, Math.max(0, score));
}

// Validate scenario structure
export function validateScenario(scenario: any): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!scenario.name || typeof scenario.name !== 'string') {
    errors.push('Scenario name is required and must be a string');
  }

  if (!scenario.description || typeof scenario.description !== 'string') {
    errors.push('Scenario description is required and must be a string');
  }

  if (!scenario.nodes || !Array.isArray(scenario.nodes)) {
    errors.push('Scenario must have a nodes array');
  } else {
    scenario.nodes.forEach((node: any, index: number) => {
      if (!node.name) errors.push(`Node ${index + 1}: name is required`);
      if (!node.type) errors.push(`Node ${index + 1}: type is required`);
      if (!node.position) errors.push(`Node ${index + 1}: position is required`);
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

// Test AI service connection
export async function testAIConnection(): Promise<boolean> {
  try {
    const response = await fetch(OPENROUTER_CONFIG.apiUrl, {
      method: 'POST',
      headers: {
        'customerId': OPENROUTER_CONFIG.customerId,
        'Content-Type': 'application/json',
        'Authorization': OPENROUTER_CONFIG.authorization,
      },
      body: JSON.stringify({
        model: OPENROUTER_CONFIG.defaultModel,
        messages: [{ role: 'user', content: 'Hello, this is a connection test.' }],
        max_tokens: 10,
      }),
    });

    return response.ok;
  } catch (error) {
    console.error('AI service connection test failed:', error);
    return false;
  }
}