import { GoogleGenAI, Type } from "@google/genai";
import { Staff } from '../types';

// Load API key from Vite env (browser-safe). Must be prefixed with VITE_
const apiKey: string | undefined = (import.meta as any).env?.VITE_GENAI_API_KEY;
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export async function suggestAssignee(taskDescription: string, staffList: Staff[]): Promise<number | null> {
    // Fix: Removed check for process.env.API_KEY as per guidelines.
    if (!taskDescription || staffList.length === 0) {
        return null;
    }

    // Gracefully skip AI suggestion if API key is missing
    if (!ai) {
        console.warn("Gemini API key missing (VITE_GENAI_API_KEY). Skipping AI suggestion.");
        return null;
    }

    const formattedStaffList = staffList
        .filter(s => s.isActive)
        .map(staff => `- ID: ${staff.id}, Name: ${staff.name}, Role: ${staff.role}, Skills: ${staff.skills.join(', ')}`)
        .join('\n');

    const prompt = `
        Based on the following task description and the list of available staff members, recommend the most suitable person to be assigned to the task.
        Consider the staff member's role and skills to find the best match.

        Task Description: "${taskDescription}"

        Available Staff:
        ${formattedStaffList}

        Please respond with only the JSON object containing the ID of the most suitable staff member.
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        suggestedAssigneeId: {
                            type: Type.NUMBER,
                            description: "The ID of the suggested staff member."
                        }
                    },
                    required: ["suggestedAssigneeId"],
                },
            },
        });

        const jsonString = response.text.trim();
        const result = JSON.parse(jsonString);
        
        if (result && typeof result.suggestedAssigneeId === 'number') {
            return result.suggestedAssigneeId;
        }

        return null;

    } catch (error) {
        console.error("Error suggesting assignee:", error);
        alert("Failed to get suggestion from AI. Please check the console for more details.");
        return null;
    }
}