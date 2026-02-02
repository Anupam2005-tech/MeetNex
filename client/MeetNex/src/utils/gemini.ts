export async function GoogleGemini(prompt: string): Promise<string> {
    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/gemini/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ prompt }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        if (!data.text) {
            return "I received a response but couldn't extract the text. Please try again.";
        }

        return data.text;
    }
    catch (error: any) {
        // Provide specific error messages based on error type
        if (error?.message?.includes("401") || error?.message?.includes("Authentication")) {
            return "Authentication error: Unable to verify your identity. Please try logging in again.";
        }
        
        if (error?.message?.includes("429") || error?.message?.includes("Rate limit")) {
            return "Rate limit exceeded: Too many requests. Please try again in a moment.";
        }
        
        if (error?.message?.includes("404") || error?.message?.includes("not found")) {
            return "Service unavailable: The AI service is temporarily unavailable. Please try again later.";
        }
        
        if (error?.message?.includes("fetch") || error?.message?.includes("network")) {
            return "Network error: Unable to reach the server. Please check your internet connection.";
        }

        return `Sorry, I'm having trouble connecting right now. Please try again.`;
    }
}
